// Merges the article rules into one umbrella rule, from ONE source file:
//   database/rules-import/article-merge.json  ->  src/data/builtInRules.json           (offline copy: umbrella text, moved examples)
//                                              ->  src/data/builtInRuleExercises.json   (exercises re-keyed to the umbrella)
//                                              ->  database/content-pack-11-merge-articles.sql   (run by the user in Supabase)
//                                              ->  database/content-pack-11-undo.sql
// Nothing is deleted from the rules table: the merged rules stay with is_active = false and a "merged_into" note.
// Safe to run again (it changes nothing the second time). Run it AFTER build-articles-pack / build-more-practice-pack,
// because those rebuild the offline files from older sources. Usage: node scripts/merge-article-rules.mjs
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

const cfg = JSON.parse(readFileSync('database/rules-import/article-merge.json', 'utf8'))
const rulesFile = JSON.parse(readFileSync('src/data/builtInRules.json', 'utf8'))
const exercisesFile = JSON.parse(readFileSync('src/data/builtInRuleExercises.json', 'utf8'))

function uuid(key) {
  const hex = createHash('sha1').update(`spellsprint-article-merge:${key}`).digest('hex')
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}
const q = (value) => (value === null || value === undefined ? 'null' : `'${String(value).replaceAll("'", "''")}'`)
const list = (slugs) => slugs.map(q).join(', ')

const into = rulesFile.rules.find((rule) => rule.slug === cfg.into)
if (!into) throw new Error(`no rule "${cfg.into}"`)
const retired = cfg.from.map((slug) => {
  const rule = rulesFile.rules.find((item) => item.slug === slug)
  if (!rule) throw new Error(`no rule "${slug}"`)
  return rule
})
const retiredIds = new Set(retired.map((rule) => rule.id))

// 1. Umbrella text and retired rules (offline copy).
Object.assign(into, {
  title: cfg.title,
  short_explanation: cfg.short_explanation,
  tts_text: cfg.tts_text,
  mnemonic: cfg.mnemonic,
})
for (const rule of retired) {
  rule.is_active = false
  rule.metadata = { ...rule.metadata, merged_into: cfg.into }
}

// 2. Examples: move to the umbrella, add the new ones, drop exact duplicates (same type and text).
const newExamples = cfg.examples.map((item) => ({
  id: uuid(`example:${item.text}`),
  rule_id: into.id,
  example_type: item.type,
  text: item.text,
  correction: item.correction ?? null,
  note: item.note,
}))
const known = new Set(rulesFile.examples.map((example) => example.id))
const wanted = [...rulesFile.examples, ...newExamples.filter((example) => !known.has(example.id))]
const seen = new Set()
rulesFile.examples = []
for (const example of wanted) {
  if (retiredIds.has(example.rule_id)) example.rule_id = into.id
  if (example.rule_id === into.id) {
    const key = `${example.example_type}|${example.text}`
    if (seen.has(key)) continue
    seen.add(key)
  }
  rulesFile.examples.push(example)
}

// 3. Exercises: re-key to the umbrella, add the new ones, drop repeated prompts.
const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1)
const newExercises = cfg.exercises.map((item) => {
  const atStart = item.prompt.startsWith('___')
  const fix = (word) => (atStart && word !== 'no article' ? capitalise(word) : word)
  return {
    id: uuid(`exercise:${item.prompt}`),
    rule_id: into.id,
    exercise_type: 'multiple_choice',
    prompt: item.prompt,
    answer: fix(item.answer),
    choices: item.choices.map(fix),
    metadata: { set: 'articles-merge-v1' },
  }
})
const pool = [...(exercisesFile[into.id] ?? [])]
for (const rule of retired) {
  pool.push(...(exercisesFile[rule.id] ?? []))
  delete exercisesFile[rule.id]
}
const prompts = new Set()
exercisesFile[into.id] = []
for (const exercise of [...pool, ...newExercises]) {
  if (prompts.has(exercise.prompt)) continue
  prompts.add(exercise.prompt)
  exercisesFile[into.id].push({ ...exercise, rule_id: into.id })
}

writeFileSync('src/data/builtInRules.json', `${JSON.stringify(rulesFile, null, 2)}\n`)
writeFileSync('src/data/builtInRuleExercises.json', `${JSON.stringify(exercisesFile, null, 2)}\n`)

// 4. SQL for the database.
const target = `(select id from public.rules where slug = ${q(cfg.into)})`
const retiredSql = `(select id from public.rules where slug in (${list(cfg.from)}))`
const exampleValues = newExamples
  .map((example) => `  (${q(example.id)}, ${q(example.example_type)}, ${q(example.text)}, ${q(example.correction)}, ${q(example.note)})`)
  .join(',\n')
const exerciseValues = newExercises
  .map(
    (exercise) =>
      `  (${q(exercise.id)}, 'multiple_choice', ${q(exercise.prompt)}, ${q(exercise.answer)}, ${q(JSON.stringify(exercise.choices))}::jsonb, '{"set":"articles-merge-v1"}'::jsonb)`,
  )
  .join(',\n')

const sql = `-- Content pack 11: ONE rule for the articles. Merges ${cfg.from.length} rules into "${cfg.into}" ("${cfg.title}").
-- GENERATED by scripts/merge-article-rules.mjs from database/rules-import/article-merge.json. Do not edit by hand.
--
-- What it does:
--   1. Writes down, on each merged rule, which examples and exercises it had (metadata.example_ids / exercise_ids), so it can be undone.
--   2. Gives "${cfg.into}" the new title and explanation (the / no article come first, jobs are included).
--   3. Adds ${newExamples.length} new examples and ${newExercises.length} new exercises (mostly the / no article, jobs).
--   4. Moves the examples, exercises, word links, mistake links, practice attempts, notes and progress of the merged rules to "${cfg.into}"
--      (progress and notes only where the learner has none on "${cfg.into}" yet).
--   5. Deletes repeated examples (same type and text) and repeated exercises (same prompt) inside "${cfg.into}".
--   6. Sets is_active = false on the merged rules: ${cfg.from.join(', ')}. They are NOT deleted.
-- Safe to run more than once. Run it in the Supabase SQL Editor (project "SpellSprint").
-- HOW TO UNDO: run database/content-pack-11-undo.sql (moves the examples and exercises back and switches the rules on; the
-- deleted exact duplicates and the new rows stay, the old explanation of "${cfg.into}" is put back).

begin;

update public.rules r
set metadata = r.metadata || jsonb_build_object(
  'merged_into', ${q(cfg.into)},
  'was_active', r.is_active,
  'example_ids', (select coalesce(jsonb_agg(e.id), '[]'::jsonb) from public.rule_examples e where e.rule_id = r.id),
  'exercise_ids', (select coalesce(jsonb_agg(x.id), '[]'::jsonb) from public.rule_exercises x where x.rule_id = r.id)
)
where r.slug in (${list(cfg.from)}) and not (r.metadata ? 'merged_into');

update public.rules
set title = ${q(cfg.title)},
    short_explanation = ${q(cfg.short_explanation)},
    tts_text = ${q(cfg.tts_text)},
    mnemonic = ${q(cfg.mnemonic)},
    updated_at = now()
where slug = ${q(cfg.into)};

insert into public.rule_examples (id, rule_id, example_type, text, correction, note)
select v.id::uuid, ${target}, v.example_type, v.text, v.correction, v.note
from (values
${exampleValues}
) as v(id, example_type, text, correction, note)
where not exists (select 1 from public.rule_examples e where e.id = v.id::uuid);

insert into public.rule_exercises (id, rule_id, exercise_type, prompt, answer, choices, metadata)
select v.id::uuid, ${target}, v.exercise_type, v.prompt, v.answer, v.choices, v.metadata
from (values
${exerciseValues}
) as v(id, exercise_type, prompt, answer, choices, metadata)
where not exists (select 1 from public.rule_exercises e where e.id = v.id::uuid);

update public.rule_examples set rule_id = ${target} where rule_id in ${retiredSql};
update public.rule_exercises set rule_id = ${target} where rule_id in ${retiredSql};
update public.mistake_rule_links set rule_id = ${target} where rule_id in ${retiredSql};
update public.rule_practice_attempts set rule_id = ${target} where rule_id in ${retiredSql};

update public.rule_word_links l set rule_id = ${target}
where l.rule_id in ${retiredSql}
  and not exists (select 1 from public.rule_word_links o where o.rule_id = ${target} and o.word_id = l.word_id);

update public.user_rule_progress p set rule_id = ${target}
where p.rule_id in ${retiredSql}
  and not exists (select 1 from public.user_rule_progress o where o.rule_id = ${target} and o.user_id = p.user_id);

update public.user_rule_notes n set rule_id = ${target}
where n.rule_id in ${retiredSql}
  and not exists (select 1 from public.user_rule_notes o where o.rule_id = ${target} and o.user_id = n.user_id);

delete from public.rule_examples a using public.rule_examples b
where a.rule_id = ${target} and b.rule_id = a.rule_id
  and a.example_type = b.example_type and a.text = b.text and a.ctid > b.ctid;

delete from public.rule_exercises a using public.rule_exercises b
where a.rule_id = ${target} and b.rule_id = a.rule_id
  and a.prompt = b.prompt and a.ctid > b.ctid;

update public.rules set is_active = false, updated_at = now() where slug in (${list(cfg.from)});

commit;
`

const undo = `-- Undo of content pack 11 (database/content-pack-11-merge-articles.sql). GENERATED by scripts/merge-article-rules.mjs.
-- Moves the examples and exercises back to the rules they came from (the ids were written into metadata by the pack), switches
-- those rules on again and puts the old explanation of "${cfg.into}" back. New rows of the pack and deleted exact duplicates stay;
-- word links, mistake links, practice attempts, notes and progress stay on "${cfg.into}".

begin;

update public.rule_examples e set rule_id = r.id
from public.rules r
cross join lateral jsonb_array_elements_text(r.metadata -> 'example_ids') as moved(id)
where r.metadata ->> 'merged_into' = ${q(cfg.into)} and e.id = moved.id::uuid;

update public.rule_exercises e set rule_id = r.id
from public.rules r
cross join lateral jsonb_array_elements_text(r.metadata -> 'exercise_ids') as moved(id)
where r.metadata ->> 'merged_into' = ${q(cfg.into)} and e.id = moved.id::uuid;

update public.rules
set is_active = coalesce((metadata ->> 'was_active')::boolean, true),
    metadata = metadata - 'merged_into' - 'was_active' - 'example_ids' - 'exercise_ids',
    updated_at = now()
where metadata ->> 'merged_into' = ${q(cfg.into)};

update public.rules
set title = ${q(cfg.was.title)},
    short_explanation = ${q(cfg.was.short_explanation)},
    tts_text = ${q(cfg.was.tts_text)},
    mnemonic = ${q(cfg.was.mnemonic)},
    updated_at = now()
where slug = ${q(cfg.into)};

commit;
`

writeFileSync('database/content-pack-11-merge-articles.sql', sql)
writeFileSync('database/content-pack-11-undo.sql', undo)
console.log(
  `Merged ${retired.length} rules into "${cfg.into}": ${seen.size} examples, ${exercisesFile[into.id].length} exercises there now ` +
    `(${newExamples.length} new examples, ${newExercises.length} new exercises).`,
)
