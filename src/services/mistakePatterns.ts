import { errorPatternLabel } from '../data/errorPatternLabels'
import { relevanceCheck } from './mistakeRelevance'
import type { PracticeAttempt } from '../types/practice'
import { classifyMistake, type ConfusableSet } from './mistakeClassifier'
import { shouldClassify } from './mistakeOutbox'
import { getPracticeAttempts } from './practiceStorage'
import { proofreadingTypes } from './proofreadingEngine'

// "Patterns" view of My Mistakes: the same wrong answers, grouped by WHY they were wrong
// (vowel order, doubling before -ing …) instead of by word, so a one-off typo can be told
// apart from a habit. Runs locally over the practice log with the same classifier as Rules.

export type PatternExample = { submitted: string; expected: string; when: string }
export type MistakePattern = {
  slug: string
  label: string
  hint: string
  errors: number
  words: string[] // distinct correct words
  wordIds: string[]
  recovered: number // words whose latest answer is now correct
  last30: number
  previous30: number
  lastSeen: string
  examples: PatternExample[]
  focus: Array<{ detail: string; count: number }> // the exact slips behind the pattern (rr→r, missing e), most frequent first
}

// Tags that name a place in the word rather than a habit; shown only when nothing better applies.
const locationOnly = new Set(['suffix_error', 'prefix_error', 'verb_ending_error'])
const DAY = 86400000

export function getMistakePatterns(confusableSets: ConfusableSet[] = []): { patterns: MistakePattern[]; unclassified: number } {
  const attempts = getPracticeAttempts().filter(relevanceCheck()) // newest first; retired words and tasks left out
  const latestByItem = new Map<string, PracticeAttempt>()
  for (const attempt of attempts) {
    const key = attempt.wordId ?? attempt.taskId
    if (!latestByItem.has(key)) latestByItem.set(key, attempt)
  }

  const now = Date.now()
  const buckets = new Map<
    string,
    MistakePattern & { wordSet: Set<string>; idSet: Set<string>; itemKeys: Set<string>; details: Map<string, number> }
  >()
  let unclassified = 0

  // Grammar mistakes from Proofreading already know their type ("Grammar · Articles"); spelling
  // mistakes are classified letter by letter.
  const grammarType = (attempt: PracticeAttempt) => /^Grammar · (.+)$/.exec(attempt.errorCategory)?.[1]
  const grammarKey = (label: string) => Object.entries(proofreadingTypes).find(([, type]) => type.label === label)?.[0] ?? label
  for (const attempt of attempts.filter((item) => !item.isCorrect && (shouldClassify(item) || grammarType(item)))) {
    const grammar = grammarType(attempt)
    let tags: Array<{ slug: string; detail?: string }>
    if (grammar) tags = [{ slug: `grammar:${grammarKey(grammar)}` }]
    else {
      const { learning, technical } = classifyMistake(attempt.correctAnswer, attempt.userAnswer, {
        taskType: attempt.taskType,
        errorCategory: attempt.errorCategory,
        confusableSets,
      })
      const meaningful = learning.filter((tag) => tag.slug !== 'unclassified' && tag.confidence >= 0.5)
      const specific = meaningful.filter((tag) => !locationOnly.has(tag.slug))
      tags = specific.length ? specific : meaningful
      // A different word altogether (illness for sore) is a meaning mix-up, not a spelling slip.
      if (!tags.length && technical.some((tag) => tag.slug === 'wrong_word'))
        tags = [{ slug: 'wrong_word', detail: `${attempt.correctAnswer} → ${attempt.userAnswer}` }]
    }
    if (!tags.length) {
      unclassified += 1
      continue
    }

    const age = now - new Date(attempt.createdAt).getTime()
    for (const tag of tags) {
      const grammarInfo = tag.slug.startsWith('grammar:') ? proofreadingTypes[tag.slug.slice(8)] : undefined
      const info = grammarInfo ?? errorPatternLabel(tag.slug)
      const bucket = buckets.get(tag.slug) ?? {
        slug: tag.slug,
        label: info.label,
        hint: info.hint,
        errors: 0,
        words: [],
        wordIds: [],
        recovered: 0,
        last30: 0,
        previous30: 0,
        lastSeen: attempt.createdAt,
        examples: [],
        focus: [],
        wordSet: new Set(),
        idSet: new Set(),
        itemKeys: new Set(),
        details: new Map<string, number>(),
      }
      bucket.errors += 1
      // Letter-level details only (rr→r, missing e): for ending rules the detail just repeats the rule.
      if (tag.detail && tag.slug !== 'wrong_word')
        for (const detail of tag.detail.split('; ').filter((item) => /→|^(missing|extra|silent) /.test(item)))
          bucket.details.set(detail, (bucket.details.get(detail) ?? 0) + 1)
      if (age < 30 * DAY) bucket.last30 += 1
      else if (age < 60 * DAY) bucket.previous30 += 1
      if (attempt.createdAt > bucket.lastSeen) bucket.lastSeen = attempt.createdAt
      bucket.wordSet.add(attempt.correctAnswer.toLocaleLowerCase())
      if (attempt.wordId) bucket.idSet.add(attempt.wordId)
      bucket.itemKeys.add(attempt.wordId ?? attempt.taskId)
      if (bucket.examples.length < 3 && !bucket.examples.some((example) => example.expected === attempt.correctAnswer))
        bucket.examples.push({ submitted: attempt.userAnswer, expected: attempt.correctAnswer, when: attempt.createdAt })
      buckets.set(tag.slug, bucket)
    }
  }

  const patterns = [...buckets.values()].map(({ wordSet, idSet, itemKeys, details, ...pattern }) => ({
    ...pattern,
    words: [...wordSet],
    wordIds: [...idSet],
    focus: [...details]
      .map(([detail, count]) => ({ detail, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4),
    recovered: [...itemKeys].filter((key) => latestByItem.get(key)?.isCorrect).length,
  }))
  // Habits first: many different words beat one word missed many times.
  patterns.sort((a, b) => b.words.length - a.words.length || b.last30 - a.last30 || b.errors - a.errors)
  return { patterns, unclassified }
}

// A pattern is a habit, not a typo, once it shows up in two or more different words.
export const isHabit = (pattern: MistakePattern) => pattern.words.length >= 2
