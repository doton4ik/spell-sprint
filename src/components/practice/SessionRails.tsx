import type { TaskOutcome } from '../../hooks/usePracticeSession'
import type { PracticeMode, PracticeTask } from '../../types/practice'
import { Icon } from '../icons/Icon'

type SessionRailsProps = {
  mode: PracticeMode
  taskIndex: number
  tasks: PracticeTask[]
  outcomes: Record<string, TaskOutcome>
}

const MAX_MAP_TASKS = 40
const MAX_MISSED_SHOWN = 6

// In "Translate to Russian" the task shows English and the answer is Russian; otherwise the reverse.
function pairOf(task: PracticeTask, mode: PracticeMode) {
  return (task.mode ?? mode) === 'translate-ru'
    ? { word: task.prompt, meaning: task.answer }
    : { word: task.answer, meaning: task.promptNote ?? task.prompt }
}

// Wide screens only (CSS): the margins beside the task hold the session map and the missed words on the left,
// the previous word and the one shortcut on the right. The same things as the slim bar above the task, never hints.
export function SessionRails({ mode, taskIndex, tasks, outcomes }: SessionRailsProps) {
  const results = tasks.map((task) => outcomes[task.id])
  const missedTasks = tasks.filter((task) => outcomes[task.id] === 'incorrect' || outcomes[task.id] === 'skipped')
  const previous = taskIndex > 0 ? tasks[taskIndex - 1] : undefined
  const previousOutcome = previous ? outcomes[previous.id] : undefined
  const previousPair = previous ? pairOf(previous, mode) : null

  return (
    <>
      <aside className="session-rail session-rail--left" aria-label="Session map">
        {tasks.length > 1 && tasks.length <= MAX_MAP_TASKS ? (
          <div className="session-rail__block">
            <span className="session-rail__label">This session</span>
            <div className="session-map">
              {tasks.map((task, index) => {
                const state =
                  index === taskIndex
                    ? 'current'
                    : results[index] === 'correct'
                      ? 'correct'
                      : results[index] === 'met'
                        ? 'met'
                        : results[index]
                          ? 'missed'
                          : 'todo'
                return (
                  <span className={`session-dot session-dot--${state}`} title={`Task ${index + 1}`} key={task.id}>
                    {index + 1}
                  </span>
                )
              })}
            </div>
          </div>
        ) : null}
        {missedTasks.length ? (
          <div className="session-rail__block">
            <span className="session-rail__label">Missed so far</span>
            <div className="session-missed session-missed--rail">
              {missedTasks
                .slice(-MAX_MISSED_SHOWN)
                .reverse()
                .map((task) => {
                  const { word, meaning } = pairOf(task, mode)
                  return (
                    <p key={task.id}>
                      <strong>{word}</strong>
                      <small>{meaning}</small>
                    </p>
                  )
                })}
              {missedTasks.length > MAX_MISSED_SHOWN ? (
                <small className="session-missed__more">+ {missedTasks.length - MAX_MISSED_SHOWN} more</small>
              ) : null}
            </div>
          </div>
        ) : null}
      </aside>
      <aside className="session-rail session-rail--right" aria-label="Previous word">
        {previous && previousPair ? (
          <div className="session-rail__block">
            <span className="session-rail__label">Previous word</span>
            <p
              className={`session-previous session-previous--${previousOutcome === 'correct' || previousOutcome === 'met' ? 'good' : 'bad'}`}
            >
              <Icon name={previousOutcome === 'correct' || previousOutcome === 'met' ? 'check' : 'mistakes'} size={16} />
              <span>
                <strong>{previousPair.word}</strong>
                <small>{previousPair.meaning}</small>
              </span>
            </p>
          </div>
        ) : null}
        <p className="session-rail__keys">
          <kbd>Enter</kbd> checks the answer, then starts the next word
        </p>
      </aside>
    </>
  )
}
