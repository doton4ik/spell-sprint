import type { PartOfSpeech } from '../types/library'

// "Write in English" shows only a Russian word, and a word like "pass" (сдать экзамен) or "show up" (появиться)
// can be typed in several ways. A quiet line under the prompt says how many words the answer has and what kind of
// word it is, so the learner does not have to guess whether a phrasal verb or a single verb is wanted.
// It says nothing about the spelling itself.
export function wordCount(answer: string) {
  return answer.trim().split(/\s+/).filter(Boolean).length // "check-up" is one word
}

const kinds: Partial<Record<PartOfSpeech, string>> = {
  noun: 'noun',
  verb: 'verb',
  adjective: 'adjective',
  adverb: 'adverb',
  conjunction: 'conjunction',
  determiner: 'determiner',
  pronoun: 'pronoun',
  preposition: 'preposition',
  interjection: 'interjection',
  phrase: 'phrase',
}

// A phrase from a list that does not file its phrasal verbs separately (tidy up, hang out, try on): a verb followed by a particle.
const particles = new Set([
  'up',
  'down',
  'out',
  'in',
  'on',
  'off',
  'away',
  'over',
  'back',
  'by',
  'around',
  'through',
  'along',
  'apart',
  'about',
  'after',
  'ahead',
])
const notAVerb = new Set([
  'in',
  'on',
  'at',
  'by',
  'for',
  'to',
  'of',
  'from',
  'with',
  'out',
  'up',
  'off',
  'the',
  'a',
  'an',
  'no',
  'all',
  'as',
  'under',
  'over',
])
const notPhrasal = new Set(['sold out', 'straight on']) // look like one, but are an adjective and a direction
export function looksPhrasal(answer: string) {
  const parts = answer.toLocaleLowerCase().trim().split(/\s+/)
  if (parts.length < 2 || notPhrasal.has(parts.join(' ')) || notAVerb.has(parts[0])) return false
  // "catch up with", "fall out with": the particle stands before the final "with"
  const last = parts.length > 2 && parts.at(-1) === 'with' ? parts.at(-2) : parts.at(-1)
  return particles.has(last ?? '')
}

export function answerHint(answer: string, word?: { partOfSpeech?: PartOfSpeech; subtopic?: string }) {
  const count = wordCount(answer)
  if (!count) return ''
  const parts = [`${count} ${count === 1 ? 'word' : 'words'}`]
  const phrasal = /phrasal verbs?/i.test(word?.subtopic ?? '') || (word?.partOfSpeech === 'phrase' && looksPhrasal(answer))
  const kind = phrasal ? 'phrasal verb' : word?.partOfSpeech ? kinds[word.partOfSpeech] : undefined
  if (kind) parts.push(kind)
  return parts.join(' · ')
}
