import { loadBuiltInLibraries, loadWordTexts } from './libraries'

// Imported first by main.tsx: the download of the word list starts while the rest of the app is still being evaluated.
export const builtInLoading = loadBuiltInLibraries()

// The definitions and second examples follow as soon as the words are here: one after the other, not side by side,
// so on a slow connection the first screen does not share the line with them. A failure is not fatal: the pages that
// need the texts ask again when they open (App.tsx).
void builtInLoading.then(() => loadWordTexts()).catch(() => undefined)
