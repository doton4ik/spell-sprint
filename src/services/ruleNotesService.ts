import { getActiveCloudSession, insertRows, isSupabaseConfigured, selectRows } from './supabase'
import type { UserRuleNote } from '../types/rules'

export async function getUserRuleNote(ruleId: string): Promise<UserRuleNote | null> {
  if (!isSupabaseConfigured()) return null
  const session = await getActiveCloudSession()
  if (!session) return null
  const rows = await selectRows(session, 'user_rule_notes', { user_id: session.user.id, rule_id: ruleId }, { limit: 1 })
  return rows[0] ? { id: rows[0].id, userId: session.user.id, ruleId, note: rows[0].note } : null
}

export async function saveUserRuleNote(ruleId: string, note: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before saving a note.')
  await insertRows(session, 'user_rule_notes', { user_id: session.user.id, rule_id: ruleId, note: note.slice(0, 2000), updated_at: new Date().toISOString() }, { onConflict: 'user_id,rule_id' })
}
