import { useEffect, useState, type FormEvent } from 'react'
import type { CheckResult, PracticeTask } from '../../types/practice'
import { Icon } from '../icons/Icon'
import { MistakeBreakdown } from './MistakeBreakdown'
import { RuleChallenge } from '../rules/RuleChallenge'
import type { Rule } from '../../types/rules'
import type { WordReason } from '../../services/dailyPlan'

type TaskCardProps = {
  task: PracticeTask; answer: string; result: CheckResult; attemptsOnTask: number; answerRevealed: boolean; hintStep: number; allowSkip: boolean; showRuleAfterMistake: boolean
  onAnswerChange: (value: string) => void; onCheck: () => void; onShowAnswer: () => void; onHint: () => void; onPlayAudio: () => void; onSkip: () => void; onNext: () => void; onRepeatLater: () => void; audioMessage?: string; reason?: WordReason; otherMeaning?: { word: string; translation: string } | null; onHideWord?: () => void
}

const labels = { 'write-en': 'Write in English', 'listen-write': 'Listen and write', 'translate-ru': 'Translate to Russian', 'choose-spelling': 'Choose correct spelling' }
function hintFor(answer: string, step: number) {
  const words = answer.split(/\s+/)
  if (step === 1) return `First letter: ${words.map((word) => word[0]).join(' ')}`
  if (step === 2) return words.length === 1 ? `${words[0].length} letters` : `${words.length} words: ${words.map((word) => word.length).join(', ')} letters`
  if (step === 3) return `Pattern: ${words.map((word) => `${word[0]}${'·'.repeat(Math.max(word.length - 2, 0))}${word.at(-1)}`).join(' ')}`
  if (step === 4) return 'Pronunciation is ready — press Listen.'
  return `Answer: ${answer}`
}

export function TaskCard({ task, answer, result, attemptsOnTask, answerRevealed, hintStep, allowSkip, showRuleAfterMistake, onAnswerChange, onCheck, onShowAnswer, onHint, onPlayAudio, onSkip, onNext, onRepeatLater, audioMessage, reason, otherMeaning, onHideWord }: TaskCardProps) {
  const mode = task.mode ?? (task.type === 'translate-en-ru' ? 'translate-ru' : task.type === 'translate-ru-en' ? 'write-en' : 'choose-spelling')
  const revealed = answerRevealed || result !== 'idle' || hintStep >= 5
  const correct = result === 'correct'
  // The answer that was actually checked: editing the box for a retry must not change the feedback above it.
  const [checkedAnswer, setCheckedAnswer] = useState('')
  // Rule challenge opened from the mistake breakdown; cleared when the next task appears.
  const [challengeRules, setChallengeRules] = useState<Rule[] | null>(null)
  useEffect(() => { setChallengeRules(null) }, [task.id])
  const isDefaultRule = /^Review .+ in the .+ topic.$/.test(task.rule)
  const spellingTask = mode !== 'translate-ru' && task.type !== 'correct-sentence'
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setCheckedAnswer(answer); onCheck() }
  return <article className="task-card">
    <div className="task-card__meta"><span className="task-card__labels"><span className="task-type"><Icon name="shuffle" size={14} /> {labels[mode]}</span>{reason ? <span className={`task-reason task-reason--${reason.kind}`} title="Why this word is in your session">{reason.text}</span> : null}</span><span>{task.topic}{task.subtopic ? ` · ${task.subtopic}` : ''} <i /> {task.level}</span></div>
    <h2>{mode === 'translate-ru' ? 'Translate to Russian.' : mode === 'choose-spelling' ? 'Choose the correct English spelling.' : 'Write the English word or expression.'}</h2>
    {mode === 'listen-write' ? <div className="task-prompt"><span className="prompt-label">Listen</span><button className="dictation-play" type="button" onClick={onPlayAudio}><Icon name="volume" size={22} /><span><strong>Play the word again</strong><small>Listen, then type what you hear.</small></span></button></div> : <div className={`task-prompt task-prompt--${mode}`}><span className="prompt-label">{mode === 'translate-ru' ? 'English' : 'Russian'}</span><p>{task.prompt}</p></div>}
    {hintStep ? <div className="hint-box"><Icon name="lightbulb" size={17} /><span><strong>Hint {hintStep}/5</strong>{hintFor(task.answer, hintStep)}</span></div> : null}
    <form onSubmit={submit}>
      {mode === 'choose-spelling' ? <div className="spelling-choices">{(task.choices ?? [task.answer]).map((choice) => <button type="button" className={answer === choice ? 'spelling-choice spelling-choice--selected' : 'spelling-choice'} onClick={() => onAnswerChange(choice)} key={choice}>{choice}</button>)}</div> : <><label className="answer-label" htmlFor="practice-answer">Your answer</label><input id="practice-answer" autoFocus value={answer} onChange={(event) => onAnswerChange(event.target.value)} placeholder={mode === 'translate-ru' ? 'Введите перевод…' : 'Type your answer…'} autoComplete="off" disabled={correct} /></>}
      {otherMeaning && result === 'idle' ? <div className="other-meaning" role="status"><Icon name="lightbulb" size={17} /><span><strong>“{otherMeaning.word}” is also “{otherMeaning.translation}” — a different meaning.</strong><small>Here we need another word for “{task.prompt}”. Not counted as a mistake — try again.</small></span></div> : null}
      {result !== 'idle' ? <div className={`task-feedback task-feedback--${correct ? 'correct' : 'incorrect'}`} role="status"><Icon name={correct ? 'check' : 'refresh'} size={17} /><span><strong>{correct ? 'Correct!' : 'Not quite.'}</strong>{!correct && <small>Your answer: {checkedAnswer || 'Skipped'}</small>}<small>Correct answer: {task.answer} — {mode === 'translate-ru' ? task.prompt : task.prompt}</small>{task.example && <small>Example: {task.example}</small>}</span></div> : null}
      {result === 'incorrect' && spellingTask && checkedAnswer.trim() ? <MistakeBreakdown expected={task.answer} submitted={checkedAnswer} taskType={task.type} wordId={task.wordId} showRules={showRuleAfterMistake} onChallenge={setChallengeRules} /> : null}
      {result === 'incorrect' && showRuleAfterMistake && task.rule && !isDefaultRule ? <p className="related-rule"><Icon name="lightbulb" size={16} /> {task.rule}</p> : null}
      {revealed && result === 'idle' ? <div className="revealed-answer"><span>Answer</span><strong>{task.answer}</strong></div> : null}
      <div className="task-actions"><button className="check-button" type="submit" disabled={!answer.trim() || correct}><Icon name="check" size={18} /> Check</button>{result !== 'idle' ? <button className="next-button" type="button" onClick={onNext}>Next <Icon name="arrow" size={17} /></button> : null}<div className="task-actions__secondary"><button className="quiet-button" type="button" onClick={onHint} disabled={hintStep >= 5}><Icon name="lightbulb" size={17} /> Hint</button><button className="quiet-button" type="button" onClick={onPlayAudio}><Icon name="volume" size={17} /> Listen</button><button className="quiet-button" type="button" onClick={onShowAnswer} disabled={revealed}><Icon name="eye" size={17} /> Show answer</button>{allowSkip ? <button className="quiet-button" type="button" onClick={onSkip}><Icon name="skip" size={17} /> Skip</button> : null}{onHideWord ? <button className="quiet-button" type="button" onClick={onHideWord} title="Do not show this word again. Restore it in Libraries → My Libraries."><Icon name="eye" size={17} /> Hide word</button> : null}</div></div>
      {audioMessage ? <p className="related-rule">{audioMessage}</p> : null}{result !== 'idle' || revealed ? <button className="quiet-button" type="button" onClick={onRepeatLater}>Repeat this word later</button> : null}
    </form>
    {challengeRules ? <RuleChallenge rules={challengeRules} avoidWord={task.answer} onClose={() => setChallengeRules(null)} key={task.id} /> : null}
  </article>
}
