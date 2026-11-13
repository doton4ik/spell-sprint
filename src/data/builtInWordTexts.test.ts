import { describe, expect, it, vi } from 'vitest'
import core from './spell-sprint-built-in-library.csv?core'
import csv from './spell-sprint-built-in-library.csv?raw'
import { getEveryWord } from '../services/libraryStorage'
import { parseCsvRows } from '../services/csv'
import { builtInLibraries, loadWordTexts, wordTextsRevision } from './libraries'
import { TEXT_COLUMNS } from './libraryCsvParts'

describe('the texts of the built-in words', () => {
  it('are on every word exactly as in the CSV', () => {
    const [header, ...rows] = parseCsvRows(csv)
    const at = (name: string) => header.indexOf(name)
    const idAt = at('word_id')
    expect(idAt).toBeGreaterThanOrEqual(0)
    for (const name of ['definition', 'extra_example', 'extra_example_source']) expect(at(name), name).toBeGreaterThanOrEqual(0)

    const words = new Map(builtInLibraries.flatMap((library) => library.words).map((word) => [word.id, word]))
    expect(words.size).toBe(rows.length)

    const mismatches: string[] = []
    for (const row of rows) {
      const word = words.get(row[idAt])
      if (!word) {
        mismatches.push(`${row[idAt]}: no word`)
        continue
      }
      const expected = {
        definition: row[at('definition')] || undefined,
        extraExample: row[at('extra_example')] || undefined,
        extraExampleSource: row[at('extra_example_source')] || undefined,
      }
      const actual = {
        definition: word.definition,
        extraExample: word.extraExample,
        extraExampleSource: word.extraExampleSource,
      }
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        mismatches.push(`${row[idAt]}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`)
    }
    expect(mismatches).toEqual([])
  })

  it('are not in the core part, which is much shorter than the whole file', () => {
    const coreHeader = parseCsvRows(core)[0]
    for (const name of TEXT_COLUMNS) expect(coreHeader, name).not.toContain(name)
    expect(coreHeader).toContain('word_id')
    expect(core.length).toBeLessThanOrEqual(csv.length * 0.65)
  })

  it('are in the copies of the words that the library storage keeps', () => {
    const words = getEveryWord()
    expect(words.filter((word) => word.definition && word.extraExample).length).toBeGreaterThanOrEqual(3900)
  })

  // The test above cannot fail when the storage forgets to rebuild its copies: test-setup loads the texts before
  // anything reads a word. Here the app's real order is replayed on fresh modules: words, a first read, then the texts.
  it('reach the copies that were made before the texts arrived', async () => {
    vi.resetModules()
    const libraries = await import('./libraries')
    const storage = await import('../services/libraryStorage')
    await libraries.loadBuiltInLibraries()
    const early = storage.getEveryWord()
    expect(early.length).toBeGreaterThan(3900)
    expect(early.some((word) => word.definition || word.extraExample)).toBe(false)
    expect(early.every((word) => word.word && word.translation)).toBe(true)
    await libraries.loadWordTexts()
    expect(libraries.wordTextsRevision).toBe(1)
    const late = storage.getEveryWord()
    expect(late).not.toBe(early)
    expect(late.filter((word) => word.definition && word.extraExample).length).toBeGreaterThanOrEqual(3900)
    expect(storage.getAllWords().some((word) => word.definition)).toBe(true)
  })

  it('are loaded once: a second loadWordTexts() changes nothing', async () => {
    const before = wordTextsRevision
    expect(before).toBeGreaterThan(0)
    await expect(loadWordTexts()).resolves.toBeUndefined()
    expect(wordTextsRevision).toBe(before)
  })
})
