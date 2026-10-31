import { beforeEach, describe, expect, it } from 'vitest'
import type { LibraryWord } from '../types/library'
import { emptyViewFilter, filterShownWords, getViewFilter, isViewFilterActive, saveViewFilter, toggleInList } from './libraryViewFilter'

const word = (topic: string, level?: LibraryWord['level']) => ({ wordId: `${topic}-${level}`, topic, level }) as LibraryWord

const words = [
  word('Food and Cooking', 'A2'),
  word('Food and Cooking', 'C1'),
  word('Phrasal Verbs', 'B1'),
  word('My own topic'),
  word('Transport', 'C1'),
]

beforeEach(() => window.localStorage.clear())

describe('library view filter', () => {
  it('shows everything when nothing is hidden', () => {
    expect(isViewFilterActive(emptyViewFilter())).toBe(false)
    expect(filterShownWords(words, emptyViewFilter())).toBe(words)
  })

  it('hides levels in any combination and keeps words without a level', () => {
    const shown = filterShownWords(words, { ...emptyViewFilter(), levels: ['C1', 'A2'] })
    expect(shown.map((item) => item.wordId)).toEqual(['Phrasal Verbs-B1', 'My own topic-undefined'])
  })

  it('hides one topic', () => {
    const shown = filterShownWords(words, { ...emptyViewFilter(), topics: ['Food and Cooking'] })
    expect(shown).toHaveLength(3)
  })

  it('hides a whole section (Food is in Everyday life)', () => {
    const shown = filterShownWords(words, { ...emptyViewFilter(), sections: ['everyday-life'] })
    expect(shown.map((item) => item.topic)).toEqual(['Phrasal Verbs', 'My own topic', 'Transport'])
  })

  it('toggles an item in a list', () => {
    expect(toggleInList(['A2'], 'B1')).toEqual(['A2', 'B1'])
    expect(toggleInList(['A2', 'B1'], 'A2')).toEqual(['B1'])
  })

  it('remembers the choice, forgets it on reset, survives broken storage', () => {
    saveViewFilter({ levels: ['C1'], sections: ['people'], topics: ['Transport'] })
    expect(getViewFilter()).toEqual({ levels: ['C1'], sections: ['people'], topics: ['Transport'] })
    saveViewFilter(emptyViewFilter())
    expect(getViewFilter()).toEqual(emptyViewFilter())
    window.localStorage.setItem('spell-sprint.library-view-filter', '{broken')
    expect(getViewFilter()).toEqual(emptyViewFilter())
  })
})
