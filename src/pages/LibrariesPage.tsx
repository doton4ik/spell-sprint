import { useMemo, useState } from 'react'
import { ImportLibraryPanel } from '../components/libraries/ImportLibraryPanel'
import { Icon } from '../components/icons/Icon'
import { libraryGroups, wordsForGroup, type LibraryGroup } from '../services/libraryGroups'
import { csvTemplate, deleteImportedLibrary, getLibraries } from '../services/libraryStorage'
import { setPendingPracticeSelection } from '../services/libraryPractice'
import { partOfSpeechOptions, type LibraryDifficulty, type LibraryWord, type WordLibrary } from '../types/library'
import './libraries.css'

type Details = { title: string; description: string; words: LibraryWord[]; library?: WordLibrary }
const allOption = ['All']

export function LibrariesPage() {
  const [libraries, setLibraries] = useState(getLibraries)
  const [activeGroup, setActiveGroup] = useState<LibraryGroup['id']>('core-english')
  const [details, setDetails] = useState<Details | null>(null)
  const groups = libraryGroups.filter((group) => group.id !== 'all')
  const totalWords = useMemo(() => uniqueWords(libraries.flatMap((library) => library.words)).length, [libraries])
  const selectedGroup = libraryGroups.find((group) => group.id === activeGroup)!
  const cards = activeGroup === 'all' ? groups.filter((group) => !group.personal) : [selectedGroup]
  const refresh = () => setLibraries(getLibraries())
  const openGroup = (group: LibraryGroup) => setDetails({ title: group.name, description: group.description, words: wordsForGroup(group, libraries) })
  const openLibrary = (library: WordLibrary) => setDetails({ title: library.name, description: library.source === 'imported' ? 'Your imported vocabulary library.' : 'Built-in vocabulary library.', words: library.words, library })
  const beginPractice = (words: LibraryWord[], label: string) => { setPendingPracticeSelection({ wordIds: uniqueWords(words).map((word) => word.wordId), label }); window.location.hash = 'practice' }
  const downloadTemplate = () => { const url = URL.createObjectURL(new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'spell-sprint-library-template.csv'; link.click(); URL.revokeObjectURL(url) }
  const remove = (library: WordLibrary) => { if (window.confirm(`Delete “${library.name}”? This removes only this imported library from this device.`)) { deleteImportedLibrary(library.id); refresh(); setDetails(null) } }

  if (details) return <LibraryDetails details={details} onBack={() => setDetails(null)} onPractice={beginPractice} onDelete={remove} />
  return <div className="libraries-page" id="libraries">
    <header className="libraries-header"><div><p className="eyebrow">Vocabulary system</p><h1>Libraries</h1><p>Browse vocabulary by group, topic, and subtopic. Open a library to review words before starting practice.</p></div><div className="library-total"><strong>{totalWords}</strong><span>words available</span></div></header>
    <div className="libraries-actions"><button className="check-button" type="button" onClick={() => beginPractice(uniqueWords(libraries.flatMap((library) => library.words)), 'All libraries')}><Icon name="practice" size={17} /> Practice all words</button><button className="template-button" type="button" onClick={() => setActiveGroup('my-libraries')}>Import CSV</button><button className="template-button" type="button" onClick={downloadTemplate}>CSV template</button></div>
    <nav className="library-tabs" aria-label="Library groups">{libraryGroups.map((group) => <button type="button" className={activeGroup === group.id ? 'library-tabs__active' : ''} onClick={() => setActiveGroup(group.id)} key={group.id}>{group.name}</button>)}</nav>
    {activeGroup === 'my-libraries' ? <MyLibraries libraries={libraries.filter((library) => library.source === 'imported')} onOpen={openLibrary} onPractice={beginPractice} onDelete={remove} onImported={refresh} /> : <section className="library-groups">{cards.map((group) => <GroupCard group={group} libraries={libraries} onOpen={openGroup} onPractice={beginPractice} key={group.id} />)}</section>}
  </div>
}

function GroupCard({ group, libraries, onOpen, onPractice }: { group: LibraryGroup; libraries: WordLibrary[]; onOpen: (group: LibraryGroup) => void; onPractice: (words: LibraryWord[], label: string) => void }) {
  const words = wordsForGroup(group, libraries); const topics = new Set(words.map((word) => word.topic)); const examples = words.slice(0, 5)
  return <article className="group-card"><span className="group-card__eyebrow">Vocabulary group</span><h2>{group.name}</h2><p>{group.description}</p><div className="group-card__stats"><strong>{words.length}<small>words</small></strong><strong>{topics.size}<small>topics</small></strong></div><div className="group-card__examples">{examples.map((word) => <span key={word.wordId}>{word.word}</span>)}</div><div className="group-card__actions"><button className="outline-action" type="button" onClick={() => onOpen(group)}>Open <Icon name="arrow" size={16} /></button><button className="check-button" type="button" onClick={() => onPractice(words, group.name)}>Practice</button></div></article>
}

function MyLibraries({ libraries, onOpen, onPractice, onDelete, onImported }: { libraries: WordLibrary[]; onOpen: (library: WordLibrary) => void; onPractice: (words: LibraryWord[], label: string) => void; onDelete: (library: WordLibrary) => void; onImported: () => void }) {
  return <section className="my-libraries"><ImportLibraryPanel onImported={onImported} />{libraries.length ? <div className="personal-library-list">{libraries.map((library) => <article className="personal-library" key={library.id}><div><span>Imported library</span><h2>{library.name}</h2><p>{library.words.length} words · updated {library.createdAt ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(library.createdAt)) : 'recently'}</p></div><div><button className="outline-action" type="button" onClick={() => onOpen(library)}>Open</button><button className="check-button" type="button" onClick={() => onPractice(library.words, library.name)}>Practice</button><button className="quiet-button" type="button" onClick={() => onDelete(library)}>Delete</button></div></article>)}</div> : <div className="libraries-empty"><Icon name="library" size={25} /><h2>You have no personal libraries yet.</h2><p>Import a CSV library to keep your own vocabulary here.</p></div>}</section>
}

function LibraryDetails({ details, onBack, onPractice, onDelete }: { details: Details; onBack: () => void; onPractice: (words: LibraryWord[], label: string) => void; onDelete: (library: WordLibrary) => void }) {
  const [topic, setTopic] = useState('All'); const [subtopic, setSubtopic] = useState('All'); const [difficulty, setDifficulty] = useState<'All' | LibraryDifficulty>('All'); const [partOfSpeech, setPartOfSpeech] = useState('All'); const [search, setSearch] = useState(''); const [filtersOpen, setFiltersOpen] = useState(false)
  const topics = options(details.words.map((word) => word.topic)); const subtopics = options(details.words.filter((word) => topic === 'All' || word.topic === topic).map((word) => word.subtopic))
  const visible = details.words.filter((word) => (topic === 'All' || word.topic === topic) && (subtopic === 'All' || word.subtopic === subtopic) && (difficulty === 'All' || word.difficulty === difficulty) && (partOfSpeech === 'All' || word.partOfSpeech === partOfSpeech) && `${word.word} ${word.translation}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
  const filterControls = <div className="details-filters__controls"><Select label="Topic" value={topic} values={topics} onChange={(value) => { setTopic(value); setSubtopic('All') }} /><Select label="Subtopic" value={subtopic} values={subtopics} onChange={setSubtopic} /><Select label="Difficulty" value={difficulty} values={['All', 'easy', 'medium', 'hard']} onChange={(value) => setDifficulty(value as 'All' | LibraryDifficulty)} /><Select label="Part of speech" value={partOfSpeech} values={['All', ...partOfSpeechOptions]} onChange={setPartOfSpeech} /></div>
  return <div className="libraries-page library-details" id="libraries"><button className="back-button" type="button" onClick={onBack}>← Back to Libraries</button><header className="libraries-header"><div><p className="eyebrow">Library details</p><h1>{details.title}</h1><p>{details.description}</p></div><div className="library-total"><strong>{details.words.length}</strong><span>words in this view</span></div></header><div className="details-actions"><button className="check-button" type="button" onClick={() => onPractice(visible, details.title)}>Start practice</button>{details.library?.source === 'imported' ? <button className="quiet-button" type="button" onClick={() => onDelete(details.library!)}>Delete library</button> : null}</div><section className="details-browser"><div className="details-browser__top"><div><h2>Browse words</h2><p>{topics.length - 1} topics · {new Set(details.words.map((word) => word.subtopic)).size} subtopics</p></div><button className="outline-action details-filter-toggle" type="button" onClick={() => setFiltersOpen(!filtersOpen)}>Filters</button></div><label className="word-search"><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search English or Russian…" /></label><div className={`details-filters${filtersOpen ? ' details-filters--open' : ''}`}>{filterControls}</div><div className="word-list">{visible.map((word) => <article className="word-row" key={word.wordId}><div><h3>{word.word}</h3><p>{word.translation}</p>{word.example ? <small>{word.example}</small> : null}{word.definition ? <small>{word.definition}</small> : null}</div><aside><span>{word.topic}</span><span>{word.subtopic}</span><span>{word.partOfSpeech}</span></aside></article>)}{visible.length === 0 ? <p className="no-words">No words match these filters.</p> : null}</div></section></div>
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) { return <label className="library-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option value={item} key={item}>{item}</option>)}</select></label> }
function options(values: string[]) { return ['All', ...[...new Set(values.filter(Boolean))].sort()] }
function uniqueWords(words: LibraryWord[]) { const seen = new Set<string>(); return words.filter((word) => { if (seen.has(word.wordId)) return false; seen.add(word.wordId); return true }) }
