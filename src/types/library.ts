export type LibraryDifficulty = 'easy' | 'medium' | 'hard'

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
  partOfSpeech: string
  library: string
  source: string
}

export type WordLibrary = {
  id: string
  name: string
  topic: string
  words: LibraryWord[]
  source: 'built-in' | 'imported'
  createdAt?: string
}

export type ImportReport = {
  libraryName: string
  topic: string
  imported: number
  skipped: number
  duplicateCount: number
  errorCount: number
  errors: string[]
}
