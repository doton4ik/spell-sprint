// Checks the assistant's answers (research/plexity/answers/rules3/*.json, one JSON object per rule: slug, examples, exercises;
// a rule asked in two parts has two files) against the rules and what already exists, and with --apply writes the good
// items into database/rules-import/more-practice-pack-3.json (the source of content pack 6). Bad items are left out and listed.
// The answers come in batches: batch N (--pack N, default 3) keeps only what no earlier pack has (packs 1, 2, 3 … N-1), so
// a second batch never repeats the first. Run: node scripts/merge-rule-answers.mjs [--apply] [--pack N]
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

const rules = JSON.parse(readFileSync('src/data/builtInRules.json', 'utf8'))
const bundled = JSON.parse(readFileSync('src/data/builtInRuleExercises.json', 'utf8'))
// Article rules merged into one (scripts/merge-article-rules.mjs): answers and earlier packs written for a merged slug now belong to the umbrella rule.
const articleMerge = JSON.parse(readFileSync('database/rules-import/article-merge.json', 'utf8'))
const mergedInto = (slug) => (articleMerge.from.includes(slug) ? articleMerge.into : slug)
const batch = Number(process.argv[process.argv.indexOf('--pack') + 1]) || 3
const earlier = [
  'database/rules-import/more-practice-pack.json',
  'database/rules-import/more-practice-pack-2.json',
  ...Array.from({ length: batch - 3 }, (_, index) => `database/rules-import/more-practice-pack-${index + 3}.json`),
]
  .filter((file) => existsSync(file))
  .map((file) => JSON.parse(readFileSync(file, 'utf8')))

// texts the review rejected (scripts/apply-rule-drops.mjs): never taken again
const rejected = existsSync('research/plexity/rules3-rejected.json')
  ? JSON.parse(readFileSync('research/plexity/rules3-rejected.json', 'utf8'))
  : {}
const dir = 'research/plexity/answers/rules3/'
const files = existsSync(dir)
  ? readdirSync(dir)
      .filter((name) => name.endsWith('.json'))
      .sort()
  : []
const norm = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const words = (text) => text.trim().split(/\s+/).filter(Boolean).length
const exampleTypes = new Set(['correct', 'incorrect', 'exception'])
const exerciseTypes = new Set(['fill_gap', 'multiple_choice', 'correct_word', 'spell', 'grammar'])

const bySlug = new Map()
const problems = []
const report = (slug, message) => problems.push(`${slug}: ${message}`)

for (const name of files) {
  let list
  try {
    const raw = readFileSync(dir + name, 'utf8').replace(/```(json)?/g, '')
    // one rule ({...}), or several rules in one file ([{...}, {...}] or {"rules": [...]})
    const first = Math.min(...['{', '['].map((mark) => (raw.indexOf(mark) < 0 ? Infinity : raw.indexOf(mark))))
    const data = JSON.parse(raw.slice(first, Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']')) + 1))
    list = Array.isArray(data) ? data : Array.isArray(data.rules) ? data.rules : [data]
  } catch (error) {
    problems.push(`${name}: not valid JSON (${error.message})`)
    continue
  }
  for (const data of list) {
    const rule = rules.rules.find((item) => item.slug === mergedInto(data.slug))
    if (!rule) {
      problems.push(`${name}: unknown slug "${data.slug}"`)
      continue
    }
    const entry = bySlug.get(rule.slug) ?? { rule, examples: [], exercises: [], files: [] }
    entry.files.push(name)
    // an item is an example when it has a "text" and an example type, wherever the assistant put it
    const all = [...(data.examples ?? []), ...(data.exercises ?? [])]
    entry.examples.push(...all.filter((item) => exampleTypes.has(item.type) && typeof item.text === 'string'))
    entry.exercises.push(...all.filter((item) => !(exampleTypes.has(item.type) && typeof item.text === 'string')))
    bySlug.set(rule.slug, entry)
  }
}

const wanted = JSON.parse(readFileSync('research/plexity/rule-counts.json', 'utf8'))
const result = []
let dropped = 0
for (const { rule, examples, exercises } of bySlug.values()) {
  const knownExamples = new Set(rules.examples.filter((item) => item.rule_id === rule.id).map((item) => norm(item.text)))
  const knownExercises = new Set([
    ...(bundled[rule.id] ?? []).map((item) => norm(item.prompt)),
    ...earlier.flatMap((pack) =>
      pack.rules.filter((item) => mergedInto(item.slug) === rule.slug).flatMap((item) => item.exercises.map((e) => norm(e.prompt))),
    ),
  ])
  const seen = new Set()
  const rejectedHere = new Set(rejected[rule.slug] ?? [])
  const goodExamples = []
  for (const example of examples) {
    const label = `example "${example.text}"`
    const bad = (message) => {
      report(rule.slug, `${label}: ${message}`)
      dropped++
    }
    if (typeof example.text !== 'string' || !example.text.trim()) {
      bad('no text')
      continue
    }
    if (!exampleTypes.has(example.type)) {
      bad(`unknown type "${example.type}"`)
      continue
    }
    if (words(example.text) < 3 || words(example.text) > 16) {
      bad('should be 3-16 words')
      continue
    }
    if (example.type === 'incorrect' && (!example.correction || norm(example.correction) === norm(example.text))) {
      bad('an incorrect example needs a different correction')
      continue
    }
    if (example.type !== 'incorrect' && example.correction) {
      bad('only an incorrect example has a correction')
      continue
    }
    if (!example.note || example.note.length > 90) {
      bad('needs a short note (up to 90 characters)')
      continue
    }
    const key = norm(example.text)
    if (rejectedHere.has(key)) {
      bad('rejected by the review')
      continue
    }
    if (knownExamples.has(key) || seen.has(key)) {
      bad('already exists')
      continue
    }
    seen.add(key)
    goodExamples.push({
      type: example.type,
      text: example.text.trim(),
      ...(example.correction ? { correction: example.correction.trim() } : {}),
      note: example.note.trim(),
    })
  }
  const goodExercises = []
  const seenPrompts = new Set()
  for (const exercise of exercises) {
    const label = `exercise "${exercise.prompt}"`
    const bad = (message) => {
      report(rule.slug, `${label}: ${message}`)
      dropped++
    }
    if (!exerciseTypes.has(exercise.type)) {
      bad(`unknown type "${exercise.type}"`)
      continue
    }
    if (typeof exercise.prompt !== 'string' || !exercise.prompt.trim() || typeof exercise.answer !== 'string' || !exercise.answer.trim()) {
      bad('no prompt or answer')
      continue
    }
    const gaps = exercise.prompt.split('___').length - 1
    if ((exercise.type === 'fill_gap' || exercise.type === 'multiple_choice' || exercise.type === 'grammar') && gaps !== 1) {
      bad('needs exactly one ___ gap')
      continue
    }
    if (exercise.type === 'multiple_choice') {
      const choices = exercise.choices
      if (!Array.isArray(choices) || choices.length < 2 || choices.length > 4 || new Set(choices).size !== choices.length) {
        bad('needs 2-4 different choices')
        continue
      }
      if (choices.filter((choice) => choice === exercise.answer).length !== 1) {
        bad('the answer must be exactly one of the choices')
        continue
      }
    }
    if (exercise.type === 'correct_word' && (/\s/.test(exercise.prompt.trim()) || norm(exercise.prompt) === norm(exercise.answer))) {
      bad('the prompt is one wrong word, different from the answer')
      continue
    }
    if (exercise.type === 'spell' && !exercise.prompt.startsWith('Spell the word:')) {
      bad('a spell prompt starts with "Spell the word:"')
      continue
    }
    const key = norm(exercise.prompt)
    if (rejectedHere.has(key)) {
      bad('rejected by the review')
      continue
    }
    if (knownExercises.has(key) || seenPrompts.has(key)) {
      bad('already exists')
      continue
    }
    seenPrompts.add(key)
    goodExercises.push({
      type: exercise.type,
      prompt: exercise.prompt.trim(),
      answer: exercise.answer.trim(),
      ...(exercise.type === 'multiple_choice' ? { choices: exercise.choices } : {}),
    })
  }
  result.push({
    slug: rule.slug,
    examples: goodExamples,
    exercises: goodExercises,
    asked: { examples: examples.length, exercises: exercises.length },
  })
}

const table = result.map((item) => {
  const want = wanted[item.slug]
  return `${item.slug}: examples ${item.examples.length}/${(want?.ex ?? 0) * 2}, exercises ${item.exercises.length}/${(want?.exr ?? 0) * 2}`
})
const total = result.reduce(
  (sum, item) => ({ examples: sum.examples + item.examples.length, exercises: sum.exercises + item.exercises.length }),
  { examples: 0, exercises: 0 },
)
const missingRules = rules.rules.filter((rule) => !bySlug.has(rule.slug)).map((rule) => rule.slug)
console.log(
  `answers read: ${files.length} files, ${result.length} of ${rules.rules.length} rules; kept ${total.examples} examples and ${total.exercises} exercises; dropped ${dropped}`,
)
if (missingRules.length) console.log(`rules without an answer yet: ${missingRules.length}`)
console.log('kept / wanted per rule:')
for (const line of table) console.log('  ' + line)
for (const message of problems.slice(0, process.argv.includes('--all-problems') ? Infinity : 40)) console.log('DROPPED', message)
if (problems.length > 40) console.log(`… and ${problems.length - 40} more`)
if (process.argv.includes('--apply')) {
  mkdirSync('database/rules-import', { recursive: true })
  const pack = { set: `more-practice-v${batch}`, rules: result.map(({ slug, examples, exercises }) => ({ slug, examples, exercises })) }
  const out = `database/rules-import/more-practice-pack-${batch}.json`
  writeFileSync(out, JSON.stringify(pack, null, 1) + '\n')
  console.log(`written ${out}`)
}
