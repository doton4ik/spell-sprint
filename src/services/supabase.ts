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
  if (!response.ok) throw new Error(data.msg ?? data.message ?? 'Supabase request failed.')
  return data
}

export function getCloudSession(): SupabaseSession | null {
  try { const value = window.localStorage.getItem(SESSION_KEY); return value ? JSON.parse(value) as SupabaseSession : null } catch { return null }
}

function storeSession(session: SupabaseSession | null) {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else window.localStorage.removeItem(SESSION_KEY)
}

export async function signIn(email: string, password: string) {
  const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }) as SupabaseSession
  storeSession(data)
  return data
}

export async function signUp(email: string, password: string) {
  const data = await request('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password }) }) as Partial<SupabaseSession>
  if (data.access_token && data.refresh_token && data.user) storeSession(data as SupabaseSession)
  return data
}

export async function signOut() {
  const session = getCloudSession()
  if (session && isSupabaseConfigured()) await request('/auth/v1/logout', { method: 'POST', headers: { ...headers(session.access_token) } }).catch(() => undefined)
  storeSession(null)
}

export async function saveCloudSnapshot(payload: unknown) {
  const session = getCloudSession()
  if (!session) throw new Error('Sign in before synchronising your learning data.')
  await request('/rest/v1/learning_snapshots?on_conflict=user_id', {
    method: 'POST', headers: { ...headers(session.access_token), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: session.user.id, payload, updated_at: new Date().toISOString() }),
  })
}
