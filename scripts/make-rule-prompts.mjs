// Prompts for the assistant: three times as many examples and exercises for every rule (it adds twice what exists now).
// Reads the rules and what already exists (src/data/builtInRules.json, the earlier packs, the bundled exercises) and the
// counts that are in the database now (research/plexity/rule-counts.json, from a read-only query).
// Writes research/plexity/prompts/rules3-NN.md. Run: node scripts/make-rule-prompts.mjs
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'

const rules = JSON.parse(readFileSync('src/data/builtInRules.json', 'utf8'))
const bundled = JSON.parse(readFileSync('src/data/builtInRuleExercises.json', 'utf8'))
const counts = JSON.parse(readFileSync('research/plexity/rule-counts.json', 'utf8'))
const packs = ['database/rules-import/more-practice-pack.json', 'database/rules-import/more-practice-pack-2.json']
  .filter((file) => existsSync(file))
  .map((file) => JSON.parse(readFileSync(file, 'utf8')))

const out = 'research/plexity/prompts/'
mkdirSync(out, { recursive: true })
for (const name of readdirSync(out)) if (/^rules3-\d+\.md$/.test(name)) rmSync(out + name)

const PER_FILE_LIMIT = 110 // items (examples + exercises) one answer can hold comfortably
const tasks = []
for (const rule of rules.rules) {
  const have = counts[rule.slug]
  if (!have) throw new Error(`no counts for ${rule.slug}`)
  const examples = rules.examples.filter((example) => example.rule_id === rule.id)
  const exercises = [
    ...(bundled[rule.id] ?? []).map((item) => ({
      type: item.exercise_type,
      prompt: item.prompt,
      answer: item.answer,
      choices: item.choices,
    })),
    ...packs.flatMap((pack) => pack.rules.filter((item) => item.slug === rule.slug).flatMap((item) => item.exercises)),
  ]
  // the shape of what exists: the share of correct / incorrect examples and of every exercise type
  const share = (list, key, kinds) =>
    Object.fromEntries(kinds.map((kind) => [kind, list.filter((item) => (item[key] ?? item.exercise_type) === kind).length]))
  const exampleMix = share(examples, 'example_type', ['correct', 'incorrect', 'exception'])
  const exerciseKinds = ['fill_gap', 'multiple_choice', 'correct_word', 'spell', 'grammar']
  const exerciseMix = share(exercises, 'type', exerciseKinds)
  const addExamples = have.ex * 2
  const addExercises = have.exr * 2
  const split = (total, mix, kinds) => {
    const sum = kinds.reduce((s, kind) => s + mix[kind], 0)
    if (!sum) return null
    const result = Object.fromEntries(kinds.map((kind) => [kind, Math.round((mix[kind] / sum) * total)]))
    const diff = total - Object.values(result).reduce((s, value) => s + value, 0)
    const biggest = kinds.reduce((a, b) => (mix[a] >= mix[b] ? a : b))
    result[biggest] += diff
    return Object.fromEntries(Object.entries(result).filter(([, value]) => value > 0))
  }
  const exampleSplit = split(addExamples, exampleMix, ['correct', 'incorrect', 'exception']) ?? {
    correct: Math.round(addExamples * 0.4),
    incorrect: Math.ceil(addExamples * 0.6),
  }
  const exerciseSplit = split(addExercises, exerciseMix, exerciseKinds) ?? {
    fill_gap: Math.round(addExercises * 0.5),
    multiple_choice: Math.ceil(addExercises * 0.5),
  }
  const sample = (type) => exercises.filter((item) => item.type === type).slice(0, 3)
  const base = { rule, examples, exercises, exampleSplit, exerciseSplit, sample }
  if (addExamples + addExercises > PER_FILE_LIMIT) {
    // a big rule: the examples in one file, the exercises in another
    tasks.push({ ...base, part: 'examples', total: addExamples })
    tasks.push({ ...base, part: 'exercises', total: addExercises })
  } else tasks.push({ ...base, part: 'both', total: addExamples + addExercises })
}

const describeType = {
  fill_gap: 'fill_gap: a sentence with exactly one gap written as ___ ; "answer" is the one word or phrase that fills it.',
  multiple_choice:
    'multiple_choice: a sentence with one gap ___ ; "prompt" starts with "Choose the word: "; "choices" has the right answer and 1-2 wrong options; "answer" is exactly one of the choices.',
  correct_word: 'correct_word: "prompt" is ONE misspelled or wrong word, "answer" is the correct word (no sentence).',
  spell:
    'spell: "prompt" starts with "Spell the word: " and describes the word (its meaning, or "the past form of buy"); "answer" is the word.',
  grammar: 'grammar: like fill_gap, for a grammar form.',
}
const line = (item) => JSON.stringify(item)

tasks.forEach((task, index) => {
  const { rule, examples, exercises, exampleSplit, exerciseSplit, sample } = task
  const file = `rules3-${String(index + 1).padStart(2, '0')}.md`
  const wantExamples = task.part !== 'exercises'
  const wantExercises = task.part !== 'examples'
  const confusable = rule.metadata?.confusable_words?.length ? `Confusable words: ${rule.metadata.confusable_words.join(', ')}.` : ''
  const total = (split) => Object.values(split).reduce((s, value) => s + value, 0)
  const lines = []
  lines.push(`# NEW, SEPARATE TASK (${file})`)
  lines.push(
    `Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "${rule.title}" (slug: ${rule.slug})${task.part === 'both' ? '' : `, ${task.part} only`}.`,
  )
  lines.push('')
  lines.push(
    `You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.`,
  )
  lines.push('')
  lines.push('## The rule')
  lines.push(`- Title: ${rule.title}`)
  lines.push(`- Explanation: ${rule.short_explanation}`)
  if (rule.mnemonic) lines.push(`- Memory hook: ${rule.mnemonic}`)
  if (confusable) lines.push(`- ${confusable}`)
  lines.push('')
  lines.push('## What to write (exactly these numbers)')
  if (wantExamples)
    lines.push(
      `- examples: ${total(exampleSplit)} in total: ${Object.entries(exampleSplit)
        .map(([kind, n]) => `${n} "${kind}"`)
        .join(', ')}.`,
    )
  if (wantExercises)
    lines.push(
      `- exercises: ${total(exerciseSplit)} in total: ${Object.entries(exerciseSplit)
        .map(([kind, n]) => `${n} ${kind}`)
        .join(', ')}.`,
    )
  lines.push('')
  lines.push('## Rules for every item')
  lines.push(
    '- British English spelling. Everyday sentences of 5-12 words, plain words (A2-B1), natural, grammatical, no slang, no proper names that are hard to spell.',
  )
  lines.push(
    '- Vary the topics, subjects, tenses and sentence shapes (home, school, work, travel, food, family, hobbies). Do not start many sentences the same way.',
  )
  lines.push(
    '- Do not repeat or lightly reword any sentence in "Already exists" below, and do not repeat a sentence inside your own answer.',
  )
  lines.push(
    '- Every item must be unambiguous: for a gap or a choice exactly ONE answer is correct. If two answers could fit the sentence, change the sentence.',
  )
  lines.push('- The sentence itself must test THIS rule, not another one.')
  if (wantExamples) {
    lines.push('')
    lines.push('## Examples (each item: {"type","text","correction","note"})')
    lines.push('- "correct": a correct sentence that shows the rule; no "correction".')
    lines.push(
      '- "incorrect": a sentence with a mistake against THIS rule (a typical mistake of a learner); "correction" is the same sentence fixed, changing only what is wrong.',
    )
    lines.push('- "exception": only if the rule has exceptions: a correct sentence with the exception; no "correction".')
    lines.push('- "note": 3-9 words that say why (e.g. "Accept = agree to take"); always include it.')
  }
  if (wantExercises) {
    lines.push('')
    lines.push('## Exercises (each item: {"type","prompt","answer"} and "choices" for multiple_choice)')
    for (const kind of Object.keys(exerciseSplit)) lines.push(`- ${describeType[kind] ?? kind}`)
    const shown = Object.keys(exerciseSplit).flatMap((kind) => sample(kind).map(line))
    if (shown.length) {
      lines.push('')
      lines.push('Format examples of existing exercises (copy the shape, not the content):')
      lines.push('```')
      lines.push(...shown)
      lines.push('```')
    }
  }
  lines.push('')
  lines.push('## Output format')
  lines.push(
    'ONE code block (three backticks + json) holding one JSON object: {"slug":"' +
      rule.slug +
      '","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.' +
      (wantExamples ? '' : ' Use "examples":[].') +
      (wantExercises ? '' : ' Use "exercises":[].'),
  )
  lines.push('')
  lines.push(
    'Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "' +
      rule.slug +
      '".',
  )
  lines.push('')
  lines.push(
    `## Already exists (${examples.length} examples${exercises.length ? `, ${exercises.length} known exercises` : ''}; do not repeat)`,
  )
  lines.push('Examples:')
  for (const example of examples) lines.push(`- ${example.text}${example.correction ? `  -> ${example.correction}` : ''}`)
  if (exercises.length) {
    lines.push('')
    lines.push('Exercise prompts:')
    for (const exercise of exercises) lines.push(`- ${exercise.prompt}  [${exercise.answer}]`)
  }
  writeFileSync(out + file, lines.join('\n') + '\n')
})

const totalExamples = tasks.reduce(
  (s, task) => s + (task.part === 'exercises' ? 0 : task.exampleSplit && Object.values(task.exampleSplit).reduce((a, b) => a + b, 0)),
  0,
)
const totalExercises = tasks.reduce(
  (s, task) => s + (task.part === 'examples' ? 0 : Object.values(task.exerciseSplit).reduce((a, b) => a + b, 0)),
  0,
)
console.log(`${tasks.length} files, ${totalExamples} new examples, ${totalExercises} new exercises`)
