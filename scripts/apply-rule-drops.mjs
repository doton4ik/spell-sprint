// Records the items the Opus review marked to be removed (lines "slug|ex|index" / "slug|xr|index", from the pack file they were numbered in)
// into research/plexity/rules3-rejected.json, by text. merge-rule-answers.mjs never takes a rejected text again.
// Run: node scripts/apply-rule-drops.mjs <pack json> <drop file>...   then merge again and rebuild the SQL.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const [packFile, ...dropFiles] = process.argv.slice(2)
if (!packFile || !dropFiles.length) {
  console.log('usage: node scripts/apply-rule-drops.mjs <pack json> <drop file>...')
  process.exit(1)
}
const pack = JSON.parse(readFileSync(packFile, 'utf8'))
const norm = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const outFile = 'research/plexity/rules3-rejected.json'
const rejected = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {}
let added = 0
let missing = 0
for (const file of dropFiles) {
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const [slug, kind, index] = line.split('\t')[0].split('|')
    if (!slug || !['ex', 'xr'].includes(kind)) continue
    const rule = pack.rules.find((item) => item.slug === slug)
    const item = (kind === 'ex' ? rule?.examples : rule?.exercises)?.[Number(index)]
    if (!item) {
      missing += 1
      console.log(`not found: ${line}`)
      continue
    }
    const key = norm(kind === 'ex' ? item.text : item.prompt)
    rejected[slug] ??= []
    if (!rejected[slug].includes(key)) {
      rejected[slug].push(key)
      added += 1
    }
  }
}
writeFileSync(outFile, JSON.stringify(rejected, null, 1) + '\n')
console.log(`${added} rejected texts recorded (${missing} lines not found)`)
