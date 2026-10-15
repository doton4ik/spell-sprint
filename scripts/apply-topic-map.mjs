// Puts the new topics and CEFR levels from research/plexity/topic-map.json into the built-in library CSV:
// topic_id, topic and library become the new topic, a `level` column (A2/B1/B2/C1) is added at the end.
// word_id, difficulty, subtopic and everything else stay as they are. Safe to run again.
// Run: node scripts/apply-topic-map.mjs        (checks the round trip first; add --write to change the CSV)
import { readFileSync, writeFileSync } from 'node:fs'
import { TOPICS } from './library-topics.mjs'

const file = new URL('../src/data/spell-sprint-built-in-library.csv', import.meta.url)
const original = readFileSync(file, 'utf8')
const eol = original.includes('\r\n') ? '\r\n' : '\n'

const parse = (text) => {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}
const quote = (value) => (/[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)
const serialise = (rows) => rows.map((row) => row.map(quote).join(',')).join(eol) + eol

const rows = parse(original).filter((row) => row.length > 1)
const same = (a, b) => a.replace(/\r\n/g, '\n').replace(/\n+$/, '') === b.replace(/\r\n/g, '\n').replace(/\n+$/, '')
if (!same(serialise(rows), original)) {
  console.log('Round trip is not identical: the CSV would change in other ways. Stopping.')
  process.exit(1)
}

const map = JSON.parse(readFileSync(new URL('../research/plexity/topic-map.json', import.meta.url), 'utf8'))
const topicName = Object.fromEntries(TOPICS.map(([id, name]) => [id, name]))
const header = rows[0]
const col = (name) => header.indexOf(name)
if (col('level') < 0) header.push('level')
const iId = col('word_id')
const iTopicId = col('topic_id')
const iTopic = col('topic')
const iLibrary = col('library')
const iLevel = col('level')
let changed = 0
for (const row of rows.slice(1)) {
  while (row.length < header.length) row.push('')
  const entry = map[row[iId]]
  if (!entry) {
    console.log('no entry for', row[iId])
    process.exit(1)
  }
  row[iTopicId] = entry.topic
  row[iTopic] = topicName[entry.topic]
  row[iLibrary] = topicName[entry.topic]
  row[iLevel] = entry.level
  changed++
}
console.log(`${changed} words`)
if (process.argv.includes('--write')) {
  writeFileSync(file, serialise(rows))
  console.log('written')
}
