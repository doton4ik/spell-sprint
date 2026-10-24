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
// An old mistake: the word was seen before (a word written right the first time it is seen is a different case, tested below).
const seen = attempt(day(-9), false)

describe('scheduleAfterAnswer', () => {
  beforeEach(() => window.localStorage.clear())

  it('a mistake brings the word back today with no confidence', () => {
    const now = day(0)
    expect(scheduleAfterAnswer(item, false, false, 'write-en', now)).toEqual({ confidence: 0, nextReviewAt: now.toISOString() })
  })
  it('the first good day sends it to tomorrow, the second to three days', () => {
    history(seen)
    expect(daysUntil(scheduleAfterAnswer(item, true, false, 'write-en', day(0)).nextReviewAt, day(0))).toBe(1)
    history(seen, attempt(day(0), true))
    const second = scheduleAfterAnswer(item, true, false, 'write-en', day(1))
    expect(second.confidence).toBe(2)
    expect(daysUntil(second.nextReviewAt, day(1))).toBe(3)
  })
  it('three right answers on one day count as one day', () => {
    history(seen, attempt(day(0, 9), true), attempt(day(0, 10), true))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(0, 11)).confidence).toBe(1)
  })
  it('a mistake starts the count again', () => {
    history(seen, attempt(day(0), true), attempt(day(1), true), attempt(day(2), false))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(3)).confidence).toBe(1)
  })
  it('choosing the spelling is not a good day', () => {
    history(seen, attempt(day(0), true))
    expect(scheduleAfterAnswer(item, true, false, 'choose-spelling', day(1)).confidence).toBe(1)
  })
  it('a hint keeps the count and asks again tomorrow', () => {
    history(seen, attempt(day(0), true))
    const result = scheduleAfterAnswer(item, true, true, 'write-en', day(1))
    expect(result.confidence).toBe(1)
    expect(daysUntil(result.nextReviewAt, day(1))).toBe(1)
  })
  it('a right answer before the review date keeps the plan and is not a good day', () => {
    const planned = day(3).toISOString()
    history(seen, attempt(day(0), true, { nextReviewAt: day(1).toISOString() }), attempt(day(1), true, { nextReviewAt: planned }))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(2))).toEqual({ confidence: 2, nextReviewAt: planned })
    // On the review date it counts.
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(3)).confidence).toBe(3)
  })
  it('five days in a row do not master a word: early days were never counted', () => {
    let previous: PracticeAttempt[] = []
    for (const offset of [0, 1, 2, 3, 4]) {
      history(seen, ...previous)
      const { confidence, nextReviewAt } = scheduleAfterAnswer(item, true, false, 'write-en', day(offset))
      previous = [...previous, attempt(day(offset), true, { confidence, nextReviewAt })]
    }
    history(seen, ...previous)
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(5)).confidence).toBe(3) // days 0, 1 and 4 (due dates), not 5
  })
  it('right after a mistake on the same day: no good day, back tomorrow', () => {
    history(attempt(day(0, 9), false, { nextReviewAt: day(0, 9).toISOString() }))
    const result = scheduleAfterAnswer(item, true, false, 'write-en', day(0, 10))
    expect(result.confidence).toBe(0)
    expect(daysUntil(result.nextReviewAt, day(0, 10))).toBe(1)
    history(attempt(day(0, 9), false, { nextReviewAt: day(0, 9).toISOString() }), attempt(day(0, 10), true, result))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(1)).confidence).toBe(1)
  })
  it('a wrong Russian meaning brings the word back today but keeps its spelling progress', () => {
    history(
      seen,
      attempt(day(0), true, { nextReviewAt: day(1).toISOString() }),
      attempt(day(1), true, { nextReviewAt: day(4).toISOString() }),
    )
    const wrongMeaning = scheduleAfterAnswer(item, false, false, 'translate-ru', day(2))
    expect(wrongMeaning).toEqual({ confidence: 2, nextReviewAt: day(2).toISOString() })
    history(
      seen,
      attempt(day(0), true, { nextReviewAt: day(1).toISOString() }),
      attempt(day(1), true, { nextReviewAt: day(4).toISOString() }),
      attempt(day(2), false, { attemptMode: 'translate-ru', ...wrongMeaning }),
    )
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(3)).confidence).toBe(3)
  })
  it('never goes past mastered (5 days)', () => {
    history(seen, ...[0, 1, 2, 3, 4, 5].map((offset) => attempt(day(offset), true)))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(6)).confidence).toBe(5)
  })
  it('a right answer with help (a hint or the audio) is not a good day: back tomorrow, nothing earned', () => {
    history(attempt(day(0), false, { nextReviewAt: day(0).toISOString() }))
    const helped = scheduleAfterAnswer(item, true, true, 'write-en', day(1))
    expect(helped.confidence).toBe(0)
    expect(daysUntil(helped.nextReviewAt, day(1))).toBe(1)
    // the unaided answer the next day is the first good day
    history(attempt(day(0), false, { nextReviewAt: day(0).toISOString() }), attempt(day(1), true, { hintUsed: true, ...helped }))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(2)).confidence).toBe(1)
  })
  it('dictation is help too: it never makes a good day, the word must also be written without the audio', () => {
    history(attempt(day(0), false, { nextReviewAt: day(0).toISOString() }))
    const heard = scheduleAfterAnswer(item, true, false, 'listen-write', day(1))
    expect(heard.confidence).toBe(0)
    expect(daysUntil(heard.nextReviewAt, day(1))).toBe(1)
    history(
      attempt(day(0), false, { nextReviewAt: day(0).toISOString() }),
      attempt(day(1), true, { attemptMode: 'listen-write', ...heard }),
      attempt(day(2), true, { attemptMode: 'listen-write', nextReviewAt: day(3).toISOString() }),
    )
    // dictation answers on two days are still no good day
    expect(scheduleAfterAnswer(item, true, false, 'listen-write', day(3)).confidence).toBe(0)
    // written without help, it counts
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(3)).confidence).toBe(1)
  })
})

describe('a word that is known on sight', () => {
  beforeEach(() => window.localStorage.clear())

  it('written right the first time without help: first review in a week, then 14 days, then mastered at 30', () => {
    const first = scheduleAfterAnswer(item, true, false, 'write-en', day(0))
    expect(first.confidence).toBe(3)
    expect(daysUntil(first.nextReviewAt, day(0))).toBe(7)
    history(attempt(day(0), true, first))
    const second = scheduleAfterAnswer(item, true, false, 'write-en', day(7))
    expect(second.confidence).toBe(4)
    expect(daysUntil(second.nextReviewAt, day(7))).toBe(14)
    history(attempt(day(0), true, first), attempt(day(7), true, second))
    const third = scheduleAfterAnswer(item, true, false, 'write-en', day(21))
    expect(third.confidence).toBe(5)
    expect(daysUntil(third.nextReviewAt, day(21))).toBe(30)
  })
  it('a fill-the-gap answer counts the same way', () => {
    const first = scheduleAfterAnswer(item, true, false, 'fill-gap', day(0))
    expect(daysUntil(first.nextReviewAt, day(0))).toBe(7)
  })
  it('wrong first, then right: the normal path (tomorrow)', () => {
    history(attempt(day(0), false, { nextReviewAt: day(0).toISOString() }))
    const result = scheduleAfterAnswer(item, true, false, 'write-en', day(1))
    expect(result.confidence).toBe(1)
    expect(daysUntil(result.nextReviewAt, day(1))).toBe(1)
  })
  it('a hint, dictation, choosing or the Russian meaning at first sight give no head start', () => {
    for (const [hint, mode] of [
      [true, 'write-en'],
      [false, 'listen-write'],
      [false, 'choose-spelling'],
      [false, 'translate-ru'],
    ] as const) {
      window.localStorage.clear()
      const first = scheduleAfterAnswer(item, true, hint, mode, day(0))
      expect(daysUntil(first.nextReviewAt, day(0)), `${hint} ${mode}`).toBe(1)
      history(attempt(day(0), true, { hintUsed: hint, attemptMode: mode, ...first }))
      const next = scheduleAfterAnswer(item, true, false, 'write-en', day(1))
      expect(next.confidence, `${hint} ${mode} next`).toBeLessThanOrEqual(2)
      expect(daysUntil(next.nextReviewAt, day(1)), `${hint} ${mode} next`).toBeLessThanOrEqual(3)
    }
  })
  it('first seen in proofreading or in the level check: no head start', () => {
    const level = scheduleAfterAnswer({ ...item, library: 'Level check' }, true, false, 'write-en', day(0))
    expect(daysUntil(level.nextReviewAt, day(0))).toBe(1)
    history(attempt(day(0), true, { attemptMode: 'choose-spelling', library: 'Proofreading' }))
    expect(scheduleAfterAnswer(item, true, false, 'write-en', day(1)).confidence).toBe(1)
  })
  it('a mistake after the head start cancels it', () => {
    const first = scheduleAfterAnswer(item, true, false, 'write-en', day(0))
    history(attempt(day(0), true, first), attempt(day(7), false, { nextReviewAt: day(7).toISOString() }))
    const result = scheduleAfterAnswer(item, true, false, 'write-en', day(8))
    expect(result.confidence).toBe(1)
    expect(daysUntil(result.nextReviewAt, day(8))).toBe(1)
  })
  it('a correct dictation the next day does not pull a known word back to tomorrow', () => {
    const first = scheduleAfterAnswer(item, true, false, 'write-en', day(0))
    history(attempt(day(0), true, first))
    const heard = scheduleAfterAnswer(item, true, false, 'listen-write', day(1))
    expect(daysUntil(heard.nextReviewAt, day(0))).toBe(7)
    expect(heard.confidence).toBe(3)
  })
})
