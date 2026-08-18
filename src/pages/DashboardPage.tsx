import { useMemo } from 'react'
import { Icon } from '../components/icons/Icon'
import { MetricCard } from '../components/ui/MetricCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { getLearningAnalytics } from '../services/learningAnalytics'
import './dashboard.css'

export function DashboardPage() {
  const analytics = useMemo(() => getLearningAnalytics(), [])
  const metrics = [
    { label: 'Accuracy', value: `${analytics.accuracy}%`, note: analytics.hasLiveData ? 'Based on your saved answers' : 'Starting baseline', tone: 'teal' as const, icon: 'dashboard' as const },
    { label: 'Repeat later', value: String(analytics.repeatLater), note: 'Items waiting for review', tone: 'amber' as const, icon: 'calendar' as const },
    { label: 'Errors tracked', value: String(analytics.mistakes), note: `Main pattern: ${analytics.mainCategory}`, tone: 'violet' as const, icon: 'mistakes' as const },
    { label: 'Completed tasks', value: String(analytics.totalAttempts), note: analytics.hasLiveData ? 'Practice and diagnostic answers' : 'Starting progress', tone: 'blue' as const, icon: 'practice' as const },
  ]
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  return (
    <div className="dashboard" id="dashboard">
      <header className="page-header">
        <div>
          <p className="date-line">{date}</p>
          <h1>Good morning, Max <span aria-hidden="true">✦</span></h1>
          <p className="page-subtitle">Your English workspace is ready. A short focused session will keep your momentum.</p>
        </div>
        <button className="header-streak" type="button" aria-label="Current 6 day learning streak">
          <span><Icon name="bolt" size={18} strokeWidth={2.25} /></span>
          <strong>6</strong>
          <small>day streak</small>
        </button>
      </header>

      <section className="metrics-grid" aria-label="Learning overview">
        {metrics.map((metric) => <MetricCard metric={metric} key={metric.label} />)}
      </section>

      <section className="recommendation-card">
        <div className="recommendation-card__copy">
          <span className="recommendation-label">Recommended next</span>
          <h2>{analytics.recommendation}</h2>
          <p>Focus on your latest weak area with a short session that turns mistakes into repeatable patterns.</p>
          <div className="recommendation-meta"><span>Mixed practice</span><i /><span>8 tasks</span><i /><span>Focus: {analytics.mainCategory}</span></div>
        </div>
        <div className="recommendation-card__visual" aria-hidden="true">
          <div className="orb orb--one" /><div className="orb orb--two" /><div className="word-chip word-chip--top">inventory</div><div className="word-chip word-chip--middle">shipment</div><div className="word-chip word-chip--bottom">supplier</div>
        </div>
        <a className="primary-button" href="#practice">Start session <Icon name="arrow" size={18} /></a>
      </section>

      <div className="dashboard-columns">
        <section className="panel progress-panel">
          <SectionHeader eyebrow="Learning overview" title="Topic confidence" action="View all topics" />
          <div className="topic-list">
            {analytics.topics.map((topic) => (
              <div className="topic-row" key={topic.topic}>
                <div className="topic-row__label"><span>{topic.topic}</span><small className={`status status--${topic.status.replaceAll(' ', '-').toLowerCase()}`}>{topic.status}</small></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${topic.score}%` }} /></div>
                <strong>{topic.score}%</strong>
              </div>
            ))}
          </div>
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
              <div className="bar-chart__day" key={day.label}>
                <div className="bar-chart__rail"><div className={`bar-chart__bar${day.isToday ? ' bar-chart__bar--today' : ''}`} style={{ height: `${(day.completed / day.target) * 100}%` }} /></div>
                <span className={day.isToday ? 'today-label' : ''}>{day.label}</span>
              </div>
            ))}
          </div>
          <p className="chart-caption"><span /> Your daily goal: 12 tasks</p>
        </section>
      </div>

      <div className="dashboard-columns dashboard-columns--lower">
        <section className="panel mistakes-panel">
          <SectionHeader eyebrow="Last activity" title="Recent mistakes" action="Open mistakes" />
          <div className="mistake-list">
            {analytics.recent.map((mistake) => (
              <div className="mistake-row" key={`${mistake.submitted}-${mistake.correct}`}>
                <div className="mistake-row__letter">Aa</div>
                <div className="mistake-row__content"><p><s>{mistake.submitted}</s><Icon name="arrow" size={14} /> <strong>{mistake.correct}</strong></p><span>{mistake.category} · {mistake.when}</span></div>
                <a href="#mistakes" aria-label={`Review ${mistake.correct}`}><Icon name="chevron" size={18} /></a>
              </div>
            ))}
          </div>
        </section>

        <aside className="review-card">
          <div className="review-card__symbol"><Icon name="calendar" size={20} /></div>
          <div><span>Review queue</span><h2>11 items are due today</h2><p>Keep difficult words fresh with a short spaced-review session.</p></div>
          <a className="secondary-button" href="#review">Review now <Icon name="arrow" size={17} /></a>
        </aside>
      </div>
    </div>
  )
}
