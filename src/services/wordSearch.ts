// One search for the Library page: exact word, prefix, part of a word, the Russian translation, and
// misspelled input. A misspelling is found two ways: the 3-letter pieces ("trigrams") the typed word shares
// with a library word, and a small edit distance (one wrong, missing, extra or swapped letter is 1).
import type { LibraryWord } from '../types/library'

// 'form': the typed word is a form of this one ("hooked up" → hook up, "studies" → study, "went" → go)
export type WordHitKind = 'exact' | 'form' | 'prefix' | 'contains' | 'translation' | 'close'
export type WordHit = { word: LibraryWord; kind: WordHitKind; score: number }
// hasExact: the word exactly as typed is in the libraries (a form of another word can still be added as it is)
export type WordSearchResult = { matches: WordHit[]; close: WordHit[]; hasExact: boolean }

type Entry = { word: LibraryWord; text: string; translation: string; trigrams: Set<string> }
export type WordIndex = { entries: Entry[]; byTrigram: Map<string, number[]> }

// Lower case, single spaces, one kind of apostrophe; a hyphen is a space ("check-in" = "check in").
export const normaliseQuery = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[-‐‑–—]/g, ' ')
    .replace(/\s+/g, ' ')

// Common irregular forms → the word a dictionary lists them under.
const IRREGULAR: Record<string, string> = {
  am: 'be',
  are: 'be',
  ate: 'eat',
  became: 'become',
  been: 'be',
  began: 'begin',
  begun: 'begin',
  bought: 'buy',
  broke: 'break',
  broken: 'break',
  brought: 'bring',
  built: 'build',
  came: 'come',
  caught: 'catch',
  children: 'child',
  chose: 'choose',
  chosen: 'choose',
  did: 'do',
  done: 'do',
  drank: 'drink',
  drove: 'drive',
  driven: 'drive',
  eaten: 'eat',
  fell: 'fall',
  fallen: 'fall',
  feet: 'foot',
  felt: 'feel',
  flew: 'fly',
  forgot: 'forget',
  forgotten: 'forget',
  found: 'find',
  gave: 'give',
  given: 'give',
  gone: 'go',
  got: 'get',
  grew: 'grow',
  had: 'have',
  heard: 'hear',
  held: 'hold',
  is: 'be',
  kept: 'keep',
  knew: 'know',
  known: 'know',
  knives: 'knife',
  leaves: 'leaf',
  led: 'lead',
  left: 'leave',
  lives: 'life',
  lost: 'lose',
  made: 'make',
  meant: 'mean',
  men: 'man',
  met: 'meet',
  mice: 'mouse',
  paid: 'pay',
  ran: 'run',
  rode: 'ride',
  rose: 'rise',
  said: 'say',
  sang: 'sing',
  sat: 'sit',
  saw: 'see',
  seen: 'see',
  sent: 'send',
  slept: 'sleep',
  sold: 'sell',
  spent: 'spend',
  spoke: 'speak',
  spoken: 'speak',
  stood: 'stand',
  taken: 'take',
  taught: 'teach',
  teeth: 'tooth',
  thought: 'think',
  threw: 'throw',
  told: 'tell',
  took: 'take',
  understood: 'understand',
  was: 'be',
  went: 'go',
  were: 'be',
  wives: 'wife',
  woke: 'wake',
  women: 'woman',
  won: 'win',
  wore: 'wear',
  wrote: 'write',
  written: 'write',
}

// The words a typed form may come from: "studies" → study, "stopped" → stop, "making" → make, "went" → go.
// They are guesses; a guess counts only when the library really has that word.
// Words that only look like a form of another word: "news" is not "new", "evening" is not "even".
const NOT_A_FORM = new Set([
  'news',
  'goods',
  'clothes',
  'species',
  'series',
  'means',
  'shed',
  'seed',
  'feed',
  'need',
  'evening',
  'morning',
  'during',
  'ceiling',
  'nothing',
  'something',
  'anything',
  'everything',
])

function baseForms(word: string): string[] {
  if (NOT_A_FORM.has(word)) return []
  const found: string[] = []
  if (Object.hasOwn(IRREGULAR, word)) found.push(IRREGULAR[word])
  const cut = (ending: string, ...replacements: string[]) => {
    if (word.length > ending.length + 1 && word.endsWith(ending))
      for (const replacement of replacements) found.push(word.slice(0, -ending.length) + replacement)
  }
  cut('ies', 'y')
  cut('ied', 'y')
  cut('es', '', 'e')
  cut('s', '')
  cut('ed', '', 'e')
  cut('ing', '', 'e')
  // a doubled last letter: stopped → stop, running → run
  const single = found.filter((form) => /([b-df-hj-np-tv-z])\1$/.test(form)).map((form) => form.slice(0, -1))
  return [...new Set([...found, ...single])].filter((form) => form.length >= 2 && form !== word)
}

// A phrase is a form of another when its first word is ("hooked up" → hook up, "looking forward to" → look forward to).
export function queryBaseForms(query: string): string[] {
  const [first, ...rest] = query.split(' ')
  return baseForms(first).map((form) => [form, ...rest].join(' '))
}

// "cat" → " ca", "cat", "at ": the spaces let short words and the start and end of a word count.
export function trigrams(text: string) {
  const padded = ` ${text} `
  const set = new Set<string>()
  for (let index = 0; index + 3 <= padded.length; index++) set.add(padded.slice(index, index + 3))
  return set
}

// Edit distance where swapping two neighbouring letters costs 1 ("recieve" → "receive").
export function editDistance(a: string, b: string) {
  const rows: number[][] = []
  for (let i = 0; i <= a.length; i++) {
    rows[i] = [i]
    for (let j = 1; j <= b.length; j++) {
      if (i === 0) {
        rows[i][j] = j
        continue
      }
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let best = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) best = Math.min(best, rows[i - 2][j - 2] + 1)
      rows[i][j] = best
    }
  }
  return rows[a.length][b.length]
}

export function buildWordIndex(words: LibraryWord[]): WordIndex {
  const byTrigram = new Map<string, number[]>()
  const entries = words.map((word, position) => {
    const text = normaliseQuery(word.word)
    const set = trigrams(text)
    for (const piece of set) {
      const list = byTrigram.get(piece)
      if (list) list.push(position)
      else byTrigram.set(piece, [position])
    }
    return { word, text, translation: normaliseQuery(word.translation), trigrams: set }
  })
  return { entries, byTrigram }
}

const allowedEdits = (length: number) => (length <= 3 ? 0 : length <= 5 ? 1 : 2)

export function searchWords(index: WordIndex, rawQuery: string, limit = 30, closeLimit = 4): WordSearchResult {
  const query = normaliseQuery(rawQuery)
  const result: WordSearchResult = { matches: [], close: [], hasExact: false }
  if (query.length < 2) return result
  const forms = new Set(queryBaseForms(query))
  const matched = new Set<number>()
  index.entries.forEach((entry, position) => {
    let kind: WordHitKind | null = null
    let score = 0
    if (entry.text === query) [kind, score] = ['exact', 100]
    else if (forms.has(entry.text)) [kind, score] = ['form', 95]
    else if (entry.text.startsWith(query)) [kind, score] = ['prefix', 80 - Math.min(entry.text.length - query.length, 30)]
    else if (entry.text.includes(query)) [kind, score] = ['contains', 50]
    else if (entry.translation.includes(query)) [kind, score] = ['translation', 40]
    if (!kind) return
    matched.add(position)
    result.matches.push({ word: entry.word, kind, score })
    if (kind === 'exact') result.hasExact = true
  })
  // the typed word itself is in the libraries: it is not a form of something else ("meeting" is there, so no "meet")
  if (result.hasExact) result.matches = result.matches.filter((hit) => hit.kind !== 'form')
  result.matches.sort((a, b) => b.score - a.score || a.word.word.length - b.word.word.length)
  result.matches = result.matches.slice(0, limit)
  if (result.hasExact) return result

  const maxEdits = allowedEdits(query.length)
  if (query.length >= 4) {
    const queryTrigrams = trigrams(query)
    const shared = new Map<number, number>()
    for (const piece of queryTrigrams)
      for (const position of index.byTrigram.get(piece) ?? []) shared.set(position, (shared.get(position) ?? 0) + 1)
    const seen = new Set<string>()
    const close: WordHit[] = []
    for (const [position, count] of shared) {
      const entry = index.entries[position]
      if (matched.has(position) || seen.has(entry.text)) continue
      const jaccard = count / (queryTrigrams.size + entry.trigrams.size - count)
      const edits = Math.abs(entry.text.length - query.length) <= maxEdits ? editDistance(query, entry.text) : Infinity
      if (edits > maxEdits && jaccard < 0.4) continue
      seen.add(entry.text)
      close.push({ word: entry.word, kind: 'close', score: edits <= maxEdits ? 100 - edits * 10 + jaccard * 10 : jaccard * 50 })
    }
    close.sort((a, b) => b.score - a.score || a.word.word.length - b.word.word.length)
    result.close = close.slice(0, closeLimit)
  }
  return result
}
