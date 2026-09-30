// Checks src/data/pairDrills.ts: node scripts/check-pairs.mjs (pnpm check:pairs)
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = mkdtempSync(join(tmpdir(), 'pairs-'))
writeFileSync(join(dir, 'pairs.ts'), readFileSync(new URL('../src/data/pairDrills.ts', import.meta.url), 'utf8'))
const { pairDrills } = await import(pathToFileURL(join(dir, 'pairs.ts')).href)

let failed = 0
const fail = (message) => { failed += 1; console.log('FAIL', message) }
const ids = new Set()
const levels = {}
for (const pair of pairDrills) {
  if (ids.has(pair.id)) fail(`${pair.id}: duplicate id`); ids.add(pair.id)
  levels[pair.level] = (levels[pair.level] ?? 0) + 1
  if (!['A2', 'B1', 'B2'].includes(pair.level)) fail(`${pair.id}: level ${pair.level}`)
  if (pair.words.length < 2 || pair.words.length > 3 || new Set(pair.words).size !== pair.words.length) fail(`${pair.id}: needs 2–3 different words`)
  for (const word of pair.words) if (!pair.meanings[word]) fail(`${pair.id}: no meaning for "${word}"`)
  if (!pair.hint.trim()) fail(`${pair.id}: empty hint`)
  if (pair.sentences.length < 4) fail(`${pair.id}: only ${pair.sentences.length} sentences`)
  for (const sentence of pair.sentences) {
    if (!pair.words.includes(sentence.answer)) fail(`${pair.id}: answer "${sentence.answer}" is not one of the words`)
    if (sentence.text.split('___').length !== 2) fail(`${pair.id}: "${sentence.text}" needs exactly one ___`)
    const words = sentence.text.split(/\s+/).length
    if (words < 5 || words > 16) fail(`${pair.id}: "${sentence.text}" has ${words} words`)
  }
  for (const word of pair.words) if (!pair.sentences.some((sentence) => sentence.answer === word)) fail(`${pair.id}: "${word}" is never the answer`)
}
console.log('pairs per level:', levels)
console.log(failed ? `\n${failed} problem(s).` : `\nAll ${pairDrills.length} pairs passed.`)
process.exit(failed ? 1 : 0)
