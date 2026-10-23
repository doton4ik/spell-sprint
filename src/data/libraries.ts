import type { WordLibrary } from '../types/library'

// The built-in libraries come from a large CSV, so they are a separate chunk (builtInLibraryData.ts). main.tsx waits for
// loadBuiltInLibraries() before it shows the app; after that `builtInLibraries` is filled for every synchronous caller.
// (An ES module export is a live binding: importers see the new value once it is set.)
export let builtInLibraries: WordLibrary[] = []

let loading: Promise<void> | null = null
export function loadBuiltInLibraries() {
  loading ??= import('./builtInLibraryData').then(
    (module) => {
      builtInLibraries = module.builtInLibraries
    },
    (error) => {
      loading = null // let the next call try again
      throw error
    },
  )
  return loading
}
