import { beforeEach, describe, expect, it } from 'vitest'
import type { LibraryWord } from '../types/library'
import { levelWeight, orderFreshWords } from './freshWords'

const word = (id: string, level?: LibraryWord['level']) => ({ wordId: id, word: id, level }) as LibraryWord

describe('levelWeight', () => {
  it('is 1 for every word when there is no level check or the word has no level', () => {
    expect(levelWeight({ level: 'A2' }, null)).toBe(1)
    expect(levelWeight({ level: undefined }, 3)).toBe(1)
  })
  it('makes words far below the learner rare and words at the level normal', () => {
    expect(levelWeight({ level: 'A2' }, 3.4)).toBeLessThan(levelWeight({ level: 'B1' }, 3.4))
    expect(levelWeight({ level: 'B1' }, 3.4)).toBeLessThan(levelWeight({ level: 'B2' }, 3.4))
    expect(levelWeight({ level: 'B2' }, 3.4)).toBe(1)
    expect(levelWeight({ level: 'C1' }, 3.4)).toBeGreaterThan(0.5)
  })
})

describe('orderFreshWords', () => {
  beforeEach(() => window.localStorage.clear())
  const words = [
    ...Array.from({ length: 200 }, (_, index) => word(`easy${index}`, 'A2')),
    ...Array.from({ length: 200 }, (_, index) => word(`hard${index}`, 'B2')),
  ]
  const seeded = (seed: number) => {
    let state = seed
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296
      return state / 4294967296
    }
  }

  it('puts words at the level well ahead of words far below it', () => {
    const random = seeded(7)
    const first = orderFreshWords(words, 3, () => random()).slice(0, 100)
    expect(first.filter((item) => item.level === 'B2').length).toBeGreaterThan(75)
  })
  it('does not change the mix when there is no level check', () => {
    const random = seeded(11)
    const first = orderFreshWords(words, null, () => random()).slice(0, 100)
    expect(first.filter((item) => item.level === 'B2').length).toBeGreaterThan(30)
    expect(first.filter((item) => item.level === 'B2').length).toBeLessThan(70)
  })
  it('keeps the easy words in the list (they come later, they are not dropped)', () => {
    const random = seeded(3)
    expect(orderFreshWords(words, 3.4, () => random())).toHaveLength(words.length)
  })
  it('gives the same order for the same random numbers (the daily plan must not reshuffle)', () => {
    const hash = (item: LibraryWord) => ((item.wordId.length * 2654435761 + item.wordId.charCodeAt(item.wordId.length - 1)) % 1000) / 1000
    expect(orderFreshWords(words, 3, hash).map((item) => item.wordId)).toEqual(orderFreshWords(words, 3, hash).map((item) => item.wordId))
  })
})
