import builtInCsv from './spell-sprint-built-in-library.csv?raw'
import { canonicalTopic, libraryKindForName } from './libraryTaxonomy'
import type { LibraryDifficulty, LibraryWord, WordLibrary } from '../types/library'

const includesByLibrary: Record<string, string[]> = {
  'Supply Chain Core': ['shared-inventory-fundamentals'],
  'Warehouse Operations — SAP': ['shared-inventory-fundamentals'],
  'Business and Office Core': ['shared-professional-essentials'],
  'General English — Active Vocabulary': ['shared-professional-essentials'],
  'Study and Career Core': ['shared-professional-essentials'],
}

function parseRows(text: string) {
  const lines = text.trim().split(/\r?\n/); const headers = lines[0].split(',')
  return lines.slice(1).map((line) => Object.fromEntries(line.split(',').map((value, index) => [headers[index], value.trim()])))
}

function builtInWord(row: Record<string, string>): LibraryWord {
  const topic = canonicalTopic(row.topic_id, row.topic)
  return {
    id: row.word_id, wordId: row.word_id, word: row.word, translation: row.translation, topicId: topic.topicId, topic: topic.topic, subtopic: row.subtopic || 'General',
    difficulty: row.difficulty as LibraryDifficulty, risk: Number(row.risk), rule: row.rule || undefined, example: row.example || undefined, definition: row.definition || undefined,
    partOfSpeech: row.part_of_speech || '', library: row.library, source: row.source || 'legacy-migrated',
  }
}

export const builtInLibraries: WordLibrary[] = Object.entries(
  parseRows(builtInCsv).map(builtInWord).reduce<Record<string, LibraryWord[]>>((groups, word) => ({ ...groups, [word.library]: [...(groups[word.library] ?? []), word] }), {}),
).map(([name, words]) => ({
  id: name.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, ''), name, topic: words[0].topic, words, source: 'built-in', kind: libraryKindForName(name), includes: includesByLibrary[name] ?? [],
}))
