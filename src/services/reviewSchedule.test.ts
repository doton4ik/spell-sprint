import { beforeEach, describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { scheduleAfterAnswer } from './reviewSchedule'

const KEY = 'spell-sprint.practice-attempts'
const day = (offset: number, hour = 12) => {
  const date = new Date(2026, 0, 10 + offset, hour)
  return date
}
const attempt = (when: Date, isCorrect: boolean, extra: Partial<PracticeAttempt> = {}): PracticeAttempt =>
  ({
    id: crypto.randomUUID(),
    taskId: 'library-w-write-en',
    wordId: 'w',
    taskType: 'translate-ru-en',
    topic: '',
    userAnswer: '',
    correctAnswer: 'word',
    isCorrect,
    wasSkipped: false,
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    errorCategory: '',
    createdAt: when.toISOString(),
    ...extra,
  }) as PracticeAttempt
const history = (...attempts: PracticeAttempt[]) => window.localStorage.setItem(KEY, JSON.stringify(attempts))
const daysUntil = (iso: string, from: Date) => Math.round((new Date(iso).getTime() - from.getTime()) / 86400000)
const item = { wordId: 'w', taskId: 'library-w-write-en' }

describe('scheduleAfterAnswer', () => {
  beforeEach(() => window.localStorage.clear())

  it('a mistake brings the word back today with no confidence', () => {
    const now = day(0)
    expect(scheduleAfterAnswer(item, false, false, 'write-en', now)).toEqual({ confidence: 0, nextReviewAt: now.toISOString() })
  })
  it('the first good day sends it to tomorrow, the second to three days', () => {
    expect(daysUntil(scheduleAfterAnswer(item, true, false, 'write-en', day(0)).nextReviewAt, day(0))).toBe(1)
    history(attempt(day(0), true))
    const second = scheduleAfterAnswer(item, true, false, 'write-en', day(1))
    expect(second.confidence).toBe(2)
    expect(daysUntil(second.nextReviewAt, day(1))).toBe(3)
  })
  it('three right answers on one day count as one day', () => {
    history(attempt(day(0, 9), true), attempt(day(0, 10), true))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(0, 11)).confidence).toBe(1)
  })
  it('a mistake starts the count again', () => {
    history(attempt(day(0), true), attempt(day(1), true), attempt(day(2), false))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(3)).confidence).toBe(1)
  })
  it('choosing the spelling is not a good day', () => {
    history(attempt(day(0), true))
    expect(scheduleAfterAnswer(item, true, false, 'choose-spelling', day(1)).confidence).toBe(1)
  })
  it('a hint keeps the count and asks again tomorrow', () => {
    history(attempt(day(0), true))
    const result = scheduleAfterAnswer(item, true, true, 'write-en', day(1))
    expect(result.confidence).toBe(1)
    expect(daysUntil(result.nextReviewAt, day(1))).toBe(1)
  })
  it('never goes past mastered (5 days)', () => {
    history(...[0, 1, 2, 3, 4, 5].map((offset) => attempt(day(offset), true)))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(6)).confidence).toBe(5)
  })
})
