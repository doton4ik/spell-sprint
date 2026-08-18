export type LibraryDifficulty = 'easy' | 'medium' | 'hard'

export type LibraryWord = {
  id: string
  word: string
  translation: string
  topic: string
  difficulty: LibraryDifficulty
  risk: number
  rule?: string
  example?: string
  partOfSpeech?: string
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
  errors: string[]
}
