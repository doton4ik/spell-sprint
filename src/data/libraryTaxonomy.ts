import { libraryTopics } from './libraryTopics'

export type CanonicalTopic = { id: string; name: string; subtopics: string[] }

// The topics of the built-in library (see libraryTopics.ts). A topic id of an imported file that matches one gets its name.
export const canonicalTopics: CanonicalTopic[] = libraryTopics.map((topic) => ({ id: topic.id, name: topic.name, subtopics: [] }))

const key = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')

export function canonicalTopic(topicId: string, topic: string) {
  const id = key(topicId || topic)
  const match = canonicalTopics.find((item) => item.id === id)
  return match ? { topicId: match.id, topic: match.name } : { topicId: id, topic: topic.trim() }
}

export function libraryKindForName(name: string): 'core' | 'topic' | 'shared' {
  const normalised = name.trim().toLocaleLowerCase()
  if (normalised.startsWith('shared —') || normalised.startsWith('shared -')) return 'shared'
  return normalised.endsWith('core') ? 'core' : 'topic'
}

export function stableWordId(topicId: string, subtopic: string, word: string) {
  return [topicId, key(subtopic) || 'general', key(word)].filter(Boolean).join('-')
}
