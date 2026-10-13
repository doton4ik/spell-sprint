// Builds ready-to-paste prompts for Perplexity into research/plexity/ (one file per round):
//   pairs-NN.md      more sentences for existing pairs, the pairs with the fewest sentences first
//   newpairs-NN.md   brand-new pairs (ids and words are chosen here, the agent writes the rest)
// The rules come from research/pairs/PERPLEXITY-PROMPT.md. Run: node scripts/make-plexity-prompts.mjs
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dir = mkdtempSync(join(tmpdir(), 'pairs-'))
writeFileSync(join(dir, 'pairs.ts'), readFileSync(new URL('../src/data/pairDrills.ts', import.meta.url), 'utf8'))
const { pairDrills } = await import(pathToFileURL(join(dir, 'pairs.ts')).href)

const template = readFileSync(new URL('../research/pairs/PERPLEXITY-PROMPT.md', import.meta.url), 'utf8').split('\n---\n')[1]
const sections = template.split(/\n(?=## )/)
const head = sections[0]
const part = (title) => sections.find((section) => section.startsWith(`## ${title}`))
const rules = part('Rules for every sentence')
const output = part('Output format')
const newPairs = part('New pairs')
const check = part('Before you answer')

const out = new URL('../research/plexity/', import.meta.url)
mkdirSync(out, { recursive: true })
const PER_PAIR = 25
const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size))
const pad = (number) => String(number).padStart(2, '0')

// ---- existing pairs: those with the fewest sentences first -----------------------------------------------------------
const todo = [...pairDrills].filter((pair) => pair.sentences.length < 25).sort((a, b) => a.sentences.length - b.sentences.length)
chunk(todo, 8).forEach((pairs, index) => {
  const list = pairs
    .map((pair) => {
      const sample = pair.sentences.map((sentence) => `    - ${sentence.text}  [${sentence.answer}]`).join('\n')
      return `### ${pair.id} (level ${pair.level})\nWords: ${pair.words.join(' / ')}\nMeaning: ${pair.words.map((word) => `${word} = ${pair.meanings[word]}`).join('; ')}\nRule: ${pair.hint}\nExisting sentences (do not repeat these ideas):\n${sample}`
    })
    .join('\n\n')
  const task = `## Your task in this round\n\nWrite **${PER_PAIR} new sentences for each of these ${pairs.length} pairs**, ${pairs.length * PER_PAIR} sentences in total. Use the \`id\` exactly as written as \`pairId\` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.\n\n${list}`
  const text = [head, task, rules, output.split('\n## ')[0], check].join('\n\n')
  writeFileSync(new URL(`pairs-${pad(index + 1)}.md`, out), text + '\n')
})

// ---- new pairs ---------------------------------------------------------------------------------------------------------
const wanted = {
  A2: [
    ['one-won', 'one / won'],
    ['son-sun', 'son / sun'],
    ['blue-blew', 'blue / blew'],
    ['tail-tale', 'tail / tale'],
    ['wait-weight', 'wait / weight'],
    ['mail-male', 'mail / male'],
    ['plain-plane', 'plain / plane'],
    ['bear-bare', 'bear / bare'],
    ['dear-deer', 'dear / deer'],
    ['hour-our', 'hour / our'],
    ['new-knew', 'new / knew'],
    ['sale-sail', 'sale / sail'],
    ['wood-would', 'wood / would'],
    ['of-off', 'of / off'],
    ['form-from', 'form / from'],
    ['were-where-were', "were / where / we're"],
  ],
  B1: [
    ['threw-through', 'threw / through'],
    ['steal-steel', 'steal / steel'],
    ['stair-stare', 'stair / stare'],
    ['waist-waste', 'waist / waste'],
    ['roll-role', 'roll / role'],
    ['board-bored', 'board / bored'],
    ['course-coarse', 'course / coarse'],
    ['scene-seen', 'scene / seen'],
    ['sauce-source', 'sauce / source'],
    ['hire-higher', 'hire / higher'],
    ['lessen-lesson', 'lessen / lesson'],
    ['fair-fare', 'fair / fare'],
    ['heard-herd', 'heard / herd'],
    ['knight-night', 'knight / night'],
    ['patience-patients', 'patience / patients'],
    ['stake-steak', 'stake / steak'],
    ['soul-sole', 'soul / sole'],
    ['die-dye', 'die / dye'],
    ['flu-flew', 'flu / flew'],
    ['pole-poll', 'pole / poll'],
  ],
  B2: [
    ['altogether-all-together', 'altogether / all together'],
    ['already-all-ready', 'already / all ready'],
    ['everyday-every-day', 'everyday / every day'],
    ['maybe-may-be', 'maybe / may be'],
    ['anyone-any-one', 'anyone / any one'],
    ['allusion-illusion', 'allusion / illusion'],
    ['alter-altar', 'alter / altar'],
    ['assure-ensure-insure', 'assure / ensure / insure'],
    ['council-counsel', 'council / counsel'],
    ['elicit-illicit', 'elicit / illicit'],
    ['emigrate-immigrate', 'emigrate / immigrate'],
    ['later-latter', 'later / latter'],
    ['lightning-lightening', 'lightning / lightening'],
    ['precede-proceed', 'precede / proceed'],
    ['access-excess', 'access / excess'],
    ['discreet-discrete', 'discreet / discrete'],
    ['eminent-imminent', 'eminent / imminent'],
    ['farther-further', 'farther / further'],
    ['moral-morale', 'moral / morale'],
    ['perspective-prospective', 'perspective / prospective'],
    ['prescribe-proscribe', 'prescribe / proscribe'],
    ['respectfully-respectively', 'respectfully / respectively'],
    ['taught-taut', 'taught / taut'],
    ['born-borne', 'born / borne'],
    ['device-devise', 'device / devise'],
    ['licence-license', 'licence / license'],
    ['prophecy-prophesy', 'prophecy / prophesy'],
    ['wander-wonder', 'wander / wonder'],
    ['who-whom', 'who / whom'],
    ['set-sit', 'set / sit'],
    ['bought-brought', 'bought / brought'],
    ['cite-sight-site', 'cite / sight / site'],
  ],
}
const have = new Set(pairDrills.map((pair) => pair.id))
const fresh = Object.entries(wanted).flatMap(([level, pairs]) =>
  pairs.filter(([id]) => !have.has(id)).map(([id, words]) => ({ id, level, words })),
)
chunk(fresh, 6).forEach((pairs, index) => {
  const list = pairs.map((pair) => `- id \`${pair.id}\`, level ${pair.level}, words: ${pair.words}`).join('\n')
  const task = `## Your task in this round\n\nCreate **${pairs.length} NEW pairs** with **${PER_PAIR} sentences each** (${pairs.length * PER_PAIR} sentences). Use exactly these ids, levels and words (the options in \`words\` are separated by " / "; for a pair like "all together" the option is two words):\n\n${list}\n\nThe level tells how hard the other words in the sentences may be (A2 / B1 / B2). Meanings are Russian glosses (a few words), the hint is one line in English.`
  const intro =
    '## Output format — JSON only, nothing else\n\nAnswer with ONE JSON array containing one object per new pair, and no text outside it.\n'
  const format = newPairs
    .replace(/^## New pairs.*\n/, () => intro)
    .replace('For a new pair give a full object instead of `add`:', 'One object per pair, like this:')
  const text = [head, task, rules, format, check].join('\n\n')
  writeFileSync(new URL(`newpairs-${pad(index + 1)}.md`, out), text + '\n')
})
console.log(`pairs rounds: ${chunk(todo, 8).length}, new pairs: ${fresh.length} in ${chunk(fresh, 6).length} rounds -> research/plexity/`)
