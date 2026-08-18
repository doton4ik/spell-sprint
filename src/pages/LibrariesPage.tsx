import { useMemo, useState } from 'react'
import { ImportLibraryPanel } from '../components/libraries/ImportLibraryPanel'
import { LibraryCard } from '../components/libraries/LibraryCard'
import { deleteImportedLibrary, getLibraries, getTopicNames } from '../services/libraryStorage'
import './libraries.css'

export function LibrariesPage() {
  const [libraries, setLibraries] = useState(getLibraries)
  const [library, setLibrary] = useState('All'); const [topic, setTopic] = useState('All'); const [subtopic, setSubtopic] = useState('All'); const [difficulty, setDifficulty] = useState('All'); const [partOfSpeech, setPartOfSpeech] = useState('All')
  const words = libraries.flatMap((item) => item.words)
  const options = (values: string[]) => ['All', ...[...new Set(values.filter(Boolean))].sort()]
  const visibleLibraries = useMemo(() => libraries.map((item) => ({ ...item, words: item.words.filter((word) =>
    (library === 'All' || item.name === library) && (topic === 'All' || word.topic === topic) && (subtopic === 'All' || word.subtopic === subtopic) && (difficulty === 'All' || word.difficulty === difficulty) && (partOfSpeech === 'All' || word.partOfSpeech === partOfSpeech),
  ) })).filter((item) => item.words.length), [libraries, library, topic, subtopic, difficulty, partOfSpeech])
  function refreshLibraries() { setLibraries(getLibraries()) }
  function removeLibrary(id: string) { deleteImportedLibrary(id); refreshLibraries() }
  const select = (label: string, value: string, onChange: (value: string) => void, values: string[]) => <label className="library-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{values.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
  return <div className="libraries-page" id="libraries">
    <header className="libraries-header"><div><p className="eyebrow">Vocabulary system</p><h1>Libraries</h1><p>Import CSV vocabulary, then focus practice by library, topic, subtopic, level, or part of speech.</p></div><div className="library-total"><strong>{words.length}</strong><span>words available</span></div></header>
    <ImportLibraryPanel onImported={refreshLibraries} />
    <div className="library-filters" aria-label="Library filters">
      {select('Library', library, setLibrary, options(libraries.map((item) => item.name)))}
      {select('Topic', topic, setTopic, ['All', ...getTopicNames()])}
      {select('Subtopic', subtopic, setSubtopic, options(words.map((word) => word.subtopic)))}
      {select('Difficulty', difficulty, setDifficulty, ['All', 'easy', 'medium', 'hard'])}
      {select('Part of speech', partOfSpeech, setPartOfSpeech, options(words.map((word) => word.partOfSpeech)))}
    </div>
    <section className="libraries-grid" aria-label="Word libraries">{visibleLibraries.map((item) => <LibraryCard library={item} onDelete={removeLibrary} key={item.id} />)}</section>
  </div>
}
