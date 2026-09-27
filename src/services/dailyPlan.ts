import type { LibraryWord } from '../types/library'
import type { PracticeAttempt } from '../types/practice'
import { getReviewStates } from './learningData'
import { libraryGroups } from './libraryGroups'
import { getAllWords } from './libraryStorage'
import { getPracticeAttempts } from './practiceStorage'
import { localDayKey } from './dateKeys'

export { localDayKey } from './dateKeys'

function shiftDay(date: Date, days: number) { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy }

// Consecutive days with at least one answer. Today still counts as "kept" before the first answer,
// so the streak only breaks once a whole day has passed without practice.
export function getStreak(attempts: PracticeAttempt[] = getPracticeAttempts()) {
  const days = new Set(attempts.map((attempt) => localDayKey(attempt.createdAt)))
  const today = new Date()
  let cursor = days.has(localDayKey(today)) ? today : shiftDay(today, -1)
  let streak = 0
  while (days.has(localDayKey(cursor))) { streak += 1; cursor = shiftDay(cursor, -1) }
  return { streak, practisedToday: days.has(localDayKey(today)) }
}

export function getTodayCount(attempts: PracticeAttempt[] = getPracticeAttempts()) {
  const today = localDayKey(new Date())
  return attempts.filter((attempt) => localDayKey(attempt.createdAt) === today).length
}

export type PlanReason = 'due' | 'weak' | 'new'
export type PlanItem = { word: LibraryWord; reason: PlanReason }
export type DailyPlan = { items: PlanItem[]; due: number; weak: number; fresh: number; dueTotal: number }

export const PLAN_SIZE = 10
const NEW_WORDS_WHEN_BUSY = 2 // even on a heavy review day, a couple of new words keep things moving
const professionalTopics = new Set(libraryGroups.find((group) => group.id === 'professional-vocabulary')?.topics ?? [])

// Stable pseudo-random order for one day: the plan must not reshuffle every time the page re-renders.
function dayHash(text: string) {
  let hash = 2166136261
  for (const char of text) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619) }
  return hash >>> 0
}

export type WordProgress = { latest: PracticeAttempt; errors: number; correct: number; attempts: number; dueAt: string; due: boolean }

// One pass over the practice history: per word, the latest answer, error/correct counts and whether
// its review date has come (today or earlier, local time). Shared by the daily plan and the Topics page.
export function getWordProgress(): Map<string, WordProgress> {
  const reviewStates = getReviewStates()
  const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999)
  const progress = new Map<string, WordProgress>()
  for (const attempt of getPracticeAttempts()) { // newest first
    if (!attempt.wordId) continue
    const current = progress.get(attempt.wordId)
    if (current) { current.attempts += 1; if (attempt.isCorrect) current.correct += 1; else current.errors += 1; continue }
    progress.set(attempt.wordId, { latest: attempt, errors: attempt.isCorrect ? 0 : 1, correct: attempt.isCorrect ? 1 : 0, attempts: 1, dueAt: '', due: false })
  }
  for (const [wordId, entry] of progress) {
    const manual = reviewStates[wordId]?.nextReviewAt
    // "Mark reviewed" on the Review page pushes the date forward; only honour it if it is newer than the last answer.
    entry.dueAt = manual && manual > entry.latest.createdAt ? manual : entry.latest.nextReviewAt ?? entry.latest.createdAt
    entry.due = new Date(entry.dueAt) <= endOfToday
  }
  return progress
}

// Today's session: words whose review date has come (most overdue and most-missed first), then words
// that keep going wrong, then a few new everyday words. Built from local practice history only.
export function buildDailyPlan(size = PLAN_SIZE): DailyPlan {
  const words = getAllWords()
  const byId = new Map(words.map((word) => [word.wordId, word]))
  const stats = new Map([...getWordProgress()].filter(([wordId]) => byId.has(wordId)))

  const due = [...stats.entries()]
    .filter(([, entry]) => entry.due)
    .sort(([, a], [, b]) => Number(a.latest.isCorrect) - Number(b.latest.isCorrect) || b.errors - a.errors || a.dueAt.localeCompare(b.dueAt))
    .map(([wordId]) => wordId)
  const dueSet = new Set(due)
  const weak = [...stats.entries()]
    .filter(([wordId, entry]) => !dueSet.has(wordId) && entry.errors >= 2 && (entry.latest.confidence ?? 0) < 2)
    .sort(([, a], [, b]) => b.errors - a.errors)
    .map(([wordId]) => wordId)
  const today = localDayKey(new Date())
  const fresh = words
    .filter((word) => !stats.has(word.wordId) && !professionalTopics.has(word.topic))
    .sort((a, b) => dayHash(today + a.wordId) - dayHash(today + b.wordId))
    .map((word) => word.wordId)

  const freshQuota = Math.min(fresh.length, Math.max(NEW_WORDS_WHEN_BUSY, size - due.length - weak.length))
  const reviewRoom = size - freshQuota
  const pickedDue = due.slice(0, reviewRoom)
  const pickedWeak = weak.slice(0, reviewRoom - pickedDue.length)
  const pickedFresh = fresh.slice(0, size - pickedDue.length - pickedWeak.length)

  const items: PlanItem[] = [
    ...pickedDue.map((wordId) => ({ word: byId.get(wordId)!, reason: 'due' as const })),
    ...pickedWeak.map((wordId) => ({ word: byId.get(wordId)!, reason: 'weak' as const })),
    ...pickedFresh.map((wordId) => ({ word: byId.get(wordId)!, reason: 'new' as const })),
  ]
  return { items, due: pickedDue.length, weak: pickedWeak.length, fresh: pickedFresh.length, dueTotal: due.length }
}
