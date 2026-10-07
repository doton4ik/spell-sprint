import { defineConfig } from 'vitest/config'

// Unit tests for the app's core logic: `pnpm test`. happy-dom gives tests a localStorage.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
