import type { PracticeAttempt, PracticeMode } from '../types/practice'
import { localDayKey } from './dateKeys'
import { getPracticeAttempts } from './practiceStorage'

// Spaced review counts successful DAYS, not answers: three right answers in one sitting are one
// day of evidence, so they must not push a word three weeks away. A mistake starts the count again.
//   mistake → again today · 1st good day → tomorrow · 2nd → 3 days · 3rd → 7 · 4th → 14 · 5th → 30 (mastered)
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]
export const MASTERED_DAYS = REVIEW_INTERVALS.length

const itemKey = (attempt: Pick<PracticeAttempt, 'wordId' | 'taskId'>) => attempt.wordId ?? attempt.taskId

function addDays(from: Date, days: number) {
  const date = new Date(from)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// Picking the right spelling out of four, or giving the Russian meaning, shows the learner recognises
// the word, not that they can write it. Such answers are never a successful day; a mistake in them
// still counts, because it shows the word is not known.
export const recognitionOnly = (mode?: PracticeMode) => mode === 'choose-spelling' || mode === 'translate-ru'

// A right answer is a successful day only when it is earned:
//  - the word was due (its review date has come). Practising it again early, from a topic list for
//    example, is fine but does not move it forward; otherwise five days in a row would "master" it.
//  - it is not the same day as the last mistake: writing it right a minute after seeing the answer
//    shows short-term memory, so the word comes back tomorrow for a real check.
// The past is replayed with the same rules, so a day that was not counted then is not counted now.
function countsAsGoodDay(
  attempt: Pick<PracticeAttempt, 'isCorrect' | 'hintUsed' | 'attemptMode'>,
  day: string,
  plannedDay: string,
  mistakeDay: string,
) {
  return attempt.isCorrect && !attempt.hintUsed && !recognitionOnly(attempt.attemptMode) && day !== mistakeDay && day >= plannedDay
}

// `confidence` on an attempt = successful review days since the last mistake (0–5).
export function scheduleAfterAnswer(
  item: Pick<PracticeAttempt, 'wordId' | 'taskId'>,
  correct: boolean,
  hintUsed: boolean,
  mode?: PracticeMode,
  now = new Date(),
) {
  const history = getPracticeAttempts()
    .filter((attempt) => itemKey(attempt) === itemKey(item))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  // A wrong Russian meaning says nothing about spelling: it does not undo spelling progress.
  const lastMistake = history.filter((attempt) => !attempt.isCorrect && attempt.attemptMode !== 'translate-ru').at(-1)?.createdAt ?? ''
  const mistakeDay = lastMistake ? localDayKey(lastMistake) : ''
  const goodDays = new Set<string>()
  let plannedDay = ''
  let planned = ''
  for (const attempt of history) {
    const day = localDayKey(attempt.createdAt)
    if (attempt.createdAt > lastMistake && countsAsGoodDay(attempt, day, plannedDay, mistakeDay)) goodDays.add(day)
    if (attempt.nextReviewAt) {
      planned = attempt.nextReviewAt
      plannedDay = localDayKey(planned)
    }
  }

  // A wrong meaning brings the word back today, with its spelling progress kept.
  if (!correct) return { confidence: mode === 'translate-ru' ? goodDays.size : 0, nextReviewAt: now.toISOString() }
  const tomorrow = addDays(now, 1)
  // Keeps the word's current review date (a known word is not pulled back), at least tomorrow.
  const keepPlan = () => ({ confidence: goodDays.size, nextReviewAt: planned > tomorrow ? planned : tomorrow })
  if (hintUsed) return { confidence: goodDays.size, nextReviewAt: tomorrow }
  if (recognitionOnly(mode)) return keepPlan()
  const today = localDayKey(now)
  if (today === mistakeDay) return { confidence: 0, nextReviewAt: tomorrow }
  if (
    goodDays.has(today) ||
    !countsAsGoodDay({ isCorrect: true, hintUsed: false, attemptMode: mode ?? 'write-en' }, today, plannedDay, mistakeDay)
  )
    return keepPlan()
  goodDays.add(today)
  const days = Math.min(goodDays.size, MASTERED_DAYS)
  return { confidence: days, nextReviewAt: addDays(now, REVIEW_INTERVALS[days - 1]) }
}
