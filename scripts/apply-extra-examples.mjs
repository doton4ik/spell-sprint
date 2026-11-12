// Second example sentences for library words (the "extra_example" column): a sentence that shows the word in a context
// from which its meaning can be understood. The sentences are written for the app (extra_example_source = "written")
// and kept in research/context/*.jsonl, one JSON object per line: {"id":"<word_id>","s":"<sentence>"}.
//
//   node scripts/apply-extra-examples.mjs --check [files…]   checks the files and prints what is wrong, writes nothing
//   node scripts/apply-extra-examples.mjs --apply [files…]   writes the good sentences into the library CSV
//
// Without files it reads every .jsonl in research/context/. A word that already has a second example is left alone.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseCsv, serialiseCsv } from './csv-utils.mjs'

const MIN_WORDS = 8
const MAX_WORDS = 18

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const dir = new URL('../research/context/', import.meta.url)
const named = args.filter((arg) => !arg.startsWith('--'))
const files = named.length
  ? named
  : existsSync(dir)
    ? readdirSync(dir)
        .filter((name) => name.endsWith('.jsonl'))
        .sort()
        .map((name) => fileURLToPath(new URL(name, dir)))
    : []
if (!files.length) {
  console.error('No .jsonl files: give them as arguments or put them in research/context/.')
  process.exit(1)
}

const csvFile = new URL('../src/data/spell-sprint-built-in-library.csv', import.meta.url)
const original = readFileSync(csvFile, 'utf8')
const eol = original.includes('\r\n') ? '\r\n' : '\n'
const rows = parseCsv(original).filter((row) => row.length > 1)
const header = rows[0]
const col = (name) => header.indexOf(name)
const byId = new Map(rows.slice(1).map((row) => [row[col('word_id')], row]))

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// The same test as gapSentence in src/services/libraryPractice.ts: the word exactly as it is learnt, as a whole word.
const hasWord = (sentence, word) => new RegExp(`(^|[^A-Za-z'-])${escape(word)}(?=$|[^A-Za-z'-])`, 'i').test(sentence)
const contentWords = (text) => new Set(text.toLowerCase().match(/[a-z']{4,}/g) ?? [])

const problems = []
const good = new Map() // word id -> sentence
const usedSentences = new Set()
let read = 0
for (const file of files) {
  const lines = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim())
  for (const [index, line] of lines.entries()) {
    read += 1
    const where = `${file.replace(/^.*[\\/]/, '')}:${index + 1}`
    let item
    try {
      item = JSON.parse(line)
    } catch {
      problems.push(`${where}: not a JSON object`)
      continue
    }
    const sentence = typeof item.s === 'string' ? item.s : ''
    const row = byId.get(item.id)
    const fail = (text) => problems.push(`${where} (${row ? row[col('word')] : item.id}): ${text} — "${sentence}"`)
    if (!row) {
      fail('no such word_id in the library')
      continue
    }
    if (row[col('extra_example')] && row[col('extra_example')] !== sentence) continue // already has one: left alone
    if (good.has(item.id)) {
      fail('a second sentence for the same word')
      continue
    }
    const word = row[col('word')]
    const count = sentence.split(/\s+/).filter(Boolean).length
    if (sentence !== sentence.trim() || /\s{2,}/.test(sentence)) fail('spaces at the ends or double spaces')
    else if (count < MIN_WORDS || count > MAX_WORDS) fail(`${count} words (must be ${MIN_WORDS}-${MAX_WORDS})`)
    else if (!/^[A-Z0-9]/.test(sentence)) fail('must start with a capital letter')
    else if (!/[.?!]$/.test(sentence)) fail('must end with . ? or !')
    else if (/[^A-Za-z0-9 ,.'?!:%£$&/-]/.test(sentence))
      fail('a character that is not allowed (quotes, brackets, dashes, semicolons, other alphabets)')
    else if (sentence.length > 200) fail('longer than 200 characters')
    else if (!hasWord(sentence, word)) fail(`does not contain "${word}" exactly as it is learnt`)
    else if (sentence.toLowerCase() === row[col('example')].toLowerCase()) fail('the same as the first example')
    else if (usedSentences.has(sentence.toLowerCase())) fail('the same sentence is used for another word')
    else {
      const first = contentWords(row[col('example')])
      const second = contentWords(sentence)
      const shared = [...second].filter((item) => first.has(item)).length
      if (second.size && shared / second.size > 0.6) fail('too close to the first example (most of its words are the same)')
      else {
        good.set(item.id, sentence)
        usedSentences.add(sentence.toLowerCase())
      }
    }
  }
}

const without = rows.slice(1).filter((row) => !row[col('extra_example')]).length
console.log(`${files.length} file(s), ${read} lines read: ${good.size} good sentences, ${problems.length} problem(s).`)
console.log(
  `Words without a second example now: ${without}; after applying: ${without - [...good.keys()].filter((id) => !byId.get(id)[col('extra_example')]).length}.`,
)
for (const problem of problems.slice(0, 60)) console.log(`  ${problem}`)
if (problems.length > 60) console.log(`  … and ${problems.length - 60} more`)

if (apply) {
  let written = 0
  for (const [id, sentence] of good) {
    const row = byId.get(id)
    if (row[col('extra_example')]) continue
    row[col('extra_example')] = sentence
    row[col('extra_example_source')] = 'written'
    written += 1
  }
  writeFileSync(csvFile, serialiseCsv(rows, eol))
  console.log(`${written} sentences written to the library CSV. Run pnpm check:library.`)
} else if (problems.length) process.exitCode = 1
