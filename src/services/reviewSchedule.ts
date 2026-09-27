import type { PracticeAttempt } from '../types/practice'
import { localDayKey } from './dateKeys'
import { getPracticeAttempts } from './practiceStorage'

// Spaced review counts successful DAYS, not answers: three right answers in one sitting are one
// day of evidence, so they must not push a word three weeks away. A mistake starts the count again.
//   mistake → again today · 1st good day → tomorrow · 2nd → 3 days · 3rd → 7 · 4th → 14 · 5th → 30 (mastered)
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]
export const MASTERED_DAYS = REVIEW_INTERVALS.length

const itemKey = (attempt: Pick<PracticeAttempt, 'wordId' | 'taskId'>) => attempt.wordId ?? attempt.taskId

function addDays(from: Date, days: number) { const date = new Date(from); date.setDate(date.getDate() + days); return date.toISOString() }

// `confidence` on an attempt = successful review days since the last mistake (0–5).
export function scheduleAfterAnswer(item: Pick<PracticeAttempt, 'wordId' | 'taskId'>, correct: boolean, hintUsed: boolean, now = new Date()) {
  const history = getPracticeAttempts().filter((attempt) => itemKey(attempt) === itemKey(item))
  const lastMistake = history.filter((attempt) => !attempt.isCorrect).map((attempt) => attempt.createdAt).sort().at(-1) ?? ''
  const goodDays = new Set(history.filter((attempt) => attempt.isCorrect && !attempt.hintUsed && attempt.createdAt > lastMistake).map((attempt) => localDayKey(attempt.createdAt)))

  if (!correct) return { confidence: 0, nextReviewAt: now.toISOString() }
  if (hintUsed) return { confidence: goodDays.size, nextReviewAt: addDays(now, 1) }
  goodDays.add(localDayKey(now))
  const days = Math.min(goodDays.size, MASTERED_DAYS)
  return { confidence: days, nextReviewAt: addDays(now, REVIEW_INTERVALS[days - 1]) }
}
