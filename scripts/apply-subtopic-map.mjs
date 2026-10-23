// Moves the existing library words into the fixed subtopics of scripts/library-subtopics.mjs.
// Source: research/plexity/subtopic-map.json = { topicId: { "Subtopic name": ["word", ...] } } (words are matched inside their topic).
// Only the `subtopic` column changes: word, translation, topic, level and word_id are never touched.
// Without --write it only reports what would move. Run: node scripts/apply-subtopic-map.mjs [--write]
import { readFileSync, writeFileSync } from 'node:fs'
import { parseCsv, serialiseCsv } from './csv-utils.mjs'
import { SUBTOPICS } from './library-subtopics.mjs'

const csvFile = new URL('../src/data/spell-sprint-built-in-library.csv', import.meta.url)
const original = readFileSync(csvFile, 'utf8')
const eol = original.includes('\r\n') ? '\r\n' : '\n'
const rows = parseCsv(original).filter((row) => row.length > 1)
const header = rows[0]
const col = (name) => header.indexOf(name)
const map = JSON.parse(readFileSync(new URL('../research/plexity/subtopic-map.json', import.meta.url), 'utf8'))

const problems = []
const target = new Map() // row index -> new subtopic
for (const [topic, groups] of Object.entries(map)) {
  for (const [subtopic, words] of Object.entries(groups)) {
    if (!(SUBTOPICS[topic] ?? []).includes(subtopic)) problems.push(`${topic}: "${subtopic}" is not in the list of this topic`)
    for (const word of words) {
      const hits = rows
        .map((row, index) => [row, index])
        .filter(
          ([row, index]) =>
            index > 0 &&
            row[col('topic_id')] === topic &&
            row[col('word')] === word &&
            !(SUBTOPICS[topic] ?? []).includes(row[col('subtopic')]),
        )
      if (hits.length !== 1) {
        problems.push(`${topic}: "${word}" matches ${hits.length} words`)
        continue
      }
      const [row, index] = hits[0]
      if ((SUBTOPICS[topic] ?? []).includes(row[col('subtopic')]))
        problems.push(`${topic}: "${word}" already has a listed subtopic (${row[col('subtopic')]})`)
      if (target.has(index)) problems.push(`${topic}: "${word}" is in the map twice`)
      target.set(index, subtopic)
    }
  }
}
// (a word is matched only among the words that are still outside the lists, so a second copy of it is not touched)
// every word outside the lists must be in the map
rows.forEach((row, index) => {
  if (index === 0) return
  const topic = row[col('topic_id')]
  if (!(SUBTOPICS[topic] ?? []).includes(row[col('subtopic')]) && !target.has(index))
    problems.push(`${topic}: "${row[col('word')]}" (${row[col('subtopic')]}) is not in the map`)
})

const summary = new Map()
for (const [index, subtopic] of target) {
  const key = `${rows[index][col('topic_id')]} / ${subtopic}`
  summary.set(key, (summary.get(key) ?? 0) + 1)
}
console.log(`${target.size} words would move; ${problems.length} problem(s)`)
for (const [key, count] of [...summary].sort()) console.log(`  ${key}: +${count}`)
for (const message of problems.slice(0, 40)) console.log('PROBLEM', message)
if (problems.length) process.exit(1)

if (process.argv.includes('--write')) {
  for (const [index, subtopic] of target) rows[index][col('subtopic')] = subtopic
  writeFileSync(csvFile, serialiseCsv(rows, eol))
  console.log(`${target.size} words moved in the library CSV (only the subtopic column changed)`)
}
