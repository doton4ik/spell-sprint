import type { LibraryWord } from '../types/library'
import { getLevelChecks } from './levelCheck'

// Which new words to show first. The learner's level (from the level check) decides how often a word comes up:
// words far below it are rare (a B2 learner does not need "sun" and "sky" every day; if they do know them, the
// first correct answer already sends them far away, see reviewSchedule), words at the level and a little above it
// come first. Without a level check, or for a word with no level (My words, imports), every word is equal.
const LEVEL_NUMBER = { A2: 1, B1: 2, B2: 3, C1: 4 } as const

// The learner's level as a number on the same scale as the words (A2 = 1 … C1 = 4), or null if there was no check yet.
export function learnerAbility(): number | null {
  try {
    const latest = getLevelChecks()[0]
    const ability = latest?.overall.ability
    return typeof ability === 'number' && Number.isFinite(ability) ? Math.min(4, Math.max(1, ability)) : null
  } catch {
    return null
  }
}

// How much a new word is wanted: 1 = normal. Below the level it is rarer, a step above it is slightly rarer too.
export function levelWeight(word: Pick<LibraryWord, 'level'>, ability: number | null): number {
  if (ability === null || !word.level) return 1
  const gap = ability - LEVEL_NUMBER[word.level] // positive: the word is below the learner's level
  if (gap >= 1.5) return 0.08
  if (gap >= 0.75) return 0.3
  if (gap > -0.75) return 1
  if (gap > -1.5) return 0.8
  return 0.5
}

// Weighted random order (each word gets key u^(1/weight), the largest keys come first). `random` gives a number in
// [0, 1) per word: a hash of the day for the daily plan (so the plan does not reshuffle on every render), Math.random
// for a free session.
export function orderFreshWords(words: LibraryWord[], ability: number | null, random: (word: LibraryWord) => number): LibraryWord[] {
  const keyed = words.map((word) => {
    const u = Math.min(1 - 1e-9, Math.max(1e-9, random(word)))
    return { word, key: u ** (1 / levelWeight(word, ability)) }
  })
  return keyed.sort((a, b) => b.key - a.key).map((item) => item.word)
}
