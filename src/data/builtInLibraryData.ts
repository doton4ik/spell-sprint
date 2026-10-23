import builtInCsv from './spell-sprint-built-in-library.csv?raw'
import { canonicalTopic, libraryKindForName } from './libraryTaxonomy'
import { parseCsvRows } from '../services/csv'
import { isCefrLevel } from './libraryTopics'
import { canonicalWordId } from './wordAliases'
import { normalisePartOfSpeech, type LibraryDifficulty, type LibraryWord, type WordLibrary } from '../types/library'

function parseRows(text: string) {
  const rows = parseCsvRows(text)
  const headers = rows[0]
  return rows.slice(1).map((row) => Object.fromEntries(row.map((value, index) => [headers[index], value])))
}

const alternativesOf = (value: string | undefined) =>
  (value ?? '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)

function builtInWord(row: Record<string, string>): LibraryWord {
  const topic = canonicalTopic(row.topic_id, row.topic)
  return {
    id: row.word_id,
    wordId: canonicalWordId(row.word_id),
    word: row.word,
    translation: row.translation,
    topicId: topic.topicId,
    topic: topic.topic,
    subtopic: row.subtopic || 'General',
    difficulty: row.difficulty as LibraryDifficulty,
    risk: Number(row.risk),
    rule: row.rule || undefined,
    example: row.example || undefined,
    extraExample: row.extra_example || undefined,
    extraExampleSource: row.extra_example_source || undefined,
    definition: row.definition || undefined,
    alternatives: alternativesOf(row.alternatives),
    partOfSpeech: normalisePartOfSpeech(row.part_of_speech),
    level: isCefrLevel(row.level) ? row.level : undefined,
    library: row.library,
    source: row.source || 'legacy-migrated',
  }
}

// The built-in words, parsed from the CSV. Loaded on its own (see libraries.ts) so the CSV is a separate download.
export const builtInLibraries: WordLibrary[] = Object.entries(
  parseRows(builtInCsv)
    .map(builtInWord)
    .reduce<Record<string, LibraryWord[]>>((groups, word) => ({ ...groups, [word.library]: [...(groups[word.library] ?? []), word] }), {}),
).map(([name, words]) => ({
  id: name
    .toLocaleLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, ''),
  name,
  topic: words[0].topic,
  words,
  source: 'built-in',
  kind: libraryKindForName(name),
  includes: [],
}))
