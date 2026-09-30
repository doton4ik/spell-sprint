import type { ProofreadingLevel, ProofreadingText } from '../data/proofreadingTexts'

// Pure engine (no storage, no browser APIs) — also run by scripts/check-proofreading.mjs.
// Proofreading: a correct text with marked places {correct|type|wrong}. Each run picks some places,
// shows their wrong variant, adds a couple of spelling slips, and asks the learner to find and fix
// them. The same text gives a different set of mistakes every time (a new seed).

export const proofreadingTypes: Record<string, { label: string; hint: string }> = {
  agreement: { label: 'Subject–verb agreement', hint: 'The verb must agree with its subject: she goes, they are.' },
  article: { label: 'Articles', hint: 'a before a consonant sound, an before a vowel sound, the for something specific.' },
  'article-missing': { label: 'Missing article', hint: 'A singular countable noun needs a, an or the.' },
  'article-extra': { label: 'Extra article', hint: 'No article before most names of cities and countries, or general plural and uncountable nouns.' },
  'past-irregular': { label: 'Irregular past', hint: 'Irregular verbs do not take -ed: bought, gave, found.' },
  tense: { label: 'Tense', hint: 'Choose the tense that fits the time words: yesterday → past, since/for → present perfect.' },
  'since-for': { label: 'Since / for', hint: 'for + a period (three months), since + a starting point (2020, Monday).' },
  preposition: { label: 'Prepositions', hint: 'Some words go with a fixed preposition: interested in, married to, arrive at.' },
  'plural-uncountable': { label: 'Plural and uncountable', hint: 'Uncountable nouns have no plural: information, advice, furniture.' },
  quantifier: { label: 'Much / many, few / little', hint: 'many/few with countable nouns, much/little with uncountable ones.' },
  comparative: { label: 'Comparatives', hint: 'Either -er or more, never both: easier, more difficult.' },
  'gerund-infinitive': { label: 'Gerund or infinitive', hint: 'Some verbs take -ing (enjoy, suggest, look forward to), others to + verb.' },
  'word-form': { label: 'Word form', hint: 'Adjective or adverb? A verb or adjective is described by an adverb: surprisingly warm.' },
  pronoun: { label: 'Pronouns', hint: 'Subject, object and possessive forms: I / me / my.' },
  modal: { label: 'Modal verbs', hint: 'After can, must, should: the verb without to.' },
  'word-order': { label: 'Word order', hint: 'Questions need an auxiliary (do you…?); indirect questions keep normal order (where I can…).' },
  conditional: { label: 'Conditionals', hint: 'No will/would in the if-part: if I had…, I would…' },
  passive: { label: 'Passive voice', hint: 'be + past participle: was built, is made.' },
  'reported-speech': { label: 'Reported speech', hint: 'After a past reporting verb, tenses usually move back: will → would.' },
  confusable: { label: 'Confusable words', hint: 'Words that sound alike: their/there, its/it\'s, then/than.' },
  spelling: { label: 'Spelling', hint: 'A spelling slip — check double letters, ie/ei, silent letters and endings.' },
  typo: { label: 'Attention slip', hint: 'A letter is missing, extra or swapped. Read every word to its last letter.' },
}

// ---- Parsing ------------------------------------------------------------------------------------
export type MarkedPlace = { index: number; type: string; correct: string[]; wrong: string[] }
type Segment = { kind: 'text'; value: string } | { kind: 'place'; place: MarkedPlace }
const PLACE = /\{([^{}|]+)\|([a-z-]+)\|([^{}|]+)\}/g
const variants = (value: string) => value.split(' ; ').map((part) => part.trim()).filter(Boolean)

export function parseProofreadingText(text: string): { segments: Segment[]; problems: string[] } {
  const segments: Segment[] = []; const problems: string[] = []
  let last = 0; let index = 0
  for (const match of text.matchAll(PLACE)) {
    if (match.index > last) segments.push({ kind: 'text', value: text.slice(last, match.index) })
    const place: MarkedPlace = { index: index++, type: match[2], correct: variants(match[1]), wrong: variants(match[3]) }
    if (!proofreadingTypes[place.type]) problems.push(`unknown type “${place.type}” in {${match[0].slice(1, -1)}}`)
    if (place.wrong.some((wrong) => place.correct.some((correct) => normalise(correct) === normalise(wrong)))) problems.push(`wrong equals correct in ${match[0]}`)
    segments.push({ kind: 'place', place })
    last = match.index + match[0].length
  }
  if (last < text.length) segments.push({ kind: 'text', value: text.slice(last) })
  if (segments.some((segment) => segment.kind === 'text' && /[{}|]/.test(segment.value))) problems.push('a { } mark-up is broken (unbalanced brace or | outside a place)')
  return { segments, problems }
}

// ---- Building an exercise ------------------------------------------------------------------------
export type Token = { id: number; text: string; isWord: boolean; slotId?: number }
export type Slot = { id: number; type: string; correct: string[]; shown: string; tokenIds: number[] }
export type Exercise = { textId: string; seed: number; tokens: Token[]; slots: Slot[] }

// Small seeded random generator, so "try again" can replay exactly the same exercise.
function random(seed: number) {
  let state = seed >>> 0
  return () => { state = (state + 0x6d2b79f5) >>> 0; let t = state; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const WORD = /^[A-Za-zÀ-ÿ'’-]+$/
const tokenize = (value: string) => value.match(/[A-Za-zÀ-ÿ'’-]+|\s+|[^A-Za-zÀ-ÿ'’\s-]+/g) ?? []
export const normalise = (value: string) => value.toLocaleLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"()]/g, '').replace(/\s+/g, ' ').trim()

// Spelling slips of the kinds the rules teach: a lost double letter, ie/ei, -ful, -able/-ible …
const spellingSlips: Array<(word: string) => string | null> = [
  (word) => { const match = /([bcdfgklmnprstz])\1/.exec(word); return match ? word.slice(0, match.index) + word.slice(match.index + 1) : null },
  (word) => (/ie/.test(word) ? word.replace('ie', 'ei') : /ei/.test(word) ? word.replace('ei', 'ie') : null),
  (word) => (/ful$/.test(word) ? `${word}l` : null),
  (word) => (/able$/.test(word) ? word.replace(/able$/, 'ible') : /ible$/.test(word) ? word.replace(/ible$/, 'able') : null),
  (word) => (/tion$/.test(word) && word.length > 6 ? word.replace(/tion$/, 'sion') : null),
  (word) => (/^kn|^wr/.test(word) ? word.slice(1) : null),
  (word) => (/ence$/.test(word) ? word.replace(/ence$/, 'ance') : /ance$/.test(word) ? word.replace(/ance$/, 'ence') : null),
  // The ones in learners' own writing: an unclear vowel (breakfest, viseted), a swallowed syllable
  // (intresting, diffrent), an extra double letter (travell, comming), -ly → -ley (earley), silent b / h.
  (word) => {
    // The last a or i of the stem, never inside the ending: breakfast → breakfest, visited → viseted.
    const ending = /(ed|ing|s)$/.exec(word)?.[0] ?? ''
    const match = /^(.{2,}[^aeiou])([ai])([^aeiou]{1,2})$/.exec(word.slice(0, word.length - ending.length))
    return match ? `${match[1]}e${match[3]}${ending}` : null
  },
  (word) => { const match = /^(.+[^aeiou])e(r[aeiou].*)$/.exec(word); return match && word.length >= 7 ? match[1] + match[2] : null }, // interesting → intresting
  (word) => (/[^l]l$/.test(word) && word.length >= 5 ? `${word}l` : null),
  (word) => { const match = /^(.*[^aeiou][aeiou])([mnpt])(ing|ed)$/.exec(word); return match ? match[1] + match[2] + match[2] + match[3] : null },
  (word) => (/[^e]ly$/.test(word) && word.length >= 5 ? word.replace(/ly$/, 'ley') : null),
  (word) => (/mb$/.test(word) ? word.slice(0, -1) : /^wh/.test(word) ? `w${word.slice(2)}` : null),
]

// Real misspellings learners make in common words; used first when the word turns up in a text.
const commonMisspellings: Record<string, string[]> = {
  always: ['allways'], people: ['peple', 'poeple'], favourite: ['favorite', 'favrite'], different: ['diferent', 'diffrent'], receive: ['recieve'],
  address: ['adress'], surprise: ['suprise'], until: ['untill'], believe: ['beleive'], because: ['becouse', 'becuse'], beautiful: ['beatiful', 'beautifull'],
  friend: ['freind', 'frend'], friends: ['freinds'], interesting: ['intresting', 'interisting'], tomorrow: ['tommorow', 'tomorow'], really: ['realy'],
  finally: ['finaly'], necessary: ['neccessary', 'necesary'], separate: ['seperate'], definitely: ['definately'], which: ['wich'], business: ['buisness'],
  government: ['goverment'], environment: ['enviroment'], beginning: ['begining'], writing: ['writting'], coming: ['comming'], stopped: ['stoped'],
  running: ['runing'], recommend: ['recomend', 'reccomend'], occasion: ['occassion'], weird: ['wierd'], accommodation: ['accomodation'],
  embarrassed: ['embarased'], unfortunately: ['unfortunatly'], immediately: ['immediatly'], probably: ['probaly', 'propably'], restaurant: ['restaraunt'],
  breakfast: ['breakfest'], library: ['libary'], February: ['Febuary'], Wednesday: ['Wensday'], knowledge: ['knowlege'], answer: ['anser'],
  successful: ['sucessful', 'successfull'], tired: ['tierd'], thought: ['thougt'], through: ['throught', 'thru'], though: ['tho'], quiet: ['quite'],
  village: ['vilage'], early: ['earley'], travelled: ['traveled'], visited: ['visitted'], neighbour: ['neighbor', 'neigbour'], island: ['iland'],
  exercise: ['excercise'], experience: ['experiance'], similar: ['similiar'], disappear: ['dissapear'], disappointed: ['dissapointed'],
}

// Attention slips: no rule behind them, just a word read too fast (villag, showd, cludy, morining).
const attentionSlips: Array<(word: string) => string | null> = [
  (word) => (/[^aeiou]e$/.test(word) && word.length >= 5 ? word.slice(0, -1) : null), // village → villag (never birds → bird)
  (word) => (/e[sdn]$/.test(word) && word.length >= 5 ? word.slice(0, -2) + word.slice(-1) : null),
  (word) => { const match = /^(.+?)([aeiou])([aeiou])(.+)$/.exec(word); return match ? match[1] + match[3] + match[4] : null },
  (word) => { const at = Math.floor(word.length / 2); return word.length >= 6 && word[at] !== word[at - 1] ? word.slice(0, at - 1) + word[at] + word[at - 1] + word.slice(at + 1) : null },
  (word) => { const match = /^(.+?[aeiou])([bdfgmnprst])([aeiou].*)$/.exec(word); return match ? match[1] + match[2] + match[2] + match[3] : null }, // forest → forrest
]

export const errorCountFor = (level: ProofreadingLevel) => ({ A2: 4, B1: 5, B2: 6, C1: 7 })[level]

// Length of the clean text, and how many mistakes it gets: a short text (up to ~200 words) the level's
// base number, longer texts proportionally more (a 3× longer text → 3× the mistakes, at most 3×).
export function wordCount(text: ProofreadingText) {
  const clean = text.text.replace(PLACE, (_match, correct: string) => variants(correct)[0])
  return clean.split(/\s+/).filter((word) => /[A-Za-z]/.test(word)).length
}
const shortLength = { A2: 100, B1: 120, B2: 145, C1: 165 }
export function mistakeCountFor(text: ProofreadingText) {
  return Math.round(errorCountFor(text.level) * Math.min(3, Math.max(1, wordCount(text) / shortLength[text.level])))
}

// Some texts have few words a spelling slip fits into; then the missing slips become extra grammar
// mistakes, so every exercise has the same number of mistakes for its level.
export function buildExercise(text: ProofreadingText, seed = Date.now(), weights: Record<string, number> = {}): Exercise {
  const total = mistakeCountFor(text)
  const wanted = Math.max(1, Math.round(total / (text.level === 'A2' ? 4 : 3)))
  let exercise = buildOnce(text, seed, weights, wanted)
  for (let spelling = wanted - 1; exercise.slots.length < total && spelling >= 0; spelling -= 1) exercise = buildOnce(text, seed, weights, spelling)
  return exercise
}

function buildOnce(text: ProofreadingText, seed: number, weights: Record<string, number>, spellingCount: number, total = mistakeCountFor(text)): Exercise {
  const next = random(seed)
  const { segments } = parseProofreadingText(text.text)
  const places = segments.flatMap((segment) => (segment.kind === 'place' ? [segment.place] : []))
  const grammarCount = Math.min(places.length, total - spellingCount)

  // Weighted choice without replacement.
  const pool = [...places]; const chosen = new Set<number>()
  while (chosen.size < grammarCount && pool.length) {
    const total = pool.reduce((sum, place) => sum + (weights[place.type] ?? 1), 0)
    let roll = next() * total
    const pick = pool.findIndex((place) => (roll -= weights[place.type] ?? 1) <= 0)
    chosen.add(pool.splice(pick < 0 ? 0 : pick, 1)[0].index)
  }

  const tokens: Token[] = []; const slots: Slot[] = []
  const push = (value: string, slotId?: number) => { for (const part of tokenize(value)) tokens.push({ id: tokens.length, text: part, isWord: WORD.test(part), slotId }) }
  for (const segment of segments) {
    if (segment.kind === 'text') { push(segment.value); continue }
    const { place } = segment
    if (!chosen.has(place.index)) { push(place.correct[0]); continue }
    const shown = place.wrong[Math.floor(next() * place.wrong.length)]
    const slot: Slot = { id: slots.length, type: place.type, correct: place.correct, shown, tokenIds: [] }
    const before = tokens.length
    push(shown, slot.id)
    slot.tokenIds = tokens.slice(before).filter((token) => token.isWord).map((token) => token.id)
    slots.push(slot)
  }

  // Spelling slips in ordinary words (not inside a mistake, not a capitalised name).
  const candidates = tokens.filter((token) => token.isWord && token.slotId === undefined && token.text.length >= 5 && token.text === token.text.toLocaleLowerCase())
  for (let tries = 0; tries < 40 && slots.filter((slot) => slot.type === 'spelling').length < spellingCount && candidates.length; tries += 1) {
    const token = candidates.splice(Math.floor(next() * candidates.length), 1)[0]
    const slip = spellingSlips.map((make) => make(token.text)).filter((value): value is string => Boolean(value) && value !== token.text)
    if (!slip.length) continue
    const slot: Slot = { id: slots.length, type: 'spelling', correct: [token.text], shown: slip[Math.floor(next() * slip.length)], tokenIds: [token.id] }
    token.text = slot.shown; token.slotId = slot.id
    slots.push(slot)
  }
  return { textId: text.id, seed, tokens, slots }
}

// ---- Spelling hunt ------------------------------------------------------------------------------------
// Only spelling: about one slip in every 8 words, half of them with a rule behind them and half
// attention slips. Works on any text (the grammar mark-up is resolved to its correct form first).
export function huntCountFor(text: ProofreadingText) {
  return Math.max(5, Math.min(40, Math.round(wordCount(text) / 8)))
}

// preferred: words the learner practises or gets wrong — they are picked first.
// known: real words, so a slip never turns one real word into another (planet → plane).
export function buildSpellingHunt(text: ProofreadingText, seed = Date.now(), options: { preferred?: Set<string>; known?: Set<string> } = {}): Exercise {
  const next = random(seed)
  const clean = text.text.replace(PLACE, (_match, correct: string) => variants(correct)[0])
  const tokens: Token[] = tokenize(clean).map((part, id) => ({ id, text: part, isWord: WORD.test(part) }))
  const inText = new Set(tokens.filter((token) => token.isWord).map((token) => token.text.toLocaleLowerCase()))
  const isReal = (value: string) => inText.has(value.toLocaleLowerCase()) || Boolean(options.known?.has(value.toLocaleLowerCase()))
  const total = huntCountFor(text)
  const slots: Slot[] = []
  const pool = tokens.filter((token) => token.isWord && token.text.length >= 5 && (token.text === token.text.toLocaleLowerCase() || commonMisspellings[token.text]))
  const weight = (token: Token) => (commonMisspellings[token.text] ? 3 : 1) * (options.preferred?.has(token.text.toLocaleLowerCase()) ? 3 : 1)
  let usedLast = -3
  while (slots.length < total && pool.length) {
    const sum = pool.reduce((acc, token) => acc + weight(token), 0)
    let roll = next() * sum
    const index = Math.max(0, pool.findIndex((token) => (roll -= weight(token)) <= 0))
    const token = pool.splice(index, 1)[0]
    if (Math.abs(token.id - usedLast) < 3 && pool.length > total) continue // keep slips apart a little
    const usable = (values: Array<string | null>) => values.filter((value): value is string => value !== null && value !== token.text && !isReal(value))
    // A real misspelling of this very word beats a generated one.
    const common = usable(commonMisspellings[token.text] ?? [])
    const ruleSlips = common.length ? common : usable(spellingSlips.map((make) => make(token.text)))
    const typos = usable(attentionSlips.map((make) => make(token.text)))
    // About half attention slips; when the word allows only one kind, use that kind.
    const attention = typos.length > 0 && (next() < 0.45 || !ruleSlips.length)
    const choices = attention ? typos : ruleSlips
    if (!choices.length) continue
    const slot: Slot = { id: slots.length, type: attention ? 'typo' : 'spelling', correct: [token.text], shown: choices[Math.floor(next() * choices.length)], tokenIds: [token.id] }
    token.text = slot.shown; token.slotId = slot.id; usedLast = token.id
    slots.push(slot)
  }
  return { textId: text.id, seed, tokens, slots }
}

// ---- Checking -------------------------------------------------------------------------------------
export type SlotResult = { slot: Slot; status: 'fixed' | 'wrong-fix' | 'missed'; learnerText: string }
export type ProofreadingResult = { slots: SlotResult[]; falseAlarms: Array<{ tokenId: number; original: string; edit: string }>; found: number; fixed: number }

// Edits are per word (tokenId → new text, '' = delete). A mistake counts as fixed when the words
// around it read correctly, so "bought car" can be fixed by editing either "car" → "a car" or
// "bought" → "bought a".
export function checkExercise(exercise: Exercise, edits: Map<number, string>): ProofreadingResult {
  const words = exercise.tokens.filter((token) => token.isWord)
  const position = new Map(words.map((token, index) => [token.id, index]))
  const read = (ids: number[], edited: boolean) => ids.map((id) => (edited && edits.has(id) ? edits.get(id)! : exercise.tokens[id].text)).filter(Boolean).join(' ')
  const consumed = new Set<number>()

  // Mistakes that stand right next to each other ("finded new flat") may be fixed together
  // ("found a new flat"), so each run of neighbouring mistakes is also checked as one phrase.
  const ordered = [...exercise.slots].sort((a, b) => (position.get(a.tokenIds[0]) ?? 0) - (position.get(b.tokenIds[0]) ?? 0))
  const fixedTogether = new Set<number>()
  for (let start = 0; start < ordered.length; start += 1) {
    let end = start
    while (end + 1 < ordered.length && (position.get(ordered[end + 1].tokenIds[0]) ?? -2) === (position.get(ordered[end].tokenIds.at(-1)!) ?? -9) + 1) end += 1
    if (end > start) {
      // Any stretch of two or more neighbours that now reads correctly counts, even if a mistake
      // elsewhere in the same chain is still wrong ("fallen across the main path" with a slip left).
      for (let from = start; from < end; from += 1) {
        for (let to = from + 1; to <= end; to += 1) {
          const run = ordered.slice(from, to + 1)
          if (normalise(read(run.flatMap((slot) => slot.tokenIds), true)) === normalise(run.map((slot) => slot.correct[0]).join(' '))) run.forEach((slot) => fixedTogether.add(slot.id))
        }
      }
      start = end
    }
  }

  const slots = exercise.slots.map((slot): SlotResult => {
    const first = position.get(slot.tokenIds[0]) ?? 0
    const last = position.get(slot.tokenIds.at(-1)!) ?? first
    const before = words[first - 1]?.id; const after = words[last + 1]?.id
    // First the mistake itself; then, for a missing word typed into the neighbouring word, the words
    // around it — but only neighbours that are not a mistake of their own (those are checked there).
    const spanFixed = slot.correct.some((correct) => normalise(correct) === normalise(read(slot.tokenIds, true)))
    const plain = (id: number | undefined) => (id !== undefined && exercise.tokens[id].slotId === undefined ? id : undefined)
    const left = plain(before); const right = plain(after)
    const window = [left, ...slot.tokenIds, right].filter((id): id is number => id !== undefined)
    const learnerWindow = normalise(read(window, true))
    const fixed = spanFixed || fixedTogether.has(slot.id) || slot.correct.some((correct) => normalise([left !== undefined ? exercise.tokens[left].text : '', correct, right !== undefined ? exercise.tokens[right].text : ''].join(' ')) === learnerWindow)
    const touchedSpan = slot.tokenIds.some((id) => edits.has(id))
    slot.tokenIds.forEach((id) => consumed.add(id))
    if (fixed) window.forEach((id) => { if (edits.has(id)) consumed.add(id) })
    return { slot, status: fixed ? 'fixed' : touchedSpan ? 'wrong-fix' : 'missed', learnerText: read(slot.tokenIds, true) }
  })

  const falseAlarms = [...edits.entries()]
    .filter(([id, edit]) => !consumed.has(id) && normalise(edit) !== normalise(exercise.tokens[id].text))
    .map(([tokenId, edit]) => ({ tokenId, original: exercise.tokens[tokenId].text, edit }))
  return { slots, falseAlarms, found: slots.filter((item) => item.status !== 'missed').length, fixed: slots.filter((item) => item.status === 'fixed').length }
}
