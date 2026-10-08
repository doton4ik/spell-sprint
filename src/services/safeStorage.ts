import { reportError } from './errorLog'

// Saving can fail when the browser's storage is full or blocked (private mode, a strict setting).
// Saves made while the learner is answering must not crash the page: the failure is logged, the
// app shows a notice (AppShell), and the answer itself is still shown on screen.
export const STORAGE_FAILED_EVENT = 'spell-sprint:storage-failed'

export function safeSetItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (error) {
    reportError(error, `storage ${key.replace('spell-sprint.', '')}`)
    window.dispatchEvent(new Event(STORAGE_FAILED_EVENT))
    return false
  }
}
