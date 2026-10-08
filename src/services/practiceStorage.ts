import type { PracticeAttempt, PracticeSettings } from '../types/practice'
import { enqueueMistake } from './mistakeOutbox'
import { sanitizeAttempt } from './validate'
import { safeSetItem } from './safeStorage'
import { wordAliases } from '../data/wordAliases'
import { canonicalTopic } from '../data/libraryTaxonomy'

const SETTINGS_KEY = 'spell-sprint.practice-settings'
const ATTEMPTS_KEY = 'spell-sprint.practice-attempts'
const MAX_ATTEMPTS = 5000
const PRACTICE_UPDATED_EVENT = 'spell-sprint:practice-updated'

function read<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

export function loadPracticeSettings(defaults: PracticeSettings): PracticeSettings {
  return { ...defaults, ...read<Partial<PracticeSettings>>(SETTINGS_KEY, {}) }
}

export function savePracticeSettings(settings: PracticeSettings) {
  safeSetItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function savePracticeAttempt(attempt: PracticeAttempt) {
  const attempts = getPracticeAttempts()
  if (!safeSetItem(ATTEMPTS_KEY, JSON.stringify([attempt, ...attempts].slice(0, MAX_ATTEMPTS)))) return
  window.dispatchEvent(new Event(PRACTICE_UPDATED_EVENT))
  // The rules module is a layer on top of local practice history: wrong spelling answers are queued
  // and sent in the background, so a slow network or a signed-out user never blocks saving the attempt.
  enqueueMistake(attempt)
}

// "My translation is right too": the wrong answer becomes a right one (the only change ever made to a
// saved answer). Another device takes the change from the backup (see the merge below).
export function markAttemptClaimedCorrect(id: string, schedule: Pick<PracticeAttempt, 'confidence' | 'nextReviewAt'>) {
  const attempts = getPracticeAttempts().map((attempt) =>
    attempt.id === id
      ? { ...attempt, ...schedule, isCorrect: true, claimedCorrect: true, errorType: 'unknown' as const, needsReview: false }
      : attempt,
  )
  if (safeSetItem(ATTEMPTS_KEY, JSON.stringify(attempts))) window.dispatchEvent(new Event(PRACTICE_UPDATED_EVENT))
}

// Adds attempts that are not stored locally yet (matched by id); never removes anything. An answer
// marked "right too" on another device replaces the wrong version here.
export function mergePracticeAttempts(incoming: PracticeAttempt[]) {
  const attempts = getPracticeAttempts()
  const known = new Map(attempts.map((attempt) => [attempt.id, attempt]))
  // From the cloud backup: checked field by field (validate.ts), broken records dropped.
  const checked = incoming.map(sanitizeAttempt).filter((attempt): attempt is PracticeAttempt => attempt !== null)
  const fresh = checked.filter((attempt) => !known.has(attempt.id))
  const claimed = new Map(
    checked
      .filter((attempt) => attempt.claimedCorrect && known.get(attempt.id)?.claimedCorrect !== true)
      .filter((attempt) => known.has(attempt.id))
      .map((attempt) => [attempt.id, attempt]),
  )
  if (!fresh.length && !claimed.size) return 0
  const merged = [...attempts.map((attempt) => claimed.get(attempt.id) ?? attempt), ...fresh]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ATTEMPTS)
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(merged))
  window.dispatchEvent(new Event(PRACTICE_UPDATED_EVENT))
  return fresh.length + claimed.size
}

// The history (up to 5000 answers) is read in many places, often several times per answer. Parsing
// it each time is slow on a phone, so the parsed list is kept until the stored text changes (any
// writer, this tab or another). The list is shared and frozen: copy it before sorting.
let cached: { raw: string | null; attempts: readonly PracticeAttempt[] } | null = null
export function getPracticeAttempts(): readonly PracticeAttempt[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(ATTEMPTS_KEY)
  } catch {
    /* storage blocked */
  }
  if (cached && cached.raw === raw) return cached.attempts
  let attempts: PracticeAttempt[] = []
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    attempts = Array.isArray(parsed) ? parsed.map(withSharedWordId) : []
  } catch {
    /* damaged storage: start empty */
  }
  cached = { raw, attempts: Object.freeze(attempts) }
  return cached.attempts
}

// Older answers are read with today's ids: a word that is in two libraries has one id
// (data/wordAliases.ts), and a merged topic has one name (data/libraryTaxonomy.ts).
function withSharedWordId(attempt: PracticeAttempt): PracticeAttempt {
  if (!attempt || typeof attempt !== 'object') return attempt
  const shared = attempt.wordId ? wordAliases[attempt.wordId] : undefined
  let result = shared ? { ...attempt, wordId: shared, taskId: attempt.taskId.replace(attempt.wordId!, shared) } : attempt
  if (result.topicId && typeof result.topic === 'string') {
    const topic = canonicalTopic(result.topicId, result.topic)
    if (topic.topicId !== result.topicId) result = { ...result, topicId: topic.topicId, topic: topic.topic }
  }
  return result
}

export function subscribeToPracticeAttempts(onChange: () => void) {
  window.addEventListener(PRACTICE_UPDATED_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(PRACTICE_UPDATED_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}
