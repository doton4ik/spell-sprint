// Prompts for the assistant: put every existing word into one of the new topics and give it a CEFR level.
// Writes research/plexity/prompts/topics-NN.md. Run: node scripts/make-topic-prompts.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { TOPICS } from './library-topics.mjs'

const parseCsv = (text) => {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') ((cell += '"'), i++)
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') (row.push(cell), (cell = ''))
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell || row.length) (row.push(cell), rows.push(row))
  return rows
}

const [head, ...rows] = parseCsv(readFileSync(new URL('../src/data/spell-sprint-built-in-library.csv', import.meta.url), 'utf8')).filter(
  (r) => r.length > 3,
)
const col = (name) => head.indexOf(name)
const words = rows.map((r) => ({
  id: r[col('word_id')],
  word: r[col('word')],
  tr: r[col('translation')],
  pos: r[col('part_of_speech')],
  old: `${r[col('library')]} / ${r[col('topic')]}`,
  diff: r[col('difficulty')],
  ex: r[col('example')],
}))

const PER = 97
const topicList = TOPICS.map(([id, name, , about]) => `- ${id} = ${name}: ${about}`).join('\n')
const out = new URL('../research/plexity/prompts/', import.meta.url)
mkdirSync(out, { recursive: true })
const files = Math.ceil(words.length / PER)
for (let n = 0; n < files; n++) {
  const part = words.slice(n * PER, (n + 1) * PER)
  const lines = part.map((w) => `${w.id} | ${w.word} (${w.pos}) | ${w.tr} | old: ${w.old}, ${w.diff} | ${w.ex}`).join('\n')
  const name = `topics-${String(n + 1).padStart(2, '0')}.md`
  const text = `# NEW, SEPARATE TASK (${name})
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY the ${part.length} words listed below and nothing else.

You help organise the word lists of an English-spelling app for Russian-speaking learners. For each word choose ONE topic from the list and ONE level.

## Topics (use the id exactly)
${topicList}

## Rules
- Pick the topic where a learner would most expect to find the word. A word has exactly one topic.
- "old:" shows where the word sits today (library / topic) and an old easy/medium/hard mark. The old names are vague, so use them only as a hint; the word, its translation and the example sentence decide.
- If a word fits the topic of its sentence only by accident, judge the word itself (e.g. "delay" is transport or office, not "weather" because the example mentions rain).
- misspelled = a word chosen mainly because its spelling is tricky and it has no clear topic; confusable = a word whose job is to be told apart from a look-alike. Use these two only when the old library clearly says so ("Commonly Misspelled", "Confusable").
- logistics and customs are for professional words that an ordinary learner would not meet outside that work; a general word like "stock" or "deliver" goes to a normal topic (shopping, office, transport).
- Level is CEFR: A2 = basic everyday word; B1 = common word, intermediate; B2 = upper-intermediate; C1 = advanced or formal. Use the Oxford 3000/5000 lists and your own knowledge of the word's frequency. Old easy/medium/hard is only a hint: easy is usually A2 or B1, hard is usually B2 or C1, but decide by the word. Do not use A1 or C2: give A1 words A2 and C2 words C1.
- Do not change, skip, add or reorder words. Return one entry per input word, in the same order.

## Output format
ONE code block (three backticks + json). One entry per line: ["word_id","topic_id","level"]. No comments, no text before or after.

\`\`\`json
[
["${part[0].id}","home","A2"],
...
]
\`\`\`

Before you answer, check: ${part.length} entries; every topic id is from the list above; every level is A2, B1, B2 or C1; every word_id is copied exactly.

## Words
${lines}
`
  writeFileSync(new URL(name, out), text)
}
console.log(`${words.length} words, ${files} files`)
