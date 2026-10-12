// Checks the rule content that ships with the app (src/data/builtInRules.json and builtInRuleExercises.json)
// and that the article SQL file still matches it. Run by `pnpm check`.
import { readFileSync } from 'node:fs'

const rules = JSON.parse(readFileSync('src/data/builtInRules.json', 'utf8'))
const exercisesByRule = JSON.parse(readFileSync('src/data/builtInRuleExercises.json', 'utf8'))
const sql = readFileSync('database/content-pack-3-articles.sql', 'utf8')
const categories = new Set([...readFileSync('src/data/ruleCategories.ts', 'utf8').matchAll(/slug: '([a-z_]+)'/g)].map((match) => match[1]))
const ruleTypes = new Set(['language_rule', 'exception', 'confusing_words', 'personal_note'])
const exampleTypes = new Set(['correct', 'incorrect', 'exception'])

const problems = []
const fail = (message) => problems.push(message)

const ids = new Set()
const slugs = new Set()
for (const rule of rules.rules) {
  if (ids.has(rule.id)) fail(`duplicate rule id ${rule.id}`)
  if (slugs.has(rule.slug)) fail(`duplicate rule slug ${rule.slug}`)
  ids.add(rule.id)
  slugs.add(rule.slug)
  if (!categories.has(rule.category)) fail(`${rule.slug}: unknown category "${rule.category}"`)
  if (!ruleTypes.has(rule.rule_type)) fail(`${rule.slug}: unknown rule_type "${rule.rule_type}"`)
  if (!rule.title?.trim() || !rule.short_explanation?.trim()) fail(`${rule.slug}: title or explanation is empty`)
}

const exampleIds = new Set()
for (const example of rules.examples) {
  if (!ids.has(example.rule_id)) fail(`example ${example.id} points at a rule that does not exist`)
  if (exampleIds.has(example.id)) fail(`duplicate example id ${example.id}`)
  exampleIds.add(example.id)
  if (!exampleTypes.has(example.example_type)) fail(`example ${example.id}: unknown type "${example.example_type}"`)
  if (!example.text?.trim()) fail(`example ${example.id}: empty text`)
  if (example.example_type === 'incorrect' && !example.correction)
    fail(`example "${example.text}": an incorrect example needs a correction`)
}

let exerciseCount = 0
const exerciseIds = new Set()
for (const [ruleId, list] of Object.entries(exercisesByRule)) {
  const rule = rules.rules.find((item) => item.id === ruleId)
  if (!rule) {
    fail(`exercises for an unknown rule id ${ruleId}`)
    continue
  }
  const prompts = new Set()
  for (const exercise of list) {
    exerciseCount += 1
    const label = `${rule.slug}: "${exercise.prompt}"`
    if (exerciseIds.has(exercise.id)) fail(`duplicate exercise id ${exercise.id}`)
    exerciseIds.add(exercise.id)
    if (exercise.rule_id !== ruleId) fail(`${label}: rule_id does not match the key`)
    if (prompts.has(exercise.prompt)) fail(`${label}: duplicate prompt`)
    prompts.add(exercise.prompt)
    if (!exercise.prompt.includes('___')) fail(`${label}: the prompt has no ___ gap`)
    if (exercise.exercise_type === 'multiple_choice') {
      if (!Array.isArray(exercise.choices) || exercise.choices.length < 2) fail(`${label}: needs at least two choices`)
      else if (exercise.choices.filter((choice) => choice === exercise.answer).length !== 1)
        fail(`${label}: the answer must be exactly one of the choices`)
    }
    if (!sql.includes(exercise.id))
      fail(`${label}: missing from database/content-pack-3-articles.sql (run node scripts/build-articles-pack.mjs)`)
  }
  if (!sql.includes(ruleId)) fail(`${rule.slug}: missing from database/content-pack-3-articles.sql`)
}

// The "more practice" pack: new examples and exercises for rules that already exist (database/content-pack-4-more-practice-part1.sql).
const morePack = JSON.parse(readFileSync('database/rules-import/more-practice-pack.json', 'utf8'))
const moreExamplesSql = readFileSync('database/content-pack-4-more-practice-part1.sql', 'utf8')
const moreExercisesSql = readFileSync('database/content-pack-4-more-practice-part2.sql', 'utf8')
const exerciseTypes = new Set(['spell', 'correct_word', 'multiple_choice', 'fill_gap', 'grammar'])
let moreExamples = 0
let moreExercises = 0
for (const item of morePack.rules) {
  const rule = rules.rules.find((entry) => entry.slug === item.slug)
  if (!rule) {
    fail(`more-practice pack: no rule "${item.slug}"`)
    continue
  }
  const texts = new Set(rules.examples.filter((example) => example.rule_id === rule.id).map((example) => example.text))
  for (const example of item.examples) {
    moreExamples += 1
    if (!exampleTypes.has(example.type)) fail(`${item.slug}: example "${example.text}" has an unknown type`)
    if (example.type === 'incorrect' && !example.correction) fail(`${item.slug}: incorrect example "${example.text}" needs a correction`)
    if (!moreExamplesSql.includes(example.text.replaceAll("'", "''")))
      fail(`${item.slug}: example "${example.text}" is not in the SQL file (run node scripts/build-more-practice-pack.mjs)`)
    if (!texts.has(example.text))
      fail(`${item.slug}: example "${example.text}" is not in builtInRules.json (run node scripts/build-more-practice-pack.mjs)`)
  }
  const prompts = new Set()
  for (const exercise of item.exercises) {
    moreExercises += 1
    const label = `${item.slug}: "${exercise.prompt}"`
    if (!exerciseTypes.has(exercise.type)) fail(`${label}: unknown type`)
    if (prompts.has(exercise.prompt)) fail(`${label}: duplicate prompt in the pack`)
    prompts.add(exercise.prompt)
    if (!exercise.answer?.trim()) fail(`${label}: no answer`)
    if (exercise.type === 'fill_gap' && !exercise.prompt.includes('___')) fail(`${label}: a fill_gap prompt needs a ___ gap`)
    if (exercise.type === 'multiple_choice') {
      if (!Array.isArray(exercise.choices) || exercise.choices.length < 2) fail(`${label}: needs at least two choices`)
      else if (exercise.choices.filter((choice) => choice === exercise.answer).length !== 1)
        fail(`${label}: the answer must be exactly one of the choices`)
    }
    if (!moreExercisesSql.includes(exercise.prompt.replaceAll("'", "''")))
      fail(`${label}: missing from the SQL file (run node scripts/build-more-practice-pack.mjs)`)
  }
}

if (problems.length) {
  console.error(problems.map((problem) => `  ✗ ${problem}`).join('\n'))
  console.error(`\n${problems.length} problem(s) in the rule content.`)
  process.exit(1)
}
console.log(
  `All ${rules.rules.length} rules, ${rules.examples.length} examples and ${exerciseCount} bundled exercises passed; more-practice pack: ${moreExamples} examples, ${moreExercises} exercises.`,
)
