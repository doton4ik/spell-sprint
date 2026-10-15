import type { LibraryWord, WordLibrary } from '../types/library'
import { libraryTopics, librarySections, type LibrarySectionId } from '../data/libraryTopics'

// A "group" is a section of topics (Everyday life, People, …) plus two special tabs: all words and the learner's own.
export type LibraryGroupId = 'all' | LibrarySectionId | 'my-libraries'
export type LibraryGroup = { id: LibraryGroupId; name: string; description: string; topics: string[]; personal?: boolean }

export const libraryGroups: LibraryGroup[] = [
  { id: 'all', name: 'All', description: 'Every available vocabulary set.', topics: [] },
  ...librarySections.map((section) => ({
    id: section.id,
    name: section.name,
    description: section.description,
    topics: libraryTopics.filter((topic) => topic.section === section.id).map((topic) => topic.name),
  })),
  { id: 'my-libraries', name: 'My Libraries', description: 'Vocabulary imported or created by you.', topics: [], personal: true },
]

function uniqueWords(words: LibraryWord[]) {
  const seen = new Set<string>()
  return words.filter((word) => {
    if (seen.has(word.wordId)) return false
    seen.add(word.wordId)
    return true
  })
}
export function wordsForGroup(group: LibraryGroup, libraries: WordLibrary[]) {
  const source = group.personal ? libraries.filter((library) => library.source === 'imported') : libraries
  const words = source.flatMap((library) => library.words)
  return uniqueWords(group.id === 'all' ? words : group.personal ? words : words.filter((word) => group.topics.includes(word.topic)))
}
export function librariesForGroup(group: LibraryGroup, libraries: WordLibrary[]) {
  return group.personal
    ? libraries.filter((library) => library.source === 'imported')
    : libraries.filter((library) => wordsForGroup(group, [library]).length > 0)
}
