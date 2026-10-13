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

const MIN_NEW = 18
const accepted = new Map()
let rejected = 0
const created = new Map() // new pairs: id -> the pair object from the batch
for (const entry of batch) {
  let pair = pairs.get(entry.pairId ?? entry.id)
  if (entry.id && !entry.pairId) {
    // A brand-new pair: {id, level, words, meanings, hint, sentences}
    const problems = []
    if (pair) problems.push('id already exists')
    if (!['A2', 'B1', 'B2'].includes(entry.level)) problems.push(`level ${entry.level}`)
    if (!Array.isArray(entry.words) || entry.words.length < 2 || entry.words.length > 3 || new Set(entry.words).size !== entry.words.length)
      problems.push('needs 2-3 different words')
    for (const word of entry.words ?? []) if (!entry.meanings?.[word]) problems.push(`no meaning for "${word}"`)
    if (!entry.hint?.trim()) problems.push('empty hint')
    if (problems.length) {
      console.log(`REJECT NEW PAIR ${entry.id}: ${problems.join('; ')}`)
      continue
    }
    pair = { id: entry.id, level: entry.level, words: entry.words, meanings: entry.meanings, hint: entry.hint.trim(), sentences: [] }
    created.set(pair.id, pair)
    pairs.set(pair.id, pair)
  }
  if (!pair) {
    console.log(`UNKNOWN PAIR ${entry.pairId}`)
    continue
  }
  const kept = []
  const own = pair.sentences.map((sentence) => tokens(sentence.text))
  for (const item of entry.add ?? entry.sentences ?? []) {
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
  // A new pair is only added with enough sentences (the learner must meet it with variety) and both words as answers.
  if (
    created.has(pair.id) &&
    (kept.length < MIN_NEW || pair.words.some((word) => kept.filter((sentence) => sentence.answer === word).length < 5))
  ) {
    console.log(
      `NEW PAIR ${pair.id} NOT ADDED: only ${kept.length} good sentences (need ${MIN_NEW}, each word at least 5 times as the answer)`,
    )
    created.delete(pair.id)
    pairs.delete(pair.id)
    continue
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
  for (const [id, pair] of created) {
    const kept = accepted.get(id)
    const sentences = kept.map((sentence) => `      { text: ${quote(sentence.text)}, answer: ${quote(sentence.answer)} },`).join('\n')
    const meanings = pair.words.map((word) => `${JSON.stringify(word)}: ${JSON.stringify(pair.meanings[word])}`).join(', ')
    const block = `  {\n    id: '${id}',\n    words: ${JSON.stringify(pair.words)},\n    level: '${pair.level}',\n    meanings: { ${meanings} },\n    hint: ${JSON.stringify(pair.hint)},\n    sentences: [\n${sentences}\n    ],\n  },\n`
    const end = out.lastIndexOf('\n]')
    out = out.slice(0, end + 1) + block + out.slice(end + 1)
  }
  for (const [id, kept] of accepted) {
    if (!kept.length || created.has(id)) continue
    const start = out.indexOf(`id: '${id}'`)
    const close = out.indexOf('\n    ],', start)
    if (start < 0 || close < 0) throw new Error(`cannot place sentences for ${id}`)
    const lines = kept.map((sentence) => `\n      { text: ${quote(sentence.text)}, answer: ${quote(sentence.answer)} },`).join('')
    out = out.slice(0, close) + lines + out.slice(close)
  }
  writeFileSync(dataPath, out)
  console.log('written: src/data/pairDrills.ts (run: pnpm exec prettier --write src/data/pairDrills.ts && pnpm check:pairs)')
}
