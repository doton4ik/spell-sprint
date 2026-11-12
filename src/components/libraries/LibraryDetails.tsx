import { useMemo, useState } from 'react'
import { cefrLevels } from '../../data/libraryTopics'
import { filterShownWords, type LibraryViewFilter } from '../../services/libraryViewFilter'
import { partOfSpeechOptions, type LibraryDifficulty, type LibraryWord, type WordLibrary } from '../../types/library'
import type { Rule } from '../../types/rules'
import { LibraryViewFilterPanel, ViewFilterToggle } from './LibraryViewFilterPanel'
import { options } from './libraryHelpers'
import { HideButton, RuleChips, WordNoteLine } from './WordRows'

export type Details = { title: string; description: string; words: LibraryWord[]; library?: WordLibrary; restorable?: boolean }

export function LibraryDetails({
  details: rawDetails,
  viewFilter,
  onViewFilter,
  ruleMap,
  notice,
  onBack,
  onPractice,
  onDelete,
  onHide,
  onRestore,
}: {
  details: Details
  viewFilter: LibraryViewFilter
  onViewFilter: (filter: LibraryViewFilter) => void
  ruleMap: Map<string, Rule[]>
  notice: React.ReactNode
  onBack: () => void
  onPractice: (words: LibraryWord[], label: string) => void
  onDelete: (library: WordLibrary) => void
  onHide: (word: LibraryWord) => void
  onRestore: (word: LibraryWord) => void
}) {
  // The view filter only trims the lists; the page of hidden words always shows all of them.
  const details = useMemo(
    () => (rawDetails.restorable ? rawDetails : { ...rawDetails, words: filterShownWords(rawDetails.words, viewFilter) }),
    [rawDetails, viewFilter],
  )
  const [topic, setTopic] = useState('All')
  const [subtopic, setSubtopic] = useState('All')
  const [level, setLevel] = useState('All')
  const [difficulty, setDifficulty] = useState<'All' | LibraryDifficulty>('All')
  const [partOfSpeech, setPartOfSpeech] = useState('All')
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const topics = options(details.words.map((word) => word.topic))
  const subtopics = options(details.words.filter((word) => topic === 'All' || word.topic === topic).map((word) => word.subtopic))
  const visible = details.words.filter(
    (word) =>
      (topic === 'All' || word.topic === topic) &&
      (subtopic === 'All' || word.subtopic === subtopic) &&
      (level === 'All' || word.level === level) &&
      (difficulty === 'All' || word.difficulty === difficulty) &&
      (partOfSpeech === 'All' || word.partOfSpeech === partOfSpeech) &&
      `${word.word} ${word.translation}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  )
  const filterControls = (
    <div className="details-filters__controls">
      <Select
        label="Topic"
        value={topic}
        values={topics}
        onChange={(value) => {
          setTopic(value)
          setSubtopic('All')
        }}
      />
      <Select label="Subtopic" value={subtopic} values={subtopics} onChange={setSubtopic} />
      <Select label="Level" value={level} values={['All', ...cefrLevels]} onChange={setLevel} />
      <Select
        label="Spelling difficulty"
        value={difficulty}
        values={['All', 'easy', 'medium', 'hard']}
        onChange={(value) => setDifficulty(value as 'All' | LibraryDifficulty)}
      />
      <Select label="Part of speech" value={partOfSpeech} values={['All', ...partOfSpeechOptions]} onChange={setPartOfSpeech} />
    </div>
  )
  return (
    <div className="libraries-page library-details" id="libraries">
      <button className="back-button" type="button" onClick={onBack}>
        ← Back to Libraries
      </button>
      {notice}
      <header className="libraries-header">
        <div>
          <p className="eyebrow">Library details</p>
          <h1>{details.title}</h1>
          <p>{details.description}</p>
        </div>
        <div className="library-total">
          <strong>{details.words.length}</strong>
          <span>words in this view</span>
        </div>
      </header>
      <div className="details-actions">
        {details.restorable ? null : (
          <button className="check-button" type="button" onClick={() => onPractice(visible, details.title)}>
            Start practice
          </button>
        )}
        {rawDetails.restorable ? null : (
          <ViewFilterToggle filter={viewFilter} open={viewOpen} onToggle={() => setViewOpen((open) => !open)} />
        )}
        {details.library?.source === 'imported' ? (
          <button className="quiet-button" type="button" onClick={() => onDelete(details.library!)}>
            Delete library
          </button>
        ) : null}
      </div>
      {viewOpen && !rawDetails.restorable ? <LibraryViewFilterPanel filter={viewFilter} onChange={onViewFilter} /> : null}
      <section className="details-browser">
        <div className="details-browser__top">
          <div>
            <h2>Browse words</h2>
            <p>
              {topics.length - 1} topics · {new Set(details.words.map((word) => word.subtopic)).size} subtopics
            </p>
          </div>
          <button className="outline-action details-filter-toggle" type="button" onClick={() => setFiltersOpen(!filtersOpen)}>
            Filters
          </button>
        </div>
        <label className="word-search">
          <span>Search</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or Russian…" />
        </label>
        <div className={`details-filters${filtersOpen ? ' details-filters--open' : ''}`}>{filterControls}</div>
        <div className="word-list">
          {visible.map((word) => (
            <article className="word-row" key={word.wordId}>
              <div>
                <h3>{word.word}</h3>
                <p>{word.translation}</p>
                {word.example ? <small>{word.example}</small> : null}
                {word.definition ? <small>{word.definition}</small> : null}
                <WordNoteLine wordId={word.wordId} />
                <RuleChips rules={ruleMap.get(word.wordId)} />
              </div>
              <aside>
                <span>{word.topic}</span>
                <span>{word.subtopic}</span>
                <span>{word.partOfSpeech}</span>
                {details.restorable ? (
                  <button className="quiet-action" type="button" onClick={() => onRestore(word)}>
                    Restore
                  </button>
                ) : (
                  <HideButton word={word} onHide={onHide} />
                )}
              </aside>
            </article>
          ))}
          {visible.length === 0 ? <p className="no-words">No words match these filters.</p> : null}
        </div>
      </section>
    </div>
  )
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <label className="library-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}
