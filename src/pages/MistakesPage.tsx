import { useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { getMistakeEntries } from '../services/learningData'
import type { ErrorFamily, LearningStatus } from '../types/learning'
import './learning.css'

const filters: Array<'All' | ErrorFamily> = ['All', 'Spelling', 'Grammar', 'Vocabulary']

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function Status({ status }: { status: LearningStatus }) {
  return <span className={`learning-status learning-status--${status}`}>{status}</span>
}

export function MistakesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const entries = getMistakeEntries()
  const visibleEntries = useMemo(() => filter === 'All' ? entries : entries.filter((entry) => entry.family === filter), [entries, filter])
  const difficult = entries.filter((entry) => entry.status === 'difficult').length
  const review = entries.filter((entry) => entry.status !== 'mastered').length

  return (
    <div className="learning-page" id="my-mistakes">
      <header className="learning-header">
        <div><p className="eyebrow">Personal error log</p><h1>My mistakes</h1><p>Every incorrect attempt is kept here, so you can practise patterns—not just random words.</p></div>
        <a className="outline-action" href="#practice"><Icon name="practice" size={17} /> Practice now</a>
      </header>

      <section className="learning-summary" aria-label="Mistakes summary">
        <div><span>Tracked items</span><strong>{entries.length}</strong><small>Unique tasks with mistakes</small></div>
        <div><span>Need focus</span><strong>{difficult}</strong><small>Items with 3+ errors</small></div>
        <div><span>Review queue</span><strong>{review}</strong><small>Ready for spaced review</small></div>
      </section>

      {entries.length === 0 ? (
        <section className="empty-learning-state">
          <span><Icon name="mistakes" size={25} /></span><h2>Your error log is ready.</h2>
          <p>Complete a practice task with an incorrect answer and it will appear here with its category, rule, and review date.</p>
          <a className="check-button" href="#practice"><Icon name="shuffle" size={17} /> Start mixed practice</a>
        </section>
      ) : (
        <section className="learning-panel">
          <div className="learning-panel__top"><div><h2>Patterns to revisit</h2><p>Errors are grouped by task and updated after every attempt.</p></div><div className="filter-tabs">{filters.map((item) => <button type="button" className={filter === item ? 'filter-tabs__active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div></div>
          <div className="mistakes-table" role="table">
            <div className="mistakes-table__head" role="row"><span>Answer pattern</span><span>Category</span><span>Progress</span><span>Review</span></div>
            {visibleEntries.map((entry) => (
              <div className="mistakes-table__row" role="row" key={entry.taskId}>
                <div className="mistake-answer"><span className="mistake-answer__type">{entry.source === 'personal-baseline' ? 'Personal baseline' : entry.family}</span><p><s>{entry.lastUserVersion}</s><Icon name="arrow" size={14} /><strong>{entry.correctAnswer}</strong></p><small>{entry.topic}{entry.subtopic ? ` · ${entry.subtopic}` : ''}{entry.library ? ` · ${entry.library}` : ''} · first seen {formatDate(entry.firstSeen)}{entry.memoryCue ? ` · cue: ${entry.memoryCue}` : ''}</small></div>
                <div><span className="category-pill">{entry.errorType ?? entry.errorCategory}</span></div>
                <div className="mistake-progress"><Status status={entry.status} /><small>{entry.numberOfErrors} error{entry.numberOfErrors === 1 ? '' : 's'} · {entry.numberOfCorrectAnswers} correct</small></div>
                <div className="review-date"><strong>{formatDate(entry.nextReviewAt)}</strong><a href="#review">Open queue <Icon name="chevron" size={15} /></a></div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
