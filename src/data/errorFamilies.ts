import type { ErrorFamily } from '../types/learning'

// Which family (Spelling / Grammar / Vocabulary) an errorCategory label belongs to.
// Lives in its own tiny module so both learningData.ts and the mistake classifier can use it
// without importing each other.
const grammarCategories = ['Subject–verb agreement', 'Verb form', 'Tense', 'Articles', 'Prepositions', 'Word order']
const vocabularyCategories = ['Wrong translation', 'Inactive vocabulary', 'Unknown word', 'Professional definition weakness', 'Word family confusion']

export function familyFor(category: string): ErrorFamily {
  if (grammarCategories.includes(category) || category.startsWith('Grammar · ')) return 'Grammar'
  if (vocabularyCategories.includes(category)) return 'Vocabulary'
  return 'Spelling'
}
