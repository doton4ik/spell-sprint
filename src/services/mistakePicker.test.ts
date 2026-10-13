import { describe, expect, it } from 'vitest'
import type { MistakeEntry } from '../types/learning'
import { mistakeKey, pickMistakes } from './mistakePicker'

const NOW = new Date('2026-10-12T12:00:00Z')
const ago = (hours: number) => new Date(NOW.getTime() - hours * 3600000).toISOString()
const none = () => 0

function entry(word: string, over: Partial<MistakeEntry> = {}): MistakeEntry {
  return {
    taskId: `task-${word}`,
    wordId: word,
    correctAnswer: word,
    lastUserVersion: 'x',
    errorCategory: 'Spelling',
    family: 'Spelling',
    topic: 'T',
    numberOfAttempts: 2,
    numberOfErrors: 1,
    numberOfCorrectAnswers: 0,
    firstSeen: ago(100),
    lastSeen: ago(100),
    nextReviewAt: ago(-100),
    status: 'learning',
    lastMistakeAt: ago(100),
    ...over,
  }
}
const keys = (list: MistakeEntry[]) => list.map(mistakeKey).sort()

describe('pickMistakes', () => {
  const pool = ['a', 'b', 'c', 'd', 'e', 'f'].map((word) => entry(word))

  it('takes everything when there are not more words than the session needs', () => {
    expect(keys(pickMistakes({ entries: pool, size: 10, now: NOW }))).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })
  it('leaves out mastered and archived words', () => {
    const list = [entry('a'), entry('b', { status: 'mastered' }), entry('c', { archived: true })]
    expect(keys(pickMistakes({ entries: list, size: 1, now: NOW, random: none }))).toEqual(['a'])
  })
  it('puts words that are due, wrong often or wrong lately first', () => {
    const list = [
      entry('calm'),
      entry('due', { nextReviewAt: ago(5) }),
      entry('often', { numberOfErrors: 6, status: 'difficult' }),
      entry('fresh', { lastMistakeAt: ago(1) }),
      entry('quiet'),
    ]
    const picked = keys(pickMistakes({ entries: list, size: 3, now: NOW, random: none }))
    expect(picked).toEqual(['due', 'fresh', 'often'])
  })
  it('the words of the pressed group come first', () => {
    const picked = pickMistakes({ entries: pool, size: 2, preferred: ['d', 'e'], now: NOW, random: none })
    expect(keys(picked)).toEqual(['d', 'e'])
  })
  it('a word handed out a moment ago gives way, so the next session brings other words', () => {
    const today = [entry('now1', { lastMistakeAt: ago(1) }), entry('now2', { lastMistakeAt: ago(1) })]
    const others = ['x1', 'x2', 'x3', 'x4'].map((word) => entry(word, { numberOfErrors: 2 }))
    const list = [...today, ...others]
    const first = pickMistakes({ entries: list, size: 2, now: NOW, random: none })
    expect(keys(first)).toEqual(['now1', 'now2'])
    const served = Object.fromEntries(first.map((item) => [mistakeKey(item), ago(0.1)]))
    const second = pickMistakes({ entries: list, size: 2, served, now: NOW, random: none })
    expect(keys(second).some((key) => key.startsWith('now'))).toBe(false)
  })
  it('the size counts words: several entries of one word are one place in the session', () => {
    const list = ['a', 'b', 'c', 'd'].flatMap((word) => [entry(word), entry(word, { taskId: `other-${word}` })])
    const picked = pickMistakes({ entries: list, size: 3, now: NOW, random: none })
    expect(new Set(picked.map(mistakeKey)).size).toBe(3)
    expect(picked).toHaveLength(6)
  })
  it('the old penalty fades: after a day the words can come back', () => {
    const list = [entry('a', { lastMistakeAt: ago(1) }), entry('b'), entry('c')]
    const served = { a: ago(30) }
    expect(keys(pickMistakes({ entries: list, size: 1, served, now: NOW, random: none }))).toEqual(['a'])
  })
})
