import { familyFor } from '../data/errorFamilies'
import { diffStrings, type EditOp } from './spellDiff'

// Deterministic, local classification of one wrong answer. No network and no AI: it compares the
// expected and submitted words, describes the edit ("technical" tags), then runs pattern
// detectors ("learning" tags). One mistake can carry several tags of each kind.

export type PatternHit = { slug: string; confidence: number; detail?: string; ruleId?: string }
export type ConfusableSet = { ruleId: string; words: string[] }
export type ClassifierContext = {
  taskType?: string
  errorCategory?: string
  partOfSpeech?: string
  // Words that are commonly mixed up (there/their/they're). Loaded from rules of type
  // confusing_words, so new pairs are added as data, not code.
  confusableSets?: ConfusableSet[]
}
export type Classification = { technical: PatternHit[]; learning: PatternHit[]; distance: number; ops: EditOp[] }

type DetectorInput = { expected: string; submitted: string; ops: EditOp[]; ctx: ClassifierContext }
type Detector = (input: DetectorInput) => PatternHit[]

const hit = (slug: string, confidence = 1, detail?: string, ruleId?: string): PatternHit => ({ slug, confidence, detail, ruleId })
const isVowel = (letter: string) => letter.length === 1 && 'aeiou'.includes(letter)
const isConsonant = (letter: string) => /^[a-z]$/.test(letter) && !isVowel(letter)

export function normalizeAnswer(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:]+$/g, '').replace(/\s+/g, ' ')
}

// Merges hits with the same slug: keeps the highest confidence and joins the details.
function mergeHits(hits: PatternHit[]): PatternHit[] {
  const merged = new Map<string, PatternHit>()
  for (const item of hits) {
    const existing = merged.get(item.slug)
    if (!existing) { merged.set(item.slug, { ...item }); continue }
    existing.confidence = Math.max(existing.confidence, item.confidence)
    if (item.detail && !existing.detail?.includes(item.detail)) existing.detail = existing.detail ? `${existing.detail}; ${item.detail}` : item.detail
    existing.ruleId = existing.ruleId ?? item.ruleId
  }
  return [...merged.values()]
}

// --- Learning-pattern detectors ------------------------------------------------------------

const detectDoubleConsonants: Detector = ({ expected, submitted, ops }) => {
  const hits: PatternHit[] = []
  for (const op of ops) {
    if (op.type === 'delete' && isConsonant(op.expected) && (expected[op.expectedIndex - 1] === op.expected || expected[op.expectedIndex + 1] === op.expected)) {
      hits.push(hit('missing_double_consonant', 1, `${op.expected}${op.expected}→${op.expected}`))
    }
    if (op.type === 'insert' && isConsonant(op.submitted) && (submitted[op.submittedIndex - 1] === op.submitted || submitted[op.submittedIndex + 1] === op.submitted)) {
      hits.push(hit('extra_double_consonant', 1, `${op.submitted}→${op.submitted}${op.submitted}`))
    }
  }
  return hits
}

const detectVowelPatterns: Detector = ({ ops }) => {
  const hits: PatternHit[] = []
  for (const op of ops) {
    if (op.type === 'delete' && isVowel(op.expected)) hits.push(hit('missing_vowel', 1, `missing ${op.expected}`))
    if (op.type === 'insert' && isVowel(op.submitted)) hits.push(hit('extra_vowel', 1, `extra ${op.submitted}`))
    if (op.type === 'substitute' && isVowel(op.expected) && isVowel(op.submitted)) hits.push(hit('vowel_substitution', 1, `${op.expected}→${op.submitted}`))
    if (op.type === 'transpose' && isVowel(op.expected[0]) && isVowel(op.expected[1])) hits.push(hit('vowel_order', 1, `${op.expected}→${op.submitted}`))
  }
  return hits
}

// Letters that are written but not pronounced, listed by word (index = position of the silent
// letter). A short curated list on purpose: extend it as real mistakes show up.
const silentLetters: Record<string, number[]> = {
  knowledge: [0], know: [0], knee: [0], knife: [0], knight: [0, 4, 5], knock: [0], knot: [0],
  write: [0], wrong: [0], wrap: [0], wrist: [0], listen: [4], castle: [4], island: [0], answer: [3],
  climb: [4], comb: [4], doubt: [3], debt: [2], receipt: [5], hour: [0], honest: [0], honour: [0],
  half: [2], walk: [2], talk: [2], would: [2], could: [2], should: [2], wednesday: [2], psychology: [0],
}

const detectSilentLetters: Detector = ({ expected, ops }) => {
  const positions = silentLetters[expected]
  if (!positions) return []
  return ops.filter((op) => op.type === 'delete' && positions.includes(op.expectedIndex)).map((op) => hit('silent_letter', 1, `silent ${op.expected}`))
}

const prefixes = ['under', 'over', 'inter', 'anti', 'semi', 'dis', 'mis', 'pre', 'non', 'sub', 'un', 'im', 'il', 'ir', 're', 'in']
const suffixes = ['tion', 'sion', 'able', 'ible', 'ment', 'ness', 'less', 'ance', 'ence', 'ous', 'ive', 'ful', 'ity', 'ure', 'ly']

const detectAffixes: Detector = ({ expected, ops }) => {
  const hits: PatternHit[] = []
  const prefix = prefixes.find((item) => expected.startsWith(item) && expected.length - item.length >= 3)
  if (prefix && ops.every((op) => op.expectedIndex < prefix.length)) hits.push(hit('prefix_error', 1, `${prefix}-`))
  const suffix = suffixes.find((item) => expected.endsWith(item) && expected.length - item.length >= 2)
  if (suffix && ops.every((op) => op.expectedIndex >= expected.length - suffix.length)) hits.push(hit('suffix_error', 1, `-${suffix}`))
  return hits
}

// -ing / -ed endings. The window starts two letters before the ending because doubling and
// dropping the final e (planning, stopped, making) happen right at the stem/ending boundary.
const detectVerbEndings: Detector = ({ expected, ops }) => {
  const ending = expected.endsWith('ing') && expected.length >= 6 ? 'ing' : expected.endsWith('ed') && expected.length >= 5 ? 'ed' : ''
  if (!ending) return []
  const windowStart = expected.length - ending.length - 2
  return ops.every((op) => op.expectedIndex >= windowStart) ? [hit('verb_ending_error', 1, `-${ending}`)] : []
}

// A whole-mistake detector: consonant + y turning into -ies / -ied (company → companies).
const detectYToIes: Detector = ({ expected, submitted, ctx }) => {
  const asVerb = ctx.partOfSpeech === 'verb'
  if (/ies$/.test(expected) && /ys$/.test(submitted) && expected.slice(0, -3) === submitted.slice(0, -2)) return [hit(asVerb ? 'verb_ending_error' : 'plural_ending_error', 1, 'y→ies')]
  if (/ied$/.test(expected) && /yed$/.test(submitted) && expected.slice(0, -3) === submitted.slice(0, -3)) return [hit('verb_ending_error', 1, 'y→ied')]
  return []
}

// Lower-confidence guess for other -s / -es mistakes; it is stored as a tag but is too weak to
// link a rule on its own.
const detectPluralOrThirdPerson: Detector = ({ expected, ops, ctx }) => {
  const endsInEs = expected.endsWith('es')
  const endsInS = expected.endsWith('s') && !/(ss|us|is)$/.test(expected)
  if ((!endsInEs && !endsInS) || expected.length < 4) return []
  if (!ops.every((op) => op.expectedIndex >= expected.length - 3)) return []
  return [hit(ctx.partOfSpeech === 'verb' ? 'verb_ending_error' : 'plural_ending_error', 0.5, endsInEs ? '-es' : '-s')]
}

const detectConfusableWords: Detector = ({ expected, submitted, ctx }) => {
  const sets = ctx.confusableSets ?? []
  return sets
    .filter((set) => set.words.map(normalizeAnswer).includes(expected) && set.words.map(normalizeAnswer).includes(submitted) && expected !== submitted)
    .map((set) => hit('confusing_words_error', 1, `${expected}↔${submitted}`, set.ruleId))
}

// More specific detectors first; general ones after. Add a new pattern by adding one function here.
const learningDetectors: Detector[] = [detectDoubleConsonants, detectVowelPatterns, detectSilentLetters, detectAffixes, detectVerbEndings, detectPluralOrThirdPerson]

// --- Classifier ----------------------------------------------------------------------------

export function classifyMistake(expectedRaw: string, submittedRaw: string, ctx: ClassifierContext = {}): Classification {
  const expected = normalizeAnswer(expectedRaw)
  const submitted = normalizeAnswer(submittedRaw)
  const result = (technical: PatternHit[], learning: PatternHit[], distance = 0, ops: EditOp[] = []): Classification => ({ technical, learning, distance, ops })

  if (!submitted) return result([hit('blank_answer')], [hit('unclassified')])
  // Sentence tasks are about grammar, not letters, so an edit-distance comparison would be meaningless.
  if (ctx.taskType === 'correct-sentence' || familyFor(ctx.errorCategory ?? '') === 'Grammar') return result([hit('wrong_word')], [hit('grammar_rule_error')])
  // A wrong translation (or Cyrillic in an English answer) is a wrong word, not a spelling pattern.
  if (/[^\u0000-ɏ]/.test(expected) || /[^\u0000-ɏ]/.test(submitted)) return result([hit('wrong_word')], [hit('unclassified')])

  const { distance, ops } = diffStrings(expected, submitted)
  if (distance === 0) return result([], [hit('unclassified')])

  const input: DetectorInput = { expected, submitted, ops, ctx }
  const confusable = detectConfusableWords(input)
  if (expected.length > 3 && distance / expected.length > 0.5) return result([hit('wrong_word')], confusable.length ? confusable : [hit('unclassified')], distance, ops)

  const technical: PatternHit[] = []
  if (ops.some((op) => op.type === 'delete')) technical.push(hit('missing_letter'))
  if (ops.some((op) => op.type === 'insert')) technical.push(hit('extra_letter'))
  if (ops.some((op) => op.type === 'substitute')) technical.push(hit('letter_substitution'))
  if (ops.some((op) => op.type === 'transpose')) technical.push(hit('letter_transposition'))
  if (ops.length > 1) technical.push(hit('multiple_edits'))

  // Whole-mistake explanations win: a confusable pair or a y→ies slip is the reason for the edits,
  // so the letter-level detectors would only add noise.
  let learning = confusable.length ? confusable : detectYToIes(input)
  if (!learning.length) learning = mergeHits(learningDetectors.flatMap((detector) => detector(input)))

  // Weak fallback: a consonant dropped or changed in a longer word usually means "spelled by ear".
  if (!learning.length && expected.length >= 6 && ops.length <= 2 && technical.some((tag) => tag.slug === 'missing_letter' || tag.slug === 'letter_substitution')) {
    learning = [hit('phonetic_spelling', 0.5, 'spelled by ear')]
  }
  if (!learning.length) learning = [hit('unclassified')]

  return result(technical, learning, distance, ops)
}
