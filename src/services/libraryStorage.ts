import { builtInLibraries } from '../data/libraries'
import { libraryPacks, packForLibrary } from '../data/libraryPacks'
import { getHiddenWordIds, getLibraryPrefs, getRemovedKeys, initialisePacks, setRemoved } from './libraryPrefs'
import { canonicalTopic, canonicalTopics, libraryKindForName, stableWordId } from '../data/libraryTaxonomy'
import { normalisePartOfSpeech, partOfSpeechOptions, type LibraryWord, type WordLibrary } from '../types/library'

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

// Repairs two kinds of damage in imported libraries, both from older versions of the app:
//  1. the same library twice (same name, different id — typically a copy that arrived from another
//     device through cloud sync): merged into one, words de-duplicated;
//  2. a library called "noun", "adjective" … — rows of an old CSV import whose unquoted comma shifted
//     the columns, so the part of speech landed in the library column. Those words are moved back to
//     the library imported at the same time (or to "Imported words" when there is none).
const partOfSpeechNames = new Set<string>(partOfSpeechOptions)
const wordKey = (word: LibraryWord) => word.wordId || `${normalise(word.word)}::${normalise(word.translation)}`
const createdTime = (library: WordLibrary) => (library.createdAt ? new Date(library.createdAt).getTime() : 0)

export function repairImportedLibraries(libraries: WordLibrary[]): WordLibrary[] {
  const byName = new Map<string, WordLibrary>()
  const misfiled: WordLibrary[] = []
  for (const library of [...libraries].sort((a, b) => createdTime(a) - createdTime(b))) {
    if (partOfSpeechNames.has(normalise(library.name))) { misfiled.push(library); continue }
    const existing = byName.get(normalise(library.name))
    if (existing) existing.words = [...existing.words, ...library.words]
    else byName.set(normalise(library.name), { ...library, words: [...library.words] })
  }
  const kept = [...byName.values()]
  for (const library of misfiled) {
    const sameImport = kept.filter((candidate) => Math.abs(createdTime(candidate) - createdTime(library)) <= 2 * 86400000)
      .sort((a, b) => Math.abs(createdTime(a) - createdTime(library)) - Math.abs(createdTime(b) - createdTime(library)))[0]
    let target = sameImport ?? kept.find((candidate) => candidate.name === 'Imported words')
    if (!target) { target = { ...library, name: 'Imported words', words: [], kind: libraryKindForName('Imported words') }; kept.push(target) }
    target.words = [...target.words, ...library.words]
  }
  return kept.map((library) => {
    const seen = new Set<string>()
    const words = library.words.filter((word) => { const key = wordKey(word); if (seen.has(key)) return false; seen.add(key); return true }).map((word) => ({ ...word, library: library.name }))
    return { ...library, words }
  }).filter((library) => library.words.length)
}

export function getImportedLibraries(): WordLibrary[] {
  const stored = read<WordLibrary[]>(CUSTOM_LIBRARIES_KEY, []).map(migrateLibrary)
  const repaired = repairImportedLibraries(stored)
  // Save the repair once, so other screens and the next cloud sync see the clean list.
  if (JSON.stringify(repaired) !== JSON.stringify(stored)) { try { window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(repaired)) } catch { /* keep using the repaired copy in memory */ } }
  return repaired
}
export const removalKey = { library: (name: string) => `lib:${normalise(name)}`, word: (wordId: string) => `word:${wordId}` }

// Drops what the learner deleted on any device (see "removed" in libraryPrefs).
function withoutRemoved(libraries: WordLibrary[]) {
  const removed = getRemovedKeys()
  if (!removed.size) return libraries
  return libraries.filter((library) => !removed.has(removalKey.library(library.name)))
    .map((library) => ({ ...library, words: library.words.filter((word) => !removed.has(removalKey.word(word.wordId))) }))
    .filter((library) => library.words.length)
}

// Cloud restore: libraries from another device are merged by name, so a synced copy never shows up twice.
export function mergeImportedLibraries(incoming: WordLibrary[]) {
  const local = getImportedLibraries()
  const valid = incoming.filter((library) => library && typeof library.id === 'string' && typeof library.name === 'string' && Array.isArray(library.words)).map(migrateLibrary)
  const merged = withoutRemoved(repairImportedLibraries([...local, ...valid]))
  const before = local.reduce((sum, library) => sum + library.words.length, 0)
  const after = merged.reduce((sum, library) => sum + library.words.length, 0)
  if (JSON.stringify(merged) !== JSON.stringify(local)) window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(merged))
  return after - before
}
// Every library and word, including switched-off packs and hidden words. Use it to look things up
// (history, past mistakes), never to choose what the learner practises.
export function getEveryLibrary(): WordLibrary[] { return resolveLibraries([...builtInLibraries, ...getImportedLibraries()]) }
export function getEveryWord() { return uniqueWords(getEveryLibrary().flatMap((library) => library.words)) }

// Before packs existed everything was on. Packs the learner has already practised stay on.
function packsInUse() {
  try {
    const attempts = JSON.parse(window.localStorage.getItem('spell-sprint.practice-attempts') ?? '[]') as Array<{ library?: string }>
    const used = new Set(attempts.map((attempt) => attempt.library).filter(Boolean))
    return libraryPacks.filter((pack) => pack.libraries.some((name) => used.has(name))).map((pack) => pack.id)
  } catch { return [] }
}

export function isLibraryActive(library: WordLibrary) {
  if (library.source !== 'built-in') return true
  const pack = packForLibrary(library.name)
  return !pack || getLibraryPrefs().packs[pack.id]?.on === true
}

// What the learner studies: the base library, the packs they switched on and their own imports,
// without the words they hid.
export function getLibraries(): WordLibrary[] {
  if (!getLibraryPrefs().packsInitialised) initialisePacks(packsInUse())
  const hidden = getHiddenWordIds()
  return getEveryLibrary().filter(isLibraryActive).map((library) => ({ ...library, words: library.words.filter((word) => !hidden.has(word.wordId)) })).filter((library) => library.words.length)
}
export function getAllWords() { return uniqueWords(getLibraries().flatMap((library) => library.words)) }
export function getTopicNames() { return [...new Set([...initialTopics, ...getAllWords().map((word) => word.topic)])] }
const LIBRARIES_UPDATED_EVENT = 'spell-sprint:learning-updated'
// Replaces the imported libraries on this device (used by the CSV import and its undo).
export function saveImportedLibraries(libraries: WordLibrary[]) {
  window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify(libraries))
  window.dispatchEvent(new Event(LIBRARIES_UPDATED_EVENT))
}
export function deleteImportedLibrary(id: string) {
  const libraries = getImportedLibraries()
  const library = libraries.find((item) => item.id === id)
  if (library) setRemoved([removalKey.library(library.name)], true)
  saveImportedLibraries(libraries.filter((item) => item.id !== id))
}

export const csvTemplate = `word_id,word,translation,topic_id,topic,subtopic,difficulty,risk,rule,example,definition,part_of_speech,library,source\nwarehouse-operations-receiving-putaway,putaway,размещение товара на хранение,warehouse-operations,Warehouse Operations,Receiving and Storage,medium,4,Putaway moves received goods to storage,Putaway starts after goods receipt.,The process of moving goods into storage,noun,Warehouse Operations — SAP,manual\n`
