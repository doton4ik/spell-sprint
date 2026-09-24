import type { TaskOutcome } from '../../hooks/usePracticeSession'
import type { PracticeMode, PracticeTask } from '../../types/practice'
import { Icon } from '../icons/Icon'

type SessionSidebarProps = {
  modeLabel: string
  scopeLabel: string
  mode: PracticeMode
  taskIndex: number
  progress: number
  tasks: PracticeTask[]
  outcomes: Record<string, TaskOutcome>
}

const MAX_MAP_TASKS = 40
const MAX_MISSED_SHOWN = 5

export function SessionSidebar({ modeLabel, scopeLabel, mode, taskIndex, progress, tasks, outcomes }: SessionSidebarProps) {
  const results = tasks.map((task) => outcomes[task.id])
  const correct = results.filter((outcome) => outcome === 'correct').length
  const missed = results.filter((outcome) => outcome === 'incorrect' || outcome === 'skipped').length
  const answered = correct + missed
  const accuracy = answered ? Math.round((correct / answered) * 100) : null
  const missedTasks = tasks.filter((task) => outcomes[task.id] === 'incorrect' || outcomes[task.id] === 'skipped')
  // In "Translate to Russian" the task shows English and the answer is Russian; otherwise the reverse.
  const pair = (task: PracticeTask) => (task.mode ?? mode) === 'translate-ru' ? { word: task.prompt, meaning: task.answer } : { word: task.answer, meaning: task.prompt }

  return (
    <aside className="session-sidebar">
      <div className="session-mode"><span><Icon name="shuffle" size={19} /> {modeLabel}</span><small>{scopeLabel}</small></div>

      <div className="session-progress">
        <div><span>Session progress</span><strong>{taskIndex + 1} <small>/ {tasks.length}</small></strong></div>
        <div className="session-progress__track"><div style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="session-stats" aria-label="Session results">
        <div className="session-stat session-stat--good"><strong>{correct}</strong><span>Correct</span></div>
        <div className="session-stat session-stat--bad"><strong>{missed}</strong><span>Missed</span></div>
        <div className="session-stat"><strong>{accuracy === null ? '—' : `${accuracy}%`}</strong><span>Accuracy</span></div>
      </div>

      {tasks.length > 1 && tasks.length <= MAX_MAP_TASKS ? (
        <div className="session-map" aria-label="Session map">
          {tasks.map((task, index) => {
            const state = index === taskIndex ? 'current' : results[index] === 'correct' ? 'correct' : results[index] ? 'missed' : 'todo'
            return <span className={`session-dot session-dot--${state}`} title={`Task ${index + 1}`} key={task.id}>{index + 1}</span>
          })}
        </div>
      ) : null}

      {missedTasks.length ? (
        <div className="session-missed">
          <span className="session-section-label">Missed in this session</span>
          {missedTasks.slice(-MAX_MISSED_SHOWN).reverse().map((task) => { const { word, meaning } = pair(task); return <p key={task.id}><strong>{word}</strong><small>{meaning}</small></p> })}
          {missedTasks.length > MAX_MISSED_SHOWN ? <small className="session-missed__more">+ {missedTasks.length - MAX_MISSED_SHOWN} more</small> : null}
        </div>
      ) : null}

      <div className="session-note"><Icon name="lightbulb" size={19} /><p><strong>The English answer stays hidden.</strong> Use staged hints or listen when needed.</p></div>
    </aside>
  )
}
