import { expandedWords } from './contractions'

// A word-by-word comparison of a written sentence with the right one, for dictation and rewriting.
// Words are compared the way the answer is checked: case, punctuation, the kind of apostrophe and
// contractions ("It's" against "It is") do not matter, so only real differences are marked. A
// letter-by-letter diff is for single words.
export type DiffWord = { text: string; same: boolean }

// Every written word, as the plain words it stands for ("It's" is it + is).
function parts(sentence: string) {
  const words = sentence.trim().split(/\s+/).filter(Boolean)
  const flat: Array<{ owner: number; word: string }> = []
  words.forEach((text, owner) => expandedWords(text).forEach((word) => word && flat.push({ owner, word })))
  return { words, flat }
}

export function diffWords(expected: string, given: string): { expected: DiffWord[]; given: DiffWord[] } {
  const a = parts(expected)
  const b = parts(given)
  // longest common subsequence of the plain words
  const table = Array.from({ length: a.flat.length + 1 }, () => Array<number>(b.flat.length + 1).fill(0))
  for (let i = a.flat.length - 1; i >= 0; i -= 1)
    for (let j = b.flat.length - 1; j >= 0; j -= 1)
      table[i][j] = a.flat[i].word === b.flat[j].word ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
  const unmatchedA = new Set(a.flat.map((_, index) => index))
  const unmatchedB = new Set(b.flat.map((_, index) => index))
  let i = 0
  let j = 0
  while (i < a.flat.length && j < b.flat.length) {
    if (a.flat[i].word === b.flat[j].word) {
      unmatchedA.delete(i)
      unmatchedB.delete(j)
      i += 1
      j += 1
    } else if (table[i + 1][j] >= table[i][j + 1]) i += 1
    else j += 1
  }
  // a written word is "the same" when all the plain words it stands for were matched
  const differs = (side: typeof a, unmatched: Set<number>) => {
    const bad = new Set<number>()
    unmatched.forEach((index) => bad.add(side.flat[index].owner))
    return side.words.map((text, index) => ({ text, same: !bad.has(index) }))
  }
  return { expected: differs(a, unmatchedA), given: differs(b, unmatchedB) }
}

// A single word is shown letter by letter; a sentence word by word.
export const isSentence = (text: string) => /\s/.test(text.trim())
