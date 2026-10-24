import { useEffect, useMemo, useState } from 'react'
import { DayRail } from '../components/dashboard/DayRail'
import { Icon } from '../components/icons/Icon'
import { LibrarySetup } from '../components/libraries/LibrarySetup'
import { isLibrarySetupDone } from '../services/libraryPrefs'
import { MetricCard } from '../components/ui/MetricCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { buildChecklist, STEP_INFO, type Checklist, type ChecklistStep } from '../services/dailyChecklist'
import { buildDailyPlan, getStreak, type DailyPlan } from '../services/dailyPlan'
import { getLearningAnalytics } from '../services/learningAnalytics'
import { getLevelChecks, nextCheckDue } from '../services/levelCheck'
import { getMistakeEntries, isDueToday, subscribeToLearningData } from '../services/learningData'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import { getProfile, subscribeToProfile } from '../services/profileStorage'
import { getAllUserRuleProgress } from '../services/rulePracticeService'
import { getCloudSession } from '../services/supabase'
import type { PracticeMode } from '../types/practice'
import type { UserRuleProgress } from '../types/rules'
import './dashboard.css'

function greeting() {
  const hour = new Date().getHours()
  return hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
}

function startPlan(plan: DailyPlan, mode: PracticeMode, count = plan.items.length) {
  setPendingPracticeSelection({
    wordIds: plan.items.slice(0, Math.max(1, count)).map((item) => item.word.wordId),
    label: mode === 'listen-write' ? "Today's dictation" : "Today's session",
    mode,
  })
  window.location.hash = 'practice'
}

// Starts one step of today's plan: the words and the dictation use today's word list, the rest are their own pages.
function startStep(step: ChecklistStep, plan: DailyPlan) {
  if (step.id === 'words') startPlan(plan, 'write-en', step.left || step.target)
  else if (step.id === 'dictation') startPlan(plan, 'listen-write', step.left || step.target)
  else window.location.hash = STEP_INFO[step.id].href.slice(1)
}

export function DashboardPage() {
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  useEffect(() => subscribeToProfile(() => setRevision((value) => value + 1)), [])
  const analytics = useMemo(getLearningAnalytics, [revision])
  const plan = useMemo(() => buildDailyPlan(), [revision])
  const { streak, practisedToday } = useMemo(() => getStreak(), [revision])
  const checklist = useMemo(() => buildChecklist(), [revision])
  const profile = useMemo(getProfile, [revision])
  const mistakesDue = useMemo(() => getMistakeEntries().filter(isDueToday).length, [revision])
  const goalReached = checklist.allDone

  const { accuracy } = analytics
  const accuracyDelta = accuracy.percent !== null && accuracy.previousPercent !== null ? accuracy.percent - accuracy.previousPercent : null
  // Every percentage shows what it is made of, and says so when there is too little data to trust it.
  const accuracyNote = !accuracy.total
    ? 'No answers in the last 30 days yet'
    : !accuracy.enoughData
      ? `Preliminary: only ${accuracy.total} answer${accuracy.total === 1 ? '' : 's'} in 30 days`
      : `${accuracy.correct} of ${accuracy.total} right · last 30 days${accuracyDelta !== null ? ` · ${accuracyDelta >= 0 ? '+' : ''}${accuracyDelta}% vs previous` : ''}`
  const metrics = [
    {
      label: 'Accuracy',
      value: accuracy.percent === null ? '—' : `${accuracy.percent}%`,
      note: accuracyNote,
      tone: 'teal' as const,
      icon: 'dashboard' as const,
    },
    {
      label: 'Due today',
      value: String(plan.dueTotal),
      note: mistakesDue
        ? `Words whose review date has come. My Mistakes lists ${mistakesDue} to repeat today.`
        : 'Words whose review date has come.',
      tone: 'amber' as const,
      icon: 'calendar' as const,
    },
    {
      label: 'Not mastered yet',
      value: String(analytics.openMistakes),
      note: `Words not mastered yet · ${analytics.mistakes} wrong answer${analytics.mistakes === 1 ? '' : 's'} in total`,
      tone: 'violet' as const,
      icon: 'mistakes' as const,
    },
  ]
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const subtitle = goalReached
    ? "Today's plan is done. Anything extra is a bonus."
    : practisedToday
      ? `${checklist.steps.filter((step) => step.status !== 'done').length} of ${checklist.steps.length} parts of today's plan left.`
      : streak
        ? `Practise today to keep your ${streak}-day streak going.`
        : 'A short focused session is the best way to start.'

  return (
    <div className="dashboard-wrap">
      <div className="dashboard" id="dashboard">
        <header className="page-header">
          <div>
            <p className="date-line">{date}</p>
            <h1>
              {greeting()}
              {profile.name.trim() ? `, ${profile.name.trim()}` : ''} <span aria-hidden="true">✦</span>
            </h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          <div
            className={`header-streak${practisedToday ? '' : ' header-streak--pending'}`}
            role="status"
            aria-label={`${streak} day learning streak`}
          >
            <span>
              <Icon name="bolt" size={18} strokeWidth={2.25} />
            </span>
            <strong>{streak}</strong>
            <small>day streak</small>
          </div>
        </header>

        {analytics.totalAttempts || isLibrarySetupDone() ? null : <LibrarySetup onDone={() => setRevision((value) => value + 1)} />}
        {analytics.totalAttempts ? null : <Welcome />}

        <div className="dashboard-hero">
          <TodayCard plan={plan} checklist={checklist} />
          <section className="panel activity-panel">
            <SectionHeader eyebrow="This week" title="Daily progress">
              <span className="weekly-total">
                {analytics.weeklyTotal} <small>tasks</small>
              </span>
            </SectionHeader>
            <div className="bar-chart" aria-label="Tasks completed this week">
              {analytics.daily.map((day) => (
                <div className="bar-chart__day" key={day.label} title={`${day.completed} tasks`}>
                  <div className="bar-chart__rail">
                    <div
                      className={`bar-chart__bar${day.isToday ? ' bar-chart__bar--today' : ''}${day.completed >= day.target ? ' bar-chart__bar--goal' : ''}`}
                      style={{ height: `${Math.min(100, (day.completed / day.target) * 100)}%` }}
                    />
                  </div>
                  <span className={day.isToday ? 'today-label' : ''}>{day.label}</span>
                </div>
              ))}
            </div>
            <p className="chart-caption">
              <span /> Your plan: {profile.dailyMinutes} min a day · <a href="#settings">change</a>
            </p>
          </section>
        </div>

        {analytics.totalAttempts ? (
          <>
            <section className="metrics-grid" aria-label="Learning overview">
              {metrics.map((metric) => (
                <MetricCard metric={metric} key={metric.label} />
              ))}
            </section>
            <LevelCheckNudge revision={revision} />
          </>
        ) : null}

        <div className="dashboard-columns">
          <section className="panel progress-panel">
            <SectionHeader eyebrow="Last 30 days" title="Topic confidence" action="View all topics" actionHref="#topics" />
            {analytics.topics.length ? (
              <div className="topic-list">
                {analytics.topics.map((topic) => (
                  <div className="topic-row" key={topic.topic}>
                    <div className="topic-row__label">
                      <span>{topic.topic}</span>
                      <small className={`status status--${topic.status.replaceAll(' ', '-').toLowerCase()}`}>{topic.status}</small>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${topic.score}%` }} />
                    </div>
                    <strong title={`${topic.correct} of ${topic.total} right in 30 days`}>
                      {topic.score}%<small className="topic-row__count"> · {topic.total}</small>
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="panel-empty">Topic scores appear after your first practice answers.</p>
            )}
            <div className="weak-focus">
              <span className="weak-focus__icon">
                <Icon name="mistakes" size={18} />
              </span>
              <p>
                <strong>Your main focus:</strong> {analytics.weakTopic?.topic ?? 'Spelling patterns'}. Review{' '}
                {analytics.mainCategory.toLowerCase()} to build speed and confidence.
              </p>
              <a href="#rules" aria-label="Practice spelling patterns">
                <Icon name="arrow" size={18} />
              </a>
            </div>
          </section>

          <section className="panel mistakes-panel">
            <SectionHeader eyebrow="Last activity" title="Recent mistakes" action="Open mistakes" actionHref="#my-mistakes" />
            {analytics.recent.length ? (
              <div className="recent-list">
                {analytics.recent.map((mistake) => (
                  <a
                    className="recent-row"
                    href="#my-mistakes"
                    key={`${mistake.submitted}-${mistake.correct}-${mistake.when}`}
                    aria-label={`Review ${mistake.correct}`}
                  >
                    <span className="recent-row__icon">
                      <Icon name="mistakes" size={16} />
                    </span>
                    <span className="recent-row__body">
                      <span className="recent-row__words">
                        <s>{mistake.submitted}</s>
                        <Icon name="arrow" size={14} /> <strong>{mistake.correct}</strong>
                      </span>
                      <span className="recent-row__meta">{mistake.category}</span>
                    </span>
                    <time className="recent-row__when">{mistake.when}</time>
                  </a>
                ))}
              </div>
            ) : (
              <p className="panel-empty">No mistakes yet. They will show up here with what went wrong.</p>
            )}
          </section>
        </div>

        <div className="dashboard-rules">
          <RulesCard />
        </div>
      </div>
      <DayRail />
    </div>
  )
}

// A quiet reminder when there is no level check yet, or the last one is over a month old.
function LevelCheckNudge({ revision }: { revision: number }) {
  const checks = useMemo(getLevelChecks, [revision])
  if (!nextCheckDue(checks).due) return null
  return (
    <a className="level-nudge" href="#level-check">
      <span className="level-nudge__icon">
        <Icon name="analysis" size={18} />
      </span>
      <span>
        <strong>{checks.length ? 'Time for a new level check' : 'Find your level in 15 minutes'}</strong>
      </span>
      <Icon name="arrow" size={17} />
    </a>
  )
}

const reasonLabels = { due: 'to review', weak: 'keep slipping', new: 'new', extra: 'extra practice' } as const

function stateText(step: ChecklistStep) {
  if (step.status === 'done') return 'Done'
  if (step.status === 'partly') return `${step.left} left`
  return 'Not started'
}

// Today's plan in one card: every part of the day with what is done and what is left, and one primary button for the next part.
function TodayCard({ plan, checklist }: { plan: DailyPlan; checklist: Checklist }) {
  const { steps, next } = checklist
  const wordsStep = steps[0]
  const parts = (['due', 'weak', 'new', 'extra'] as const)
    .map((reason) => ({
      reason,
      count: reason === 'due' ? plan.due : reason === 'weak' ? plan.weak : reason === 'new' ? plan.fresh : plan.extra,
    }))
    .filter((part) => part.count > 0)
  const noWords = plan.items.length === 0 && wordsStep.status !== 'done'

  return (
    <section className="today-card" aria-label="Today's plan">
      <div className="today-card__main">
        <span className="recommendation-label">Today's plan</span>
        {noWords ? (
          <>
            <h2>Add some words to begin</h2>
            <p>Your libraries are empty. Import a CSV or open the built-in libraries.</p>
            <div className="today-card__actions">
              <a className="today-button today-button--primary" href="#libraries">
                Open libraries <Icon name="arrow" size={17} />
              </a>
            </div>
          </>
        ) : (
          <>
            <h2>{checklist.allDone ? 'Everything is done for today' : `${checklist.minutesDone} of ${checklist.minutes} min`}</h2>
            <ul className="plan-list">
              {steps.map((step) => {
                const info = STEP_INFO[step.id]
                return (
                  <li className={`plan-step plan-step--${step.status}`} key={step.id}>
                    <span className="plan-step__mark" aria-hidden="true">
                      {step.status === 'done' ? '✓' : step.status === 'partly' ? '◐' : '○'}
                    </span>
                    <div className="plan-step__text">
                      <strong>{step.title}</strong>
                      <small>
                        {step.done} of {step.target} {step.target === 1 ? info.one : info.many} · about {step.minutes} min
                      </small>
                      {step.id === 'words' && step.status !== 'done' && parts.length ? (
                        <span className="plan-step__parts">
                          {parts.map((part) => (
                            <span className={`today-part today-part--${part.reason}`} key={part.reason}>
                              {part.count} {reasonLabels[part.reason]}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </div>
                    <span className="plan-step__state">{stateText(step)}</span>
                    {step.status !== 'done' ? (
                      <button
                        className={step === next ? 'today-button today-button--primary' : 'today-button today-button--quiet'}
                        type="button"
                        onClick={() => startStep(step, plan)}
                      >
                        {step.status === 'partly' ? 'Continue' : 'Start'}
                      </button>
                    ) : null}
                  </li>
                )
              })}
            </ul>
            {checklist.allDone ? (
              <p>
                You can practise more any time: <a href="#practice">Practice</a>.
              </p>
            ) : null}
          </>
        )}
      </div>
      <div className="today-card__goal" aria-label={`${checklist.minutesDone} of ${checklist.minutes} minutes of today's plan done`}>
        <div className="goal-ring" style={{ ['--goal' as string]: `${checklist.percent * 3.6}deg` }}>
          <div>
            <strong>{checklist.percent}%</strong>
            <small>of {checklist.minutes} min</small>
          </div>
        </div>
        <span>{checklist.allDone ? 'Plan done ✓' : 'of today'}</span>
      </div>
    </section>
  )
}

function RulesCard() {
  const signedIn = Boolean(getCloudSession())
  const [progress, setProgress] = useState<UserRuleProgress[] | null>(null)
  useEffect(() => {
    let cancelled = false
    getAllUserRuleProgress()
      .then((rows) => {
        if (!cancelled) setProgress(rows)
      })
      .catch(() => {
        if (!cancelled) setProgress([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const active = progress?.filter((row) => row.status !== 'mastered' && row.status !== 'archived' && row.mistakeCount > 0) ?? []
  const critical = active.filter((row) => row.priority === 'critical').length
  const mastered = progress?.filter((row) => row.status === 'mastered').length ?? 0
  const title = !signedIn
    ? 'Track the rules behind your mistakes'
    : progress === null
      ? 'Checking your rules…'
      : active.length
        ? `${active.length} rule${active.length === 1 ? '' : 's'} to repeat`
        : 'No weak rules right now'
  const text = !signedIn
    ? 'Sign in on the Settings page, and every mistake is linked to the spelling rule it breaks.'
    : active.length
      ? `${critical ? `${critical} critical · ` : ''}${mastered} mastered. One quick exercise at a time, on the Rules page.`
      : 'Rules you break will appear here, ready for a quick exercise.'

  return (
    <aside className="review-card">
      <div className="review-card__symbol">
        <Icon name="rules" size={20} />
      </div>
      <div>
        <span>Rules that stick</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <a className="secondary-button" href={signedIn ? '#rules' : '#settings'}>
        {signedIn ? 'Practise rules' : 'Sign in'} <Icon name="arrow" size={17} />
      </a>
    </aside>
  )
}

// A new learner has no numbers yet: instead of four empty cards, how Spell Sprint works.
function Welcome() {
  const steps = [
    {
      icon: 'analysis' as const,
      title: 'Find your level',
      action: { label: 'Start the level check', href: '#level-check' },
    },
    {
      icon: 'practice' as const,
      title: 'Ten words a day',
    },
    {
      icon: 'calendar' as const,
      title: 'Mistakes come back',
    },
  ]
  return (
    <section className="welcome" aria-label="How Spell Sprint works">
      {steps.map((step, index) => (
        <article className="welcome-step" key={step.title}>
          <span className="welcome-step__icon">
            <Icon name={step.icon} size={18} />
          </span>
          <small>Step {index + 1}</small>
          <h2>{step.title}</h2>
          {step.action ? (
            <a href={step.action.href}>
              {step.action.label} <Icon name="arrow" size={15} />
            </a>
          ) : null}
        </article>
      ))}
    </section>
  )
}
