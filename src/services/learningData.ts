import { mixedPracticeTasks } from '../data/practice'
import { personalMistakeSeeds } from '../data/personalMistakes'
import type { ErrorFamily, LearningStatus, MistakeEntry, ReviewState } from '../types/learning'
import { getPracticeAttempts } from './practiceStorage'

const REVIEW_STATES_KEY = 'spell-sprint.review-states'
const RULE_REVIEW_KEY = 'spell-sprint.rule-review'

function addDays(from: Date, amount: number) {
  const result = new Date(from)
  result.setDate(result.getDate() + amount)
  return result.toISOString()
}

function read<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function familyFor(category: string): ErrorFamily {
  const grammar = ['Subject–verb agreement', 'Verb form', 'Tense', 'Articles', 'Prepositions', 'Word order']
  const vocabulary = ['Wrong translation', 'Inactive vocabulary', 'Unknown word', 'Professional definition weakness', 'Word family confusion']
  if (grammar.includes(category)) return 'Grammar'
  if (vocabulary.includes(category)) return 'Vocabulary'
  return 'Spelling'
}

export function getReviewStates() {
  return read<Record<string, ReviewState>>(REVIEW_STATES_KEY, {})
}

export function getMistakeEntries(): MistakeEntry[] {
  const states = getReviewStates()
  const groups = new Map<string, ReturnType<typeof getPracticeAttempts>>()

  for (const attempt of getPracticeAttempts()) {
    const items = groups.get(attempt.taskId) ?? []
    items.push(attempt)
    groups.set(attempt.taskId, items)
  }

  const practiceEntries = [...groups.entries()]
    .map(([taskId, attempts]) => {
      const failed = attempts.filter((attempt) => !attempt.isCorrect)
      if (failed.length === 0) return null
      const chronological = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      const lastFailure = [...failed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      const state = states[taskId]
      const status: LearningStatus = state?.completedReviews && state.completedReviews >= 3
        ? 'mastered'
        : failed.length >= 3
          ? 'difficult'
          : state?.completedReviews
            ? 'review'
            : attempts.some((attempt) => attempt.isCorrect)
              ? 'learning'
              : 'new'

      return {
        taskId,
        correctAnswer: lastFailure.correctAnswer,
        lastUserVersion: lastFailure.userAnswer || 'Skipped',
        errorCategory: lastFailure.errorCategory,
        family: familyFor(lastFailure.errorCategory),
        topic: lastFailure.topic,
        numberOfAttempts: attempts.length,
        numberOfErrors: failed.length,
        numberOfCorrectAnswers: attempts.filter((attempt) => attempt.isCorrect).length,
        firstSeen: chronological[0].createdAt,
        lastSeen: chronological.at(-1)!.createdAt,
        nextReviewAt: state?.nextReviewAt ?? addDays(new Date(chronological[0].createdAt), 1),
        status,
      } satisfies MistakeEntry
    })
    .filter((entry): entry is MistakeEntry => entry !== null)

  const baselineDate = new Date().toISOString()
  const baselineEntries: MistakeEntry[] = personalMistakeSeeds.map((seed) => ({
    taskId: `baseline-${seed.word}`,
    correctAnswer: seed.word,
    lastUserVersion: seed.userVersion,
    errorCategory: seed.category,
    family: familyFor(seed.category),
    topic: seed.topic,
    numberOfAttempts: 1,
    numberOfErrors: 1,
    numberOfCorrectAnswers: 0,
    firstSeen: baselineDate,
    lastSeen: baselineDate,
    nextReviewAt: addDays(new Date(), 1),
    status: 'difficult',
    memoryCue: seed.cue,
    riskLevel: 'high',
    source: 'personal-baseline',
  }))

  return [...baselineEntries, ...practiceEntries]
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
}

export function getReviewEntries() {
  return getMistakeEntries().filter((entry) => entry.status !== 'mastered').sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
}

export function completeReview(taskId: string) {
  const current = getReviewStates()[taskId]
  const completedReviews = (current?.completedReviews ?? 0) + 1
  const intervals = [3, 7, 21]
  const nextReviewAt = addDays(new Date(), intervals[Math.min(completedReviews - 1, intervals.length - 1)])
  const updated = { ...getReviewStates(), [taskId]: { taskId, completedReviews, nextReviewAt, lastReviewedAt: new Date().toISOString() } }
  window.localStorage.setItem(REVIEW_STATES_KEY, JSON.stringify(updated))
}

export function getTaskForReview(taskId: string) {
  return mixedPracticeTasks.find((task) => task.id === taskId)
}

export function getRuleReviewIds() {
  return read<string[]>(RULE_REVIEW_KEY, [])
}

export function toggleRuleReview(ruleId: string) {
  const existing = getRuleReviewIds()
  const next = existing.includes(ruleId) ? existing.filter((id) => id !== ruleId) : [...existing, ruleId]
  window.localStorage.setItem(RULE_REVIEW_KEY, JSON.stringify(next))
  return next
}
