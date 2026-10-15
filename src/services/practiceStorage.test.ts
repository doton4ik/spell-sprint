import { beforeEach, describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { getPracticeAttempts, markAttemptClaimedCorrect, mergePracticeAttempts } from './practiceStorage'

const KEY = 'spell-sprint.practice-attempts'
const attempt = (id: string, createdAt: string): PracticeAttempt => ({ id, taskId: 't', createdAt, isCorrect: true }) as PracticeAttempt

describe('getPracticeAttempts cache', () => {
  beforeEach(() => window.localStorage.clear())

  it('returns the same list while storage is unchanged', () => {
    window.localStorage.setItem(KEY, JSON.stringify([attempt('a', '2026-01-01')]))
    expect(getPracticeAttempts()).toBe(getPracticeAttempts())
  })
  it('sees a change made by anyone (another tab, cloud restore)', () => {
    window.localStorage.setItem(KEY, JSON.stringify([attempt('a', '2026-01-01')]))
    expect(getPracticeAttempts()).toHaveLength(1)
    window.localStorage.setItem(KEY, JSON.stringify([attempt('b', '2026-01-02'), attempt('a', '2026-01-01')]))
    expect(getPracticeAttempts().map((item) => item.id)).toEqual(['b', 'a'])
  })
  it('the shared list cannot be changed by accident', () => {
    window.localStorage.setItem(KEY, JSON.stringify([attempt('a', '2026-01-01')]))
    expect(() => (getPracticeAttempts() as PracticeAttempt[]).push(attempt('x', '2026'))).toThrow()
  })
  it('damaged storage gives an empty list, not a crash', () => {
    window.localStorage.setItem(KEY, '{not json')
    expect(getPracticeAttempts()).toEqual([])
  })
  it('merge adds only new attempts, newest first', () => {
    window.localStorage.setItem(KEY, JSON.stringify([attempt('a', '2026-01-01')]))
    expect(mergePracticeAttempts([attempt('a', '2026-01-01'), attempt('b', '2026-01-03')])).toBe(1)
    expect(getPracticeAttempts().map((item) => item.id)).toEqual(['b', 'a'])
  })
  it('a word that is in two libraries keeps one history', () => {
    const dup = 'general-english-commonly-misspelled-library'
    window.localStorage.setItem(KEY, JSON.stringify([{ ...attempt('a', '2026-01-01'), wordId: dup, taskId: `library-${dup}-write-en` }]))
    const [read] = getPracticeAttempts()
    expect(read.wordId).toBe('places-in-town-places-in-town-library')
    expect(read.taskId).toBe('library-places-in-town-places-in-town-library-write-en')
  })
  it('an answer about a built-in word counts under the topic that word has today', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify([
        {
          ...attempt('a', '2026-01-01'),
          wordId: 'everyday-life-daily-routines-breakfast',
          topicId: 'food-and-drinks',
          topic: 'Food and Drinks',
        },
      ]),
    )
    expect(getPracticeAttempts()[0]).toMatchObject({ topicId: 'food', topic: 'Food and Cooking' })
  })
  it('an answer marked "right too" is right here and on another device', () => {
    const wrong = { ...attempt('a', '2026-01-01T10:00:00.000Z'), isCorrect: false }
    window.localStorage.setItem(KEY, JSON.stringify([wrong]))
    markAttemptClaimedCorrect('a', { confidence: 1, nextReviewAt: '2026-01-02T00:00:00.000Z' })
    expect(getPracticeAttempts()[0]).toMatchObject({ isCorrect: true, claimedCorrect: true })
    const claimed = getPracticeAttempts()[0]
    window.localStorage.setItem(KEY, JSON.stringify([wrong])) // the other device still has the wrong version
    expect(
      mergePracticeAttempts([
        { ...claimed, userAnswer: 'x', correctAnswer: 'y', taskType: 'translate-en-ru', topic: 't' } as PracticeAttempt,
      ]),
    ).toBe(1)
    expect(getPracticeAttempts()[0].isCorrect).toBe(true)
  })
})
