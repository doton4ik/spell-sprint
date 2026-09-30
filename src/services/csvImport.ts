import { canonicalTopic, libraryKindForName, stableWordId } from '../data/libraryTaxonomy'
import { normalisePartOfSpeech, partOfSpeechOptions, type LibraryDifficulty, type LibraryWord, type WordLibrary } from '../types/library'
import { parseCsvRows } from './csv'
import { getEveryWord, getImportedLibraries, saveImportedLibraries } from './libraryStorage'

// CSV import in two steps: analyse (nothing is saved) → the learner sees what will happen → commit.
// Only `word` and `translation` are required; every other column has a sensible default, and each
// default or oddity is reported as a warning instead of silently rejecting the whole file.

const knownColumns = ['word_id', 'word', 'translation', 'topic_id', 'topic', 'subtopic', 'difficulty', 'risk', 'rule', 'example', 'definition', 'part_of_speech', 'library', 'source']
const requiredColumns = ['word', 'translation']

export type RowStatus = 'ready' | 'duplicate' | 'duplicate-in-file' | 'conflict' | 'invalid'
export type PreviewRow = { line: number; word: string; translation: string; status: RowStatus; issues: string[]; warnings: string[]; entry?: LibraryWord }
export type CsvPreview = {
  fileName: string
  fatal: string | null // the file cannot be imported at all (e.g. no word column)
  totalRows: number
  rows: PreviewRow[]
  counts: Record<RowStatus, number> & { warnings: number }
  ignoredColumns: string[]
  newTopics: string[]
  newSubtopics: string[]
  libraries: Array<{ name: string; words: number; isNew: boolean }>
}
export type ImportBatch = { wordIds: string[]; createdLibraryIds: string[]; libraries: string[]; imported: number }

const norm = (value: string) => value.trim().toLocaleLowerCase()
// Same English word with the same translation = the same entry, whatever part of speech a file claims.
const duplicateKey = (word: Pick<LibraryWord, 'word' | 'translation'>) => `${norm(word.word)}::${norm(word.translation)}`
const hasCyrillic = (value: string) => /[Ѐ-ӿ]/.test(value)
const partOfSpeechNames = new Set<string>(partOfSpeechOptions)

export function analyseCsv(text: string, fileName: string): CsvPreview {
  const baseName = fileName.replace(/\.[^.]+$/, '').trim() || 'Imported library'
  const empty = { ready: 0, duplicate: 0, 'duplicate-in-file': 0, conflict: 0, invalid: 0, warnings: 0 }
  const fail = (fatal: string): CsvPreview => ({ fileName, fatal, totalRows: 0, rows: [], counts: empty, ignoredColumns: [], newTopics: [], newSubtopics: [], libraries: [] })

  if (!fileName.toLocaleLowerCase().endsWith('.csv')) return fail('Only .csv files can be imported.')
  const table = parseCsvRows(text.replace(/^﻿/, ''))
  if (table.length < 2) return fail('The file needs a header row and at least one word.')
  const headers = table[0].map(norm)
  const missing = requiredColumns.filter((column) => !headers.includes(column))
  if (missing.length) return fail(`Missing required column${missing.length === 1 ? '' : 's'}: ${missing.join(', ')}. The first row must be the header (download the template to see it).`)

  const existing = getEveryWord()
  const existingKeys = new Set(existing.map(duplicateKey))
  const existingById = new Map(existing.map((word) => [norm(word.wordId), word]))
  const existingTopics = new Set(existing.map((word) => word.topic))
  const existingSubtopics = new Set(existing.map((word) => `${word.topic}::${word.subtopic}`))
  const existingLibraries = new Set(getImportedLibraries().map((library) => library.name))
  const seenInFile = new Map<string, number>()

  const rows: PreviewRow[] = table.slice(1).map((cells, index) => {
    const line = index + 2
    const value = (name: string) => (headers.indexOf(name) >= 0 ? cells[headers.indexOf(name)] ?? '' : '').trim()
    const word = value('word'); const translation = value('translation')
    const issues: string[] = []; const warnings: string[] = []
    if (!word) issues.push('word is empty')
    if (!translation) issues.push('translation is empty')
    if (word && hasCyrillic(word)) issues.push('the English word contains Russian letters')
    // A part of speech in the library column means the columns slipped — almost always a comma inside
    // an unquoted example. Importing it would create a library called "noun".
    if (partOfSpeechNames.has(norm(value('library')))) issues.push(`the columns look shifted (library is “${value('library')}”) — put text with commas in "double quotes"`)
    if (issues.length) return { line, word, translation, status: 'invalid', issues, warnings }

    const rawDifficulty = norm(value('difficulty'))
    const difficulty: LibraryDifficulty = rawDifficulty === 'easy' || rawDifficulty === 'medium' || rawDifficulty === 'hard' ? rawDifficulty : 'medium'
    if (rawDifficulty && rawDifficulty !== difficulty) warnings.push(`difficulty “${value('difficulty')}” is not easy/medium/hard — set to medium`)
    const rawRisk = value('risk'); const parsedRisk = Number(rawRisk)
    const risk = Number.isInteger(parsedRisk) && parsedRisk >= 1 && parsedRisk <= 5 ? parsedRisk : 3
    if (rawRisk && risk !== parsedRisk) warnings.push(`risk “${rawRisk}” is not 1–5 — set to 3`)
    const example = value('example')
    if (example && !norm(example).includes(norm(word))) warnings.push('the example sentence does not contain the word')
    if (!value('topic')) warnings.push('no topic — filed under “Imported”')

    const canonical = canonicalTopic(value('topic_id'), value('topic') || 'Imported')
    const subtopic = value('subtopic') || 'General'
    const wordId = value('word_id') || stableWordId(canonical.topicId, subtopic, word)
    const entry: LibraryWord = {
      id: wordId, wordId, word, translation, topicId: canonical.topicId, topic: canonical.topic, subtopic, difficulty, risk,
      rule: value('rule') || undefined, example: example || undefined, definition: value('definition') || undefined,
      partOfSpeech: normalisePartOfSpeech(value('part_of_speech')), library: value('library') || baseName, source: value('source') || 'imported',
    }

    const sameId = existingById.get(norm(wordId))
    if (sameId && norm(sameId.word) !== norm(word)) return { line, word, translation, status: 'conflict', issues: [`word_id “${wordId}” already belongs to “${sameId.word}”`], warnings }
    if (sameId || existingKeys.has(duplicateKey(entry))) return { line, word, translation, status: 'duplicate', issues: [sameId ? `same word_id as “${sameId.word}” in ${sameId.library}` : `same word and translation already in ${existing.find((item) => duplicateKey(item) === duplicateKey(entry))?.library ?? 'a library'}`], warnings }
    const fileKey = duplicateKey(entry)
    if (seenInFile.has(fileKey)) return { line, word, translation, status: 'duplicate-in-file', issues: [`repeats row ${seenInFile.get(fileKey)}`], warnings }
    seenInFile.set(fileKey, line)
    return { line, word, translation, status: 'ready', issues: [], warnings, entry }
  })

  const ready = rows.filter((row) => row.status === 'ready' && row.entry).map((row) => row.entry!)
  const counts = { ...empty }
  for (const row of rows) { counts[row.status] += 1; if (row.warnings.length) counts.warnings += 1 }
  const byLibrary = new Map<string, number>()
  for (const entry of ready) byLibrary.set(entry.library, (byLibrary.get(entry.library) ?? 0) + 1)

  return {
    fileName, fatal: null, totalRows: rows.length, rows, counts,
    ignoredColumns: table[0].filter((header, index) => header.trim() && !knownColumns.includes(headers[index])),
    newTopics: [...new Set(ready.map((entry) => entry.topic).filter((topic) => !existingTopics.has(topic)))],
    newSubtopics: [...new Set(ready.filter((entry) => !existingSubtopics.has(`${entry.topic}::${entry.subtopic}`)).map((entry) => `${entry.topic} · ${entry.subtopic}`))],
    libraries: [...byLibrary.entries()].map(([name, words]) => ({ name, words, isNew: !existingLibraries.has(name) })),
  }
}

// Saves only the rows marked ready. Returns what was added, so the import can be undone.
export function commitCsvImport(preview: CsvPreview): ImportBatch {
  const ready = preview.rows.filter((row) => row.status === 'ready' && row.entry).map((row) => row.entry!)
  const libraries = getImportedLibraries()
  const createdLibraryIds: string[] = []
  for (const entry of ready) {
    const library = libraries.find((item) => item.name === entry.library)
    if (library) { library.words = [...library.words, entry]; continue }
    const created: WordLibrary = { id: crypto.randomUUID(), name: entry.library, topic: entry.topic, words: [entry], source: 'imported', kind: libraryKindForName(entry.library), includes: [], createdAt: new Date().toISOString() }
    libraries.push(created); createdLibraryIds.push(created.id)
  }
  if (ready.length) saveImportedLibraries(libraries)
  return { wordIds: ready.map((entry) => entry.wordId), createdLibraryIds, libraries: [...new Set(ready.map((entry) => entry.library))], imported: ready.length }
}

// Undo: removes exactly the words this import added, and any library it created that is now empty.
export function undoCsvImport(batch: ImportBatch) {
  const ids = new Set(batch.wordIds)
  const created = new Set(batch.createdLibraryIds)
  const libraries = getImportedLibraries()
    .map((library) => ({ ...library, words: library.words.filter((word) => !ids.has(word.wordId)) }))
    .filter((library) => !(created.has(library.id) && library.words.length === 0))
  saveImportedLibraries(libraries)
}
