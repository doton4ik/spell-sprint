import { useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { subscribeToLearningData } from '../services/learningData'
import { libraryGroups } from '../services/libraryGroups'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import { getTopicStats, pickPracticeWords, topicStatusLabels, type TopicStats } from '../services/topicStats'
import type { LibraryWord } from '../types/library'
import './topics.css'

type Sort = 'attention' | 'az' | 'progress'
const sortLabels: Record<Sort, string> = { attention: 'Needs attention', progress: 'Most progress', az: 'A–Z' }
const statusOrder = { 'needs-focus': 0, developing: 1, preliminary: 2, 'not-started': 3, strong: 4 }
const groupNames: Record<string, string> = { ...Object.fromEntries(libraryGroups.map((group) => [group.id, group.name])), other: 'My topics' }
const groupOrder = ['core-english', 'study-work', 'topics-interests', 'professional-vocabulary', 'other']

function practise(words: LibraryWord[], label: string) {
  setPendingPracticeSelection({ wordIds: pickPracticeWords(words).map((word) => word.wordId), label, mode: 'write-en' })
  window.location.hash = 'practice'
}

function sortTopics(topics: TopicStats[], sort: Sort) {
  return [...topics].sort((a, b) => sort === 'az' ? a.topic.localeCompare(b.topic)
    : sort === 'progress' ? b.practised / b.words.length - a.practised / a.words.length || a.topic.localeCompare(b.topic)
    : b.due - a.due || statusOrder[a.status] - statusOrder[b.status] || (a.accuracy ?? 101) - (b.accuracy ?? 101) || a.topic.localeCompare(b.topic))
}

export function TopicsPage() {
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeToLearningData(() => setRevision((value) => value + 1)), [])
  const topics = useMemo(getTopicStats, [revision])
  const [group, setGroup] = useState<string>('all')
  const [sort, setSort] = useState<Sort>('attention')
  const [query, setQuery] = useState('')
  const [openTopic, setOpenTopic] = useState<string | null>(null)

  const groups = ['all', ...groupOrder.filter((id) => topics.some((topic) => topic.groupId === id))]
  const needle = query.trim().toLocaleLowerCase()
  // Search matches topic names and their subtopics, so "restaurant" finds Food and Drinks.
  const matches = (topic: TopicStats) => !needle || topic.topic.toLocaleLowerCase().includes(needle) || topic.subtopics.some((sub) => sub.name.toLocaleLowerCase().includes(needle))
  const filtered = topics.filter((topic) => (group === 'all' || topic.groupId === group) && matches(topic))
  // In "All" the list is split by group, so a long list still has landmarks.
  const sections = group === 'all' && !needle
    ? groupOrder.map((id) => ({ id, topics: sortTopics(filtered.filter((topic) => topic.groupId === id), sort) })).filter((section) => section.topics.length)
    : [{ id: group, topics: sortTopics(filtered, sort) }]

  const started = topics.filter((topic) => topic.practised > 0).length
  const strong = topics.filter((topic) => topic.status === 'strong').length
  const dueTotal = topics.reduce((sum, topic) => sum + topic.due, 0)
  const focus = [...topics].filter((topic) => topic.status === 'needs-focus' || topic.due > 0).sort((a, b) => b.due - a.due || (a.accuracy ?? 100) - (b.accuracy ?? 100))[0]

  return (
    <div className="topics-page" id="topics">
      <header className="topics-header">
        <div><p className="eyebrow">Topic map</p><h1>Topics</h1><p>How well you know each theme, and what to practise next. Each session picks the words that need you most.</p></div>
        <dl className="topics-summary" aria-label="Topic overview">
          <div><dt>Started</dt><dd>{started}<small>/{topics.length}</small></dd></div>
          <div><dt>Strong</dt><dd>{strong}</dd></div>
          <div><dt>To review</dt><dd>{dueTotal}</dd></div>
        </dl>
      </header>

      {focus ? (
        <section className="topics-focus">
          <span className="topics-focus__icon"><Icon name="bolt" size={18} /></span>
          <p><strong>Suggested next: {focus.topic}.</strong> {focus.due ? `${focus.due} word${focus.due === 1 ? ' is' : 's are'} due for review.` : `Accuracy ${focus.accuracy}%.`}</p>
          <button className="check-button" type="button" onClick={() => practise(focus.words, `Topic: ${focus.topic}`)}><Icon name="practice" size={16} /> Practise</button>
        </section>
      ) : null}

      <div className="topics-toolbar">
        <label className="topics-search"><Icon name="search" size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a topic or subtopic…" aria-label="Find a topic" /></label>
        <label className="topics-sort"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>{(Object.keys(sortLabels) as Sort[]).map((item) => <option value={item} key={item}>{sortLabels[item]}</option>)}</select></label>
      </div>
      <nav className="topics-tabs" aria-label="Topic groups">{groups.map((id) => <button type="button" className={group === id ? 'topics-tabs__active' : ''} onClick={() => setGroup(id)} key={id}>{id === 'all' ? 'All' : groupNames[id]}</button>)}</nav>

      {sections.map((section) => (
        <section className="topics-section" key={section.id}>
          {sections.length > 1 ? <h2 className="topics-section__title">{groupNames[section.id]}<small>{section.topics.length}</small></h2> : null}
          <div className="topics-list">
            {section.topics.map((topic) => <TopicRow topic={topic} open={openTopic === topic.topic} onToggle={() => setOpenTopic(openTopic === topic.topic ? null : topic.topic)} key={topic.topic} />)}
          </div>
        </section>
      ))}
      {!filtered.length ? <p className="topics-empty">No topics match “{query}”.</p> : null}
    </div>
  )
}

function TopicRow({ topic, open, onToggle }: { topic: TopicStats; open: boolean; onToggle: () => void }) {
  const coverage = Math.round((topic.practised / topic.words.length) * 100)
  const knownShare = Math.round((topic.known / topic.words.length) * 100)
  return (
    <article className={`topic-line${open ? ' topic-line--open' : ''}`}>
      <div className="topic-line__main">
        <button className="topic-line__toggle" type="button" onClick={onToggle} aria-expanded={open}>
          <span className={`topic-dot topic-dot--${topic.status}`} title={topicStatusLabels[topic.status]} />
          <span className="topic-line__name">{topic.topic}<small>{topicStatusLabels[topic.status]}{topic.accuracy !== null ? ` · ${topic.accuracy}% of ${topic.answers} answer${topic.answers === 1 ? '' : 's'}` : ''}</small></span>
          <span className="topic-line__progress" aria-label={`${topic.practised} of ${topic.words.length} words practised`}>
            <span className="topic-line__bar"><i className="topic-line__bar-practised" style={{ width: `${coverage}%` }} /><i className="topic-line__bar-known" style={{ width: `${knownShare}%` }} /></span>
            <small>{topic.practised}/{topic.words.length}</small>
          </span>
          {topic.due ? <span className="topic-line__due">{topic.due} to review</span> : <span className="topic-line__due topic-line__due--none" />}
          <span className="topic-line__chevron" aria-hidden="true"><Icon name="chevron" size={16} /></span>
        </button>
        <button className="topic-line__play" type="button" onClick={() => practise(topic.words, `Topic: ${topic.topic}`)} aria-label={`Practise ${topic.topic}`} title="Practise 10 words"><Icon name="practice" size={16} /></button>
      </div>

      {open ? (
        <div className="topic-line__subtopics">
          {topic.subtopics.map((sub) => (
            <button type="button" className="subtopic-chip" onClick={() => practise(topic.words.filter((word) => (word.subtopic || 'General') === sub.name), `${topic.topic} · ${sub.name}`)} key={sub.name}>
              <span>{sub.name}</span>
              <small>{sub.practised}/{sub.words}{sub.due ? ` · ${sub.due} due` : ''}</small>
            </button>
          ))}
        </div>
      ) : null}
    </article>
  )
}
