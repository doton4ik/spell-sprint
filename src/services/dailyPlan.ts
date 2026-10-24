import type { LibraryWord } from '../types/library'
import type { PracticeAttempt } from '../types/practice'
import { getReviewStates } from './learningData'
import { libraryGroups } from './libraryGroups'
import { getAllWords } from './libraryStorage'
import { getPracticeAttempts } from './practiceStorage'
import { localDayKey } from './dateKeys'
import { learnerAbility, orderFreshWords } from './freshWords'
import { freshCapFor, wordsDoneOn, wordsTargetFor } from './dailyChecklist'
import { getProfile } from './profileStorage'

export { localDayKey } from './dateKeys'

function shiftDay(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

// Consecutive days with at least one answer. Today still counts as "kept" before the first answer,
// so the streak only breaks once a whole day has passed without practice.
export function getStreak(attempts: readonly PracticeAttempt[] = getPracticeAttempts()) {
  const days = new Set(attempts.map((attempt) => localDayKey(attempt.createdAt)))
  const today = new Date()
  let cursor = days.has(localDayKey(today)) ? today : shiftDay(today, -1)
  let streak = 0
  while (days.has(localDayKey(cursor))) {
    streak += 1
    cursor = shiftDay(cursor, -1)
  }
  return { streak, practisedToday: days.has(localDayKey(today)) }
}

export function getTodayCount(attempts: readonly PracticeAttempt[] = getPracticeAttempts()) {
  const today = localDayKey(new Date())
  return attempts.filter((attempt) => localDayKey(attempt.createdAt) === today).length
}

export type PlanReason = 'due' | 'weak' | 'new' | 'extra'
export type PlanItem = { word: LibraryWord; reason: PlanReason }
export type DailyPlan = { items: PlanItem[]; due: number; weak: number; fresh: number; extra: number; dueTotal: number }

const NEW_WORDS_WHEN_BUSY = 2 // even on a heavy review day, a couple of new words keep things moving
const professionalTopics = new Set(libraryGroups.find((group) => group.id === 'professional')?.topics ?? [])

// Stable pseudo-random order for one day: the plan must not reshuffle every time the page re-renders.
function dayHash(text: string) {
  let hash = 2166136261
  for (const char of text) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export type WordProgress = { latest: PracticeAttempt; errors: number; correct: number; attempts: number; dueAt: string; due: boolean }

// One pass over the practice history: per word, the latest answer, error/correct counts and whether
// its review date has come (today or earlier, local time). Shared by the daily plan and the Topics page.
export function getWordProgress(): Map<string, WordProgress> {
  const reviewStates = getReviewStates()
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
  const progress = new Map<string, WordProgress>()
  for (const attempt of getPracticeAttempts()) {
    // newest first
    if (!attempt.wordId) continue
    const current = progress.get(attempt.wordId)
    if (current) {
      current.attempts += 1
      if (attempt.isCorrect) current.correct += 1
      else current.errors += 1
      continue
    }
    progress.set(attempt.wordId, {
      latest: attempt,
      errors: attempt.isCorrect ? 0 : 1,
      correct: attempt.isCorrect ? 1 : 0,
      attempts: 1,
      dueAt: '',
      due: false,
    })
  }
  for (const [wordId, entry] of progress) {
    const manual = reviewStates[wordId]?.nextReviewAt
    // "Mark reviewed" on the Review page pushes the date forward; only honour it if it is newer than the last answer.
    entry.dueAt = manual && manual > entry.latest.createdAt ? manual : (entry.latest.nextReviewAt ?? entry.latest.createdAt)
    entry.due = new Date(entry.dueAt) <= endOfToday
  }
  return progress
}

// Today's session: words whose review date has come (most overdue and most-missed first), then words that keep
// going wrong, then a few new everyday words (at most `freshCap`, picked by the learner's level), then extra practice
// of words seen before (the longest unseen first) when the day is longer than the reviews. The size and the cap come
// from the minutes in the profile. Built from local practice history only.
// New words that were first practised today (level-check answers do not count): they use up the day's allowance of new words.
export function wordsIntroducedToday(now = new Date()) {
  const today = localDayKey(now)
  const first = new Map<string, string>()
  for (const attempt of getPracticeAttempts()) {
    if (!attempt.wordId || attempt.library === 'Level check') continue
    const seen = first.get(attempt.wordId)
    if (!seen || attempt.createdAt < seen) first.set(attempt.wordId, attempt.createdAt)
  }
  return [...first.values()].filter((createdAt) => localDayKey(createdAt) === today).length
}

export function buildDailyPlan(
  size = wordsTargetFor(getProfile().dailyMinutes, getProfile().activities),
  freshCap = freshCapFor(getProfile().dailyMinutes),
): DailyPlan {
  const words = getAllWords()
  const byId = new Map(words.map((word) => [word.wordId, word]))
  const stats = new Map([...getWordProgress()].filter(([wordId]) => byId.has(wordId)))
  // The plan is what is LEFT of the day: answers already given today use up the size, and new words already met today use up the cap.
  const remaining = Math.max(0, size - wordsDoneOn(localDayKey(new Date()), getPracticeAttempts()))
  const freshLeft = Math.max(0, freshCap - wordsIntroducedToday())

  const due = [...stats.entries()]
    .filter(([, entry]) => entry.due)
    .sort(
      ([, a], [, b]) => Number(a.latest.isCorrect) - Number(b.latest.isCorrect) || b.errors - a.errors || a.dueAt.localeCompare(b.dueAt),
    )
    .map(([wordId]) => wordId)
  const dueSet = new Set(due)
  const weak = [...stats.entries()]
    .filter(([wordId, entry]) => !dueSet.has(wordId) && entry.errors >= 2 && (entry.latest.confidence ?? 0) < 2)
    .sort(([, a], [, b]) => b.errors - a.errors)
    .map(([wordId]) => wordId)
  const weakSet = new Set(weak)
  const today = localDayKey(new Date())
  // New words: the learner's level decides how often a word comes up (freshWords.ts); the order is fixed for the day.
  const fresh = orderFreshWords(
    words.filter((word) => !stats.has(word.wordId) && !professionalTopics.has(word.topic)),
    learnerAbility(),
    (word) => dayHash(today + word.wordId) / 2 ** 32,
  ).map((word) => word.wordId)
  // Extra practice: words that are not due and not weak and not yet known (a word known on sight has confidence 3 or more and
  // must not come back), the shakiest first, then the longest unseen; not the ones answered today.
  const extra = [...stats.entries()]
    .filter(
      ([wordId, entry]) =>
        !dueSet.has(wordId) && !weakSet.has(wordId) && (entry.latest.confidence ?? 0) < 3 && localDayKey(entry.latest.createdAt) !== today,
    )
    .sort(
      ([, a], [, b]) =>
        (a.latest.confidence ?? 0) - (b.latest.confidence ?? 0) ||
        b.errors - a.errors ||
        a.latest.createdAt.localeCompare(b.latest.createdAt),
    )
    .map(([wordId]) => wordId)

  const freshQuota = Math.min(fresh.length, freshLeft, Math.max(NEW_WORDS_WHEN_BUSY, remaining - due.length - weak.length))
  const reviewRoom = Math.max(0, remaining - freshQuota)
  const pickedDue = due.slice(0, reviewRoom)
  const pickedWeak = weak.slice(0, reviewRoom - pickedDue.length)
  const pickedFresh = fresh.slice(0, Math.min(freshLeft, remaining - pickedDue.length - pickedWeak.length))
  const pickedExtra = extra.slice(0, remaining - pickedDue.length - pickedWeak.length - pickedFresh.length)

  const items: PlanItem[] = [
    ...pickedDue.map((wordId) => ({ word: byId.get(wordId)!, reason: 'due' as const })),
    ...pickedWeak.map((wordId) => ({ word: byId.get(wordId)!, reason: 'weak' as const })),
    ...pickedFresh.map((wordId) => ({ word: byId.get(wordId)!, reason: 'new' as const })),
    ...pickedExtra.map((wordId) => ({ word: byId.get(wordId)!, reason: 'extra' as const })),
  ]
  return {
    items,
    due: pickedDue.length,
    weak: pickedWeak.length,
    fresh: pickedFresh.length,
    extra: pickedExtra.length,
    dueTotal: due.length,
  }
}

// Why this word is in the session, in the learner's terms. Worked out when the session starts, so
// answering does not change the label under the learner's eyes.
export type WordReason = { kind: 'new' | 'missed' | 'due' | 'weak' | 'practice'; text: string }
export function reasonForWord(entry: WordProgress | undefined): WordReason {
  if (!entry) return { kind: 'new', text: 'New word' }
  const days = Math.floor((Date.now() - new Date(entry.latest.createdAt).getTime()) / 86400000)
  const ago = days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
  if (entry.due && !entry.latest.isCorrect) return { kind: 'missed', text: `Missed ${ago} — repeat` }
  if (entry.due) return { kind: 'due', text: `Review due · last seen ${ago}` }
  if (entry.errors > entry.correct) return { kind: 'weak', text: `Keeps slipping · ${entry.errors} mistakes` }
  return { kind: 'practice', text: `Extra practice · last seen ${ago}` }
}
