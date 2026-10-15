import { describe, expect, it } from 'vitest'
import topicScript from '../../scripts/library-topics.mjs?raw'
import { builtInLibraries } from './libraries'
import { cefrLevels, libraryTopics, librarySections } from './libraryTopics'
import { libraryGroups, wordsForGroup } from '../services/libraryGroups'
import { libraryPacks } from './libraryPacks'

describe('the topics of the built-in library', () => {
  it('are the same list the content scripts use (scripts/library-topics.mjs)', () => {
    const fromScript = [...topicScript.matchAll(/\['([a-z]+)', '([^']+)', '[^']+', '/g)].map((match) => `${match[1]}|${match[2]}`)
    expect(libraryTopics.map((topic) => `${topic.id}|${topic.name}`)).toEqual(fromScript)
  })

  it('belong to a known section, and have unique ids and names', () => {
    const sections = new Set(librarySections.map((section) => section.id))
    for (const topic of libraryTopics) expect(sections.has(topic.section), topic.id).toBe(true)
    expect(new Set(libraryTopics.map((topic) => topic.id)).size).toBe(libraryTopics.length)
    expect(new Set(libraryTopics.map((topic) => topic.name)).size).toBe(libraryTopics.length)
  })

  it('give every built-in word a topic from the list, a library with the topic name and a CEFR level', () => {
    const names = new Set(libraryTopics.map((topic) => topic.name))
    const words = builtInLibraries.flatMap((library) => library.words)
    expect(words.length).toBeGreaterThan(900)
    for (const word of words) {
      expect(names.has(word.topic), `${word.id}: topic ${word.topic}`).toBe(true)
      expect(word.library, word.id).toBe(word.topic)
      expect(cefrLevels, word.id).toContain(word.level)
    }
    expect(builtInLibraries.map((library) => library.name).sort()).toEqual([...new Set(words.map((word) => word.topic))].sort())
  })

  it('leave no word outside a section (the professional one is an add-on pack)', () => {
    const everyWord = builtInLibraries.flatMap((library) => library.words)
    const inSections = new Set(
      libraryGroups
        .filter((group) => !group.personal && group.id !== 'all')
        .flatMap((group) => wordsForGroup(group, builtInLibraries).map((word) => word.wordId)),
    )
    expect(everyWord.filter((word) => !inSections.has(word.wordId))).toEqual([])
    const packWords = builtInLibraries.filter((library) => libraryPacks.some((pack) => pack.libraries.includes(library.name)))
    expect(packWords.map((library) => library.name)).toEqual(['Logistics and Trade'])
  })
})
