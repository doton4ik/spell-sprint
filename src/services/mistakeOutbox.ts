import type { PracticeAttempt } from '../types/practice'
import { sendMistake } from './mistakeService'
import { getActiveCloudSession, isSupabaseConfigured } from './supabase'

// Wrong answers wait here until they reach Supabase (mistake_events → patterns → rules). Practice is
// saved on the device first; this queue makes sure the rules module gets the same mistakes later —
// after the network comes back or after signing in — instead of silently dropping them.
const OUTBOX_KEY = 'spell-sprint.mistake-outbox'
const MAX_QUEUED = 300
const OUTBOX_EVENT = 'spell-sprint:mistake-outbox'

// Only letter-level answers go to the spelling classifier. Grammar sentences and Russian translations
// would only fill "Unclassified" with noise, and a blank answer carries no spelling information.
export function shouldClassify(attempt: PracticeAttempt) {
  return !attempt.isCorrect && Boolean(attempt.userAnswer.trim()) && attempt.taskType !== 'correct-sentence' && attempt.taskType !== 'translate-en-ru'
}

function read(): PracticeAttempt[] {
  try { const value = JSON.parse(window.localStorage.getItem(OUTBOX_KEY) ?? '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
function write(items: PracticeAttempt[]) {
  try { window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(items.slice(-MAX_QUEUED))) } catch { /* storage blocked: nothing more we can do */ }
  window.dispatchEvent(new Event(OUTBOX_EVENT))
}

export function getOutboxSize() { return read().length }
export function subscribeToOutbox(onChange: () => void) {
  window.addEventListener(OUTBOX_EVENT, onChange)
  return () => window.removeEventListener(OUTBOX_EVENT, onChange)
}

export function enqueueMistake(attempt: PracticeAttempt) {
  if (!shouldClassify(attempt)) return
  const items = read()
  if (!items.some((item) => item.id === attempt.id)) write([...items, attempt])
  void flushMistakeOutbox()
}

let flushing: Promise<number> | null = null

// Sends queued mistakes oldest first. Stops at the first failure (usually no network) and keeps the
// rest for the next try; returns how many were sent.
export function flushMistakeOutbox(): Promise<number> {
  if (flushing) return flushing
  flushing = (async () => {
    let sent = 0
    try {
      if (!isSupabaseConfigured() || !read().length) return 0
      const session = await getActiveCloudSession()
      if (!session) return 0
      for (const attempt of read()) {
        try {
          await sendMistake(attempt, session)
        } catch (error) {
          // The server rejected this row itself (bad data): retrying cannot help, so drop it rather than
          // block the whole queue. No network, auth or server trouble: keep everything and try later.
          const status = (error as { status?: number }).status
          if (status !== 400 && status !== 409 && status !== 422) { console.warn('Mistake kept in the outbox; will retry.', error); break }
          console.warn('A queued mistake was rejected by the server and dropped.', error)
        }
        write(read().filter((item) => item.id !== attempt.id))
        sent += 1
      }
    } catch (error) {
      console.warn('Could not send queued mistakes.', error)
    } finally {
      flushing = null
    }
    return sent
  })()
  return flushing
}
