// Content for Plexity (Perplexity): ready prompts and checked merging, for three kinds of content.
//   node scripts/plexity-content.mjs prompts words|examples|level      writes prompts into research/plexity/prompts/<kind>/
//   node scripts/plexity-content.mjs merge words <answer.json> [--apply] [--skip=list.json]
//   node scripts/plexity-content.mjs merge examples <answer.json> [--apply] [--skip=list.json]
//   node scripts/plexity-content.mjs merge level <answer.json> --batch=NN [--apply] [--skip=list.json]
// words     new words for the built-in library (src/data/spell-sprint-built-in-library.csv)
// examples  a second example sentence for words that have none (extra_example, source "written")
// level     new level-check questions (src/data/levelCheckDeep.ts): gap-fill, find the mistake, collocations, word formation, dictation
// Without --apply a merge only reports. A --skip list is a JSON array: words, word ids or sentences to drop after a review.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const [command, kind, ...rest] = process.argv.slice(2)
const flag = (name) => rest.find((item) => item.startsWith(`--${name}=`))?.slice(name.length + 3)
const apply = rest.includes('--apply')
const skip = new Set((flag('skip') ? JSON.parse(readFileSync(flag('skip'), 'utf8')) : []).map((item) => String(item).toLowerCase()))
const url = (path) => new URL(`../${path}`, import.meta.url)
const CSV = url('src/data/spell-sprint-built-in-library.csv')
const LEVEL_FILE = url('src/data/levelCheckDeep.ts')

// ---- CSV ---------------------------------------------------------------------------------------------------------------
function parseCsv(source) {
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
const cell = (value) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)
const csvLine = (values) => values.map(cell).join(',')
const library = () => {
  const text = readFileSync(CSV, 'utf8')
  const [header, ...data] = parseCsv(text)
  const rows = data.map((cells) => Object.fromEntries(header.map((key, at) => [key, cells[at] ?? ''])))
  return { text, header, rows, eol: text.includes('\r\n') ? '\r\n' : '\n' }
}
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const hasWord = (text, word) => new RegExp(`(^|[^A-Za-z'’-])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^A-Za-z'’-])`, 'i').test(text)

function slots(rows) {
  const map = new Map()
  for (const row of rows) {
    const key = `${row.topic_id}|${row.subtopic}|${row.library}`
    const slot = map.get(key) ?? { key, topic_id: row.topic_id, topic: row.topic, subtopic: row.subtopic, library: row.library, words: [] }
    slot.words.push(row.word)
    map.set(key, slot)
  }
  return [...map.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((slot, index) => ({ ...slot, code: `S${String(index + 1).padStart(2, '0')}` }))
}

const writePrompt = (folder, name, text) => {
  mkdirSync(url(`research/plexity/prompts/${folder}/`), { recursive: true })
  writeFileSync(url(`research/plexity/prompts/${folder}/${name}`), text.trimEnd() + '\n')
}
const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size))
const pad = (number) => String(number).padStart(2, '0')

const INTRO = `You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).`

// ======================================================================================================================
// WORDS
// ======================================================================================================================
const PARTS = [
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
  'other',
]

function wordsPrompts() {
  const { rows } = library()
  const all = slots(rows)
  const PER_SLOT = 10
  chunk(all, 6).forEach((group, index) => {
    const list = group
      .map((slot) => `### ${slot.code} — ${slot.topic} / ${slot.subtopic}\nWords already in it (do not repeat): ${slot.words.join(', ')}`)
      .join('\n\n')
    const text = `${INTRO}

## Your task in this round

Write **${PER_SLOT} NEW words for each of these ${group.length} slots** (${group.length * PER_SLOT} words). A slot is a topic and subtopic of the word library. Put each word in the slot where it fits best; use the slot code in \`slot\`.

${list}

## What a good word is

- A single English word, or a short phrase / phrasal verb (at most 3 words), lowercase (names only if they are always capitalised). Letters, space, apostrophe or hyphen only.
- Useful for a Russian-speaking learner and **easy to misspell** is best: double letters, silent letters, odd vowel pairs, look-alike endings (-ence/-ance, -able/-ible). A mix of levels: about 30% easy (A2), 45% medium (B1), 25% hard (B2-C1).
- One clear meaning. If the word has several meanings, choose the one that fits the slot's topic, and translate that meaning.
- Not a word that is already in the slot's list above, and not a different spelling of it (plural, past tense).

## Fields (all required unless marked optional)

- \`slot\`: the code, e.g. "S03"
- \`word\`: the word
- \`translation\`: Russian, the main meaning first, a few words at most ("запасы", "забирать, получать"). This is what the learner sees and must answer to, so it must point to THIS word and not to a big set of synonyms.
- \`difficulty\`: "easy" | "medium" | "hard"
- \`risk\`: 1-5, how easy it is to misspell (1 = simple, 5 = very tricky)
- \`partOfSpeech\`: one of ${PARTS.join(', ')}
- \`definition\`: a simple English definition, 4-14 words, written without using the word itself
- \`example\`: a natural sentence of 6-14 words that uses the word **exactly in this form** (no plural or past tense; the learner will later get this sentence with a gap). The context must show the meaning.
- \`alternatives\` (optional): other English words that are a correct answer to the same Russian translation, separated by ";" (only real synonyms, usually empty)
- \`rule\` (optional): a spelling memory hint of at most 100 characters ("two c, one s"), usually empty

## Output format

[
  {"slot": "S03", "word": "accommodation", "translation": "жильё, проживание", "difficulty": "hard", "risk": 5, "partOfSpeech": "noun",
   "definition": "a place where you can live or stay", "example": "The price includes accommodation for three nights.", "alternatives": "", "rule": "two c, two m"}
]

Before you answer, check each entry: the slot code exists, the word is not in the list, the example contains the word in exactly this form, the definition does not contain the word, and the Russian translation is correct and specific.`
    writePrompt('words', `words-${pad(index + 1)}.md`, text)
  })
  console.log(`words: ${chunk(all, 6).length} prompts for ${all.length} slots -> research/plexity/prompts/words/`)
}

function wordsMerge(file) {
  const { text, header, rows, eol } = library()
  const bySlot = new Map(slots(rows).map((slot) => [slot.code, slot]))
  const knownWord = new Set(rows.map((row) => row.word.toLowerCase()))
  const knownPrompt = new Set(rows.map((row) => row.translation.toLowerCase()))
  const knownId = new Set(rows.map((row) => row.word_id))
  const answer = JSON.parse(readFileSync(file, 'utf8'))
  const added = []
  let rejected = 0
  const reject = (item, why) => {
    rejected += 1
    console.log(`REJECT ${item.slot ?? '?'} ${item.word ?? '?'}: ${why}`)
  }
  for (const item of answer) {
    const slot = bySlot.get(item.slot)
    const word = String(item.word ?? '').trim()
    const why = []
    if (!slot) why.push(`unknown slot ${item.slot}`)
    if (!/^[A-Za-z][A-Za-z '’-]*$/.test(word) || word.length > 60 || word.split(' ').length > 3) why.push('word is not 1-3 English words')
    const translation = String(item.translation ?? '').trim()
    if (!/[а-яё]/i.test(translation) || translation.length > 120) why.push('translation must be Russian and short')
    if (!['easy', 'medium', 'hard'].includes(item.difficulty)) why.push(`difficulty ${item.difficulty}`)
    if (!(Number.isInteger(item.risk) && item.risk >= 1 && item.risk <= 5)) why.push(`risk ${item.risk}`)
    if (!PARTS.includes(item.partOfSpeech)) why.push(`partOfSpeech ${item.partOfSpeech}`)
    const example = String(item.example ?? '').trim()
    const definition = String(item.definition ?? '').trim()
    const count = example.split(/\s+/).length
    if (count < 5 || count > 18 || example.length > 200) why.push(`example has ${count} words`)
    if (word && !hasWord(example, word)) why.push('example does not contain the word in this exact form')
    if (definition.length < 8 || definition.length > 140 || (word && hasWord(definition, word)))
      why.push('definition missing, too long or contains the word')
    const rule = String(item.rule ?? '').trim()
    if (rule.length > 120) why.push('rule too long')
    const alternatives = String(item.alternatives ?? '').trim()
    for (const alt of alternatives
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean))
      if (!/^[A-Za-z][A-Za-z '’-]*$/.test(alt) || alt.toLowerCase() === word.toLowerCase()) why.push(`bad alternative "${alt}"`)
    if (knownWord.has(word.toLowerCase())) why.push('word already in the library or earlier in this answer')
    if (knownPrompt.has(translation.toLowerCase())) why.push('the Russian translation is already the prompt of another word')
    if (skip.has(word.toLowerCase())) why.push('dropped in review')
    const id = slot ? `${slot.topic_id}-${slug(slot.subtopic)}-${slug(word)}` : ''
    if (knownId.has(id)) why.push('word id already exists')
    if (why.length) {
      reject(item, why.join('; '))
      continue
    }
    knownWord.add(word.toLowerCase())
    knownPrompt.add(translation.toLowerCase())
    knownId.add(id)
    const values = Object.fromEntries(header.map((key) => [key, '']))
    Object.assign(values, {
      word_id: id,
      word,
      translation,
      topic_id: slot.topic_id,
      topic: slot.topic,
      subtopic: slot.subtopic,
      difficulty: item.difficulty,
      risk: String(item.risk),
      rule,
      example,
      definition,
      part_of_speech: item.partOfSpeech,
      library: slot.library,
      source: 'built-in',
      alternatives,
    })
    added.push(header.map((key) => values[key]))
  }
  const perSlot = new Map()
  for (const values of added) perSlot.set(values[3], (perSlot.get(values[3]) ?? 0) + 1)
  console.log(`\naccepted ${added.length}, rejected ${rejected}`)
  console.log('per topic:', Object.fromEntries(perSlot))
  if (apply && added.length) {
    const body = text.endsWith('\n') ? text : text + eol
    writeFileSync(CSV, body + added.map((values) => csvLine(values)).join(eol) + eol)
    console.log('written: library CSV (run: pnpm check:library)')
  }
}

// ======================================================================================================================
// EXAMPLES — a second example for words that have none
// ======================================================================================================================
function examplesPrompts() {
  const { rows } = library()
  const need = rows.filter((row) => !row.extra_example)
  chunk(need, 36).forEach((group, index) => {
    const list = group
      .map((row) => `- ${row.word_id} | ${row.word} | ${row.translation} | ${row.part_of_speech} | e.g. ${row.example}`)
      .join('\n')
    const text = `${INTRO}

## Your task in this round

For each of the ${group.length} words below write **one new example sentence**. Each word already has one example (after "e.g."); yours must show the word in a DIFFERENT situation.

${list}

## Rules for the sentence

- 6-16 words, natural, with a capital letter and a full stop or question mark.
- It must contain the word **exactly in the form written in the list** (no plural, no past tense, no other word form). The sentence will later be used with a gap, so there must be one clear right word for the gap: if two different words of the same kind fit, change the sentence.
- The meaning must match the Russian translation, the part of speech and the first example. Easy surrounding words (the learner is tested on the target word).
- A different topic or situation from the first example, not just the same sentence with one word changed.
- Neutral content. No names of brands, politics, religion, violence.

## Output format

[
  {"word_id": "travel-and-culture-on-the-plane-crew", "extra_example": "The crew checked every seat before take-off."}
]

Use the word_id exactly as written. Before you answer, check each sentence: it contains the word in the listed form and no other word could fill the gap.`
    writePrompt('examples', `examples-${pad(index + 1)}.md`, text)
  })
  console.log(
    `examples: ${chunk(need, 36).length} prompts for ${need.length} words without a second example -> research/plexity/prompts/examples/`,
  )
}

function examplesMerge(file) {
  const { text, header, rows, eol } = library()
  const byId = new Map(rows.map((row) => [row.word_id, row]))
  const answer = JSON.parse(readFileSync(file, 'utf8'))
  const lines = text.split(/\r?\n/)
  const ok = new Map()
  let rejected = 0
  for (const item of answer) {
    const row = byId.get(item.word_id)
    const sentence = String(item.extra_example ?? '').trim()
    const why = []
    if (!row) why.push('unknown word_id')
    else if (row.extra_example) why.push('already has a second example')
    const count = sentence.split(/\s+/).length
    if (count < 5 || count > 18 || sentence.length > 200) why.push(`${count} words`)
    if (row && !hasWord(sentence, row.word)) why.push('does not contain the word in this exact form')
    if (row && sentence.toLowerCase() === row.example.toLowerCase()) why.push('same as the first example')
    if (!/^[A-Z"“‘]/.test(sentence) || !/[.?!]["”]?$/.test(sentence)) why.push('capital letter or ending missing')
    if (/ {2}/.test(sentence)) why.push('double space')
    if (skip.has(String(item.word_id).toLowerCase()) || skip.has(sentence.toLowerCase())) why.push('dropped in review')
    if (ok.has(item.word_id)) why.push('twice in this answer')
    if (why.length) {
      rejected += 1
      console.log(`REJECT ${item.word_id}: ${why.join('; ')}\n       ${sentence}`)
    } else ok.set(item.word_id, sentence)
  }
  console.log(`\naccepted ${ok.size}, rejected ${rejected}`)
  if (apply && ok.size) {
    const extraAt = header.indexOf('extra_example')
    const out = lines.map((line) => {
      const id = line.slice(0, line.indexOf(','))
      if (!ok.has(id)) return line
      const values = parseCsv(line)[0]
      while (values.length < header.length) values.push('')
      values[extraAt] = ok.get(id)
      values[extraAt + 1] = 'written'
      return csvLine(values)
    })
    writeFileSync(CSV, out.join(eol))
    console.log('written: library CSV (run: pnpm check:library)')
  }
}

// ======================================================================================================================
// LEVEL CHECK QUESTIONS
// ======================================================================================================================
const LEVELS = { 1: 'A2', 2: 'B1', 3: 'B2', 4: 'C1' }
function levelPrompts() {
  const per = { gap: 8, mistake: 6, phrase: 6, formation: 4, dictation: 6 }
  for (const level of [1, 2, 3, 4]) {
    const text = `${INTRO}

## Your task in this round

Write new questions for the **level check** of the app, all at level **${LEVELS[level]}**. Only this level: a learner who is ${LEVELS[level]} should be able to answer them and a weaker learner should not.
Count: ${per.gap} gap-fills, ${per.mistake} find-the-mistake, ${per.phrase} word/collocation/phrasal-verb items, ${per.formation} word-formation, ${per.dictation} dictation sentences.
Vary the grammar and vocabulary points and the topics (home, school, work, travel, health, technology, nature, shopping). Do not write questions about articles (a/an/the).

## Formats (answer with ONE JSON object with these five arrays)

1. **gap** - a sentence with one gap and 4 options, exactly one is correct.
   {"prompt": "She ___ to school every day.", "answer": "goes", "wrong": ["go", "going", "is go"], "explain": "He, she and it take -s in the present simple."}
   - exactly one ___ in the prompt; 3 wrong options that are real mistakes learners make, and clearly wrong; the 4 options are all different.
2. **mistake** - a sentence with exactly ONE mistake; the sentence is split into exactly 4 parts and the learner picks the part with the mistake.
   {"sentence": "She don’t like coffee.", "parts": ["She", "don’t", "like", "coffee"], "answer": "don’t", "explain": "With she, use doesn’t."}
   - every part must appear in the sentence exactly as written; the answer is one of the parts; only one part has a mistake.
3. **phrase** - a collocation, phrasal verb or word-choice gap with 4 options.
   {"prompt": "I need to ___ a decision soon.", "answer": "make", "wrong": ["do", "get", "have"], "explain": "We say make a decision."}
4. **formation** - the learner writes the correct form of the word in capitals; the word is given in brackets at the end.
   {"prompt": "She is a very good ___ . (SING)", "answer": "singer", "explain": "Add -er for the person who sings."}
   - the prompt has one ___ and the base word in capitals in brackets; if two forms are correct, join them with | ("decision|indecision").
5. **dictation** - one complete sentence of 6-16 words that a voice reads aloud and the learner types.
   {"sentence": "My brother plays football on Sundays.", "alternatives": ["My brother plays football on Sunday."]}
   - alternatives: other ways to write what was heard that must also count (digits for number words, a contraction); usually empty.

## Rules

- Every \`explain\` is a hint of **at most 14 words**, plain English.
- Exactly one right answer, no matter how you read the sentence. A different option must never also be correct.
- No leaks: the other words in the sentence must not give the answer away.
- Natural English; avoid British/American differences.

## Output format

{"gap": [...], "mistake": [...], "phrase": [...], "formation": [...], "dictation": [...]}

Before you answer, test every option of every gap and check that exactly one fits.`
    writePrompt('level-check', `level-${level}-${LEVELS[level]}.md`, text)
  }
  console.log('level: 4 prompts (A2, B1, B2, C1) -> research/plexity/prompts/level-check/')
}

function levelMerge(file) {
  const batch = flag('batch')
  const levelMatch = /level-(\d)/.exec(file)
  const level = Number(flag('level') ?? levelMatch?.[1] ?? 0)
  if (!batch || ![1, 2, 3, 4].includes(level)) {
    console.log('needs --batch=NN and the level (file name with level-N, or --level=N)')
    process.exit(1)
  }
  const source = readFileSync(LEVEL_FILE, 'utf8')
  const answer = JSON.parse(readFileSync(file, 'utf8'))
  const existing = new Set([...source.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((match) => match[1].toLowerCase().replace(/\\'/g, "'")))
  const q = (text) => JSON.stringify(text)
  const out = { grammar: [], vocabulary: [], formation: [], dictation: [] }
  let n = 0
  let rejected = 0
  const id = () => `b${batch}-${level}-${String(++n).padStart(2, '0')}`
  const short = (explain) =>
    String(explain ?? '')
      .trim()
      .split(/\s+/).length <= 14 && String(explain ?? '').trim().length > 0
  const norm = (text) => String(text).toLowerCase().replace(/\s+/g, ' ').trim()
  const check = (label, text, why) => {
    if (existing.has(norm(text))) why.push('already in the bank')
    if (skip.has(norm(text))) why.push('dropped in review')
    if (why.length) {
      rejected += 1
      console.log(`REJECT ${label}: ${text}\n       ${why.join('; ')}`)
      return false
    }
    existing.add(norm(text))
    return true
  }
  const choices = (item, why) => {
    const options = [item.answer, ...(item.wrong ?? [])].map(String)
    if (options.length !== 4 || new Set(options.map((option) => option.toLowerCase())).size !== 4)
      why.push('needs the answer and 3 different wrong options')
    if (!short(item.explain)) why.push('explanation missing or over 14 words')
  }
  for (const item of answer.gap ?? []) {
    const why = []
    if (String(item.prompt).split('___').length !== 2) why.push('exactly one ___ needed')
    choices(item, why)
    if (/^(a|an|the)$/i.test(item.answer)) why.push('article questions already covered')
    if (check('gap', item.prompt, why))
      out.grammar.push(`  gap(${q(id())}, ${level}, ${q(item.prompt)}, ${q(item.answer)}, ${q(item.wrong)}, ${q(item.explain)}),`)
  }
  for (const item of answer.mistake ?? []) {
    const why = []
    const parts = item.parts ?? []
    if (parts.length !== 4 || new Set(parts.map((part) => part.toLowerCase())).size !== 4) why.push('exactly 4 different parts needed')
    if (!parts.includes(item.answer)) why.push('answer is not one of the parts')
    for (const part of parts) if (!String(item.sentence).includes(part)) why.push(`part "${part}" is not in the sentence`)
    if (!short(item.explain)) why.push('explanation missing or over 14 words')
    if (check('mistake', item.sentence, why))
      out.grammar.push(`  mistake(${q(id())}, ${level}, ${q(item.sentence)}, ${q(parts)}, ${q(item.answer)}, ${q(item.explain)}),`)
  }
  for (const item of answer.phrase ?? []) {
    const why = []
    if (String(item.prompt).split('___').length !== 2) why.push('exactly one ___ needed')
    choices(item, why)
    if (check('phrase', item.prompt, why))
      out.vocabulary.push(`  phrase(${q(id())}, ${level}, ${q(item.prompt)}, ${q(item.answer)}, ${q(item.wrong)}, ${q(item.explain)}),`)
  }
  for (const item of answer.formation ?? []) {
    const why = []
    if (String(item.prompt).split('___').length !== 2 || !/\([A-Z]+\)/.test(item.prompt)) why.push('needs one ___ and the base word (WORD)')
    if (!short(item.explain) || !String(item.answer ?? '').trim()) why.push('answer or explanation missing')
    if (check('formation', item.prompt, why))
      out.formation.push(`  formation(${q(id())}, ${level}, ${q(item.prompt)}, ${q(item.answer)}, ${q(item.explain)}),`)
  }
  for (const item of answer.dictation ?? []) {
    const why = []
    const sentence = String(item.sentence ?? '').trim()
    if (!/[.?]$/.test(sentence) || sentence.split(/\s+/).length < 5 || sentence.split(/\s+/).length > 18)
      why.push('a complete sentence of 5-18 words ending in . or ?')
    if (check('dictation', sentence, why)) {
      const alternatives = (item.alternatives ?? []).filter(Boolean)
      out.dictation.push(`  dictation(${q(id())}, ${level}, ${q(sentence)}${alternatives.length ? `, ${q(alternatives)}` : ''}),`)
    }
  }
  const total = Object.values(out).reduce((sum, list) => sum + list.length, 0)
  console.log(
    `\naccepted ${total} (grammar ${out.grammar.length}, vocabulary ${out.vocabulary.length}, formation ${out.formation.length}, dictation ${out.dictation.length}), rejected ${rejected}`,
  )
  if (apply && total) {
    let next = source
    const eol = source.includes('\r\n') ? '\r\n' : '\n'
    const arrays = { grammar: 'grammarItems', vocabulary: 'vocabularyItems', formation: 'formationItems', dictation: 'dictationItems' }
    for (const [group, name] of Object.entries(arrays)) {
      if (!out[group].length) continue
      const start = next.indexOf(`const ${name}: LevelItem[] = [`)
      const close = next.indexOf(`${eol}]${eol}`, start)
      if (start < 0 || close < 0) throw new Error(`cannot find ${name}`)
      next = next.slice(0, close + eol.length) + out[group].join(eol) + eol + next.slice(close + eol.length)
    }
    writeFileSync(LEVEL_FILE, next)
    console.log('written: levelCheckDeep.ts (run: pnpm exec prettier --write src/data/levelCheckDeep.ts && pnpm check)')
  }
}

// ======================================================================================================================
const table = {
  prompts: { words: wordsPrompts, examples: examplesPrompts, level: levelPrompts },
  merge: { words: wordsMerge, examples: examplesMerge, level: levelMerge },
}
const run = table[command]?.[kind]
if (!run) {
  console.log('usage: node scripts/plexity-content.mjs prompts|merge words|examples|level [file] [--apply] [--skip=list.json] [--batch=NN]')
  process.exit(1)
}
run(rest.find((item) => !item.startsWith('--')))
