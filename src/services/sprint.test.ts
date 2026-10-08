import { beforeEach, describe, expect, it } from 'vitest'
import { getSprintRounds, mergeSprintRounds, saveSprintRound, sprintCorrect } from './sprint'

describe('sprint', () => {
  beforeEach(() => window.localStorage.clear())

  it('accepts any accepted answer, ignoring case, spaces and hyphens', () => {
    const word = { word: 'autumn', alternatives: ['fall'] }
    expect(sprintCorrect(' Fall ', word)).toBe(true)
    expect(sprintCorrect('autumn', word)).toBe(true)
    expect(sprintCorrect('autum', word)).toBe(false)
    expect(sprintCorrect('well known', { word: 'well-known' })).toBe(true)
  })
  it('merges rounds from another device by start time and drops broken ones', () => {
    saveSprintRound({ date: '2026-10-01T10:00:00.000Z', correct: 5, misses: 1, answers: [] })
    const added = mergeSprintRounds([
      { date: '2026-10-01T10:00:00.000Z', correct: 99, misses: 0, answers: [] },
      { date: '2026-10-02T10:00:00.000Z', correct: 7, misses: 2, answers: [{ word: 'quiet', typed: 'queit', correct: false }] },
      { date: 'not a date' },
      'junk',
    ])
    expect(added).toBe(1)
    expect(getSprintRounds().map((round) => [round.date.slice(0, 10), round.correct])).toEqual([
      ['2026-10-02', 7],
      ['2026-10-01', 5],
    ])
  })
})
