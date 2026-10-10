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

if (problems.length) {
  console.error(problems.map((problem) => `  ✗ ${problem}`).join('\n'))
  console.error(`\n${problems.length} problem(s) in the rule content.`)
  process.exit(1)
}
console.log(`All ${rules.rules.length} rules, ${rules.examples.length} examples and ${exerciseCount} bundled exercises passed.`)
