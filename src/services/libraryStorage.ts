import { builtInLibraries } from '../data/libraries'
import { canonicalTopic, canonicalTopics, libraryKindForName, stableWordId } from '../data/libraryTaxonomy'
import { parseCsvRows } from './csv'
import { normalisePartOfSpeech, type ImportReport, type LibraryDifficulty, type LibraryWord, type WordLibrary } from '../types/library'

const CUSTOM_LIBRARIES_KEY = 'spell-sprint.custom-libraries'
const csvHeaders = ['word_id', 'word', 'translation', 'topic_id', 'topic', 'subtopic', 'difficulty', 'risk', 'rule', 'example', 'definition', 'part_of_speech', 'library', 'source']
const requiredValues = ['word', 'translation', 'topic_id', 'topic', 'difficulty', 'risk', 'library', 'source']
export const initialTopics = canonicalTopics.map((item) => item.name)

function read<T>(key: string, fallback: T): T { try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }
function normalise(value: string) { return value.trim().toLocaleLowerCase() }
function validDifficulty(value: string): value is LibraryDifficulty { return ['easy', 'medium', 'hard'].includes(normalise(value)) }
function uniqueWords(words: LibraryWord[]) { const seen = new Set<string>(); return words.filter((word) => { const key = word.wordId || `${word.topicId}:${normalise(word.word)}:${normalise(word.partOfSpeech)}`; if (seen.has(key)) return false; seen.add(key); return true }) }

function migrateLibrary(library: WordLibrary): WordLibrary {
  return { ...library, kind: library.kind ?? libraryKindForName(library.name), includes: library.includes ?? [], words: library.words.map((legacy) => {
    const word = legacy as LibraryWord & Partial<LibraryWord>
    const canonical = canonicalTopic(word.topicId ?? '', word.topic); const subtopic = word.subtopic ?? ''
    const wordId = word.wordId || word.id || stableWordId(canonical.topicId, subtopic, word.word)
    return { ...word, id: word.id || wordId, wordId, topicId: canonical.topicId, topic: canonical.topic, subtopic, partOfSpeech: normalisePartOfSpeech(word.partOfSpeech), library: word.library || library.name, source: word.source || library.source }
  }) }
}

function resolveLibraries(libraries: WordLibrary[]) {
  const byId = new Map(libraries.map((library) => [library.id, library]))
  const resolve = (library: WordLibrary, trail = new Set<string>()): LibraryWord[] => {
    if (trail.has(library.id)) return library.words
    const nextTrail = new Set(trail).add(library.id)
    const injected = (library.includes ?? []).flatMap((id) => { const shared = byId.get(id); return shared ? resolve(shared, nextTrail) : [] })
    return uniqueWords([...library.words, ...injected]).map((word) => ({ ...word, library: library.name }))
  }
  return libraries.map((library) => ({ ...library, words: resolve(library) }))
}

export function getImportedLibraries(): WordLibrary[] { return read<WordLibrary[]>(CUSTOM_LIBRARIES_KEY, []).map(migrateLibrary) }
export function getLibraries(): WordLibrary[] { return resolveLibraries([...builtInLibraries, ...getImportedLibraries()]) }
export function getAllWords() { return uniqueWords(getLibraries().flatMap((library) => library.words)) }
export function getTopicNames() { return [...new Set([...initialTopics, ...getAllWords().map((word) => word.topic)])] }
export function deleteImportedLibrary(id: string) { window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(getImportedLibraries().filter((library) => library.id !== id))) }

function duplicateKey(word: Pick<LibraryWord, 'wordId' | 'word' | 'translation' | 'partOfSpeech'>) { return word.wordId ? `id:${normalise(word.wordId)}` : `fallback:${normalise(word.word)}::${normalise(word.translation)}::${normalise(word.partOfSpeech)}` }
function report(libraryName: string, topic: string, imported: number, skipped: number, duplicateCount: number, errors: string[]): ImportReport { return { libraryName, topic, imported, skipped, duplicateCount, errorCount: errors.length, errors: errors.slice(0, 5) } }

export function importCsvLibrary(text: string, fileName = 'Imported library'): ImportReport {
  const rows = parseCsvRows(text)
  if (rows.length < 2) return report(fileName, 'Imported', 0, 0, 0, ['CSV needs a header and at least one data row.'])
  const headers = rows[0].map(normalise); const missingHeaders = csvHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length) return report(fileName, 'Imported', 0, rows.length - 1, 0, [`Missing CSV columns: ${missingHeaders.join(', ')}.`])
  const column = (name: string) => headers.indexOf(name); const errors: string[] = []; const words: LibraryWord[] = []; let invalid = 0
  rows.slice(1).forEach((row, index) => {
    const value = (name: string) => row[column(name)]?.trim() ?? ''; const absent = requiredValues.filter((name) => !value(name)); const difficulty = value('difficulty'); const risk = Number(value('risk'))
    if (absent.length || !validDifficulty(difficulty) || !Number.isInteger(risk) || risk < 1 || risk > 5) { invalid += 1; errors.push(`Row ${index + 2}: ${absent.length ? `missing ${absent.join(', ')}` : 'difficulty must be easy, medium, or hard; risk must be 1–5'}.`); return }
    const canonical = canonicalTopic(value('topic_id'), value('topic')); const wordId = value('word_id') || stableWordId(canonical.topicId, value('subtopic'), value('word'))
    words.push({ id: wordId, wordId, word: value('word'), translation: value('translation'), topicId: canonical.topicId, topic: canonical.topic, subtopic: value('subtopic'), difficulty: normalise(difficulty) as LibraryDifficulty, risk, rule: value('rule') || undefined, example: value('example') || undefined, definition: value('definition') || undefined, partOfSpeech: normalisePartOfSpeech(value('part_of_speech')), library: value('library'), source: value('source') })
  })
  const keys = new Set(getAllWords().map(duplicateKey)); const accepted: LibraryWord[] = []; let duplicates = 0
  for (const word of words) { const key = duplicateKey(word); if (keys.has(key)) { duplicates += 1; continue }; keys.add(key); accepted.push(word) }
  const byLibrary = new Map<string, LibraryWord[]>(); accepted.forEach((word) => byLibrary.set(word.library, [...(byLibrary.get(word.library) ?? []), word]))
  const updated = [...byLibrary.entries()].reduce<WordLibrary[]>((current, [name, libraryWords]) => {
    const index = current.findIndex((library) => library.name === name)
    if (index < 0) return [...current, { id: crypto.randomUUID(), name, topic: libraryWords[0].topic, words: libraryWords, source: 'imported', kind: libraryKindForName(name), includes: [], createdAt: new Date().toISOString() }]
    return current.map((library, currentIndex) => currentIndex === index ? { ...library, words: [...library.words, ...libraryWords] } : library)
  }, getImportedLibraries())
  if (byLibrary.size) window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(updated))
  return report([...byLibrary.keys()].join(', ') || fileName.replace(/\.[^.]+$/, ''), accepted[0]?.topic ?? 'Imported', accepted.length, invalid + duplicates, duplicates, errors)
}

export const csvTemplate = `word_id,word,translation,topic_id,topic,subtopic,difficulty,risk,rule,example,definition,part_of_speech,library,source\nwarehouse-operations-receiving-putaway,putaway,размещение товара на хранение,warehouse-operations,Warehouse Operations,Receiving and Storage,medium,4,Putaway moves received goods to storage,Putaway starts after goods receipt.,The process of moving goods into storage,noun,Warehouse Operations — SAP,manual\n`
