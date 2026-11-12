import { expandedWords, numberRuns } from './contractions'

// A word-by-word comparison of a written sentence with the right one, for dictation and rewriting.
// Words are compared the way the answer is checked: case, punctuation, the kind of apostrophe and
// contractions ("It's" against "It is") do not matter, so only real differences are marked. A
// letter-by-letter diff is for single words.
export type DiffWord = { text: string; same: boolean }

// Every written word, as the plain words it stands for ("It's" is it + is). A number is one plain word, its digits,
// however it is written: "forty-five", "forty five" and "45" are the same, and all its written words own it.
function parts(sentence: string, canon: (word: string) => string) {
  const words = sentence.trim().split(/\s+/).filter(Boolean)
  const single: Array<{ owner: number; word: string }> = []
  words.forEach((text, owner) =>
    expandedWords(text).forEach((expanded) =>
      expanded
        .split(' ')
        .filter(Boolean)
        .forEach((word) => single.push({ owner, word })),
    ),
  )
  const flat: Array<{ owners: number[]; word: string }> = []
  let at = 0
  for (const run of numberRuns(single.map((item) => item.word))) {
    for (const item of single.slice(at, run.from)) flat.push({ owners: [item.owner], word: canon(item.word) })
    flat.push({ owners: single.slice(run.from, run.to + 1).map((item) => item.owner), word: run.digits })
    at = run.to + 1
  }
  for (const item of single.slice(at)) flat.push({ owners: [item.owner], word: canon(item.word) })
  return { words, flat }
}

// canon: one more reading of a plain word that makes two spellings equal (Listening: "colour" and "color").
export function diffWords(
  expected: string,
  given: string,
  canon: (word: string) => string = (word) => word,
): { expected: DiffWord[]; given: DiffWord[] } {
  const a = parts(expected, canon)
  const b = parts(given, canon)
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
    unmatched.forEach((index) => side.flat[index].owners.forEach((owner) => bad.add(owner)))
    return side.words.map((text, index) => ({ text, same: !bad.has(index) }))
  }
  return { expected: differs(a, unmatchedA), given: differs(b, unmatchedB) }
}

// A single word is shown letter by letter; a sentence word by word.
export const isSentence = (text: string) => /\s/.test(text.trim())
