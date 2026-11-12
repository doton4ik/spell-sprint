import { useMemo, useRef, useState } from 'react'
import { AddWordPanel } from '../components/libraries/AddWordPanel'
import { GroupCard } from '../components/libraries/GroupCard'
import { HiddenWords } from '../components/libraries/HiddenWords'
import { LibraryDetails, type Details } from '../components/libraries/LibraryDetails'
import { uniqueWords } from '../components/libraries/libraryHelpers'
import { LibrarySetup } from '../components/libraries/LibrarySetup'
import { MyLibraries } from '../components/libraries/MyLibraries'
import { PackList } from '../components/libraries/PackList'
import { SearchRow } from '../components/libraries/WordRows'
import { useWordRuleMap } from '../components/libraries/useWordRuleMap'
import { Icon } from '../components/icons/Icon'
import { noAutocorrect } from '../components/noAutocorrect'
import { useConfirm } from '../hooks/useConfirm'
import { libraryGroups, wordsForGroup, type LibraryGroup } from '../services/libraryGroups'
import { libraryTopics } from '../data/libraryTopics'
import { csvTemplate, deleteImportedLibrary, getEveryLibrary, getLibraries } from '../services/libraryStorage'
import { getHiddenWordIds, hideKey, setPackEnabled, setWordHidden } from '../services/libraryPrefs'
import { wordsOfPack, type LibraryPack } from '../data/libraryPacks'
import { openPracticeWith } from '../services/libraryPractice'
import type { LibraryWord, WordLibrary } from '../types/library'
import './libraries.css'
import { LibrariesRail } from '../components/ui/PageRails'
import { buildWordIndex, searchWords } from '../services/wordSearch'
import { LibraryViewFilterPanel, ViewFilterToggle } from '../components/libraries/LibraryViewFilterPanel'
import { filterShownWords, getViewFilter, saveViewFilter, type LibraryViewFilter } from '../services/libraryViewFilter'

type Tab = LibraryGroup['id'] | 'packs'

export function LibrariesPage() {
  const [libraries, setLibraries] = useState(getLibraries)
  const [activeGroup, setActiveGroup] = useState<Tab>('everyday-life')
  const [notice, setNotice] = useState<{ text: string; undo?: () => void } | null>(null)
  const { ask, dialog } = useConfirm()
  const [details, setDetails] = useState<Details | null>(null)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState<string | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const [tuning, setTuning] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const ruleMap = useWordRuleMap()
  const groups = libraryGroups.filter((group) => group.id !== 'all')
  const [viewFilter, setViewFilterState] = useState(getViewFilter)
  const setViewFilter = (next: LibraryViewFilter) => {
    setViewFilterState(next)
    saveViewFilter(next)
  }
  const allWords = useMemo(
    () => filterShownWords(uniqueWords(libraries.flatMap((library) => library.words)), viewFilter),
    [libraries, viewFilter],
  )
  const totalWords = allWords.length
  const selectedGroup = libraryGroups.find((group) => group.id === activeGroup)
  // A section tab shows its topics as separate cards (one card for a whole section was only a button to the same list).
  const sectionHidden = selectedGroup ? getHiddenWordIds().has(hideKey.group(selectedGroup.id)) : false
  const topicCards: LibraryGroup[] =
    selectedGroup && !selectedGroup.personal && selectedGroup.id !== 'all' && !sectionHidden
      ? libraryTopics
          .filter((topic) => topic.section === selectedGroup.id)
          .map((topic) => ({ id: selectedGroup.id, name: topic.name, description: topic.about, topics: [topic.name] }))
      : []
  const cards =
    activeGroup === 'all'
      ? groups.filter((group) => !group.personal)
      : topicCards.length > 1
        ? topicCards
        : selectedGroup
          ? [selectedGroup]
          : []
  const showingTopics = cards === topicCards
  const refresh = () => setLibraries(getLibraries())
  // "Delete" on a topic card: the topic leaves the Library lists; bring it back with Undo or in the filter panel.
  const deleteTopic = (name: string) => {
    const before = viewFilter
    setViewFilter({ ...before, topics: [...new Set([...before.topics, name])] })
    setNotice({
      text: `“${name}” is removed from the Library lists. Bring it back in “Show or hide levels and topics”.`,
      undo: () => {
        setViewFilter(before)
        setNotice(null)
      },
    })
  }
  const hideWord = (word: LibraryWord) => {
    setWordHidden(word.wordId, true)
    refresh()
    setDetails((current) => (current ? { ...current, words: current.words.filter((item) => item.wordId !== word.wordId) } : current))
    setNotice({
      text: `“${word.word}” is hidden and will not appear in practice.`,
      undo: () => {
        setWordHidden(word.wordId, false)
        refresh()
        setNotice(null)
      },
    })
  }
  // Hide or show a whole library (a vocabulary group or one of the learner's own libraries).
  const setLibraryHidden = (key: string, name: string, hide: boolean) => {
    setWordHidden(key, hide)
    refresh()
    setNotice({
      text: hide
        ? `“${name}” is hidden: its words stay out of practice and the daily plan. Your history is kept.`
        : `“${name}” is back in practice and in the daily plan.`,
      undo: () => {
        setWordHidden(key, !hide)
        refresh()
        setNotice(null)
      },
    })
  }
  const togglePack = (pack: LibraryPack, on: boolean) => {
    setPackEnabled(pack.id, on)
    refresh()
    setNotice({
      text: on
        ? `“${pack.name}” added: its words now appear in practice and in your daily plan.`
        : `“${pack.name}” removed from practice. Your history with these words is kept.`,
      undo: () => {
        setPackEnabled(pack.id, !on)
        refresh()
        setNotice(null)
      },
    })
  }
  const previewPack = (pack: LibraryPack) =>
    setDetails({
      title: pack.name,
      description: pack.description,
      words: wordsOfPack(pack, getEveryLibrary()),
    })
  const openGroup = (group: LibraryGroup) =>
    setDetails({ title: group.name, description: group.description, words: wordsForGroup(group, libraries) })
  const openLibrary = (library: WordLibrary) =>
    setDetails({
      title: library.name,
      description: library.source === 'imported' ? 'Your imported vocabulary library.' : 'Built-in vocabulary library.',
      words: library.words,
      library,
    })
  const beginPractice = (words: LibraryWord[], label: string) => {
    openPracticeWith({ wordIds: uniqueWords(words).map((word) => word.wordId), label })
  }
  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'spell-sprint-library-template.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  const remove = async (library: WordLibrary) => {
    const yes = await ask({
      title: `Delete “${library.name}”?`,
      message: 'This removes this imported library from all your devices. Built-in words are not affected.',
      confirmLabel: 'Delete library',
    })
    if (yes) {
      deleteImportedLibrary(library.id)
      refresh()
      setDetails(null)
    }
  }
  const openWordsLibrary = (word: LibraryWord) => {
    const library = libraries.find((item) => item.name === word.library)
    if (library) openLibrary(library)
  }

  // One box finds a word (even misspelled) or offers to add it. It looks in every word of the active libraries, also
  // those switched off by the view filter, and says so on the row.
  const trimmedQuery = query.trim()
  const wordIndex = useMemo(() => buildWordIndex(uniqueWords(libraries.flatMap((library) => library.words))), [libraries])
  const search = useMemo(() => searchWords(wordIndex, trimmedQuery), [wordIndex, trimmedQuery])
  const focusSearch = () => {
    setActiveGroup((group) => (group === 'my-libraries' ? 'everyday-life' : group))
    searchInput.current?.focus()
    searchInput.current?.scrollIntoView({ block: 'center' })
  }

  const noticeBar = notice ? (
    <p className="library-notice" role="status">
      {notice.text}
      {notice.undo ? (
        <button type="button" onClick={notice.undo}>
          Undo
        </button>
      ) : null}
      <button type="button" aria-label="Close" onClick={() => setNotice(null)}>
        ×
      </button>
    </p>
  ) : null
  if (details)
    return (
      <>
        <LibraryDetails
          details={details}
          viewFilter={viewFilter}
          onViewFilter={setViewFilter}
          ruleMap={ruleMap}
          notice={noticeBar}
          onBack={() => {
            setDetails(null)
            setNotice(null)
          }}
          onPractice={beginPractice}
          onDelete={remove}
          onHide={hideWord}
          onRestore={(word) => {
            setWordHidden(word.wordId, false)
            setDetails({ ...details, words: details.words.filter((entry) => entry.wordId !== word.wordId) })
            refresh()
          }}
        />
        {dialog}
      </>
    )
  return (
    <div className="libraries-page" id="libraries">
      <LibrariesRail />
      <label className="global-word-search">
        <Icon name="search" size={17} />
        <input
          ref={searchInput}
          {...noAutocorrect}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setAdding(null)
          }}
          placeholder="Find a word, or type a new one to add it…"
          aria-label="Find a word in the libraries or add a new one"
        />
      </label>
      <header className="libraries-header">
        <div>
          <h1>Libraries</h1>
        </div>
        <div className="library-total">
          <strong>{totalWords}</strong>
          <span>words available</span>
        </div>
      </header>
      {noticeBar}
      {dialog}
      {adding !== null ? (
        <AddWordPanel
          key={adding}
          initialWord={adding}
          onAdded={refresh}
          onPractise={(wordId, word) => {
            openPracticeWith({ wordIds: [wordId], label: word })
          }}
          onClose={() => {
            setAdding(null)
            setQuery('')
          }}
        />
      ) : trimmedQuery.length >= 2 ? (
        <section className="search-results">
          {search.matches.length ? <p className="search-results__count">In the libraries</p> : null}
          <div className="word-list">
            {search.matches.map((hit) => (
              <SearchRow
                hit={hit}
                filter={viewFilter}
                ruleMap={ruleMap}
                onOpen={openWordsLibrary}
                onPractise={beginPractice}
                onHide={hideWord}
                key={hit.word.wordId}
              />
            ))}
          </div>
          {search.close.length ? (
            <>
              <p className="search-results__count">Did you mean…</p>
              <div className="word-list">
                {search.close.map((hit) => (
                  <SearchRow
                    hit={hit}
                    filter={viewFilter}
                    ruleMap={ruleMap}
                    onOpen={openWordsLibrary}
                    onPractise={beginPractice}
                    onHide={hideWord}
                    key={hit.word.wordId}
                  />
                ))}
              </div>
            </>
          ) : null}
          {search.hasExact ? null : (
            <div className="search-add">
              <p>
                {search.matches.length || search.close.length
                  ? 'Not the word you typed? Spell it as you meant it and add it yourself.'
                  : 'No word like this in the libraries. The dictionary can translate it.'}
              </p>
              <button className="check-button" type="button" onClick={() => setAdding(trimmedQuery)}>
                Look up “{trimmedQuery}” and add it to my words
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="libraries-actions">
            <button className="check-button" type="button" onClick={() => beginPractice(allWords, 'All libraries')}>
              <Icon name="practice" size={17} /> Practise all words
            </button>
            <button className="template-button" type="button" onClick={focusSearch}>
              Add a word
            </button>
            <button className="template-button" type="button" onClick={() => setTuning((open) => !open)}>
              Tune my library
            </button>
            <ViewFilterToggle filter={viewFilter} open={filterOpen} onToggle={() => setFilterOpen((open) => !open)} />
          </div>
          {filterOpen ? <LibraryViewFilterPanel filter={viewFilter} onChange={setViewFilter} /> : null}
          {tuning ? (
            <LibrarySetup
              title="Tune my library"
              onDone={() => {
                setTuning(false)
                refresh()
              }}
            />
          ) : null}
          <nav className="library-tabs" aria-label="Library groups">
            {libraryGroups.map((group) => (
              <button
                type="button"
                className={activeGroup === group.id ? 'library-tabs__active' : ''}
                onClick={() => setActiveGroup(group.id)}
                key={`${group.id}:${group.name}`}
              >
                {group.name}
              </button>
            ))}
            <button type="button" className={activeGroup === 'packs' ? 'library-tabs__active' : ''} onClick={() => setActiveGroup('packs')}>
              Add-on packs
            </button>
          </nav>
          {activeGroup === 'packs' ? (
            <PackList libraries={libraries} onToggle={togglePack} onPreview={previewPack} />
          ) : activeGroup === 'my-libraries' ? (
            <>
              <div className="libraries-actions">
                <button className="template-button" type="button" onClick={downloadTemplate}>
                  CSV template
                </button>
              </div>
              <MyLibraries
                libraries={getEveryLibrary().filter((library) => library.source === 'imported')}
                hiddenKeys={getHiddenWordIds()}
                onSetHidden={(library, hide) => setLibraryHidden(hideKey.library(library.name), library.name, hide)}
                onOpen={openLibrary}
                onPractice={beginPractice}
                onDelete={remove}
                onImported={refresh}
              />
              <HiddenWords
                libraries={libraries}
                onOpen={(words) =>
                  setDetails({
                    title: 'Hidden words',
                    description: 'These words do not appear in practice or in your daily plan. Restore a word to bring it back.',
                    words,
                    restorable: true,
                  })
                }
                onRestoreAll={(words) => {
                  for (const word of words) setWordHidden(word.wordId, false)
                  refresh()
                }}
              />
            </>
          ) : (
            <section className="library-groups">
              {cards.map((group) => (
                <GroupCard
                  group={group}
                  libraries={libraries}
                  viewFilter={viewFilter}
                  asTopic={showingTopics}
                  onDeleteTopic={showingTopics ? () => deleteTopic(group.name) : undefined}
                  hidden={!showingTopics && getHiddenWordIds().has(hideKey.group(group.id))}
                  onSetHidden={(hide) => setLibraryHidden(hideKey.group(group.id), group.name, hide)}
                  onOpen={openGroup}
                  onPractice={beginPractice}
                  key={`${group.id}:${group.name}`}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
