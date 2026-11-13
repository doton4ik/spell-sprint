import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { pairIndex } from '../data/pairIndex'
import {
  clearPairToOpen,
  getPairAttempts,
  mergePairAttempts,
  openPairOnPairsPage,
  pairStatuses,
  pairToOpen,
  recordPairAnswer,
  type PairAttempt,
} from './pairs'
import { STORAGE_FAILED_EVENT } from './safeStorage'

const KEY = 'spell-sprint.pair-attempts'
const NOW = new Date(2026, 10, 12, 12, 0, 0) // 12 Nov 2026, local noon
const at = (daysAgo: number, hour = 10) => new Date(2026, 10, 12 - daysAgo, hour, 0, 0).toISOString()
const pair = pairIndex[0]
const other = pairIndex[1]

let counter = 0
const attempt = (over: Partial<PairAttempt> = {}): PairAttempt => ({
  id: `p${++counter}`,
  pairId: pair.id,
  sentence: 'It is ___ car.',
  chosen: pair.words[0],
  correct: true,
  createdAt: at(0),
  ...over,
})
const store = (attempts: unknown) => window.localStorage.setItem(KEY, JSON.stringify(attempts))
const statusOf = (attempts: PairAttempt[], id = pair.id) => pairStatuses(attempts, NOW).find((item) => item.pair.id === id)!

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})
afterEach(() => vi.useRealTimers())

describe('saved pair answers', () => {
  it('an answer survives a reload and is marked right or wrong against the sentence answer', () => {
    recordPairAnswer(pair, { text: 'It is ___ car.', answer: pair.words[0] }, pair.words[0])
    recordPairAnswer(pair, { text: 'It is ___ car.', answer: pair.words[0] }, pair.words[1])
    const saved = getPairAttempts()
    expect(saved).toHaveLength(2)
    expect(saved.map((item) => item.correct).sort()).toEqual([false, true])
    expect(saved[0]).toMatchObject({ pairId: pair.id, answer: pair.words[0], sentence: 'It is ___ car.' })
  })
  it('empty storage and damaged JSON give an empty list', () => {
    expect(getPairAttempts()).toEqual([])
    window.localStorage.setItem(KEY, '[{"id":')
    expect(getPairAttempts()).toEqual([])
    window.localStorage.setItem(KEY, '{"not":"a list"}')
    expect(getPairAttempts()).toEqual([])
  })
  it('broken records are skipped, good ones kept', () => {
    store([attempt({ id: 'good' }), { id: 'no-pair', correct: true, createdAt: 'x' }, null, 5, { ...attempt(), correct: 'yes' }])
    expect(getPairAttempts().map((item) => item.id)).toEqual(['good'])
  })
  it('only the newest 3000 answers are kept, newest first', () => {
    const old = Array.from({ length: 3000 }, (_, index) => attempt({ id: `old${index}`, createdAt: at(30) }))
    store(old)
    recordPairAnswer(pair, { text: 's', answer: 'a' }, 'a')
    const saved = getPairAttempts()
    expect(saved).toHaveLength(3000)
    expect(saved[0].createdAt).toBe(NOW.toISOString())
  })
  it('tells the app that learning data changed', () => {
    const listener = vi.fn()
    window.addEventListener('spell-sprint:learning-updated', listener)
    recordPairAnswer(pair, { text: 's', answer: 'a' }, 'a')
    window.removeEventListener('spell-sprint:learning-updated', listener)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  it('a full storage raises the "could not save" notice', () => {
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    const failed = vi.fn()
    window.addEventListener(STORAGE_FAILED_EVENT, failed)
    try {
      expect(() => recordPairAnswer(pair, { text: 's', answer: 'a' }, 'a')).not.toThrow()
    } finally {
      window.removeEventListener(STORAGE_FAILED_EVENT, failed)
      setItem.mockRestore()
    }
    expect(failed).toHaveBeenCalled()
  })
})

describe('mergePairAttempts (cloud restore)', () => {
  it('adds answers from another device and never removes or duplicates', () => {
    store([attempt({ id: 'mine' })])
    mergePairAttempts([attempt({ id: 'mine' }), attempt({ id: 'theirs', createdAt: at(1) })])
    expect(
      getPairAttempts()
        .map((item) => item.id)
        .sort(),
    ).toEqual(['mine', 'theirs'])
  })
  it('ignores anything that is not a list and drops broken records', () => {
    store([attempt({ id: 'mine' })])
    mergePairAttempts('nonsense')
    mergePairAttempts(null)
    mergePairAttempts([{ id: 'bad' }])
    expect(getPairAttempts().map((item) => item.id)).toEqual(['mine'])
  })
})

describe('pairStatuses: when a pair comes back', () => {
  it('a pair never tried is new and due', () => {
    expect(statusOf([])).toMatchObject({ state: 'new', due: true, answers: 0, errors: 0, goodDays: 0 })
    expect(pairStatuses([], NOW)).toHaveLength(pairIndex.length)
  })
  it('a mistake brings the pair back the same day', () => {
    expect(statusOf([attempt({ correct: false, createdAt: at(0, 9) })])).toMatchObject({
      state: 'learning',
      due: true,
      errors: 1,
      goodDays: 0,
    })
  })
  it('one good day: due again tomorrow, not today', () => {
    const status = statusOf([attempt({ createdAt: at(0, 9) })])
    expect(status).toMatchObject({ state: 'learning', goodDays: 1, due: false })
    expect(status.nextReviewAt).toBe(new Date(2026, 10, 13, 0, 0, 0).toISOString())
  })
  it('a good answer yesterday is due today (the date is the start of the day)', () => {
    expect(statusOf([attempt({ createdAt: at(1, 23) })])).toMatchObject({ goodDays: 1, due: true })
  })
  it('two answers on the same day are one good day', () => {
    expect(statusOf([attempt({ createdAt: at(0, 8) }), attempt({ createdAt: at(0, 9) })]).goodDays).toBe(1)
  })
  it('good days on different days push the next review 1, 3, 7, 14, 30 days away', () => {
    // last answer 6 days ago; three good days so far: next review is 7 days after the last answer
    const status = statusOf([attempt({ createdAt: at(8) }), attempt({ createdAt: at(7) }), attempt({ createdAt: at(6) })])
    expect(status.goodDays).toBe(3)
    expect(status.nextReviewAt).toBe(new Date(2026, 10, 12 - 6 + 7, 0, 0, 0).toISOString())
    expect(status.due).toBe(false)
  })
  it('a mistake resets the streak: only good days after it count', () => {
    const status = statusOf([
      attempt({ createdAt: at(5) }),
      attempt({ createdAt: at(4) }),
      attempt({ correct: false, createdAt: at(3) }),
      attempt({ createdAt: at(2) }),
    ])
    expect(status).toMatchObject({ goodDays: 1, errors: 1, answers: 4 })
  })
  it('five good days after the last mistake make the pair mastered', () => {
    const days = [10, 9, 8, 7, 6].map((daysAgo) => attempt({ createdAt: at(daysAgo) }))
    expect(statusOf([attempt({ correct: false, createdAt: at(11) }), ...days])).toMatchObject({ state: 'mastered', goodDays: 5 })
    expect(statusOf(days.slice(1))).toMatchObject({ state: 'learning', goodDays: 4 })
  })
  it('a pair is judged only by its own answers', () => {
    const attempts = [attempt({ correct: false })]
    expect(statusOf(attempts, other.id).state).toBe('new')
  })
  it('just after midnight a pair answered well the evening before is due', () => {
    const status = pairStatuses(
      [attempt({ createdAt: new Date(2026, 10, 12, 23, 50, 0).toISOString() })],
      new Date(2026, 10, 13, 0, 0, 10),
    ).find((item) => item.pair.id === pair.id)!
    expect(status.due).toBe(true)
  })
})

describe('opening a pair from My Mistakes', () => {
  it('the pair id is handed over once and can be cleared', () => {
    openPairOnPairsPage('their-there-theyre')
    expect(window.location.hash).toBe('#pairs')
    expect(pairToOpen()).toBe('their-there-theyre')
    clearPairToOpen()
    expect(pairToOpen()).toBeNull()
  })
})
