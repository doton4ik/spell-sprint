// Checks a batch of new Pairs sentences and (with --apply) adds the good ones to src/data/pairDrills.ts.
//   node scripts/merge-pairs.mjs research/pairs/batch-01.json            -> report only
//   node scripts/merge-pairs.mjs research/pairs/batch-01.json --apply    -> add the accepted sentences
// A batch is [{ pairId, add: [{ text, answer }] }]. Existing sentences are never changed.
// A sentence is rejected when: the pair or answer is unknown, not exactly one ___, 5–16 words, bad capital/ending, double
// spaces, another option of the pair appears in the sentence (a leak), it repeats a sentence anywhere in the file or in the batch,
// or it differs from another sentence of the same pair by one word only (a template copy).
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const [file, ...flags] = process.argv.slice(2)
const apply = flags.includes('--apply')
const skipFile = flags.find((flag) => flag.startsWith('--skip='))?.slice(7) // a JSON list of sentence texts to drop (from the review)
if (!file) {
  console.log('usage: node scripts/merge-pairs.mjs <batch.json> [--apply] [--skip=rejected.json]')
  process.exit(1)
}
const dataPath = new URL('../src/data/pairDrills.ts', import.meta.url)
const source = readFileSync(dataPath, 'utf8')
const dir = mkdtempSync(join(tmpdir(), 'pairs-'))
writeFileSync(join(dir, 'pairs.ts'), source)
const { pairDrills } = await import(pathToFileURL(join(dir, 'pairs.ts')).href)
const batch = JSON.parse(readFileSync(file, 'utf8'))
const skip = new Set((skipFile ? JSON.parse(readFileSync(skipFile, 'utf8')) : []).map((text) => text.toLowerCase()))

const norm = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9_' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const tokens = (text) => norm(text).split(' ')
const seen = new Set(pairDrills.flatMap((pair) => pair.sentences.map((sentence) => norm(sentence.text))))
const pairs = new Map(pairDrills.map((pair) => [pair.id, pair]))
const wholeWord = (text, word) => new RegExp(`(^|[^A-Za-z'])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^A-Za-z'])`, 'i').test(text)

const accepted = new Map()
let rejected = 0
for (const entry of batch) {
  const pair = pairs.get(entry.pairId)
  if (!pair) {
    console.log(`UNKNOWN PAIR ${entry.pairId}`)
    continue
  }
  const kept = []
  const own = pair.sentences.map((sentence) => tokens(sentence.text))
  for (const item of entry.add ?? []) {
    const text = item.text?.trim() ?? ''
    const why = []
    if (!pair.words.includes(item.answer)) why.push(`answer "${item.answer}" is not one of ${pair.words.join('/')}`)
    if (text.split('___').length !== 2) why.push('needs exactly one ___')
    const count = text.split(/\s+/).length
    if (count < 5 || count > 16) why.push(`${count} words`)
    if (!/^(___|[A-Z])/.test(text)) why.push('no capital at the start')
    if (!/[.?!]$/.test(text)) why.push('no ending punctuation')
    if (/ {2}/.test(text)) why.push('double space')
    const outside = text.replace('___', ' ')
    for (const word of pair.words) if (wholeWord(outside, word)) why.push(`leak: "${word}" is in the sentence`)
    const key = norm(text)
    if (seen.has(key)) why.push('duplicate sentence')
    const mine = tokens(text)
    for (const other of [...own, ...kept.map((sentence) => tokens(sentence.text))]) {
      if (other.length === mine.length && other.filter((token, index) => token !== mine[index]).length === 1) {
        why.push('near-duplicate of another sentence of this pair')
        break
      }
    }
    if (skip.has(text.toLowerCase())) why.push('dropped in review')
    if (why.length) {
      rejected += 1
      console.log(`REJECT [${pair.id}] ${text}\n       ${why.join('; ')}`)
    } else {
      seen.add(key)
      kept.push({ text, answer: item.answer })
    }
  }
  accepted.set(pair.id, kept)
}

console.log('\nper pair (accepted / rejected, answers after merge):')
let total = 0
for (const [id, kept] of accepted) {
  const pair = pairs.get(id)
  const all = [...pair.sentences, ...kept]
  const share = pair.words.map((word) => `${word} ${all.filter((sentence) => sentence.answer === word).length}`).join(', ')
  total += kept.length
  console.log(`  ${id}: +${kept.length} -> ${all.length} sentences (${share})`)
}
console.log(`\naccepted ${total}, rejected ${rejected}`)

if (apply) {
  let out = source
  const quote = (text) => (text.includes("'") ? JSON.stringify(text) : `'${text}'`)
  for (const [id, kept] of accepted) {
    if (!kept.length) continue
    const start = out.indexOf(`id: '${id}'`)
    const close = out.indexOf('\n    ],', start)
    if (start < 0 || close < 0) throw new Error(`cannot place sentences for ${id}`)
    const lines = kept.map((sentence) => `\n      { text: ${quote(sentence.text)}, answer: ${quote(sentence.answer)} },`).join('')
    out = out.slice(0, close) + lines + out.slice(close)
  }
  writeFileSync(dataPath, out)
  console.log('written: src/data/pairDrills.ts (run: pnpm exec prettier --write src/data/pairDrills.ts && pnpm check:pairs)')
}
