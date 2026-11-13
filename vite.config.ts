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

// Folders that are not part of the site: the dev server does not watch them. Without this it follows every file under
// the project (.asr alone is the speech-recognition tools, thousands of files), which makes a cold `pnpm dev` slow.
const NOT_THE_SITE = ['.asr', '.arena', 'arena-skill', 'android', 'ios', 'research', 'database', 'sources', 'docs', 'e2e']

// The app version shown in error reports: the Netlify commit, or "dev" locally.
export default defineConfig({
  plugins: [libraryCsvParts(), react()],
  define: { __APP_VERSION__: JSON.stringify(process.env.COMMIT_REF?.slice(0, 7) ?? 'dev') },
  // By default every .html under the project is an entry for the dependency scan; android/ and ios/ hold copies of
  // the built site, so their index.html was scanned too. The app has one entry.
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: NOT_THE_SITE.map((folder) => `**/${folder}/**`) } },
})
