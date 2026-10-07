import type { ProofreadingLevel, ProofreadingText } from '../data/proofreadingTexts'

// Proofreading → Ten sentences: short real sentences from Tatoeba (CC BY 2.0 FR), each with one
// place where a typical mistake can go (built by research/tatoeba-proof-sentences.mjs). The pool is
// a separate file, loaded only when this mode is used.
export type PoolSentence = { id: string; text: string; type: string; level: 'A2' | 'B1' | 'B2' }

let pool: Promise<PoolSentence[]> | null = null
export function loadSentencePool() {
  pool ??= fetch(`${import.meta.env.BASE_URL}data/proofreading-sentences.json`)
    .then((response) => {
      if (!response.ok) throw new Error('The sentences could not be loaded.')
      return response.json() as Promise<PoolSentence[]>
    })
    .catch((error) => {
      pool = null
      throw error
    })
  return pool
}

const SEEN_KEY = 'spell-sprint.proof-sentences-seen'
const readSeen = (): string[] => {
  try {
    return JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? '[]')
  } catch {
    return []
  }
}
const levelsFor: Record<ProofreadingLevel, PoolSentence['level'][]> = { A2: ['A2'], B1: ['B1', 'A2'], B2: ['B2', 'B1'], C1: ['B2'] }
export const SENTENCES_TEXT_ID = 'sentences'

// Ten sentences at the learner's level, not seen recently, with more of the mistake types they miss
// (weights from typeWeights) and at most two of one type.
export async function buildSentenceText(level: ProofreadingLevel, weights: Record<string, number>, count = 10): Promise<ProofreadingText> {
  const all = await loadSentencePool()
  const seen = new Set(readSeen())
  let candidates = all.filter((item) => levelsFor[level].includes(item.level) && !seen.has(item.id))
  if (candidates.length < count * 3) candidates = all.filter((item) => levelsFor[level].includes(item.level))
  const chosen: PoolSentence[] = []
  const perType: Record<string, number> = {}
  while (chosen.length < count && candidates.length) {
    const open = candidates.filter((item) => (perType[item.type] ?? 0) < 2)
    const list = open.length ? open : candidates
    const total = list.reduce((sum, item) => sum + (weights[item.type] ?? 1), 0)
    let roll = Math.random() * total
    const pick = list.find((item) => (roll -= weights[item.type] ?? 1) <= 0) ?? list[0]
    chosen.push(pick)
    perType[pick.type] = (perType[pick.type] ?? 0) + 1
    candidates = candidates.filter((item) => item !== pick)
  }
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...readSeen(), ...chosen.map((item) => item.id)].slice(-400)))
  } catch {
    /* only a convenience */
  }
  return {
    id: SENTENCES_TEXT_ID,
    title: 'Ten real sentences',
    level,
    format: 'sentences',
    topic: 'Everyday English',
    situation: 'Ten separate sentences from Tatoeba.org (CC BY 2.0 FR). Some of them are correct — fix only the ones with a mistake.',
    text: chosen.map((item, index) => `${index + 1}. ${item.text}`).join('\n'),
  }
}
