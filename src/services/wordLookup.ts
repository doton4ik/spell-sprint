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
const REST = 'https://en.wiktionary.org/api/rest_v1/page/definition/'
const TIMEOUT_MS = 8000

const POS = /^={3,5}\s*(Noun|Verb|Adjective|Adverb|Phrase|Idiom|Preposition|Pronoun|Interjection|Conjunction|Prepositional phrase|Proverb|Numeral|Determiner)\s*={3,5}\s*$/

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
    if (heading) { partOfSpeech = heading[1].toLocaleLowerCase(); continue }
    const top = /^\{\{trans-top(?:-also)?\|([^}]*)\}\}/.exec(line) // checktrans-top (unchecked) is skipped on purpose
    if (top) { gloss = top[1].split('|').filter((part) => !part.includes('=')).at(-1)?.trim() ?? ''; continue }
    if (/^\{\{trans-bottom/.test(line)) { gloss = null; continue }
    if (gloss === null || !/^\*\s*Russian\s*:/.test(line)) continue
    const words = [...line.matchAll(/\{\{tt?\+?\|ru\|([^|}]+)/g)].map((match) => stripStress(match[1].trim())).filter(Boolean)
    if (words.length) senses.push({ partOfSpeech, gloss, translations: [...new Set(words)] })
  }
  return senses
}

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()
const tokens = (value: string) => new Set(value.toLocaleLowerCase().match(/[a-z]+/g)?.filter((token) => token.length > 2) ?? [])

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
      const example = (item.examples ?? []).map(stripHtml).find((text) => text.split(' ').length >= 5 && text.split(' ').length <= 22 && text.toLocaleLowerCase().includes(word.toLocaleLowerCase().slice(0, Math.max(3, word.length - 2)))) ?? ''
      best = { definition, example, score }
    }
  }
  return { definition: best.definition || gloss.charAt(0).toLocaleUpperCase() + gloss.slice(1), example: best.example }
}

async function getJson(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw Object.assign(new Error(`Wiktionary answered ${response.status}`), { status: response.status })
  return response.json()
}

async function wikitext(page: string, signal: AbortSignal): Promise<string | null> {
  const data = await getJson(`${API}?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json&redirects=1&origin=*`, signal)
  return data?.parse?.wikitext?.['*'] ?? null
}

export type LookupResult = { status: 'found'; senses: LookupSense[] } | { status: 'not-found' } | { status: 'unavailable'; message: string }

export async function lookupWord(input: string): Promise<LookupResult> {
  const word = input.trim().toLocaleLowerCase()
  if (!word) return { status: 'not-found' }
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const page = await wikitext(word, controller.signal).catch((error) => { if ((error as { status?: number }).status === 404) return null; throw error })
    if (!page) return { status: 'not-found' }
    let section = englishSection(page)
    if (!section) return { status: 'not-found' }
    let senses = parseTranslations(section)
    // Long entries keep their translations on a separate page, "fortune/translations".
    if (!senses.length && /translation subpage|\/translations/.test(section)) {
      const subpage = await wikitext(`${word}/translations`, controller.signal).catch(() => null)
      if (subpage) { section = englishSection(subpage) || subpage; senses = parseTranslations(section) }
    }
    if (!senses.length) return { status: 'not-found' }
    const rest = await getJson(`${REST}${encodeURIComponent(word)}`, controller.signal).catch(() => null) as RestDefinitions | null
    return { status: 'found', senses: senses.slice(0, 8).map((sense) => ({ ...sense, ...matchDefinition(rest, word, sense.partOfSpeech, sense.gloss) })) }
  } catch (error) {
    const aborted = (error as Error).name === 'AbortError'
    return { status: 'unavailable', message: aborted ? 'The dictionary is taking too long to answer.' : 'The dictionary could not be reached.' }
  } finally {
    window.clearTimeout(timer)
  }
}

// Spelling difficulty and risk, guessed from the letters (the app's own scale: easy / medium / hard, 1–5).
export function guessDifficulty(word: string): { difficulty: 'easy' | 'medium' | 'hard'; risk: number } {
  const traps = [/([a-z])\1/, /ie|ei/, /ough|augh|gh/, /^kn|^wr|mb$|^ps|^pn/, /ible$|able$|ance$|ence$|ant$|ent$/, /ph/, /[aeiou]{3}/, /sc[ei]/].filter((pattern) => pattern.test(word)).length
  const risk = Math.min(5, 1 + traps + (word.length > 8 ? 1 : 0))
  return { difficulty: risk >= 4 || word.length > 10 ? 'hard' : risk >= 2 || word.length > 6 ? 'medium' : 'easy', risk }
}
