import { beforeEach, describe, expect, it, vi } from 'vitest'
import bundled from '../data/builtInRuleExercises.json'

const supabase = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(() => false),
  selectRows: vi.fn(async (): Promise<Array<Record<string, unknown>>> => []),
  getActiveCloudSession: vi.fn(),
  insertRows: vi.fn(),
}))
vi.mock('./supabase', () => supabase)

import { getExercisesForRules, getRuleExercises } from './rulePracticeService'

const [articleRule, otherArticleRule] = Object.keys(bundled)
const dbRow = (ruleId: string, prompt: string) => ({
  id: `db-${prompt}`,
  rule_id: ruleId,
  exercise_type: 'spell',
  prompt,
  answer: 'x',
  choices: null,
  metadata: {},
})

describe('exercises that ship with the app', () => {
  beforeEach(() => {
    supabase.isSupabaseConfigured.mockReturnValue(false)
    supabase.selectRows.mockReset()
    supabase.selectRows.mockResolvedValue([])
  })

  it('every article rule has its own exercises, each with exactly one right answer among the choices', () => {
    expect(Object.keys(bundled).length).toBeGreaterThanOrEqual(2) // a-or-an and the merged articles rule (a-or-the)
    for (const exercises of Object.values(bundled)) {
      expect(exercises.length).toBeGreaterThanOrEqual(8)
      for (const exercise of exercises) expect(exercise.choices).toContain(exercise.answer)
    }
  })
  it('offline, a rule gets the bundled exercises', async () => {
    const result = await getRuleExercises(articleRule)
    expect(result).toHaveLength(bundled[articleRule as keyof typeof bundled].length)
    expect(result[0]).toMatchObject({ ruleId: articleRule, exerciseType: 'multiple_choice' })
  })
  it('a rule with nothing bundled stays empty', async () => {
    expect(await getRuleExercises('no-such-rule')).toEqual([])
  })
  it('database rows win: nothing is added once the database has exercises for the rule', async () => {
    supabase.isSupabaseConfigured.mockReturnValue(true)
    supabase.selectRows.mockResolvedValue([dbRow(articleRule, 'from the database ___')])
    const result = await getRuleExercises(articleRule)
    expect(result.map((exercise) => exercise.prompt)).toEqual(['from the database ___'])
  })
  it('before the SQL has been run (no rows) or when the database fails, the bundled ones are used', async () => {
    supabase.isSupabaseConfigured.mockReturnValue(true)
    expect(await getRuleExercises(articleRule)).toHaveLength(bundled[articleRule as keyof typeof bundled].length)
    supabase.selectRows.mockRejectedValue(new Error('network'))
    expect(await getRuleExercises(articleRule)).toHaveLength(bundled[articleRule as keyof typeof bundled].length)
  })
  it('for several rules: database rows for one rule, bundled for the other, no duplicates', async () => {
    supabase.isSupabaseConfigured.mockReturnValue(true)
    supabase.selectRows.mockResolvedValue([dbRow(articleRule, 'only db ___')])
    const result = await getExercisesForRules([articleRule, otherArticleRule])
    expect(result.filter((exercise) => exercise.ruleId === articleRule).map((exercise) => exercise.prompt)).toEqual(['only db ___'])
    expect(result.filter((exercise) => exercise.ruleId === otherArticleRule)).toHaveLength(
      bundled[otherArticleRule as keyof typeof bundled].length,
    )
  })
})
