// "It's" and "It is" are the same sentence, and so are "don't" / "do not" and "can't" / "cannot". A typed
// sentence is compared with the right one through these helpers, so a contraction (or its long form) is
// never a mistake. Words that only look alike are kept apart: "its" is not "it's".

// Lower case, one kind of apostrophe, no punctuation or hyphens, single spaces.
export const plain = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.!?,;:"“”()]+/g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const IRREGULAR: Record<string, string[][]> = {
  "can't": [['can', 'not']],
  cannot: [['can', 'not']],
  "won't": [['will', 'not']],
  "shan't": [['shall', 'not']],
  "let's": [['let', 'us']],
  "ain't": [
    ['is', 'not'],
    ['are', 'not'],
    ['am', 'not'],
  ],
}

// Every way one (plain) word can be written out in full. 's and 'd are ambiguous (is / has, would / had), and an
// 's can also be a possessive, so the word itself is one of the options.
// Small numbers are the same written as digits or as words (the word comes first: it is the plain reading).
const NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
]

export function expandWord(word: string): string[][] {
  if (/^d{1,2}$/.test(word) && Number(word) < NUMBER_WORDS.length) return [[NUMBER_WORDS[Number(word)]], [word]]
  const number = NUMBER_WORDS.indexOf(word)
  if (number >= 0) return [[word], [String(number)]]
  if (IRREGULAR[word]) return IRREGULAR[word]
  if (word.endsWith("n't") && word.length > 3) return [[word.slice(0, -3), 'not']]
  if (word.endsWith("'re") && word.length > 3) return [[word.slice(0, -3), 'are']]
  if (word.endsWith("'m") && word.length > 2) return [[word.slice(0, -2), 'am']]
  if (word.endsWith("'ve") && word.length > 3) return [[word.slice(0, -3), 'have']]
  if (word.endsWith("'ll") && word.length > 3) return [[word.slice(0, -3), 'will']]
  if (word.endsWith("'s") && word.length > 2) return [[word.slice(0, -2), 'is'], [word.slice(0, -2), 'has'], [word]]
  if (word.endsWith("'d") && word.length > 2)
    return [
      [word.slice(0, -2), 'would'],
      [word.slice(0, -2), 'had'],
    ]
  return [[word]]
}

const MAX_VARIANTS = 32

// All the plain texts a sentence can be read as, with contractions written out in full.
export function variants(text: string): string[] {
  let result: string[][] = [[]]
  for (const word of plain(text).split(' ').filter(Boolean)) {
    const options = expandWord(word)
    const next: string[][] = []
    for (const base of result) for (const option of options) next.push([...base, ...option])
    result = next.length > MAX_VARIANTS ? next.slice(0, MAX_VARIANTS) : next
  }
  return [...new Set(result.map((words) => words.join(' ')))]
}

// The same sentence, whether or not it uses contractions.
export function sameText(a: string, b: string) {
  const other = new Set(variants(b))
  return variants(a).some((text) => other.has(text))
}

// The words of a sentence with contractions written out (one reading of each), for comparing word by word.
export function expandedWords(word: string): string[] {
  return expandWord(plain(word))[0]
}
