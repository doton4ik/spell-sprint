// Builds the sentence pool for Proofreading → Sentences from Tatoeba (CC BY 2.0 FR).
// Setup: research/tatoeba/eng_sentences.tsv (see tatoeba-pairs.mjs). Run from the project root:
//   node research/tatoeba-proof-sentences.mjs   → public/data/proofreading-sentences.json
// Each sentence gets ONE marked place {correct|type|wrong} where the wrong form is certainly wrong.
import { createReadStream, mkdirSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const PER_TYPE = 170
const american = /\b(color|colors|favorite|center|centers|organiz\w*|realiz\w*|recogniz\w*|apologiz\w*|theater|neighbor\w*|honor\w*|behavior|traveled|traveling|gray|mom|vacation|apartment|cookie|candy|gotten|soccer|cellphone|trash|garbage|elevator|downtown|sidewalk|movie|movies|truck|gas|pants|fall|math|check|program|store|stores|pharmacy|airplane|faucet|parking lot|zip code|cell)\b/i
const names = /\b(Tom|Mary|Sami|Layla|Ziri|Skura|Rima|Yanni|Mennad|Baya|Muiriel|John|Jim|Bob|Ken|Dan|Linda|Alice|Bill|Fadil|Dania|Salima|Algeria\w*|Kabyl\w*|Berber|Algiers|Boston|Australia)\b/
const dark = /\b(kill\w*|die|died|dead|death|gun|suicide|murder\w*|drunk|beer|wine|whisky|vodka|sex\w*|naked|God|war|police|prison|hate|hell|damn|stupid|idiot|fat|ugly|pregnant|crazy|shit|blood|drug\w*)\b/i
const tokens = (text) => text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []

const irregularPast = { went: 'goed', bought: 'buyed', thought: 'thinked', caught: 'catched', taught: 'teached', brought: 'bringed', ate: 'eated', wrote: 'writed', knew: 'knowed', came: 'comed', gave: 'gived', found: 'finded', said: 'sayed', told: 'telled', felt: 'feeled', kept: 'keeped', sold: 'selled', spent: 'spended', sent: 'sended', slept: 'sleeped', met: 'meeted', took: 'taked', ran: 'runned', began: 'beginned', drank: 'drinked', swam: 'swimmed', broke: 'breaked', forgot: 'forgetted', spoke: 'speaked', understood: 'understanded', lost: 'losed', chose: 'choosed', drove: 'drived', flew: 'flied', grew: 'growed', heard: 'heared', paid: 'payed', sat: 'sitted', stood: 'standed', won: 'winned', wore: 'weared', left: 'leaved' }
const comparatives = { bigger: 'more big', smaller: 'more small', older: 'more old', younger: 'more young', cheaper: 'more cheap', easier: 'more easy', faster: 'more fast', longer: 'more long', taller: 'more tall', better: 'more good', worse: 'more bad', happier: 'more happy', colder: 'more cold', warmer: 'more warm', higher: 'more high', busier: 'more busy', earlier: 'more early', closer: 'more close', nicer: 'more nice', smarter: 'more smart' }
const days = 'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday'
const baseVerbs = 'swim|speak|play|go|come|help|drive|cook|read|write|sing|dance|run|walk|see|hear|find|buy|pay|stay|leave|wait|win|ride|draw|call|meet|use|answer|understand|finish|start|open|close|carry|eat|drink|sleep|work|study|learn|teach|travel|visit|try'

// Each rule: regex with named group p (the marked span, inside the match), type, wrong form.
const rules = [
  { type: 'past-irregular', re: new RegExp(`\\b(?<p>${Object.keys(irregularPast).join('|')})\\b`), wrong: (p) => irregularPast[p.toLowerCase()] && (p[0] === p[0].toUpperCase() ? null : irregularPast[p]) },
  { type: 'comparative', re: new RegExp(`\\b(?<p>${Object.keys(comparatives).join('|')}) than\\b`), wrong: (p) => comparatives[p] },
  { type: 'modal', re: new RegExp(`\\b(?<p>(?:can|must|should|could|might) (?:${baseVerbs}))\\b`), wrong: (p) => p.replace(' ', ' to ') },
  { type: 'article-extra', re: /\b(?:have|had|eat|ate|for|after|before|at|during)\s+(?<p>breakfast|lunch|dinner)\b/, wrong: (p) => `the ${p}` },
  { type: 'article-extra', re: /\bat\s+(?<p>home)\b/, wrong: (p) => `the ${p}` },
  { type: 'article-extra', re: /\bby\s+(?<p>bus|train|car|bike|taxi|plane)\b/, wrong: (p) => `the ${p}` },
  { type: 'article-extra', re: /\b(?:go|goes|went|going|get|got|come|came)\s+to\s+(?<p>bed|work|school)\b/, wrong: (p) => `the ${p}` },
  { type: 'article-extra', re: /\b(?:in|to|from|visit|visited)\s+(?<p>London|Paris|Rome|Berlin|Spain|Italy|France|Germany|Japan|China|Canada|England|Scotland|Moscow|Russia)\b/, wrong: (p) => `the ${p}` },
  { type: 'preposition', re: /\b(?<p>listen(?:s|ed|ing)? to)\b/, wrong: (p) => p.replace(/ to$/, '') },
  { type: 'preposition', re: /\b(?<p>wait(?:s|ed|ing)? for)\b/, wrong: (p) => p.replace(/ for$/, '') },
  { type: 'preposition', re: /\b(?<p>interested in)\b/, wrong: () => 'interested about' },
  { type: 'preposition', re: /\b(?<p>depend(?:s|ed)? on)\b/, wrong: (p) => p.replace(/ on$/, ' from') },
  { type: 'preposition', re: /\b(?<p>good at)\b/, wrong: () => 'good in' },
  { type: 'preposition', re: /\b(?<p>afraid of)\b/, wrong: () => 'afraid from' },
  { type: 'preposition', re: /\b(?<p>married to)\b/, wrong: () => 'married with' },
  { type: 'preposition', re: new RegExp(`\\b(?<p>on (?:${days}))\\b`), wrong: (p) => p.replace(/^on/, 'in') },
  { type: 'preposition', re: /\b(?<p>in the (?:morning|afternoon|evening))\b/, wrong: (p) => p.replace(/^in/, 'at') },
  { type: 'preposition', re: /\b(?<p>arrived (?:at|in))\b(?! time)/, wrong: () => 'arrived to' },
  { type: 'preposition', re: /\b(?<p>discuss(?:ed)?) (?!about)(?:the|this|it|our|my|your|his|her|their)\b/, wrong: (p) => `${p} about` },
  { type: 'plural-uncountable', re: /(?<!\ban? )\b(?<p>information|advice|furniture|luggage|homework|equipment|knowledge)\b(?!\s+(?:desk|centre|office))/, wrong: (p) => `${p}s` },
  { type: 'dummy-it', re: /\b(?<p>(?:It|it) is|(?:It|it)'s|(?:It|it) was) (?=(?:raining|snowing|cold|hot|warm|sunny|windy|late|early|important|difficult|hard|easy|necessary|possible|impossible|dark|time)\b)/, wrong: (p) => { const verb = /'s$/.test(p) ? 'is' : p.split(' ')[1]; return /^It/.test(p) ? verb[0].toUpperCase() + verb.slice(1) : verb } },
  { type: 'be-missing', re: /\b(?<p>I am|I'm|we are|we're|they are|he is|he's|she is|she's|You are|you are) (?=(?:very |so |really |a bit )?(?:tired|hungry|happy|sad|busy|ready|sure|sorry|afraid|interested|excited|worried|bored|nervous|angry|glad|at home)\b)/, wrong: (p) => p.replace(/(?: am|'m| are|'re| is|'s)$/, '') },
  { type: 'adverb-position', re: /\b(?:I|you|we|they) (?<p>(?:always|usually|often|never|sometimes) (?:go|get|eat|drink|take|read|play|walk|watch|listen|work|study|visit|cook|forget|try|use|buy|come|leave|meet|call|wake|sleep|spend|drive|have))\b/, wrong: (p) => { const [adverb, verb] = p.split(' '); return `${verb} ${adverb}` } },
  { type: 'adverb-position', re: /\b(?:I|we|they|you) (?<p>really (?:like|love|enjoy))\b/, wrong: (p) => p.replace('really', 'very') },
  { type: 'double-negative', re: /\b(?:n't|not|never) (?:\w+ ){0,2}(?<p>anything|anyone|anybody|anywhere)\b/, wrong: (p) => p.replace(/^any/, 'no').replace('noone', 'no one') },
  { type: 'time-clause', re: /\b(?:When|when|as soon as|before|after|until) (?:I|you|we|they) (?<p>(?:get|arrive|come|finish|see|go|leave|find|hear|call|wake|start))\b(?=[^.?!]*\b(?:will|'ll)\b)/, wrong: (p) => `will ${p}` },
  { type: 'agreement', re: /\b(?:He|She|My (?:father|mother|brother|sister|friend|teacher|boss)|Everyone|Everybody|Nobody) (?<p>(?:likes|wants|goes|has|does|lives|works|knows|needs|plays|speaks|reads|loves|thinks|says|seems|looks))\b/, wrong: (p) => ({ goes: 'go', has: 'have', does: 'do' }[p] ?? p.replace(/s$/, '')) },
]

const freq = new Map()
const all = []
const rl = createInterface({ input: createReadStream(join(here, 'tatoeba', 'eng_sentences.tsv'), 'utf8'), crlfDelay: Infinity })
for await (const line of rl) {
  const [id, , raw = ''] = line.split('\t')
  const text = raw.replace(/’/g, "'")
  const words = tokens(text)
  for (const word of new Set(words)) freq.set(word, (freq.get(word) ?? 0) + 1)
  if (words.length < 5 || words.length > 15) continue
  if (!/^[A-Z]/.test(text) || !/[.?!]$/.test(text) || /[0-9;:()[\]"{}|]/.test(text) || names.test(text) || american.test(text) || dark.test(text)) continue
  all.push({ id, text, words })
}

const byType = {}
const seen = new Set()
for (const item of all) {
  const rarest = Math.min(...item.words.map((word) => freq.get(word) ?? 0))
  if (rarest < 300) continue
  const key = item.words.slice(0, 4).join(' ')
  if (seen.has(key)) continue
  for (const rule of rules) {
    if ((byType[rule.type]?.length ?? 0) >= PER_TYPE * 4) continue
    const match = rule.re.exec(item.text)
    if (!match) continue
    const p = match.groups.p
    const wrong = rule.wrong(p)
    if (!wrong || wrong === p) continue
    const start = match.index + match[0].indexOf(p)
    if (item.text.slice(start, start + p.length) !== p) continue
    if (/^['’]/.test(item.text.slice(start + p.length))) continue // won't, can't …
    const marked = `${item.text.slice(0, start)}{${p}|${rule.type}|${wrong}}${item.text.slice(start + p.length)}`
    // Level from length and the rarest word: short and common → A2, long or rarer → B2.
    const level = item.words.length <= 9 && rarest >= 3000 ? 'A2' : item.words.length <= 12 && rarest >= 1000 ? 'B1' : 'B2'
    ;(byType[rule.type] ??= []).push({ id: item.id, text: marked, type: rule.type, level, words: item.words.length, rarest })
    seen.add(key)
    break
  }
}
// Spread: a sample of each type across the levels, the most common wording first.
const pool = []
for (const [type, items] of Object.entries(byType)) {
  items.sort((a, b) => b.rarest - a.rarest)
  const step = Math.max(1, Math.floor(items.length / PER_TYPE))
  pool.push(...items.filter((_, index) => index % step === 0).slice(0, PER_TYPE).map(({ id, text, level }) => ({ id, text, type, level })))
}
mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/proofreading-sentences.json', JSON.stringify(pool))
const counts = {}
for (const item of pool) counts[item.type] = `${(+(counts[item.type]?.split(' ')[0] ?? 0)) + 1}`
const levels = {}
for (const item of pool) levels[item.level] = (levels[item.level] ?? 0) + 1
console.log(pool.length, 'sentences', levels)
console.log(Object.fromEntries(Object.entries(byType).map(([type, items]) => [type, `${Math.min(items.length, PER_TYPE)} of ${items.length}`])))
writeFileSync(join(here, 'proof-sentences-review.txt'), pool.map((item) => `${item.level} ${item.type.padEnd(18)} ${item.text}`).join('\n'))
