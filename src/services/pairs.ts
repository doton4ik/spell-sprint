// Pair drills (their / there / they're …): a separate log, so choosing between look-alike words does
// not change any word's spelling progress. Each pair is reviewed on the same day-based schedule as
// words: a mistake brings it back today, successful days push it 1 → 3 → 7 → 14 → 30 days away.
import { pairDrills, type PairDrill, type PairSentence } from '../data/pairDrills'
import { localDayKey } from './dateKeys'
import { REVIEW_INTERVALS, MASTERED_DAYS } from './reviewSchedule'

const KEY = 'spell-sprint.pair-attempts'
const UPDATED_EVENT = 'spell-sprint:learning-updated'
const MAX_ATTEMPTS = 3000
const levelOrder = { A2: 0, B1: 1, B2: 2 }

export type PairAttempt = { id: string; pairId: string; sentence: string; chosen: string; correct: boolean; createdAt: string }
export type PairStatus = { pair: PairDrill; state: 'new' | 'learning' | 'mastered'; due: boolean; errors: number; answers: number; goodDays: number }
export type PairQuestion = { pair: PairDrill; sentence: PairSentence }

const valid = (item: unknown): item is PairAttempt => Boolean(item) && typeof (item as PairAttempt).id === 'string' && typeof (item as PairAttempt).pairId === 'string' && typeof (item as PairAttempt).correct === 'boolean' && typeof (item as PairAttempt).createdAt === 'string'

export function getPairAttempts(): PairAttempt[] {
  try { const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]'); return Array.isArray(value) ? value.filter(valid) : [] } catch { return [] }
}
function save(attempts: PairAttempt[]) {
  try { window.localStorage.setItem(KEY, JSON.stringify(attempts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX_ATTEMPTS))) } catch { /* the session still goes on */ }
  window.dispatchEvent(new Event(UPDATED_EVENT))
}

export function recordPairAnswer(pair: PairDrill, sentence: PairSentence, chosen: string) {
  save([{ id: crypto.randomUUID(), pairId: pair.id, sentence: sentence.text, chosen, correct: chosen === sentence.answer, createdAt: new Date().toISOString() }, ...getPairAttempts()])
}

// Cloud restore: answers from other devices are added, never removed.
export function mergePairAttempts(incoming: unknown) {
  if (!Array.isArray(incoming)) return
  const local = getPairAttempts()
  const known = new Set(local.map((attempt) => attempt.id))
  const fresh = incoming.filter(valid).filter((attempt) => !known.has(attempt.id))
  if (fresh.length) save([...local, ...fresh])
}

export function pairStatuses(attempts = getPairAttempts(), now = new Date()): PairStatus[] {
  const byPair = new Map<string, PairAttempt[]>()
  for (const attempt of attempts) byPair.set(attempt.pairId, [...(byPair.get(attempt.pairId) ?? []), attempt])
  return pairDrills.map((pair) => {
    const history = byPair.get(pair.id) ?? []
    if (!history.length) return { pair, state: 'new', due: true, errors: 0, answers: 0, goodDays: 0 }
    const lastMistake = history.filter((attempt) => !attempt.correct).map((attempt) => attempt.createdAt).sort().at(-1) ?? ''
    const goodDays = new Set(history.filter((attempt) => attempt.correct && attempt.createdAt > lastMistake).map((attempt) => localDayKey(attempt.createdAt))).size
    const last = history.map((attempt) => attempt.createdAt).sort().at(-1)!
    const next = new Date(last)
    if (goodDays) next.setDate(next.getDate() + REVIEW_INTERVALS[Math.min(goodDays, MASTERED_DAYS) - 1])
    next.setHours(0, 0, 0, 0)
    return { pair, state: goodDays >= MASTERED_DAYS ? 'mastered' : 'learning', due: next <= now, errors: history.filter((attempt) => !attempt.correct).length, answers: history.length, goodDays }
  })
}

function shuffle<T>(items: T[]) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] } return copy }

// A mixed session: pairs that are due (missed ones first), then new pairs from the easiest level.
// Two sentences per pair, so the learner has to tell the words apart, not just recognise one.
export function buildPairSession(size = 10): PairQuestion[] {
  const statuses = pairStatuses()
  const learning = statuses.filter((status) => status.state !== 'new' && status.due).sort((a, b) => b.errors - a.errors || a.goodDays - b.goodDays)
  const fresh = shuffle(statuses.filter((status) => status.state === 'new')).sort((a, b) => levelOrder[a.pair.level] - levelOrder[b.pair.level])
  const later = shuffle(statuses.filter((status) => status.state !== 'new' && !status.due))
  const chosen = [...learning, ...fresh, ...later].slice(0, Math.ceil(size / 2))
  return shuffle(chosen.flatMap((status) => shuffle(status.pair.sentences).slice(0, 2).map((sentence) => ({ pair: status.pair, sentence })))).slice(0, size)
}

export function pairQuestions(pairId: string): PairQuestion[] {
  const pair = pairDrills.find((item) => item.id === pairId)
  return pair ? shuffle(pair.sentences).map((sentence) => ({ pair, sentence })) : []
}
