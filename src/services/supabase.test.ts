import { describe, expect, it } from 'vitest'
import { authParamsFromAppLink, tableQuery } from './supabase'

describe('tableQuery', () => {
  it('turns filters into encoded PostgREST conditions', () => {
    expect(tableQuery('rules', { slug: 'ie & ei', is_active: true }, { select: 'id,slug', limit: 1 })).toBe(
      '/rest/v1/rules?slug=eq.ie%20%26%20ei&is_active=eq.true&select=id,slug&limit=1',
    )
  })
  it('lists become in(…) with every value quoted and encoded', () => {
    expect(tableQuery('mistake_events', { id: ['a1', 'b,2'] })).toBe('/rest/v1/mistake_events?id=in.("a1","b%2C2")')
  })
  it('a value cannot add its own condition', () => {
    const path = tableQuery('user_rule_notes', { rule_id: 'x&user_id=eq.someone-else' })
    expect(path).not.toContain('&user_id=')
  })
  it('null is is.null, undefined is skipped, upsert key is added', () => {
    expect(tableQuery('rules', { created_by: null, slug: undefined }, { onConflict: 'user_id,rule_id' })).toBe(
      '/rest/v1/rules?created_by=is.null&on_conflict=user_id,rule_id',
    )
  })
})

describe('authParamsFromAppLink', () => {
  it('reads the tokens of a link that opens the app', () => {
    const params = authParamsFromAppLink('spellsprint://auth#access_token=a1&refresh_token=r1&type=recovery')
    expect(params?.get('access_token')).toBe('a1')
    expect(params?.get('refresh_token')).toBe('r1')
    expect(params?.get('type')).toBe('recovery')
  })

  it('reads an error link', () => {
    expect(authParamsFromAppLink('spellsprint://auth#error=access_denied&error_description=Link+expired')?.get('error_description')).toBe(
      'Link expired',
    )
  })

  it('ignores other addresses and links without data', () => {
    expect(authParamsFromAppLink('https://evil.example/#access_token=a&refresh_token=r')).toBeNull()
    expect(authParamsFromAppLink('spellsprint://auth')).toBeNull()
    expect(authParamsFromAppLink('spellsprint://auth#foo=bar')).toBeNull()
  })

  it('accepts the scheme in any letter case', () => {
    expect(authParamsFromAppLink('SpellSprint://auth#access_token=a&refresh_token=r')).not.toBeNull()
  })
})
