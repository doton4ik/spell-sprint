import { normaliseAnswer } from './levelCheck'

// A word-by-word comparison of a written sentence with the right one, for dictation and rewriting.
// Words are compared the way the answer is checked (case, punctuation and the kind of apostrophe do not
// matter), so only real differences are marked. A letter-by-letter diff is for single words.
export type DiffWord = { text: string; same: boolean }

const key = (word: string) => normaliseAnswer(word)

export function diffWords(expected: string, given: string): { expected: DiffWord[]; given: DiffWord[] } {
  const a = expected.trim().split(/\s+/).filter(Boolean)
  const b = given.trim().split(/\s+/).filter(Boolean)
  // longest common subsequence of the words
  const table = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i -= 1)
    for (let j = b.length - 1; j >= 0; j -= 1)
      table[i][j] = key(a[i]) === key(b[j]) ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
  const wantedSame = new Set<number>()
  const givenSame = new Set<number>()
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (key(a[i]) === key(b[j])) {
      wantedSame.add(i)
      givenSame.add(j)
      i += 1
      j += 1
    } else if (table[i + 1][j] >= table[i][j + 1]) i += 1
    else j += 1
  }
  return {
    expected: a.map((text, index) => ({ text, same: wantedSame.has(index) })),
    given: b.map((text, index) => ({ text, same: givenSame.has(index) })),
  }
}

// A single word is shown letter by letter; a sentence word by word.
export const isSentence = (text: string) => /\s/.test(text.trim())
