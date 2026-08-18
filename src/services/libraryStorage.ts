import { builtInLibraries } from '../data/libraries'
import type { ImportReport, LibraryDifficulty, LibraryWord, WordLibrary } from '../types/library'

const CUSTOM_LIBRARIES_KEY = 'spell-sprint.custom-libraries'
const requiredCsvFields = ['word', 'translation', 'topic', 'difficulty', 'risk']

function read<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function normalise(value: string) { return value.trim().toLocaleLowerCase() }

function validDifficulty(value: string): value is LibraryDifficulty {
  return ['easy', 'medium', 'hard'].includes(normalise(value))
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1 } else quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(field.trim()); field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(field.trim()); field = ''
      if (row.some(Boolean)) rows.push(row)
      row = []
    } else field += character
  }
  row.push(field.trim())
  if (row.some(Boolean)) rows.push(row)
  return rows
}

function libraryWord(values: Omit<LibraryWord, 'id'>): LibraryWord {
  return { ...values, id: crypto.randomUUID() }
}

export function getLibraries(): WordLibrary[] {
  return [...builtInLibraries, ...read<WordLibrary[]>(CUSTOM_LIBRARIES_KEY, [])]
}

export function getImportedLibraries(): WordLibrary[] {
  return read<WordLibrary[]>(CUSTOM_LIBRARIES_KEY, [])
}

function duplicateKeys() {
  return new Set(getLibraries().flatMap((library) => library.words.map((word) => `${normalise(word.word)}::${normalise(word.topic)}`)))
}

function saveLibrary(library: WordLibrary) {
  const imported = read<WordLibrary[]>(CUSTOM_LIBRARIES_KEY, [])
  window.localStorage.setItem(CUSTOM_LIBRARIES_KEY, JSON.stringify([...imported, library]))
}

function createReport(name: string, topic: string, words: LibraryWord[], skipped: number, errors: string[]): ImportReport {
  const keys = duplicateKeys()
  const accepted: LibraryWord[] = []
  let duplicates = 0
  for (const word of words) {
    const key = `${normalise(word.word)}::${normalise(word.topic)}`
    if (keys.has(key)) { duplicates += 1; continue }
    keys.add(key); accepted.push(word)
  }
  if (accepted.length) saveLibrary({ id: crypto.randomUUID(), name, topic, words: accepted, source: 'imported', createdAt: new Date().toISOString() })
  if (duplicates) errors.push(`${duplicates} duplicate ${duplicates === 1 ? 'word was' : 'words were'} skipped.`)
  return { libraryName: name, topic, imported: accepted.length, skipped: skipped + duplicates, errors }
}

export function importCsvLibrary(text: string, fileName = 'Imported library'): ImportReport {
  const rows = parseCsv(text)
  if (rows.length < 2) return { libraryName: fileName, topic: 'Imported', imported: 0, skipped: 0, errors: ['The CSV needs a header and at least one data row.'] }
  const headers = rows[0].map(normalise)
  const missing = requiredCsvFields.filter((field) => !headers.includes(field))
  if (missing.length) return { libraryName: fileName, topic: 'Imported', imported: 0, skipped: rows.length - 1, errors: [`Missing required columns: ${missing.join(', ')}.`] }
  const index = (name: string) => headers.indexOf(name)
  const errors: string[] = []
  const words: LibraryWord[] = []
  let skipped = 0

  rows.slice(1).forEach((row, offset) => {
    const word = row[index('word')]?.trim()
    const translation = row[index('translation')]?.trim()
    const topic = row[index('topic')]?.trim()
    const difficulty = row[index('difficulty')]?.trim()
    const risk = Number(row[index('risk')]?.trim())
    if (!word || !translation || !topic || !difficulty || !Number.isInteger(risk) || risk < 1 || risk > 5 || !validDifficulty(difficulty)) {
      skipped += 1
      errors.push(`Row ${offset + 2}: use word, translation, topic, difficulty (easy/medium/hard), and risk (1–5).`)
      return
    }
    words.push(libraryWord({ word, translation, topic, difficulty: normalise(difficulty) as LibraryDifficulty, risk, rule: row[index('rule')]?.trim(), example: row[index('example')]?.trim(), partOfSpeech: row[index('part_of_speech')]?.trim() }))
  })
  const topic = words[0]?.topic ?? 'Imported'
  return createReport(fileName.replace(/\.[^.]+$/, ''), topic, words, skipped, errors.slice(0, 4))
}

export function importJsonLibrary(text: string): ImportReport {
  try {
    const source = JSON.parse(text) as { name?: unknown; topic?: unknown; words?: unknown }
    if (typeof source.name !== 'string' || typeof source.topic !== 'string' || !Array.isArray(source.words)) {
      return { libraryName: 'Imported library', topic: 'Imported', imported: 0, skipped: 0, errors: ['JSON must include name, topic, and a words array.'] }
    }
    const errors: string[] = []
    const words: LibraryWord[] = []
    let skipped = 0
    source.words.forEach((item, index) => {
      const word = item as Record<string, unknown>
      const en = typeof word.en === 'string' ? word.en.trim() : ''
      const ru = typeof word.ru === 'string' ? word.ru.trim() : ''
      const level = typeof word.level === 'string' ? normalise(word.level) : 'medium'
      const risk = typeof word.risk === 'number' ? word.risk : Number(word.risk)
      if (!en || !ru || !validDifficulty(level) || !Number.isInteger(risk) || risk < 1 || risk > 5) {
        skipped += 1; errors.push(`Word ${index + 1}: en, ru, level (easy/medium/hard), and risk (1–5) are required.`); return
      }
      words.push(libraryWord({ word: en, translation: ru, topic: source.topic as string, difficulty: level, risk, rule: typeof word.rule === 'string' ? word.rule : undefined, example: typeof word.example === 'string' ? word.example : undefined }))
    })
    return createReport(source.name, source.topic, words, skipped, errors.slice(0, 4))
  } catch {
    return { libraryName: 'Imported library', topic: 'Imported', imported: 0, skipped: 0, errors: ['This JSON could not be read. Check commas, quotes, and brackets.'] }
  }
}

export const csvTemplate = `word,translation,topic,difficulty,risk,rule,example,part_of_speech\nwarehouse,склад,logistics,easy,3,"A building where goods are stored","The goods are in the warehouse.",noun\n`
