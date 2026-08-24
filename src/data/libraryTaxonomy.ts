export type CanonicalTopic = { id: string; name: string; subtopics: string[] }

export const canonicalTopics: CanonicalTopic[] = [
  { id: 'general-english', name: 'General English', subtopics: ['Active Vocabulary', 'Professional Communication'] },
  { id: 'everyday-life', name: 'Everyday Life', subtopics: ['Daily Routines', 'Home and Services'] },
  { id: 'logistics', name: 'Logistics', subtopics: ['Supply Chain', 'Receiving and Storage', 'Order Fulfilment'] },
  { id: 'warehouse-operations', name: 'Warehouse Operations', subtopics: ['SAP Warehouse Processes', 'Inventory Control'] },
  { id: 'transport-and-trade', name: 'Transport and Trade', subtopics: ['Road Freight', 'Customs and Trade'] },
  { id: 'business-and-office', name: 'Business and Office', subtopics: ['Finance and Planning', 'Meetings and Negotiation'] },
  { id: 'travel-and-culture', name: 'Travel and Culture', subtopics: ['Travel Planning', 'At the Destination'] },
  { id: 'study-and-career', name: 'Study and Career', subtopics: ['Learning and Research', 'Career Development'] },
  { id: 'sport-and-fitness', name: 'Sport and Fitness', subtopics: ['Training and Competition', 'Health and Recovery'] },
]

const topicAliases: Record<string, string> = { business: 'business-and-office', travel: 'travel-and-culture', sports: 'sport-and-fitness', 'sap-professional-logistics': 'warehouse-operations' }
const key = (value: string) => value.trim().toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '-')

export function canonicalTopic(topicId: string, topic: string) {
  const id = topicAliases[key(topicId || topic)] ?? key(topicId || topic)
  const match = canonicalTopics.find((item) => item.id === id)
  return match ? { topicId: match.id, topic: match.name } : { topicId: id, topic: topic.trim() }
}

export function libraryKindForName(name: string): 'core' | 'topic' | 'shared' {
  const normalised = name.trim().toLocaleLowerCase()
  if (normalised.startsWith('shared —') || normalised.startsWith('shared -')) return 'shared'
  return normalised.endsWith('core') ? 'core' : 'topic'
}

export function stableWordId(topicId: string, subtopic: string, word: string) { return [topicId, key(subtopic) || 'general', key(word)].filter(Boolean).join('-') }
