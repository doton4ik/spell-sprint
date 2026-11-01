// Cuts a recognised speech (every word with the second it starts and ends at, from scripts/transcribe.py) into
// short lines for listening dictation. Used by scripts/make-clip.mjs, which Node runs straight from this file:
// keep it free of imports.
export type TimedWord = { w: string; s: number; e: number }
// wordStarts: the second each word of `text` starts at, so the page can light up the word being said
export type WordLine = { text: string; start: number; end: number; wordStarts: number[] }

const LEAD = 0.15 // the line starts a little before its first word
const TAIL = 0.3 // and ends a little after its last one, so the last word is not cut
const PAUSE = 0.45 // a silence this long is a good place to cut
const PROMO = /subscribe|follow us|bbclearningenglish|app store|google play|www\.|\.com|\.org/i

const endsSentence = (word: string) => /[.?!]["')\]]*$/.test(word)
const endsClause = (word: string) => /[,;:]["')\]]*$/.test(word)

// A line is cut after a sentence end (once it has `minWords`), at a long pause or a comma (once it is two thirds full),
// and at `maxWords` at the latest, at the biggest pause among the last words.
export function makeWordLines(
  words: TimedWord[],
  { minWords = 5, maxWords = 16, from = 0, to = Infinity }: { minWords?: number; maxWords?: number; from?: number; to?: number } = {},
): WordLine[] {
  const inside = words.filter((word) => word.s >= from - 0.3 && word.e <= to + 0.6)
  const groups: TimedWord[][] = []
  let current: TimedWord[] = []
  const flush = (upTo = current.length) => {
    if (upTo > 0) groups.push(current.slice(0, upTo))
    current = current.slice(upTo)
  }
  inside.forEach((word, i) => {
    current.push(word)
    const next = inside[i + 1]
    const gap = next ? next.s - word.e : Infinity
    const n = current.length
    if (endsSentence(word.w) && n >= minWords) flush()
    else if (n >= minWords && gap >= PAUSE && (endsClause(word.w) || n >= maxWords * 0.7)) flush()
    else if (n >= maxWords) {
      // cut where the speaker paused most among the last words
      let best = n
      let bestGap = -1
      for (let k = Math.ceil(n / 2); k < n; k++) {
        const g = current[k].s - current[k - 1].e + (endsClause(current[k - 1].w) ? 0.2 : 0)
        if (g > bestGap) {
          bestGap = g
          best = k
        }
      }
      flush(best)
    }
  })
  if (current.length) {
    // a short rest joins the line before it instead of standing alone
    if (current.length < minWords && groups.length) groups[groups.length - 1].push(...current)
    else groups.push(current)
  }
  return groups
    .map((group) => ({
      text: group.map((word) => word.w).join(' '),
      start: Math.max(0, Math.round((group[0].s - LEAD) * 10) / 10),
      end: Math.round((group[group.length - 1].e + TAIL) * 10) / 10,
      wordStarts: group.map((word) => Math.round(word.s * 100) / 100),
    }))
    .filter((line) => !PROMO.test(line.text))
}

// Index of the word being said at `time` (-1 before the first word)
export function wordAt(wordStarts: number[], time: number) {
  let found = -1
  for (let i = 0; i < wordStarts.length && wordStarts[i] <= time; i++) found = i
  return found
}
