import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { MetricCard } from '../components/ui/MetricCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { buildDailyPlan, getStreak, getTodayCount, type DailyPlan } from '../services/dailyPlan'
import { getLearningAnalytics } from '../services/learningAnalytics'
import { getLevelChecks, nextCheckDue } from '../services/levelCheck'
import { subscribeToLearningData } from '../services/learningData'
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

function startPlan(plan: DailyPlan, mode: PracticeMode) {
  setPendingPracticeSelection({ wordIds: plan.items.map((item) => item.word.wordId), label: mode === 'listen-write' ? "Today's dictation" : "Today's session", mode })
  window.location.hash = 'practice'
}

export function DashboardPage() {
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  useEffect(() => subscribeToProfile(() => setRevision((value) => value + 1)), [])
  const analytics = useMemo(getLearningAnalytics, [revision])
  const plan = useMemo(() => buildDailyPlan(), [revision])
  const { streak, practisedToday } = useMemo(() => getStreak(), [revision])
  const todayCount = useMemo(() => getTodayCount(), [revision])
  const profile = useMemo(getProfile, [revision])
  const goalReached = todayCount >= profile.dailyGoal

  const { accuracy } = analytics
  const accuracyDelta = accuracy.percent !== null && accuracy.previousPercent !== null ? accuracy.percent - accuracy.previousPercent : null
  // Every percentage shows what it is made of, and says so when there is too little data to trust it.
  const accuracyNote = !accuracy.total ? 'No answers in the last 30 days yet'
    : !accuracy.enoughData ? `Preliminary: only ${accuracy.total} answer${accuracy.total === 1 ? '' : 's'} in 30 days`
    : `${accuracy.correct} of ${accuracy.total} right · last 30 days${accuracyDelta !== null ? ` · ${accuracyDelta >= 0 ? '+' : ''}${accuracyDelta}% vs previous` : ''}`
  const metrics = [
    { label: 'Accuracy', value: accuracy.percent === null ? '—' : `${accuracy.percent}%`, note: accuracyNote, tone: 'teal' as const, icon: 'dashboard' as const },
    { label: 'Due for review', value: String(plan.dueTotal), note: 'Words whose review date has come', tone: 'amber' as const, icon: 'calendar' as const },
    { label: 'Open mistakes', value: String(analytics.openMistakes), note: `Words not mastered yet · ${analytics.mistakes} wrong answer${analytics.mistakes === 1 ? '' : 's'} in total`, tone: 'violet' as const, icon: 'mistakes' as const },
    { label: 'Answers', value: String(analytics.totalAttempts), note: 'All practice, review and level-check answers', tone: 'blue' as const, icon: 'practice' as const },
  ]
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const subtitle = goalReached ? 'Daily goal reached. Anything extra today is a bonus.' : practisedToday ? `${profile.dailyGoal - todayCount} more tasks to reach today's goal.` : streak ? `Practise today to keep your ${streak}-day streak going.` : 'A short focused session is the best way to start.'

  return (
    <div className="dashboard" id="dashboard">
      <header className="page-header">
        <div>
          <p className="date-line">{date}</p>
          <h1>{greeting()}{profile.name.trim() ? `, ${profile.name.trim()}` : ''} <span aria-hidden="true">✦</span></h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <div className={`header-streak${practisedToday ? '' : ' header-streak--pending'}`} role="status" aria-label={`${streak} day learning streak`}>
          <span><Icon name="bolt" size={18} strokeWidth={2.25} /></span>
          <strong>{streak}</strong>
          <small>day streak</small>
        </div>
      </header>

      <section className="metrics-grid" aria-label="Learning overview">
        {metrics.map((metric) => <MetricCard metric={metric} key={metric.label} />)}
      </section>

      <LevelCheckNudge revision={revision} />

      <TodayCard plan={plan} todayCount={todayCount} goal={profile.dailyGoal} />

      <div className="dashboard-columns">
        <section className="panel progress-panel">
          <SectionHeader eyebrow="Last 30 days" title="Topic confidence" action="View all topics" actionHref="#topics" />
          {analytics.topics.length ? (
            <div className="topic-list">
              {analytics.topics.map((topic) => (
                <div className="topic-row" key={topic.topic}>
                  <div className="topic-row__label"><span>{topic.topic}</span><small className={`status status--${topic.status.replaceAll(' ', '-').toLowerCase()}`}>{topic.status}</small></div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${topic.score}%` }} /></div>
                  <strong title={`${topic.correct} of ${topic.total} right in 30 days`}>{topic.score}%<small className="topic-row__count"> · {topic.total}</small></strong>
                </div>
              ))}
            </div>
          ) : <p className="panel-empty">Topic scores appear after your first practice answers.</p>}
          <div className="weak-focus">
            <span className="weak-focus__icon"><Icon name="mistakes" size={18} /></span>
            <p><strong>Your main focus:</strong> {analytics.weakTopic?.topic ?? 'Spelling patterns'}. Review {analytics.mainCategory.toLowerCase()} to build speed and confidence.</p>
            <a href="#rules" aria-label="Practice spelling patterns"><Icon name="arrow" size={18} /></a>
          </div>
        </section>

        <section className="panel activity-panel">
          <SectionHeader eyebrow="This week" title="Daily progress">
            <span className="weekly-total">{analytics.weeklyTotal} <small>tasks</small></span>
          </SectionHeader>
          <div className="bar-chart" aria-label="Tasks completed this week">
            {analytics.daily.map((day) => (
              <div className="bar-chart__day" key={day.label} title={`${day.completed} tasks`}>
                <div className="bar-chart__rail"><div className={`bar-chart__bar${day.isToday ? ' bar-chart__bar--today' : ''}${day.completed >= day.target ? ' bar-chart__bar--goal' : ''}`} style={{ height: `${Math.min(100, (day.completed / day.target) * 100)}%` }} /></div>
                <span className={day.isToday ? 'today-label' : ''}>{day.label}</span>
              </div>
            ))}
          </div>
          <p className="chart-caption"><span /> Your daily goal: {profile.dailyGoal} tasks · <a href="#settings">change</a></p>
        </section>
      </div>

      <div className="dashboard-columns dashboard-columns--lower">
        <section className="panel mistakes-panel">
          <SectionHeader eyebrow="Last activity" title="Recent mistakes" action="Open mistakes" actionHref="#my-mistakes" />
          {analytics.recent.length ? (
            <div className="mistake-list">
              {analytics.recent.map((mistake) => (
                <div className="mistake-row" key={`${mistake.submitted}-${mistake.correct}-${mistake.when}`}>
                  <div className="mistake-row__letter">Aa</div>
                  <div className="mistake-row__content"><p><s>{mistake.submitted}</s><Icon name="arrow" size={14} /> <strong>{mistake.correct}</strong></p><span>{mistake.category} · {mistake.when}</span></div>
                  <a href="#my-mistakes" aria-label={`Review ${mistake.correct}`}><Icon name="chevron" size={18} /></a>
                </div>
              ))}
            </div>
          ) : <p className="panel-empty">No mistakes yet. They will show up here with what went wrong.</p>}
        </section>

        <RulesCard />
      </div>
    </div>
  )
}

// A quiet reminder when there is no level check yet, or the last one is over a month old.
function LevelCheckNudge({ revision }: { revision: number }) {
  const checks = useMemo(getLevelChecks, [revision])
  if (!nextCheckDue(checks).due) return null
  return (
    <a className="level-nudge" href="#level-check">
      <span className="level-nudge__icon"><Icon name="analysis" size={18} /></span>
      <span><strong>{checks.length ? 'Time for a new level check' : 'Find your level in 6 minutes'}</strong><small>{checks.length ? `Last result: ${checks[0].overall.level}. See how far you have come.` : '20 adaptive questions across spelling, vocabulary and grammar.'}</small></span>
      <Icon name="arrow" size={17} />
    </a>
  )
}

const reasonLabels = { due: 'to review', weak: 'keep slipping', new: 'new' } as const

function TodayCard({ plan, todayCount, goal }: { plan: DailyPlan; todayCount: number; goal: number }) {
  const percent = Math.min(100, Math.round((todayCount / goal) * 100))
  const minutes = Math.max(2, Math.round(plan.items.length * 0.5))
  const parts = (['due', 'weak', 'new'] as const)
    .map((reason) => ({ reason, count: reason === 'due' ? plan.due : reason === 'weak' ? plan.weak : plan.fresh }))
    .filter((part) => part.count > 0)

  return (
    <section className="today-card" aria-label="Today's session">
      <div className="today-card__main">
        <span className="recommendation-label">Today's session</span>
        {plan.items.length ? (
          <>
            <h2>{plan.items.length} words · about {minutes} min</h2>
            <div className="today-card__parts">{parts.map((part) => <span className={`today-part today-part--${part.reason}`} key={part.reason}>{part.count} {reasonLabels[part.reason]}</span>)}</div>
            <div className="today-card__words">{plan.items.slice(0, 5).map((item) => <span key={item.word.wordId}>{item.word.word}</span>)}{plan.items.length > 5 ? <span className="today-card__more">+{plan.items.length - 5}</span> : null}</div>
            <div className="today-card__actions">
              <button className="today-button today-button--primary" type="button" onClick={() => startPlan(plan, 'write-en')}><Icon name="practice" size={17} /> Start</button>
              <button className="today-button" type="button" onClick={() => startPlan(plan, 'listen-write')}><Icon name="volume" size={17} /> Dictation</button>
            </div>
          </>
        ) : (
          <>
            <h2>Add some words to begin</h2>
            <p>Your libraries are empty. Import a CSV or open the built-in libraries.</p>
            <div className="today-card__actions"><a className="today-button today-button--primary" href="#libraries">Open libraries <Icon name="arrow" size={17} /></a></div>
          </>
        )}
      </div>
      <div className="today-card__goal" aria-label={`${todayCount} of ${goal} tasks done today`}>
        <div className="goal-ring" style={{ ['--goal' as string]: `${percent * 3.6}deg` }}>
          <div><strong>{todayCount}</strong><small>of {goal}</small></div>
        </div>
        <span>{todayCount >= goal ? 'Goal reached ✓' : 'tasks today'}</span>
      </div>
    </section>
  )
}

function RulesCard() {
  const signedIn = Boolean(getCloudSession())
  const [progress, setProgress] = useState<UserRuleProgress[] | null>(null)
  useEffect(() => {
    let cancelled = false
    getAllUserRuleProgress().then((rows) => { if (!cancelled) setProgress(rows) }).catch(() => { if (!cancelled) setProgress([]) })
    return () => { cancelled = true }
  }, [])

  const active = progress?.filter((row) => row.status !== 'mastered' && row.status !== 'archived' && row.mistakeCount > 0) ?? []
  const critical = active.filter((row) => row.priority === 'critical').length
  const mastered = progress?.filter((row) => row.status === 'mastered').length ?? 0
  const title = !signedIn ? 'Track the rules behind your mistakes' : progress === null ? 'Checking your rules…' : active.length ? `${active.length} rule${active.length === 1 ? '' : 's'} to repeat` : 'No weak rules right now'
  const text = !signedIn ? 'Sign in on the Settings page, and every mistake is linked to the spelling rule it breaks.' : active.length ? `${critical ? `${critical} critical · ` : ''}${mastered} mastered. One quick exercise at a time, on the Rules page.` : 'Rules you break will appear here, ready for a quick exercise.'

  return (
    <aside className="review-card">
      <div className="review-card__symbol"><Icon name="rules" size={20} /></div>
      <div><span>Rules that stick</span><h2>{title}</h2><p>{text}</p></div>
      <a className="secondary-button" href={signedIn ? '#rules' : '#settings'}>{signedIn ? 'Practise rules' : 'Sign in'} <Icon name="arrow" size={17} /></a>
    </aside>
  )
}
