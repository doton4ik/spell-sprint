import { getActiveCloudSession, insertRows, isSupabaseConfigured, selectRows, updateRows } from './supabase'
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

// ---- Offline ---------------------------------------------------------------------------------
// The built-in rules and their examples ship with the app (data/builtInRules.json, exported from
// the database), so the Rules page works offline and without Supabase. Word links are kept from the
// last successful load. The file is loaded only when it is needed.
type BuiltInRules = { rules: Array<Record<string, unknown>>; examples: Array<Record<string, unknown>> }
let builtIn: Promise<BuiltInRules> | null = null
const bundled = () => (builtIn ??= import('../data/builtInRules.json').then((module) => module.default as BuiltInRules))
const LINKS_CACHE_KEY = 'spell-sprint.rule-links-cache'
function cachedLinks(): RuleWordLink[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(LINKS_CACHE_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

// A small, explicit fallback: when a mistake has no direct rule_word_links match,
// this maps the practice engine's own error classification to a starter rule slug.
// Safe to extend later without changing the data model (see database/rules-schema.sql).
// Article mistakes come from Proofreading as "grammar:*" patterns, which are not rows of the database's
// pattern table, so the rules that explain them are named here (see database/content-pack-3-articles.sql).
export const PATTERN_RULE_SLUGS: Record<string, string[]> = {
  // 'a-or-the' is the one rule for the / a / no article (the others were merged into it, see database/content-pack-11-merge-articles.sql).
  'grammar:article': ['a-or-the', 'a-or-an'],
  'grammar:article-missing': ['a-or-the', 'a-or-an'],
  'grammar:article-extra': ['a-or-the'],
}

export const ERROR_TYPE_RULE_SLUGS: Record<string, string[]> = {
  double_consonant: ['double-consonants'],
  vowel_confusion: ['vowel-order-ei-ie'],
}

// All active rules visible to the current viewer: public built-in rules, plus their own private ones.
export async function getVisibleRules(): Promise<Rule[]> {
  try {
    if (!isSupabaseConfigured()) throw new Error('offline')
    const rows = await selectRows(null, 'rules', { is_active: true }, { order: 'title.asc' })
    return rows.map(toRule)
  } catch {
    return (await bundled()).rules.filter((rule) => rule.is_active !== false).map(toRule)
  }
}

export async function getRuleBySlug(slug: string): Promise<Rule | null> {
  try {
    if (!isSupabaseConfigured()) throw new Error('offline')
    const rows = await selectRows(null, 'rules', { slug }, { limit: 1 })
    return rows[0] ? toRule(rows[0]) : null
  } catch {
    const row = (await bundled()).rules.find((rule) => rule.slug === slug)
    return row ? toRule(row) : null
  }
}

// All rule_word_links at once, so a page with many words (Libraries) can build a wordId -> rule
// map with a single request instead of one request per word.
export async function getAllRuleWordLinks(): Promise<RuleWordLink[]> {
  try {
    if (!isSupabaseConfigured()) throw new Error('offline')
    const rows = await selectRows(null, 'rule_word_links', {}, { select: 'id,rule_id,word_id,relation,note' })
    const links = rows.map((row) => ({
      id: row.id as string,
      ruleId: row.rule_id as string,
      wordId: row.word_id as string,
      relation: row.relation as RuleWordLink['relation'],
      note: (row.note as string) ?? undefined,
    }))
    try {
      window.localStorage.setItem(LINKS_CACHE_KEY, JSON.stringify(links))
    } catch {
      /* the offline copy is optional */
    }
    return links
  } catch {
    return cachedLinks()
  }
}

const PENDING_RULE_FOCUS_KEY = 'spell-sprint.pending-rule-focus'
// Lets another page (e.g. a word in Libraries) ask the Rules page to open on one specific rule,
// the same sessionStorage handoff pattern libraryPractice.ts uses for a pending practice selection.
export function setPendingRuleFocus(ruleId: string) {
  window.sessionStorage.setItem(PENDING_RULE_FOCUS_KEY, ruleId)
}
export function consumePendingRuleFocus(): string | null {
  try {
    const value = window.sessionStorage.getItem(PENDING_RULE_FOCUS_KEY)
    window.sessionStorage.removeItem(PENDING_RULE_FOCUS_KEY)
    return value
  } catch {
    return null
  }
}

// Rule ids directly linked to a stable word id, via rule_word_links.
export async function getRuleIdsForWord(wordId: string): Promise<string[]> {
  if (!wordId) return []
  try {
    if (!isSupabaseConfigured()) throw new Error('offline')
    const rows = await selectRows(null, 'rule_word_links', { word_id: wordId }, { select: 'rule_id' })
    return [...new Set(rows.map((row) => row.rule_id))]
  } catch {
    return [
      ...new Set(
        cachedLinks()
          .filter((link) => link.wordId === wordId)
          .map((link) => link.ruleId),
      ),
    ]
  }
}

// Rule ids suggested by the practice engine's own error classification (no word link needed).
export async function getRuleIdsForErrorType(errorType?: string): Promise<string[]> {
  if (!errorType) return []
  const slugs = ERROR_TYPE_RULE_SLUGS[errorType]
  if (!slugs?.length) return []
  const rules = await Promise.all(slugs.map(getRuleBySlug))
  return rules.filter((rule): rule is Rule => rule !== null).map((rule) => rule.id)
}

// One personal (private) rule row for the signed-in user's own progress table, keyed by ruleId.
export async function getUserRuleProgressByRuleId(ruleId: string) {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in required for this action.')
  const rows = await selectRows(session, 'user_rule_progress', { rule_id: ruleId }, { limit: 1 })
  return rows[0] ?? null
}

function toExample(row: Record<string, unknown>): RuleExample {
  return {
    id: row.id as string,
    ruleId: row.rule_id as string,
    exampleType: row.example_type as RuleExample['exampleType'],
    text: row.text as string,
    correction: (row.correction as string) ?? undefined,
    note: (row.note as string) ?? undefined,
  }
}

export async function getRuleExamples(ruleId: string): Promise<RuleExample[]> {
  try {
    if (!isSupabaseConfigured()) throw new Error('offline')
    const rows = await selectRows(null, 'rule_examples', { rule_id: ruleId })
    return rows.map(toExample)
  } catch {
    return (await bundled()).examples.filter((row) => row.rule_id === ruleId).map(toExample)
  }
}

export async function getRuleRelationships(ruleId: string): Promise<RuleRelationship[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const rows = await selectRows(null, 'rule_relationships', { rule_id: ruleId })
    return rows.map((row) => ({
      id: row.id as string,
      ruleId: row.rule_id as string,
      relatedRuleId: row.related_rule_id as string,
      relationType: (row.relation_type as string) ?? undefined,
    }))
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
    const rows = await selectRows(
      session,
      'mistake_events',
      { user_id: session.user.id, category: 'Unclassified' },
      { order: 'created_at.desc', limit },
    )
    return rows.map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      wordId: (row.word_id as string) ?? undefined,
      taskId: (row.task_id as string) ?? undefined,
      userAnswer: (row.user_answer as string) ?? undefined,
      correctAnswer: (row.correct_answer as string) ?? undefined,
      errorType: (row.error_type as string) ?? undefined,
      errorCategory: (row.error_category as string) ?? undefined,
      category: row.category as string,
      createdAt: row.created_at as string,
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
    const links = await selectRows(
      session,
      'mistake_rule_links',
      { user_id: session.user.id, rule_id: ruleId },
      { select: 'mistake_event_id', order: 'created_at.desc', limit },
    )
    if (!links.length) return []
    const rows = await selectRows(session, 'mistake_events', { id: links.map((link) => link.mistake_event_id) })
    return rows
      .map((row) => ({
        id: row.id as string,
        userId: row.user_id as string,
        wordId: (row.word_id as string) ?? undefined,
        taskId: (row.task_id as string) ?? undefined,
        userAnswer: (row.user_answer as string) ?? undefined,
        correctAnswer: (row.correct_answer as string) ?? undefined,
        errorType: (row.error_type as string) ?? undefined,
        errorCategory: (row.error_category as string) ?? undefined,
        category: row.category as string,
        createdAt: row.created_at as string,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export type PersonalRuleDraft = {
  title: string
  category: string
  ruleType: RuleType
  shortExplanation: string
  wrongExample?: string
  correctExample?: string
}

function slugify(title: string) {
  return (
    title
      .trim()
      .toLocaleLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'rule'
  )
}

// Item 7: a rule the learner creates themselves. Private by default; could be switched to
// public later by changing the "visibility" column, without any other data model change.
export async function createPersonalRule(draft: PersonalRuleDraft): Promise<Rule> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before creating a personal rule.')
  const slug = `${slugify(draft.title)}-${session.user.id.slice(0, 8)}-${Date.now().toString(36)}`
  const [row] = await insertRows(
    session,
    'rules',
    {
      slug,
      title: draft.title,
      category: draft.category,
      rule_type: draft.ruleType,
      short_explanation: draft.shortExplanation,
      source: 'personal',
      visibility: 'private',
      created_by: session.user.id,
      is_active: true,
    },
    { returning: true },
  )
  if (!row) throw new Error('The rule was not saved.')
  const rule = toRule(row)
  if (draft.wrongExample || draft.correctExample) {
    const examples: Array<{ rule_id: string; example_type: string; text: string; correction?: string | null }> = []
    if (draft.correctExample) examples.push({ rule_id: rule.id, example_type: 'correct', text: draft.correctExample })
    if (draft.wrongExample)
      examples.push({ rule_id: rule.id, example_type: 'incorrect', text: draft.wrongExample, correction: draft.correctExample ?? null })
    await insertRows(session, 'rule_examples', examples)
  }
  return rule
}

// Item 15's "predict a private draft rule" path, completed: turns one previously Unclassified
// mistake into a classified one, links its word to the new rule for next time, and starts that
// rule's progress — closing the loop without losing the original event.
// linkWord is only allowed for the learner's own rules: rule_word_links of a built-in rule can be
// changed only by its owner (see RLS), so linking to a built-in rule skips that step.
export async function reclassifyMistakeWithRule(
  mistake: MistakeEvent,
  ruleId: string,
  options: { linkWord?: boolean } = {},
): Promise<void> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in required.')
  if (mistake.wordId && options.linkWord !== false) {
    await insertRows(session, 'rule_word_links', { rule_id: ruleId, word_id: mistake.wordId, relation: 'primary' })
  }
  await updateRows(session, 'mistake_events', { id: mistake.id }, { category: 'Classified' })
  await insertRows(session, 'mistake_rule_links', { mistake_event_id: mistake.id, rule_id: ruleId, user_id: session.user.id })
  const existing = await getProgressRow(session, ruleId)
  await upsertProgressRow(session, ruleId, nextProgressAfterMistake(existing))
}
