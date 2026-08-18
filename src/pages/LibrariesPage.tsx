import { useState } from 'react'
import { ImportLibraryPanel } from '../components/libraries/ImportLibraryPanel'
import { LibraryCard } from '../components/libraries/LibraryCard'
import { getLibraries } from '../services/libraryStorage'
import './libraries.css'

export function LibrariesPage() {
  const [libraries, setLibraries] = useState(getLibraries)
  const topics = ['All', ...new Set(libraries.map((library) => library.topic))]
  const [selectedTopic, setSelectedTopic] = useState('All')
  const visibleLibraries = selectedTopic === 'All' ? libraries : libraries.filter((library) => library.topic === selectedTopic)
  const totalWords = libraries.reduce((total, library) => total + library.words.length, 0)

  function refreshLibraries() {
    setLibraries(getLibraries())
  }

  return (
    <div className="libraries-page" id="libraries">
      <header className="libraries-header"><div><p className="eyebrow">Vocabulary system</p><h1>Libraries</h1><p>Choose a topic for focused practice or add your own vocabulary without mixing it into the default sets.</p></div><div className="library-total"><strong>{totalWords}</strong><span>words available</span></div></header>
      <ImportLibraryPanel onImported={refreshLibraries} />
      <div className="library-filter filter-tabs">{topics.map((topic) => <button type="button" className={selectedTopic === topic ? 'filter-tabs__active' : ''} onClick={() => setSelectedTopic(topic)} key={topic}>{topic}</button>)}</div>
      <section className="libraries-grid" aria-label="Word libraries">{visibleLibraries.map((library) => <LibraryCard library={library} key={library.id} />)}</section>
    </div>
  )
}
