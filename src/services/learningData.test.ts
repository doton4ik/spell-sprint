import { beforeEach, describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { getEntryHistory, getMistakeEntries, isDueToday } from './learningData'
import { addYellowCard } from './yellowCards'

const WORD = 'everyday-life-daily-routines-breakfast' // a real library word, so the mistake counts as relevant
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString()
const attempt = (createdAt: string, isCorrect: boolean, extra: Partial<PracticeAttempt> = {}): PracticeAttempt =>
  ({
    id: crypto.randomUUID(),
    taskId: `library-${WORD}-write-en`,
    wordId: WORD,
    taskType: 'translate-ru-en',
    topic: 'Everyday Life',
    userAnswer: isCorrect ? 'breakfast' : 'brekfast',
    correctAnswer: 'breakfast',
    isCorrect,
    wasSkipped: false,
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    errorCategory: 'General spelling',
    confidence: isCorrect ? 1 : 0,
    nextReviewAt: isCorrect ? daysAgo(-1) : createdAt,
    needsReview: !isCorrect,
    createdAt,
    ...extra,
  }) as PracticeAttempt
const store = (key: string, value: unknown) => window.localStorage.setItem(key, JSON.stringify(value))

describe('My Mistakes entries', () => {
  beforeEach(() => window.localStorage.clear())

  it('a mistake 30+ days ago, answered right since, goes to the archive and is not due', () => {
    store('spell-sprint.practice-attempts', [attempt(daysAgo(35), true), attempt(daysAgo(40), false)])
    const [entry] = getMistakeEntries()
    expect(entry.archived).toBe(true)
    expect(isDueToday(entry)).toBe(false)
  })
  it('an old mistake never answered right since stays active', () => {
    store('spell-sprint.practice-attempts', [attempt(daysAgo(40), false)])
    expect(getMistakeEntries()[0].archived).toBe(false)
  })
  it('a recent mistake is due today and says where it came from', () => {
    store('spell-sprint.practice-attempts', [attempt(daysAgo(0), false, { library: 'Sprint' })])
    const [entry] = getMistakeEntries()
    expect(isDueToday(entry)).toBe(true)
    expect(entry.origin).toBe('Sprint')
  })
  it('a wrong choice in a look-alike pair is shown, linked to the pair', () => {
    store('spell-sprint.pair-attempts', [
      {
        id: 'p1',
        pairId: 'their-there-theyre',
        sentence: 'The children forgot ___ lunch boxes at school.',
        chosen: 'there',
        correct: false,
        createdAt: daysAgo(0),
      },
    ])
    const entry = getMistakeEntries().find((item) => item.pairId)!
    expect(entry).toMatchObject({ pairId: 'their-there-theyre', correctAnswer: 'their', lastUserVersion: 'there', origin: 'Pairs' })
    expect(entry.translation).toBe('The children forgot their lunch boxes at school.')
  })
  it('the history lists answers and yellow cards, newest first', () => {
    store('spell-sprint.practice-attempts', [attempt(daysAgo(1), true), attempt(daysAgo(2), false)])
    addYellowCard({ word: 'breakfast', shown: 'brekfast', source: 'proofreading', where: 'A morning' })
    const [entry] = getMistakeEntries()
    const history = getEntryHistory(entry)
    expect(history.map((item) => [item.correct, Boolean(item.yellow)])).toEqual([
      [false, true],
      [true, false],
      [false, false],
    ])
    expect(history[0].where).toContain('A morning')
    expect(history[1].where).toBe('Practice · Write in English')
  })
})
