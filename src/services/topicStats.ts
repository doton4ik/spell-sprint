import type { LibraryWord } from '../types/library'
import { getWordProgress, type WordProgress } from './dailyPlan'
import { libraryGroups, type LibraryGroupId } from './libraryGroups'
import { getAllWords } from './libraryStorage'
import { canonicalTopic } from '../data/libraryTaxonomy'

export type TopicStatus = 'not-started' | 'preliminary' | 'needs-focus' | 'developing' | 'strong'
export type SubtopicStats = { name: string; words: number; practised: number; due: number }
export type TopicStats = {
  topic: string
  groupId: LibraryGroupId | 'other'
  words: LibraryWord[]
  practised: number // words answered at least once
  known: number // latest answer correct, and answered correctly more than once
  due: number
  accuracy: number | null
  answers: number // all answers on this topic's words; below MIN_TOPIC_ANSWERS the status stays "preliminary"
  status: TopicStatus
  subtopics: SubtopicStats[]
  lastPractised: string | null
}

export const topicStatusLabels: Record<TopicStatus, string> = { 'not-started': 'Not started', preliminary: 'Too little data', 'needs-focus': 'Needs focus', developing: 'Developing', strong: 'Strong' }

function groupFor(topic: string): TopicStats['groupId'] {
  return libraryGroups.find((group) => !group.personal && group.id !== 'all' && group.topics.includes(topic))?.id ?? 'other'
}

const MIN_TOPIC_ANSWERS = 8

function statusFor(practised: number, words: number, accuracy: number | null, due: number, answers: number): TopicStatus {
  if (!practised || accuracy === null) return 'not-started'
  if (answers < MIN_TOPIC_ANSWERS) return due >= 5 ? 'needs-focus' : 'preliminary'
  if (accuracy < 60 || due >= 5) return 'needs-focus'
  return accuracy >= 85 && practised / words >= 0.5 ? 'strong' : 'developing'
}

export function getTopicStats(): TopicStats[] {
  const progress = getWordProgress()
  const byTopic = new Map<string, LibraryWord[]>()
  // Imported CSVs may spell a built-in topic differently ("business"); fold those into the canonical name.
  for (const word of getAllWords()) { const raw = canonicalTopic(word.topicId, word.topic).topic.trim() || 'Other'; const name = raw[0].toLocaleUpperCase() + raw.slice(1); byTopic.set(name, [...(byTopic.get(name) ?? []), word]) }

  return [...byTopic.entries()].map(([topic, words]) => {
    const entries = words.map((word) => progress.get(word.wordId)).filter((entry): entry is WordProgress => Boolean(entry))
    const attempts = entries.reduce((sum, entry) => sum + entry.attempts, 0)
    const correct = entries.reduce((sum, entry) => sum + entry.correct, 0)
    const accuracy = attempts ? Math.round((correct / attempts) * 100) : null
    const due = entries.filter((entry) => entry.due).length
    const subtopicNames = [...new Set(words.map((word) => word.subtopic || 'General'))]
    return {
      topic, groupId: groupFor(topic), words, practised: entries.length, due, accuracy,
      known: entries.filter((entry) => entry.latest.isCorrect && entry.correct >= 2).length,
      answers: attempts,
      status: statusFor(entries.length, words.length, accuracy, due, attempts),
      lastPractised: entries.map((entry) => entry.latest.createdAt).sort().at(-1) ?? null,
      subtopics: subtopicNames.map((name) => {
        const inSub = words.filter((word) => (word.subtopic || 'General') === name)
        const subEntries = inSub.map((word) => progress.get(word.wordId)).filter(Boolean) as WordProgress[]
        return { name, words: inSub.length, practised: subEntries.length, due: subEntries.filter((entry) => entry.due).length }
      }),
    }
  })
}

// The most useful words to practise from a set: due first, then ones that keep going wrong,
// then never-seen words, then the rest (least recently practised first).
export function pickPracticeWords(words: LibraryWord[], limit = 10) {
  const progress = getWordProgress()
  const rank = (word: LibraryWord) => {
    const entry = progress.get(word.wordId)
    if (!entry) return 2
    if (entry.due) return 0
    return entry.errors > entry.correct ? 1 : 3
  }
  const lastSeen = (word: LibraryWord) => progress.get(word.wordId)?.latest.createdAt ?? ''
  return [...words]
    .sort((a, b) => rank(a) - rank(b) || lastSeen(a).localeCompare(lastSeen(b)) || a.word.localeCompare(b.word))
    .slice(0, limit)
}
