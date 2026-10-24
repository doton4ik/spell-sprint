import { beforeEach, describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { buildChecklistFrom, countDay, describePlan, freshCapFor, planSteps, STEP_INFO } from './dailyChecklist'
import { buildDailyPlan } from './dailyPlan'
import { dailyMinutesOptions, defaultActivities, getProfile, saveProfile } from './profileStorage'

const none = { dictation: false, proofreading: false, pairs: false, sprint: false }
const attempt = (when: string, extra: Partial<PracticeAttempt> = {}) =>
  ({
    id: crypto.randomUUID(),
    taskId: 't',
    wordId: 'w',
    isCorrect: true,
    attemptMode: 'write-en',
    library: 'General English',
    createdAt: when,
    ...extra,
  }) as PracticeAttempt

describe('planSteps', () => {
  it('words are always first and fill a short day alone', () => {
    expect(planSteps(5, defaultActivities).map((step) => step.id)).toEqual(['words'])
    expect(planSteps(5, defaultActivities)[0].target).toBe(10)
  })
  it('a longer day adds kinds of practice, never more than about half of the minutes', () => {
    for (const minutes of dailyMinutesOptions) {
      const steps = planSteps(minutes, defaultActivities)
      const others = steps.slice(1).reduce((sum, step) => sum + step.minutes, 0)
      expect(others, `${minutes} min`).toBeLessThanOrEqual(minutes * 0.56)
      expect(steps[0].id).toBe('words')
      // the plan adds up to about the minutes chosen
      const total = steps.reduce((sum, step) => sum + step.minutes, 0)
      expect(Math.abs(total - minutes), `${minutes} min`).toBeLessThanOrEqual(1)
    }
  })
  it('only what is switched on is in the day', () => {
    expect(planSteps(50, none).map((step) => step.id)).toEqual(['words'])
    expect(planSteps(30, { ...none, proofreading: true }).map((step) => step.id)).toEqual(['words', 'proofreading'])
  })
  it('a 30-minute day holds proofreading, pairs, a sprint round and dictation', () => {
    expect(planSteps(30, defaultActivities).map((step) => step.id)).toEqual(['words', 'proofreading', 'pairs', 'sprint', 'dictation'])
  })
  it('describes each option for the settings', () => {
    expect(describePlan(10, defaultActivities)).toBe('13 words · 1 text')
    expect(describePlan(30, defaultActivities)).toContain('dictation of 5 words')
  })
  it('limits new words per day by the length of the day', () => {
    expect(freshCapFor(5)).toBeLessThan(freshCapFor(15))
    expect(freshCapFor(50)).toBeLessThanOrEqual(15)
  })
})

describe('countDay and the checklist', () => {
  const day = '2026-01-10'
  const noon = new Date(2026, 0, 10, 12).toISOString()
  const yesterday = new Date(2026, 0, 9, 12).toISOString()

  it('counts only what was answered that day, by kind', () => {
    const counts = countDay(day, {
      attempts: [
        attempt(noon),
        attempt(noon),
        attempt(noon, { attemptMode: 'listen-write' }),
        attempt(noon, { library: 'Proofreading' }),
        attempt(noon, { library: 'Level check' }),
        attempt(yesterday),
      ],
      pairAnswers: [{ createdAt: noon }, { createdAt: yesterday }],
      sprintRounds: [{ date: noon }, { date: yesterday }],
      proofreadingTexts: 2,
    })
    expect(counts).toEqual({ words: 2, dictation: 1, proofreading: 2, pairs: 1, sprint: 1 })
  })
  it('marks each step done, partly or not started and counts the minutes', () => {
    const profile = { dailyMinutes: 15, activities: defaultActivities }
    const empty = buildChecklistFrom(profile, { words: 0, dictation: 0, proofreading: 0, pairs: 0, sprint: 0 })
    expect(empty.steps.every((step) => step.status === 'todo')).toBe(true)
    expect(empty.next?.id).toBe('words')
    expect(empty.minutesDone).toBe(0)
    const wordsTarget = empty.steps[0].target
    const half = buildChecklistFrom(profile, { words: Math.floor(wordsTarget / 2), dictation: 0, proofreading: 1, pairs: 0, sprint: 0 })
    expect(half.steps[0].status).toBe('partly')
    expect(half.steps[0].left).toBe(wordsTarget - Math.floor(wordsTarget / 2))
    expect(half.steps[1].status).toBe('done')
    expect(half.next?.id).toBe('words')
    const all = buildChecklistFrom(profile, { words: 999, dictation: 999, proofreading: 99, pairs: 99, sprint: 99 })
    expect(all.allDone).toBe(true)
    expect(all.percent).toBe(100)
    expect(all.next).toBeNull()
  })
  it('knows a unit name for every step', () => {
    for (const id of ['words', 'dictation', 'proofreading', 'pairs', 'sprint'] as const)
      expect(STEP_INFO[id].many.length).toBeGreaterThan(0)
  })
})

describe('the profile and the plan size', () => {
  beforeEach(() => window.localStorage.clear())

  it('an old profile with a goal in tasks becomes minutes (about two answers a minute)', () => {
    window.localStorage.setItem('spell-sprint.profile', JSON.stringify({ name: 'Ann', dailyGoal: 30 }))
    const profile = getProfile()
    expect(profile.dailyMinutes).toBe(15)
    expect(profile.dailyGoal).toBe(30)
    expect(profile.activities).toEqual(defaultActivities)
  })
  it('keeps the goal in tasks in step with the minutes and the switches', () => {
    saveProfile({ dailyMinutes: 30, activities: { sprint: false } })
    const profile = getProfile()
    expect(profile.dailyGoal).toBe(60)
    expect(profile.activities.sprint).toBe(false)
    expect(profile.activities.pairs).toBe(true)
    saveProfile({ dailyMinutes: 7 }) // not an option: ignored
    expect(getProfile().dailyMinutes).toBe(30)
  })
  it('a long day does not bring in more new words than the cap', () => {
    saveProfile({ dailyMinutes: 50 })
    const plan = buildDailyPlan()
    expect(plan.fresh).toBeLessThanOrEqual(freshCapFor(50))
    expect(plan.items.length).toBeLessThanOrEqual(planSteps(50, getProfile().activities)[0].target)
  })
  it('a short day has fewer new words', () => {
    saveProfile({ dailyMinutes: 5 })
    expect(buildDailyPlan().fresh).toBeLessThanOrEqual(freshCapFor(5))
  })
})

describe('data', () => {
  it('has the same options in the settings and the plan', () => {
    for (const minutes of dailyMinutesOptions) expect(planSteps(minutes, defaultActivities)[0].target).toBeGreaterThan(5)
  })
})

describe('a whole day', () => {
  beforeEach(() => window.localStorage.clear())

  const answer = async (wordId: string, correct = true, when = new Date()) => {
    const { scheduleAfterAnswer } = await import('./reviewSchedule')
    const { savePracticeAttempt } = await import('./practiceStorage')
    const taskId = `library-${wordId}-write-en`
    const { confidence, nextReviewAt } = scheduleAfterAnswer({ wordId, taskId }, correct, false, 'write-en', when)
    savePracticeAttempt({
      id: crypto.randomUUID(),
      taskId,
      taskType: 'translate-ru-en',
      topic: 'General English',
      wordId,
      library: 'General English',
      userAnswer: 'x',
      correctAnswer: 'x',
      isCorrect: correct,
      wasSkipped: false,
      wasAnswerRevealed: false,
      hintUsed: false,
      attemptMode: 'write-en',
      errorType: 'unknown',
      confidence,
      nextReviewAt,
      errorCategory: '',
      needsReview: !correct,
      createdAt: when.toISOString(),
    } as PracticeAttempt)
  }

  it('new words never pass the cap in one day, and the words step ends when the day has nothing more to offer', async () => {
    saveProfile({ dailyMinutes: 10, activities: { proofreading: false, pairs: false, dictation: false, sprint: false } })
    const target = planSteps(10, getProfile().activities)[0].target
    const seen = new Set<string>()
    for (let round = 0; round < 6; round += 1) {
      const plan = buildDailyPlan()
      if (!plan.items.length) break
      for (const item of plan.items) {
        seen.add(item.word.wordId)
        await answer(item.word.wordId)
      }
    }
    expect(seen.size).toBeLessThanOrEqual(freshCapFor(10))
    expect(seen.size).toBeGreaterThan(0)
    const plan = buildDailyPlan()
    expect(plan.items).toHaveLength(0)
    const { buildChecklist } = await import('./dailyChecklist')
    const checklist = buildChecklist(plan.items.length)
    expect(checklist.steps[0].status).toBe('done')
    expect(checklist.steps[0].target).toBeLessThan(target)
    expect(checklist.allDone).toBe(true)
  })

  it('a word that was missed today comes back until it is right', async () => {
    saveProfile({ dailyMinutes: 10, activities: { proofreading: false, pairs: false, dictation: false, sprint: false } })
    const first = buildDailyPlan().items[0].word.wordId
    await answer(first, false)
    expect(buildDailyPlan().items.some((item) => item.word.wordId === first)).toBe(true)
  })

  it('extra practice leaves out words that are known and takes the shaky ones', async () => {
    saveProfile({ dailyMinutes: 50, activities: { proofreading: false, pairs: false, dictation: false, sprint: false } })
    const { getAllWords } = await import('./libraryStorage')
    const [known, shaky] = getAllWords().slice(0, 2)
    const yesterday = new Date(Date.now() - 86400000)
    const later = (days: number) => new Date(Date.now() + days * 86400000).toISOString()
    const { savePracticeAttempt } = await import('./practiceStorage')
    for (const [word, confidence, nextReviewAt] of [
      [known, 3, later(6)],
      [shaky, 1, later(2)],
    ] as const)
      savePracticeAttempt({
        id: crypto.randomUUID(),
        taskId: `library-${word.wordId}-write-en`,
        taskType: 'translate-ru-en',
        topic: '',
        wordId: word.wordId,
        library: 'General English',
        userAnswer: '',
        correctAnswer: '',
        isCorrect: true,
        wasSkipped: false,
        wasAnswerRevealed: false,
        hintUsed: false,
        attemptMode: 'write-en',
        errorType: 'unknown',
        confidence,
        nextReviewAt,
        errorCategory: '',
        createdAt: yesterday.toISOString(),
      } as PracticeAttempt)
    const extras = buildDailyPlan()
      .items.filter((item) => item.reason === 'extra')
      .map((item) => item.word.wordId)
    expect(extras).toContain(shaky.wordId)
    expect(extras).not.toContain(known.wordId)
  })
})
