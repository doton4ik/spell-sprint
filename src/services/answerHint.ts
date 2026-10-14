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

export function answerHint(answer: string, word?: { partOfSpeech?: PartOfSpeech; subtopic?: string }) {
  const count = wordCount(answer)
  if (!count) return ''
  const parts = [`${count} ${count === 1 ? 'word' : 'words'}`]
  const phrasal = /phrasal verbs?/i.test(word?.subtopic ?? '')
  const kind = phrasal ? 'phrasal verb' : word?.partOfSpeech ? kinds[word.partOfSpeech] : undefined
  if (kind) parts.push(kind)
  return parts.join(' · ')
}
