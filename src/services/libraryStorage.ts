import { builtInLibraries } from '../data/libraries'
import { canonicalTopic, canonicalTopics, libraryKindForName, stableWordId } from '../data/libraryTaxonomy'
import { normalisePartOfSpeech, type LibraryWord, type WordLibrary } from '../types/library'

const CUSTOM_LIBRARIES_KEY = 'spell-sprint.custom-libraries'
export const initialTopics = canonicalTopics.map((item) => item.name)

function read<T>(key: string, fallback: T): T { try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback } }
function normalise(value: string) { return value.trim().toLocaleLowerCase() }
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
export function mergeImportedLibraries(incoming: WordLibrary[]) {
  const local = getImportedLibraries(); const known = new Set(local.map((library) => library.id))
  const fresh = incoming.filter((library) => library && typeof library.id === 'string' && Array.isArray(library.words) && !known.has(library.id))
  if (fresh.length) window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify([...local, ...fresh]))
  return fresh.length
}
export function getLibraries(): WordLibrary[] { return resolveLibraries([...builtInLibraries, ...getImportedLibraries()]) }
export function getAllWords() { return uniqueWords(getLibraries().flatMap((library) => library.words)) }
export function getTopicNames() { return [...new Set([...initialTopics, ...getAllWords().map((word) => word.topic)])] }
const LIBRARIES_UPDATED_EVENT = 'spell-sprint:learning-updated'
// Replaces the imported libraries on this device (used by the CSV import and its undo).
export function saveImportedLibraries(libraries: WordLibrary[]) {
  window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(libraries))
  window.dispatchEvent(new Event(LIBRARIES_UPDATED_EVENT))
}
export function deleteImportedLibrary(id: string) { window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(getImportedLibraries().filter((library) => library.id !== id))) }

export const csvTemplate = `word_id,word,translation,topic_id,topic,subtopic,difficulty,risk,rule,example,definition,part_of_speech,library,source\nwarehouse-operations-receiving-putaway,putaway,размещение товара на хранение,warehouse-operations,Warehouse Operations,Receiving and Storage,medium,4,Putaway moves received goods to storage,Putaway starts after goods receipt.,The process of moving goods into storage,noun,Warehouse Operations — SAP,manual\n`
