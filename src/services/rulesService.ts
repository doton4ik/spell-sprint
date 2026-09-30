import { getActiveCloudSession, supabaseAuthedFetch, supabasePublicRequest, supabaseUserRequest, isSupabaseConfigured } from './supabase'
import { getEveryWord } from './libraryStorage'
import { getProgressRow, nextProgressAfterMistake, upsertProgressRow } from './ruleProgressStore'
import type { MistakeEvent, Rule, RuleExample, RuleRelationship, RuleType, RuleWordLink } from '../types/rules'

// Converts one Postgres row (snake_case) into our camelCase Rule type.
function toRule(row: Record<string, unknown>): Rule {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as string,
    ruleType: row.rule_type as Rule['ruleType'],
    shortExplanation: row.short_explanation as string,
    ttsText: (row.tts_text as string) ?? undefined,
    mnemonic: (row.mnemonic as string) ?? undefined,
    source: row.source as Rule['source'],
    visibility: row.visibility as Rule['visibility'],
    createdBy: (row.created_by as string) ?? undefined,
    isActive: Boolean(row.is_active),
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  }
}

// A small, explicit fallback: when a mistake has no direct rule_word_links match,
// this maps the practice engine's own error classification to a starter rule slug.
// Safe to extend later without changing the data model (see database/rules-schema.sql).
export const ERROR_TYPE_RULE_SLUGS: Record<string, string[]> = {
  double_consonant: ['double-consonants'],
  vowel_confusion: ['vowel-order-ei-ie'],
}

// All active rules visible to the current viewer: public built-in rules, plus their own private ones.
export async function getVisibleRules(): Promise<Rule[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await supabasePublicRequest('/rest/v1/rules?is_active=eq.true&select=*&order=title.asc') as Record<string, unknown>[]
    return rows.map(toRule)
  } catch {
    return []
  }
}

export async function getRuleBySlug(slug: string): Promise<Rule | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rules?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`) as Record<string, unknown>[]
    return rows[0] ? toRule(rows[0]) : null
  } catch {
    return null
  }
}

// All rule_word_links at once, so a page with many words (Libraries) can build a wordId -> rule
// map with a single request instead of one request per word.
export async function getAllRuleWordLinks(): Promise<RuleWordLink[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await supabasePublicRequest('/rest/v1/rule_word_links?select=id,rule_id,word_id,relation,note') as Array<Record<string, unknown>>
    return rows.map((row) => ({ id: row.id as string, ruleId: row.rule_id as string, wordId: row.word_id as string, relation: row.relation as RuleWordLink['relation'], note: (row.note as string) ?? undefined }))
  } catch {
    return []
  }
}

const PENDING_RULE_FOCUS_KEY = 'spell-sprint.pending-rule-focus'
// Lets another page (e.g. a word in Libraries) ask the Rules page to open on one specific rule,
// the same sessionStorage handoff pattern libraryPractice.ts uses for a pending practice selection.
export function setPendingRuleFocus(ruleId: string) { window.sessionStorage.setItem(PENDING_RULE_FOCUS_KEY, ruleId) }
export function consumePendingRuleFocus(): string | null {
  try { const value = window.sessionStorage.getItem(PENDING_RULE_FOCUS_KEY); window.sessionStorage.removeItem(PENDING_RULE_FOCUS_KEY); return value } catch { return null }
}

// Rule ids directly linked to a stable word id, via rule_word_links.
export async function getRuleIdsForWord(wordId: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !wordId) return []
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rule_word_links?word_id=eq.${encodeURIComponent(wordId)}&select=rule_id`) as Array<Pick<RuleWordLink, 'ruleId'> & { rule_id: string }>
    return [...new Set(rows.map((row) => row.rule_id))]
  } catch {
    return []
  }
}

// Rule ids suggested by the practice engine's own error classification (no word link needed).
export async function getRuleIdsForErrorType(errorType?: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !errorType) return []
  const slugs = ERROR_TYPE_RULE_SLUGS[errorType]
  if (!slugs?.length) return []
  const rules = await Promise.all(slugs.map(getRuleBySlug))
  return rules.filter((rule): rule is Rule => rule !== null).map((rule) => rule.id)
}

// One personal (private) rule row for the signed-in user's own progress table, keyed by ruleId.
export async function getUserRuleProgressByRuleId(ruleId: string) {
  const { data } = await supabaseUserRequest(`/rest/v1/user_rule_progress?rule_id=eq.${encodeURIComponent(ruleId)}&select=*&limit=1`)
  const rows = data as Record<string, unknown>[]
  return rows[0] ?? null
}

function toExample(row: Record<string, unknown>): RuleExample {
  return { id: row.id as string, ruleId: row.rule_id as string, exampleType: row.example_type as RuleExample['exampleType'], text: row.text as string, correction: (row.correction as string) ?? undefined, note: (row.note as string) ?? undefined }
}

export async function getRuleExamples(ruleId: string): Promise<RuleExample[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rule_examples?rule_id=eq.${encodeURIComponent(ruleId)}&select=*`) as Record<string, unknown>[]
    return rows.map(toExample)
  } catch {
    return []
  }
}

// Linked words for a rule, cross-referenced against this browser's word library so the card
// can show the actual word and its Russian translation rather than a bare id.
export async function getRuleLinkedWords(ruleId: string): Promise<Array<{ wordId: string; relation: RuleWordLink['relation']; word?: string; translation?: string }>> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rule_word_links?rule_id=eq.${encodeURIComponent(ruleId)}&select=word_id,relation`) as Array<{ word_id: string; relation: RuleWordLink['relation'] }>
    const words = getEveryWord()
    return rows.map((row) => {
      const match = words.find((word) => word.wordId === row.word_id)
      return { wordId: row.word_id, relation: row.relation, word: match?.word, translation: match?.translation }
    })
  } catch {
    return []
  }
}

export async function getRuleRelationships(ruleId: string): Promise<RuleRelationship[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await supabasePublicRequest(`/rest/v1/rule_relationships?rule_id=eq.${encodeURIComponent(ruleId)}&select=*`) as Record<string, unknown>[]
    return rows.map((row) => ({ id: row.id as string, ruleId: row.rule_id as string, relatedRuleId: row.related_rule_id as string, relationType: (row.relation_type as string) ?? undefined }))
  } catch {
    return []
  }
}

// Item 15: mistakes with no rule match at all, kept so the learner can turn one into a new
// private rule instead of losing it. Scoped to the signed-in user by RLS.
export async function getUnclassifiedMistakes(limit = 20): Promise<MistakeEvent[]> {
  if (!isSupabaseConfigured()) return []
  const session = await getActiveCloudSession()
  if (!session) return []
  try {
    const rows = await supabaseAuthedFetch(session, `/rest/v1/mistake_events?user_id=eq.${session.user.id}&category=eq.Unclassified&select=*&order=created_at.desc&limit=${limit}`) as Record<string, unknown>[]
    return rows.map((row) => ({
      id: row.id as string, userId: row.user_id as string, wordId: (row.word_id as string) ?? undefined, taskId: (row.task_id as string) ?? undefined,
      userAnswer: (row.user_answer as string) ?? undefined, correctAnswer: (row.correct_answer as string) ?? undefined,
      errorType: (row.error_type as string) ?? undefined, errorCategory: (row.error_category as string) ?? undefined,
      category: row.category as string, createdAt: row.created_at as string,
    }))
  } catch {
    return []
  }
}

// This user's own mistakes already linked to a rule (via mistake_rule_links), most recent first.
export async function getLinkedMistakesForRule(ruleId: string, limit = 5): Promise<MistakeEvent[]> {
  if (!isSupabaseConfigured()) return []
  const session = await getActiveCloudSession()
  if (!session) return []
  try {
    const links = await supabaseAuthedFetch(session, `/rest/v1/mistake_rule_links?user_id=eq.${session.user.id}&rule_id=eq.${ruleId}&select=mistake_event_id&order=created_at.desc&limit=${limit}`) as Array<{ mistake_event_id: string }>
    if (!links.length) return []
    const ids = links.map((link) => link.mistake_event_id).join(',')
    const rows = await supabaseAuthedFetch(session, `/rest/v1/mistake_events?id=in.(${ids})&select=*`) as Record<string, unknown>[]
    return rows.map((row) => ({
      id: row.id as string, userId: row.user_id as string, wordId: (row.word_id as string) ?? undefined, taskId: (row.task_id as string) ?? undefined,
      userAnswer: (row.user_answer as string) ?? undefined, correctAnswer: (row.correct_answer as string) ?? undefined,
      errorType: (row.error_type as string) ?? undefined, errorCategory: (row.error_category as string) ?? undefined,
      category: row.category as string, createdAt: row.created_at as string,
    })).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export type PersonalRuleDraft = { title: string; category: string; ruleType: RuleType; shortExplanation: string; wrongExample?: string; correctExample?: string }

function slugify(title: string) {
  return title.trim().toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'rule'
}

// Item 7: a rule the learner creates themselves. Private by default; could be switched to
// public later by changing the "visibility" column, without any other data model change.
export async function createPersonalRule(draft: PersonalRuleDraft): Promise<Rule> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before creating a personal rule.')
  const slug = `${slugify(draft.title)}-${session.user.id.slice(0, 8)}-${Date.now().toString(36)}`
  const [row] = await supabaseAuthedFetch(session, '/rest/v1/rules', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      slug, title: draft.title, category: draft.category, rule_type: draft.ruleType, short_explanation: draft.shortExplanation,
      source: 'personal', visibility: 'private', created_by: session.user.id, is_active: true,
    }),
  }) as Record<string, unknown>[]
  const rule = toRule(row)
  if (draft.wrongExample || draft.correctExample) {
    const examples = []
    if (draft.correctExample) examples.push({ rule_id: rule.id, example_type: 'correct', text: draft.correctExample })
    if (draft.wrongExample) examples.push({ rule_id: rule.id, example_type: 'incorrect', text: draft.wrongExample, correction: draft.correctExample ?? null })
    await supabaseAuthedFetch(session, '/rest/v1/rule_examples', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(examples) })
  }
  return rule
}

// Item 15's "predict a private draft rule" path, completed: turns one previously Unclassified
// mistake into a classified one, links its word to the new rule for next time, and starts that
// rule's progress — closing the loop without losing the original event.
// linkWord is only allowed for the learner's own rules: rule_word_links of a built-in rule can be
// changed only by its owner (see RLS), so linking to a built-in rule skips that step.
export async function reclassifyMistakeWithRule(mistake: MistakeEvent, ruleId: string, options: { linkWord?: boolean } = {}): Promise<void> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in required.')
  if (mistake.wordId && options.linkWord !== false) {
    await supabaseAuthedFetch(session, '/rest/v1/rule_word_links', {
      method: 'POST', headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ rule_id: ruleId, word_id: mistake.wordId, relation: 'primary' }),
    })
  }
  await supabaseAuthedFetch(session, `/rest/v1/mistake_events?id=eq.${mistake.id}`, {
    method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ category: 'Classified' }),
  })
  await supabaseAuthedFetch(session, '/rest/v1/mistake_rule_links', {
    method: 'POST', headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ mistake_event_id: mistake.id, rule_id: ruleId, user_id: session.user.id }),
  })
  const existing = await getProgressRow(session, ruleId)
  await upsertProgressRow(session, ruleId, nextProgressAfterMistake(existing))
}
