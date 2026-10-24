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

export function markProofreadingDone(textId: string, now = new Date()) {
  safeSetItem(KEY, JSON.stringify([{ textId, createdAt: now.toISOString() }, ...getProofreadingDone()].slice(0, MAX)))
}
