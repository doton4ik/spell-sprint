// Checks the assistant's answers research/plexity/answers/topics-NN.json (["word_id","topic_id","level"] lines, may be wrapped
// in a ```json block) against the library and writes research/plexity/topic-map.json with --apply.
// Run: node scripts/merge-topics.mjs [--apply]
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { TOPICS, LEVELS, OLD_TOPIC_IDS } from './library-topics.mjs'
import { FIX_TOPIC, FIX_LEVEL, MERGE_TOPIC } from './topic-fixes.mjs'

const csv = readFileSync(new URL('../src/data/spell-sprint-built-in-library.csv', import.meta.url), 'utf8')
const ids = [...csv.matchAll(/^([a-z0-9][a-z0-9-]*),/gm)].map((m) => m[1]).filter((id) => id !== 'word_id')
const known = new Set(ids)
const topicIds = new Set([...TOPICS.map((t) => t[0]), ...OLD_TOPIC_IDS])
const wordOf = new Map([...csv.matchAll(/^([a-z0-9][a-z0-9-]*),([^,\n]*),/gm)].map((m) => [m[1], m[2].toLowerCase()]))
const map = new Map()
const problems = []
let missingFiles = 0
for (let n = 1; n <= 10; n++) {
  const name = `topics-${String(n).padStart(2, '0')}.json`
  const file = [`../research/plexity/answers/${name}`, `../research/plexity/answers/topics/${name}`]
    .map((path) => new URL(path, import.meta.url))
    .find((url) => existsSync(url))
  if (!file) {
    missingFiles++
    continue
  }
  const raw = readFileSync(file, 'utf8').replace(/```(json)?/g, '')
  let entries
  try {
    entries = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1))
  } catch (e) {
    problems.push(`topics-${n}: not valid JSON (${e.message})`)
    continue
  }
  for (const entry of entries) {
    const [id, topic, level] = Array.isArray(entry) ? entry : [entry.word_id, entry.topic_id, entry.level]
    if (!known.has(id)) problems.push(`topics-${n}: unknown word_id ${id}`)
    else if (!topicIds.has(topic)) problems.push(`topics-${n}: ${id} has topic "${topic}" which is not in the list`)
    else if (!LEVELS.includes(level)) problems.push(`topics-${n}: ${id} has level "${level}"`)
    else if (map.has(id)) problems.push(`topics-${n}: ${id} appears twice`)
    else map.set(id, { topic, level })
  }
}
const left = ids.filter((id) => !map.has(id))
const perTopic = {}
for (const { topic } of map.values()) perTopic[topic] = (perTopic[topic] || 0) + 1
console.log(`answers read: ${map.size} of ${ids.length} words; files missing: ${missingFiles}; not yet placed: ${left.length}`)
console.log('per topic:', JSON.stringify(perTopic))
for (const p of problems.slice(0, 40)) console.log('PROBLEM', p)
if (problems.length > 40) console.log(`… and ${problems.length - 40} more`)
if (process.argv.includes('--apply')) {
  if (problems.length || left.length) {
    console.log('Not applied: fix the problems and place every word first.')
    process.exit(1)
  }
  for (const [id, entry] of map) {
    const w = wordOf.get(id)
    if (FIX_TOPIC[w]) entry.topic = FIX_TOPIC[w]
    if (FIX_LEVEL[w]) entry.level = FIX_LEVEL[w]
    if (MERGE_TOPIC[entry.topic]) entry.topic = MERGE_TOPIC[entry.topic]
  }
  // second Opus pass over every level: "word_id | level" lines, made after the word fixes above
  const changes = readFileSync(new URL('../research/plexity/level-changes.txt', import.meta.url), 'utf8')
  for (const line of changes.split(/\r?\n/)) {
    const [id, level] = line.split('|').map((part) => part.trim())
    if (map.has(id) && LEVELS.includes(level)) map.get(id).level = level
  }
  writeFileSync(new URL('../research/plexity/topic-map.json', import.meta.url), JSON.stringify(Object.fromEntries(map), null, 1) + '\n')
  console.log('written research/plexity/topic-map.json')
}
