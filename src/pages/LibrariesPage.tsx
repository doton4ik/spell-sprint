import { useEffect, useMemo, useState } from 'react'
import { ImportLibraryPanel } from '../components/libraries/ImportLibraryPanel'
import { AddWordPanel } from '../components/libraries/AddWordPanel'
import { Icon } from '../components/icons/Icon'
import { libraryGroups, wordsForGroup, type LibraryGroup } from '../services/libraryGroups'
import { csvTemplate, deleteImportedLibrary, getEveryLibrary, getEveryWord, getLibraries } from '../services/libraryStorage'
import { getHiddenWordIds, getWordNote, setPackEnabled, setWordHidden } from '../services/libraryPrefs'
import { libraryPacks, type LibraryPack } from '../data/libraryPacks'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import { getAllRuleWordLinks, getVisibleRules, setPendingRuleFocus } from '../services/rulesService'
import { partOfSpeechOptions, type LibraryDifficulty, type LibraryWord, type WordLibrary } from '../types/library'
import type { Rule } from '../types/rules'
import './libraries.css'

type Details = { title: string; description: string; words: LibraryWord[]; library?: WordLibrary }
type Tab = LibraryGroup['id'] | 'packs'

function HideButton({ word, onHide }: { word: LibraryWord; onHide: (word: LibraryWord) => void }) {
  return <button className="quiet-action word-hide" type="button" onClick={() => onHide(word)} title="Remove this word from your practice. You can restore it in My Libraries."><Icon name="eye" size={13} /> Hide</button>
}

// Every word's linked rules, keyed by wordId — loaded once so neither the search box nor the
// details view has to make one network call per word.
function useWordRuleMap() {
  const [map, setMap] = useState<Map<string, Rule[]>>(new Map())
  useEffect(() => {
    let cancelled = false
    Promise.all([getVisibleRules(), getAllRuleWordLinks()]).then(([rules, links]) => {
      if (cancelled) return
      const rulesById = new Map(rules.map((rule) => [rule.id, rule]))
      const next = new Map<string, Rule[]>()
      for (const link of links) {
        const rule = rulesById.get(link.ruleId)
        if (!rule) continue
        next.set(link.wordId, [...(next.get(link.wordId) ?? []), rule])
      }
      setMap(next)
    })
    return () => { cancelled = true }
  }, [])
  return map
}

function WordNoteLine({ wordId }: { wordId: string }) {
  const note = getWordNote(wordId)
  return note ? <small className="word-note-line"><strong>Your tip:</strong> {note}</small> : null
}

function goToRule(rule: Rule) { setPendingRuleFocus(rule.id); window.location.hash = 'rules' }

function RuleChips({ rules }: { rules?: Rule[] }) {
  if (!rules?.length) return null
  return <div className="word-rule-chips">{rules.map((rule) => <button type="button" className="word-rule-chip" onClick={() => goToRule(rule)} key={rule.id}><Icon name="rules" size={12} /> {rule.title}</button>)}</div>
}

export function LibrariesPage() {
  const [libraries, setLibraries] = useState(getLibraries)
  const [activeGroup, setActiveGroup] = useState<Tab>('core-english')
  const [notice, setNotice] = useState<{ text: string; undo?: () => void } | null>(null)
  const [details, setDetails] = useState<Details | null>(null)
  const [query, setQuery] = useState('')
  const ruleMap = useWordRuleMap()
  const groups = libraryGroups.filter((group) => group.id !== 'all')
  const allWords = useMemo(() => uniqueWords(libraries.flatMap((library) => library.words)), [libraries])
  const totalWords = allWords.length
  const selectedGroup = libraryGroups.find((group) => group.id === activeGroup)
  const cards = activeGroup === 'all' ? groups.filter((group) => !group.personal) : selectedGroup ? [selectedGroup] : []
  const refresh = () => setLibraries(getLibraries())
  const hideWord = (word: LibraryWord) => {
    setWordHidden(word.wordId, true); refresh()
    setDetails((current) => current ? { ...current, words: current.words.filter((item) => item.wordId !== word.wordId) } : current)
    setNotice({ text: `“${word.word}” is hidden and will not appear in practice.`, undo: () => { setWordHidden(word.wordId, false); refresh(); setNotice(null) } })
  }
  const togglePack = (pack: LibraryPack, on: boolean) => {
    setPackEnabled(pack.id, on); refresh()
    setNotice({ text: on ? `“${pack.name}” added: its words now appear in practice and in your daily plan.` : `“${pack.name}” removed from practice. Your history with these words is kept.`, undo: () => { setPackEnabled(pack.id, !on); refresh(); setNotice(null) } })
  }
  const previewPack = (pack: LibraryPack) => setDetails({ title: pack.name, description: pack.description, words: uniqueWords(getEveryLibrary().filter((library) => pack.libraries.includes(library.name)).flatMap((library) => library.words)) })
  const openGroup = (group: LibraryGroup) => setDetails({ title: group.name, description: group.description, words: wordsForGroup(group, libraries) })
  const openLibrary = (library: WordLibrary) => setDetails({ title: library.name, description: library.source === 'imported' ? 'Your imported vocabulary library.' : 'Built-in vocabulary library.', words: library.words, library })
  const beginPractice = (words: LibraryWord[], label: string) => { setPendingPracticeSelection({ wordIds: uniqueWords(words).map((word) => word.wordId), label }); window.location.hash = 'practice' }
  const downloadTemplate = () => { const url = URL.createObjectURL(new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'spell-sprint-library-template.csv'; link.click(); URL.revokeObjectURL(url) }
  const remove = (library: WordLibrary) => { if (window.confirm(`Delete “${library.name}”? This removes this imported library from all your devices. Built-in words are not affected.`)) { deleteImportedLibrary(library.id); refresh(); setDetails(null) } }
  const openWordsLibrary = (word: LibraryWord) => { const library = libraries.find((item) => item.name === word.library); if (library) openLibrary(library) }

  const trimmedQuery = query.trim().toLocaleLowerCase()
  const searchResults = useMemo(() => {
    if (trimmedQuery.length < 2) return []
    return allWords.filter((word) => `${word.word} ${word.translation} ${word.topic} ${word.subtopic}`.toLocaleLowerCase().includes(trimmedQuery)).slice(0, 60)
  }, [allWords, trimmedQuery])

  const noticeBar = notice ? <p className="library-notice" role="status">{notice.text}{notice.undo ? <button type="button" onClick={notice.undo}>Undo</button> : null}<button type="button" aria-label="Close" onClick={() => setNotice(null)}>×</button></p> : null
  if (details) return <LibraryDetails details={details} ruleMap={ruleMap} notice={noticeBar} onBack={() => { setDetails(null); setNotice(null) }} onPractice={beginPractice} onDelete={remove} onHide={hideWord} />
  return <div className="libraries-page" id="libraries">
    <header className="libraries-header"><div><p className="eyebrow">Vocabulary system</p><h1>Libraries</h1><p>Search across every word, or browse by group, topic, and subtopic.</p></div><div className="library-total"><strong>{totalWords}</strong><span>words available</span></div></header>
    {noticeBar}
    <label className="global-word-search"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search any word, translation, or topic across all libraries…" /></label>
    {trimmedQuery.length >= 2 ? (
      <section className="search-results">
        <p className="search-results__count">{searchResults.length} result{searchResults.length === 1 ? '' : 's'} for “{query.trim()}”</p>
        {searchResults.length === 0 ? <p className="no-words">No words match this search.</p> : <div className="word-list">{searchResults.map((word) => (
          <article className="word-row" key={word.wordId}>
            <div><h3>{word.word}</h3><p>{word.translation}</p>{word.example ? <small>{word.example}</small> : null}<WordNoteLine wordId={word.wordId} /><RuleChips rules={ruleMap.get(word.wordId)} /></div>
            <aside><span>{word.topic}</span>{word.subtopic ? <span>{word.subtopic}</span> : null}<div className="word-row__actions"><button className="quiet-action" type="button" onClick={() => openWordsLibrary(word)}>Open library</button><button className="quiet-action" type="button" onClick={() => beginPractice([word], word.word)}><Icon name="practice" size={13} /> Practice</button><HideButton word={word} onHide={hideWord} /></div></aside>
          </article>
        ))}</div>}
      </section>
    ) : (
      <>
        <div className="libraries-actions"><button className="check-button" type="button" onClick={() => beginPractice(allWords, 'All libraries')}><Icon name="practice" size={17} /> Practice all words</button><button className="template-button" type="button" onClick={() => setActiveGroup('my-libraries')}>Add a word</button><button className="template-button" type="button" onClick={() => setActiveGroup('my-libraries')}>Import CSV</button><button className="template-button" type="button" onClick={downloadTemplate}>CSV template</button></div>
        <nav className="library-tabs" aria-label="Library groups">{libraryGroups.map((group) => <button type="button" className={activeGroup === group.id ? 'library-tabs__active' : ''} onClick={() => setActiveGroup(group.id)} key={group.id}>{group.name}</button>)}<button type="button" className={activeGroup === 'packs' ? 'library-tabs__active' : ''} onClick={() => setActiveGroup('packs')}>Add-on packs</button></nav>
        {activeGroup === 'packs' ? <PackList libraries={libraries} onToggle={togglePack} onPreview={previewPack} /> : activeGroup === 'my-libraries' ? <><AddWordPanel onAdded={refresh} onPractise={(wordId, word) => { setPendingPracticeSelection({ wordIds: [wordId], label: word }); window.location.hash = 'practice' }} /><MyLibraries libraries={libraries.filter((library) => library.source === 'imported')} onOpen={openLibrary} onPractice={beginPractice} onDelete={remove} onImported={refresh} /><HiddenWords libraries={libraries} onRestore={(word) => { setWordHidden(word.wordId, false); refresh() }} /></> : <section className="library-groups">{cards.map((group) => <GroupCard group={group} libraries={libraries} onOpen={openGroup} onPractice={beginPractice} key={group.id} />)}</section>}
      </>
    )}
  </div>
}

function GroupCard({ group, libraries, onOpen, onPractice }: { group: LibraryGroup; libraries: WordLibrary[]; onOpen: (group: LibraryGroup) => void; onPractice: (words: LibraryWord[], label: string) => void }) {
  const words = wordsForGroup(group, libraries); const topics = new Set(words.map((word) => word.topic)); const examples = words.slice(0, 5)
  return <article className="group-card"><span className="group-card__eyebrow">Vocabulary group</span><h2>{group.name}</h2><p>{group.description}</p><div className="group-card__stats"><strong>{words.length}<small>words</small></strong><strong>{topics.size}<small>topics</small></strong></div><div className="group-card__examples">{examples.map((word) => <span key={word.wordId}>{word.word}</span>)}</div><div className="group-card__actions"><button className="outline-action" type="button" onClick={() => onOpen(group)}>Open <Icon name="arrow" size={16} /></button><button className="check-button" type="button" onClick={() => onPractice(words, group.name)}>Practice</button></div></article>
}

function MyLibraries({ libraries, onOpen, onPractice, onDelete, onImported }: { libraries: WordLibrary[]; onOpen: (library: WordLibrary) => void; onPractice: (words: LibraryWord[], label: string) => void; onDelete: (library: WordLibrary) => void; onImported: () => void }) {
  return <section className="my-libraries"><ImportLibraryPanel onImported={onImported} />{libraries.length ? <div className="personal-library-list">{libraries.map((library) => <article className="personal-library" key={library.id}><div><span>Imported library</span><h2>{library.name}</h2><p>{library.words.length} words · updated {library.createdAt ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(library.createdAt)) : 'recently'}</p></div><div><button className="outline-action" type="button" onClick={() => onOpen(library)}>Open</button><button className="check-button" type="button" onClick={() => onPractice(library.words, library.name)}>Practice</button><button className="quiet-button" type="button" onClick={() => onDelete(library)}>Delete</button></div></article>)}</div> : <div className="libraries-empty"><Icon name="library" size={25} /><h2>You have no personal libraries yet.</h2><p>Import a CSV library to keep your own vocabulary here.</p></div>}</section>
}

function LibraryDetails({ details, ruleMap, notice, onBack, onPractice, onDelete, onHide }: { details: Details; ruleMap: Map<string, Rule[]>; notice: React.ReactNode; onBack: () => void; onPractice: (words: LibraryWord[], label: string) => void; onDelete: (library: WordLibrary) => void; onHide: (word: LibraryWord) => void }) {
  const [topic, setTopic] = useState('All'); const [subtopic, setSubtopic] = useState('All'); const [difficulty, setDifficulty] = useState<'All' | LibraryDifficulty>('All'); const [partOfSpeech, setPartOfSpeech] = useState('All'); const [search, setSearch] = useState(''); const [filtersOpen, setFiltersOpen] = useState(false)
  const topics = options(details.words.map((word) => word.topic)); const subtopics = options(details.words.filter((word) => topic === 'All' || word.topic === topic).map((word) => word.subtopic))
  const visible = details.words.filter((word) => (topic === 'All' || word.topic === topic) && (subtopic === 'All' || word.subtopic === subtopic) && (difficulty === 'All' || word.difficulty === difficulty) && (partOfSpeech === 'All' || word.partOfSpeech === partOfSpeech) && `${word.word} ${word.translation}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
  const filterControls = <div className="details-filters__controls"><Select label="Topic" value={topic} values={topics} onChange={(value) => { setTopic(value); setSubtopic('All') }} /><Select label="Subtopic" value={subtopic} values={subtopics} onChange={setSubtopic} /><Select label="Difficulty" value={difficulty} values={['All', 'easy', 'medium', 'hard']} onChange={(value) => setDifficulty(value as 'All' | LibraryDifficulty)} /><Select label="Part of speech" value={partOfSpeech} values={['All', ...partOfSpeechOptions]} onChange={setPartOfSpeech} /></div>
  return <div className="libraries-page library-details" id="libraries"><button className="back-button" type="button" onClick={onBack}>← Back to Libraries</button>{notice}<header className="libraries-header"><div><p className="eyebrow">Library details</p><h1>{details.title}</h1><p>{details.description}</p></div><div className="library-total"><strong>{details.words.length}</strong><span>words in this view</span></div></header><div className="details-actions"><button className="check-button" type="button" onClick={() => onPractice(visible, details.title)}>Start practice</button>{details.library?.source === 'imported' ? <button className="quiet-button" type="button" onClick={() => onDelete(details.library!)}>Delete library</button> : null}</div><section className="details-browser"><div className="details-browser__top"><div><h2>Browse words</h2><p>{topics.length - 1} topics · {new Set(details.words.map((word) => word.subtopic)).size} subtopics</p></div><button className="outline-action details-filter-toggle" type="button" onClick={() => setFiltersOpen(!filtersOpen)}>Filters</button></div><label className="word-search"><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or Russian…" /></label><div className={`details-filters${filtersOpen ? ' details-filters--open' : ''}`}>{filterControls}</div><div className="word-list">{visible.map((word) => <article className="word-row" key={word.wordId}><div><h3>{word.word}</h3><p>{word.translation}</p>{word.example ? <small>{word.example}</small> : null}{word.definition ? <small>{word.definition}</small> : null}<WordNoteLine wordId={word.wordId} /><RuleChips rules={ruleMap.get(word.wordId)} /></div><aside><span>{word.topic}</span><span>{word.subtopic}</span><span>{word.partOfSpeech}</span><HideButton word={word} onHide={onHide} /></aside></article>)}{visible.length === 0 ? <p className="no-words">No words match these filters.</p> : null}</div></section></div>
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) { return <label className="library-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option value={item} key={item}>{item}</option>)}</select></label> }
function options(values: string[]) { return ['All', ...[...new Set(values.filter(Boolean))].sort()] }
function uniqueWords(words: LibraryWord[]) { const seen = new Set<string>(); return words.filter((word) => { if (seen.has(word.wordId)) return false; seen.add(word.wordId); return true }) }

function PackList({ libraries, onToggle, onPreview }: { libraries: WordLibrary[]; onToggle: (pack: LibraryPack, on: boolean) => void; onPreview: (pack: LibraryPack) => void }) {
  const every = getEveryLibrary()
  const activeNames = new Set(libraries.map((library) => library.name))
  return <section className="pack-list">
    <p className="pack-list__intro">The base library covers everyday English. Add a pack when you need the words of a special field: its words join practice, the daily plan and Topics. Removing a pack keeps your history.</p>
    {libraryPacks.map((pack) => {
      const words = uniqueWords(every.filter((library) => pack.libraries.includes(library.name)).flatMap((library) => library.words))
      if (!words.length) return null
      const on = pack.libraries.some((name) => activeNames.has(name))
      return <article className={`pack-card${on ? ' pack-card--on' : ''}`} key={pack.id}>
        <div><span className="pack-card__eyebrow">{on ? 'In your library' : 'Add-on pack'}</span><h2>{pack.name}</h2><p>{pack.description}</p><div className="group-card__examples">{words.slice(0, 6).map((word) => <span key={word.wordId}>{word.word}</span>)}</div></div>
        <div className="pack-card__actions"><strong>{words.length}<small>words</small></strong><button className="template-button" type="button" onClick={() => onPreview(pack)}>Preview</button>{on ? <button className="quiet-button" type="button" onClick={() => onToggle(pack, false)}>Remove</button> : <button className="check-button" type="button" onClick={() => onToggle(pack, true)}>Add</button>}</div>
      </article>
    })}
  </section>
}

function HiddenWords({ libraries, onRestore }: { libraries: WordLibrary[]; onRestore: (word: LibraryWord) => void }) {
  void libraries // re-render after a change
  const hidden = getHiddenWordIds()
  const words = getEveryWord().filter((word) => hidden.has(word.wordId))
  if (!words.length) return null
  return <section className="hidden-words"><h2>Hidden words <small>{words.length}</small></h2><p>These words do not appear in practice or in your daily plan.</p><div className="hidden-words__list">{words.map((word) => <span className="hidden-word" key={word.wordId}><strong>{word.word}</strong> {word.translation}<button type="button" onClick={() => onRestore(word)}>Restore</button></span>)}</div></section>
}
