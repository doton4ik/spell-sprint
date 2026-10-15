import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { noAutocorrect } from '../noAutocorrect'
import { Icon } from '../icons/Icon'
import { AnswerDiff } from '../practice/AnswerDiff'
import { isSentence } from '../../services/sentenceDiff'
import { SentenceDiff } from './SentenceDiff'
import { defaultPracticeSettings } from '../../data/practice'
import { levelPassages, skillInstructions, skillLabels, type LevelItem } from '../../data/levelCheckBank'
import { LevelLines } from './LevelLines'
import {
  clearRun,
  createCheck,
  QUICK_TOTAL,
  finishCheck,
  isCorrectAnswer,
  nextItem,
  recordCheckAnswer,
  saveRun,
  type CheckAnswer,
  type LevelCheckResult,
  type SavedRun,
} from '../../services/levelCheck'
import { loadPracticeSettings } from '../../services/practiceStorage'
import { canSpeak, speakEnglish, stopSpeaking } from '../../services/speech'
import { shuffled } from '../../services/spellingDistractors'

const MAX_PLAYS = 3

type Feedback = { correct: boolean; answer: string }

// One question per screen. A choice is picked with a click (or the keys 1–4), a typed answer is checked with
// Enter, and after an answer Enter goes on. The progress is saved after every answer, so a reload continues.
export function CheckRunner({
  resume,
  quick: startQuick = false,
  onQuit,
  onFinish,
}: {
  resume: SavedRun | null
  quick?: boolean
  onQuit: () => void
  onFinish: (result: LevelCheckResult) => void
}) {
  // A check that is continued is quick when its saved plan is as short as the quick one.
  const quick = resume ? resume.plan.length <= QUICK_TOTAL : startQuick
  const [{ bank, plan }] = useState(() => {
    const created = createCheck({ listening: canSpeak(), quick })
    return resume ? { bank: created.bank, plan: resume.plan } : created
  })
  const [answers, setAnswers] = useState<CheckAnswer[]>(resume?.answers ?? [])
  const [item, setItem] = useState<LevelItem | null>(() => nextItem(bank, plan[resume?.answers.length ?? 0], resume?.answers ?? [], quick))
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [plays, setPlays] = useState(0)
  const nextRef = useRef<HTMLButtonElement>(null)
  const total = plan.length
  const step = answers.length + (feedback ? 0 : 1)
  const kind = item?.kind ?? 'type'
  const passage = item?.passage ? levelPassages.find((entry) => entry.id === item.passage) : undefined
  // The options are shuffled once per question, so the right one is not always in the same place.
  const options = useMemo(() => (item?.kind === 'choice' ? shuffled(item.choices ?? []) : []), [item])

  useEffect(() => {
    if (feedback) nextRef.current?.focus()
  }, [feedback])

  function submit(given: string, giveUp = false) {
    if (!item || feedback || (!giveUp && !given.trim())) return
    const answer = giveUp ? '' : given
    const correct = !giveUp && isCorrectAnswer(item, answer)
    recordCheckAnswer(item, answer, correct)
    const entry: CheckAnswer = {
      itemId: item.id,
      skill: item.skill,
      level: item.level,
      correct,
      answer,
      expected: item.answer.split('|')[0],
      prompt: item.prompt,
      wordId: item.wordId,
      kind: item.kind ?? 'type',
      options: item.kind === 'choice' ? item.choices?.length : undefined,
    }
    const done = [...answers, entry]
    setAnswers(done)
    saveRun(plan, done)
    setFeedback({ correct, answer })
  }

  // The keys 1–4 pick an option, like a click.
  useEffect(() => {
    if (kind !== 'choice' || feedback) return
    const onKey = (event: KeyboardEvent) => {
      const number = Number(event.key)
      if (number >= 1 && number <= options.length && !(event.target instanceof HTMLInputElement)) submit(options[number - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function next() {
    const upcoming = answers.length >= plan.length ? null : nextItem(bank, plan[answers.length], answers, quick)
    if (!upcoming) {
      clearRun()
      onFinish(finishCheck(answers))
      return
    }
    setItem(upcoming)
    setInput('')
    setFeedback(null)
    setPlays(0)
  }

  // Leaving a question (the next one, or the page) stops a sentence that is still being read.
  const itemId = item?.id
  useEffect(() => stopSpeaking, [itemId])

  function listen(slow: boolean) {
    if (!item || plays >= MAX_PLAYS) return
    speakEnglish(item.prompt, loadPracticeSettings(defaultPracticeSettings).speechLocale, slow ? 0.7 : 1)
    setPlays(plays + 1)
  }

  if (!item) return null
  return (
    <div className="level-page level-page--running" id="level-check">
      <div className="level-run__top">
        <span>
          Question {Math.min(step, total)} of {total}
        </span>
        <button
          className="quiet-action"
          type="button"
          onClick={() => {
            if (window.confirm('Stop the check? Your progress is kept, so you can continue later.')) onQuit()
          }}
        >
          Stop
        </button>
      </div>
      <div className="level-run__track">
        <i style={{ width: `${(answers.length / total) * 100}%` }} />
      </div>

      {passage ? (
        <article className="level-passage">
          <h3>{passage.title}</h3>
          <p>
            <LevelLines text={passage.text} />
          </p>
        </article>
      ) : null}

      {item.stimulus ? (
        <article className="level-passage level-passage--short" aria-label="Text">
          <p>
            <LevelLines text={item.stimulus} />
          </p>
        </article>
      ) : null}

      <section className="level-question">
        <span className="level-question__skill">{skillLabels[item.skill]}</span>
        <p className="level-question__hint">{item.instruction ?? skillInstructions[item.skill]}</p>

        {kind === 'dictation' ? (
          <div className="level-listen">
            <button className="check-button" type="button" onClick={() => listen(false)} disabled={plays >= MAX_PLAYS}>
              <Icon name="volume" size={18} /> Listen
            </button>
            <button className="outline-action" type="button" onClick={() => listen(true)} disabled={plays >= MAX_PLAYS}>
              Slowly
            </button>
            <small>{MAX_PLAYS - plays} plays left</small>
          </div>
        ) : (
          <h2
            className={
              item.skill === 'grammar' || kind === 'choice'
                ? 'level-question__prompt level-question__prompt--sentence'
                : 'level-question__prompt'
            }
          >
            <LevelLines text={item.prompt} />
          </h2>
        )}

        {kind === 'choice' ? (
          <div className="level-choices" role="group" aria-label="Answers">
            {options.map((option, index) => {
              const state = !feedback
                ? ''
                : option === item.answer
                  ? ' level-choice--right'
                  : option === feedback.answer
                    ? ' level-choice--wrong'
                    : ''
              return (
                <button
                  className={`level-choice${state}`}
                  type="button"
                  disabled={Boolean(feedback)}
                  onClick={() => submit(option)}
                  key={option}
                >
                  <kbd>{index + 1}</kbd>
                  {option}
                </button>
              )
            })}
          </div>
        ) : (
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault()
              submit(input)
            }}
          >
            <input
              {...noAutocorrect}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                kind === 'dictation' ? 'Type what you hear…' : item.skill === 'grammar' ? 'Write the answer…' : 'Type your answer…'
              }
              disabled={Boolean(feedback)}
              autoFocus
              key={item.id}
            />
            {!feedback ? (
              <div className="level-actions">
                <button className="quiet-button" type="button" onClick={() => submit('', true)}>
                  I don’t know
                </button>
                <button className="check-button" type="submit" disabled={!input.trim()}>
                  <Icon name="check" size={16} /> Check
                </button>
              </div>
            ) : null}
          </form>
        )}

        {feedback ? (
          <div className={`level-feedback level-feedback--${feedback.correct ? 'correct' : 'incorrect'}`} role="status">
            <div>
              <strong>{feedback.correct ? 'Correct' : feedback.answer || kind === 'choice' ? 'Not quite' : 'Here is the answer'}</strong>
              {!feedback.correct ? (
                <div className="level-feedback__diff">
                  {kind === 'choice' ? (
                    <b>{item.answer}</b>
                  ) : feedback.answer && isSentence(item.answer.split('|')[0]) ? (
                    <SentenceDiff expected={item.answer.split('|')[0]} submitted={feedback.answer} />
                  ) : feedback.answer ? (
                    <AnswerDiff expected={item.answer.split('|')[0]} submitted={feedback.answer} />
                  ) : (
                    <b>{item.answer.split('|')[0]}</b>
                  )}
                </div>
              ) : null}
              {!feedback.correct && item.explain ? <small className="level-feedback__explain">{item.explain}</small> : null}
            </div>
            <button className="check-button" type="button" onClick={next} ref={nextRef}>
              {answers.length >= total ? 'See my level' : 'Next'} <Icon name="arrow" size={16} />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
