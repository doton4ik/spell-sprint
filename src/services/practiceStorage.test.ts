import { beforeEach, describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { getPracticeAttempts, mergePracticeAttempts } from './practiceStorage'

const KEY = 'spell-sprint.practice-attempts'
const attempt = (id: string, createdAt: string): PracticeAttempt => ({ id, taskId: 't', createdAt, isCorrect: true } as PracticeAttempt)

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
})
