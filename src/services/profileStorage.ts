// Small per-device profile: the name used in greetings and the daily plan (minutes a day and which kinds of practice it includes).
const PROFILE_KEY = 'spell-sprint.profile'
const PROFILE_UPDATED_EVENT = 'spell-sprint:profile-updated'

// What a day can contain besides the words themselves (dailyChecklist.ts decides how much of each, from the minutes).
export type DailyActivities = { dictation: boolean; proofreading: boolean; pairs: boolean; sprint: boolean }
// dailyGoal = tasks (answers) a day, always derived from dailyMinutes (about two answers a minute): old code and the
// weekly chart still read it.
// updatedAt = when the learner last changed the profile on any device (ISO time). Cloud sync keeps the newer profile;
// a profile saved before this field existed has none and counts as the oldest.
export type Profile = { name: string; dailyGoal: number; dailyMinutes: number; activities: DailyActivities; updatedAt?: string }
export const dailyMinutesOptions = [5, 10, 15, 30, 50]
export const TASKS_PER_MINUTE = 2
export const defaultActivities: DailyActivities = { dictation: true, proofreading: true, pairs: true, sprint: true }
const defaults: Profile = { name: '', dailyGoal: 10 * TASKS_PER_MINUTE, dailyMinutes: 10, activities: defaultActivities }

export const nearestMinutes = (minutes: number) =>
  dailyMinutesOptions.reduce(
    (best, option) => (Math.abs(option - minutes) < Math.abs(best - minutes) ? option : best),
    dailyMinutesOptions[0],
  )

// An older profile has only a goal in tasks (5–30): about half as many minutes.
function minutesFrom(stored: Partial<Profile>) {
  if (typeof stored.dailyMinutes === 'number' && dailyMinutesOptions.includes(stored.dailyMinutes)) return stored.dailyMinutes
  if (typeof stored.dailyGoal === 'number' && stored.dailyGoal > 0) return nearestMinutes(stored.dailyGoal / TASKS_PER_MINUTE)
  return defaults.dailyMinutes
}

function activitiesFrom(value: unknown): DailyActivities {
  const stored = (value && typeof value === 'object' ? value : {}) as Partial<Record<keyof DailyActivities, unknown>>
  const pick = (key: keyof DailyActivities) => (typeof stored[key] === 'boolean' ? (stored[key] as boolean) : defaultActivities[key])
  return { dictation: pick('dictation'), proofreading: pick('proofreading'), pairs: pick('pairs'), sprint: pick('sprint') }
}

export function getProfile(): Profile {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_KEY) ?? '{}') as Partial<Profile>
    const dailyMinutes = minutesFrom(stored)
    return {
      name: typeof stored.name === 'string' ? stored.name : defaults.name,
      dailyMinutes,
      dailyGoal: dailyMinutes * TASKS_PER_MINUTE,
      activities: activitiesFrom(stored.activities),
      ...(typeof stored.updatedAt === 'string' && stored.updatedAt ? { updatedAt: stored.updatedAt } : {}),
    }
  } catch {
    return defaults
  }
}

// The time of a change made here: now, but always later than the time the profile already has. Another device's
// clock may run ahead; without this a change made here after taking its profile would look older and be undone.
function changeTime(previous: string | undefined) {
  const now = new Date().toISOString()
  const before = previous ? Date.parse(previous) : Number.NaN
  return Number.isFinite(before) && previous! >= now ? new Date(before + 1).toISOString() : now
}

// updatedAt: leave it out for a change made here. Cloud sync passes the time of the profile it takes from another
// device ('' for an old cloud profile without a time), so a copied profile does not look newer than its source.
export function saveProfile(
  patch: Partial<Pick<Profile, 'name' | 'dailyMinutes'>> & { activities?: Partial<DailyActivities> },
  copiedAt?: string,
) {
  const current = getProfile()
  const updatedAt = copiedAt ?? changeTime(current.updatedAt)
  const dailyMinutes =
    patch.dailyMinutes !== undefined && dailyMinutesOptions.includes(patch.dailyMinutes) ? patch.dailyMinutes : current.dailyMinutes
  const next: Profile = {
    name: (patch.name ?? current.name).slice(0, 40),
    dailyMinutes,
    dailyGoal: dailyMinutes * TASKS_PER_MINUTE,
    activities: { ...current.activities, ...patch.activities },
    ...(updatedAt ? { updatedAt } : {}),
  }
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  } catch {
    /* private mode: keep the in-memory value only */
  }
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
  return next
}

export function subscribeToProfile(onChange: () => void) {
  window.addEventListener(PROFILE_UPDATED_EVENT, onChange)
  return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onChange)
}
