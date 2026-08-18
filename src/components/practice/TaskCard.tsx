import type { FormEvent } from 'react'
import { taskTypeLabels } from '../../data/practice'
import type { CheckResult, PracticeTask } from '../../types/practice'
import { Icon } from '../icons/Icon'

type TaskCardProps = {
  task: PracticeTask
  answer: string
  result: CheckResult
  attemptsOnTask: number
  answerRevealed: boolean
  showHints: boolean
  showRuleAfterMistake: boolean
  writeUntilCorrect: boolean
  allowSkip: boolean
  onAnswerChange: (value: string) => void
  onCheck: () => void
  onShowAnswer: () => void
  onSkip: () => void
  onNext: () => void
}

const taskInstructions: Record<PracticeTask['type'], string> = {
  'correct-spelling': 'Rewrite the word correctly.',
  'translate-ru-en': 'Write the English word.',
  'translate-en-ru': 'Write a natural Russian translation.',
  'correct-sentence': 'Write the complete corrected sentence.',
}

export function TaskCard({
  task, answer, result, attemptsOnTask, answerRevealed, showHints, showRuleAfterMistake,
  writeUntilCorrect, allowSkip, onAnswerChange, onCheck, onShowAnswer, onSkip, onNext,
}: TaskCardProps) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onCheck() }
  const feedbackClass = result === 'correct' ? 'task-feedback--correct' : 'task-feedback--incorrect'

  return (
    <article className="task-card">
      <div className="task-card__meta">
        <span className="task-type"><Icon name="shuffle" size={14} /> {taskTypeLabels[task.type]}</span>
        <span>{task.topic} <i /> {task.level}</span>
      </div>
      <h2>{taskInstructions[task.type]}</h2>
      <div className={`task-prompt task-prompt--${task.type}`}>
        {task.type === 'translate-ru-en' && <span className="prompt-label">Russian</span>}
        {task.type === 'translate-en-ru' && <span className="prompt-label">English</span>}
        <p>{task.prompt}</p>
      </div>

      {showHints ? <div className="hint-box"><Icon name="lightbulb" size={17} /><span><strong>Hint</strong>{task.hint}</span></div> : null}

      <form onSubmit={submit}>
        <label className="answer-label" htmlFor="practice-answer">Your answer</label>
        {task.type === 'correct-sentence' ? (
          <textarea id="practice-answer" autoFocus value={answer} onChange={(event) => onAnswerChange(event.target.value)} placeholder="Write the complete corrected sentence…" rows={3} disabled={result === 'correct'} />
        ) : (
          <input id="practice-answer" autoFocus value={answer} onChange={(event) => onAnswerChange(event.target.value)} placeholder="Type your answer…" autoComplete="off" disabled={result === 'correct'} />
        )}
        {result !== 'idle' ? (
          <div className={`task-feedback ${feedbackClass}`} role="status">
            <Icon name={result === 'correct' ? 'check' : 'refresh'} size={17} />
            <span>
              <strong>{result === 'correct' ? 'Correct — well done.' : 'Not quite. Try again.'}</strong>
              {result === 'correct' && writeUntilCorrect ? <small>Moving to the next task…</small> : null}
              {result === 'incorrect' && attemptsOnTask > 1 ? <small>{attemptsOnTask} attempts saved for this task.</small> : null}
            </span>
          </div>
        ) : null}
        {result === 'incorrect' && showRuleAfterMistake ? <p className="related-rule"><Icon name="lightbulb" size={15} /> {task.rule}</p> : null}
        {answerRevealed ? <div className="revealed-answer"><span>Answer</span><strong>{task.answer}</strong><small>Keep writing it yourself to move on.</small></div> : null}
        <div className="task-actions">
          <button className="check-button" type="submit" disabled={!answer.trim() || result === 'correct'}><Icon name="check" size={18} /> Check answer</button>
          {result === 'correct' && !writeUntilCorrect ? <button className="next-button" type="button" onClick={onNext}>Next task <Icon name="arrow" size={17} /></button> : null}
          <div className="task-actions__secondary">
            <button className="quiet-button" type="button" onClick={onShowAnswer} disabled={answerRevealed || result === 'correct'}><Icon name="eye" size={17} /> Show answer</button>
            {allowSkip ? <button className="quiet-button" type="button" onClick={onSkip} disabled={result === 'correct'}><Icon name="skip" size={17} /> Skip</button> : null}
          </div>
        </div>
      </form>
    </article>
  )
}
