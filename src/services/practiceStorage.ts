import type { PracticeAttempt, PracticeSettings } from '../types/practice'

const SETTINGS_KEY = 'spell-sprint.practice-settings'
const ATTEMPTS_KEY = 'spell-sprint.practice-attempts'

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
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify([attempt, ...attempts].slice(0, 500)))
}

export function getPracticeAttempts() {
  return read<PracticeAttempt[]>(ATTEMPTS_KEY, [])
}
