import { getActiveCloudSession, isSupabaseConfigured, supabaseAuthedFetch, supabasePublicRequest } from './supabase'
import { getVisibleRules } from './rulesService'
import { getProgressRow, nextProgressAfterCorrectPractice, nextProgressAfterMistake, upsertProgressRow, type ProgressRow } from './ruleProgressStore'
import type { RuleExercise, RuleExerciseType, RulePriority, RuleStatus, UserRuleProgress } from '../types/rules'

// Item 19: spell / correct_word / fill_gap ship first; multiple_choice and grammar exist in the
// data model already (see database/rules-schema.sql) so they can be enabled later without a
// schema change — this ordering just decides which exercise the mini-practice offers first.
const EXERCISE_TYPE_PRIORITY: RuleExerciseType[] = ['spell', 'correct_word', 'fill_gap', 'multiple_choice', 'grammar']

function toExercise(row: Record<string, unknown>): RuleExercise {
  return {
    id: row.id as string,
    ruleId: row.rule_id as string,
    exerciseType: row.exercise_type as RuleExerciseType,
    prompt: row.prompt as string,
    answer: row.answer as string,
    choices: (row.choices as string[]) ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  }
}

function toProgress(userId: string, ruleId: string, row: ProgressRow): UserRuleProgress {
  return {
    id: row.id,
    userId,
    ruleId,
    status: row.status,
    priority: row.priority,
    mistakeCount: row.mistake_count,
    correctCount: row.correct_count,
    correctCalendarDays: row.correct_calendar_days,
  }
}

// Active exercises for one rule's mini-practice, ordered by the priority above.
export async function getRuleExercises(ruleId: string): Promise<RuleExercise[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rule_exercises?rule_id=eq.${encodeURIComponent(ruleId)}&select=*`) as Record<string, unknown>[]
    return rows.map(toExercise).sort((a, b) => EXERCISE_TYPE_PRIORITY.indexOf(a.exerciseType) - EXERCISE_TYPE_PRIORITY.indexOf(b.exerciseType))
  } catch {
    return []
  }
}

export async function getUserRuleProgress(ruleId: string): Promise<UserRuleProgress | null> {
  if (!isSupabaseConfigured()) return null
  const session = await getActiveCloudSession()
  if (!session) return null
  const row = await getProgressRow(session, ruleId)
  return row ? toProgress(session.user.id, ruleId, row) : null
}

export async function getAllUserRuleProgress(): Promise<UserRuleProgress[]> {
  if (!isSupabaseConfigured()) return []
  const session = await getActiveCloudSession()
  if (!session) return []
  const rows = await supabaseAuthedFetch(session, `/rest/v1/user_rule_progress?user_id=eq.${session.user.id}&select=*`) as Array<ProgressRow & { rule_id: string }>
  return rows.map((row) => toProgress(session.user.id, row.rule_id, row))
}

// Records one mini-practice attempt (rule card, not a Spell Sprint test — see mistakeService.ts
// for why those two stay separate in v1) and advances the rule's progress:
// a correct answer counts towards the 5-distinct-day "mastered" rule; a wrong one behaves like
// any other mistake (demotes from mastered, escalates priority at 3+ mistakes).
export async function recordRulePracticeAttempt(ruleId: string, isCorrect: boolean, exerciseId?: string): Promise<UserRuleProgress | null> {
  if (!isSupabaseConfigured()) return null
  const session = await getActiveCloudSession()
  if (!session) return null
  try {
    await supabaseAuthedFetch(session, '/rest/v1/rule_practice_attempts', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ user_id: session.user.id, rule_id: ruleId, exercise_id: exerciseId ?? null, is_correct: isCorrect }),
    })
    const existing = await getProgressRow(session, ruleId)
    const next = isCorrect ? nextProgressAfterCorrectPractice(existing) : nextProgressAfterMistake(existing)
    await upsertProgressRow(session, ruleId, next)
    return toProgress(session.user.id, ruleId, next)
  } catch (error) {
    console.warn('Could not record this rule practice attempt.', error)
    return null
  }
}

// Rule #16: the learner can always override status/priority by hand, regardless of the
// computed rules above (e.g. "Mark as mastered" or "Add to Repeat later" from the rule card).
export async function setUserRuleProgress(ruleId: string, patch: Partial<Pick<ProgressRow, 'status' | 'priority'>>): Promise<UserRuleProgress | null> {
  if (!isSupabaseConfigured()) return null
  const session = await getActiveCloudSession()
  if (!session) return null
  const existing = await getProgressRow(session, ruleId)
  const next: ProgressRow = { ...(existing ?? { status: 'new' as RuleStatus, priority: 'practice' as RulePriority, mistake_count: 0, correct_count: 0, correct_calendar_days: [] }), ...patch }
  await upsertProgressRow(session, ruleId, next)
  return toProgress(session.user.id, ruleId, next)
}

export const markRuleAsMastered = (ruleId: string) => setUserRuleProgress(ruleId, { status: 'mastered', priority: 'stable' })
export const addRuleToRepeatLater = (ruleId: string) => setUserRuleProgress(ruleId, { status: 'repeat_later' })

export async function getExercisesForRules(ruleIds: string[]): Promise<RuleExercise[]> {
  if (!isSupabaseConfigured() || !ruleIds.length) return []
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rule_exercises?rule_id=in.(${ruleIds.join(',')})&select=*`) as Record<string, unknown>[]
    return rows.map(toExercise)
  } catch {
    return []
  }
}

export type RuleQueueItem = { exercise: RuleExercise; ruleTitle: string }
export type RulePracticeQueue = { items: RuleQueueItem[]; source: 'weak' | 'all'; ruleCount: number }

// A short session for the "Rule practice" panel. It draws from the rules the learner still has to
// repeat (not mastered/archived); critical rules come up more often, the rest is shuffled in.
// With no weak rules yet it falls back to a mix from every rule, so the panel is never dead.
export async function buildRulePracticeQueue(limit = 10): Promise<RulePracticeQueue> {
  const rank: Record<RulePriority, number> = { critical: 0, practice: 1, stable: 2 }
  const [rules, progress] = await Promise.all([getVisibleRules(), getAllUserRuleProgress().catch(() => [] as UserRuleProgress[])])
  const titles = new Map(rules.map((rule) => [rule.id, rule.title]))
  const weak = progress.filter((entry) => entry.status !== 'mastered' && entry.status !== 'archived' && titles.has(entry.ruleId))
  const rankByRule = new Map(weak.map((entry) => [entry.ruleId, rank[entry.priority]]))

  let source: RulePracticeQueue['source'] = 'weak'
  let exercises = await getExercisesForRules(weak.map((entry) => entry.ruleId))
  if (!exercises.length) { source = 'all'; exercises = await getExercisesForRules(rules.map((rule) => rule.id)) }

  const items = exercises
    .map((exercise) => ({ exercise, score: (rankByRule.get(exercise.ruleId) ?? 1) + Math.random() * 1.2 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ exercise }) => ({ exercise, ruleTitle: titles.get(exercise.ruleId) ?? '' }))
  return { items, source, ruleCount: new Set(items.map((item) => item.exercise.ruleId)).size }
}
