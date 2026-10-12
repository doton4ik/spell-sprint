import { useEffect, useMemo, useState } from 'react'
import { ReportWordButton } from '../components/ReportWordButton'
import { Icon } from '../components/icons/Icon'
import { AnswerDiff } from '../components/practice/AnswerDiff'
import { getEntryHistory, getMistakeEntries, isDueToday, subscribeToLearningData } from '../services/learningData'
import { openPairOnPairsPage } from '../services/pairs'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import { loadServed, mistakeKey, pickMistakes } from '../services/mistakePicker'
import { dismissYellowCard, getYellowCards, type YellowCard } from '../services/yellowCards'
import type { ErrorFamily, LearningStatus, MistakeEntry } from '../types/learning'
import { MistakePatternsView } from '../components/mistakes/MistakePatternsView'
import './learning.css'
import './rules.css'

const families: Array<'All' | ErrorFamily> = ['All', 'Spelling', 'Grammar', 'Vocabulary']
const DAY = 86400000

const statusLabels: Record<LearningStatus, string> = {
  new: 'To practise',
  difficult: 'Needs focus',
  learning: 'Learning',
  review: 'Almost there',
  mastered: 'Mastered',
}
function Status({ status }: { status: LearningStatus }) {
  return <span className={`learning-status learning-status--${status}`}>{statusLabels[status]}</span>
}

// "Today" for anything due now or overdue, then "Tomorrow", "In 3 days", then a date.
function when(value: string) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const days = Math.floor((new Date(value).getTime() - startOfToday.getTime()) / DAY)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 7) return `In ${days} days`
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}
const isToday = (value?: string) => Boolean(value) && new Date(value!).toDateString() === new Date().toDateString()
const isDue = isDueToday
const shortDate = (value: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))

// Everything that happened with this word: where, when, what was written.
function History({ entry }: { entry: MistakeEntry }) {
  const items = getEntryHistory(entry)
  if (!items.length) return <p className="mistake-history__empty">No answers saved yet.</p>
  return (
    <ol className="mistake-history">
      {items.map((item, index) => (
        <li
          key={index}
          className={item.yellow ? 'mistake-history__yellow' : item.correct ? 'mistake-history__right' : 'mistake-history__wrong'}
        >
          <span className="mistake-history__mark" aria-hidden="true">
            {item.yellow ? '' : item.correct ? '✓' : '✗'}
          </span>
          <strong>{item.correct ? entry.correctAnswer : item.typed || '—'}</strong>
          <span>
            {item.yellow ? 'yellow card · ' : ''}
            {item.where}
          </span>
          <time dateTime={item.at}>
            {isToday(item.at) ? 'today' : shortDate(item.at)},{' '}
            {new Date(item.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </time>
        </li>
      ))}
    </ol>
  )
}

// A session is a mix, not the group itself: the pressed group (today's, due) comes first, the rest is filled with
// other words that need work, and the words handed out last time give way (see mistakePicker.ts).
const MIX_SIZE = 10
function practise(entries: MistakeEntry[], label: string) {
  const picked = pickMistakes({ entries: getMistakeEntries(), size: MIX_SIZE, preferred: entries.map(mistakeKey), served: loadServed() })
  const wordIds = [...new Set(picked.map((entry) => entry.wordId).filter((id): id is string => Boolean(id)))]
  if (wordIds.length) setPendingPracticeSelection({ wordIds, label, mode: 'write-en', kind: 'mistakes' })
  window.location.hash = 'practice'
}

function MistakeRow({ entry }: { entry: MistakeEntry }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={open ? 'mistake-row mistake-row--open' : 'mistake-row'}>
      <div className="mistake-answer">
        <p>
          <AnswerDiff expected={entry.correctAnswer} submitted={entry.lastUserVersion} />
        </p>
        {entry.translation && entry.translation !== entry.correctAnswer ? (
          <p className="mistake-answer__translation">{entry.translation}</p>
        ) : null}
        <small>
          {isToday(entry.lastMistakeAt) ? <b className="mistake-new">New</b> : null}
          {entry.errorCategory}
          {entry.topic ? ` · ${entry.topic}` : ''}
        </small>
      </div>
      <div className="mistake-progress">
        <Status status={entry.status} />
        <span
          className="good-days"
          title="Successful days in a row (5 = mastered)"
          aria-label={`${entry.goodDays ?? 0} of 5 successful days`}
        >
          {[0, 1, 2, 3, 4].map((day) => (
            <i className={day < (entry.goodDays ?? 0) ? 'good-days__on' : ''} key={day} />
          ))}
        </span>
      </div>
      <div className="mistake-when">
        <span>Next review</span>
        <strong>{entry.status === 'mastered' ? '—' : when(entry.nextReviewAt)}</strong>
        <span className="mistake-when__actions">
          <button className="quiet-action word-hide" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Less' : 'Details'}
          </button>
        </span>
      </div>
      {open ? (
        <div className="mistake-row__history">
          <p className="mistake-row__facts">
            {entry.numberOfErrors} error{entry.numberOfErrors === 1 ? '' : 's'} · {entry.numberOfCorrectAnswers} correct
            {entry.origin ? ` · from ${entry.origin}` : ''}
            {entry.memoryCue ? ` · cue: ${entry.memoryCue}` : ''}
          </p>
          <History entry={entry} />
          <div className="mistake-row__actions">
            {entry.pairId ? (
              <button className="quiet-action word-hide" type="button" onClick={() => openPairOnPairsPage(entry.pairId!)}>
                <Icon name="practice" size={13} /> Practise this pair
              </button>
            ) : (
              <ReportWordButton
                word={{
                  wordId: entry.wordId ?? `task:${entry.taskId}`,
                  word: entry.correctAnswer,
                  translation: entry.translation,
                  library: entry.library,
                }}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

// A possible mistake: not noticed in a text, or mistyped against the clock in a sprint.
function YellowCardRow({ card }: { card: YellowCard }) {
  return (
    <div className="mistake-row mistake-row--yellow">
      <div className="mistake-answer">
        <p>
          <span className="yellow-card" aria-hidden="true" />
          <AnswerDiff expected={card.word} submitted={card.shown} />
        </p>
        <small>{card.source === 'sprint' ? 'Mistyped in a sprint, against the clock' : `Not noticed in “${card.where}”`}</small>
      </div>
      <div className="mistake-progress">
        <span className="learning-status learning-status--yellow">Yellow card</span>
        <small>
          {when(card.at) === 'Today'
            ? 'Today'
            : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(card.at))}
        </small>
      </div>
      <div className="mistake-when">
        <button className="quiet-action word-hide" type="button" onClick={() => dismissYellowCard(card.id)} title="Remove this card">
          <Icon name="check" size={13} /> Got it
        </button>
      </div>
    </div>
  )
}

export function MistakesPage() {
  const [family, setFamily] = useState<(typeof families)[number]>('All')
  const [view, setView] = useState<'words' | 'patterns'>('words')
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  const entries = useMemo(getMistakeEntries, [revision])
  const yellowCards = useMemo(getYellowCards, [revision])
  const showYellow = family === 'All' || family === 'Spelling'
  const visible = useMemo(() => (family === 'All' ? entries : entries.filter((entry) => entry.family === family)), [entries, family])
  const due = entries.filter(isDue).length
  const mastered = entries.filter((entry) => entry.status === 'mastered').length
  const archivedCount = entries.filter((entry) => entry.archived).length
  const familyCount = (item: (typeof families)[number]) =>
    item === 'All' ? entries.length : entries.filter((entry) => entry.family === item).length
  const familyDue = (item: (typeof families)[number]) =>
    entries.filter((entry) => (item === 'All' || entry.family === item) && isDue(entry)).length

  // Same idea as Rules: what to do today, what comes back later, what is done.
  const byDate = (a: MistakeEntry, b: MistakeEntry) => a.nextReviewAt.localeCompare(b.nextReviewAt)
  const today = visible
    .filter((entry) => entry.status !== 'mastered' && isToday(entry.lastMistakeAt))
    .sort((a, b) => (b.lastMistakeAt ?? '').localeCompare(a.lastMistakeAt ?? ''))
  const earlier = visible.filter((entry) => !today.includes(entry) && !entry.archived)
  const archived = visible.filter((entry) => entry.archived && !today.includes(entry))
  const groups = [
    {
      id: 'today',
      title: 'New today',
      entries: today,
      action: true,
    },
    {
      id: 'due',
      title: 'Review today',
      entries: earlier.filter(isDue).sort((a, b) => Number(b.status === 'difficult') - Number(a.status === 'difficult') || byDate(a, b)),
      action: true,
    },
    {
      id: 'later',
      title: 'Coming back later',
      entries: earlier.filter((entry) => entry.status !== 'mastered' && !isDue(entry)).sort(byDate),
      action: false,
    },
    {
      id: 'mastered',
      title: 'Mastered',
      entries: earlier.filter((entry) => entry.status === 'mastered'),
      action: false,
    },
    {
      id: 'archive',
      title: 'Archive',
      entries: archived,
      action: false,
    },
  ].filter((group) => group.entries.length)

  return (
    <div className="learning-page" id="my-mistakes">
      <header className="learning-header">
        <div>
          <h1>My mistakes</h1>
          <p>
            {entries.length || yellowCards.length
              ? `${entries.length} word${entries.length === 1 ? '' : 's'} · ${due} to review today · ${mastered} mastered${archivedCount ? ` · ${archivedCount} archived` : ''}${yellowCards.length ? ` · ${yellowCards.length} yellow card${yellowCards.length === 1 ? '' : 's'}` : ''}`
              : 'Every wrong answer is kept here, so you can practise it until it sticks.'}
          </p>
        </div>
        {due ? (
          <button className="outline-action" type="button" onClick={() => practise(entries.filter(isDue), 'Mistakes mix')}>
            <Icon name="practice" size={17} /> Practise today’s words
          </button>
        ) : (
          <a className="outline-action" href="#practice">
            <Icon name="practice" size={17} /> Practise
          </a>
        )}
      </header>

      {entries.length === 0 && yellowCards.length === 0 ? (
        <section className="empty-learning-state">
          <span>
            <Icon name="mistakes" size={25} />
          </span>
          <h2>Your error log is ready.</h2>
          <p>Complete a practice task with an incorrect answer and it will appear here with its category, rule, and review date.</p>
          <a className="check-button" href="#practice">
            <Icon name="shuffle" size={17} /> Start mixed practice
          </a>
        </section>
      ) : (
        <>
          <nav className="mistakes-view-switch" aria-label="View">
            <button type="button" className={view === 'words' ? 'mistakes-view-switch__active' : ''} onClick={() => setView('words')}>
              Words <small>{entries.length}</small>
            </button>
            <button type="button" className={view === 'patterns' ? 'mistakes-view-switch__active' : ''} onClick={() => setView('patterns')}>
              Problems &amp; rules
            </button>
          </nav>
          {view === 'patterns' ? (
            <MistakePatternsView revision={revision} />
          ) : (
            <div className="rules-layout">
              <nav className="rules-nav" aria-label="Kind of mistake">
                <span className="rules-nav__title">Kind</span>
                {families
                  .filter((item) => item === 'All' || familyCount(item))
                  .map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={family === item ? 'rules-nav__item rules-nav__item--active' : 'rules-nav__item'}
                      onClick={() => setFamily(item)}
                    >
                      <span>{item === 'All' ? 'All words' : item}</span>
                      {familyDue(item) ? <b title="To review today">{familyDue(item)}</b> : null}
                      <small>{familyCount(item)}</small>
                    </button>
                  ))}
              </nav>
              <div className="rules-main">
                {groups.length || (showYellow && yellowCards.length) ? (
                  groups.map((group) => (
                    <section className="rules-group" key={group.id} aria-labelledby={`mistakes-group-${group.id}`}>
                      <header className="rules-group__head mistakes-group__head">
                        <div>
                          <h2 id={`mistakes-group-${group.id}`}>
                            {group.title} <small>{group.entries.length}</small>
                          </h2>
                        </div>
                        {group.action ? (
                          <button className="check-button" type="button" onClick={() => practise(group.entries, 'Mistakes mix')}>
                            <Icon name="practice" size={15} /> Practise a mix
                          </button>
                        ) : null}
                      </header>
                      {(group.id === 'mastered' && group.entries.length > 5) || group.id === 'archive' ? (
                        <details className="mistakes-more">
                          <summary>
                            Show {group.entries.length} {group.id === 'archive' ? 'archived' : 'mastered'} word
                            {group.entries.length === 1 ? '' : 's'}
                          </summary>
                          <div className="mistake-list">
                            {group.entries.map((entry) => (
                              <MistakeRow entry={entry} key={entry.taskId} />
                            ))}
                          </div>
                        </details>
                      ) : (
                        <div className="mistake-list">
                          {group.entries.map((entry) => (
                            <MistakeRow entry={entry} key={entry.taskId} />
                          ))}
                        </div>
                      )}
                    </section>
                  ))
                ) : (
                  <p className="patterns-empty">No {family.toLocaleLowerCase()} mistakes.</p>
                )}
                {showYellow && yellowCards.length ? (
                  <section className="rules-group" aria-labelledby="mistakes-group-yellow">
                    <header className="rules-group__head mistakes-group__head">
                      <div>
                        <h2 id="mistakes-group-yellow">
                          <span className="yellow-card" aria-hidden="true" /> Yellow cards <small>{yellowCards.length}</small>
                        </h2>
                        <p>Possible typos. They are not counted as mistakes.</p>
                      </div>
                    </header>
                    <div className="mistake-list">
                      {yellowCards.map((card) => (
                        <YellowCardRow card={card} key={card.id} />
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
