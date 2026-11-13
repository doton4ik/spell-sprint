import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { getLearningAnalytics, MIN_ANSWERS_FOR_ACCURACY, MIN_ANSWERS_FOR_TOPIC } from './learningAnalytics'

const NOW = new Date(2026, 10, 12, 12, 0, 0) // Thu 12 Nov 2026, local noon
const at = (daysAgo: number, hour = 10, minute = 0) => new Date(2026, 10, 12 - daysAgo, hour, minute, 0).toISOString()

let counter = 0
function attempt(over: Partial<PracticeAttempt> = {}): PracticeAttempt {
  counter += 1
  return {
    id: `a${counter}`,
    taskId: `t${counter}`,
    taskType: 'correct-spelling',
    topic: 'Food',
    userAnswer: 'x',
    correctAnswer: 'x',
    isCorrect: true,
    wasSkipped: false,
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    confidence: 0,
    errorCategory: 'General spelling',
    needsReview: false,
    createdAt: at(0),
    ...over,
  } as PracticeAttempt
}
const many = (count: number, over: Partial<PracticeAttempt> = {}) => Array.from({ length: count }, () => attempt(over))

// The history is stored newest first.
function store(attempts: PracticeAttempt[]) {
  const sorted = [...attempts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  window.localStorage.setItem('spell-sprint.practice-attempts', JSON.stringify(sorted))
}

beforeEach(() => {
  window.localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})
afterEach(() => vi.useRealTimers())

describe('getLearningAnalytics: empty and broken storage', () => {
  it('a new learner sees zeros, no percentage and a plain recommendation', () => {
    const stats = getLearningAnalytics()
    expect(stats.hasLiveData).toBe(false)
    expect(stats.totalAttempts).toBe(0)
    expect(stats.accuracy).toEqual({ percent: null, correct: 0, total: 0, previousPercent: null, enoughData: false })
    expect(stats.topics).toEqual([])
    expect(stats.recommendation).toBe('Practice')
    expect(stats.mainCategory).toBe('Spelling patterns')
    expect(stats.daily).toHaveLength(7)
    expect(stats.weeklyTotal).toBe(0)
  })
  it('broken JSON in storage behaves like an empty history', () => {
    window.localStorage.setItem('spell-sprint.practice-attempts', '{oops')
    const stats = getLearningAnalytics()
    expect(stats.totalAttempts).toBe(0)
    expect(stats.hasLiveData).toBe(false)
  })
})

describe('accuracy thresholds', () => {
  it('below MIN_ANSWERS_FOR_ACCURACY the percentage is shown but marked as not enough data', () => {
    store(many(MIN_ANSWERS_FOR_ACCURACY - 1))
    const { accuracy } = getLearningAnalytics()
    expect(accuracy.total).toBe(MIN_ANSWERS_FOR_ACCURACY - 1)
    expect(accuracy.enoughData).toBe(false)
  })
  it('at MIN_ANSWERS_FOR_ACCURACY the number counts', () => {
    store([...many(7), ...many(3, { isCorrect: false })])
    const { accuracy } = getLearningAnalytics()
    expect(accuracy).toMatchObject({ percent: 70, correct: 7, total: 10, enoughData: true })
  })
  it('"Meet the word" answers are not tests: they do not count as answers or mistakes', () => {
    store([...many(10), ...many(5, { introduced: true, isCorrect: false })])
    const stats = getLearningAnalytics()
    expect(stats.totalAttempts).toBe(10)
    expect(stats.mistakes).toBe(0)
    expect(stats.accuracy.percent).toBe(100)
  })
  it('only the last 30 days count, the 30 before them give the earlier percentage', () => {
    store([
      ...many(10, { createdAt: at(5) }), // recent: all right
      ...many(10, { createdAt: at(40), isCorrect: false }), // previous window: all wrong
      ...many(20, { createdAt: at(100) }), // older than 60 days: ignored
    ])
    const { accuracy } = getLearningAnalytics()
    expect(accuracy).toMatchObject({ percent: 100, total: 10, previousPercent: 0 })
  })
  it('the earlier percentage is hidden when it has fewer than MIN_ANSWERS_FOR_ACCURACY answers', () => {
    store([...many(10), ...many(MIN_ANSWERS_FOR_ACCURACY - 1, { createdAt: at(40) })])
    expect(getLearningAnalytics().accuracy.previousPercent).toBeNull()
  })
})

describe('the 30-day window around midnight', () => {
  it('an answer at 00:00 on the first day of the window counts, 23:59 the day before does not', () => {
    // today is day 0; the window starts 29 days back at local midnight
    store([attempt({ createdAt: at(29, 0, 0) }), attempt({ createdAt: at(30, 23, 59) })])
    expect(getLearningAnalytics().accuracy.total).toBe(1)
  })
  it('just after midnight "today" is a new empty bar and yesterday holds the late answer', () => {
    vi.setSystemTime(new Date(2026, 10, 13, 0, 0, 30))
    store([attempt({ createdAt: new Date(2026, 10, 12, 23, 59, 0).toISOString() })])
    const { daily } = getLearningAnalytics()
    expect(daily[6]).toMatchObject({ isToday: true, completed: 0 })
    expect(daily[5].completed).toBe(1)
  })
})

describe('daily bars', () => {
  it('shows seven days ending today, with weekday labels and the daily goal as the target', () => {
    window.localStorage.setItem('spell-sprint.profile', JSON.stringify({ dailyMinutes: 15 }))
    store([attempt(), attempt(), attempt({ createdAt: at(2) })])
    const { daily, weeklyTotal } = getLearningAnalytics()
    expect(daily.map((day) => day.label)).toEqual(['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'])
    expect(daily.map((day) => day.completed)).toEqual([0, 0, 0, 0, 1, 0, 2])
    expect(daily.every((day) => day.target === 30)).toBe(true)
    expect(daily.filter((day) => day.isToday)).toHaveLength(1)
    expect(weeklyTotal).toBe(3)
  })
  it('an answer from 8 days ago is not in the week', () => {
    store([attempt({ createdAt: at(8) })])
    expect(getLearningAnalytics().weeklyTotal).toBe(0)
  })
})

describe('topics', () => {
  it('a topic with fewer than MIN_ANSWERS_FOR_TOPIC answers is Preliminary, whatever its score', () => {
    store(many(MIN_ANSWERS_FOR_TOPIC - 1, { topic: 'Travel' }))
    expect(getLearningAnalytics().topics[0]).toMatchObject({ topic: 'Travel', score: 100, status: 'Preliminary' })
  })
  it('status follows the score: 80 Strong, 60 Developing, below Needs focus', () => {
    store([
      ...many(8, { topic: 'A' }),
      ...many(8, { topic: 'B' }).map((item, index) => ({ ...item, isCorrect: index < 5 })), // 5/8 = 63%
      ...many(8, { topic: 'C' }).map((item, index) => ({ ...item, isCorrect: index < 3 })), // 3/8 = 38%
      ...many(10, { topic: 'D' }).map((item, index) => ({ ...item, isCorrect: index < 8 })), // exactly 80%
    ])
    const byTopic = Object.fromEntries(getLearningAnalytics().topics.map((item) => [item.topic, item.status]))
    expect(byTopic).toEqual({ A: 'Strong', B: 'Developing', C: 'Needs focus', D: 'Strong' })
  })
  it('weakest confident topic first, topics with too little data last, at most five', () => {
    store([
      ...many(MIN_ANSWERS_FOR_TOPIC - 1, { topic: 'Tiny', isCorrect: false }), // 0% but not enough answers
      ...many(8, { topic: 'Good' }),
      ...many(8, { topic: 'Weak', isCorrect: false }),
      ...many(8, { topic: 'Mid' }).map((item, index) => ({ ...item, isCorrect: index < 5 })),
    ])
    expect(getLearningAnalytics().topics.map((item) => item.topic)).toEqual(['Weak', 'Mid', 'Good', 'Tiny'])
    store(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].flatMap((topic) => many(8, { topic })))
    expect(getLearningAnalytics().topics).toHaveLength(5)
  })
  it('the recommendation is the weakest topic that needs focus; with only tiny topics it stays "Practice"', () => {
    store([...many(8, { topic: 'Good' }), ...many(8, { topic: 'Weak', isCorrect: false })])
    expect(getLearningAnalytics().recommendation).toBe('Weak')
    store(many(3, { topic: 'Tiny', isCorrect: false }))
    expect(getLearningAnalytics().recommendation).toBe('Practice')
  })
})

describe('mistakes', () => {
  it('the main error category is the most frequent one among recent mistakes', () => {
    store([
      ...many(2, { isCorrect: false, errorCategory: 'Double consonants' }),
      ...many(3, { isCorrect: false, errorCategory: 'Vowel confusion' }),
      ...many(9, { isCorrect: false, errorCategory: 'Old habit', createdAt: at(45) }), // out of the window
    ])
    const stats = getLearningAnalytics()
    expect(stats.mainCategory).toBe('Vowel confusion')
    expect(stats.mistakes).toBe(14) // all-time count of wrong answers
  })
  it('recent mistakes: the three newest, a blank answer is called "Skipped"', () => {
    store([
      attempt({ isCorrect: false, userAnswer: 'a1', createdAt: at(4) }),
      attempt({ isCorrect: false, userAnswer: 'b2', createdAt: at(3) }),
      attempt({ isCorrect: false, userAnswer: '', createdAt: at(2) }),
      attempt({ isCorrect: false, userAnswer: 'd4', createdAt: at(1) }),
      attempt({ isCorrect: true, createdAt: at(0) }),
    ])
    const { recent } = getLearningAnalytics()
    expect(recent.map((item) => item.submitted)).toEqual(['d4', 'Skipped', 'b2'])
  })
})
