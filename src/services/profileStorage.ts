// Small per-device profile: the name used in greetings and the daily task goal.
const PROFILE_KEY = 'spell-sprint.profile'
const PROFILE_UPDATED_EVENT = 'spell-sprint:profile-updated'

export type Profile = { name: string; dailyGoal: number }
export const dailyGoalOptions = [5, 10, 15, 20, 30]
const defaults: Profile = { name: '', dailyGoal: 10 }

export function getProfile(): Profile {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_KEY) ?? '{}') as Partial<Profile>
    return {
      name: typeof stored.name === 'string' ? stored.name : defaults.name,
      dailyGoal: typeof stored.dailyGoal === 'number' && stored.dailyGoal > 0 ? stored.dailyGoal : defaults.dailyGoal,
    }
  } catch {
    return defaults
  }
}

export function saveProfile(patch: Partial<Profile>) {
  const next = { ...getProfile(), ...patch, name: (patch.name ?? getProfile().name).slice(0, 40) }
  try { window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next)) } catch { /* private mode: keep the in-memory value only */ }
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
  return next
}

export function subscribeToProfile(onChange: () => void) {
  window.addEventListener(PROFILE_UPDATED_EVENT, onChange)
  return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onChange)
}
