import { isSupabaseConfigured, supabaseAuthedFetch, supabasePublicRequest, type SupabaseSession } from './supabase'
import type { Classification, ConfusableSet } from './mistakeClassifier'

// Database side of mistake classification: the catalogue of error patterns, the mapping from a
// pattern to the Rules that teach it (error_pattern_rule_links), and saving the tags found for one
// mistake. The classifier itself (mistakeClassifier.ts) stays pure and never touches the network.

export type ErrorCatalog = {
  patternIds: Map<string, string> // pattern slug -> error_patterns.id
  ruleIdsByPattern: Map<string, string[]> // pattern slug -> linked rule ids
  confusableSets: ConfusableSet[]
  hasPatterns: boolean // false until database/error-classification-schema.sql has been run
}

// A link is only followed when the detector was reasonably sure; weak guesses are stored as tags
// but do not attach a rule on their own (the mistake stays Unclassified instead).
const MIN_CONFIDENCE_FOR_RULE_LINK = 0.6

const emptyCatalog = (): ErrorCatalog => ({ patternIds: new Map(), ruleIdsByPattern: new Map(), confusableSets: [], hasPatterns: false })
let cached: { catalog: ErrorCatalog; expiresAt: number } | null = null

// Never throws: if the new tables do not exist yet, classification still runs locally and the
// caller simply falls back to the older matching (rule_word_links, legacy error type map).
export async function loadErrorCatalog(): Promise<ErrorCatalog> {
  if (!isSupabaseConfigured()) return emptyCatalog()
  if (cached && cached.expiresAt > Date.now()) return cached.catalog
  const catalog = emptyCatalog()

  try {
    const [patterns, links] = await Promise.all([
      supabasePublicRequest('/rest/v1/error_patterns?is_active=eq.true&select=id,slug') as Promise<Array<{ id: string; slug: string }>>,
      supabasePublicRequest('/rest/v1/error_pattern_rule_links?select=error_pattern_id,rule_id') as Promise<Array<{ error_pattern_id: string; rule_id: string }>>,
    ])
    const slugById = new Map(patterns.map((pattern) => [pattern.id, pattern.slug]))
    for (const pattern of patterns) catalog.patternIds.set(pattern.slug, pattern.id)
    for (const link of links) {
      const slug = slugById.get(link.error_pattern_id)
      if (slug) catalog.ruleIdsByPattern.set(slug, [...(catalog.ruleIdsByPattern.get(slug) ?? []), link.rule_id])
    }
    catalog.hasPatterns = patterns.length > 0
  } catch {
    // tables not created yet
  }

  try {
    // Confusable words live on the rule itself (rules.metadata.confusable_words), so a new pair is data, not code.
    const rules = await supabasePublicRequest('/rest/v1/rules?rule_type=eq.confusing_words&is_active=eq.true&select=id,metadata') as Array<{ id: string; metadata?: { confusable_words?: unknown } }>
    for (const rule of rules) {
      const words = rule.metadata?.confusable_words
      if (Array.isArray(words) && words.every((word) => typeof word === 'string')) catalog.confusableSets.push({ ruleId: rule.id, words: words as string[] })
    }
  } catch {
    // classification still works without confusable words
  }

  cached = { catalog, expiresAt: Date.now() + (catalog.hasPatterns ? 5 * 60_000 : 30_000) }
  return catalog
}

// Rules to attach to this mistake because of the patterns found (plus a rule named directly by a detector).
export function ruleIdsFromClassification(classification: Classification, catalog: ErrorCatalog): string[] {
  const ids = new Set<string>()
  for (const tag of [...classification.technical, ...classification.learning]) {
    if (tag.confidence < MIN_CONFIDENCE_FOR_RULE_LINK) continue
    for (const ruleId of catalog.ruleIdsByPattern.get(tag.slug) ?? []) ids.add(ruleId)
    if (tag.ruleId) ids.add(tag.ruleId)
  }
  return [...ids]
}

export async function saveMistakePatterns(session: SupabaseSession, mistakeEventId: string, classification: Classification, catalog: ErrorCatalog): Promise<void> {
  const rows = [...classification.technical, ...classification.learning].flatMap((tag) => {
    const patternId = catalog.patternIds.get(tag.slug)
    return patternId ? [{ mistake_event_id: mistakeEventId, error_pattern_id: patternId, user_id: session.user.id, confidence: tag.confidence, detail: tag.detail ?? null }] : []
  })
  if (!rows.length) return
  await supabaseAuthedFetch(session, '/rest/v1/mistake_error_patterns?on_conflict=mistake_event_id,error_pattern_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(rows),
  })
}
