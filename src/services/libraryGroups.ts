import type { LibraryWord, WordLibrary } from '../types/library'

export type LibraryGroupId = 'all' | 'core-english' | 'study-work' | 'topics-interests' | 'professional-vocabulary' | 'my-libraries'
export type LibraryGroup = { id: LibraryGroupId; name: string; description: string; topics: string[]; personal?: boolean }

export const libraryGroups: LibraryGroup[] = [
  { id: 'all', name: 'All', description: 'Every available vocabulary set.', topics: [] },
  { id: 'core-english', name: 'Core English', description: 'Essential English for everyday communication.', topics: ['General English', 'Everyday Life', 'People and Family', 'Home', 'Food and Drinks', 'Shopping', 'Daily Routine', 'Common Actions', 'Feelings', 'Time and Dates', 'Basic Descriptions'] },
  { id: 'study-work', name: 'Study and Work', description: 'English for learning, work, and communication.', topics: ['School and Learning', 'Study and Career', 'Business and Office', 'Jobs and Career', 'Communication', 'Professional Email', 'Meetings', 'Projects'] },
  { id: 'topics-interests', name: 'Topics and Interests', description: 'Travel, health, technology, and interests.', topics: ['Travel and Culture', 'Health and Body', 'Sport and Fitness', 'Technology', 'Environment', 'Nature and Animals', 'Places in Town', 'Weather and Seasons'] },
  { id: 'professional-vocabulary', name: 'Professional Vocabulary', description: 'Optional vocabulary for professional fields.', topics: ['Logistics', 'Warehouse Operations', 'Transport and Trade', 'Supply Chain'] },
  { id: 'my-libraries', name: 'My Libraries', description: 'Vocabulary imported or created by you.', topics: [], personal: true },
]

function uniqueWords(words: LibraryWord[]) { const seen = new Set<string>(); return words.filter((word) => { if (seen.has(word.wordId)) return false; seen.add(word.wordId); return true }) }
export function wordsForGroup(group: LibraryGroup, libraries: WordLibrary[]) {
  const source = group.personal ? libraries.filter((library) => library.source === 'imported') : libraries
  const words = source.flatMap((library) => library.words)
  return uniqueWords(group.id === 'all' ? words : group.personal ? words : words.filter((word) => group.topics.includes(word.topic)))
}
export function librariesForGroup(group: LibraryGroup, libraries: WordLibrary[]) {
  return group.personal ? libraries.filter((library) => library.source === 'imported') : libraries.filter((library) => wordsForGroup(group, [library]).length > 0)
}
