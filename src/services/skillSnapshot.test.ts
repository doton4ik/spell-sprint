import { describe, expect, it } from 'vitest'
import type { PracticeAttempt } from '../types/practice'
import { skillSnapshot } from './skillSnapshot'

const NOW = Date.parse('2026-10-09T12:00:00Z')
const day = (ago: number) => new Date(NOW - ago * 86400000).toISOString()
const attempt = (taskType: PracticeAttempt['taskType'], isCorrect: boolean, ago = 1, extra: Partial<PracticeAttempt> = {}) =>
  ({ id: Math.random().toString(), taskType, isCorrect, createdAt: day(ago), ...extra }) as PracticeAttempt
const many = (taskType: PracticeAttempt['taskType'], right: number, wrong: number, ago = 1) => [
  ...Array.from({ length: right }, () => attempt(taskType, true, ago)),
  ...Array.from({ length: wrong }, () => attempt(taskType, false, ago)),
]

describe('skillSnapshot', () => {
  it('splits answers by skill and gives a percentage', () => {
    const result = skillSnapshot(
      [...many('correct-spelling', 6, 4), ...many('translate-ru-en', 9, 1), ...many('correct-sentence', 5, 5)],
      NOW,
    )
    expect(result.map((item) => [item.skill, item.percent, item.answers])).toEqual([
      ['spelling', 60, 10],
      ['vocabulary', 90, 10],
      ['grammar', 50, 10],
    ])
  })
  it('both translation directions count as vocabulary', () => {
    const result = skillSnapshot([...many('translate-ru-en', 4, 0), ...many('translate-en-ru', 4, 0)], NOW)
    expect(result[1]).toEqual({ skill: 'vocabulary', percent: 100, answers: 8 })
  })
  it('says nothing when there are too few answers', () => {
    expect(skillSnapshot(many('correct-spelling', 5, 2), NOW)[0]).toEqual({ skill: 'spelling', percent: null, answers: 7 })
  })
  it('ignores old answers, skipped ones and "meet the word" copies', () => {
    const result = skillSnapshot(
      [
        ...many('correct-spelling', 10, 0, 45),
        ...many('correct-spelling', 8, 0),
        attempt('correct-spelling', false, 1, { wasSkipped: true }),
        attempt('correct-spelling', false, 1, { introduced: true }),
      ],
      NOW,
    )
    expect(result[0]).toEqual({ skill: 'spelling', percent: 100, answers: 8 })
  })
  it('an empty log gives three empty skills', () => {
    expect(skillSnapshot([], NOW)).toEqual([
      { skill: 'spelling', percent: null, answers: 0 },
      { skill: 'vocabulary', percent: null, answers: 0 },
      { skill: 'grammar', percent: null, answers: 0 },
    ])
  })
})
