import { loadBuiltInLibraries, loadWordTexts } from './data/libraries'

// In the app main.tsx loads the built-in words before anything renders; tests do the same once per file.
// The definitions and second examples are a later download in the app; tests wait for them too, so every word is whole.
await loadBuiltInLibraries()
await loadWordTexts()
