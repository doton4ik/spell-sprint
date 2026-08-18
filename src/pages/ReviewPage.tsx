import { useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { completeReview, getReviewEntries, getRuleReviewIds } from '../services/learningData'
import type { MistakeEntry } from '../types/learning'
import './learning.css'

function dateLabel(value: string) {
  const date = new Date(value)
  const today = new Date()
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const difference = Math.round((target - midnight) / 86400000)
  if (difference < 0) return 'Overdue'
  if (difference === 0) return 'Today'
  if (difference === 1) return 'Tomorrow'
  return `In ${difference} days`
}

export function ReviewPage() {
  const [entries, setEntries] = useState(getReviewEntries)
  const ruleCount = getRuleReviewIds().length
  const due = entries.filter((entry) => dateLabel(entry.nextReviewAt) === 'Today' || dateLabel(entry.nextReviewAt) === 'Overdue')

  function markCompleted(taskId: string) {
    completeReview(taskId)
    setEntries(getReviewEntries())
  }

  return (
    <div className="learning-page" id="review">
      <header className="learning-header">
        <div><p className="eyebrow">Spaced repetition</p><h1>Review later</h1><p>Missed items return on a simple schedule: tomorrow, then after 3 days, then after 7 days.</p></div>
        <a className="outline-action" href="#practice"><Icon name="practice" size={17} /> Open practice</a>
      </header>
      <section className="review-overview"><div><span><Icon name="calendar" size={17} /> Due now</span><strong>{due.length}</strong><small>Today or overdue</small></div><div><span><Icon name="refresh" size={17} /> In queue</span><strong>{entries.length}</strong><small>Items still building recall</small></div><div><span><Icon name="lightbulb" size={17} /> Rule review</span><strong>{ruleCount}</strong><small>Patterns to keep visible</small></div></section>
      {entries.length === 0 ? <section className="empty-learning-state"><span><Icon name="calendar" size={25} /></span><h2>Nothing in your review queue yet.</h2><p>Items you miss, skip, or reveal during practice will be scheduled for a later review.</p><a className="check-button" href="#practice">Start practice <Icon name="arrow" size={17} /></a></section> : <section className="review-list"><div className="review-list__heading"><h2>Your queue</h2><p>Open the task, write the answer, then mark it reviewed when you can recall it confidently.</p></div>{entries.map((entry) => <ReviewItem entry={entry} onComplete={markCompleted} key={entry.taskId} />)}</section>}
    </div>
  )
}

function ReviewItem({ entry, onComplete }: { entry: MistakeEntry; onComplete: (taskId: string) => void }) {
  return <article className="review-item"><div className="review-item__date"><Icon name="calendar" size={17} /><span>{dateLabel(entry.nextReviewAt)}</span></div><div className="review-item__word"><span>{entry.topic}</span><h2>{entry.correctAnswer}</h2><p>{entry.errorCategory} · {entry.numberOfErrors} recorded error{entry.numberOfErrors === 1 ? '' : 's'}</p></div><div className="review-item__actions"><a href="#practice" className="quiet-action">Practise <Icon name="arrow" size={16} /></a><button type="button" onClick={() => onComplete(entry.taskId)}>Mark reviewed <Icon name="check" size={16} /></button></div></article>
}
