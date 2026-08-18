import { builtInLibraries } from '../data/libraries'
import type { ImportReport, LibraryDifficulty, LibraryWord, WordLibrary } from '../types/library'

const CUSTOM_LIBRARIES_KEY = 'spell-sprint.custom-libraries'
const csvHeaders = ['word_id', 'word', 'translation', 'topic_id', 'topic', 'subtopic', 'difficulty', 'risk', 'rule', 'example', 'definition', 'part_of_speech', 'library', 'source']
const requiredValues = ['word', 'translation', 'topic_id', 'topic', 'difficulty', 'risk', 'library', 'source']
export const initialTopics = ['General English', 'Everyday Life', 'Logistics', 'Warehouse Operations', 'Transport and Trade', 'Business and Office', 'Travel and Culture', 'Study and Career', 'Sport and Fitness']

function read<T>(key: string, fallback: T): T { try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }
function normalise(value: string) { return value.trim().toLocaleLowerCase() }
function safeId(value: string) { return value.trim().toLocaleLowerCase().replaceAll(/[^\p{L}\p{N}]+/gu, '-').replaceAll(/(^-|-$)/g, '') }
function validDifficulty(value: string): value is LibraryDifficulty { return ['easy', 'medium', 'hard'].includes(normalise(value)) }

function parseCsv(text: string) {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') { if (quoted && text[index + 1] === '"') { field += '"'; index += 1 } else quoted = !quoted }
    else if (character === ',' && !quoted) { row.push(field.trim()); field = '' }
    else if ((character === '\n' || character === '\r') && !quoted) { if (character === '\r' && text[index + 1] === '\n') index += 1; row.push(field.trim()); field = ''; if (row.some(Boolean)) rows.push(row); row = [] }
    else field += character
  }
  row.push(field.trim()); if (row.some(Boolean)) rows.push(row); return rows
}

function migrateLibrary(library: WordLibrary): WordLibrary {
  return { ...library, words: library.words.map((legacy) => {
    const word = legacy as LibraryWord & Partial<LibraryWord>
    const wordId = word.wordId || word.id || `${safeId(word.word)}-${safeId(word.translation)}-${safeId(word.partOfSpeech ?? '')}`
    return { ...word, id: word.id || wordId, wordId, topicId: word.topicId || safeId(word.topic), subtopic: word.subtopic ?? '', partOfSpeech: word.partOfSpeech ?? '', library: word.library || library.name, source: word.source || library.source }
  }) }
}

export function getImportedLibraries(): WordLibrary[] { return read<WordLibrary[]>(CUSTOM_LIBRARIES_KEY, []).map(migrateLibrary) }
export function getLibraries(): WordLibrary[] { return [...builtInLibraries, ...getImportedLibraries()] }
export function getAllWords() { return getLibraries().flatMap((library) => library.words) }
export function getTopicNames() { return [...new Set([...initialTopics, ...getAllWords().map((word) => word.topic)])] }
export function deleteImportedLibrary(id: string) { window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(getImportedLibraries().filter((library) => library.id !== id))) }

function duplicateKey(word: Pick<LibraryWord, 'wordId' | 'word' | 'translation' | 'partOfSpeech'>) {
  return word.wordId ? `id:${normalise(word.wordId)}` : `fallback:${normalise(word.word)}::${normalise(word.translation)}::${normalise(word.partOfSpeech)}`
}

function report(libraryName: string, topic: string, imported: number, skipped: number, duplicateCount: number, errors: string[]): ImportReport {
  return { libraryName, topic, imported, skipped, duplicateCount, errorCount: errors.length, errors: errors.slice(0, 5) }
}

export function importCsvLibrary(text: string, fileName = 'Imported library'): ImportReport {
  const rows = parseCsv(text)
  if (rows.length < 2) return report(fileName, 'Imported', 0, 0, 0, ['CSV needs a header and at least one data row.'])
  const headers = rows[0].map(normalise)
  const missingHeaders = csvHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length) return report(fileName, 'Imported', 0, rows.length - 1, 0, [`Missing CSV columns: ${missingHeaders.join(', ')}.`])
  const column = (name: string) => headers.indexOf(name)
  const errors: string[] = []; const words: LibraryWord[] = []; let invalid = 0
  rows.slice(1).forEach((row, index) => {
    const value = (name: string) => row[column(name)]?.trim() ?? ''
    const absent = requiredValues.filter((name) => !value(name))
    const difficulty = value('difficulty'); const risk = Number(value('risk'))
    if (absent.length || !validDifficulty(difficulty) || !Number.isInteger(risk) || risk < 1 || risk > 5) {
      invalid += 1; errors.push(`Row ${index + 2}: ${absent.length ? `missing ${absent.join(', ')}` : 'difficulty must be easy, medium, or hard; risk must be 1–5'}.`); return
    }
    const fallback = `${safeId(value('word'))}-${safeId(value('translation'))}-${safeId(value('part_of_speech'))}`
    words.push({ id: value('word_id') || fallback, wordId: value('word_id'), word: value('word'), translation: value('translation'), topicId: value('topic_id'), topic: value('topic'), subtopic: value('subtopic'), difficulty: normalise(difficulty) as LibraryDifficulty, risk, rule: value('rule') || undefined, example: value('example') || undefined, definition: value('definition') || undefined, partOfSpeech: value('part_of_speech'), library: value('library'), source: value('source') })
  })
  const keys = new Set(getAllWords().map(duplicateKey)); const accepted: LibraryWord[] = []; let duplicates = 0
  for (const word of words) { const key = duplicateKey(word); if (keys.has(key)) { duplicates += 1; continue }; keys.add(key); accepted.push(word) }
  const byLibrary = new Map<string, LibraryWord[]>()
  accepted.forEach((word) => byLibrary.set(word.library, [...(byLibrary.get(word.library) ?? []), word]))
  const imported = getImportedLibraries()
  const updated = [...byLibrary.entries()].reduce<WordLibrary[]>((current, [name, libraryWords]) => {
    const existingIndex = current.findIndex((library) => library.name === name)
    if (existingIndex < 0) return [...current, { id: crypto.randomUUID(), name, topic: libraryWords[0].topic, words: libraryWords, source: 'imported', createdAt: new Date().toISOString() }]
    const existing = current[existingIndex]
    const next = { ...existing, words: [...existing.words, ...libraryWords] }
    return current.map((library, index) => index === existingIndex ? next : library)
  }, imported)
  if (byLibrary.size) window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(updated))
  return report([...byLibrary.keys()].join(', ') || fileName.replace(/\.[^.]+$/, ''), accepted[0]?.topic ?? 'Imported', accepted.length, invalid + duplicates, duplicates, errors)
}

export const csvTemplate = `word_id,word,translation,topic_id,topic,subtopic,difficulty,risk,rule,example,definition,part_of_speech,library,source\nwarehouse-001,warehouse,склад,warehouse-operations,Warehouse Operations,Storage,easy,3,Use for a building where goods are stored,The goods are in the warehouse.,A building for storing goods,noun,Warehouse Starter,manual\n`
