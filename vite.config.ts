import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { splitLibraryCsv } from './src/data/libraryCsvParts.ts'

// The word list is one CSV file, but the app downloads it in two parts: `import core from '….csv?core'` (what the
// first screen needs) and `import texts from '….csv?texts'` (definitions and second examples, fetched right after).
// See src/data/libraryCsvParts.ts. Also used by vitest.config.ts, so the tests read the same two parts.
export function libraryCsvParts(): Plugin {
  return {
    name: 'library-csv-parts',
    enforce: 'pre',
    load(id) {
      const match = /^(.+\.csv)\?(core|texts)$/.exec(id)
      if (!match) return null
      this.addWatchFile(match[1])
      const part = splitLibraryCsv(readFileSync(match[1], 'utf8'))[match[2] as 'core' | 'texts']
      return `export default ${JSON.stringify(part)}`
    },
  }
}

// The app version shown in error reports: the Netlify commit, or "dev" locally.
export default defineConfig({
  plugins: [libraryCsvParts(), react()],
  define: { __APP_VERSION__: JSON.stringify(process.env.COMMIT_REF?.slice(0, 7) ?? 'dev') },
})
