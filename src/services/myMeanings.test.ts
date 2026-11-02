import { beforeEach, describe, expect, it } from 'vitest'
import { addMyWord, getAllWords } from './libraryStorage'

beforeEach(() => window.localStorage.clear())

const add = (word: string, translation: string) =>
  addMyWord({ word, translation, partOfSpeech: 'noun', definition: '', example: '', difficulty: 'easy', risk: 1 })
const mine = (word: string) => getAllWords().filter((entry) => entry.word.toLocaleLowerCase() === word && entry.library === 'My words')

describe('My words keeps one entry per meaning', () => {
  it('updates a word added again with the same translation', () => {
    const first = add('fortune', 'удача')
    const again = add('Fortune', ' Удача ')
    expect(again.wordId).toBe(first.wordId)
    expect(again.updated).toBe(true)
    expect(mine('fortune')).toHaveLength(1)
  })

  it('makes a second entry with its own id for another meaning', () => {
    const luck = add('fortune', 'удача')
    const wealth = add('fortune', 'состояние')
    expect(wealth.wordId).not.toBe(luck.wordId)
    expect(wealth.updated).toBe(false)
    expect(
      mine('fortune')
        .map((entry) => entry.translation)
        .sort(),
    ).toEqual(['состояние', 'удача'])
  })

  it('finds the right entry again for each meaning', () => {
    const luck = add('fortune', 'удача')
    const wealth = add('fortune', 'состояние')
    expect(add('fortune', 'состояние').wordId).toBe(wealth.wordId)
    expect(add('fortune', 'удача').wordId).toBe(luck.wordId)
    expect(mine('fortune')).toHaveLength(2)
  })
})
