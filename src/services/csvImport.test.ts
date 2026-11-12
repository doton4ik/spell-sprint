import { beforeEach, describe, expect, it } from 'vitest'
import { analyseCsv, commitCsvImport, undoCsvImport } from './csvImport'
import { getEveryWord, getImportedLibraries } from './libraryStorage'
import { getRemovedKeys } from './libraryPrefs'

const HEADER = 'word,translation,topic,subtopic,library,example'

describe('analyseCsv: whole-file problems', () => {
  beforeEach(() => window.localStorage.clear())

  it('accepts only .csv files, whatever the case', () => {
    expect(analyseCsv('word,translation\nfoo,bar', 'words.txt').fatal).toMatch(/Only \.csv/)
    expect(analyseCsv('word,translation\nzzfoo,bar', 'WORDS.CSV').fatal).toBeNull()
  })
  it('needs a header and at least one row', () => {
    expect(analyseCsv('', 'a.csv').fatal).toMatch(/header row/)
    expect(analyseCsv('word,translation', 'a.csv').fatal).toMatch(/header row/)
    expect(analyseCsv('\n\n\n', 'a.csv').fatal).toMatch(/header row/)
  })
  it('names the missing required columns', () => {
    expect(analyseCsv('word\nfoo', 'a.csv').fatal).toMatch(/Missing required column: translation/)
    expect(analyseCsv('a,b\n1,2', 'a.csv').fatal).toMatch(/Missing required columns: word, translation/)
  })
  it('refuses a file that is too large or has too many rows', () => {
    expect(analyseCsv(`word,translation\n${'x'.repeat(2_000_001)}`, 'a.csv').fatal).toMatch(/too large/)
    const rows = Array.from({ length: 5001 }, (_, index) => `zzw${index},t`).join('\n')
    expect(analyseCsv(`word,translation\n${rows}`, 'a.csv').fatal).toMatch(/more than 5000/)
  })
  it('accepts exactly 5000 words', () => {
    const rows = Array.from({ length: 5000 }, (_, index) => `zzw${index},t${index}`).join('\n')
    const preview = analyseCsv(`word,translation\n${rows}`, 'a.csv')
    expect(preview.fatal).toBeNull()
    expect(preview.counts.ready).toBe(5000)
  })
  it('has empty counts when it fails', () => {
    const preview = analyseCsv('x', 'a.csv')
    expect(preview.rows).toEqual([])
    expect(preview.counts).toMatchObject({ ready: 0, invalid: 0, warnings: 0 })
  })
  it('ignores a byte-order mark and Windows line endings, and matches headers in any case', () => {
    const preview = analyseCsv('﻿Word,TRANSLATION\r\nzzalpha,альфа\r\nzzbeta,бета\r\n', 'a.csv')
    expect(preview.fatal).toBeNull()
    expect(preview.counts.ready).toBe(2)
    expect(preview.rows.map((row) => row.line)).toEqual([2, 3])
  })
  it('lists columns it does not know, with their original spelling', () => {
    const preview = analyseCsv('word,translation,Colour,\nzzalpha,альфа,red,x', 'a.csv')
    expect(preview.ignoredColumns).toEqual(['Colour'])
  })
})

describe('analyseCsv: rows', () => {
  beforeEach(() => window.localStorage.clear())
  const one = (row: string, header = HEADER) => analyseCsv(`${header}\n${row}`, 'my list.csv').rows[0]

  it('fills the defaults of a row that has only a word and a translation', () => {
    const row = analyseCsv('word,translation\nzzalpha,альфа', 'my list.csv').rows[0]
    expect(row.status).toBe('ready')
    expect(row.entry).toMatchObject({
      word: 'zzalpha',
      translation: 'альфа',
      difficulty: 'medium',
      risk: 3,
      subtopic: 'General',
      topic: 'Imported',
      library: 'my list',
      source: 'imported',
      alternatives: [],
    })
    expect(row.entry?.wordId).toBe(row.entry?.id)
    expect(row.warnings).toEqual(['no topic — filed under “Imported”'])
  })
  it('names the library after the file when there is no library column, and uses a fallback for a bare extension', () => {
    expect(analyseCsv('word,translation\nzzalpha,а', 'Trip.csv').rows[0].entry?.library).toBe('Trip')
    expect(analyseCsv('word,translation\nzzalpha,а', '.csv').rows[0].entry?.library).toBe('Imported library')
  })
  it('marks empty words and translations as invalid', () => {
    expect(one(',альфа').issues).toContain('word is empty')
    expect(one('zzalpha,').issues).toContain('translation is empty')
  })
  it('treats a cell with only spaces as empty', () => {
    expect(one('   ,альфа').status).toBe('invalid')
  })
  it('rejects an English word written in Russian letters', () => {
    const row = one('привет,hello')
    expect(row.status).toBe('invalid')
    expect(row.issues).toContain('the English word contains Russian letters')
  })
  it('rejects a word and a translation that are too long', () => {
    expect(one(`${'a'.repeat(101)},t`).issues[0]).toMatch(/word is longer than 100/)
    expect(one(`a,${'т'.repeat(301)}`).issues[0]).toMatch(/translation is longer than 300/)
  })
  it('detects shifted columns when a part of speech lands in the library column', () => {
    const row = analyseCsv('word,translation,library\nzzalpha,а,Noun', 'a.csv').rows[0]
    expect(row.status).toBe('invalid')
    expect(row.issues[0]).toMatch(/columns look shifted/)
  })
  it('falls back to medium difficulty and risk 3 with a warning for bad values', () => {
    const header = 'word,translation,topic,difficulty,risk'
    const row = one('zzalpha,а,Travel,tricky,9', header)
    expect(row.entry).toMatchObject({ difficulty: 'medium', risk: 3 })
    expect(row.warnings).toHaveLength(2)
    expect(one('zzalpha,а,Travel,HARD,5', header).entry).toMatchObject({ difficulty: 'hard', risk: 5 })
    expect(one('zzalpha,а,Travel,HARD,5', header).warnings).toEqual([])
    expect(one('zzalpha,а,Travel,easy,2.5', header).entry?.risk).toBe(3)
    expect(one('zzalpha,а,Travel,easy,0', header).warnings.join()).toMatch(/risk/)
  })
  it('warns when the example does not contain the word, ignoring case', () => {
    expect(one('zzalpha,а,Travel,,,The ZZALPHA works.').warnings).toEqual([])
    expect(one('zzalpha,а,Travel,,,Something else.').warnings).toEqual(['the example sentence does not contain the word'])
  })
  it('keeps commas inside double quotes', () => {
    const row = one('zzalpha,"а, б",Travel,,,"Use zzalpha, please."')
    expect(row.status).toBe('ready')
    expect(row.translation).toBe('а, б')
    expect(row.entry?.example).toBe('Use zzalpha, please.')
  })
  it('splits alternatives on semicolons and drops empty ones', () => {
    const row = analyseCsv('word,translation,topic,alternatives\nzzalpha,а,Travel,"zzalfa; ; zzalpha2 "', 'a.csv').rows[0]
    expect(row.entry?.alternatives).toEqual(['zzalfa', 'zzalpha2'])
  })
  it('turns part-of-speech short forms into full names', () => {
    const row = analyseCsv('word,translation,topic,part_of_speech\nzzalpha,а,Travel,adj', 'a.csv').rows[0]
    expect(row.entry?.partOfSpeech).toBe('adjective')
  })
  it('makes a stable id from topic, subtopic and word, and uses word_id when given', () => {
    const made = analyseCsv('word,translation,topic,subtopic\nZZ Alpha,а,Travel,At the Airport', 'a.csv').rows[0]
    const again = analyseCsv('word,translation,topic,subtopic\nZZ Alpha,а,Travel,At the Airport', 'a.csv').rows[0]
    expect(made.entry?.wordId).toBe(again.entry?.wordId)
    expect(made.entry?.wordId).not.toContain(' ')
    const given = analyseCsv('word_id,word,translation\nmy-own-id,zzalpha,а', 'a.csv').rows[0]
    expect(given.entry?.wordId).toBe('my-own-id')
  })
  it('reports the topics and subtopics that do not exist yet, once each', () => {
    const preview = analyseCsv(
      'word,translation,topic,subtopic\nzza,а,Zz Brand New Topic,Part one\nzzb,б,Zz Brand New Topic,Part one\nzzc,в,Zz Brand New Topic,Part two',
      'a.csv',
    )
    expect(preview.newTopics).toEqual(['Zz Brand New Topic'])
    expect(preview.newSubtopics).toEqual(['Zz Brand New Topic · Part one', 'Zz Brand New Topic · Part two'])
  })
  it('groups the ready words by library and says which libraries are new', () => {
    const preview = analyseCsv('word,translation,topic,library\nzza,а,Travel,Lib A\nzzb,б,Travel,Lib A\nzzc,в,Travel,Lib B', 'a.csv')
    expect(preview.libraries).toEqual([
      { name: 'Lib A', words: 2, isNew: true },
      { name: 'Lib B', words: 1, isNew: true },
    ])
  })
})

describe('analyseCsv: duplicates and conflicts', () => {
  beforeEach(() => window.localStorage.clear())

  it('marks a word that is already in the library as a duplicate, ignoring case and spaces', () => {
    const existing = getEveryWord().find((word) => word.word === word.word.trim() && !/[,"\n]/.test(word.word + word.translation))!
    const csv = `word,translation\n  ${existing.word.toUpperCase()} ,${existing.translation}`
    const row = analyseCsv(csv, 'a.csv').rows[0]
    expect(row.status).toBe('duplicate')
    expect(row.entry).toBeUndefined()
  })
  it('marks a second row with the same word and translation as a duplicate in the file, pointing at the first line', () => {
    const preview = analyseCsv('word,translation\nzzalpha,а\nZZAlpha,А\nzzalpha,другой', 'a.csv')
    expect(preview.rows.map((row) => row.status)).toEqual(['ready', 'duplicate-in-file', 'ready'])
    expect(preview.rows[1].issues).toEqual(['repeats row 2'])
    expect(preview.counts).toMatchObject({ ready: 2, 'duplicate-in-file': 1 })
  })
  it('keeps the same English word with another meaning as a separate entry', () => {
    const preview = analyseCsv('word,translation,topic\nzzbank,берег,Travel\nzzbank,банк,Travel', 'a.csv')
    expect(preview.counts.ready).toBe(2)
  })
  it('flags a word_id that belongs to a different word as a conflict', () => {
    const existing = getEveryWord()[0]
    const row = analyseCsv(`word_id,word,translation\n${existing.wordId},zzdifferent,другое`, 'a.csv').rows[0]
    expect(row.status).toBe('conflict')
    expect(row.issues[0]).toContain(existing.wordId)
  })
  it('treats the same word_id and the same word as a duplicate even with another translation', () => {
    const existing = getEveryWord()[0]
    const row = analyseCsv(`word_id,word,translation\n${existing.wordId},${existing.word},zzнеттакого`, 'a.csv').rows[0]
    expect(row.status).toBe('duplicate')
  })
  it('counts rows with warnings once each', () => {
    const preview = analyseCsv('word,translation\nzza,а\nzzb,б', 'a.csv')
    expect(preview.counts.warnings).toBe(2)
  })
  it('totalRows counts every data row, including invalid ones', () => {
    const preview = analyseCsv('word,translation\nzza,а\n,пусто\nzzc,', 'a.csv')
    expect(preview.totalRows).toBe(3)
    expect(preview.counts).toMatchObject({ ready: 1, invalid: 2 })
  })
})

describe('commitCsvImport and undoCsvImport', () => {
  beforeEach(() => window.localStorage.clear())
  const csv =
    'word,translation,topic,library\nzzalpha,а,Travel,Zz Lib\nzzbeta,б,Travel,Zz Lib\nzzgamma,в,Travel,Zz Other\n,пусто,Travel,Zz Lib'

  it('saves only the ready rows and reports what was added', () => {
    const batch = commitCsvImport(analyseCsv(csv, 'a.csv'))
    expect(batch.imported).toBe(3)
    expect(batch.libraries.sort()).toEqual(['Zz Lib', 'Zz Other'])
    expect(batch.createdLibraryIds).toHaveLength(2)
    const saved = getImportedLibraries()
    expect(saved.find((library) => library.name === 'Zz Lib')?.words.map((word) => word.word)).toEqual(['zzalpha', 'zzbeta'])
    expect(getEveryWord().some((word) => word.word === 'zzgamma')).toBe(true)
  })
  it('does nothing when no row is ready', () => {
    const batch = commitCsvImport(analyseCsv('word,translation\n,x', 'a.csv'))
    expect(batch).toEqual({ wordIds: [], createdLibraryIds: [], libraries: [], imported: 0 })
    expect(getImportedLibraries()).toEqual([])
  })
  it('ignores a failed preview', () => {
    expect(commitCsvImport(analyseCsv('nonsense', 'a.txt')).imported).toBe(0)
  })
  it('adds to an existing library instead of creating a second one', () => {
    commitCsvImport(analyseCsv('word,translation,topic,library\nzzalpha,а,Travel,Zz Lib', 'a.csv'))
    const second = commitCsvImport(analyseCsv('word,translation,topic,library\nzzbeta,б,Travel,Zz Lib', 'b.csv'))
    expect(second.createdLibraryIds).toEqual([])
    const libraries = getImportedLibraries().filter((library) => library.name === 'Zz Lib')
    expect(libraries).toHaveLength(1)
    expect(libraries[0].words).toHaveLength(2)
  })
  it('importing the same file twice finds everything as duplicates the second time', () => {
    commitCsvImport(analyseCsv(csv, 'a.csv'))
    const again = analyseCsv(csv, 'a.csv')
    expect(again.counts.ready).toBe(0)
    expect(again.counts.duplicate).toBe(3)
  })
  it('undo removes exactly the imported words and the libraries the import created', () => {
    commitCsvImport(analyseCsv('word,translation,topic,library\nzzold,старый,Travel,Zz Lib', 'a.csv'))
    const batch = commitCsvImport(
      analyseCsv('word,translation,topic,library\nzznew,новый,Travel,Zz Lib\nzzsolo,один,Travel,Zz Solo', 'b.csv'),
    )
    undoCsvImport(batch)
    const libraries = getImportedLibraries()
    expect(libraries.map((library) => library.name)).toEqual(['Zz Lib'])
    expect(libraries[0].words.map((word) => word.word)).toEqual(['zzold'])
  })
  it('undo leaves deletion marks, and importing again clears them', () => {
    const batch = commitCsvImport(analyseCsv('word,translation,topic,library\nzzalpha,а,Travel,Zz Lib', 'a.csv'))
    undoCsvImport(batch)
    expect(getRemovedKeys().has(`word:${batch.wordIds[0]}`)).toBe(true)
    commitCsvImport(analyseCsv('word,translation,topic,library\nzzalpha,а,Travel,Zz Lib', 'a.csv'))
    expect(getRemovedKeys().has(`word:${batch.wordIds[0]}`)).toBe(false)
  })
})
