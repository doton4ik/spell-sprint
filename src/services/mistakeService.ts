import { getActiveCloudSession, isSupabaseConfigured, supabaseAuthedFetch } from './supabase'
import { getAllWords } from './libraryStorage'
import { getRuleIdsForErrorType, getRuleIdsForWord } from './rulesService'
import { getProgressRow, nextProgressAfterMistake, upsertProgressRow } from './ruleProgressStore'
import { classifyMistake } from './mistakeClassifier'
import { loadErrorCatalog, ruleIdsFromClassification, saveMistakePatterns } from './errorPatternService'
import type { PracticeAttempt } from '../types/practice'
import type { MistakeRecordOutcome } from '../types/rules'

// Records one wrong practice attempt from a Spell Sprint test into the rules module:
//   1. classify the mistake locally (expected vs submitted -> technical + learning tags),
//   2. save the mistake_events row with all original data (never lost, even if no rule matches),
//   3. save the tags (mistake_error_patterns),
//   4. link the rules that teach those patterns (error_pattern_rule_links) plus any rule tied to
//      the word itself (rule_word_links), and update per-rule progress.
// Never throws into the caller — practice must keep working even if this fails or the user is
// signed out; errors are only logged.
//
// Rule #2: this is the only path that creates mistake_events in v1 — mini-practice inside a
// rule card (rulePracticeService.ts) updates the same progress rows but does not touch
// mistake_events, since v1 only links rules to errors made in Spell Sprint tests.
export async function recordMistake(attempt: PracticeAttempt): Promise<MistakeRecordOutcome> {
  const fallback: MistakeRecordOutcome = { recorded: false, ruleIds: [], unclassified: false, patternSlugs: [] }
  if (attempt.isCorrect || !isSupabaseConfigured()) return fallback
  try {
    const session = await getActiveCloudSession()
    if (!session) return fallback

    const catalog = await loadErrorCatalog()
    const word = attempt.wordId ? getAllWords().find((item) => item.wordId === attempt.wordId) : undefined
    const classification = classifyMistake(attempt.correctAnswer, attempt.userAnswer, {
      taskType: attempt.taskType, errorCategory: attempt.errorCategory, partOfSpeech: word?.partOfSpeech, confusableSets: catalog.confusableSets,
    })

    // The older single-tag map is only a fallback for before the pattern tables exist.
    const [byWord, byLegacyType] = await Promise.all([getRuleIdsForWord(attempt.wordId ?? ''), catalog.hasPatterns ? Promise.resolve([]) : getRuleIdsForErrorType(attempt.errorType)])
    const ruleIds = [...new Set([...byWord, ...byLegacyType, ...ruleIdsFromClassification(classification, catalog)])]

    const [event] = await supabaseAuthedFetch(session, '/rest/v1/mistake_events', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        user_id: session.user.id,
        word_id: attempt.wordId ?? null,
        task_id: attempt.taskId,
        user_answer: attempt.userAnswer,
        correct_answer: attempt.correctAnswer,
        error_type: attempt.errorType,
        error_category: attempt.errorCategory,
        category: ruleIds.length ? 'Classified' : 'Unclassified',
      }),
    }) as Array<{ id: string }>

    // The event is already safe; a failure below must not lose it.
    try { await saveMistakePatterns(session, event.id, classification, catalog) } catch (error) { console.warn('Could not save the error patterns for this mistake.', error) }

    const patternSlugs = [...classification.technical, ...classification.learning].map((tag) => tag.slug)
    if (!ruleIds.length) return { recorded: true, ruleIds: [], unclassified: true, patternSlugs }

    await supabaseAuthedFetch(session, '/rest/v1/mistake_rule_links', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(ruleIds.map((ruleId) => ({ mistake_event_id: event.id, rule_id: ruleId, user_id: session.user.id }))),
    })

    await Promise.all(ruleIds.map(async (ruleId) => {
      const existing = await getProgressRow(session, ruleId)
      await upsertProgressRow(session, ruleId, nextProgressAfterMistake(existing))
    }))

    return { recorded: true, ruleIds, unclassified: false, patternSlugs }
  } catch (error) {
    console.warn('Could not record this mistake in the rules module.', error)
    return fallback
  }
}
