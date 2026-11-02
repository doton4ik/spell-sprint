// One search for the Library page: exact word, prefix, part of a word, the Russian translation, and
// misspelled input. A misspelling is found two ways: the 3-letter pieces ("trigrams") the typed word shares
// with a library word, and a small edit distance (one wrong, missing, extra or swapped letter is 1).
import type { LibraryWord } from '../types/library'

export type WordHitKind = 'exact' | 'prefix' | 'contains' | 'translation' | 'close'
export type WordHit = { word: LibraryWord; kind: WordHitKind; score: number }
export type WordSearchResult = { matches: WordHit[]; close: WordHit[]; hasExact: boolean }

type Entry = { word: LibraryWord; text: string; translation: string; trigrams: Set<string> }
export type WordIndex = { entries: Entry[]; byTrigram: Map<string, number[]> }

export const normaliseQuery = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')

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
  const matched = new Set<number>()
  index.entries.forEach((entry, position) => {
    let kind: WordHitKind | null = null
    let score = 0
    if (entry.text === query) [kind, score] = ['exact', 100]
    else if (entry.text.startsWith(query)) [kind, score] = ['prefix', 80 - Math.min(entry.text.length - query.length, 30)]
    else if (entry.text.includes(query)) [kind, score] = ['contains', 50]
    else if (entry.translation.includes(query)) [kind, score] = ['translation', 40]
    if (!kind) return
    matched.add(position)
    result.matches.push({ word: entry.word, kind, score })
    if (kind === 'exact') result.hasExact = true
  })
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
