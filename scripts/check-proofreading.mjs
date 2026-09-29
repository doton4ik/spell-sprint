// Checks the Proofreading texts and engine: `pnpm check:proofreading`.
// 1. every text's mark-up parses (known types, balanced braces, wrong ≠ correct);
// 2. for many random exercises: perfect edits fix everything, a fix made through the neighbouring
//    word also counts, and no edits means no false alarms.
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const dir = mkdtempSync(join(tmpdir(), 'proofreading-'))
for (const [file, name] of [['src/services/proofreadingEngine.ts', 'proofreadingEngine.ts'], ['src/data/proofreadingTexts.ts', 'proofreadingTexts.ts']]) {
  const source = readFileSync(join(root, file), 'utf8').replace("'../data/proofreadingTexts'", "'./proofreadingTexts.ts'")
  writeFileSync(join(dir, name), source)
}
const engine = await import(pathToFileURL(join(dir, 'proofreadingEngine.ts')).href)
const { proofreadingTexts } = await import(pathToFileURL(join(dir, 'proofreadingTexts.ts')).href)

let failed = 0
const fail = (message) => { failed += 1; if (failed <= 40) console.log('FAIL', message) }
const ids = new Set()
const levels = { A2: 0, B1: 0, B2: 0, C1: 0 }
for (const text of proofreadingTexts) {
  if (ids.has(text.id)) fail(`${text.id}: duplicate id`); ids.add(text.id)
  levels[text.level] = (levels[text.level] ?? 0) + 1
  const { segments, problems } = engine.parseProofreadingText(text.text)
  problems.forEach((problem) => fail(`${text.id}: ${problem}`))
  const places = segments.filter((segment) => segment.kind === 'place').length
  if (places < 8) fail(`${text.id}: only ${places} marked places`)

  for (let seed = 1; seed <= 150; seed += 1) {
    const exercise = engine.buildExercise(text, seed)
    const expected = engine.errorCountFor(text.level)
    if (exercise.slots.length !== expected) fail(`${text.id} seed ${seed}: ${exercise.slots.length} mistakes, expected ${expected}`)

    const none = engine.checkExercise(exercise, new Map())
    if (none.found || none.falseAlarms.length) fail(`${text.id} seed ${seed}: untouched text is not all "missed"`)

    const perfect = new Map()
    for (const slot of exercise.slots) slot.tokenIds.forEach((id, index) => perfect.set(id, index === 0 ? slot.correct[0] : ''))
    const good = engine.checkExercise(exercise, perfect)
    if (good.fixed !== exercise.slots.length || good.falseAlarms.length) fail(`${text.id} seed ${seed}: perfect edits → fixed ${good.fixed}/${exercise.slots.length}, false alarms ${good.falseAlarms.map((alarm) => alarm.original).join(',')}`)

    // Fix a missing word through the word before it: "bought" → "bought a", span unchanged.
    const words = exercise.tokens.filter((token) => token.isWord)
    for (const slot of exercise.slots.filter((item) => item.type === 'article-missing')) {
      const at = words.findIndex((token) => token.id === slot.tokenIds[0]); const before = words[at - 1]
      if (!before) continue
      const extra = slot.correct[0].split(' ').slice(0, -slot.shown.split(' ').length).join(' ')
      // If the word before is itself a mistake, the learner fixes it in the same edit.
      const neighbour = exercise.slots.find((item) => item.tokenIds.includes(before.id))
      const beforeText = neighbour ? neighbour.correct[0] : before.text
      const edits = new Map([[before.id, `${beforeText} ${extra}`]])
      if (neighbour) neighbour.tokenIds.filter((id) => id !== before.id).forEach((id) => edits.set(id, ''))
      const result = engine.checkExercise(exercise, edits)
      if (result.slots.find((item) => item.slot.id === slot.id).status !== 'fixed' || result.falseAlarms.length) fail(`${text.id} seed ${seed}: neighbour fix for "${slot.correct[0]}" not accepted`)
    }
  }
}
console.log('texts per level:', levels)
console.log(failed ? `\n${failed} problem(s).` : `\nAll ${proofreadingTexts.length} texts passed (150 random exercises each).`)
process.exitCode = failed ? 1 : 0
