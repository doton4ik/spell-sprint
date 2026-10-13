import { beforeEach, describe, expect, it } from 'vitest'
import { libraryPacks } from '../data/libraryPacks'
import { libraryGroups } from './libraryGroups'
import { getHiddenWordIds, hideKey, setPackEnabled, setWordHidden } from './libraryPrefs'
import { addMyWord, getAllWords, getEveryLibrary, getLibraries, isBaseLibrary, MY_WORDS, myWordId } from './libraryStorage'

beforeEach(() => window.localStorage.clear())

describe('hiding a whole library', () => {
  it('keeps a pack that is switched on when its topic name is also in a hidden group', () => {
    const pack = libraryPacks.find((item) => item.id === 'business-office')!
    const group = libraryGroups.find((item) => item.id === 'study-work')!
    setPackEnabled(pack.id, true)
    const packSize = getLibraries().find((library) => library.name === 'Business and Office Core')?.words.length ?? 0
    expect(packSize).toBeGreaterThan(0)
    setWordHidden(hideKey.group(group.id), true)
    const after = getLibraries()
    expect(after.find((library) => library.name === 'Business and Office Core')?.words.length).toBe(packSize)
    const base = after.filter(isBaseLibrary).flatMap((library) => library.words)
    expect(base.some((word) => group.topics.includes(word.topic))).toBe(false)
  })

  it('hides and restores a group', () => {
    const group = libraryGroups.find((item) => item.id === 'topics-interests')!
    const before = getAllWords().length
    setWordHidden(hideKey.group(group.id), true)
    expect(getAllWords().length).toBeLessThan(before)
    setWordHidden(hideKey.group(group.id), false)
    expect(getAllWords().length).toBe(before)
  })

  it('a word added to a hidden "My words" library is not left hidden', () => {
    addMyWord({ word: 'zebra', translation: 'зебра', partOfSpeech: 'noun', definition: '', example: '', difficulty: 'easy', risk: 1 })
    setWordHidden(hideKey.library(MY_WORDS), true)
    expect(getAllWords().some((word) => word.word === 'zebra')).toBe(false)
    addMyWord({ word: 'giraffe', translation: 'жираф', partOfSpeech: 'noun', definition: '', example: '', difficulty: 'easy', risk: 1 })
    expect(getAllWords().some((word) => word.word === 'giraffe')).toBe(true)
    expect(getHiddenWordIds().has(hideKey.library(MY_WORDS))).toBe(false)
    expect(getEveryLibrary().some((library) => library.name === MY_WORDS)).toBe(true)
    expect(myWordId('giraffe')).toBeTruthy()
  })
})
