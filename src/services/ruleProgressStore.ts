import { supabaseAuthedFetch, type SupabaseSession } from './supabase'
import type { RulePriority, RuleStatus } from '../types/rules'

// Shared read/write helpers for user_rule_progress, used by both the general-test mistake
// pipeline (mistakeService.ts) and the in-card mini-practice pipeline (rulePracticeService.ts),
// so the two surfaces can never drift into different status/priority rules.

export type ProgressRow = {
  id?: string
  status: RuleStatus
  priority: RulePriority
  mistake_count: number
  correct_count: number
  correct_calendar_days: string[]
}

export function today() {
  return new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD', used for the 5-distinct-days mastered rule
}

export async function getProgressRow(session: SupabaseSession, ruleId: string): Promise<ProgressRow | null> {
  const rows = await supabaseAuthedFetch(session, `/rest/v1/user_rule_progress?user_id=eq.${session.user.id}&rule_id=eq.${ruleId}&select=*&limit=1`) as ProgressRow[]
  return rows[0] ?? null
}

export async function upsertProgressRow(session: SupabaseSession, ruleId: string, next: ProgressRow) {
  await supabaseAuthedFetch(session, '/rest/v1/user_rule_progress?on_conflict=user_id,rule_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      user_id: session.user.id,
      rule_id: ruleId,
      status: next.status,
      priority: next.priority,
      mistake_count: next.mistake_count,
      correct_count: next.correct_count,
      correct_calendar_days: next.correct_calendar_days,
      last_result_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  })
}

// Rules #10-14: one wrong answer always counts, but it only demotes a rule that was already
// mastered (back to "learning", and the mastery streak of correct-calendar-days resets, since
// the 5-distinct-day requirement is meant to be earned again). 3+ mistakes escalate to "critical".
export function nextProgressAfterMistake(existing: ProgressRow | null): ProgressRow {
  if (!existing) return { status: 'new', priority: 'practice', mistake_count: 1, correct_count: 0, correct_calendar_days: [] }
  const mistakeCount = existing.mistake_count + 1
  const wasMastered = existing.status === 'mastered'
  const status: RuleStatus = wasMastered || existing.status === 'new' ? 'learning' : existing.status
  let priority = existing.priority
  if (mistakeCount >= 3) priority = 'critical'
  else if (wasMastered && priority === 'stable') priority = 'practice'
  return {
    id: existing.id,
    status,
    priority,
    mistake_count: mistakeCount,
    correct_count: wasMastered ? 0 : existing.correct_count,
    correct_calendar_days: wasMastered ? [] : existing.correct_calendar_days,
  }
}

// Rule #10: a correct mini-practice answer counts once per calendar day. On the 5th distinct
// day, the rule becomes "mastered" and its priority settles to "stable".
export function nextProgressAfterCorrectPractice(existing: ProgressRow | null): ProgressRow {
  const day = today()
  const base = existing ?? { status: 'learning' as RuleStatus, priority: 'practice' as RulePriority, mistake_count: 0, correct_count: 0, correct_calendar_days: [] }
  const correctCalendarDays = base.correct_calendar_days.includes(day) ? base.correct_calendar_days : [...base.correct_calendar_days, day]
  const mastered = correctCalendarDays.length >= 5
  return {
    id: base.id,
    status: mastered ? 'mastered' : base.status === 'new' ? 'learning' : base.status,
    priority: mastered ? 'stable' : base.priority,
    mistake_count: base.mistake_count,
    correct_count: base.correct_count + 1,
    correct_calendar_days: correctCalendarDays,
  }
}
