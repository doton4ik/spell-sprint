import type { ErrorFamily, LearningStatus, MistakeEntry, ReviewState } from '../types/learning'
import { getPracticeAttempts, subscribeToPracticeAttempts } from './practiceStorage'
import { getTaskById } from './libraryPractice'
import { getAllWords } from './libraryStorage'

const REVIEW_STATES_KEY = 'spell-sprint.review-states'
const RULE_REVIEW_KEY = 'spell-sprint.rule-review'
const LEARNING_UPDATED_EVENT = 'spell-sprint:learning-updated'

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
  const translations = new Map(getAllWords().map((word) => [word.wordId, word.translation]))
  const groups = new Map<string, ReturnType<typeof getPracticeAttempts>>()

  for (const attempt of getPracticeAttempts()) {
    const key = attempt.wordId ?? attempt.taskId
    const items = groups.get(key) ?? []
    items.push(attempt)
    groups.set(key, items)
  }

  const practiceEntries = [...groups.entries()]
    .map(([entryId, attempts]): MistakeEntry | null => {
      const failed = attempts.filter((attempt) => !attempt.isCorrect)
      if (failed.length === 0) return null
      const chronological = [...attempts].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      const lastFailure = [...failed].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      const state = states[entryId]
      const confidence = attempts.reduce((highest, attempt) => Math.max(highest, attempt.confidence ?? 0), 0)
      const status: LearningStatus = confidence >= 3 || state?.completedReviews && state.completedReviews >= 3
        ? 'mastered'
        : failed.length >= 3
          ? 'difficult'
          : state?.completedReviews
            ? 'review'
            : attempts.some((attempt) => attempt.isCorrect)
              ? 'learning'
              : 'new'

      return {
        taskId: entryId,
        correctAnswer: lastFailure.correctAnswer,
        lastUserVersion: lastFailure.userAnswer || 'Skipped',
        errorCategory: lastFailure.errorCategory,
        family: familyFor(lastFailure.errorCategory),
        topic: lastFailure.topic,
        topicId: lastFailure.topicId,
        subtopic: lastFailure.subtopic,
        wordId: lastFailure.wordId,
        translation: lastFailure.wordId ? translations.get(lastFailure.wordId) : undefined,
        library: lastFailure.library,
        errorType: lastFailure.errorType,
        numberOfAttempts: attempts.length,
        numberOfErrors: failed.length,
        numberOfCorrectAnswers: attempts.filter((attempt) => attempt.isCorrect).length,
        firstSeen: chronological[0].createdAt,
        lastSeen: chronological.at(-1)!.createdAt,
        nextReviewAt: state?.nextReviewAt ?? lastFailure.nextReviewAt ?? addDays(new Date(chronological[0].createdAt), 1),
        status,
      } as MistakeEntry
    })
    .filter((entry): entry is MistakeEntry => entry !== null)

  return practiceEntries
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
}

export function getReviewEntries() {
  const mistakes = getMistakeEntries()
  const hintOnly = new Map<string, MistakeEntry>()
  for (const attempt of getPracticeAttempts().filter((item) => item.hintUsed && item.isCorrect)) {
    if (mistakes.some((entry) => entry.taskId === attempt.taskId)) continue
    const current = hintOnly.get(attempt.taskId)
    if (current && current.lastSeen >= attempt.createdAt) continue
    hintOnly.set(attempt.taskId, { taskId: attempt.taskId, correctAnswer: attempt.correctAnswer, lastUserVersion: attempt.userAnswer || 'Hint used', errorCategory: 'Hint used', family: 'Vocabulary', topic: attempt.topic, topicId: attempt.topicId, subtopic: attempt.subtopic, wordId: attempt.wordId, library: attempt.library, numberOfAttempts: 1, numberOfErrors: 0, numberOfCorrectAnswers: 1, firstSeen: attempt.createdAt, lastSeen: attempt.createdAt, nextReviewAt: attempt.nextReviewAt ?? addDays(new Date(attempt.createdAt), 1), status: 'review', source: 'practice' })
  }
  return [...mistakes, ...hintOnly.values()].filter((entry) => entry.status !== 'mastered').sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
}

// Keeps the more advanced review state per task and unions saved rules; never removes local data.
export function mergeReviewData(states: Record<string, ReviewState>, ruleIds: string[]) {
  const merged = { ...getReviewStates() }
  for (const [taskId, state] of Object.entries(states)) {
    if (state && typeof state.completedReviews === 'number' && (!merged[taskId] || state.completedReviews > merged[taskId].completedReviews)) merged[taskId] = state
  }
  window.localStorage.setItem(REVIEW_STATES_KEY, JSON.stringify(merged))
  window.localStorage.setItem(RULE_REVIEW_KEY, JSON.stringify([...new Set([...getRuleReviewIds(), ...ruleIds])]))
  window.dispatchEvent(new Event(LEARNING_UPDATED_EVENT))
}

export function completeReview(taskId: string) {
  const current = getReviewStates()[taskId]
  const completedReviews = (current?.completedReviews ?? 0) + 1
  const intervals = [3, 7, 21]
  const nextReviewAt = addDays(new Date(), intervals[Math.min(completedReviews - 1, intervals.length - 1)])
  const updated = { ...getReviewStates(), [taskId]: { taskId, completedReviews, nextReviewAt, lastReviewedAt: new Date().toISOString() } }
  window.localStorage.setItem(REVIEW_STATES_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event(LEARNING_UPDATED_EVENT))
}

export function getTaskForReview(taskId: string) {
  return getTaskById(taskId)
}

export function getRuleReviewIds() {
  return read<string[]>(RULE_REVIEW_KEY, [])
}

export function toggleRuleReview(ruleId: string) {
  const existing = getRuleReviewIds()
  const next = existing.includes(ruleId) ? existing.filter((id) => id !== ruleId) : [...existing, ruleId]
  window.localStorage.setItem(RULE_REVIEW_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(LEARNING_UPDATED_EVENT))
  return next
}

export function subscribeToLearningData(onChange: () => void) {
  const unsubscribe = subscribeToPracticeAttempts(onChange)
  window.addEventListener(LEARNING_UPDATED_EVENT, onChange)
  return () => { unsubscribe(); window.removeEventListener(LEARNING_UPDATED_EVENT, onChange) }
}
