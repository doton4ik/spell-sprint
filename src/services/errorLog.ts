import { getActiveCloudSession, isSupabaseConfigured, supabaseAuthedFetch } from './supabase'

// When something breaks on a learner's device, we want to know. Errors are kept on the device
// (at most 20) and sent to the client_errors table (database/client-errors.sql) when someone is signed in.
// Only technical facts are sent: the message, the stack, the page name, the app version and the browser.
// Never answers, words or the full address (after sign-in it can hold tokens).
export type ClientError = { id: string; message: string; stack?: string; page: string; version: string; userAgent: string; at: string; sent?: boolean }

const KEY = 'spell-sprint.error-outbox'
const MAX_STORED = 20
const MAX_PER_DAY = 10
declare const __APP_VERSION__: string
const version = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev'

function read(): ClientError[] { try { const value: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]'); return Array.isArray(value) ? value as ClientError[] : [] } catch { return [] } }
function write(items: ClientError[]) { try { window.localStorage.setItem(KEY, JSON.stringify(items.slice(-MAX_STORED))) } catch { /* storage full or blocked */ } }
export const getStoredErrors = () => read()

// Long digits and e-mail-like strings are masked: a message must not carry personal data.
const scrub = (value: string) => value.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').replace(/eyJ[\w-]{10,}\.[\w-]+\.[\w-]+/g, '<token>')

export function reportError(error: unknown, where = 'app') {
  try {
    const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : JSON.stringify(error)?.slice(0, 300) ?? 'Unknown error')
    const message = scrub(err.message || String(err)).slice(0, 500)
    const items = read()
    const today = new Date().toISOString().slice(0, 10)
    // The same error again and again (a loop, a broken network) is stored once; at most 10 a day.
    if (items.some((item) => item.message === message && item.at.startsWith(today))) return
    if (items.filter((item) => item.at.startsWith(today)).length >= MAX_PER_DAY) return
    const page = `${where}:${window.location.hash.replace(/^#/, '').split(/[?&=]/)[0].slice(0, 40) || 'dashboard'}`
    items.push({ id: crypto.randomUUID(), message, stack: err.stack ? scrub(err.stack).slice(0, 4000) : undefined, page, version, userAgent: navigator.userAgent.slice(0, 300), at: new Date().toISOString() })
    write(items)
    void flushErrors()
  } catch { /* reporting must never cause another error */ }
}

let flushing: Promise<void> | null = null
export function flushErrors() {
  if (flushing) return flushing
  flushing = (async () => {
    try {
      const pending = read().filter((item) => !item.sent)
      if (!pending.length || !isSupabaseConfigured()) return
      const session = await getActiveCloudSession()
      if (!session) return
      for (const item of pending) {
        try {
          await supabaseAuthedFetch(session, '/rest/v1/client_errors', {
            method: 'POST', headers: { Prefer: 'return=minimal' },
            body: JSON.stringify({ user_id: session.user.id, message: item.message, stack: item.stack ?? null, page: item.page, app_version: item.version, user_agent: item.userAgent, created_at: item.at }),
          })
          write(read().map((saved) => (saved.id === item.id ? { ...saved, sent: true } : saved)))
        } catch (error) {
          // No table yet (404), refused (400/403): mark as sent so it is not retried forever.
          const status = (error as { status?: number }).status
          if (status && status >= 400 && status < 500) { write(read().map((saved) => (saved.id === item.id ? { ...saved, sent: true } : saved))); continue }
          break
        }
      }
    } catch { /* offline: try next time */ } finally { flushing = null }
  })()
  return flushing
}

// Errors that no component catches: a failed promise, a script error.
export function startErrorLog() {
  window.addEventListener('error', (event) => reportError(event.error ?? event.message, 'window'))
  window.addEventListener('unhandledrejection', (event) => reportError(event.reason, 'promise'))
  void flushErrors()
}
