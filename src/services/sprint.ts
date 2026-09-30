// 60-second sprint: type as many known words as you can. It measures speed, it does not teach, so
// nothing here is written to the practice history: review dates, confidence, streaks and mistakes
// stay exactly as they were. Rounds are kept only on this device.
import type { LibraryWord } from '../types/library'
import { getAllWords } from './libraryStorage'
import { getPracticeAttempts } from './practiceStorage'
import { recognitionOnly } from './reviewSchedule'

export const SPRINT_SECONDS = 60
export const MIN_SPRINT_WORDS = 10
const ROUNDS_KEY = 'spell-sprint.sprint-rounds'
const MAX_ROUNDS = 100

export type SprintAnswer = { wordId: string; word: string; typed: string; correct: boolean; recallMs: number; typeMs: number }
export type SprintRound = { date: string; correct: number; misses: number; answers: SprintAnswer[] }

// Words the learner has already typed correctly (not just picked from four), with no mistake since.
// If there are fewer than ten, easy words from the base library fill the pool, so a new learner can
// play too; those rounds say so.
export function sprintPool(): { words: LibraryWord[]; fromHistory: number } {
  const words = getAllWords()
  const byId = new Map(words.map((word) => [word.wordId, word]))
  const lastTyped = new Map<string, boolean>()
  for (const attempt of getPracticeAttempts()) { // newest first
    if (!attempt.wordId || lastTyped.has(attempt.wordId) || !byId.has(attempt.wordId)) continue
    if (!attempt.isCorrect) { lastTyped.set(attempt.wordId, false); continue }
    if (!recognitionOnly(attempt.attemptMode)) lastTyped.set(attempt.wordId, true)
  }
  const known = [...lastTyped].filter(([, ok]) => ok).map(([id]) => byId.get(id)!)
  if (known.length >= MIN_SPRINT_WORDS) return { words: shuffle(known), fromHistory: known.length }
  const fill = shuffle(words.filter((word) => word.difficulty === 'easy' && !lastTyped.has(word.wordId) && !word.word.includes(' ')))
  return { words: [...shuffle(known), ...fill].slice(0, 40), fromHistory: known.length }
}

function shuffle<T>(items: T[]) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] } return copy }

export const sprintCorrect = (typed: string, word: string) => typed.trim().toLocaleLowerCase() === word.trim().toLocaleLowerCase()

export function getSprintRounds(): SprintRound[] {
  try { const value = JSON.parse(window.localStorage.getItem(ROUNDS_KEY) ?? '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
export function saveSprintRound(round: SprintRound) {
  try { window.localStorage.setItem(ROUNDS_KEY, JSON.stringify([round, ...getSprintRounds()].slice(0, MAX_ROUNDS))) } catch { /* the result is still shown */ }
}
export function bestSprint(rounds = getSprintRounds()) { return rounds.reduce((best, round) => Math.max(best, round.correct), 0) }

// Words typed noticeably slower than the learner's own pace in this round (per letter, over 1.5× the
// median). Only typing time counts: the pause before the first key is remembering, not spelling.
export function slowWords(answers: SprintAnswer[]) {
  const done = answers.filter((answer) => answer.correct && answer.typeMs > 0)
  if (done.length < 6) return []
  const perLetter = done.map((answer) => answer.typeMs / answer.word.length).sort((a, b) => a - b)
  const median = perLetter[Math.floor(perLetter.length / 2)]
  return done.filter((answer) => answer.typeMs / answer.word.length > median * 1.5)
}
