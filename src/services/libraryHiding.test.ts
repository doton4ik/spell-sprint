import { beforeEach, describe, expect, it } from 'vitest'
import { libraryPacks, packForWord, wordsOfPack } from '../data/libraryPacks'
import { libraryGroups } from './libraryGroups'
import { getHiddenWordIds, hideKey, setPackEnabled, setWordHidden } from './libraryPrefs'
import { addMyWord, getAllWords, getEveryLibrary, getEveryWord, getLibraries, isBaseLibrary, MY_WORDS, myWordId } from './libraryStorage'

beforeEach(() => window.localStorage.clear())

describe('hiding a whole library', () => {
  it('keeps a pack that is switched on when its topic name is also in a hidden group', () => {
    const pack = libraryPacks.find((item) => item.id === 'logistics')!
    const group = libraryGroups.find((item) => item.id === 'professional')!
    setPackEnabled(pack.id, true)
    const packSize = getLibraries().find((library) => library.name === 'Logistics and Trade')?.words.length ?? 0
    expect(packSize).toBeGreaterThan(0)
    setWordHidden(hideKey.group(group.id), true)
    const after = getLibraries()
    expect(after.find((library) => library.name === 'Logistics and Trade')?.words.length).toBe(packSize)
    const base = after.filter(isBaseLibrary).flatMap((library) => library.words)
    expect(base.some((word) => group.topics.includes(word.topic))).toBe(false)
  })

  it('hides and restores a group', () => {
    const group = libraryGroups.find((item) => item.id === 'health-free-time')!
    const before = getAllWords().length
    setWordHidden(hideKey.group(group.id), true)
    expect(getAllWords().length).toBeLessThan(before)
    setWordHidden(hideKey.group(group.id), false)
    expect(getAllWords().length).toBe(before)
  })

  it('a word added to a hidden "My words" library is not left hidden', () => {
    addMyWord({ word: 'quokka', translation: 'квокка', partOfSpeech: 'noun', definition: '', example: '', difficulty: 'easy', risk: 1 })
    setWordHidden(hideKey.library(MY_WORDS), true)
    expect(getAllWords().some((word) => word.word === 'quokka')).toBe(false)
    addMyWord({ word: 'giraffe', translation: 'жираф', partOfSpeech: 'noun', definition: '', example: '', difficulty: 'easy', risk: 1 })
    expect(getAllWords().some((word) => word.word === 'giraffe')).toBe(true)
    expect(getHiddenWordIds().has(hideKey.library(MY_WORDS))).toBe(false)
    expect(getEveryLibrary().some((library) => library.name === MY_WORDS)).toBe(true)
    expect(myWordId('giraffe')).toBeTruthy()
  })
})

describe('a pack of single words (Rare and bookish words)', () => {
  const pack = libraryPacks.find((item) => item.id === 'rare')!
  const ids = new Set(pack.wordIds)

  it('names only words that are in the built-in library, each once and in no other pack', () => {
    const builtIn = new Set(
      getEveryLibrary()
        .filter((library) => library.source === 'built-in')
        .flatMap((library) => library.words.map((word) => word.wordId)),
    )
    expect(pack.wordIds!.filter((id) => !builtIn.has(id))).toEqual([])
    expect(ids.size).toBe(pack.wordIds!.length)
    expect(wordsOfPack(pack, getEveryLibrary())).toHaveLength(ids.size)
    for (const id of ids) expect(packForWord(id)).toBe(pack)
    const logistics = new Set(
      wordsOfPack(
        libraryPacks.find((item) => item.id === 'logistics')!,
        getEveryLibrary(),
      ).map((word) => word.wordId),
    )
    expect([...ids].filter((id) => logistics.has(id))).toEqual([])
  })
  it('its words are not studied until the pack is switched on, and leave again when it is switched off', () => {
    const studied = () => getAllWords().filter((word) => ids.has(word.wordId)).length
    const before = getAllWords().length
    expect(studied()).toBe(0)
    setPackEnabled(pack.id, true)
    expect(studied()).toBe(ids.size)
    expect(getAllWords().length).toBe(before + ids.size)
    setPackEnabled(pack.id, false)
    expect(studied()).toBe(0)
  })
  it('the words stay in their own topic and can still be looked up for history', () => {
    setPackEnabled(pack.id, true)
    const word = getAllWords().find((item) => item.wordId === 'actions-bequeath')!
    expect(word.topic).not.toBe(pack.name)
    setPackEnabled(pack.id, false)
    expect(getEveryWord().some((item) => item.wordId === 'actions-bequeath')).toBe(true)
  })
  it('a word the learner added under the same spelling is theirs and is always studied', () => {
    const added = addMyWord({
      word: 'bequeath',
      translation: 'завещать',
      partOfSpeech: 'verb',
      definition: '',
      example: '',
      difficulty: 'hard',
      risk: 3,
    })
    expect(getAllWords().some((word) => word.wordId === added.wordId)).toBe(true)
  })
})
