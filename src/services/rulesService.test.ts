import { beforeEach, describe, expect, it, vi } from 'vitest'
import bundled from '../data/builtInRules.json'

const supabase = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(() => false),
  selectRows: vi.fn(async (): Promise<Array<Record<string, unknown>>> => []),
  getActiveCloudSession: vi.fn(async (): Promise<unknown> => null),
  insertRows: vi.fn(),
  updateRows: vi.fn(),
}))
vi.mock('./supabase', () => supabase)

import {
  consumePendingRuleFocus,
  createPersonalRule,
  getAllRuleWordLinks,
  getRuleBySlug,
  getRuleExamples,
  getRuleIdsForErrorType,
  getRuleIdsForWord,
  getRuleRelationships,
  getUnclassifiedMistakes,
  getVisibleRules,
  setPendingRuleFocus,
} from './rulesService'

const LINKS_KEY = 'spell-sprint.rule-links-cache'
const ruleRow = (slug: string, extra: Record<string, unknown> = {}) => ({
  id: `id-${slug}`,
  slug,
  title: slug,
  category: 'Spelling',
  rule_type: 'pattern',
  short_explanation: 'x',
  source: 'built_in',
  visibility: 'public',
  is_active: true,
  ...extra,
})
const linkRow = (id: string, ruleId: string, wordId: string) => ({ id, rule_id: ruleId, word_id: wordId, relation: 'primary', note: null })

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
  supabase.isSupabaseConfigured.mockReset().mockReturnValue(false)
  supabase.selectRows.mockReset().mockResolvedValue([])
  supabase.getActiveCloudSession.mockReset().mockResolvedValue(null)
  supabase.insertRows.mockReset()
})

describe('rules offline (no Supabase configured)', () => {
  it('shows the rules that ship with the app, without the switched-off ones, and never asks the network', async () => {
    const rules = await getVisibleRules()
    const active = bundled.rules.filter((rule) => rule.is_active !== false)
    expect(active.length).toBeLessThan(bundled.rules.length) // the data really has switched-off rules
    expect(rules).toHaveLength(active.length)
    expect(rules.every((rule) => rule.isActive)).toBe(true)
    expect(supabase.selectRows).not.toHaveBeenCalled()
  })
  it('turns database column names into the rule fields the Rules page reads', async () => {
    const rule = await getRuleBySlug('double-consonants')
    expect(rule).toMatchObject({ slug: 'double-consonants', ruleType: expect.any(String), shortExplanation: expect.any(String) })
    expect(rule?.metadata).toBeTypeOf('object')
  })
  it('an unknown slug is null, not a crash', async () => {
    expect(await getRuleBySlug('no-such-rule')).toBeNull()
  })
  it('when the database fails, the same bundled rules appear', async () => {
    supabase.isSupabaseConfigured.mockReturnValue(true)
    supabase.selectRows.mockRejectedValue(new Error('network down'))
    const rules = await getVisibleRules()
    expect(rules.length).toBe(bundled.rules.filter((rule) => rule.is_active !== false).length)
    expect((await getRuleBySlug('double-consonants'))?.slug).toBe('double-consonants')
  })
  it('examples of a rule come from the bundled data, other rules examples are not mixed in', async () => {
    const rule = (await getRuleBySlug('double-consonants'))!
    const examples = await getRuleExamples(rule.id)
    expect(examples.length).toBeGreaterThan(0)
    expect(examples.every((example) => example.ruleId === rule.id)).toBe(true)
    expect(await getRuleExamples('no-such-id')).toEqual([])
  })
})

describe('rules online', () => {
  beforeEach(() => supabase.isSupabaseConfigured.mockReturnValue(true))

  it('database rules are used instead of the bundled ones', async () => {
    supabase.selectRows.mockResolvedValue([ruleRow('from-db', { tts_text: null, mnemonic: 'remember' })])
    const rules = await getVisibleRules()
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatchObject({ slug: 'from-db', mnemonic: 'remember', ttsText: undefined, metadata: {}, isActive: true })
  })
  it('a rule missing from the database is null, not taken from the bundled file', async () => {
    expect(await getRuleBySlug('double-consonants')).toBeNull()
  })
  it('relationships: empty offline and on a database error', async () => {
    supabase.selectRows.mockRejectedValue(new Error('x'))
    expect(await getRuleRelationships('r')).toEqual([])
    supabase.isSupabaseConfigured.mockReturnValue(false)
    expect(await getRuleRelationships('r')).toEqual([])
  })
  it('unclassified mistakes need a signed-in learner and survive a database error', async () => {
    expect(await getUnclassifiedMistakes()).toEqual([])
    supabase.getActiveCloudSession.mockResolvedValue({ user: { id: 'u1' } })
    supabase.selectRows.mockRejectedValue(new Error('x'))
    expect(await getUnclassifiedMistakes()).toEqual([])
  })
  it('creating a personal rule without signing in is refused', async () => {
    await expect(createPersonalRule({ title: 'T', category: 'c', ruleType: 'language_rule', shortExplanation: 'e' })).rejects.toThrow(
      /Sign in/,
    )
    expect(supabase.insertRows).not.toHaveBeenCalled()
  })
})

describe('word links cache (what a word shows offline after one good load)', () => {
  beforeEach(() => supabase.isSupabaseConfigured.mockReturnValue(true))

  it('a successful load is remembered and used after the network is gone', async () => {
    supabase.selectRows.mockResolvedValue([linkRow('1', 'r1', 'w1'), linkRow('2', 'r2', 'w1'), linkRow('3', 'r3', 'w2')])
    expect(await getAllRuleWordLinks()).toHaveLength(3)

    supabase.selectRows.mockRejectedValue(new Error('offline'))
    expect(await getAllRuleWordLinks()).toHaveLength(3)
    expect((await getRuleIdsForWord('w1')).sort()).toEqual(['r1', 'r2'])
    expect(await getRuleIdsForWord('w-unknown')).toEqual([])
  })
  it('without Supabase the remembered links are still used', async () => {
    window.localStorage.setItem(LINKS_KEY, JSON.stringify([{ id: '1', ruleId: 'r1', wordId: 'w1', relation: 'primary' }]))
    supabase.isSupabaseConfigured.mockReturnValue(false)
    expect(await getRuleIdsForWord('w1')).toEqual(['r1'])
  })
  it('no cache yet, or a damaged cache: empty list, no crash', async () => {
    supabase.selectRows.mockRejectedValue(new Error('offline'))
    expect(await getAllRuleWordLinks()).toEqual([])
    window.localStorage.setItem(LINKS_KEY, '{broken')
    expect(await getAllRuleWordLinks()).toEqual([])
    window.localStorage.setItem(LINKS_KEY, JSON.stringify({ not: 'a list' }))
    expect(await getRuleIdsForWord('w1')).toEqual([])
  })
  it('a failed load does not wipe the cache', async () => {
    supabase.selectRows.mockResolvedValueOnce([linkRow('1', 'r1', 'w1')])
    await getAllRuleWordLinks()
    supabase.selectRows.mockRejectedValue(new Error('offline'))
    await getAllRuleWordLinks()
    expect(JSON.parse(window.localStorage.getItem(LINKS_KEY)!)).toHaveLength(1)
  })
  it('a full storage does not break showing the links that were just loaded', async () => {
    supabase.selectRows.mockResolvedValue([linkRow('1', 'r1', 'w1')])
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    try {
      expect(await getAllRuleWordLinks()).toHaveLength(1)
    } finally {
      setItem.mockRestore()
    }
  })
  it('a word with no id has no rules and asks nobody', async () => {
    expect(await getRuleIdsForWord('')).toEqual([])
    expect(supabase.selectRows).not.toHaveBeenCalled()
  })
})

describe('rules suggested by the error type', () => {
  it('a known error type finds its rule offline; an unknown or missing one finds none', async () => {
    const ids = await getRuleIdsForErrorType('double_consonant')
    expect(ids).toEqual([(await getRuleBySlug('double-consonants'))!.id])
    expect(await getRuleIdsForErrorType('something_else')).toEqual([])
    expect(await getRuleIdsForErrorType(undefined)).toEqual([])
  })
})

describe('pending rule focus', () => {
  it('is read once: the second read finds nothing', () => {
    setPendingRuleFocus('rule-1')
    expect(consumePendingRuleFocus()).toBe('rule-1')
    expect(consumePendingRuleFocus()).toBeNull()
  })
})
