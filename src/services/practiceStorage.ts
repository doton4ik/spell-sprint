import type { PracticeAttempt, PracticeSettings } from '../types/practice'

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
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function savePracticeAttempt(attempt: PracticeAttempt) {
  const attempts = read<PracticeAttempt[]>(ATTEMPTS_KEY, [])
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify([attempt, ...attempts].slice(0, MAX_ATTEMPTS)))
  window.dispatchEvent(new Event(PRACTICE_UPDATED_EVENT))
}

// Adds attempts that are not stored locally yet (matched by id); never removes anything.
export function mergePracticeAttempts(incoming: PracticeAttempt[]) {
  const attempts = read<PracticeAttempt[]>(ATTEMPTS_KEY, [])
  const known = new Set(attempts.map((attempt) => attempt.id))
  const fresh = incoming.filter((attempt) => attempt && typeof attempt.id === 'string' && typeof attempt.taskId === 'string' && typeof attempt.createdAt === 'string' && !known.has(attempt.id))
  if (!fresh.length) return 0
  const merged = [...attempts, ...fresh].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX_ATTEMPTS)
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(merged))
  window.dispatchEvent(new Event(PRACTICE_UPDATED_EVENT))
  return fresh.length
}

export function getPracticeAttempts() {
  return read<PracticeAttempt[]>(ATTEMPTS_KEY, [])
}

export function subscribeToPracticeAttempts(onChange: () => void) {
  window.addEventListener(PRACTICE_UPDATED_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => { window.removeEventListener(PRACTICE_UPDATED_EVENT, onChange); window.removeEventListener('storage', onChange) }
}
