import { safeSetItem } from './safeStorage'

// A note for every proofreading text the learner finished, so "texts today" can be counted. The answers alone are not
// enough: a text where every slip became a yellow card leaves no answer behind. Kept separate (no text data here) so
// the dashboard does not load the proofreading texts.
const KEY = 'spell-sprint.proofreading-done'
const MAX = 300
export type ProofreadingDone = { textId: string; createdAt: string }

export function getProofreadingDone(): ProofreadingDone[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value)
      ? value.filter(
          (item): item is ProofreadingDone => Boolean(item) && typeof item.textId === 'string' && typeof item.createdAt === 'string',
        )
      : []
  } catch {
    return []
  }
}

// Cloud sync: adds the notes made on another device (one note per text and time), newest first. Throws when storage
// is full, so the sync does not count this copy as merged.
export function mergeProofreadingDone(remote: unknown) {
  if (!Array.isArray(remote)) return
  const here = getProofreadingDone()
  const known = new Set(here.map((item) => `${item.textId}|${item.createdAt}`))
  const added = remote.filter(
    (item): item is ProofreadingDone =>
      Boolean(item) &&
      typeof item.textId === 'string' &&
      typeof item.createdAt === 'string' &&
      !known.has(`${item.textId}|${item.createdAt}`),
  )
  if (!added.length) return
  const merged = [...here, ...added].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX)
  window.localStorage.setItem(KEY, JSON.stringify(merged))
}

export function markProofreadingDone(textId: string, now = new Date()) {
  safeSetItem(KEY, JSON.stringify([{ textId, createdAt: now.toISOString() }, ...getProofreadingDone()].slice(0, MAX)))
}
