// Finds gap sentences for Pairs in Tatoeba (CC BY 2.0 FR).
// node tatoeba-pairs.mjs their,there,they're borrow,lend   → candidates per pair (or "all": every pair in pairDrills.ts)
// Setup: download https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2,
// unpack it to research/tatoeba/eng_sentences.tsv, then run from the project root:
//   node research/tatoeba-pairs.mjs all   (writes research/tatoeba-candidates.json)
import { createReadStream, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const PER_WORD = Number(process.env.PER_WORD ?? 8)
let groups = process.argv.slice(2).map((arg) => arg.split(','))
if (groups[0]?.[0] === 'all') {
  const src = readFileSync('src/data/pairDrills.ts', 'utf8')
  groups = [...src.matchAll(/words: \[([^\]]*)\]/g)].map((m) => [...m[1].matchAll(/(["'])((?:\\.|(?!\1).)*)\1/g)].map((w) => w[2].replace(/\\'/g, "'")))
}

// American spellings and Tatoeba's stock characters make a sentence a poor model for this app.
const american = /\b(color|colors|favorite|center|centers|organize\w*|realize\w*|recognize\w*|apologize\w*|theater|neighbor\w*|honor\w*|behavior|traveled|traveling|gray|mom|vacation|apartment|cookie|candy|gotten|soccer|cellphone|trash|garbage|elevator|downtown|sidewalk|movie|movies|practice\w* (?:the|my|your|his|her|every))\b/i
const names = /\b(Tom|Mary|Sami|Layla|Ziri|Skura|Rima|Yanni|Mennad|Baya|Muiriel|John|Jim|Bob|Ken)\b/
const stock = /\b(do|did|doing) (that|this|it)( again)?[.?!]$/i
const tokens = (text) => text.toLowerCase().replace(/’/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? []

const lines = []
const freq = new Map()
const rl = createInterface({ input: createReadStream(join(here, 'tatoeba', 'eng_sentences.tsv'), 'utf8'), crlfDelay: Infinity })
for await (const line of rl) {
  const parts = line.split('\t'); const id = parts[0]; const text = (parts[2] ?? '').replace(/’/g, "'")
  const words = tokens(text)
  for (const word of new Set(words)) freq.set(word, (freq.get(word) ?? 0) + 1)
  if (words.length < 6 || words.length > 14) continue
  if (!/^[A-Z']/.test(text) || !/[.?!]$/.test(text) || /[0-9;:()[\]"]/.test(text) || names.test(text) || american.test(text) || stock.test(text)) continue
  lines.push({ id, text, words })
}

const wordRe = (word) => new RegExp(`(^|[^A-Za-z'])(${word.replace(/ /g, '\\s+')})(?=[^A-Za-z']|$)`, 'gi')
const result = {}
for (const group of groups) {
  const picks = {}
  const pairWords = new Set(group.flatMap((item) => tokens(item)))
  for (const word of group) {
    const others = group.filter((other) => other !== word)
    const seen = new Set()
    const candidates = []
    for (const { id, text, words } of lines) {
      const hits = [...text.matchAll(wordRe(word))]
      if (hits.length !== 1) continue
      if (others.some((other) => wordRe(other).test(text))) continue
      // Simple words only: every other word must be common in the corpus ("loose" itself may be rare).
      const rest = words.filter((item) => !pairWords.has(item))
      const rarest = rest.length ? Math.min(...rest.map((item) => freq.get(item) ?? 0)) : 0
      if (rarest < 300) continue
      const key = words.filter((item) => item !== word).slice(0, 3).join(' ')
      if (seen.has(key)) continue
      seen.add(key)
      const hit = hits[0]
      const start = hit.index + hit[1].length
      const gap = text.slice(0, start) + '___' + text.slice(start + hit[2].length)
      candidates.push({ id, text: gap, answer: word, score: rarest, length: words.length })
    }
    // Prefer 8–11 word sentences with common words; take a spread of them, not only the top.
    candidates.sort((a, b) => Math.abs(a.length - 9) - Math.abs(b.length - 9) || b.score - a.score)
    const top = candidates.slice(0, PER_WORD * 6)
    const count = Math.min(PER_WORD, top.length)
    picks[word] = { found: candidates.length, sample: Array.from({ length: count }, (_, index) => top[Math.floor((index * top.length) / count)]) }
  }
  result[group.join(' / ')] = picks
}
writeFileSync(join(here, 'tatoeba-candidates.json'), JSON.stringify(result, null, 1))
for (const [pair, picks] of Object.entries(result)) {
  console.log(`\n=== ${pair}`)
  for (const [word, { found, sample }] of Object.entries(picks)) { console.log(`  ${word}: ${found} found`); for (const item of sample) console.log(`    ${item.text}`) }
}
