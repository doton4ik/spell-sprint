import { errorPatternLabel } from '../data/errorPatternLabels'
import type { PracticeAttempt } from '../types/practice'
import { classifyMistake, type ConfusableSet } from './mistakeClassifier'
import { shouldClassify } from './mistakeOutbox'
import { getPracticeAttempts } from './practiceStorage'

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
}

// Tags that name a place in the word rather than a habit; shown only when nothing better applies.
const locationOnly = new Set(['suffix_error', 'prefix_error', 'verb_ending_error'])
const DAY = 86400000

export function getMistakePatterns(confusableSets: ConfusableSet[] = []): { patterns: MistakePattern[]; unclassified: number } {
  const attempts = getPracticeAttempts() // newest first
  const latestByItem = new Map<string, PracticeAttempt>()
  for (const attempt of attempts) { const key = attempt.wordId ?? attempt.taskId; if (!latestByItem.has(key)) latestByItem.set(key, attempt) }

  const now = Date.now()
  const buckets = new Map<string, MistakePattern & { wordSet: Set<string>; idSet: Set<string>; itemKeys: Set<string> }>()
  let unclassified = 0

  for (const attempt of attempts.filter(shouldClassify)) {
    const { learning } = classifyMistake(attempt.correctAnswer, attempt.userAnswer, { taskType: attempt.taskType, errorCategory: attempt.errorCategory, confusableSets })
    const meaningful = learning.filter((tag) => tag.slug !== 'unclassified' && tag.confidence >= 0.5)
    const specific = meaningful.filter((tag) => !locationOnly.has(tag.slug))
    const tags = specific.length ? specific : meaningful
    if (!tags.length) { unclassified += 1; continue }

    const age = now - new Date(attempt.createdAt).getTime()
    for (const tag of tags) {
      const info = errorPatternLabel(tag.slug)
      const bucket = buckets.get(tag.slug) ?? { slug: tag.slug, label: info.label, hint: info.hint, errors: 0, words: [], wordIds: [], recovered: 0, last30: 0, previous30: 0, lastSeen: attempt.createdAt, examples: [], wordSet: new Set(), idSet: new Set(), itemKeys: new Set() }
      bucket.errors += 1
      if (age < 30 * DAY) bucket.last30 += 1
      else if (age < 60 * DAY) bucket.previous30 += 1
      if (attempt.createdAt > bucket.lastSeen) bucket.lastSeen = attempt.createdAt
      bucket.wordSet.add(attempt.correctAnswer.toLocaleLowerCase())
      if (attempt.wordId) bucket.idSet.add(attempt.wordId)
      bucket.itemKeys.add(attempt.wordId ?? attempt.taskId)
      if (bucket.examples.length < 3 && !bucket.examples.some((example) => example.expected === attempt.correctAnswer)) bucket.examples.push({ submitted: attempt.userAnswer, expected: attempt.correctAnswer, when: attempt.createdAt })
      buckets.set(tag.slug, bucket)
    }
  }

  const patterns = [...buckets.values()].map(({ wordSet, idSet, itemKeys, ...pattern }) => ({
    ...pattern, words: [...wordSet], wordIds: [...idSet],
    recovered: [...itemKeys].filter((key) => latestByItem.get(key)?.isCorrect).length,
  }))
  // Habits first: many different words beat one word missed many times.
  patterns.sort((a, b) => b.words.length - a.words.length || b.last30 - a.last30 || b.errors - a.errors)
  return { patterns, unclassified }
}

// A pattern is a habit, not a typo, once it shows up in two or more different words.
export const isHabit = (pattern: MistakePattern) => pattern.words.length >= 2
