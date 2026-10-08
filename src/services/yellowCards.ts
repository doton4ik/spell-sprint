// A yellow card: a possible mistake, not a sure one — a misspelling the learner did not notice in
// someone else's text (Proofreading), or a word mistyped against the clock (Sprint). Neither is the same
// as misspelling a word in calm practice, so it is not counted as a mistake: My Mistakes shows it in its own list, and nothing else (accuracy, review dates,
// patterns) changes. The same word missed a second time is a red card — a real mistake.
export type YellowCard = {
  id: string
  word: string // the correct word
  shown: string // the slip that was not noticed
  wordId?: string // when the word is in a library
  source: 'proofreading' | 'sprint'
  where: string // the text title, or "Sprint"
  at: string
  escalated?: boolean // a second card turned it into a real mistake
}

const KEY = 'spell-sprint.yellow-cards'
const MAX = 300
const EVENT = 'spell-sprint:learning-updated'

function read(): YellowCard[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? (value.filter(isCard) as YellowCard[]) : []
  } catch {
    return []
  }
}
function write(cards: YellowCard[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cards.slice(-MAX)))
  } catch {
    /* storage full or blocked */
  }
  window.dispatchEvent(new Event(EVENT))
}
const sameWord = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase()
function isCard(value: unknown): value is YellowCard {
  const card = value as YellowCard
  return (
    Boolean(card) &&
    typeof card.id === 'string' &&
    typeof card.word === 'string' &&
    typeof card.shown === 'string' &&
    typeof card.at === 'string'
  )
}

/** Open yellow cards, newest first. */
export function getYellowCards(): YellowCard[] {
  return read()
    .filter((card) => !card.escalated)
    .sort((a, b) => b.at.localeCompare(a.at))
}

/** Adds a card; returns 'red' when the same word already had an open card (both are closed then). */
export function addYellowCard(card: Omit<YellowCard, 'id' | 'at' | 'escalated'>): 'yellow' | 'red' {
  const cards = read()
  const earlier = cards.find((item) => !item.escalated && sameWord(item.word, card.word))
  const added: YellowCard = { ...card, id: crypto.randomUUID(), at: new Date().toISOString(), escalated: Boolean(earlier) }
  write([...cards.map((item) => (earlier && item.id === earlier.id ? { ...item, escalated: true } : item)), added])
  return earlier ? 'red' : 'yellow'
}

/** The learner has seen it and wants it gone. */
export function dismissYellowCard(id: string) {
  write(read().map((card) => (card.id === id ? { ...card, escalated: true } : card)))
}

/** Cloud restore: cards from another device are added (by id); a closed card stays closed. */
export function mergeYellowCards(incoming: unknown) {
  if (!Array.isArray(incoming)) return 0
  const local = read()
  const byId = new Map(local.map((card) => [card.id, card]))
  let added = 0
  for (const raw of incoming) {
    if (!isCard(raw)) continue
    const card: YellowCard = {
      id: raw.id.slice(0, 80),
      word: raw.word.slice(0, 100),
      shown: raw.shown.slice(0, 100),
      wordId: typeof raw.wordId === 'string' ? raw.wordId.slice(0, 200) : undefined,
      source: raw.source === 'sprint' ? 'sprint' : 'proofreading',
      where: typeof raw.where === 'string' ? raw.where.slice(0, 120) : '',
      at: raw.at.slice(0, 40),
      escalated: raw.escalated === true,
    }
    const existing = byId.get(card.id)
    if (!existing) {
      byId.set(card.id, card)
      added += 1
    } else if (card.escalated && !existing.escalated) byId.set(card.id, { ...existing, escalated: true })
  }
  const merged = [...byId.values()].sort((a, b) => a.at.localeCompare(b.at))
  if (JSON.stringify(merged) !== JSON.stringify(local)) write(merged)
  return added
}

export const getAllYellowCards = () => read()
