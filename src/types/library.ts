export type LibraryDifficulty = 'easy' | 'medium' | 'hard'
export type LibraryKind = 'core' | 'topic' | 'shared'
export const partOfSpeechOptions = ['noun', 'verb', 'adjective', 'adverb', 'conjunction', 'determiner', 'pronoun', 'preposition', 'interjection', 'phrase', 'other'] as const
export type PartOfSpeech = (typeof partOfSpeechOptions)[number]
export function normalisePartOfSpeech(value: string | undefined): PartOfSpeech {
  const normalised = value?.trim().toLocaleLowerCase() ?? ''
  const aliases: Record<string, PartOfSpeech> = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', prep: 'preposition', pron: 'pronoun', idiom: 'phrase', expression: 'phrase' }
  return (partOfSpeechOptions as readonly string[]).includes(normalised) ? normalised as PartOfSpeech : aliases[normalised] ?? 'other'
}

export type LibraryWord = {
  id: string
  wordId: string
  word: string
  translation: string
  topicId: string
  topic: string
  subtopic: string
  difficulty: LibraryDifficulty
  risk: number
  rule?: string
  example?: string
  definition?: string
  partOfSpeech: PartOfSpeech
  library: string
  source: string
}

export type WordLibrary = {
  id: string
  name: string
  topic: string
  words: LibraryWord[]
  source: 'built-in' | 'imported'
  kind: LibraryKind
  includes?: string[]
  createdAt?: string
}

