// Checks the built-in library CSV: `pnpm check:library`.
// Errors (exit code 1): missing fields, duplicate ids, stray spaces, wrong alphabet, one word with two
// different translations, broken extra-example sources, values longer than the app expects.
// Notes (no failure): an example that does not contain its word, two words with the same Russian prompt
// that do not accept each other as an answer.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { TOPICS } from './library-topics.mjs'
import { SUBTOPICS } from './library-subtopics.mjs'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const text = readFileSync(join(root, 'src/data/spell-sprint-built-in-library.csv'), 'utf8')

// A small CSV reader (quotes, doubled quotes, commas and new lines inside quotes).
function parse(source) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i]
    if (quoted) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"'
          i += 1
        } else quoted = false
      } else field += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''))
      rows.push(row)
      row = []
      field = ''
    } else field += char
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''))
    rows.push(row)
  }
  return rows.filter((item) => item.some(Boolean))
}
const [header, ...data] = parse(text)
const rows = data.map((cells, index) => ({ line: index + 2, ...Object.fromEntries(header.map((key, at) => [key, cells[at] ?? ''])) }))

const errors = []
const notes = []
const fail = (row, message) => errors.push(`line ${row.line} (${row.word || row.word_id}): ${message}`)
const latin = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ '’-]*$/
const cyrillic = /[а-яё]/i
const limits = { word: 60, translation: 120, example: 200, rule: 120 }

const topicNames = Object.fromEntries(TOPICS.map(([id, name]) => [id, name]))
const topicIds = new Set(Object.keys(topicNames))
const ids = new Set()
for (const row of rows) {
  for (const key of ['word_id', 'word', 'translation', 'topic_id', 'topic', 'library', 'difficulty'])
    if (!row[key]?.trim()) fail(row, `empty ${key}`)
  if (ids.has(row.word_id)) fail(row, `duplicate word_id ${row.word_id}`)
  ids.add(row.word_id)
  for (const key of ['word', 'translation', 'example', 'rule', 'definition', 'alternatives', 'extra_example']) {
    const value = row[key] ?? ''
    if (value !== value.trim() || /\s{2,}/.test(value)) fail(row, `stray spaces in ${key}`)
  }
  if (row.word && !latin.test(row.word)) fail(row, `word "${row.word}" has characters that are not English letters`)
  if (row.translation && !cyrillic.test(row.translation)) fail(row, `translation "${row.translation}" has no Russian letters`)
  if (row.difficulty && !['easy', 'medium', 'hard'].includes(row.difficulty)) fail(row, `difficulty "${row.difficulty}"`)
  if (!topicIds.has(row.topic_id) || topicNames[row.topic_id] !== row.topic || row.library !== row.topic)
    fail(row, `topic "${row.topic_id}" / "${row.topic}" / library "${row.library}" is not one of the topics in scripts/library-topics.mjs`)
  if (!['A2', 'B1', 'B2', 'C1'].includes(row.level)) fail(row, `level "${row.level}" is not A2, B1, B2 or C1`)
  if (row.risk && !/^[1-5]$/.test(row.risk)) fail(row, `risk "${row.risk}" is not 1–5`)
  for (const [key, max] of Object.entries(limits)) if ((row[key] ?? '').length > max) fail(row, `${key} is longer than ${max} characters`)
  if (row.extra_example && !/^(tatoeba:\d+|written)$/.test(row.extra_example_source ?? ''))
    fail(row, `extra example without a source (tatoeba:<id> or written)`)
  for (const alternative of (row.alternatives ?? '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)) {
    if (!latin.test(alternative)) fail(row, `alternative "${alternative}" is not English`)
    if (alternative.toLowerCase() === row.word.toLowerCase()) fail(row, `alternative repeats the word`)
  }
  // The example should show the word (any form: "chop" → "chopped"); only a note, some forms change a lot.
  const stem = row.word
    .toLowerCase()
    .split(' ')[0]
    .slice(0, Math.max(3, row.word.length - 3))
  if (row.example && !row.example.toLowerCase().includes(stem)) notes.push(`line ${row.line}: example of "${row.word}" does not contain it`)
}

// One English word in two libraries must have one translation.
const byWord = new Map()
for (const row of rows) byWord.set(row.word.toLowerCase(), [...(byWord.get(row.word.toLowerCase()) ?? []), row])
for (const [word, list] of byWord)
  if (new Set(list.map((row) => row.translation)).size > 1)
    errors.push(`"${word}" has different translations: ${list.map((row) => `${row.translation} (line ${row.line})`).join(' | ')}`)

// Two different words with the same Russian prompt: the learner cannot know which one is meant,
// unless each accepts the other.
const byPrompt = new Map()
for (const row of rows) byPrompt.set(row.translation, [...(byPrompt.get(row.translation) ?? []), row])
for (const [prompt, list] of byPrompt) {
  const words = [...new Set(list.map((row) => row.word))]
  if (words.length < 2) continue
  const accepted = list.every((row) =>
    words.every(
      (word) =>
        word === row.word ||
        (row.alternatives ?? '')
          .split(';')
          .map((item) => item.trim())
          .includes(word),
    ),
  )
  if (!accepted) notes.push(`"${prompt}" is the prompt of ${words.join(' / ')} — add them as alternatives or make the translations differ`)
}

// The fixed subtopics (scripts/library-subtopics.mjs): every topic has its list, and words added by the new-words
// pipeline use a name from the list of their own topic.
for (const [id] of TOPICS) {
  const names = SUBTOPICS[id] ?? []
  if (names.length < 3) errors.push(`topic "${id}" needs at least 3 subtopics in scripts/library-subtopics.mjs`)
  if (new Set(names.map((name) => name.toLowerCase())).size !== names.length) errors.push(`topic "${id}": two subtopics have the same name`)
}
for (const id of Object.keys(SUBTOPICS)) if (!topicIds.has(id)) errors.push(`library-subtopics.mjs: "${id}" is not a topic`)
for (const row of rows)
  if (row.source.startsWith('plexity-newwords') && !(SUBTOPICS[row.topic_id] ?? []).includes(row.subtopic))
    fail(row, `subtopic "${row.subtopic}" is not in the list of topic "${row.topic_id}" (scripts/library-subtopics.mjs)`)

if (notes.length) console.log(`${notes.length} note(s):\n  ${notes.slice(0, 30).join('\n  ')}${notes.length > 30 ? '\n  …' : ''}`)
if (errors.length) {
  console.log(`\n${errors.length} error(s):\n  ${errors.slice(0, 50).join('\n  ')}`)
  process.exitCode = 1
} else console.log(`\nAll ${rows.length} library words passed.`)
