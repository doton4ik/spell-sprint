import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// When the browser's storage is full or blocked, a save of the learner's own data must raise the
// "could not save" notice (STORAGE_FAILED_EVENT, shown by AppShell) instead of being dropped silently.
const net = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(() => false),
  getActiveCloudSession: vi.fn(async (): Promise<unknown> => null),
  insertRows: vi.fn(async (..._args: unknown[]) => []),
}))
vi.mock('./supabase', () => ({ ...net, selectRows: vi.fn(async () => []) }))

import { flushFeedback, submitFeedback } from './feedback'
import { mergeLevelChecks } from './levelCheck'
import { saveSprintRound } from './sprint'
import { STORAGE_FAILED_EVENT } from './safeStorage'
import { reportWord } from './wordReports'
import { addYellowCard } from './yellowCards'

let notices = 0
const count = () => (notices += 1)
let setItem: ReturnType<typeof vi.spyOn>

function failSaves() {
  setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError')
  })
}

beforeEach(() => {
  window.localStorage.clear()
  net.isSupabaseConfigured.mockReset().mockReturnValue(false)
  net.getActiveCloudSession.mockReset().mockResolvedValue(null)
  net.insertRows.mockReset().mockResolvedValue([])
  notices = 0
  window.addEventListener(STORAGE_FAILED_EVENT, count)
})
afterEach(() => {
  window.removeEventListener(STORAGE_FAILED_EVENT, count)
  setItem?.mockRestore()
})

describe('a failed save of learner data raises the notice (and does not crash)', () => {
  it('a Sprint round', () => {
    failSaves()
    expect(() => saveSprintRound({ date: '2026-11-12T10:00:00.000Z', correct: 3, misses: 1, answers: [] })).not.toThrow()
    expect(notices).toBe(1)
  })
  it('a yellow card keeps its return value', () => {
    failSaves()
    expect(addYellowCard({ word: 'receive', shown: 'recieve', source: 'sprint', where: 'Sprint' })).toBe('yellow')
    expect(notices).toBe(1)
  })
  it('a level check result (here arriving from the cloud)', () => {
    failSaves()
    expect(mergeLevelChecks([{ id: 'c1', completedAt: '2026-11-12T10:00:00.000Z', skills: {} }])).toBe(1)
    expect(notices).toBe(1)
  })
  it('a word report', async () => {
    failSaves()
    expect(await reportWord({ wordId: 'w1', word: 'cat', reason: 'strange' })).toBe(false)
    expect(notices).toBeGreaterThanOrEqual(1)
  })
  it('a feedback message', async () => {
    failSaves()
    expect(await submitFeedback('idea', 'Please add dark mode')).toBe('saved')
    expect(notices).toBeGreaterThanOrEqual(1)
  })
  it('a working storage raises no notice and keeps the data', () => {
    saveSprintRound({ date: '2026-11-12T10:00:00.000Z', correct: 3, misses: 1, answers: [] })
    addYellowCard({ word: 'receive', shown: 'recieve', source: 'sprint', where: 'Sprint' })
    expect(notices).toBe(0)
    expect(JSON.parse(window.localStorage.getItem('spell-sprint.yellow-cards')!)).toHaveLength(1)
  })
})

describe('a send that found nothing to do does not block the next one', () => {
  it('a message written after an empty flush is sent once the learner is signed in', async () => {
    await flushFeedback() // e.g. at app start: nothing waiting
    net.isSupabaseConfigured.mockReturnValue(true)
    net.getActiveCloudSession.mockResolvedValue({ user: { id: 'u1' } })
    expect(await submitFeedback('idea', 'Please add dark mode')).toBe('sent')
    expect(net.insertRows).toHaveBeenCalledTimes(1)
  })
})
