import { describe, expect, it } from 'vitest'
import { parseCsvRows } from '../services/csv'
import { parseLibraryTexts, splitLibraryCsv, TEXT_COLUMNS } from './libraryCsvParts'

const header = 'word_id,word,definition,translation,extra_example,level,extra_example_source'
const sample = [
  header,
  'a-1,apple,a round fruit,яблоко,I ate an apple.,A2,Oxford',
  'a-2,bread,baked food,хлеб,She bought bread.,A2,Cambridge',
  'a-3,cheese,made from milk,сыр,We like cheese.,B1,Macmillan',
].join('\n')

describe('splitLibraryCsv', () => {
  it('moves the three text columns out of the core and into texts, in row order', () => {
    const { core, texts } = splitLibraryCsv(sample)
    expect(parseCsvRows(core)).toEqual([
      ['word_id', 'word', 'translation', 'level'],
      ['a-1', 'apple', 'яблоко', 'A2'],
      ['a-2', 'bread', 'хлеб', 'A2'],
      ['a-3', 'cheese', 'сыр', 'B1'],
    ])
    expect(parseLibraryTexts(texts)).toEqual([
      ['a round fruit', 'I ate an apple.', 'Oxford'],
      ['baked food', 'She bought bread.', 'Cambridge'],
      ['made from milk', 'We like cheese.', 'Macmillan'],
    ])
  })

  it('does not depend on where the text columns are in the header', () => {
    const shuffled = [
      'extra_example_source,extra_example,word,definition,word_id',
      'Oxford,I ate an apple.,apple,a round fruit,a-1',
      'Cambridge,She bought bread.,bread,baked food,a-2',
    ].join('\n')
    const { core, texts } = splitLibraryCsv(shuffled)
    expect(parseCsvRows(core)).toEqual([
      ['word', 'word_id'],
      ['apple', 'a-1'],
      ['bread', 'a-2'],
    ])
    expect(parseLibraryTexts(texts)).toEqual([
      ['a round fruit', 'I ate an apple.', 'Oxford'],
      ['baked food', 'She bought bread.', 'Cambridge'],
    ])
  })

  it('keeps commas, quotes and doubled quotes in both parts', () => {
    const csv = [
      'word_id,word,definition,translation,extra_example,extra_example_source',
      'q-1,"hello, world","a ""greeting"", said aloud","привет, мир","He said ""hi"", then left.","Book, ""vol. 2"""',
      'q-2,plain,simple,простой,It is plain.,Own',
    ].join('\n')
    const { core, texts } = splitLibraryCsv(csv)
    expect(parseCsvRows(core)).toEqual([
      ['word_id', 'word', 'translation'],
      ['q-1', 'hello, world', 'привет, мир'],
      ['q-2', 'plain', 'простой'],
    ])
    expect(parseLibraryTexts(texts)).toEqual([
      ['a "greeting", said aloud', 'He said "hi", then left.', 'Book, "vol. 2"'],
      ['simple', 'It is plain.', 'Own'],
    ])
  })

  it('keeps a line for a word whose three texts are all empty, so later rows stay aligned', () => {
    const csv = [
      'word_id,word,definition,extra_example,extra_example_source',
      'e-1,one,first,One is first.,Src',
      'e-2,two,,,',
      'e-3,three,third,Three is third.,Src3',
      'e-4,four,,,',
    ].join('\n')
    const { core, texts } = splitLibraryCsv(csv)
    expect(
      parseCsvRows(core)
        .slice(1)
        .map((row) => row[0]),
    ).toEqual(['e-1', 'e-2', 'e-3', 'e-4'])
    expect(texts.split('\n')).toHaveLength(4)
    expect(parseLibraryTexts(texts)).toEqual([
      ['first', 'One is first.', 'Src'],
      ['', '', ''],
      ['third', 'Three is third.', 'Src3'],
      ['', '', ''],
    ])
  })

  it('gives no texts for a CSV with only a header', () => {
    const { core, texts } = splitLibraryCsv('word_id,word,definition,extra_example,extra_example_source')
    expect(parseCsvRows(core)).toEqual([['word_id', 'word']])
    expect(texts).toBe('')
    expect(parseLibraryTexts(texts)).toEqual([])
    expect(parseLibraryTexts('')).toEqual([])
  })

  it('throws when a text column is missing', () => {
    for (const name of TEXT_COLUMNS) {
      const columns = ['word_id', 'word', ...TEXT_COLUMNS.filter((column) => column !== name)]
      const csv = `${columns.join(',')}\n${columns.map(() => 'x').join(',')}`
      expect(() => splitLibraryCsv(csv), name).toThrow(name)
    }
  })

  it('throws when a text has a tab in it', () => {
    const csv = ['word_id,word,definition,extra_example,extra_example_source', 'b-1,bad,"has\ta tab",Example.,Src'].join('\n')
    expect(() => splitLibraryCsv(csv)).toThrow(/tab/)
  })

  it('gives the same result for Windows line endings', () => {
    const windows = sample.replaceAll('\n', '\r\n')
    expect(splitLibraryCsv(windows)).toEqual(splitLibraryCsv(sample))
  })
})

describe('a row that would break the order', () => {
  it('a row with texts but no word is refused: it would vanish from the core and shift every later text', () => {
    const csv =
      'word_id,word,definition,extra_example,extra_example_source\na,apple,a fruit,I ate an apple.,written\n,,a lost text,,\nb,bread,food,We bake bread.,written'
    expect(() => splitLibraryCsv(csv)).toThrow(/Row 3/)
  })
  it('a word without any text is fine', () => {
    const csv = 'word_id,word,definition,extra_example,extra_example_source\na,apple,,,\nb,bread,food,,'
    expect(parseLibraryTexts(splitLibraryCsv(csv).texts)).toEqual([
      ['', '', ''],
      ['food', '', ''],
    ])
  })
})

describe('parseLibraryTexts', () => {
  it('reads one entry per line and keeps empty fields', () => {
    expect(parseLibraryTexts('a\tb\tc\n\t\t\nx\t\tz')).toEqual([
      ['a', 'b', 'c'],
      ['', '', ''],
      ['x', '', 'z'],
    ])
  })
})
