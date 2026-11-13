import { defineConfig } from 'vitest/config'
import { libraryCsvParts } from './vite.config.ts'

// Unit tests for the app's core logic: `pnpm test`. happy-dom gives tests a localStorage.
// libraryCsvParts: the word list is imported in two parts, as in the app (see vite.config.ts).
export default defineConfig({
  plugins: [libraryCsvParts()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
