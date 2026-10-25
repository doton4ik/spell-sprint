import { sameText } from './contractions'
import { savePracticeAttempt } from './practiceStorage'
import { scheduleAfterAnswer } from './reviewSchedule'
import { safeSetItem } from './safeStorage'
import { diffWords, type DiffWord } from './sentenceDiff'

// One written line of a listening dictation, checked against the line that was heard.
export type LineResult = {
  correct: boolean
  expected: DiffWord[]
  given: DiffWord[]
}

export function checkLine(expected: string, given: string): LineResult {
  // an empty answer is a miss; nothing is compared, every word of the right line is shown as missed
  if (!given.trim()) return { correct: false, expected: expected.split(/\s+/).map((text) => ({ text, same: false })), given: [] }
  const { expected: shownExpected, given: shownGiven } = diffWords(expected, given)
  return { correct: sameText(expected, given), expected: shownExpected, given: shownGiven }
}

// Score of a finished clip, as a whole percent.
export function clipScore(results: boolean[]) {
  return results.length ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0
}

// ---- Saving the answers -------------------------------------------------------------------------

// Every line is a normal practice answer: a wrong or skipped line lands in My Mistakes and the review queue, a
// right one counts for today's dictation in the daily plan.
export function recordListeningAnswer(
  clip: { id: string; title: string },
  index: number,
  expected: string,
  given: string,
  { correct, skipped, hintUsed }: { correct: boolean; skipped: boolean; hintUsed: boolean },
) {
  const taskId = `listen-${clip.id}-${index}`
  // a line read with a hint is not yet known from hearing alone: it does not move the review forward
  const { confidence, nextReviewAt } = scheduleAfterAnswer({ taskId, library: 'Listening' }, correct, hintUsed, 'listen-write')
  savePracticeAttempt({
    id: crypto.randomUUID(),
    taskId,
    taskType: 'correct-sentence',
    topic: 'Listening',
    library: 'Listening',
    userAnswer: given.trim(),
    correctAnswer: expected,
    isCorrect: correct,
    wasSkipped: skipped,
    wasAnswerRevealed: false,
    hintUsed,
    attemptMode: 'listen-write',
    errorType: 'unknown',
    confidence,
    nextReviewAt,
    errorCategory: 'Listening dictation',
    needsReview: !correct,
    createdAt: new Date().toISOString(),
  })
}

// ---- Progress on this device --------------------------------------------------------------------

const PROGRESS_KEY = 'spell-sprint.listening-progress'
export type ClipProgress = { best: number; last: number; plays: number }

export function getListeningProgress(): Record<string, ClipProgress> {
  try {
    const stored = window.localStorage.getItem(PROGRESS_KEY)
    return stored ? (JSON.parse(stored) as Record<string, ClipProgress>) : {}
  } catch {
    return {}
  }
}

export function saveClipScore(clipId: string, score: number) {
  const all = getListeningProgress()
  const before = all[clipId]
  safeSetItem(
    PROGRESS_KEY,
    JSON.stringify({ ...all, [clipId]: { best: Math.max(before?.best ?? 0, score), last: score, plays: (before?.plays ?? 0) + 1 } }),
  )
}

// The shape of a line as a hint: the first letter of every word, the rest as dots ("Th… is… a… pity.").
export function lineHint(text: string) {
  return text
    .split(/\s+/)
    .map((word) => {
      const letters = word.replace(/[^A-Za-z0-9']/g, '')
      return letters.length <= 1
        ? word
        : `${word[0]}${'·'.repeat(Math.max(letters.length - 1, 1))}${word.match(/[^A-Za-z0-9']+$/)?.[0] ?? ''}`
    })
    .join(' ')
}
