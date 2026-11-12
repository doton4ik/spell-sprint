import { safeSetItem } from './safeStorage'

// Listening: the score of every clip on this device. Kept apart from listening.ts (answer checking), so cloud sync and
// the first screen do not load the sentence comparison with it.
const PROGRESS_KEY = 'spell-sprint.listening-progress'
export type ClipProgress = { best: number; last: number; plays: number }

export function getListeningProgress(): Record<string, ClipProgress> {
  try {
    const stored = window.localStorage.getItem(PROGRESS_KEY)
    return stored ? (JSON.parse(stored) as Record<string, ClipProgress>) : {}
  } catch {
    return {}
  }
}

export function saveClipScore(clipId: string, score: number) {
  const all = getListeningProgress()
  const before = all[clipId]
  safeSetItem(
    PROGRESS_KEY,
    JSON.stringify({ ...all, [clipId]: { best: Math.max(before?.best ?? 0, score), last: score, plays: (before?.plays ?? 0) + 1 } }),
  )
}

// Cloud sync: joins the progress saved on another device with this one. Per clip the best score and the number of
// plays are the larger of the two (not the sum, so merging twice changes nothing); the last score comes from the
// device that played the clip more. Throws when storage is full, so the sync does not count this copy as merged.
export function mergeListeningProgress(remote: unknown) {
  if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return
  const all = getListeningProgress()
  let changed = false
  for (const [clipId, value] of Object.entries(remote as Record<string, Partial<ClipProgress> | null>)) {
    if (!value || typeof value.best !== 'number' || typeof value.last !== 'number' || typeof value.plays !== 'number') continue
    const here = all[clipId]
    const next: ClipProgress = here
      ? {
          best: Math.max(here.best, value.best),
          last: value.plays > here.plays ? value.last : here.last,
          plays: Math.max(here.plays, value.plays),
        }
      : { best: value.best, last: value.last, plays: value.plays }
    if (here && here.best === next.best && here.last === next.last && here.plays === next.plays) continue
    all[clipId] = next
    changed = true
  }
  if (changed) window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(all))
}
