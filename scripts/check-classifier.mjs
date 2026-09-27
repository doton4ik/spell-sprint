// Runs the mistake classifier against known cases: `npm run check:classifier`.
// It copies the pure TypeScript modules to a temp folder and lets Node run them directly (Node 22.18+
// strips the types itself, so no bundler is needed), then checks that each case gets the expected
// technical and learning tags.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(tmpdir(), 'spellsprint-classifier-check')
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'package.json'), '{"type":"module"}')

for (const file of ['src/services/spellDiff.ts', 'src/services/mistakeClassifier.ts', 'src/data/errorFamilies.ts']) {
  // Node only needs explicit .ts extensions on relative imports (the app itself uses a bundler that does not).
  const source = readFileSync(join(root, file), 'utf8').replace(/(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, '$1$2.ts$3')
  const target = join(out, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, source)
}

const { classifyMistake } = await import(pathToFileURL(join(out, 'src/services/mistakeClassifier.ts')).href)

const confusableSets = [{ ruleId: 'there-their', words: ['there', 'their', "they're"] }, { ruleId: 'lose-loose', words: ['lose', 'loose'] }]

// [expected, submitted, context, technical tags that must be present, technical tags that must be absent, learning tags (exact set)]
const cases = [
  ['accommodation', 'acomodation', {}, ['missing_letter', 'multiple_edits'], ['letter_substitution'], ['missing_double_consonant']],
  ['planning', 'planing', {}, ['missing_letter'], ['multiple_edits'], ['verb_ending_error', 'doubling_before_suffix']],
  ['receive', 'recieve', {}, ['letter_transposition'], ['missing_letter', 'extra_letter'], ['vowel_order']],
  ['knowledge', 'knowlege', {}, ['missing_letter'], ['multiple_edits'], ['phonetic_spelling']],
  ['companies', 'companys', {}, ['letter_substitution', 'missing_letter', 'multiple_edits'], [], ['plural_ending_error']],
  ['there', 'their', { confusableSets }, ['letter_substitution', 'multiple_edits'], ['missing_letter'], ['confusing_words_error']],
  // extra coverage
  ['occurred', 'occured', {}, ['missing_letter'], [], ['verb_ending_error', 'doubling_before_suffix']],
  ['tomorrow', 'tomorow', {}, ['missing_letter'], [], ['missing_double_consonant']],
  ['recommend', 'reccommend', {}, ['extra_letter'], [], ['extra_double_consonant']],
  ['definitely', 'definately', {}, ['letter_substitution'], ['missing_letter'], ['vowel_substitution']],
  ['believe', 'beleive', {}, ['letter_transposition'], [], ['vowel_order']],
  ['knowledge', 'nowledge', {}, ['missing_letter'], [], ['silent_letter']],
  ['unnecessary', 'unecessary', {}, ['missing_letter'], [], ['missing_double_consonant', 'prefix_error']],
  ['lose', 'loose', { confusableSets }, ['extra_letter'], [], ['confusing_words_error']],
  ['stopped', 'stoped', {}, ['missing_letter'], [], ['verb_ending_error', 'doubling_before_suffix']],
  // Specific ending rules: each mistake must point to exactly one of them.
  ['making', 'makeing', {}, ['extra_letter'], [], ['silent_e_before_suffix', 'verb_ending_error']],
  ['hugging', 'huging', {}, ['missing_letter'], [], ['doubling_before_suffix', 'verb_ending_error']],
  ['opening', 'openning', {}, ['extra_letter'], [], ['doubling_before_suffix', 'verb_ending_error']],
  ['useful', 'usefull', {}, ['extra_letter'], [], ['ful_suffix', 'suffix_error']],
  ['happily', 'happyly', {}, ['letter_substitution'], [], ['ly_suffix']],
  ['finally', 'finaly', {}, ['missing_letter'], [], ['ly_suffix']],
  ['available', 'availible', {}, ['letter_substitution'], [], ['able_ible', 'suffix_error']],
  ['doubt', 'dout', {}, ['missing_letter'], [], ['silent_letter']],
  ['warehouse', '', {}, ['blank_answer'], [], ['unclassified']],
  ['warehouse', 'table', {}, ['wrong_word'], ['missing_letter'], ['unclassified']],
  ['склад', 'склат', {}, ['wrong_word'], [], ['unclassified']],
  ['Yesterday he went home.', 'Yesterday he goed home.', { taskType: 'correct-sentence' }, ['wrong_word'], [], ['grammar_rule_error']],
]

let failed = 0
for (const [expected, submitted, ctx, mustHave, mustNotHave, learning] of cases) {
  const result = classifyMistake(expected, submitted, ctx)
  const technical = result.technical.map((tag) => tag.slug)
  const learned = result.learning.map((tag) => tag.slug)
  const problems = []
  for (const tag of mustHave) if (!technical.includes(tag)) problems.push(`missing technical ${tag}`)
  for (const tag of mustNotHave) if (technical.includes(tag)) problems.push(`unexpected technical ${tag}`)
  if ([...learned].sort().join() !== [...learning].sort().join()) problems.push(`learning expected [${learning}] got [${learned}]`)
  if (problems.length) failed += 1
  console.log(`${problems.length ? 'FAIL' : ' ok '}  ${expected} → ${submitted || '(blank)'}   technical=[${technical}] learning=[${learned}]${problems.length ? `\n        ${problems.join('; ')}` : ''}`)
}

rmSync(out, { recursive: true, force: true })
console.log(failed ? `\n${failed} case(s) failed.` : `\nAll ${cases.length} cases passed.`)
process.exitCode = failed ? 1 : 0
