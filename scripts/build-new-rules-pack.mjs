// Builds the new rules of content pack 8 (and 9) from their source files, so the database and the app copy never drift apart:
//   database/rules-import/{double_consonants,english_spelling,silent_letters,verb_endings,vowels_and_letter_patterns}.json
//     ->  database/content-pack-8-new-rules.sql   (run by the user in Supabase; rules + examples + exercises)
//     ->  src/data/builtInRules.json              (rules + examples, offline copy)
// The exercises are NOT bundled in the app (only the database has them), like the exercises of the more-practice packs.
// Ids are derived from the slug, so running this again changes nothing. Usage: node scripts/build-new-rules-pack.mjs
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

// Usage: node scripts/build-new-rules-pack.mjs [8|9]   (8 is the default)
const packs = {
  8: {
    files: ['double_consonants', 'english_spelling', 'silent_letters', 'verb_endings', 'vowels_and_letter_patterns'],
    set: 'new-rules-v1',
    blurb: "double the last consonant / don't double, silent k-w and b-g-h-t, -ed after y, -ing after ie, ch/tch and j/dge, ou/ow/au/aw",
  },
  9: {
    files: [
      'block_english_spelling',
      'block_double_consonants',
      'block_silent_letters',
      'block_verb_endings',
      'block_vowels',
      'block_prefixes',
      'block_business',
    ],
    set: 'new-rules-v2',
    blurb:
      'ck after a short vowel, ph and gh for /f/, double letters in common words, all- words, silent l, silent c-s-n-u, -es and -ies endings, ea/ee, ai/ay/oi/oy, -ous, logistics words',
  },
}
const NUMBER = process.argv[2] ?? '8'
if (!packs[NUMBER]) throw new Error('unknown pack ' + NUMBER)
const { files, set: SET, blurb: BLURB } = packs[NUMBER]

function uuid(key) {
  const hex = createHash('sha1').update(`spellsprint-newrules:${key}`).digest('hex')
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}
const q = (value) => (value === null || value === undefined ? 'null' : `'${String(value).replaceAll("'", "''")}'`)

function exerciseType(exercise) {
  if (exercise.choices) return 'multiple_choice'
  if (exercise.prompt.includes('___')) return 'fill_gap'
  if (exercise.prompt.startsWith('Fix the spelling')) return 'correct_word'
  if (exercise.prompt.startsWith('Spell the word')) return 'spell'
  throw new Error(`cannot tell the type of "${exercise.prompt}"`)
}

const rules = []
const examples = []
const exercises = []
const seen = new Set()
for (const file of files) {
  const pack = JSON.parse(readFileSync(`database/rules-import/${file}.json`, 'utf8'))
  for (const rule of pack.rules) {
    if (seen.has(rule.slug)) throw new Error(`duplicate slug ${rule.slug}`)
    seen.add(rule.slug)
    const id = uuid(rule.slug)
    rules.push({
      id,
      slug: rule.slug,
      title: rule.title,
      category: pack.category,
      rule_type: rule.rule_type,
      short_explanation: rule.short_explanation,
      tts_text: rule.tts_text ?? null,
      mnemonic: rule.mnemonic ?? null,
      source: 'built-in',
      visibility: 'public',
      is_active: true,
      metadata: {},
    })
    rule.examples.forEach((example, index) =>
      examples.push({
        id: uuid(`${rule.slug}|ex|${index}`),
        rule_id: id,
        example_type: example.type,
        text: example.text,
        correction: example.correction ?? null,
        note: example.note ?? null,
      }),
    )
    rule.exercises.forEach((exercise, index) =>
      exercises.push({
        id: uuid(`${rule.slug}|exr|${index}`),
        rule_id: id,
        exercise_type: exerciseType(exercise),
        prompt: exercise.prompt,
        answer: exercise.answer,
        choices: exercise.choices ?? null,
        metadata: { set: SET },
      }),
    )
  }
}

// ---- the offline copy ----
const slugs = new Set(rules.map((rule) => rule.slug))
const builtIn = JSON.parse(readFileSync('src/data/builtInRules.json', 'utf8'))
const droppedIds = new Set(builtIn.rules.filter((rule) => slugs.has(rule.slug)).map((rule) => rule.id))
builtIn.rules = [...builtIn.rules.filter((rule) => !slugs.has(rule.slug)), ...rules]
builtIn.examples = [...builtIn.examples.filter((example) => !droppedIds.has(example.rule_id)), ...examples]
writeFileSync('src/data/builtInRules.json', `${JSON.stringify(builtIn, null, 2)}\n`)

// ---- the SQL file ----
const slugOf = new Map(rules.map((r) => [r.id, r.slug]))
const ruleRows = rules
  .map(
    (r) =>
      `  (${q(r.id)}, ${q(r.slug)}, ${q(r.title)}, ${q(r.category)}, ${q(r.rule_type)}, ${q(r.short_explanation)}, ${q(r.tts_text)}, ${q(r.mnemonic)}, 'built-in', 'public', true)`,
  )
  .join(',\n')
const exampleRows = examples
  .map((e) => `  (${q(e.id)}, ${q(slugOf.get(e.rule_id))}, ${q(e.example_type)}, ${q(e.text)}, ${q(e.correction)}, ${q(e.note)})`)
  .join(',\n')
const exerciseRowList = exercises.map(
  (e) =>
    `  (${q(e.id)}, ${q(slugOf.get(e.rule_id))}, ${q(e.exercise_type)}, ${q(e.prompt)}, ${q(e.answer)}, ${q(e.choices ? JSON.stringify(e.choices) : null)}, ${q(JSON.stringify(e.metadata))})`,
)
const exerciseRows = exerciseRowList.join(',\n')

const sql = `-- Content pack ${NUMBER}: NEW RULES. ${rules.length} rules, ${examples.length} examples, ${exercises.length} exercises.
-- GENERATED by scripts/build-new-rules-pack.mjs from these files in database/rules-import/: ${files.join(', ')}.
-- Do not edit by hand; edit the JSON and run the script again (node scripts/build-new-rules-pack.mjs ${NUMBER}).
--
-- What it does: adds ${rules.length} new built-in rules (${BLURB}), each with examples and exercises. Ids are fixed, so the
-- offline copy in the app (src/data/builtInRules.json) matches the database rows exactly.
-- Safe to run more than once: rules are unique on slug, examples and exercises are guarded against duplicates.
-- Run it in the Supabase SQL Editor (project "SpellSprint"). Needs rules-schema.sql to be applied already.
--
-- HOW TO UNDO (removes the rules; their examples and exercises go with them, learner progress on them too):
--   delete from public.rules where slug in (${rules.map((r) => q(r.slug)).join(', ')});

begin;

insert into public.rules (id, slug, title, category, rule_type, short_explanation, tts_text, mnemonic, source, visibility, is_active)
values
${ruleRows}
on conflict (slug) do nothing;

insert into public.rule_examples (id, rule_id, example_type, text, correction, note)
select v.id::uuid, r.id, v.example_type, v.text, v.correction, v.note
from (values
${exampleRows}
) as v(id, slug, example_type, text, correction, note)
join public.rules r on r.slug = v.slug
where not exists (select 1 from public.rule_examples e where e.rule_id = r.id and e.text = v.text);

insert into public.rule_exercises (id, rule_id, exercise_type, prompt, answer, choices, metadata)
select v.id::uuid, r.id, v.exercise_type, v.prompt, v.answer, v.choices::jsonb, v.metadata::jsonb
from (values
${exerciseRows}
) as v(id, slug, exercise_type, prompt, answer, choices, metadata)
join public.rules r on r.slug = v.slug
where not exists (select 1 from public.rule_exercises e where e.rule_id = r.id and e.prompt = v.prompt);

commit;
`
writeFileSync(`database/content-pack-${NUMBER}-new-rules.sql`, sql)

// ---- the same pack in 3 smaller files, in case the SQL Editor refuses the big one ----
const exerciseInsert = (rows) => `insert into public.rule_exercises (id, rule_id, exercise_type, prompt, answer, choices, metadata)
select v.id::uuid, r.id, v.exercise_type, v.prompt, v.answer, v.choices::jsonb, v.metadata::jsonb
from (values
${rows.join(',\n')}
) as v(id, slug, exercise_type, prompt, answer, choices, metadata)
join public.rules r on r.slug = v.slug
where not exists (select 1 from public.rule_exercises e where e.rule_id = r.id and e.prompt = v.prompt);`
const intro = (
  n,
  what,
) => `-- Content pack ${NUMBER}, part ${n} of 3: ${what}. The same pack as content-pack-${NUMBER}-new-rules.sql, split to stay under the SQL Editor's size limit.
-- GENERATED by scripts/build-new-rules-pack.mjs. Run part 1 FIRST (it creates the rules), then parts 2 and 3. Safe to run more than once.
-- To undo, see the delete line at the top of content-pack-${NUMBER}-new-rules.sql.

begin;

`
const half = Math.ceil(exerciseRowList.length / 2)
const rulesAndExamples = sql.slice(sql.indexOf('insert into public.rules'), sql.indexOf('insert into public.rule_exercises'))
writeFileSync(
  `database/content-pack-${NUMBER}-part-01.sql`,
  `${intro(1, `${rules.length} rules and ${examples.length} examples`)}${rulesAndExamples}commit;\n`,
)
writeFileSync(
  `database/content-pack-${NUMBER}-part-02.sql`,
  `${intro(2, `exercises 1-${half}`)}${exerciseInsert(exerciseRowList.slice(0, half))}\n\ncommit;\n`,
)
writeFileSync(
  `database/content-pack-${NUMBER}-part-03.sql`,
  `${intro(3, `exercises ${half + 1}-${exerciseRowList.length}`)}${exerciseInsert(exerciseRowList.slice(half))}\n\ncommit;\n`,
)
console.log(`${rules.length} rules, ${examples.length} examples, ${exercises.length} exercises written`)
