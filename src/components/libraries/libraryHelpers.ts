import type { LibraryWord } from '../../types/library'

export function uniqueWords(words: LibraryWord[]) {
  const seen = new Set<string>()
  return words.filter((word) => {
    if (seen.has(word.wordId)) return false
    seen.add(word.wordId)
    return true
  })
}

export function options(values: string[]) {
  return ['All', ...[...new Set(values.filter(Boolean))].sort()]
}
