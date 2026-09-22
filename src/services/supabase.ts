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

async function refreshSession(session: SupabaseSession): Promise<SupabaseSession | null> {
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

export async function loadCloudSnapshot(): Promise<{ payload: unknown; updatedAt: string } | null> {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before restoring your learning data.')
  const rows = await request(`/rest/v1/learning_snapshots?select=payload,updated_at&user_id=eq.${encodeURIComponent(session.user.id)}`, { headers: headers(session.access_token) })
  const row = Array.isArray(rows) ? rows[0] : null
  return row ? { payload: row.payload, updatedAt: row.updated_at } : null
}

export async function saveCloudSnapshot(payload: unknown) {
  const session = await getActiveCloudSession()
  if (!session) throw new Error('Sign in before synchronising your learning data.')
  await request('/rest/v1/learning_snapshots?on_conflict=user_id', {
    method: 'POST', headers: { ...headers(session.access_token), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: session.user.id, payload, updated_at: new Date().toISOString() }),
  })
}
