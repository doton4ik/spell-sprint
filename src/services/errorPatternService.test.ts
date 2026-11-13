import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Classification } from './mistakeClassifier'

const db = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(() => true),
  selectRows: vi.fn(async (..._args: unknown[]): Promise<Array<Record<string, unknown>>> => []),
  insertRows: vi.fn(async (..._args: unknown[]) => []),
}))
vi.mock('./supabase', () => db)

type Service = typeof import('./errorPatternService')
let service: Service

// The catalogue is cached inside the module, so every test starts with a fresh copy of it.
beforeEach(async () => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 12, 12, 0, 0))
  db.isSupabaseConfigured.mockReset().mockReturnValue(true)
  db.selectRows.mockReset().mockResolvedValue([])
  db.insertRows.mockReset().mockResolvedValue([])
  service = await import('./errorPatternService')
})
afterEach(() => vi.useRealTimers())

const answerByTable = (tables: Record<string, Array<Record<string, unknown>> | Error>) =>
  db.selectRows.mockImplementation(async (...args: unknown[]) => {
    const result = tables[args[1] as string]
    if (result instanceof Error) throw result
    return result ?? []
  })
const tag = (slug: string, confidence: number, extra: Record<string, unknown> = {}) => ({ slug, confidence, ...extra })
const classification = (technical: unknown[], learning: unknown[] = []) => ({ technical, learning }) as unknown as Classification

describe('loadErrorCatalog', () => {
  it('without Supabase it is empty and asks nobody', async () => {
    db.isSupabaseConfigured.mockReturnValue(false)
    const catalog = await service.loadErrorCatalog()
    expect(catalog).toMatchObject({ hasPatterns: false, confusableSets: [] })
    expect(catalog.patternIds.size).toBe(0)
    expect(db.selectRows).not.toHaveBeenCalled()
  })
  it('links each pattern to its rules', async () => {
    answerByTable({
      error_patterns: [
        { id: 'p1', slug: 'double-letter' },
        { id: 'p2', slug: 'ie-ei' },
      ],
      error_pattern_rule_links: [
        { error_pattern_id: 'p1', rule_id: 'r1' },
        { error_pattern_id: 'p1', rule_id: 'r2' },
        { error_pattern_id: 'p2', rule_id: 'r3' },
        { error_pattern_id: 'gone', rule_id: 'r9' }, // a link to a pattern that is not active
      ],
    })
    const catalog = await service.loadErrorCatalog()
    expect(catalog.hasPatterns).toBe(true)
    expect(catalog.patternIds.get('ie-ei')).toBe('p2')
    expect(catalog.ruleIdsByPattern.get('double-letter')).toEqual(['r1', 'r2'])
    expect([...catalog.ruleIdsByPattern.keys()].sort()).toEqual(['double-letter', 'ie-ei'])
  })
  it('confusable words come from the rule data; malformed entries are skipped', async () => {
    answerByTable({
      rules: [
        { id: 'r1', metadata: { confusable_words: ['their', 'there'] } },
        { id: 'r2', metadata: { confusable_words: ['a', 5] } },
        { id: 'r3', metadata: null },
        { id: 'r4', metadata: { confusable_words: 'their' } },
      ],
    })
    expect((await service.loadErrorCatalog()).confusableSets).toEqual([{ ruleId: 'r1', words: ['their', 'there'] }])
  })
  it('tables that do not exist yet do not break it: an empty catalogue, the rest still loads', async () => {
    answerByTable({
      error_patterns: new Error('relation does not exist'),
      rules: [{ id: 'r1', metadata: { confusable_words: ['a', 'b'] } }],
    })
    const catalog = await service.loadErrorCatalog()
    expect(catalog.hasPatterns).toBe(false)
    expect(catalog.confusableSets).toHaveLength(1)
    answerByTable({ rules: new Error('down') })
    vi.resetModules()
    service = await import('./errorPatternService')
    expect(await service.loadErrorCatalog()).toMatchObject({ confusableSets: [] })
  })
  it('a good catalogue is reused for 5 minutes, then loaded again', async () => {
    answerByTable({ error_patterns: [{ id: 'p1', slug: 's' }] })
    await service.loadErrorCatalog()
    const calls = db.selectRows.mock.calls.length
    vi.advanceTimersByTime(4 * 60_000)
    await service.loadErrorCatalog()
    expect(db.selectRows.mock.calls.length).toBe(calls)
    vi.advanceTimersByTime(2 * 60_000)
    await service.loadErrorCatalog()
    expect(db.selectRows.mock.calls.length).toBeGreaterThan(calls)
  })
  it('an empty catalogue (SQL not run yet) is retried after 30 seconds, not 5 minutes', async () => {
    await service.loadErrorCatalog()
    const calls = db.selectRows.mock.calls.length
    vi.advanceTimersByTime(20_000)
    await service.loadErrorCatalog()
    expect(db.selectRows.mock.calls.length).toBe(calls)
    vi.advanceTimersByTime(15_000)
    await service.loadErrorCatalog()
    expect(db.selectRows.mock.calls.length).toBeGreaterThan(calls)
  })
})

describe('ruleIdsFromClassification', () => {
  const catalog = () => ({
    patternIds: new Map(),
    ruleIdsByPattern: new Map([
      ['double-letter', ['r1', 'r2']],
      ['ie-ei', ['r2', 'r3']],
    ]),
    confusableSets: [],
    hasPatterns: true,
  })
  it('follows a pattern to its rules, without duplicates, from both kinds of tags', () => {
    const ids = service.ruleIdsFromClassification(classification([tag('double-letter', 0.9)], [tag('ie-ei', 0.8)]), catalog())
    expect(ids.sort()).toEqual(['r1', 'r2', 'r3'])
  })
  it('a guess below 0.6 confidence attaches nothing; exactly 0.6 does', () => {
    expect(service.ruleIdsFromClassification(classification([tag('double-letter', 0.59)]), catalog())).toEqual([])
    expect(service.ruleIdsFromClassification(classification([tag('ie-ei', 0.6)]), catalog()).sort()).toEqual(['r2', 'r3'])
  })
  it('a rule named by the detector itself is added, also for a pattern the catalogue does not know', () => {
    expect(service.ruleIdsFromClassification(classification([tag('unknown', 0.9, { ruleId: 'direct' })]), catalog())).toEqual(['direct'])
    expect(service.ruleIdsFromClassification(classification([tag('unknown', 0.3, { ruleId: 'direct' })]), catalog())).toEqual([])
  })
  it('no tags, no rules', () => {
    expect(service.ruleIdsFromClassification(classification([]), catalog())).toEqual([])
  })
})

describe('saveMistakePatterns', () => {
  const session = { user: { id: 'u1' } } as never
  const catalog = () => ({
    patternIds: new Map([
      ['double-letter', 'p1'],
      ['ie-ei', 'p2'],
    ]),
    ruleIdsByPattern: new Map(),
    confusableSets: [],
    hasPatterns: true,
  })
  it('saves a row for every known pattern of the mistake, for this user', async () => {
    await service.saveMistakePatterns(
      session,
      'm1',
      classification([tag('double-letter', 0.9, { detail: 'rr' })], [tag('ie-ei', 0.7), tag('not-in-catalogue', 0.9)]),
      catalog(),
    )
    expect(db.insertRows).toHaveBeenCalledTimes(1)
    const [, table, rows, options] = db.insertRows.mock.calls[0] as [
      unknown,
      string,
      Array<Record<string, unknown>>,
      Record<string, unknown>,
    ]
    expect(table).toBe('mistake_error_patterns')
    expect(rows).toEqual([
      { mistake_event_id: 'm1', error_pattern_id: 'p1', user_id: 'u1', confidence: 0.9, detail: 'rr' },
      { mistake_event_id: 'm1', error_pattern_id: 'p2', user_id: 'u1', confidence: 0.7, detail: null },
    ])
    expect(options).toMatchObject({ ignoreDuplicates: true })
  })
  it('does not call the database when no tag matches the catalogue', async () => {
    await service.saveMistakePatterns(session, 'm1', classification([tag('x', 0.9)]), catalog())
    await service.saveMistakePatterns(session, 'm1', classification([]), catalog())
    expect(db.insertRows).not.toHaveBeenCalled()
  })
})
