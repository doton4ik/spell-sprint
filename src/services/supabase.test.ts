import { describe, expect, it } from 'vitest'
import { tableQuery } from './supabase'

describe('tableQuery', () => {
  it('turns filters into encoded PostgREST conditions', () => {
    expect(tableQuery('rules', { slug: 'ie & ei', is_active: true }, { select: 'id,slug', limit: 1 }))
      .toBe('/rest/v1/rules?slug=eq.ie%20%26%20ei&is_active=eq.true&select=id,slug&limit=1')
  })
  it('lists become in(…) with every value quoted and encoded', () => {
    expect(tableQuery('mistake_events', { id: ['a1', 'b,2'] })).toBe('/rest/v1/mistake_events?id=in.("a1","b%2C2")')
  })
  it('a value cannot add its own condition', () => {
    const path = tableQuery('user_rule_notes', { rule_id: 'x&user_id=eq.someone-else' })
    expect(path).not.toContain('&user_id=')
  })
  it('null is is.null, undefined is skipped, upsert key is added', () => {
    expect(tableQuery('rules', { created_by: null, slug: undefined }, { onConflict: 'user_id,rule_id' })).toBe('/rest/v1/rules?created_by=is.null&on_conflict=user_id,rule_id')
  })
})
