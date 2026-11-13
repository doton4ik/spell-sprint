import { parseCsvRows } from '../services/csv.ts'

// The built-in word list (spell-sprint-built-in-library.csv) is one file for the people and scripts that edit it,
// but the app downloads it in two parts (the build cuts it: see libraryCsvParts in vite.config.ts):
//   core  - everything the first screen needs: the word, its translation, topic, level, the first example ...
//   texts - the long texts only practice and the word pages show: the definition and the second example.
// The dashboard is drawn as soon as the core is here; the texts follow (data/libraries.ts).
export const TEXT_COLUMNS = ['definition', 'extra_example', 'extra_example_source'] as const

const csvCell = (value: string) => (/[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value)

// core: the same CSV without the text columns. texts: one line per word, in the same order, the text columns
// separated by tabs (no word ids: the order is the link, and both parts always come from one build).
export function splitLibraryCsv(csv: string): { core: string; texts: string } {
  const [header = [], ...rows] = parseCsvRows(csv)
  const textAt = TEXT_COLUMNS.map((name) => header.indexOf(name))
  const missing = TEXT_COLUMNS.filter((_, index) => textAt[index] < 0)
  if (missing.length) throw new Error(`The word list has no column ${missing.join(', ')}`)
  const coreAt = header.map((_, index) => index).filter((index) => !textAt.includes(index))
  const core = [header, ...rows].map((row) => coreAt.map((index) => csvCell(row[index] ?? '')).join(',')).join('\n')
  const texts = rows
    .map((row) =>
      textAt
        .map((index) => {
          const value = row[index] ?? ''
          if (/[\t\n\r]/.test(value))
            throw new Error(`A tab or a line break in a text of "${row[0]}": the texts are stored one word per line`)
          return value
        })
        .join('\t'),
    )
    .join('\n')
  return { core, texts }
}

// One entry per word, in the order of the core rows: [definition, extra example, source of the extra example].
export function parseLibraryTexts(texts: string): string[][] {
  return texts ? texts.split('\n').map((line) => line.split('\t')) : []
}
