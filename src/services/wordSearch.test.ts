import { describe, expect, it } from 'vitest'
import type { LibraryWord } from '../types/library'
import { getEveryWord } from './libraryStorage'
import { buildWordIndex, editDistance, queryBaseForms, searchWords, trigrams } from './wordSearch'

const make = (word: string, translation = 'перевод') => ({ wordId: word, word, translation }) as LibraryWord
const small = buildWordIndex(
  ['receive', 'reception', 'definitely', 'accommodation', 'Wednesday', 'cat', 'catalogue', 'believe'].map((word) => make(word)),
)
const best = (index: ReturnType<typeof buildWordIndex>, typed: string) => {
  const found = searchWords(index, typed)
  return [...found.matches, ...found.close].map((hit) => hit.word.word)
}

describe('edit distance', () => {
  it('counts one wrong, missing, extra or swapped letter as 1', () => {
    expect(editDistance('receive', 'receive')).toBe(0)
    expect(editDistance('recieve', 'receive')).toBe(1)
    expect(editDistance('definately', 'definitely')).toBe(1)
    expect(editDistance('beleive', 'believe')).toBe(1)
    expect(editDistance('acomodation', 'accommodation')).toBe(2)
  })
  it('pads words so their start and end give pieces', () => {
    expect([...trigrams('cat')]).toEqual([' ca', 'cat', 'at '])
  })
})

describe('word search', () => {
  it('finds exact words, ignoring case, and offers no close words then', () => {
    const found = searchWords(small, '  WEDNESDAY ')
    expect(found.hasExact).toBe(true)
    expect(found.matches[0].word.word).toBe('Wednesday')
    expect(found.close).toEqual([])
  })
  it('ranks exact before prefix before part of a word', () => {
    expect(searchWords(small, 'cat').matches.map((hit) => hit.kind)).toEqual(['exact', 'prefix'])
    expect(searchWords(small, 'ception').matches[0].kind).toBe('contains')
  })
  it('finds misspellings', () => {
    expect(best(small, 'recieve')[0]).toBe('receive')
    expect(best(small, 'definately')[0]).toBe('definitely')
    expect(best(small, 'acomodation')[0]).toBe('accommodation')
    expect(best(small, 'wensday')[0]).toBe('Wednesday')
    expect(best(small, 'beleive')[0]).toBe('believe')
    expect(best(small, 'recive')[0]).toBe('receive')
  })
  it('finds nothing for gibberish and for a single letter', () => {
    expect(searchWords(small, 'qzxqzx')).toEqual({ matches: [], close: [], hasExact: false })
    expect(searchWords(small, 'a').matches).toEqual([])
  })
  it('finds a word by its Russian translation', () => {
    const index = buildWordIndex([make('house', 'дом'), make('home', 'дом, родина')])
    expect(searchWords(index, 'дом').matches.map((hit) => hit.kind)).toEqual(['translation', 'translation'])
  })
})

describe('the real library', () => {
  const index = buildWordIndex(getEveryWord())
  it.each([
    ['recieve', 'receive'],
    ['definately', 'definitely'],
    ['acomodation', 'accommodation'],
    ['wensday', 'wednesday'],
  ])('%s → %s', (typed, expected) => {
    const found = searchWords(index, typed)
    expect([...found.matches, ...found.close].map((hit) => hit.word.word.toLocaleLowerCase())).toContain(expected)
  })
  it('is fast enough to run on every key press', () => {
    const start = performance.now()
    for (let round = 0; round < 20; round++) searchWords(index, 'acomodation')
    expect((performance.now() - start) / 20).toBeLessThan(40)
  })
})

describe('phrases and forms of a word', () => {
  const index = buildWordIndex(
    ['hook up', 'look forward to', 'check-in', 'study', 'stop', 'make', 'go', 'child', 'leave', 'run', 'use', "o'clock"].map((word) =>
      make(word),
    ),
  )
  const top = (typed: string) => searchWords(index, typed).matches[0]

  it('finds a phrase typed with other spacing, case or a hyphen', () => {
    for (const typed of ['hook up', '  Hook   Up ', 'hook-up', 'HOOK UP'])
      expect(searchWords(index, typed), typed).toMatchObject({ hasExact: true, matches: [{ kind: 'exact', word: { word: 'hook up' } }] })
    expect(top('check in')).toMatchObject({ kind: 'exact', word: { word: 'check-in' } })
    expect(top('o’clock')).toMatchObject({ kind: 'exact', word: { word: "o'clock" } })
  })
  it('finds the word a typed form comes from', () => {
    const forms: Array<[string, string]> = [
      ['hooked up', 'hook up'],
      ['hooking up', 'hook up'],
      ['hooks up', 'hook up'],
      ['looking forward to', 'look forward to'],
      ['studies', 'study'],
      ['studied', 'study'],
      ['stopped', 'stop'],
      ['stopping', 'stop'],
      ['making', 'make'],
      ['made', 'make'],
      ['went', 'go'],
      ['gone', 'go'],
      ['children', 'child'],
      ['running', 'run'],
      ['used', 'use'],
      ['uses', 'use'],
    ]
    for (const [typed, word] of forms) expect(top(typed), typed).toMatchObject({ kind: 'form', word: { word } })
  })
  it('a form is not the word itself: it can still be added as typed', () => {
    expect(searchWords(index, 'studies').hasExact).toBe(false)
    expect(searchWords(index, 'study').hasExact).toBe(true)
  })
  it('does not guess a form from a word that only ends like one', () => {
    expect(queryBaseForms('bus')).toEqual(['bu'])
    expect(searchWords(index, 'bus').matches).toEqual([])
    expect(queryBaseForms('go')).toEqual([])
  })
})
