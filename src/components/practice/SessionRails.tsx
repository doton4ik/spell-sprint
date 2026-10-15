import { useMemo } from 'react'
import type { TaskOutcome } from '../../hooks/usePracticeSession'
import { getStreak, getTodayCount } from '../../services/dailyPlan'
import { getMistakeEntries, isDueToday } from '../../services/learningData'
import { getProfile } from '../../services/profileStorage'
import type { PracticeMode, PracticeTask } from '../../types/practice'

type SessionRailsProps = {
  mode: PracticeMode
  taskIndex: number
  tasks: PracticeTask[]
  outcomes: Record<string, TaskOutcome>
  feedbackRef?: (element: HTMLDivElement | null) => void // the answer feedback is drawn here on wide screens
}

const MAX_MAP_TASKS = 40
const MAX_MISSED_SHOWN = 6

// In "Translate to Russian" the task shows English and the answer is Russian; otherwise the reverse.
function pairOf(task: PracticeTask, mode: PracticeMode) {
  return (task.mode ?? mode) === 'translate-ru'
    ? { word: task.prompt, meaning: task.answer }
    : { word: task.answer, meaning: task.promptNote ?? task.prompt }
}

// Wide screens only (CSS): one quiet panel beside the task with the session map and the words missed
// so far. The same things as the slim bar above the task, never hints.
export function SessionRails({ mode, taskIndex, tasks, outcomes, feedbackRef }: SessionRailsProps) {
  // Today, beyond this session: the daily goal, what is waiting for review, the streak. Read again after every answer.
  const today = useMemo(
    () => ({
      done: getTodayCount(),
      goal: getProfile().dailyGoal,
      due: getMistakeEntries().filter(isDueToday).length,
      streak: getStreak().streak,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outcomes],
  )
  const results = tasks.map((task) => outcomes[task.id])
  const correct = results.filter((outcome) => outcome === 'correct').length
  const missed = results.filter((outcome) => outcome === 'incorrect' || outcome === 'skipped').length
  const missedTasks = tasks.filter((task) => outcomes[task.id] === 'incorrect' || outcomes[task.id] === 'skipped')

  return (
    <aside className="session-rail" aria-label="Session">
      <div className="session-rail__feedback" ref={feedbackRef} />
      <div className="session-rail__head">
        <strong>
          Word {taskIndex + 1} <small>of {tasks.length}</small>
        </strong>
        <div className="session-rail__track">
          <div style={{ width: `${(taskIndex / Math.max(1, tasks.length)) * 100}%` }} />
        </div>
        <span>
          <b className="session-rail__good">{correct}</b> correct · <b className="session-rail__bad">{missed}</b> missed
        </span>
      </div>
      {tasks.length > 1 && tasks.length <= MAX_MAP_TASKS ? (
        <div className="session-rail__block">
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
      <div className="session-rail__block session-rail__block--today">
        <span className="session-rail__label">Today</span>
        <div className="session-rail__today">
          <strong>
            {today.done} <small>of {today.goal} tasks</small>
          </strong>
          <div className="session-rail__track">
            <div style={{ width: `${Math.min(100, (today.done / Math.max(1, today.goal)) * 100)}%` }} />
          </div>
          <span>
            {today.due} due for review{today.streak > 0 ? ` · ${today.streak}-day streak` : ''}
          </span>
        </div>
      </div>
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
  )
}
