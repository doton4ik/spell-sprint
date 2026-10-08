// 60-second sprint: type as many known words as you can. It measures speed, it does not teach, so
// a correct answer is not written to the practice history. A miss against the clock is a yellow card
// in My Mistakes (yellowCards.ts); the same word missed a second time becomes a real mistake.
// Rounds are part of the cloud backup (cloudSync.ts) and merged by their start time.
import type { LibraryWord } from '../types/library'
import { getAllWords } from './libraryStorage'
import { getPracticeAttempts } from './practiceStorage'
import { recognitionOnly, scheduleAfterAnswer } from './reviewSchedule'
import { savePracticeAttempt } from './practiceStorage'
import { addYellowCard } from './yellowCards'
import { comparable } from './answerMatch'
import { hasOpenMistake } from './learningData'

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
  for (const attempt of getPracticeAttempts()) {
    // newest first
    if (!attempt.wordId || lastTyped.has(attempt.wordId) || !byId.has(attempt.wordId)) continue
    if (!attempt.isCorrect) {
      lastTyped.set(attempt.wordId, false)
      continue
    }
    if (!recognitionOnly(attempt.attemptMode)) lastTyped.set(attempt.wordId, true)
  }
  const known = [...lastTyped].filter(([, ok]) => ok).map(([id]) => byId.get(id)!)
  if (known.length >= MIN_SPRINT_WORDS) return { words: shuffle(known), fromHistory: known.length }
  const fill = shuffle(words.filter((word) => word.difficulty === 'easy' && !lastTyped.has(word.wordId) && !word.word.includes(' ')))
  return { words: [...shuffle(known), ...fill].slice(0, 40), fromHistory: known.length }
}

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// The same matching as Practice: any accepted answer (autumn / fall), and spaces, hyphens, case and
// a final full stop do not matter.
export const sprintCorrect = (typed: string, word: Pick<LibraryWord, 'word' | 'alternatives'>) =>
  [word.word, ...(word.alternatives ?? [])].map(comparable).includes(comparable(typed))

export function getSprintRounds(): SprintRound[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(ROUNDS_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}
export function saveSprintRound(round: SprintRound) {
  try {
    window.localStorage.setItem(ROUNDS_KEY, JSON.stringify([round, ...getSprintRounds()].slice(0, MAX_ROUNDS)))
  } catch {
    /* the result is still shown */
  }
}
// Adds rounds from another device (matched by their start time); broken records are dropped.
export function mergeSprintRounds(raw: unknown) {
  if (!Array.isArray(raw)) return 0
  const local = getSprintRounds()
  const known = new Set(local.map((round) => round.date))
  const fresh: SprintRound[] = []
  for (const item of raw) {
    const round = sanitizeRound(item)
    if (round && !known.has(round.date)) {
      known.add(round.date)
      fresh.push(round)
    }
  }
  if (!fresh.length) return 0
  const merged = [...local, ...fresh].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_ROUNDS)
  window.localStorage.setItem(ROUNDS_KEY, JSON.stringify(merged))
  return fresh.length
}
const count = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0)
const short = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : '')
function sanitizeRound(raw: unknown): SprintRound | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  if (typeof item.date !== 'string' || Number.isNaN(Date.parse(item.date))) return null
  const answers = (Array.isArray(item.answers) ? item.answers : [])
    .slice(0, 200)
    .filter((answer): answer is Record<string, unknown> => Boolean(answer) && typeof answer === 'object')
    .map((answer) => ({
      wordId: short(answer.wordId, 200),
      word: short(answer.word, 100),
      typed: short(answer.typed, 100),
      correct: answer.correct === true,
      recallMs: count(answer.recallMs),
      typeMs: count(answer.typeMs),
    }))
    .filter((answer) => answer.word)
  return { date: item.date, correct: count(item.correct), misses: count(item.misses), answers }
}

export function bestSprint(rounds = getSprintRounds()) {
  return rounds.reduce((best, round) => Math.max(best, round.correct), 0)
}

// Words typed noticeably slower than the learner's own pace in this round (per letter, over 1.5× the
// median). Only typing time counts: the pause before the first key is remembering, not spelling.
export function slowWords(answers: SprintAnswer[]) {
  const done = answers.filter((answer) => answer.correct && answer.typeMs > 0)
  if (done.length < 6) return []
  const perLetter = done.map((answer) => answer.typeMs / answer.word.length).sort((a, b) => a - b)
  const median = perLetter[Math.floor(perLetter.length / 2)]
  return done.filter((answer) => answer.typeMs / answer.word.length > median * 1.5)
}

export function recordSprintMiss(word: LibraryWord, typed: string) {
  if (hasOpenMistake(word.word)) return // already in My Mistakes
  if (addYellowCard({ word: word.word, shown: typed.trim() || '—', wordId: word.wordId, source: 'sprint', where: 'Sprint' }) === 'yellow')
    return
  const taskId = `library-${word.wordId}-write-en`
  const { confidence, nextReviewAt } = scheduleAfterAnswer({ wordId: word.wordId, taskId }, false, false, 'write-en')
  savePracticeAttempt({
    id: crypto.randomUUID(),
    taskId,
    taskType: 'translate-ru-en',
    topic: word.topic,
    topicId: word.topicId,
    subtopic: word.subtopic,
    wordId: word.wordId,
    library: 'Sprint',
    userAnswer: typed.trim().slice(0, 500),
    correctAnswer: word.word,
    isCorrect: false,
    wasSkipped: false,
    wasAnswerRevealed: false,
    hintUsed: false,
    attemptMode: 'write-en',
    errorType: 'unknown',
    confidence,
    nextReviewAt,
    needsReview: true,
    errorCategory: 'General spelling',
    createdAt: new Date().toISOString(),
  })
}
