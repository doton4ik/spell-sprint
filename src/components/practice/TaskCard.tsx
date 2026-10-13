import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { noAutocorrect } from '../noAutocorrect'
import type { CheckResult, PracticeTask } from '../../types/practice'
import { Icon } from '../icons/Icon'
import { MistakeBreakdown } from './MistakeBreakdown'
import { WordTip } from './WordTip'
import { acceptedAnswers, closestAnswer, comparable } from '../../services/answerMatch'
import { shuffled } from '../../services/spellingDistractors'
import { WordReportPanel } from '../WordReportPanel'
import { RuleChallenge } from '../rules/RuleChallenge'
import type { Rule } from '../../types/rules'
import type { WordReason } from '../../services/dailyPlan'

type TaskCardProps = {
  task: PracticeTask
  answer: string
  result: CheckResult
  attemptsOnTask: number
  answerRevealed: boolean
  hintStep: number
  allowSkip: boolean
  showRuleAfterMistake: boolean
  onAnswerChange: (value: string) => void
  onCheck: () => void
  onShowAnswer: () => void
  onHint: () => void
  onPlayAudio: () => void
  audioUsed?: boolean
  onSkip: () => void
  onNext: () => void
  onRepeatLater: () => void
  audioMessage?: string
  reason?: WordReason
  otherMeaning?: { word: string; translation: string } | null
  onHideWord?: () => void
  reportable?: { wordId: string; word: string; translation?: string; library?: string } | null
  onReported?: (hide: boolean) => void
  pack?: { name: string; onTurnOff: () => void } | null
  onMeet?: (typed: string) => void
  onClaimCorrect?: () => void
}

const labels = {
  'write-en': 'Write in English',
  'listen-write': 'Listen and write',
  'translate-ru': 'Translate to Russian',
  'choose-spelling': 'Choose correct spelling',
  'fill-gap': 'Fill the gap',
}
function hintFor(answer: string, step: number) {
  const words = answer.split(/\s+/)
  if (step === 1) return `First letter: ${words.map((word) => word[0]).join(' ')}`
  if (step === 2)
    return words.length === 1
      ? `${words[0].length} letters`
      : `${words.length} words: ${words.map((word) => word.length).join(', ')} letters`
  if (step === 3) return `Pattern: ${words.map((word) => `${word[0]}${'·'.repeat(Math.max(word.length - 2, 0))}${word.at(-1)}`).join(' ')}`
  if (step === 4) return 'Pronunciation is ready — press Listen.'
  return `Answer: ${answer}`
}

export function TaskCard({
  task,
  answer,
  result,
  answerRevealed,
  hintStep,
  allowSkip,
  showRuleAfterMistake,
  onAnswerChange,
  onCheck,
  onShowAnswer,
  onHint,
  onPlayAudio,
  audioUsed,
  onSkip,
  onNext,
  onRepeatLater,
  audioMessage,
  reason,
  otherMeaning,
  onHideWord,
  reportable,
  onReported,
  pack,
  onMeet,
  onClaimCorrect,
}: TaskCardProps) {
  // The Russian meaning: the prompt, or the note under a Fill-the-gap sentence.
  const meaning = task.promptNote ?? task.prompt
  const mode =
    task.mode ?? (task.type === 'translate-en-ru' ? 'translate-ru' : task.type === 'translate-ru-en' ? 'write-en' : 'choose-spelling')
  const revealed = answerRevealed || result !== 'idle' || hintStep >= 5
  const correct = result === 'correct'
  // The answer that was actually checked: editing the box for a retry must not change the feedback above it.
  const [checkedAnswer, setCheckedAnswer] = useState('')
  // Rule challenge opened from the mistake breakdown; cleared when the next task appears.
  const [challengeRules, setChallengeRules] = useState<Rule[] | null>(null)
  const [reporting, setReporting] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  // A new word goes straight to the test. "I don't know this word" (next to Hint) opens the teaching
  // screen instead: see it, hear it, type it once, and it comes back tomorrow.
  const canMeet = Boolean(
    onMeet && task.wordId && reason?.kind === 'new' && (mode === 'write-en' || mode === 'listen-write' || mode === 'fill-gap'),
  )
  const [meetFor, setMeetFor] = useState<string | null>(null) // "I don't know this word" pressed for this task
  const meeting = canMeet && meetFor === task.id
  const [copy, setCopy] = useState('')
  const [copyWrong, setCopyWrong] = useState(false)
  useEffect(() => {
    setChallengeRules(null)
    setReporting(false)
    setMoreOpen(false)
    setCopy('')
    setCopyWrong(false)
  }, [task.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const isDefaultRule = /^Review .+ in the .+ topic.$/.test(task.rule)
  const spellingTask = mode !== 'translate-ru' && task.type !== 'correct-sentence'
  // A new random order for every task, kept while the task is on screen.
  const choices = useMemo(() => shuffled(task.choices ?? [task.answer]), [task.id]) // eslint-disable-line react-hooks/exhaustive-deps
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCheckedAnswer(answer)
    onCheck()
  }
  // Enter after an answer has been checked starts the next word. Typing a different answer first and
  // pressing Enter still checks that new answer, and Enter inside other fields (a tip, a report) is theirs.
  useEffect(() => {
    if (result === 'idle') return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.isComposing || event.repeat) return
      const target = event.target as HTMLElement | null
      const onAnswer = target instanceof HTMLInputElement && target.id === 'practice-answer'
      const free = target === document.body || target === null
      if (!(free || (onAnswer && answer === checkedAnswer))) return
      event.preventDefault()
      onNext()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [result, answer, checkedAnswer, onNext])
  // Several answers can be right: show the one the learner aimed at, and the others as "Also correct".
  const target = checkedAnswer.trim() ? closestAnswer(checkedAnswer, task) : task.answer
  const others = acceptedAnswers(task).filter((option) => comparable(option) !== comparable(target))
  if (meeting && onMeet)
    return (
      <article className="task-card">
        <div className="task-card__meta">
          <span className="task-card__labels">
            <span className="task-reason task-reason--new">New word</span>
          </span>
          <span>
            {task.topic}
            {task.subtopic && task.subtopic !== task.topic ? ` · ${task.subtopic}` : ''} <i /> {task.level}
          </span>
        </div>
        <h2>Meet the word first.</h2>
        <div className="meet-word">
          <p className="meet-word__word" lang="en">
            {task.answer}
          </p>
          <p className="meet-word__meaning">{meaning}</p>
          {others.length ? <p className="meet-word__also">Also correct: {others.join(', ')}</p> : null}
          {task.example ? (
            <p className="meet-word__example" lang="en">
              {task.example}
            </p>
          ) : null}
          {task.rule && !isDefaultRule ? (
            <p className="related-rule">
              <Icon name="lightbulb" size={16} /> {task.rule}
            </p>
          ) : null}
          <button className="quiet-button" type="button" onClick={onPlayAudio}>
            <Icon name="volume" size={17} /> Listen
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!copy.trim()) return
            if (acceptedAnswers(task).some((option) => comparable(option) === comparable(copy))) onMeet(copy)
            else setCopyWrong(true)
          }}
        >
          <label className="answer-label" htmlFor="meet-answer">
            Type it once to remember it
          </label>
          <input
            {...noAutocorrect}
            id="meet-answer"
            autoFocus
            value={copy}
            onChange={(event) => {
              setCopy(event.target.value)
              setCopyWrong(false)
            }}
            placeholder="Type the word…"
          />
          {copyWrong ? (
            <p className="meet-word__retry" role="status">
              Not the same yet — look at the word above and try again.
            </p>
          ) : null}
          <div className="task-actions">
            <button className="check-button" type="submit" disabled={!copy.trim()}>
              <Icon name="check" size={18} /> Got it
            </button>
            <div className="task-actions__secondary">
              <button className="quiet-button" type="button" onClick={() => setMeetFor(null)}>
                I know it — test me
              </button>
            </div>
          </div>
          <p className="meet-word__note">
            Not a test: it will not count as a mistake. The word comes back tomorrow to check you remember it.
          </p>
        </form>
      </article>
    )
  return (
    <article className="task-card">
      {pack ? (
        <p className="task-pack">
          From the add-on pack <strong>{pack.name}</strong>. Not for you?{' '}
          <button type="button" onClick={pack.onTurnOff}>
            Turn off this pack
          </button>
        </p>
      ) : null}
      <div className="task-card__meta">
        <span className="task-card__labels">
          <span className="task-type">
            <Icon name="shuffle" size={14} /> {labels[mode]}
          </span>
          {reason ? (
            <span className={`task-reason task-reason--${reason.kind}`} title="Why this word is in your session">
              {reason.text}
            </span>
          ) : null}
        </span>
        <span>
          {task.topic}
          {task.subtopic && task.subtopic !== task.topic ? ` · ${task.subtopic}` : ''} <i /> {task.level}
        </span>
      </div>
      <h2>
        {mode === 'translate-ru'
          ? 'Translate to Russian.'
          : mode === 'choose-spelling'
            ? 'Choose the correct English spelling.'
            : mode === 'fill-gap'
              ? 'Fill the gap with the English word.'
              : 'Write the English word or expression.'}
      </h2>
      {mode === 'listen-write' ? (
        <div className="task-prompt">
          <span className="prompt-label">Listen</span>
          <button className="dictation-play" type="button" onClick={onPlayAudio}>
            <Icon name="volume" size={22} />
            <span>
              <strong>Play the word again</strong>
              <small>Listen, then type what you hear.</small>
            </span>
          </button>
        </div>
      ) : (
        <div className={`task-prompt task-prompt--${mode}`}>
          <span className="prompt-label">{mode === 'translate-ru' ? 'English' : mode === 'fill-gap' ? 'Sentence' : 'Russian'}</span>
          <p lang={mode === 'fill-gap' ? 'en' : undefined}>{task.prompt}</p>
          {task.promptNote ? <small className="task-prompt__note">{task.promptNote}</small> : null}
        </div>
      )}
      {hintStep ? (
        <div className="hint-box">
          <Icon name="lightbulb" size={17} />
          <span>
            <strong>Hint {hintStep}/5</strong>
            {hintFor(task.answer, hintStep)}
          </span>
        </div>
      ) : null}
      <form onSubmit={submit}>
        {mode === 'choose-spelling' ? (
          <div className="spelling-choices">
            {choices.map((choice) => (
              <button
                type="button"
                className={answer === choice ? 'spelling-choice spelling-choice--selected' : 'spelling-choice'}
                onClick={() => onAnswerChange(choice)}
                key={choice}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <>
            <label className="answer-label" htmlFor="practice-answer">
              Your answer
            </label>
            <input
              {...noAutocorrect}
              id="practice-answer"
              autoFocus
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder={mode === 'translate-ru' ? 'Введите перевод…' : 'Type your answer…'}
              disabled={correct}
            />
          </>
        )}
        {otherMeaning && result === 'idle' ? (
          <div className="other-meaning" role="status">
            <Icon name="lightbulb" size={17} />
            <span>
              <strong>
                “{otherMeaning.word}” is also “{otherMeaning.translation}” — a different meaning.
              </strong>
              <small>Here we need another word for “{task.prompt}”. Not counted as a mistake — try again.</small>
            </span>
          </div>
        ) : null}
        {result !== 'idle' ? (
          <div className={`task-feedback task-feedback--${correct ? 'correct' : 'incorrect'}`} role="status">
            <p className="task-feedback__title">
              <Icon name={correct ? 'check' : 'refresh'} size={17} />
              {correct ? (hintStep > 0 ? 'Correct — with a hint' : audioUsed ? 'Correct — with audio' : 'Correct') : 'Not quite'}
            </p>
            {correct && (hintStep > 0 || audioUsed) ? (
              <p className="task-feedback__note">It comes back tomorrow, so you can write it without help.</p>
            ) : null}
            {!correct ? (
              <dl className="task-feedback__compare">
                <div>
                  <dt>You wrote</dt>
                  <dd className="task-feedback__wrote">{checkedAnswer || 'Skipped'}</dd>
                </div>
                <div>
                  <dt>Correct</dt>
                  <dd className="task-feedback__right">
                    {target} <span>— {meaning}</span>
                    <button
                      className="task-feedback__listen"
                      type="button"
                      onClick={onPlayAudio}
                      aria-label="Listen to the word"
                      title="Listen"
                    >
                      <Icon name="volume" size={16} />
                    </button>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="task-feedback__right">
                {target} <span>— {meaning}</span>
                <button
                  className="task-feedback__listen"
                  type="button"
                  onClick={onPlayAudio}
                  aria-label="Listen to the word"
                  title="Listen"
                >
                  <Icon name="volume" size={16} />
                </button>
              </p>
            )}
            {!correct && mode === 'translate-ru' && checkedAnswer.trim() && onClaimCorrect ? (
              <button className="claim-correct" type="button" onClick={onClaimCorrect}>
                My translation is right too
              </button>
            ) : null}
            {correct &&
            mode === 'translate-ru' &&
            checkedAnswer.trim() &&
            !acceptedAnswers(task).some((option) => comparable(option) === comparable(checkedAnswer)) ? (
              <p className="task-feedback__note">Counted as right. Thanks — we will check this translation and add it to the list.</p>
            ) : null}
            {others.length ? <p className="task-feedback__note">Also correct: {others.join(', ')}</p> : null}
            {task.example ? (
              <p className="task-feedback__example">{task.example}</p>
            ) : task.extraExample ? (
              <p className="task-feedback__example">
                {task.extraExample}{' '}
                {task.extraExampleSource === 'written' ? null : (
                  <a
                    href={
                      task.extraExampleSource?.startsWith('tatoeba:')
                        ? `https://tatoeba.org/en/sentences/show/${task.extraExampleSource.slice(8)}`
                        : 'https://tatoeba.org'
                    }
                    target="_blank"
                    rel="noreferrer"
                    title="Sentence from Tatoeba, CC BY 2.0 FR"
                  >
                    Tatoeba
                  </a>
                )}
              </p>
            ) : null}
          </div>
        ) : null}
        {result !== 'idle' && task.wordId ? <WordTip wordId={task.wordId} wrong={!correct} key={task.wordId} /> : null}
        {result === 'incorrect' && spellingTask && checkedAnswer.trim() ? (
          <MistakeBreakdown
            expected={target}
            submitted={checkedAnswer}
            taskType={task.type}
            wordId={task.wordId}
            showRules={showRuleAfterMistake}
            onChallenge={setChallengeRules}
          />
        ) : null}
        {result === 'incorrect' && showRuleAfterMistake && task.rule && !isDefaultRule ? (
          <p className="related-rule">
            <Icon name="lightbulb" size={16} /> {task.rule}
          </p>
        ) : null}
        {revealed && result === 'idle' ? (
          <div className="revealed-answer">
            <span>Answer</span>
            <strong>{task.answer}</strong>
          </div>
        ) : null}
        <div className="task-actions">
          {result !== 'correct' ? (
            <button className={result === 'idle' ? 'check-button' : 'outline-action'} type="submit" disabled={!answer.trim()}>
              <Icon name="check" size={18} /> {result === 'idle' ? 'Check' : 'Try again'}
            </button>
          ) : null}
          {result !== 'idle' ? (
            <button className="next-button" type="button" onClick={onNext}>
              Next <Icon name="arrow" size={17} />
            </button>
          ) : null}
          <div className="task-actions__secondary">
            {result === 'idle' ? (
              <>
                <button className="quiet-button" type="button" onClick={onHint} disabled={hintStep >= 5}>
                  <Icon name="lightbulb" size={17} /> Hint
                </button>
                <button className="quiet-button" type="button" onClick={onPlayAudio}>
                  <Icon name="volume" size={17} /> Listen
                </button>
                {canMeet ? (
                  <button className="quiet-button" type="button" onClick={() => setMeetFor(task.id)}>
                    <Icon name="lightbulb" size={17} /> I don’t know this word
                  </button>
                ) : null}
                <button className="quiet-button" type="button" onClick={onShowAnswer} disabled={revealed}>
                  <Icon name="eye" size={17} /> Show answer
                </button>
                {allowSkip ? (
                  <button className="quiet-button" type="button" onClick={onSkip}>
                    <Icon name="skip" size={17} /> Skip
                  </button>
                ) : null}
              </>
            ) : (
              <button className="quiet-button" type="button" onClick={onPlayAudio}>
                <Icon name="volume" size={17} /> Listen
              </button>
            )}
            <button className="quiet-button" type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen(!moreOpen)}>
              More <Icon name="chevron" size={14} />
            </button>
          </div>
        </div>
        {moreOpen ? (
          <div className="task-more">
            {onHideWord ? (
              <button
                className="quiet-button"
                type="button"
                onClick={onHideWord}
                title="Do not show this word again. Restore it in Libraries → My Libraries."
              >
                <Icon name="eye" size={17} /> Hide word
              </button>
            ) : null}
            {reportable && onReported ? (
              <button
                className="quiet-button"
                type="button"
                onClick={() => setReporting(!reporting)}
                aria-expanded={reporting}
                title="Tell us this word is strange, not worth learning or wrong"
              >
                <Icon name="flag" size={17} /> Report
              </button>
            ) : null}
            {result !== 'idle' || revealed ? (
              <button className="quiet-button" type="button" onClick={onRepeatLater}>
                <Icon name="refresh" size={17} /> Repeat this word later
              </button>
            ) : null}
          </div>
        ) : null}
        {reporting && reportable && onReported ? (
          <WordReportPanel
            word={reportable}
            onCancel={() => setReporting(false)}
            onDone={(hide) => {
              setReporting(false)
              onReported(hide)
            }}
            key={reportable.wordId}
          />
        ) : null}
        {audioMessage ? <p className="related-rule">{audioMessage}</p> : null}
      </form>
      {challengeRules ? (
        <RuleChallenge rules={challengeRules} avoidWord={task.answer} onClose={() => setChallengeRules(null)} key={task.id} />
      ) : null}
    </article>
  )
}
