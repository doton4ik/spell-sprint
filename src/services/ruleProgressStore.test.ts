import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const db = vi.hoisted(() => ({
  selectRows: vi.fn(async (..._args: unknown[]): Promise<Array<Record<string, unknown>>> => []),
  insertRows: vi.fn(async (..._args: unknown[]) => []),
}))
vi.mock('./supabase', () => db)

import {
  getProgressRow,
  nextProgressAfterCorrectPractice,
  nextProgressAfterMistake,
  today,
  upsertProgressRow,
  type ProgressRow,
} from './ruleProgressStore'

const row = (over: Partial<ProgressRow> = {}): ProgressRow => ({
  id: 'p1',
  status: 'learning',
  priority: 'practice',
  mistake_count: 0,
  correct_count: 0,
  correct_calendar_days: [],
  ...over,
})
const session = { access_token: 't', refresh_token: 'r', user: { id: 'u1' } } as never

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 12, 12, 0, 0))
  db.selectRows.mockReset().mockResolvedValue([])
  db.insertRows.mockReset().mockResolvedValue([])
})
afterEach(() => vi.useRealTimers())

describe('a mistake', () => {
  it('the first mistake on a rule starts it as new, with one mistake', () => {
    expect(nextProgressAfterMistake(null)).toEqual({
      status: 'new',
      priority: 'practice',
      mistake_count: 1,
      correct_count: 0,
      correct_calendar_days: [],
    })
  })
  it('a rule that was new moves to learning', () => {
    expect(nextProgressAfterMistake(row({ status: 'new', mistake_count: 1 }))).toMatchObject({ status: 'learning', mistake_count: 2 })
  })
  it('three mistakes make the rule critical, and it never goes back down by itself', () => {
    expect(nextProgressAfterMistake(row({ mistake_count: 1 })).priority).toBe('practice')
    expect(nextProgressAfterMistake(row({ mistake_count: 2 })).priority).toBe('critical')
    expect(nextProgressAfterMistake(row({ mistake_count: 7, priority: 'critical' })).priority).toBe('critical')
  })
  it('a mastered rule goes back to learning and the 5-day streak starts over', () => {
    const days = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05']
    const next = nextProgressAfterMistake(row({ status: 'mastered', priority: 'stable', correct_count: 9, correct_calendar_days: days }))
    expect(next).toMatchObject({ status: 'learning', priority: 'practice', correct_count: 0, correct_calendar_days: [], mistake_count: 1 })
  })
  it('a mistake on a rule that is still being learned keeps the correct answers already earned', () => {
    const next = nextProgressAfterMistake(row({ correct_count: 3, correct_calendar_days: ['2026-11-10'] }))
    expect(next).toMatchObject({ correct_count: 3, correct_calendar_days: ['2026-11-10'], status: 'learning' })
  })
  it('keeps the database id of the row', () => {
    expect(nextProgressAfterMistake(row({ id: 'keep-me' })).id).toBe('keep-me')
  })
})

describe('a correct practice answer', () => {
  it('the first one creates a learning rule with one good day (today)', () => {
    expect(nextProgressAfterCorrectPractice(null)).toMatchObject({
      status: 'learning',
      priority: 'practice',
      correct_count: 1,
      correct_calendar_days: ['2026-11-12'],
    })
  })
  it('a second answer on the same day counts as an answer but not as a new day', () => {
    const next = nextProgressAfterCorrectPractice(row({ correct_count: 1, correct_calendar_days: ['2026-11-12'] }))
    expect(next.correct_count).toBe(2)
    expect(next.correct_calendar_days).toEqual(['2026-11-12'])
    expect(next.status).toBe('learning')
  })
  it('the fifth different day makes the rule mastered and stable; the fourth does not', () => {
    const four = ['2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08']
    expect(nextProgressAfterCorrectPractice(row({ correct_calendar_days: four.slice(0, 3) })).status).toBe('learning')
    expect(nextProgressAfterCorrectPractice(row({ correct_calendar_days: four.slice(0, 3) })).correct_calendar_days).toHaveLength(4)
    const next = nextProgressAfterCorrectPractice(row({ priority: 'critical', correct_calendar_days: four }))
    expect(next).toMatchObject({ status: 'mastered', priority: 'stable' })
    expect(next.correct_calendar_days).toHaveLength(5)
  })
  it('five answers in one day are not enough to master a rule', () => {
    let current: ProgressRow | null = null
    for (let index = 0; index < 5; index += 1) current = nextProgressAfterCorrectPractice(current)
    expect(current).toMatchObject({ status: 'learning', correct_count: 5 })
  })
  it('a new rule starts learning rather than staying "new"', () => {
    expect(nextProgressAfterCorrectPractice(row({ status: 'new' })).status).toBe('learning')
  })
  it('does not change the stored list it was given', () => {
    const days = ['2026-11-01']
    nextProgressAfterCorrectPractice(row({ correct_calendar_days: days }))
    expect(days).toEqual(['2026-11-01'])
  })
})

describe('today (the day of the 5-days rule is the learner’s own calendar day)', () => {
  it('00:30 local is that day, 23:30 local is still that day', () => {
    vi.setSystemTime(new Date(2026, 10, 12, 0, 30, 0))
    expect(today()).toBe('2026-11-12')
    vi.setSystemTime(new Date(2026, 10, 12, 23, 30, 0))
    expect(today()).toBe('2026-11-12')
  })
  it('an evening answer and a night answer after midnight are two different days', () => {
    vi.setSystemTime(new Date(2026, 10, 12, 22, 0, 0))
    const evening = nextProgressAfterCorrectPractice(null)
    vi.setSystemTime(new Date(2026, 10, 13, 1, 0, 0))
    expect(nextProgressAfterCorrectPractice(evening).correct_calendar_days).toEqual(['2026-11-12', '2026-11-13'])
  })
})

describe('reading and writing the progress row', () => {
  it('no row yet is null', async () => {
    expect(await getProgressRow(session, 'r1')).toBeNull()
  })
  it('a stored row is read into the shape the rules use, asking only for this user and rule', async () => {
    db.selectRows.mockResolvedValue([
      {
        id: 'p9',
        status: 'mastered',
        priority: 'stable',
        mistake_count: 2,
        correct_count: 6,
        correct_calendar_days: ['2026-11-01'],
        extra: 1,
      },
    ])
    expect(await getProgressRow(session, 'r1')).toEqual({
      id: 'p9',
      status: 'mastered',
      priority: 'stable',
      mistake_count: 2,
      correct_count: 6,
      correct_calendar_days: ['2026-11-01'],
    })
    expect(db.selectRows).toHaveBeenCalledWith(session, 'user_rule_progress', { user_id: 'u1', rule_id: 'r1' }, { limit: 1 })
  })
  it('saving writes one row per user and rule (upsert on user_id,rule_id)', async () => {
    await upsertProgressRow(session, 'r1', row({ status: 'mastered', priority: 'stable', mistake_count: 1, correct_count: 5 }))
    const [, table, body, options] = db.insertRows.mock.calls[0] as [unknown, string, Record<string, unknown>, Record<string, unknown>]
    expect(table).toBe('user_rule_progress')
    expect(body).toMatchObject({ user_id: 'u1', rule_id: 'r1', status: 'mastered', priority: 'stable', mistake_count: 1, correct_count: 5 })
    expect(body.last_result_at).toBe(new Date(2026, 10, 12, 12, 0, 0).toISOString())
    expect(options).toEqual({ onConflict: 'user_id,rule_id' })
  })
  it('a database error reaches the caller (it is not hidden)', async () => {
    db.selectRows.mockRejectedValue(new Error('down'))
    await expect(getProgressRow(session, 'r1')).rejects.toThrow('down')
  })
})
