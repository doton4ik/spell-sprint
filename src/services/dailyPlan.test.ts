import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { buildDailyPlan, getStreak, getTodayCount, getWordProgress, localDayKey, reasonForWord, wordsIntroducedToday } from './dailyPlan'
import { getAllWords } from './libraryStorage'
import { setWordHidden } from './libraryPrefs'

const NOW = new Date(2026, 10, 12, 12, 0, 0) // 12 Nov 2026, local noon

const at = (daysAgo: number, hour = 10, minute = 0) => new Date(2026, 10, 12 - daysAgo, hour, minute, 0).toISOString()

let counter = 0
function attempt(over: Partial<PracticeAttempt> = {}): PracticeAttempt {
  counter += 1
  return {
    id: `a${counter}`,
    taskId: `t${counter}`,
    taskType: 'correct-spelling',
    topic: 'T',
    userAnswer: 'x',
    correctAnswer: 'x',
    isCorrect: true,
    wasSkipped: false,
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    confidence: 0,
    errorCategory: '',
    needsReview: false,
    createdAt: at(0),
    ...over,
  } as PracticeAttempt
}

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

describe('localDayKey', () => {
  it('is the local calendar day with zero padding', () => {
    expect(localDayKey(new Date(2026, 0, 5, 1, 30))).toBe('2026-01-05')
    expect(localDayKey(new Date(2026, 11, 31, 23, 59, 59))).toBe('2026-12-31')
  })
  it('puts 00:00 and 23:59 on the same day, and the next midnight on the next day', () => {
    expect(localDayKey(new Date(2026, 10, 12, 0, 0, 0))).toBe('2026-11-12')
    expect(localDayKey(new Date(2026, 10, 12, 23, 59, 59))).toBe('2026-11-12')
    expect(localDayKey(new Date(2026, 10, 13, 0, 0, 0))).toBe('2026-11-13')
  })
})

describe('getStreak', () => {
  it('is zero without answers', () => {
    expect(getStreak([])).toEqual({ streak: 0, practisedToday: false })
  })
  it('counts consecutive days including today', () => {
    const list = [attempt({ createdAt: at(0) }), attempt({ createdAt: at(1) }), attempt({ createdAt: at(2) })]
    expect(getStreak(list)).toEqual({ streak: 3, practisedToday: true })
  })
  it('keeps yesterday’s streak alive before the first answer of today', () => {
    expect(getStreak([attempt({ createdAt: at(1) }), attempt({ createdAt: at(2) })])).toEqual({ streak: 2, practisedToday: false })
  })
  it('breaks after a whole day without practice', () => {
    expect(getStreak([attempt({ createdAt: at(2) }), attempt({ createdAt: at(3) })])).toEqual({ streak: 0, practisedToday: false })
  })
  it('stops at a gap', () => {
    const list = [at(0), at(1), at(3), at(4)].map((createdAt) => attempt({ createdAt }))
    expect(getStreak(list).streak).toBe(2)
  })
  it('counts many answers on one day as one day', () => {
    const list = [at(0, 8), at(0, 9), at(0, 20)].map((createdAt) => attempt({ createdAt }))
    expect(getStreak(list).streak).toBe(1)
  })
  it('uses the local day around midnight', () => {
    vi.setSystemTime(new Date(2026, 10, 12, 0, 30))
    // 23:50 yesterday and 00:10 today are two different days
    const list = [
      attempt({ createdAt: new Date(2026, 10, 11, 23, 50).toISOString() }),
      attempt({ createdAt: new Date(2026, 10, 12, 0, 10).toISOString() }),
    ]
    expect(getStreak(list)).toEqual({ streak: 2, practisedToday: true })
  })
  it('survives a month boundary', () => {
    vi.setSystemTime(new Date(2026, 11, 1, 9, 0))
    const list = [new Date(2026, 11, 1, 8), new Date(2026, 10, 30, 8), new Date(2026, 10, 29, 8)].map((date) =>
      attempt({ createdAt: date.toISOString() }),
    )
    expect(getStreak(list).streak).toBe(3)
  })
  it('reads the stored history by default', () => {
    store([attempt({ createdAt: at(0) }), attempt({ createdAt: at(1) })])
    expect(getStreak().streak).toBe(2)
  })
})

describe('getTodayCount', () => {
  it('counts only answers from today', () => {
    expect(
      getTodayCount([attempt({ createdAt: at(0, 0, 1) }), attempt({ createdAt: at(0, 23, 59) }), attempt({ createdAt: at(1, 23, 59) })]),
    ).toBe(2)
  })
  it('is zero for an empty history', () => {
    expect(getTodayCount([])).toBe(0)
    expect(getTodayCount()).toBe(0)
  })
})

describe('getWordProgress', () => {
  it('is empty without answers and skips answers that have no word', () => {
    expect(getWordProgress().size).toBe(0)
    store([attempt({ wordId: undefined })])
    expect(getWordProgress().size).toBe(0)
  })
  it('counts answers per word and takes the newest as the latest', () => {
    store([
      attempt({ wordId: 'w1', isCorrect: true, createdAt: at(0) }),
      attempt({ wordId: 'w1', isCorrect: false, createdAt: at(1) }),
      attempt({ wordId: 'w1', isCorrect: false, createdAt: at(2) }),
    ])
    const entry = getWordProgress().get('w1')!
    expect(entry).toMatchObject({ attempts: 3, correct: 1, errors: 2 })
    expect(entry.latest.createdAt).toBe(at(0))
  })
  it('is due when the review date is today, even late in the evening, and not due for tomorrow', () => {
    store([
      attempt({ wordId: 'today', nextReviewAt: new Date(2026, 10, 12, 23, 30).toISOString() }),
      attempt({ wordId: 'tomorrow', nextReviewAt: new Date(2026, 10, 13, 0, 0, 1).toISOString() }),
      attempt({ wordId: 'past', nextReviewAt: at(3) }),
    ])
    const progress = getWordProgress()
    expect(progress.get('today')!.due).toBe(true)
    expect(progress.get('tomorrow')!.due).toBe(false)
    expect(progress.get('past')!.due).toBe(true)
  })
  it('without a schedule the answer’s own time is the due date', () => {
    store([attempt({ wordId: 'w', nextReviewAt: undefined, createdAt: at(1) })])
    expect(getWordProgress().get('w')!.dueAt).toBe(at(1))
  })
  it('honours a manual “mark reviewed” date only if it is newer than the last answer', () => {
    window.localStorage.clear()
    store([attempt({ wordId: 'w', nextReviewAt: at(2), createdAt: at(1) })])
    expect(getWordProgress().get('w')!.due).toBe(true)
  })
})

describe('wordsIntroducedToday', () => {
  it('counts words whose first answer was today, once each', () => {
    store([
      attempt({ wordId: 'a', createdAt: at(0, 9) }),
      attempt({ wordId: 'a', createdAt: at(0, 10) }),
      attempt({ wordId: 'b', createdAt: at(0, 11) }),
    ])
    expect(wordsIntroducedToday()).toBe(2)
  })
  it('does not count a word first met on an earlier day', () => {
    store([attempt({ wordId: 'a', createdAt: at(3) }), attempt({ wordId: 'a', createdAt: at(0) })])
    expect(wordsIntroducedToday()).toBe(0)
  })
  it('ignores level-check answers and answers without a word', () => {
    store([attempt({ wordId: 'a', library: 'Level check' }), attempt({ wordId: undefined })])
    expect(wordsIntroducedToday()).toBe(0)
  })
  it('can look at another day', () => {
    store([attempt({ wordId: 'a', createdAt: at(1) })])
    expect(wordsIntroducedToday(new Date(2026, 10, 11, 15))).toBe(1)
    expect(wordsIntroducedToday()).toBe(0)
  })
})

describe('reasonForWord', () => {
  const entry = (over: Partial<ReturnType<typeof progress>> = {}) => ({ ...progress(), ...over })
  function progress() {
    return { latest: attempt({ createdAt: at(0) }), errors: 0, correct: 1, attempts: 1, dueAt: at(0), due: false }
  }

  it('is a new word when there is no history', () => {
    expect(reasonForWord(undefined)).toEqual({ kind: 'new', text: 'New word' })
  })
  it('says a wrong answer that is due is missed, and tells how long ago', () => {
    const wrongToday = entry({ due: true, latest: attempt({ isCorrect: false, createdAt: at(0) }) })
    expect(reasonForWord(wrongToday)).toEqual({ kind: 'missed', text: 'Missed today — repeat' })
    expect(reasonForWord({ ...wrongToday, latest: attempt({ isCorrect: false, createdAt: at(1) }) }).text).toBe('Missed yesterday — repeat')
    expect(reasonForWord({ ...wrongToday, latest: attempt({ isCorrect: false, createdAt: at(5) }) }).text).toBe(
      'Missed 5 days ago — repeat',
    )
  })
  it('says a right answer that is due is a review', () => {
    expect(reasonForWord(entry({ due: true, latest: attempt({ isCorrect: true, createdAt: at(2) }) }))).toEqual({
      kind: 'due',
      text: 'Review due · last seen 2 days ago',
    })
  })
  it('says a word with more mistakes than right answers keeps slipping', () => {
    expect(reasonForWord(entry({ errors: 3, correct: 1 }))).toEqual({ kind: 'weak', text: 'Keeps slipping · 3 mistakes' })
  })
  it('does not call equal mistakes and right answers weak', () => {
    expect(reasonForWord(entry({ errors: 2, correct: 2 })).kind).toBe('practice')
  })
  it('falls back to extra practice', () => {
    expect(reasonForWord(entry({ latest: attempt({ createdAt: at(4) }) }))).toEqual({
      kind: 'practice',
      text: 'Extra practice · last seen 4 days ago',
    })
  })
  it('treats a future timestamp as today rather than showing a negative number', () => {
    expect(reasonForWord(entry({ latest: attempt({ createdAt: new Date(2026, 10, 13).toISOString() }) })).text).toBe(
      'Extra practice · last seen today',
    )
  })
})

describe('buildDailyPlan', () => {
  const words = () => getAllWords().slice(0, 12)
  const future = () => new Date(2026, 10, 20).toISOString()

  it('with no history, offers only new words, up to the size and the new-word cap', () => {
    const plan = buildDailyPlan(10, 4)
    expect(plan.items).toHaveLength(4)
    expect(plan.items.every((item) => item.reason === 'new')).toBe(true)
    expect(plan).toMatchObject({ due: 0, weak: 0, fresh: 4, extra: 0, dueTotal: 0 })
  })
  it('never exceeds the size and returns nothing for size 0', () => {
    expect(buildDailyPlan(3, 10).items).toHaveLength(3)
    expect(buildDailyPlan(0, 10).items).toEqual([])
  })
  it('gives no new words when the cap is 0', () => {
    expect(buildDailyPlan(5, 0).items).toEqual([])
  })
  it('has no repeated words, and the same plan when asked twice on one day', () => {
    const first = buildDailyPlan(15, 15).items.map((item) => item.word.wordId)
    expect(new Set(first).size).toBe(first.length)
    expect(buildDailyPlan(15, 15).items.map((item) => item.word.wordId)).toEqual(first)
  })
  it('puts words that are due first, and does not offer them again as new', () => {
    const [a, b] = words()
    store([
      attempt({ wordId: a.wordId, isCorrect: false, createdAt: at(2), nextReviewAt: at(1) }),
      attempt({ wordId: b.wordId, isCorrect: true, createdAt: at(2), nextReviewAt: at(1) }),
    ])
    const plan = buildDailyPlan(6, 3)
    expect(plan.items.slice(0, 2).map((item) => [item.word.wordId, item.reason])).toEqual([
      [a.wordId, 'due'], // a wrong answer comes before a right one
      [b.wordId, 'due'],
    ])
    expect(plan.due).toBe(2)
    expect(plan.dueTotal).toBe(2)
    expect(plan.items.filter((item) => item.word.wordId === a.wordId)).toHaveLength(1)
    expect(plan.items.filter((item) => item.reason === 'new').every((item) => ![a.wordId, b.wordId].includes(item.word.wordId))).toBe(true)
  })
  it('orders due words with more mistakes first', () => {
    const [a, b] = words()
    store([
      attempt({ wordId: a.wordId, isCorrect: false, createdAt: at(3), nextReviewAt: at(2) }),
      attempt({ wordId: b.wordId, isCorrect: false, createdAt: at(3), nextReviewAt: at(2) }),
      attempt({ wordId: b.wordId, isCorrect: false, createdAt: at(4), nextReviewAt: at(2) }),
    ])
    expect(buildDailyPlan(4, 0).items.map((item) => item.word.wordId)).toEqual([b.wordId, a.wordId])
  })
  it('keeps a couple of new words on a day crowded with reviews, and reports the whole due count', () => {
    const list = words()
    store(list.map((word) => attempt({ wordId: word.wordId, isCorrect: false, createdAt: at(2), nextReviewAt: at(1) })))
    const plan = buildDailyPlan(8, 6)
    expect(plan.dueTotal).toBe(12)
    expect(plan.due).toBe(6)
    expect(plan.fresh).toBe(2)
    expect(plan.items).toHaveLength(8)
  })
  it('offers a word that keeps going wrong (2+ mistakes, not sure of it) as weak when it is not due', () => {
    const [a] = words()
    store([
      attempt({ wordId: a.wordId, isCorrect: false, confidence: 0, createdAt: at(2), nextReviewAt: future() }),
      attempt({ wordId: a.wordId, isCorrect: false, confidence: 0, createdAt: at(3), nextReviewAt: future() }),
    ])
    const plan = buildDailyPlan(5, 0)
    expect(plan.items).toEqual([{ word: a, reason: 'weak' }])
    expect(plan.weak).toBe(1)
  })
  it('does not call a word weak when the latest answer shows confidence', () => {
    const [a] = words()
    store([
      attempt({ wordId: a.wordId, isCorrect: true, confidence: 3, createdAt: at(2), nextReviewAt: future() }),
      attempt({ wordId: a.wordId, isCorrect: false, createdAt: at(3), nextReviewAt: future() }),
      attempt({ wordId: a.wordId, isCorrect: false, createdAt: at(4), nextReviewAt: future() }),
    ])
    expect(buildDailyPlan(5, 0).items).toEqual([])
  })
  it('fills the rest of the day with extra practice, shakiest first, but never words known on sight', () => {
    const [a, b, c] = words()
    store([
      attempt({ wordId: a.wordId, confidence: 2, createdAt: at(5), nextReviewAt: future() }),
      attempt({ wordId: b.wordId, confidence: 0, createdAt: at(4), nextReviewAt: future() }),
      attempt({ wordId: c.wordId, confidence: 3, createdAt: at(6), nextReviewAt: future() }),
    ])
    const plan = buildDailyPlan(5, 0)
    expect(plan.items.map((item) => [item.word.wordId, item.reason])).toEqual([
      [b.wordId, 'extra'],
      [a.wordId, 'extra'],
    ])
    expect(plan.extra).toBe(2)
  })
  it('does not offer extra practice for a word answered today', () => {
    const [a] = words()
    store([attempt({ wordId: a.wordId, confidence: 0, createdAt: at(0, 8), nextReviewAt: future() })])
    expect(buildDailyPlan(5, 0).items).toEqual([])
  })
  it('answers given today use up the size', () => {
    const list = words()
    store(list.slice(0, 3).map((word) => attempt({ wordId: word.wordId, createdAt: at(0, 8), nextReviewAt: future() })))
    expect(buildDailyPlan(5, 10).items).toHaveLength(2)
    expect(buildDailyPlan(3, 10).items).toEqual([])
  })
  it('new words met today use up the cap of new words', () => {
    const list = words()
    store(list.slice(0, 2).map((word) => attempt({ wordId: word.wordId, createdAt: at(0, 8), nextReviewAt: future() })))
    const plan = buildDailyPlan(10, 3)
    expect(plan.fresh).toBe(1)
  })
  it('skips history of words that have left the library or been hidden', () => {
    const [a] = words()
    store([
      attempt({ wordId: 'gone-forever', isCorrect: false, createdAt: at(2), nextReviewAt: at(1) }),
      attempt({ wordId: a.wordId, isCorrect: false, createdAt: at(2), nextReviewAt: at(1) }),
    ])
    setWordHidden(a.wordId, true)
    const plan = buildDailyPlan(5, 0)
    expect(plan.items).toEqual([])
    expect(plan.dueTotal).toBe(0)
  })
  it('does not offer a hidden word as new', () => {
    const first = buildDailyPlan(10, 10).items[0].word
    setWordHidden(first.wordId, true)
    expect(buildDailyPlan(10, 10).items.some((item) => item.word.wordId === first.wordId)).toBe(false)
  })
  it('changes the order of new words from one day to the next', () => {
    const today = buildDailyPlan(20, 20).items.map((item) => item.word.wordId)
    vi.setSystemTime(new Date(2026, 10, 13, 12))
    const tomorrow = buildDailyPlan(20, 20).items.map((item) => item.word.wordId)
    expect(tomorrow).not.toEqual(today)
  })
  it('keeps the same order for new words all day, including just before midnight', () => {
    const morning = buildDailyPlan(20, 20).items.map((item) => item.word.wordId)
    vi.setSystemTime(new Date(2026, 10, 12, 23, 59))
    expect(buildDailyPlan(20, 20).items.map((item) => item.word.wordId)).toEqual(morning)
  })
  it('uses the profile when called without arguments', () => {
    const plan = buildDailyPlan()
    expect(plan.items.length).toBeGreaterThan(0)
    expect(plan.items.length).toBeLessThanOrEqual(30)
  })
})
