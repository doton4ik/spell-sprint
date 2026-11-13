import type { LibraryWord, WordLibrary } from '../types/library'
import { parseLibraryTexts } from './libraryCsvParts'

// The built-in libraries come from a large CSV, so they are a separate chunk (builtInLibraryData.ts). main.tsx waits for
// loadBuiltInLibraries() before it shows the app; after that `builtInLibraries` is filled for every synchronous caller.
// (An ES module export is a live binding: importers see the new value once it is set.)
export let builtInLibraries: WordLibrary[] = []
let wordRows: LibraryWord[] = []

let loading: Promise<void> | null = null
export function loadBuiltInLibraries() {
  loading ??= import('./builtInLibraryData').then(
    (module) => {
      builtInLibraries = module.builtInLibraries
      wordRows = module.builtInWordRows
    },
    (error) => {
      loading = null // let the next call try again
      throw error
    },
  )
  return loading
}

// ---- The long texts of the words: a second, later download ----------------------------------------
// The definition and the second example of every word are about half of the word list, and the first screen shows
// neither. They are fetched right after the words themselves (startBuiltInLoad.ts) and written into the same word
// objects. Until then a word simply has no definition and no second example. The pages that show or use them
// (Practice, My Mistakes, Libraries, Proofreading) wait for loadWordTexts() before they open (App.tsx).

// Goes up when the texts have arrived: whoever keeps copies of the words (libraryStorage.ts) builds them again.
export let wordTextsRevision = 0
export const WORD_TEXTS_EVENT = 'spell-sprint:word-texts-ready'

let loadingTexts: Promise<void> | null = null
export function loadWordTexts() {
  loadingTexts ??= loadBuiltInLibraries()
    .then(() => import('./spell-sprint-built-in-library.csv?texts'))
    .then(
      (module) => {
        const texts = parseLibraryTexts(module.default)
        // both parts come from one build, so the numbers match; if they ever do not, wrong texts are worse than none
        if (texts.length !== wordRows.length) throw new Error(`Word texts: ${texts.length} lines for ${wordRows.length} words`)
        texts.forEach(([definition, extraExample, extraExampleSource], index) => {
          const word = wordRows[index]
          word.definition = definition || undefined
          word.extraExample = extraExample || undefined
          word.extraExampleSource = extraExampleSource || undefined
        })
        wordTextsRevision += 1
        if (typeof window !== 'undefined') window.dispatchEvent(new Event(WORD_TEXTS_EVENT))
      },
      (error) => {
        loadingTexts = null // let the next call try again
        throw error
      },
    )
  return loadingTexts
}
