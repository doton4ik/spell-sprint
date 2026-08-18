import type { FormEvent } from 'react'
import type { CheckResult, PracticeTask } from '../../types/practice'
import { Icon } from '../icons/Icon'

type TaskCardProps = {
  task: PracticeTask; answer: string; result: CheckResult; attemptsOnTask: number; answerRevealed: boolean; hintStep: number; allowSkip: boolean
  onAnswerChange: (value: string) => void; onCheck: () => void; onShowAnswer: () => void; onHint: () => void; onPlayAudio: () => void; onSkip: () => void; onNext: () => void; onRepeatLater: () => void; audioMessage?: string
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

export function TaskCard({ task, answer, result, attemptsOnTask, answerRevealed, hintStep, allowSkip, onAnswerChange, onCheck, onShowAnswer, onHint, onPlayAudio, onSkip, onNext, onRepeatLater, audioMessage }: TaskCardProps) {
  const mode = task.mode ?? (task.type === 'translate-en-ru' ? 'translate-ru' : task.type === 'translate-ru-en' ? 'write-en' : 'choose-spelling')
  const revealed = answerRevealed || result !== 'idle' || hintStep >= 5
  const correct = result === 'correct'
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onCheck() }
  return <article className="task-card">
    <div className="task-card__meta"><span className="task-type"><Icon name="shuffle" size={14} /> {labels[mode]}</span><span>{task.topic}{task.subtopic ? ` · ${task.subtopic}` : ''} <i /> {task.level}</span></div>
    <h2>{mode === 'translate-ru' ? 'Translate to Russian.' : mode === 'choose-spelling' ? 'Choose the correct English spelling.' : 'Write the English word or expression.'}</h2>
    {mode === 'listen-write' ? <div className="task-prompt"><span className="prompt-label">Listen</span><p>Press play, then write the English word.</p></div> : <div className={`task-prompt task-prompt--${mode}`}><span className="prompt-label">{mode === 'translate-ru' ? 'English' : 'Russian'}</span><p>{task.prompt}</p></div>}
    {hintStep ? <div className="hint-box"><Icon name="lightbulb" size={17} /><span><strong>Hint {hintStep}/5</strong>{hintFor(task.answer, hintStep)}</span></div> : null}
    <form onSubmit={submit}>
      {mode === 'choose-spelling' ? <div className="spelling-choices">{(task.choices ?? [task.answer]).map((choice) => <button type="button" className={answer === choice ? 'spelling-choice spelling-choice--selected' : 'spelling-choice'} onClick={() => onAnswerChange(choice)} key={choice}>{choice}</button>)}</div> : <><label className="answer-label" htmlFor="practice-answer">Your answer</label><input id="practice-answer" autoFocus value={answer} onChange={(event) => onAnswerChange(event.target.value)} placeholder={mode === 'translate-ru' ? 'Введите перевод…' : 'Type your answer…'} autoComplete="off" disabled={correct} /></>}
      {result !== 'idle' ? <div className={`task-feedback task-feedback--${correct ? 'correct' : 'incorrect'}`} role="status"><Icon name={correct ? 'check' : 'refresh'} size={17} /><span><strong>{correct ? 'Correct!' : 'Not quite.'}</strong>{!correct && <small>Your answer: {answer || 'Skipped'}</small>}<small>Correct answer: {task.answer} — {mode === 'translate-ru' ? task.prompt : task.prompt}</small>{task.example && <small>Example: {task.example}</small>}</span></div> : null}
      {revealed && result === 'idle' ? <div className="revealed-answer"><span>Answer</span><strong>{task.answer}</strong></div> : null}
      <div className="task-actions"><button className="check-button" type="submit" disabled={!answer.trim() || correct}><Icon name="check" size={18} /> Check</button>{result !== 'idle' ? <button className="next-button" type="button" onClick={onNext}>Next <Icon name="arrow" size={17} /></button> : null}<div className="task-actions__secondary"><button className="quiet-button" type="button" onClick={onHint} disabled={hintStep >= 5}><Icon name="lightbulb" size={17} /> Hint</button><button className="quiet-button" type="button" onClick={onPlayAudio}><Icon name="volume" size={17} /> Listen</button><button className="quiet-button" type="button" onClick={onShowAnswer} disabled={revealed}><Icon name="eye" size={17} /> Show answer</button>{allowSkip ? <button className="quiet-button" type="button" onClick={onSkip}><Icon name="skip" size={17} /> Skip</button> : null}</div></div>
      {audioMessage ? <p className="related-rule">{audioMessage}</p> : null}{result !== 'idle' || revealed ? <button className="quiet-button" type="button" onClick={onRepeatLater}>Repeat this word later</button> : null}
    </form>
  </article>
}
