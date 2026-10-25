import { sameText } from './contractions'
import { diffWords, type DiffWord } from './sentenceDiff'

// One written line of a listening dictation, checked against the line that was heard.
export type LineResult = {
  correct: boolean
  expected: DiffWord[]
  given: DiffWord[]
}

export function checkLine(expected: string, given: string): LineResult {
  // an empty answer is a miss; nothing is compared, every word of the right line is shown as missed
  if (!given.trim()) return { correct: false, expected: expected.split(/\s+/).map((text) => ({ text, same: false })), given: [] }
  const { expected: shownExpected, given: shownGiven } = diffWords(expected, given)
  return { correct: sameText(expected, given), expected: shownExpected, given: shownGiven }
}

// Score of a finished clip, as a whole percent.
export function clipScore(results: boolean[]) {
  return results.length ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0
}
