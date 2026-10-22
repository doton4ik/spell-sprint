// More examples and exercises for the RULES, written by Plexity and merged here:
//   node scripts/plexity-rules.mjs prompts                         ready prompts -> research/plexity/prompts/
//   node scripts/plexity-rules.mjs merge <answer.json> [--apply] [--skip=list.json]
// A merge only reports unless --apply. --apply adds the accepted rows to database/rules-import/more-practice-pack-2.json
// and runs scripts/build-more-practice-pack.mjs, which writes database/content-pack-5-*.sql (the user runs these in the
// Supabase SQL Editor) and the offline examples in src/data/builtInRules.json. A --skip list is a JSON array of texts/prompts to drop.
import { checkRound, readAnswer } from './plexity-json.mjs'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const [command, ...rest] = process.argv.slice(2)
const apply = rest.includes('--apply')
const skipFile = rest.find((item) => item.startsWith('--skip='))?.slice(7)
const skip = new Set((skipFile ? JSON.parse(readFileSync(skipFile, 'utf8')) : []).map((item) => String(item).toLowerCase()))
const PACK2 = 'database/rules-import/more-practice-pack-2.json'
const PACK1 = 'database/rules-import/more-practice-pack.json'

const builtIn = JSON.parse(readFileSync('src/data/builtInRules.json', 'utf8'))
const bundled = JSON.parse(readFileSync('src/data/builtInRuleExercises.json', 'utf8'))
const readPack = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { set: 'more-practice-v2', rules: [] })
const norm = (text) =>
  String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// Everything a rule already has: texts of examples, prompts of exercises (database seeds, bundled, pack 1, pack 2).
function existingFor(rule) {
  const packs = [readPack(PACK1), readPack(PACK2)]
  const fromPacks = packs.flatMap((pack) => pack.rules.filter((item) => item.slug === rule.slug))
  const examples = builtIn.examples
    .filter((example) => example.rule_id === rule.id)
    .map((example) => ({ type: example.example_type, text: example.text, correction: example.correction }))
  const exercises = [
    ...(bundled[rule.id] ?? []).map((exercise) => ({
      type: exercise.exercise_type,
      prompt: exercise.prompt,
      answer: exercise.answer,
      choices: exercise.choices,
    })),
    ...fromPacks.flatMap((item) => item.exercises),
  ]
  return { examples, exercises }
}

// Every prompt starts with a banner: a chat that still holds an earlier task must not answer that one again.
const banner = (name, covers) =>
  `# NEW, SEPARATE TASK (${name})\nIgnore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: ${covers}.\nYour answer must contain these items only.\n\n`
const FOOTER = `

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.`
const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size))
const pad = (number) => String(number).padStart(2, '0')

function prompts() {
  mkdirSync('research/plexity/prompts', { recursive: true })
  for (const name of readdirSync('research/plexity/prompts'))
    if (/^rules-.*\.md$/.test(name)) rmSync(`research/plexity/prompts/${name}`, { force: true })
  const ARTICLES = new Set(['a-or-an', 'a-or-the'])
  const groups = chunk(
    builtIn.rules.filter((rule) => rule.is_active !== false),
    2,
  ) // merged (inactive) rules get no prompts
  groups.forEach((group, index) => {
    const list = group
      .map((rule) => {
        const { examples, exercises } = existingFor(rule)
        const ex = examples
          .map((example) => `    - [${example.type}] ${example.text}${example.correction ? `  ->  ${example.correction}` : ''}`)
          .join('\n')
        const exr = exercises
          .slice(0, 14)
          .map(
            (exercise) =>
              `    - [${exercise.type}] ${exercise.prompt}  =>  ${exercise.answer}${exercise.choices ? `  (choices: ${exercise.choices.join(' / ')})` : ''}`,
          )
          .join('\n')
        return `### ${rule.slug} — ${rule.title}${ARTICLES.has(rule.slug) ? '  (article rule)' : ''}
Rule: ${rule.short_explanation}
Memory hint: ${rule.mnemonic || '-'}
Existing examples (do not repeat; ${examples.length}):
${ex}
Existing exercises (do not repeat; showing ${Math.min(14, exercises.length)} of ${exercises.length}):
${exr}`
      })
      .join('\n\n')
    const text = `You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the ${group.length} rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

${list}

## Examples (10 per rule)

- 4 of type "correct": a natural sentence that uses the rule correctly. 6 of type "incorrect": a sentence with the typical mistake learners make, and the same sentence corrected in "correction" (only the mistake changes). One mistake per sentence.
- "note": a short reason, at most 80 characters, naming the point of the rule ("Soft c before e: city, not sity").
- Sentences of 5-14 words, everyday topics, different words and structures. Easy words except the target of the rule.
- A word that is spelled wrongly must be a spelling mistake a real learner makes, not a random typo.

## Exercises (10 per rule), mix of these types

- "fill_gap": a sentence with one ___ and one correct word as "answer". The context must allow exactly one answer.
- "multiple_choice": a prompt with ___ (or "Choose the correct spelling: ...") and "choices" (2-4 options, all different, "answer" is exactly one of them).
- "correct_word": "prompt" is a wrongly spelled word, "answer" is the correct spelling (use only for spelling rules, not for the confusable-word or article rules).
- "spell": "prompt" like "Spell the word: the plural of baby." and "answer" the one correct word (use only for rules where a form is built: plural, past tense, comparative, suffix).
Choose the types that fit the rule: spelling-form rules mostly correct_word, spell and multiple_choice; confusable pairs mostly fill_gap and multiple_choice; article rules fill_gap and multiple_choice with the options a / an / the / no article ("no article" written exactly that way).
Every exercise is independent: no "see the sentence above". Every answer must be unambiguous.

## Output format

One array with one object per rule listed in this round. The shape (the values are placeholders, NOT content to copy):

[
  {"slug": "<a slug from the list above>",
   "examples": [{"type": "correct", "text": "<sentence>", "note": "<short reason>"},
                {"type": "incorrect", "text": "<sentence with the typical mistake>", "correction": "<the same sentence corrected>", "note": "<short reason>"}],
   "exercises": [{"type": "fill_gap", "prompt": "<sentence with one ___>", "answer": "<word>"},
                 {"type": "multiple_choice", "prompt": "<sentence with ___>", "answer": "<word>", "choices": ["<word>", "<word>"]}]}
]

Use the slug exactly as written. Before you answer, check every item against the rule above: wrong sentences must really be wrong, correct ones really correct, each exercise has exactly one answer.`
    writeFileSync(
      `research/plexity/prompts/rules-${pad(index + 1)}.md`,
      banner(`rules-${pad(index + 1)}`, group.map((rule) => rule.slug).join(', ')) + text + FOOTER + '\n',
    )
  })
  console.log(`rules: ${groups.length} prompts for ${builtIn.rules.length} rules -> research/plexity/prompts/`)
}

function merge(file) {
  const answer = readAnswer(file)
  checkRound(
    file,
    answer.map((item) => item.slug),
  )
  const pack = readPack(PACK2)
  const rulesBySlug = new Map(builtIn.rules.map((rule) => [rule.slug, rule]))
  let rejected = 0
  let addedExamples = 0
  let addedExercises = 0
  const reject = (slug, text, why) => {
    rejected += 1
    console.log(`REJECT [${slug}] ${text}\n       ${why.join('; ')}`)
  }
  for (const item of answer) {
    const rule = rulesBySlug.get(item.slug)
    if (!rule) {
      console.log(`UNKNOWN RULE ${item.slug}`)
      continue
    }
    const existing = existingFor(rule)
    let target = pack.rules.find((entry) => entry.slug === item.slug)
    if (!target) {
      target = { slug: item.slug, examples: [], exercises: [] }
      pack.rules.push(target)
    }
    const texts = new Set([
      ...existing.examples.map((example) => norm(example.text)),
      ...target.examples.map((example) => norm(example.text)),
    ])
    const prompts = new Set([
      ...existing.exercises.map((exercise) => norm(exercise.prompt)),
      ...target.exercises.map((exercise) => norm(exercise.prompt)),
    ])
    for (const example of item.examples ?? []) {
      const text = String(example.text ?? '').trim()
      const why = []
      if (!['correct', 'incorrect'].includes(example.type)) why.push(`type ${example.type}`)
      const count = text.split(/\s+/).length
      if (count < 4 || count > 18 || text.length > 200) why.push(`${count} words`)
      if (example.type === 'incorrect') {
        const correction = String(example.correction ?? '').trim()
        if (!correction) why.push('an incorrect example needs a correction')
        else if (norm(correction) === norm(text)) why.push('the correction is the same as the text')
      }
      if (String(example.note ?? '').length > 100) why.push('note longer than 100 characters')
      if (texts.has(norm(text)) || (example.type === 'incorrect' && texts.has(norm(example.correction)) && false))
        why.push('duplicate example')
      if (skip.has(norm(text))) why.push('dropped in review')
      if (why.length) {
        reject(item.slug, text, why)
        continue
      }
      texts.add(norm(text))
      const clean = { type: example.type, text }
      if (example.type === 'incorrect') clean.correction = String(example.correction).trim()
      clean.note = String(example.note ?? '').trim() || (example.type === 'correct' ? 'Correct use' : 'Common mistake')
      target.examples.push(clean)
      addedExamples += 1
    }
    for (const exercise of item.exercises ?? []) {
      const prompt = String(exercise.prompt ?? '').trim()
      const answerText = String(exercise.answer ?? '').trim()
      const why = []
      if (!['fill_gap', 'multiple_choice', 'correct_word', 'spell'].includes(exercise.type)) why.push(`type ${exercise.type}`)
      if (!prompt || !answerText) why.push('prompt or answer missing')
      if (exercise.type === 'fill_gap' && prompt.split('___').length !== 2) why.push('a fill_gap prompt needs exactly one ___')
      if (
        exercise.type === 'fill_gap' &&
        new RegExp(`\\b${answerText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(prompt.replace('___', ' '))
      )
        why.push('the answer is in the prompt')
      if (exercise.type === 'multiple_choice') {
        const choices = exercise.choices ?? []
        if (choices.length < 2 || choices.length > 4 || new Set(choices.map((choice) => norm(choice))).size !== choices.length)
          why.push('2-4 different choices needed')
        if (choices.filter((choice) => choice === exercise.answer).length !== 1) why.push('the answer must be exactly one of the choices')
        if (!prompt.includes('___') && !/choose/i.test(prompt)) why.push('the prompt needs a ___ or "Choose ..."')
      }
      if (exercise.type === 'correct_word' && norm(prompt) === norm(answerText)) why.push('the misspelled word equals the answer')
      if (prompts.has(norm(prompt))) why.push('duplicate prompt')
      if (skip.has(norm(prompt))) why.push('dropped in review')
      if (why.length) {
        reject(item.slug, prompt, why)
        continue
      }
      prompts.add(norm(prompt))
      const clean = { type: exercise.type, prompt, answer: answerText }
      if (exercise.type === 'multiple_choice') clean.choices = exercise.choices
      target.exercises.push(clean)
      addedExercises += 1
    }
  }
  console.log(`\naccepted ${addedExamples} examples and ${addedExercises} exercises, rejected ${rejected}`)
  if (apply && (addedExamples || addedExercises)) {
    writeFileSync(PACK2, `${JSON.stringify(pack, null, 2)}\n`)
    execFileSync('node', ['scripts/build-more-practice-pack.mjs'], { stdio: 'inherit' })
    console.log('written: pack 2 JSON, SQL (database/content-pack-5-*), built-in examples. Run pnpm check; the user runs the SQL.')
  }
}

if (command === 'prompts') prompts()
else if (command === 'merge' && rest.find((item) => !item.startsWith('--'))) merge(rest.find((item) => !item.startsWith('--')))
else console.log('usage: node scripts/plexity-rules.mjs prompts | merge <answer.json> [--apply] [--skip=list.json]')
