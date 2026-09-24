import { getActiveCloudSession, isSupabaseConfigured, supabaseAuthedFetch } from './supabase'
import type { UserRuleNote } from '../types/rules'

export async function getUserRuleNote(ruleId: string): Promise<UserRuleNote | null> {
  if (!isSupabaseConfigured()) return null
  const session = await getActiveCloudSession()
  if (!session) return null
  const rows = await supabaseAuthedFetch(session, `/rest/v1/user_rule_notes?user_id=eq.${session.user.id}&rule_id=eq.${ruleId}&select=*&limit=1`) as Array<{ id: string; note: string }>
  return rows[0] ? { id: rows[0].id, userId: session.user.id, ruleId, note: rows[0].note } : null
}

export async function saveUserRuleNote(ruleId: string, note: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before saving a note.')
  await supabaseAuthedFetch(session, '/rest/v1/user_rule_notes?on_conflict=user_id,rule_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: session.user.id, rule_id: ruleId, note, updated_at: new Date().toISOString() }),
  })
}
