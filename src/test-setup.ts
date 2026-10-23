import { loadBuiltInLibraries } from './data/libraries'

// In the app main.tsx loads the built-in words before anything renders; tests do the same once per file.
await loadBuiltInLibraries()
