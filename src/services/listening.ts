import { sameText } from './contractions'
import { savePracticeAttempt } from './practiceStorage'
import { scheduleAfterAnswer } from './reviewSchedule'
import type { PracticeAttempt } from '../types/practice'
import { diffWords, type DiffWord } from './sentenceDiff'
import { americanSpelling, inOneSpelling } from './spellingVariants'

// One written line of a listening dictation, checked against the line that was heard.
export type LineResult = {
  correct: boolean
  expected: DiffWord[]
  given: DiffWord[]
}

export function checkLine(expected: string, given: string): LineResult {
  // an empty answer is a miss; nothing is compared, every word of the right line is shown as missed
  if (!given.trim()) return { correct: false, expected: expected.split(/\s+/).map((text) => ({ text, same: false })), given: [] }
  // British and American spellings are the same word when heard ("colour" / "color"): either is right
  const { expected: shownExpected, given: shownGiven } = diffWords(expected, given, americanSpelling)
  const correct = sameText(expected, given) || sameText(inOneSpelling(expected), inOneSpelling(given))
  return { correct, expected: shownExpected, given: shownGiven }
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

// ---- Progress on this device (stored in listeningProgress.ts) ----------------------------------

export { getListeningProgress, mergeListeningProgress, saveClipScore, type ClipProgress } from './listeningProgress'

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

// ---- Words missed in dictation -------------------------------------------------------------------

export type MissedWord = { word: string; count: number; clipId: string; text: string }

// "listen-video-abc-3" → the clip id "video-abc"
const clipOfTask = (taskId: string) => taskId.replace(/^listen-/, '').replace(/-\d+$/, '')
const plain = (word: string) => word.toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '')

// The words of the lines written wrong (not skipped) that were most often missed, with the clip and the line they
// were missed in last. Short function words ("a", "the", "to") are left out: they say little.
export function missedWords(attempts: readonly PracticeAttempt[], limit = 8): MissedWord[] {
  const found = new Map<string, MissedWord & { at: string }>()
  for (const attempt of attempts) {
    if (!attempt.taskId.startsWith('listen-') || attempt.isCorrect || attempt.wasSkipped || !attempt.userAnswer) continue
    for (const part of diffWords(attempt.correctAnswer, attempt.userAnswer).expected) {
      const word = plain(part.text)
      if (part.same || word.length < 4) continue
      const before = found.get(word)
      const newer = !before || attempt.createdAt > before.at
      found.set(word, {
        word,
        count: (before?.count ?? 0) + 1,
        clipId: newer ? clipOfTask(attempt.taskId) : before.clipId,
        text: newer ? attempt.correctAnswer : before.text,
        at: newer ? attempt.createdAt : before.at,
      })
    }
  }
  return [...found.values()]
    .sort((a, b) => b.count - a.count || b.at.localeCompare(a.at))
    .slice(0, limit)
    .map(({ word, count, clipId, text }) => ({ word, count, clipId, text }))
}

// The clip a dictation answer was saved for last, if any
export function lastListenedClipId(attempts: readonly PracticeAttempt[]) {
  let last: PracticeAttempt | undefined
  for (const attempt of attempts) if (attempt.taskId.startsWith('listen-') && (!last || attempt.createdAt > last.createdAt)) last = attempt
  return last ? clipOfTask(last.taskId) : null
}
