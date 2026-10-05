import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { AnswerDiff } from '../components/practice/AnswerDiff'
import { getMistakeEntries, subscribeToLearningData } from '../services/learningData'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import type { ErrorFamily, LearningStatus, MistakeEntry } from '../types/learning'
import { MistakePatternsView } from '../components/mistakes/MistakePatternsView'
import './learning.css'
import './rules.css'

const families: Array<'All' | ErrorFamily> = ['All', 'Spelling', 'Grammar', 'Vocabulary']
const DAY = 86400000

const statusLabels: Record<LearningStatus, string> = { new: 'To practise', difficult: 'Needs focus', learning: 'Learning', review: 'Almost there', mastered: 'Mastered' }
function Status({ status }: { status: LearningStatus }) {
  return <span className={`learning-status learning-status--${status}`}>{statusLabels[status]}</span>
}

// "Today" for anything due now or overdue, then "Tomorrow", "In 3 days", then a date.
function when(value: string) {
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
  const days = Math.floor((new Date(value).getTime() - startOfToday.getTime()) / DAY)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `In ${days} days`
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}
const isDue = (entry: MistakeEntry) => { const end = new Date(); end.setHours(23, 59, 59, 999); return entry.status !== 'mastered' && new Date(entry.nextReviewAt) <= end }

function practise(entries: MistakeEntry[], label: string) {
  const wordIds = [...new Set(entries.map((entry) => entry.wordId).filter((id): id is string => Boolean(id)))]
  if (wordIds.length) { setPendingPracticeSelection({ wordIds, label, mode: 'write-en' }); window.location.hash = 'practice' }
  else window.location.hash = 'review'
}

function MistakeRow({ entry }: { entry: MistakeEntry }) {
  return (
    <div className="mistake-row">
      <div className="mistake-answer">
        <p><AnswerDiff expected={entry.correctAnswer} submitted={entry.lastUserVersion} /></p>
        {entry.translation && entry.translation !== entry.correctAnswer ? <p className="mistake-answer__translation">{entry.translation}</p> : null}
        <small>{entry.errorCategory}{entry.topic ? ` · ${entry.topic}` : ''}{entry.memoryCue ? ` · cue: ${entry.memoryCue}` : ''}</small>
      </div>
      <div className="mistake-progress">
        <Status status={entry.status} />
        <span className="good-days" title="Successful days in a row (5 = mastered)" aria-label={`${entry.goodDays ?? 0} of 5 successful days`}>{[0, 1, 2, 3, 4].map((day) => <i className={day < (entry.goodDays ?? 0) ? 'good-days__on' : ''} key={day} />)}</span>
        <small>{entry.numberOfErrors} error{entry.numberOfErrors === 1 ? '' : 's'} · {entry.numberOfCorrectAnswers} correct</small>
      </div>
      <div className="mistake-when"><span>Next review</span><strong>{entry.status === 'mastered' ? '—' : when(entry.nextReviewAt)}</strong></div>
    </div>
  )
}

export function MistakesPage() {
  const [family, setFamily] = useState<(typeof families)[number]>('All')
  const [view, setView] = useState<'words' | 'patterns'>('words')
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  const entries = useMemo(getMistakeEntries, [revision])
  const visible = useMemo(() => (family === 'All' ? entries : entries.filter((entry) => entry.family === family)), [entries, family])
  const due = entries.filter(isDue).length
  const mastered = entries.filter((entry) => entry.status === 'mastered').length
  const familyCount = (item: (typeof families)[number]) => (item === 'All' ? entries.length : entries.filter((entry) => entry.family === item).length)
  const familyDue = (item: (typeof families)[number]) => entries.filter((entry) => (item === 'All' || entry.family === item) && isDue(entry)).length

  // Same idea as Rules: what to do today, what comes back later, what is done.
  const byDate = (a: MistakeEntry, b: MistakeEntry) => a.nextReviewAt.localeCompare(b.nextReviewAt)
  const groups = [
    { id: 'due', title: 'Review today', note: 'These words are due. A correct answer moves a word up a level.', entries: visible.filter(isDue).sort((a, b) => Number(b.status === 'difficult') - Number(a.status === 'difficult') || byDate(a, b)), action: true },
    { id: 'later', title: 'Coming back later', note: 'Answered correctly recently — they return on the date shown.', entries: visible.filter((entry) => entry.status !== 'mastered' && !isDue(entry)).sort(byDate), action: false },
    { id: 'mastered', title: 'Mastered', note: 'Five good days in a row. They come back only if you slip.', entries: visible.filter((entry) => entry.status === 'mastered'), action: false },
  ].filter((group) => group.entries.length)

  return (
    <div className="learning-page" id="my-mistakes">
      <header className="learning-header">
        <div><p className="eyebrow">My mistakes</p><h1>My mistakes</h1><p>{entries.length ? `${entries.length} word${entries.length === 1 ? '' : 's'} · ${due} to review today · ${mastered} mastered` : 'Every wrong answer is kept here, so you can practise it until it sticks.'}</p></div>
        {due ? <button className="outline-action" type="button" onClick={() => practise(entries.filter(isDue), 'Mistakes due today')}><Icon name="practice" size={17} /> Practise today’s words</button> : <a className="outline-action" href="#practice"><Icon name="practice" size={17} /> Practice</a>}
      </header>

      {entries.length === 0 ? (
        <section className="empty-learning-state">
          <span><Icon name="mistakes" size={25} /></span><h2>Your error log is ready.</h2>
          <p>Complete a practice task with an incorrect answer and it will appear here with its category, rule, and review date.</p>
          <a className="check-button" href="#practice"><Icon name="shuffle" size={17} /> Start mixed practice</a>
        </section>
      ) : (<>
        <nav className="mistakes-view-switch" aria-label="View">
          <button type="button" className={view === 'words' ? 'mistakes-view-switch__active' : ''} onClick={() => setView('words')}>Words <small>{entries.length}</small></button>
          <button type="button" className={view === 'patterns' ? 'mistakes-view-switch__active' : ''} onClick={() => setView('patterns')}>Problems &amp; rules</button>
        </nav>
        {view === 'patterns' ? <MistakePatternsView revision={revision} /> : (
          <div className="rules-layout">
            <nav className="rules-nav" aria-label="Kind of mistake">
              <span className="rules-nav__title">Kind</span>
              {families.filter((item) => item === 'All' || familyCount(item)).map((item) => (
                <button type="button" key={item} className={family === item ? 'rules-nav__item rules-nav__item--active' : 'rules-nav__item'} onClick={() => setFamily(item)}>
                  <span>{item === 'All' ? 'All words' : item}</span>{familyDue(item) ? <b title="To review today">{familyDue(item)}</b> : null}<small>{familyCount(item)}</small>
                </button>
              ))}
            </nav>
            <div className="rules-main">
              {groups.length ? groups.map((group) => (
                <section className="rules-group" key={group.id} aria-labelledby={`mistakes-group-${group.id}`}>
                  <header className="rules-group__head mistakes-group__head">
                    <div><h2 id={`mistakes-group-${group.id}`}>{group.title} <small>{group.entries.length}</small></h2><p>{group.note}</p></div>
                    {group.action ? <button className="check-button" type="button" onClick={() => practise(group.entries, 'Mistakes due today')}><Icon name="practice" size={15} /> Practise these</button> : null}
                  </header>
                  {group.id === 'mastered' && group.entries.length > 5 ? (
                    <details className="mistakes-more"><summary>Show {group.entries.length} mastered words</summary><div className="mistake-list">{group.entries.map((entry) => <MistakeRow entry={entry} key={entry.taskId} />)}</div></details>
                  ) : <div className="mistake-list">{group.entries.map((entry) => <MistakeRow entry={entry} key={entry.taskId} />)}</div>}
                </section>
              )) : <p className="patterns-empty">No {family.toLocaleLowerCase()} mistakes.</p>}
            </div>
          </div>
        )}
      </>)}
    </div>
  )
}
