// Which account the learning data on this device belongs to. Several people may share one browser,
// so one learner's history must never be merged into another learner's cloud backup.
const OWNER_KEY = 'spell-sprint.data-owner'

// Personal learning data. Device preferences (text size, voice, practice settings) are kept.
const PERSONAL_KEYS = [
  'spell-sprint.practice-attempts',
  'spell-sprint.review-states',
  'spell-sprint.rule-review',
  'spell-sprint.level-checks',
  'spell-sprint.custom-libraries',
  'spell-sprint.library-prefs',
  'spell-sprint.sync-state',
  'spell-sprint.sprint-rounds',
  'spell-sprint.pair-attempts',
  'spell-sprint.mistake-outbox',
  'spell-sprint.diagnostic-result',
  'spell-sprint.profile',
  'spell-sprint.pending-practice-selection',
  'spell-sprint.pending-rule-focus',
]

export function clearPersonalData() {
  try {
    for (const key of PERSONAL_KEYS) window.localStorage.removeItem(key)
    window.localStorage.removeItem(OWNER_KEY)
  } catch { /* storage unavailable: nothing was stored either */ }
  for (const event of ['spell-sprint:practice-updated', 'spell-sprint:learning-updated', 'spell-sprint:profile-updated', 'spell-sprint:mistake-outbox']) window.dispatchEvent(new Event(event))
}

// Called whenever a session is stored. Data made without an account (a guest) joins this account;
// data left by a different account is removed first, so it cannot leak into this one.
export function claimDeviceData(userId: string) {
  try {
    const owner = window.localStorage.getItem(OWNER_KEY)
    if (owner && owner !== userId) clearPersonalData()
    window.localStorage.setItem(OWNER_KEY, userId)
  } catch { /* storage unavailable */ }
}
