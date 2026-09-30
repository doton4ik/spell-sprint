import { claimDeviceData } from './deviceData'

type SupabaseUser = { id: string; email?: string }
export type SupabaseSession = { access_token: string; refresh_token: string; user: SupabaseUser }

const SESSION_KEY = 'spell-sprint.supabase-session'
const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function isSupabaseConfigured() { return Boolean(url && anonKey) }

function headers(token?: string) {
  return { apikey: anonKey ?? '', Authorization: `Bearer ${token ?? anonKey ?? ''}`, 'Content-Type': 'application/json' }
}

async function request(path: string, init: RequestInit = {}) {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.')
  const response = await fetch(`${url}${path}`, { ...init, headers: { ...headers(), ...init.headers } })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw Object.assign(new Error(data.msg ?? data.message ?? 'Supabase request failed.'), { status: response.status })
  return data
}

// Only a clear "no" from Supabase means the login is invalid; a network hiccup should not sign the user out.
function isAuthRejection(error: unknown) {
  const status = (error as { status?: number }).status
  return status === 400 || status === 401 || status === 403
}

// Sync and the mistake outbox may both find an expired token at the same moment; they share one
// refresh, so the refresh token is used once and neither request signs the learner out.
let refreshing: Promise<SupabaseSession | null> | null = null
function refreshSession(session: SupabaseSession) {
  refreshing ??= refreshOnce(session).finally(() => { refreshing = null })
  return refreshing
}

async function refreshOnce(session: SupabaseSession): Promise<SupabaseSession | null> {
  try {
    const data = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: session.refresh_token }) }) as SupabaseSession
    if (!data.access_token || !data.refresh_token || data.user?.id !== session.user.id) throw Object.assign(new Error('Session user mismatch.'), { status: 401 })
    storeSession(data)
    return data
  } catch (error) {
    if (isAuthRejection(error)) storeSession(null)
    return null
  }
}

export function getCloudSession(): SupabaseSession | null {
  try { const value = window.localStorage.getItem(SESSION_KEY); return value ? JSON.parse(value) as SupabaseSession : null } catch { return null }
}

export async function getActiveCloudSession(): Promise<SupabaseSession | null> {
  const session = getCloudSession()
  if (!session || !isSupabaseConfigured()) return null
  try {
    const user = await request('/auth/v1/user', { headers: headers(session.access_token) }) as SupabaseUser
    if (user.id !== session.user.id) throw Object.assign(new Error('Session user mismatch.'), { status: 401 })
    return session
  } catch (error) {
    if (!isAuthRejection(error)) return null
    return refreshSession(session)
  }
}

function storeSession(session: SupabaseSession | null) {
  if (session) claimDeviceData(session.user.id)
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else window.localStorage.removeItem(SESSION_KEY)
}

export async function signIn(email: string, password: string) {
  const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }) as SupabaseSession
  storeSession(data)
  return data
}

// Links in Supabase emails (confirm the address, reset the password) return here. The address must be
// listed under Authentication → URL Configuration → Redirect URLs, otherwise Supabase uses the Site URL.
function redirectTo() { return encodeURIComponent(`${window.location.origin}${window.location.pathname}`) }

export async function signUp(email: string, password: string) {
  const data = await request(`/auth/v1/signup?redirect_to=${redirectTo()}`, { method: 'POST', body: JSON.stringify({ email, password }) }) as Partial<SupabaseSession>
  if (data.access_token && data.refresh_token && data.user) storeSession(data as SupabaseSession)
  return data
}

export async function requestPasswordReset(email: string) {
  await request(`/auth/v1/recover?redirect_to=${redirectTo()}`, { method: 'POST', body: JSON.stringify({ email }) })
}

export async function updatePassword(password: string) {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('The reset link has expired. Request a new one.')
  await request('/auth/v1/user', { method: 'PUT', headers: headers(session.access_token), body: JSON.stringify({ password }) })
}

// A link from an email opens the app as #access_token=…&refresh_token=…&type=signup|recovery (or #error=…).
// That hash is not a page, so it is read and replaced with #settings before the app renders.
export type AuthRedirect = { kind: 'signed-in' | 'recovery' } | { kind: 'error'; message: string }
let pendingRedirect: Promise<AuthRedirect> | null = null

export function captureAuthRedirect() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  const error = params.get('error_description') ?? params.get('error')
  if (!accessToken && !error) return
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#settings`)
  pendingRedirect = (async (): Promise<AuthRedirect> => {
    if (error || !accessToken || !refreshToken) return { kind: 'error', message: error ?? 'The link is incomplete. Request a new one.' }
    try {
      const user = await request('/auth/v1/user', { headers: headers(accessToken) }) as SupabaseUser
      storeSession({ access_token: accessToken, refresh_token: refreshToken, user })
      return { kind: params.get('type') === 'recovery' ? 'recovery' : 'signed-in' }
    } catch {
      return { kind: 'error', message: 'This link has expired or was already used. Request a new one.' }
    }
  })()
}

// Returns the result once; later calls get null.
export function takeAuthRedirect() { const result = pendingRedirect; pendingRedirect = null; return result }

export async function signOut() {
  const session = getCloudSession()
  if (session && isSupabaseConfigured()) await request('/auth/v1/logout', { method: 'POST', headers: { ...headers(session.access_token) } }).catch(() => undefined)
  storeSession(null)
}

// Read-only access to public data (e.g. built-in rules); works even when signed out.
export async function supabasePublicRequest(path: string, init: RequestInit = {}) {
  return request(path, init)
}

// Access to the signed-in user's own rows (RLS-protected tables). Throws if not signed in.
export async function supabaseUserRequest(path: string, init: RequestInit = {}) {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in required for this action.')
  return { session, data: await supabaseAuthedFetch(session, path, init) }
}

// Same as supabaseUserRequest, but reuses an already-verified session so a multi-step
// operation (e.g. recording one mistake against several rules) does not re-verify per call.
export async function supabaseAuthedFetch(session: SupabaseSession, path: string, init: RequestInit = {}) {
  return request(path, { ...init, headers: { ...headers(session.access_token), ...init.headers } })
}

export async function loadCloudSnapshot(): Promise<{ payload: unknown; updatedAt: string } | null> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before restoring your learning data.')
  const rows = await request(`/rest/v1/learning_snapshots?select=payload,updated_at&user_id=eq.${encodeURIComponent(session.user.id)}`, { headers: headers(session.access_token) })
  const row = Array.isArray(rows) ? rows[0] : null
  return row ? { payload: row.payload, updatedAt: row.updated_at } : null
}

// Only the time of the last change: a few bytes, so a sync can skip downloading an unchanged backup.
export async function loadCloudSnapshotVersion(): Promise<string | null> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before synchronising your learning data.')
  const rows = await request(`/rest/v1/learning_snapshots?select=updated_at&user_id=eq.${encodeURIComponent(session.user.id)}`, { headers: headers(session.access_token) })
  return Array.isArray(rows) && rows[0] ? rows[0].updated_at as string : null
}

// Returns the new version (updated_at) of the backup.
export async function saveCloudSnapshot(payload: unknown) {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before synchronising your learning data.')
  const rows = await request('/rest/v1/learning_snapshots?on_conflict=user_id&select=updated_at', {
    method: 'POST', headers: { ...headers(session.access_token), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ user_id: session.user.id, payload, updated_at: new Date().toISOString() }),
  })
  return Array.isArray(rows) && rows[0] ? rows[0].updated_at as string : null
}
