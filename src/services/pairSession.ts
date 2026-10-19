// Building a session of look-alike pairs. Kept apart from pairs.ts (the answer log and the schedule), because it needs the
// sentences (pairDrills.ts, 170 KB) and only the Pairs page builds sessions: everything else reads the light pairIndex.ts.
import { pairDrills, type PairDrill, type PairSentence } from '../data/pairDrills'
import { pairStatuses } from './pairs'

const levelOrder = { A2: 0, B1: 1, B2: 2 }

export type PairQuestion = { pair: PairDrill; sentence: PairSentence }
const drillById = new Map(pairDrills.map((pair) => [pair.id, pair]))

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// A mixed session: pairs that are due (missed ones first), then new pairs from the easiest level.
// Two sentences per pair, so the learner has to tell the words apart, not just recognise one.
export function buildPairSession(size = 10): PairQuestion[] {
  const statuses = pairStatuses()
  const learning = statuses
    .filter((status) => status.state !== 'new' && status.due)
    .sort((a, b) => b.errors - a.errors || a.goodDays - b.goodDays)
  const fresh = shuffle(statuses.filter((status) => status.state === 'new')).sort(
    (a, b) => levelOrder[a.pair.level] - levelOrder[b.pair.level],
  )
  const later = shuffle(statuses.filter((status) => status.state !== 'new' && !status.due))
  const chosen = [...learning, ...fresh, ...later].slice(0, Math.ceil(size / 2))
  return shuffle(
    chosen.flatMap((status) => {
      const pair = drillById.get(status.pair.id)!
      return shuffle(pair.sentences)
        .slice(0, 2)
        .map((sentence) => ({ pair, sentence }))
    }),
  ).slice(0, size)
}

export function pairQuestions(pairId: string): PairQuestion[] {
  const pair = pairDrills.find((item) => item.id === pairId)
  return pair ? shuffle(pair.sentences).map((sentence) => ({ pair, sentence })) : []
}
