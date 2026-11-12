// Looks an English word up in Wiktionary: Russian translations grouped by meaning (written by people,
// not machine-translated), plus an English definition and example for each meaning. Only the word
// itself is sent. Wiktionary may be slow or down, so every caller must also offer manual entry.
// The parsing functions are pure, so scripts can test them against saved pages.

export type LookupSense = {
  partOfSpeech: string // noun, verb, …
  gloss: string // Wiktionary's short label of the meaning ("good luck")
  translations: string[] // Russian, most common first, stress marks removed
  definition: string
  example: string
}

const API = 'https://en.wiktionary.org/w/api.php'
// The Russian Wiktionary describes English words in Russian. It is asked only when the English one has no Russian
// translation for the word (many phrasal verbs: "give up").
const API_RU = 'https://ru.wiktionary.org/w/api.php'
const REST = 'https://en.wiktionary.org/api/rest_v1/page/definition/'
const TIMEOUT_MS = 8000

const POS =
  /^={3,5}\s*(Noun|Verb|Adjective|Adverb|Phrase|Idiom|Preposition|Pronoun|Interjection|Conjunction|Prepositional phrase|Proverb|Numeral|Determiner)\s*={3,5}\s*$/

// судьба́ → судьба (removes only the stress mark; й and ё stay intact).
export const stripStress = (value: string) => value.normalize('NFD').replace(/́/g, '').normalize('NFC')

export function englishSection(wikitext: string) {
  const start = wikitext.search(/^==\s*English\s*==\s*$/m)
  if (start < 0) return ''
  const rest = wikitext.slice(start + 1)
  const end = rest.search(/^==[^=]/m)
  return end < 0 ? rest : rest.slice(0, end)
}

// Every translation table with a Russian line: {{trans-top|good luck}} … * Russian: {{t+|ru|уда́ча|f}} …
export function parseTranslations(section: string): Array<Pick<LookupSense, 'partOfSpeech' | 'gloss' | 'translations'>> {
  const senses: Array<Pick<LookupSense, 'partOfSpeech' | 'gloss' | 'translations'>> = []
  let partOfSpeech = ''
  let gloss: string | null = null
  for (const line of section.split('\n')) {
    const heading = POS.exec(line)
    if (heading) {
      partOfSpeech = heading[1].toLocaleLowerCase()
      continue
    }
    // {{trans-top-see|gloss|entry}} is a table copied from another entry: its gloss comes first, the entry name last.
    const top = /^\{\{trans-top(-also|-see)?\|([^}]*)\}\}/.exec(line) // checktrans-top (unchecked) is skipped on purpose
    if (top) {
      const parts = top[2].split('|').filter((part) => !part.includes('='))
      gloss = ((top[1] === '-see' ? parts[0] : parts.at(-1)) ?? '').trim()
      continue
    }
    if (/^\{\{trans-bottom/.test(line)) {
      gloss = null
      continue
    }
    if (gloss === null || !/^\*\s*Russian\s*:/.test(line)) continue
    const words = [...line.matchAll(/\{\{tt?\+?\|ru\|([^|}]+)/g)].map((match) => stripStress(match[1].trim())).filter(Boolean)
    const translations = [...new Set(words)]
    // Copied tables repeat the same translations under another gloss: show each list once.
    const repeated = senses.some((sense) => sense.partOfSpeech === partOfSpeech && sense.translations.join('|') === translations.join('|'))
    if (words.length && !repeated) senses.push({ partOfSpeech, gloss, translations })
  }
  return senses
}

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
const tokens = (value: string) =>
  new Set(
    value
      .toLocaleLowerCase()
      .match(/[a-z]+/g)
      ?.filter((token) => token.length > 2) ?? [],
  )

type RestDefinitions = Record<string, Array<{ partOfSpeech: string; definitions: Array<{ definition: string; examples?: string[] }> }>>

// The definition that shares most words with the gloss, and a short example that uses the word.
export function matchDefinition(rest: RestDefinitions | null, word: string, partOfSpeech: string, gloss: string) {
  const entries = (rest?.en ?? []).filter((entry) => entry.partOfSpeech.toLocaleLowerCase() === partOfSpeech || !partOfSpeech)
  const glossTokens = tokens(gloss)
  let best = { definition: '', example: '', score: 0 } // no shared word → use the gloss itself
  for (const entry of entries) {
    for (const item of entry.definitions) {
      const definition = stripHtml(item.definition)
      if (!definition || /^\(?(obsolete|archaic|dated)\b/i.test(definition)) continue
      const score = [...tokens(definition)].filter((token) => glossTokens.has(token)).length
      if (score <= best.score) continue
      const example =
        (item.examples ?? [])
          .map(stripHtml)
          .find(
            (text) =>
              text.split(' ').length >= 5 &&
              text.split(' ').length <= 22 &&
              text.toLocaleLowerCase().includes(word.toLocaleLowerCase().slice(0, Math.max(3, word.length - 2))),
          ) ?? ''
      best = { definition, example, score }
    }
  }
  return { definition: best.definition || gloss.charAt(0).toLocaleUpperCase() + gloss.slice(1), example: best.example }
}

// An English word on the Russian Wiktionary: its meanings are lists of Russian words.
//   = {{-en-}} =  …  ==== Значение ====
//   # [[бросать]] ([[бросить]]), [[отбрасывать]] {{пример|Nicky is thinking of giving up her job.|перевод=…}}
export function parseRussianWiktionary(wikitext: string): Array<Pick<LookupSense, 'partOfSpeech' | 'translations' | 'example'>> {
  const start = wikitext.search(/^=\s*\{\{-en-\}\}\s*=\s*$/m)
  if (start < 0) return []
  const rest = wikitext.slice(start + 1)
  const end = rest.search(/^=\s*\{\{-[a-z-]+-\}\}\s*=\s*$/m)
  const section = end < 0 ? rest : rest.slice(0, end)
  const partOfSpeech = /\{\{phrase\b/.test(section)
    ? 'phrase'
    : /\{\{(verb|гл) en\b/.test(section)
      ? 'verb'
      : /\{\{(сущ|noun) en\b/.test(section)
        ? 'noun'
        : /\{\{(прил|adj) en\b/.test(section)
          ? 'adjective'
          : /\{\{(нареч|adv) en\b/.test(section)
            ? 'adverb'
            : ''
  const meaning = /^={4}\s*Значение\s*={4}\s*$/m.exec(section)
  if (!meaning) return []
  const after = section.slice(meaning.index + meaning[0].length)
  const stop = after.search(/^=/m)
  const senses: Array<Pick<LookupSense, 'partOfSpeech' | 'translations' | 'example'>> = []
  // an example may be written on the next line: join the lines of one meaning first
  for (const item of (stop < 0 ? after : after.slice(0, stop)).split(/\n(?=#)/)) {
    if (!/^#(?![:*#])/.test(item)) continue
    const example = (/\{\{пример\|([^|{}]*)/.exec(item)?.[1] ?? '').replace(/\s+/g, ' ').trim()
    let text = item.replace(/^#\s*/, '')
    // templates (labels, the example) carry no translation; nested ones need a second pass
    for (let pass = 0; pass < 3; pass += 1) text = text.replace(/\{\{[^{}]*\}\}/g, '')
    const linked = [...text.matchAll(/\[\[([^\]|#]+)(?:\|([^\]]*))?\]\]/g)].map((match) => (match[2] ?? match[1]).trim())
    const plain = text
      .replace(/\[\[|\]\]/g, '')
      .split(/[,;()]/)
      .map((part) => part.trim())
    const translations = [...new Set((linked.length ? linked : plain).map(stripStress).filter((word) => /^[а-яё][а-яё -]*$/i.test(word)))]
    if (translations.length) senses.push({ partOfSpeech, translations, example: /[a-z]/i.test(example) ? example : '' })
  }
  return senses
}

async function getJson(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw Object.assign(new Error(`Wiktionary answered ${response.status}`), { status: response.status })
  return response.json()
}

async function wikitext(page: string, signal: AbortSignal, api = API): Promise<string | null> {
  const data = await getJson(`${api}?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json&redirects=1&origin=*`, signal)
  return data?.parse?.wikitext?.['*'] ?? null
}

// What the English definitions say when no Russian translation was found anywhere: the learner reads the meaning and
// writes the translation.
export type LookupMeaning = { partOfSpeech: string; definition: string; example: string }
export function englishMeanings(rest: RestDefinitions | null, limit = 4): LookupMeaning[] {
  const meanings: LookupMeaning[] = []
  for (const entry of rest?.en ?? [])
    for (const item of entry.definitions) {
      const definition = stripHtml(item.definition)
      if (
        !definition ||
        /^\(?(obsolete|archaic|dated|rare)\b/i.test(definition) ||
        /\b(form|plural|participle|tense) of\b/i.test(definition)
      )
        continue
      const example = (item.examples ?? []).map(stripHtml).find((text) => text.split(' ').length >= 4 && text.split(' ').length <= 22) ?? ''
      meanings.push({ partOfSpeech: entry.partOfSpeech.toLocaleLowerCase(), definition, example })
      if (meanings.length >= limit) return meanings
    }
  return meanings
}

export type LookupResult =
  | { status: 'found'; senses: LookupSense[] }
  // the dictionary knows the word but has no Russian for it: the meanings are in English
  | { status: 'no-translation'; meanings: LookupMeaning[] }
  | { status: 'not-found' }
  | { status: 'unavailable'; message: string }

// A phrase is one page: "hook up" is the page hook_up.
const restTitle = (word: string) => encodeURIComponent(word.replace(/ /g, '_'))

export async function lookupWord(input: string): Promise<LookupResult> {
  const word = input.trim().toLocaleLowerCase().replace(/\s+/g, ' ')
  if (!word) return { status: 'not-found' }
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const page = await wikitext(word, controller.signal).catch((error) => {
      if ((error as { status?: number }).status === 404) return null
      throw error
    })
    const section = page ? englishSection(page) : ''
    let senses = section ? parseTranslations(section) : []
    // Long entries keep their main translations on a separate page, "love/translations"; the entry itself may hold only a stray
    // table (love: "zero"), so the subpage is read whenever it exists and its meanings come first.
    if (/translation subpage|\/translations/.test(section)) {
      const subpage = await wikitext(`${word}/translations`, controller.signal).catch(() => null)
      if (subpage) {
        const fromSubpage = parseTranslations(englishSection(subpage) || subpage)
        const seen = new Set(fromSubpage.map((sense) => `${sense.partOfSpeech}|${sense.gloss}`))
        senses = [...fromSubpage, ...senses.filter((sense) => !seen.has(`${sense.partOfSpeech}|${sense.gloss}`))]
      }
    }
    const rest = section
      ? ((await getJson(`${REST}${restTitle(word)}`, controller.signal).catch(() => null)) as RestDefinitions | null)
      : null
    if (!senses.length) {
      // No Russian in the English Wiktionary (or no such page there): the Russian one may describe the word.
      const russianPage = await wikitext(word, controller.signal, API_RU).catch(() => null)
      const fromRussian = russianPage ? parseRussianWiktionary(russianPage) : []
      if (fromRussian.length) {
        const meanings = englishMeanings(rest, 8)
        return {
          status: 'found',
          senses: fromRussian.slice(0, 8).map((sense, index) => {
            // the meanings of the two dictionaries are not in the same order: an English definition is added only
            // when there is exactly one of each, so it cannot describe another meaning
            const only = fromRussian.length === 1 && meanings.length === 1 ? meanings[0] : null
            return {
              ...sense,
              gloss: '',
              definition: only?.definition ?? '',
              example: sense.example || (index === 0 ? (only?.example ?? '') : ''),
            }
          }),
        }
      }
      const meanings = englishMeanings(rest)
      return meanings.length ? { status: 'no-translation', meanings } : { status: 'not-found' }
    }
    return {
      status: 'found',
      senses: senses.slice(0, 8).map((sense) => ({ ...sense, ...matchDefinition(rest, word, sense.partOfSpeech, sense.gloss) })),
    }
  } catch (error) {
    const aborted = (error as Error).name === 'AbortError'
    return {
      status: 'unavailable',
      message: aborted ? 'The dictionary is taking too long to answer.' : 'The dictionary could not be reached.',
    }
  } finally {
    window.clearTimeout(timer)
  }
}

export const hasCyrillic = (value: string) => /[а-яё]/i.test(value)

export type RussianCandidate = { english: string; partOfSpeech: string; gloss: string }

// The English words that the definitions of a Russian entry link to: "# [[fortune]], [[luck]]" → fortune, luck.
export function parseRussianCandidates(wikitext: string): RussianCandidate[] {
  const start = wikitext.search(/^==\s*Russian\s*==\s*$/m)
  if (start < 0) return []
  const rest = wikitext.slice(start + 1)
  const end = rest.search(/^==[^=]/m)
  const section = end < 0 ? rest : rest.slice(0, end)
  const found: RussianCandidate[] = []
  let partOfSpeech = ''
  for (const line of section.split('\n')) {
    const heading = POS.exec(line)
    if (heading) partOfSpeech = heading[1].toLocaleLowerCase()
    if (!/^#(?![:*#])/.test(line)) continue
    if (/form of|inflection of|alternative|misspelling|obsolete|archaic|dated/i.test(line)) continue
    const text = line.replace(/\{\{[^{}]*\}\}/g, '')
    const words = [...text.matchAll(/\[\[([^\]|#:]+)(?:\|[^\]]*)?\]\]/g)].map((match) => match[1].trim().toLocaleLowerCase())
    for (const english of words) {
      if (!/^[a-z][a-z' -]{1,30}$/.test(english) || found.some((item) => item.english === english)) continue
      found.push({
        english,
        partOfSpeech,
        gloss: text
          .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
          .replace(/^#\s*/, '')
          .trim(),
      })
    }
  }
  return found
}

export type RussianLookupResult =
  { status: 'found'; candidates: RussianCandidate[] } | { status: 'not-found' } | { status: 'unavailable'; message: string }

// A Russian word → English words it can mean (from the Russian entry on the English Wiktionary).
export async function lookupRussianWord(input: string): Promise<RussianLookupResult> {
  const word = input.trim().toLocaleLowerCase()
  if (!word) return { status: 'not-found' }
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const page = await wikitext(word, controller.signal).catch((error) => {
      if ((error as { status?: number }).status === 404) return null
      throw error
    })
    const candidates = page ? parseRussianCandidates(page).slice(0, 8) : []
    return candidates.length ? { status: 'found', candidates } : { status: 'not-found' }
  } catch (error) {
    const aborted = (error as Error).name === 'AbortError'
    return {
      status: 'unavailable',
      message: aborted ? 'The dictionary is taking too long to answer.' : 'The dictionary could not be reached.',
    }
  } finally {
    window.clearTimeout(timer)
  }
}

// Spelling difficulty and risk, guessed from the letters (the app's own scale: easy / medium / hard, 1–5).
export function guessDifficulty(word: string): { difficulty: 'easy' | 'medium' | 'hard'; risk: number } {
  const traps = [
    /([a-z])\1/,
    /ie|ei/,
    /ough|augh|gh/,
    /^kn|^wr|mb$|^ps|^pn/,
    /ible$|able$|ance$|ence$|ant$|ent$/,
    /ph/,
    /[aeiou]{3}/,
    /sc[ei]/,
  ].filter((pattern) => pattern.test(word)).length
  const risk = Math.min(5, 1 + traps + (word.length > 8 ? 1 : 0))
  return { difficulty: risk >= 4 || word.length > 10 ? 'hard' : risk >= 2 || word.length > 6 ? 'medium' : 'easy', risk }
}
