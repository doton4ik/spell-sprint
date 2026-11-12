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
    .replace(/[-–—]/g, ' ')
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
  if (/^\d{1,2}$/.test(word) && Number(word) < NUMBER_WORDS.length) return [[NUMBER_WORDS[Number(word)]], [word]]
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

// ---- Numbers of any size --------------------------------------------------------------------------
// "forty", "40"; "seventy-five", "75"; "two thousand", "2,000", "2000"; "a hundred and ten", "110"; a year said in two
// halves, "twenty sixteen", "2016". A run of number words is read as one number and compared as digits.
const TENS = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const SCALE_OF: Record<string, number> = { thousand: 1000, million: 1000000 }
// 0 for a word that is not "thousand" or "million" (an own-key check: "constructor" is not a scale)
const scale = (word: string | undefined) => (word !== undefined && Object.hasOwn(SCALE_OF, word) ? SCALE_OF[word] : 0)
const small = (word: string) => NUMBER_WORDS.indexOf(word) // 0-20, -1 for anything else
const tens = (word: string) => (TENS.indexOf(word) + 2) * 10 // 20-90, 10 for anything else
const isNumberWord = (word: string | undefined) =>
  word !== undefined && (small(word) >= 0 || tens(word) > 10 || word === 'hundred' || scale(word) > 0)

// A number below a hundred that starts at `at`: [value, words used], or null. "twenty five" is 25.
function belowHundred(words: string[], at: number): [number, number] | null {
  const first = words[at]
  if (first === undefined) return null
  if (tens(first) > 10) {
    const unit = small(words[at + 1] ?? '')
    return unit >= 1 && unit <= 9 ? [tens(first) + unit, 2] : [tens(first), 1]
  }
  return small(first) >= 0 ? [small(first), 1] : null
}

// The number that starts at `at`, written in words (or digits followed by a word like "thousand"): [digits, words used].
function numberAt(words: string[], at: number): [string, number] | null {
  let i = at
  let total = 0
  let current = 0
  let any = false
  const first = words[i]
  if (first === 'a' && (words[i + 1] === 'hundred' || scale(words[i + 1]) > 0)) {
    current = 1
    i += 1
  } else if (/^\d+$/.test(first) && (words[i + 1] === 'hundred' || scale(words[i + 1]) > 0)) {
    current = Number(first)
    i += 1
  } else {
    const start = belowHundred(words, i)
    if (!start) return null
    current = start[0]
    i += start[1]
    any = true
    // a year said in two halves: "nineteen ninety", "twenty sixteen", "twenty twenty five"
    const second = current >= 10 ? belowHundred(words, i) : null
    if (second && second[0] >= 10) return [String(current * 100 + second[0]), i + second[1] - at]
  }
  for (;;) {
    const word = words[i]
    if (word === 'hundred' && current > 0 && current < 100) {
      current *= 100
      i += 1
      any = true
      // "three hundred and fifty", "three hundred fifty"
      const skip = words[i] === 'and' ? 1 : 0
      const rest = belowHundred(words, i + skip)
      // not "three hundred and five hundred": that is two numbers
      if (rest && rest[0] > 0 && words[i + skip + rest[1]] !== 'hundred') {
        current += rest[0]
        i += rest[1] + skip
      }
    } else if (scale(word) > 0 && current > 0) {
      const size = scale(word)
      total += current * size
      current = 0
      i += 1
      any = true
      // "two thousand and sixteen", "one million two hundred thousand": what follows belongs to this number only when
      // it is smaller than the word just read ("two thousand and three thousand" is two numbers)
      const skip = words[i] === 'and' && isNumberWord(words[i + 1]) ? 1 : 0
      const rest = numberAt(words, i + skip)
      if (rest && Number(rest[0]) > 0 && Number(rest[0]) < size) {
        total += Number(rest[0])
        i += rest[1] + skip
      }
      break
    } else break
  }
  return any ? [String(total + current), i - at] : null
}

// Where the numbers written in words are: the first and last word of each and its digits.
export function numberRuns(words: string[]): Array<{ from: number; to: number; digits: string }> {
  const runs: Array<{ from: number; to: number; digits: string }> = []
  for (let i = 0; i < words.length; i += 1) {
    const found = numberAt(words, i)
    if (!found) continue
    runs.push({ from: i, to: i + found[1] - 1, digits: found[0] })
    i += found[1] - 1
  }
  return runs
}

// The same words with every number written as digits ("in forty five minutes" -> "in 45 minutes").
export function numbersAsDigits(words: string[]): string[] {
  const result: string[] = []
  let at = 0
  for (const run of numberRuns(words)) {
    result.push(...words.slice(at, run.from), run.digits)
    at = run.to + 1
  }
  return [...result, ...words.slice(at)]
}

const MAX_VARIANTS = 32

// All the plain texts a sentence can be read as, with contractions written out in full and numbers as digits.
export function variants(text: string): string[] {
  let result: string[][] = [[]]
  for (const word of numbersAsDigits(plain(text).split(' ').filter(Boolean))) {
    const options = /^\d+$/.test(word) ? [[word]] : expandWord(word)
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
