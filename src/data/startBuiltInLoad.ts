import { loadBuiltInLibraries } from './libraries'

// Imported first by main.tsx: the download of the word list starts while the rest of the app is still being evaluated.
export const builtInLoading = loadBuiltInLibraries()
