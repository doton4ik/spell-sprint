import { getActiveCloudSession, insertRows, isSupabaseConfigured } from './supabase'

// Learners tell us what is broken, what to improve or what is wrong in the content (database/feedback.sql).
// Like word reports, a message is saved on the device first and sent when there is a signed-in session;
// until then it waits here. The limits below match the table's checks exactly, so the server never refuses a message
// that passed these checks.
export type FeedbackKind = 'bug' | 'idea' | 'content' | 'other'
export const feedbackKinds: Array<{ id: FeedbackKind; label: string }> = [
  { id: 'bug', label: 'Something is broken' },
  { id: 'idea', label: 'An idea' },
  { id: 'content', label: 'A mistake in a word or rule' },
  { id: 'other', label: 'Something else' },
]
export const FEEDBACK_MIN = 5
export const FEEDBACK_MAX = 1000
const MAX_PER_DAY = 5
const MAX_STORED = 30

export type FeedbackItem = {
  id: string
  kind: FeedbackKind
  message: string
  page: string
  version: string
  userAgent: string
  at: string
  sent?: boolean
}

declare const __APP_VERSION__: string
const version = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev'
const KEY = 'spell-sprint.feedback'

function read(): FeedbackItem[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? (value as FeedbackItem[]) : []
  } catch {
    return []
  }
}
function write(items: FeedbackItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(-MAX_STORED)))
  } catch {
    /* storage blocked */
  }
}

const kindIds = new Set<string>(feedbackKinds.map((kind) => kind.id))
export const cleanMessage = (value: string) => value.replace(/\s+/g, ' ').trim()
export const isMessageLongEnough = (value: string) => cleanMessage(value).length >= FEEDBACK_MIN

export const feedbackWaiting = () => read().filter((item) => !item.sent).length
const today = () => new Date().toISOString().slice(0, 10)

export type SubmitResult = 'sent' | 'saved' | 'too-short' | 'limit'

// Saves the message and tries to send it. 'saved' = it waits on the device (not signed in, or offline).
export async function submitFeedback(kind: FeedbackKind, message: string): Promise<SubmitResult> {
  const text = cleanMessage(message).slice(0, FEEDBACK_MAX)
  if (text.length < FEEDBACK_MIN || !kindIds.has(kind)) return 'too-short'
  const items = read()
  if (items.filter((item) => item.at.startsWith(today())).length >= MAX_PER_DAY) return 'limit'
  const id = crypto.randomUUID()
  items.push({
    id,
    kind,
    message: text,
    page: window.location.hash.replace(/^#/, '').split(/[?&=]/)[0].slice(0, 40) || 'dashboard',
    version: version.slice(0, 40),
    userAgent: navigator.userAgent.slice(0, 300),
    at: new Date().toISOString(),
  })
  write(items)
  await flushFeedback()
  return read().find((item) => item.id === id)?.sent ? 'sent' : 'saved'
}

let flushing: Promise<void> | null = null
export function flushFeedback() {
  if (flushing) return flushing
  flushing = (async () => {
    try {
      const pending = read().filter((item) => !item.sent)
      if (!pending.length || !isSupabaseConfigured()) return
      const session = await getActiveCloudSession()
      if (!session) return
      for (const item of pending) {
        try {
          // The id is ours, so a retry after a lost answer cannot add the same message twice.
          await insertRows(
            session,
            'feedback',
            {
              id: item.id,
              user_id: session.user.id,
              kind: item.kind,
              message: item.message,
              page: item.page,
              app_version: item.version,
              user_agent: item.userAgent,
              created_at: item.at,
            },
            { onConflict: 'id', ignoreDuplicates: true },
          )
          write(read().map((saved) => (saved.id === item.id ? { ...saved, sent: true } : saved)))
        } catch (error) {
          // A row the server refuses as bad data is dropped; anything else (no table yet, no network) waits.
          const status = (error as { status?: number }).status
          if (status === 400 || status === 422) {
            write(read().map((saved) => (saved.id === item.id ? { ...saved, sent: true } : saved)))
            continue
          }
          console.warn('Feedback kept on the device; will retry.', error)
          break
        }
      }
    } catch {
      /* offline: try next time */
    } finally {
      flushing = null
    }
  })()
  return flushing
}
