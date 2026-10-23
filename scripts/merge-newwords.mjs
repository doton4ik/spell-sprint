// Checks the assistant's answers with new words (research/plexity/answers/newwords/newwords-NN.json, lines of
// ["word","translation","pos","level","definition","example"]) against the topic of their prompt and the library, and with --apply
// adds the good ones to src/data/spell-sprint-built-in-library.csv. Bad words are left out and listed.
// Run: node scripts/merge-newwords.mjs [--apply]
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { parseCsv, serialiseCsv } from './csv-utils.mjs'
import { LEVELS, TOPICS } from './library-topics.mjs'
import { SUBTOPICS } from './library-subtopics.mjs'

const csvFile = new URL('../src/data/spell-sprint-built-in-library.csv', import.meta.url)
const original = readFileSync(csvFile, 'utf8')
const eol = original.includes('\r\n') ? '\r\n' : '\n'
const rows = parseCsv(original).filter((row) => row.length > 1)
const header = rows[0]
const col = (name) => header.indexOf(name)
const topicName = Object.fromEntries(TOPICS.map(([id, name]) => [id, name]))
const known = new Map() // lower-case word -> topic id
const ids = new Set()
for (const row of rows.slice(1)) {
  known.set(row[col('word')].toLowerCase(), row[col('topic_id')])
  ids.add(row[col('word_id')])
}

const promptDir = new URL('../research/plexity/prompts/', import.meta.url)
const answerDir = new URL('../research/plexity/answers/newwords/', import.meta.url)
const answerFiles = existsSync(answerDir)
  ? readdirSync(answerDir)
      .filter((name) => /^newwords-(\d+|self-[a-z]+-\d+)\.json$/.test(name))
      .sort()
  : []

const latin = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ '’-]*$/
const cyrillic = /[а-яё]/i
const posMap = { 'phrasal verb': 'phrase', idiom: 'phrase', expression: 'phrase' }
const posOk = new Set([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'conjunction',
  'determiner',
  'pronoun',
  'preposition',
  'interjection',
  'phrase',
])
const words = (text) => text.trim().split(/\s+/).filter(Boolean).length
const slug = (text) =>
  text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')

const problems = []
const accepted = []
const perFile = []
for (const name of answerFiles) {
  const prompt = existsSync(new URL(name.replace('.json', '.md'), promptDir))
    ? readFileSync(new URL(name.replace('.json', '.md'), promptDir), 'utf8')
    : ''
  // files written here (not by the assistant) carry the topic in the name: newwords-self-<topic>-<n>.json
  const topic = name.match(/^newwords-self-([a-z]+)-/)?.[1] ?? prompt.match(/for the topic "[^"]+" \(([a-z]+)\)/)?.[1]
  const wanted = Number(prompt.match(/Write EXACTLY (\d+) NEW words/)?.[1] ?? 0)
  if (!topic || !topicName[topic]) {
    problems.push(`${name}: cannot tell the topic (is there a prompt file with the same number?)`)
    continue
  }
  let entries
  try {
    const raw = readFileSync(new URL(name, answerDir), 'utf8').replace(/```(json)?/g, '')
    entries = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1))
  } catch (error) {
    problems.push(`${name}: not valid JSON (${error.message})`)
    continue
  }
  if (entries.length && Array.isArray(entries[0]) && entries[0].length === 6) {
    problems.push(
      `${name}: answer in the OLD format (6 fields, no subtopic): ask again with the new prompt ${name.replace('.json', '.md')}`,
    )
    continue
  }
  let kept = 0
  for (const entry of entries) {
    // lines may be arrays or objects with the same field names
    const [word, translation, pos, level, definition, example, subtopicRaw] = Array.isArray(entry)
      ? entry
      : [entry.word, entry.translation, entry.pos, entry.level, entry.definition, entry.example, entry.subtopic]
    const bad = (message) => problems.push(`${name} "${word}": ${message}`)
    if ([word, translation, pos, level, definition, example, subtopicRaw].some((value) => typeof value !== 'string' || !value.trim())) {
      bad('a field is empty')
      continue
    }
    if (!latin.test(word.trim())) {
      bad('not an English word')
      continue
    }
    if (!cyrillic.test(translation)) {
      bad('the translation has no Russian letters')
      continue
    }
    const kind = posMap[pos.trim().toLowerCase()] ?? pos.trim().toLowerCase()
    if (!posOk.has(kind)) {
      bad(`unknown part of speech "${pos}"`)
      continue
    }
    if (!LEVELS.includes(level.trim())) {
      bad(`level "${level}"`)
      continue
    }
    if (words(definition) < 3 || words(definition) > 18) {
      bad('the definition should be 3-18 words')
      continue
    }
    if (words(example) < 4 || words(example) > 18) {
      bad('the example should be 4-18 words')
      continue
    }
    if (!example.toLowerCase().includes(word.trim().toLowerCase())) {
      bad('the example does not contain the word as written')
      continue
    }
    if (definition.toLowerCase().includes(word.trim().toLowerCase()) && words(word) === 1) {
      bad('the definition uses the word itself')
      continue
    }
    // the subtopic must be one of the fixed names of the topic (spelling and capitals may differ, the name may not)
    const subtopic = (SUBTOPICS[topic] ?? []).find((name) => name.toLowerCase() === subtopicRaw.trim().toLowerCase())
    if (!subtopic) {
      bad(`subtopic "${subtopicRaw}" is not in the list of ${topic}: ${(SUBTOPICS[topic] ?? []).join(' | ')}`)
      continue
    }
    const key = word.trim().toLowerCase()
    if (known.has(key)) {
      bad(`already in the library (${known.get(key)})`)
      continue
    }
    known.set(key, topic)
    const id = `${topic}-${slug(word)}`
    if (ids.has(id)) {
      bad('id clash')
      continue
    }
    ids.add(id)
    accepted.push({
      topic,
      word: word.trim(),
      translation: translation.trim(),
      pos: kind,
      level: level.trim(),
      definition: definition.trim(),
      example: example.trim(),
      subtopic,
      id,
    })
    kept++
  }
  perFile.push(`${name} (${topic}): ${kept} kept of ${entries.length}, wanted ${wanted}`)
}

console.log(`answers read: ${answerFiles.length} files; ${accepted.length} new words kept; ${problems.length} dropped or broken`)
for (const line of perFile) console.log('  ' + line)
const bySub = new Map()
for (const item of accepted) bySub.set(`${item.topic} / ${item.subtopic}`, (bySub.get(`${item.topic} / ${item.subtopic}`) ?? 0) + 1)
if (bySub.size) console.log('subtopics: ' + [...bySub].map(([name, count]) => `${name} ${count}`).join('; '))
for (const message of problems.slice(0, 40)) console.log('DROPPED', message)
if (problems.length > 40) console.log(`… and ${problems.length - 40} more`)

if (process.argv.includes('--apply')) {
  const difficulty = { A2: 'easy', B1: 'medium', B2: 'hard', C1: 'hard' }
  for (const item of accepted) {
    const row = Array(header.length).fill('')
    const set = (name, value) => (row[col(name)] = value)
    set('word_id', item.id)
    set('word', item.word)
    set('translation', item.translation)
    set('topic_id', item.topic)
    set('topic', topicName[item.topic])
    set('subtopic', item.subtopic)
    set('difficulty', difficulty[item.level])
    set('risk', item.word.length >= 9 ? '4' : '3')
    set('example', item.example)
    set('definition', item.definition)
    set('part_of_speech', item.pos)
    set('library', topicName[item.topic])
    set('source', 'plexity-newwords-v1')
    set('level', item.level)
    rows.push(row)
  }
  writeFileSync(csvFile, serialiseCsv(rows, eol))
  console.log(`${accepted.length} words added to the library CSV`)
}
