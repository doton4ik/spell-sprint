import type { MistakeEntry } from '../types/learning'
import { safeSetItem } from './safeStorage'

// Which mistakes to practise now. A session is not "the same list again": every word gets a score (due, wrong
// often, wrong lately, still difficult), a word that was handed out a moment ago is pushed down so the next
// session brings others, and the best few are taken. The words of the group the learner pressed (today's, due)
// come first, and the rest of the session is filled from everything else that needs work.
const SERVED_KEY = 'spell-sprint.mistake-served'
const HOUR = 3600000
const KEEP_MS = 48 * HOUR

export type ServedLog = Record<string, string> // word key -> ISO time it was last handed out

export const mistakeKey = (entry: Pick<MistakeEntry, 'wordId' | 'taskId'>) => entry.wordId ?? entry.taskId

export function scoreMistake(entry: MistakeEntry, now: Date, served: ServedLog, preferred: ReadonlySet<string>): number {
  const nowMs = now.getTime()
  let score = 0
  if (new Date(entry.nextReviewAt).getTime() <= nowMs) score += 4 // it is time to repeat it
  score += { difficult: 3, new: 2, learning: 1, review: 0, mastered: -5 }[entry.status] ?? 0
  score += Math.min(entry.numberOfErrors, 6) * 0.7 // a word that keeps going wrong
  const sinceMistake = entry.lastMistakeAt ? nowMs - new Date(entry.lastMistakeAt).getTime() : Infinity
  if (sinceMistake < 24 * HOUR) score += 2
  else if (sinceMistake < 72 * HOUR) score += 1
  if ((entry.goodDays ?? 0) >= 1) score -= 1.5 // already right on a later day
  if (preferred.has(mistakeKey(entry))) score += 3
  const handedOut = served[mistakeKey(entry)]
  if (handedOut) {
    const ago = nowMs - new Date(handedOut).getTime()
    score -= ago < HOUR / 2 ? 8 : ago < 6 * HOUR ? 4 : ago < 24 * HOUR ? 2 : 0
  }
  return score
}

// The entries to practise: the best `size` by score. `random` only breaks ties, so a test can pass a fixed one.
export function pickMistakes(options: {
  entries: MistakeEntry[]
  size: number
  preferred?: string[]
  served?: ServedLog
  now?: Date
  random?: () => number
}): MistakeEntry[] {
  const { entries, size, preferred = [], served = {}, now = new Date(), random = Math.random } = options
  const open = entries.filter((entry) => entry.status !== 'mastered' && !entry.archived)
  if (open.length <= size) return open
  const wanted = new Set(preferred)
  return open
    .map((entry) => ({ entry, score: scoreMistake(entry, now, served, wanted) + random() }))
    .sort((a, b) => b.score - a.score)
    .slice(0, size)
    .map((item) => item.entry)
}

export function loadServed(): ServedLog {
  try {
    const value = JSON.parse(window.localStorage.getItem(SERVED_KEY) ?? '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as ServedLog) : {}
  } catch {
    return {}
  }
}

// Remember what was just handed out (and forget what is older than two days).
export function markServed(keys: string[], now = new Date()) {
  if (!keys.length) return
  const log = loadServed()
  for (const key of keys) log[key] = now.toISOString()
  for (const [key, at] of Object.entries(log)) if (now.getTime() - new Date(at).getTime() > KEEP_MS) delete log[key]
  safeSetItem(SERVED_KEY, JSON.stringify(log))
}
