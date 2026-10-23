// Prompts for the assistant: new words for each topic, so every topic reaches its target size.
// Needs research/plexity/topic-map.json (node scripts/merge-topics.mjs --apply).
// Writes research/plexity/prompts/newwords-NN.md. Run: node scripts/make-newword-prompts.mjs
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { TOPICS } from './library-topics.mjs'
import { SUBTOPICS } from './library-subtopics.mjs'

const map = JSON.parse(readFileSync(new URL('../research/plexity/topic-map.json', import.meta.url), 'utf8'))
const word = {}
for (let n = 1; n <= 10; n++) {
  const text = readFileSync(new URL(`../research/plexity/prompts/topics-${String(n).padStart(2, '0')}.md`, import.meta.url), 'utf8')
  for (const line of text.split('\n')) {
    const m = line.match(/^([a-z0-9-]+) \| (.+?) \((noun|verb|adjective|adverb|[a-z ]+)\) \|/)
    if (m) word[m[1]] = m[2]
  }
}
const have = {}
for (const [id, { topic }] of Object.entries(map)) (have[topic] ??= new Set()).add(word[id].toLowerCase())

const TARGET = { logistics: 80, weather: 60, misspelled: 70, confusable: 50, phone: 80, ideas: 80 }
const DEFAULT_TARGET = 90
const PER_TASK = 60
const out = new URL('../research/plexity/prompts/', import.meta.url)
mkdirSync(out, { recursive: true })
for (const name of readdirSync(out)) if (/^newwords-\d+\.md$/.test(name)) rmSync(new URL(name, out), { force: true })

const LEVEL_MIX = `Aim for roughly: A2 20%, B1 40%, B2 30%, C1 10% (professional topics: B1 20%, B2 50%, C1 30%).`
const SPECIAL = {
  phrasal:
    'Every entry is a phrasal verb (verb + particle, e.g. "give up", "look after", "turn down"), the commonest and most useful ones; one meaning per entry, the commonest. Do not repeat a verb+particle already listed, even with another meaning.',
  actions:
    'Every entry is a single common verb for doing, moving, thinking or saying (e.g. "carry", "gather", "pretend"). No phrasal verbs (they have their own topic) and no verbs that clearly belong to another topic (cook, drive, buy).',
  describing:
    'Entries are adjectives or adverbs for size, quality, manner, degree, speed, amount (e.g. "tiny", "reliable", "barely"). No feelings or character words (they have their own topic).',
  misspelled:
    'Entries are words that learners often misspell, with no clear topic (e.g. "necessary", "occurrence", "tomorrow"). Pick words whose spelling really is a trap (double letters, silent letters, ie/ei, -able/-ible).',
  confusable:
    'Entries are words that learners confuse with a look-alike or sound-alike word (e.g. "complement", "lay", "council"). Write the word itself; put the word it is confused with in the definition after a semicolon: "to praise; not compliment... ". Do NOT add the partner word as a separate entry unless it is also not yet listed and also useful on its own.',
  logistics:
    'Narrow professional words from warehouses, supply chains, import, export and customs (e.g. "pallet", "forklift", "tariff", "quota"). Words a learner meets at work, not general English.',
  ideas:
    'Abstract everyday nouns for talking about society and opinions (e.g. "policy", "attitude", "democracy", "evidence", "trend"). Mostly nouns; common, not academic jargon.',
}

const tasks = []
for (const [id, name, , about] of TOPICS) {
  const list = [...(have[id] ?? [])].sort()
  const need = (TARGET[id] ?? DEFAULT_TARGET) - list.length
  if (need <= 0) continue
  const parts = Math.ceil(need / PER_TASK)
  const each = Math.ceil(need / parts)
  for (let p = 0; p < parts; p++) tasks.push({ id, name, about, list, count: Math.min(each, need - p * each), part: p + 1, parts })
}

tasks.forEach((t, i) => {
  const file = `newwords-${String(i + 1).padStart(2, '0')}.md`
  const text = `# NEW, SEPARATE TASK (${file})
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the topic "${t.name}" (${t.id})${t.parts > 1 ? `, part ${t.part} of ${t.parts}` : ''}.

You are adding words to the word list of an English-spelling app for Russian-speaking learners. Write EXACTLY ${t.count} NEW words for the topic **${t.name}**: ${t.about}.

## Rules
- British spelling. One entry per word; no proper names, no abbreviations, no very rare words, no offensive words.
- Every word must be new: it must NOT be in the list "Already in this topic" below (check each word, also other forms of it: "tidy" vs "tidying").
- Useful for a Russian-speaking learner: words they will meet and want to use in this topic; useful and common first, interesting later.
${
  t.parts > 1
    ? `- This topic is split into ${t.parts} tasks done in separate chats. ${t.part === 1 ? 'In this part take the most common and useful words (mostly A2–B2).' : 'In this part take the less common words (mostly B2–C1) and specific sub-areas; the commonest words were done in part 1, which you cannot see, so avoid the most obvious ones.'}
`
    : ''
}${SPECIAL[t.id] ? `- Topic note: ${SPECIAL[t.id]}\n` : ''}- Levels (CEFR, by the Oxford 3000/5000 lists and the word's frequency): A2 basic, B1 intermediate, B2 upper-intermediate, C1 advanced. No A1 or C2: give A1 words A2 and C2 words C1. ${LEVEL_MIX}
- translation: the main Russian translation (one or two words, commonly used for that meaning; if a second meaning matters, add it after a comma, max 2).
- pos: noun, verb, adjective, adverb, phrase or phrasal verb.
- subtopic: the group of the topic the word belongs to. Copy EXACTLY ONE name from the list "Subtopics" below (same spelling, same capitals). Choose the best fit for the word's main meaning, and spread the words over the subtopics in a natural way (no subtopic should get more than about 40% of the words; every subtopic should get at least a few).
- definition: one simple English definition of 6–14 words (B1 vocabulary, no use of the word itself).
- example: ONE natural sentence of 6–14 words in everyday British English that shows the topic. The word appears in it EXACTLY as written in "word" (for a verb, write the base form in "word" and use that same form in the sentence: "tidy" → "I must tidy my room before dinner").
- The example must be correct grammar, with no typos.

## Output format
ONE code block (three backticks + json). One entry per line: ["word","translation","pos","level","definition","example","subtopic"]. Compact, no comments, no text before or after, exactly ${t.count} entries.

\`\`\`json
[
["...","...","noun","B1","...","...","${(SUBTOPICS[t.id] ?? [])[0]}"],
...
]
\`\`\`

Before you answer, check: exactly ${t.count} entries; none appears in "Already in this topic"; no word twice; every level is A2, B1, B2 or C1; the word appears in its own example; every subtopic is copied exactly from the list.

## Subtopics (the 7th field must be exactly one of these)
${(SUBTOPICS[t.id] ?? []).map((name) => `- ${name}`).join('\n')}

## Already in this topic (${t.list.length} words, do not repeat)
${t.list.join(', ')}
`
  writeFileSync(new URL(file, out), text)
})
const total = tasks.reduce((s, t) => s + t.count, 0)
console.log(`${tasks.length} tasks, ${total} new words`)
for (const t of tasks) console.log(`${t.id} ${t.count} (part ${t.part}/${t.parts})`)
