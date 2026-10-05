// Example-sentence candidates for library words from Tatoeba (CC BY 2.0 FR) → tatoeba-examples.json + .txt
import { createReadStream, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const PER_WORD = 3
const american = /\b(color|colors|favorite|center|centers|organize\w*|realize\w*|recognize\w*|apologize\w*|theater|neighbor\w*|honor\w*|behavior|traveled|traveling|gray|mom|vacation|apartment|cookie|candy|gotten|soccer|cellphone|trash|garbage|elevator|downtown|sidewalk|movie|movies|check|program|jewelry|pajamas|tire|curb|analyze\w*|catalog|license|defense|offense|practice[sd]?)\b/i
const names = /\b(Tom|Mary|Sami|Layla|Ziri|Skura|Rima|Yanni|Mennad|Baya|Muiriel|John|Jim|Bob|Ken|Dan|Linda|Alice|Bill|Fadil|Dania|Salima|Ziri)\b/
const dark = /\b(kill|killed|die|died|dead|death|gun|suicide|murder|drunk|beer|wine|whisky|vodka|sex|naked|God|war|police|prison|hate)\b/i
const tokens = (text) => text.toLowerCase().replace(/’/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) ?? []

// The library: word, translation, part of speech, current example.
const csv = readFileSync('src/data/spell-sprint-built-in-library.csv', 'utf8').trim().split(/\r?\n/)
const parse = (line) => { const out = []; let cell = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const ch = line[i]; if (ch === '"') { if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; continue } quoted = !quoted; continue } if (ch === ',' && !quoted) { out.push(cell); cell = ''; continue } cell += ch } out.push(cell); return out }
const header = parse(csv[0])
const words = csv.slice(1).map((line) => { const v = parse(line); return Object.fromEntries(header.map((k, i) => [k, v[i] ?? ''])) })

// Forms to look for: the word itself, plus regular inflections of its last word.
function forms(word, pos) {
  const parts = word.toLowerCase().split(' ')
  const last = parts.at(-1)
  const extra = []
  if (pos === 'noun' || pos === 'verb') extra.push(/(s|x|ch|sh)$/.test(last) ? `${last}es` : /[^aeiou]y$/.test(last) ? `${last.slice(0, -1)}ies` : `${last}s`)
  if (pos === 'verb') extra.push(/e$/.test(last) ? `${last}d` : `${last}ed`, /e$/.test(last) ? `${last.slice(0, -1)}ing` : `${last}ing`)
  return [parts.join(' '), ...extra.map((form) => [...parts.slice(0, -1), form].join(' '))]
}

const lines = []
const freq = new Map()
const rl = createInterface({ input: createReadStream(join(here, 'tatoeba', 'eng_sentences.tsv'), 'utf8'), crlfDelay: Infinity })
for await (const line of rl) {
  const parts = line.split('\t'); const text = (parts[2] ?? '').replace(/’/g, "'")
  const list = tokens(text)
  for (const word of new Set(list)) freq.set(word, (freq.get(word) ?? 0) + 1)
  if (list.length < 6 || list.length > 14) continue
  if (!/^[A-Z]/.test(text) || !/[.?!]$/.test(text) || /[0-9;:()[\]"]/.test(text) || names.test(text) || american.test(text) || dark.test(text)) continue
  lines.push({ id: parts[0], text, low: ` ${list.join(' ')} `, list })
}

const result = {}
const report = []
for (const word of words) {
  const wanted = forms(word.word, word.part_of_speech)
  const own = new Set(tokens(word.word))
  const seen = new Set(); const found = []
  for (const line of lines) {
    if (!wanted.some((form) => line.low.includes(` ${form} `))) continue
    const rest = line.list.filter((item) => !own.has(item) && !wanted.includes(item))
    const rarest = rest.length ? Math.min(...rest.map((item) => freq.get(item) ?? 0)) : 0
    if (rarest < 250) continue
    const key = rest.slice(0, 3).join(' ')
    if (seen.has(key) || line.text === word.example) continue
    seen.add(key)
    found.push({ id: line.id, text: line.text, length: line.list.length, rarest })
  }
  found.sort((a, b) => Math.abs(a.length - 10) - Math.abs(b.length - 10) || b.rarest - a.rarest)
  const top = found.slice(0, 30)
  const pick = Array.from({ length: Math.min(PER_WORD, top.length) }, (_, i) => top[Math.floor((i * top.length) / Math.min(PER_WORD, top.length))])
  result[word.word_id] = pick
  report.push(`## ${word.word_id} | ${word.word} = ${word.translation} (${word.part_of_speech})`)
  pick.forEach((item, index) => report.push(`  ${index + 1}. ${item.text}`))
}
writeFileSync(join(here, 'tatoeba-examples.json'), JSON.stringify(result))
writeFileSync(join(here, 'tatoeba-examples.txt'), report.join('\n'))
console.log('words', words.length, 'with candidates', Object.values(result).filter((list) => list.length).length)
