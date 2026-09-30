import type { PracticeAttempt, PracticeMode } from '../types/practice'
import { localDayKey } from './dateKeys'
import { getPracticeAttempts } from './practiceStorage'

// Spaced review counts successful DAYS, not answers: three right answers in one sitting are one
// day of evidence, so they must not push a word three weeks away. A mistake starts the count again.
//   mistake → again today · 1st good day → tomorrow · 2nd → 3 days · 3rd → 7 · 4th → 14 · 5th → 30 (mastered)
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]
export const MASTERED_DAYS = REVIEW_INTERVALS.length

const itemKey = (attempt: Pick<PracticeAttempt, 'wordId' | 'taskId'>) => attempt.wordId ?? attempt.taskId

function addDays(from: Date, days: number) { const date = new Date(from); date.setDate(date.getDate() + days); return date.toISOString() }

// Picking the right spelling out of four, or giving the Russian meaning, shows the learner recognises
// the word, not that they can write it. Such answers are never a successful day; a mistake in them
// still counts, because it shows the word is not known.
export const recognitionOnly = (mode?: PracticeMode) => mode === 'choose-spelling' || mode === 'translate-ru'

// `confidence` on an attempt = successful review days since the last mistake (0–5).
export function scheduleAfterAnswer(item: Pick<PracticeAttempt, 'wordId' | 'taskId'>, correct: boolean, hintUsed: boolean, mode?: PracticeMode, now = new Date()) {
  const history = getPracticeAttempts().filter((attempt) => itemKey(attempt) === itemKey(item))
  const lastMistake = history.filter((attempt) => !attempt.isCorrect).map((attempt) => attempt.createdAt).sort().at(-1) ?? ''
  const goodDays = new Set(history.filter((attempt) => attempt.isCorrect && !attempt.hintUsed && !recognitionOnly(attempt.attemptMode) && attempt.createdAt > lastMistake).map((attempt) => localDayKey(attempt.createdAt)))

  if (!correct) return { confidence: 0, nextReviewAt: now.toISOString() }
  if (hintUsed) return { confidence: goodDays.size, nextReviewAt: addDays(now, 1) }
  if (recognitionOnly(mode)) {
    // Keeps the word's current review date (a known word is not pulled back), at least tomorrow.
    const tomorrow = addDays(now, 1)
    const planned = history.map((attempt) => attempt.nextReviewAt ?? '').sort().at(-1) ?? ''
    return { confidence: goodDays.size, nextReviewAt: planned > tomorrow ? planned : tomorrow }
  }
  goodDays.add(localDayKey(now))
  const days = Math.min(goodDays.size, MASTERED_DAYS)
  return { confidence: days, nextReviewAt: addDays(now, REVIEW_INTERVALS[days - 1]) }
}
