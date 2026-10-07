import { defineConfig, devices } from '@playwright/test'

// End-to-end tests in a real browser: `pnpm test:e2e` (builds the site, then serves dist/).
// Each test starts with empty storage, like a new visitor.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4180', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'pnpm preview --port 4180 --strictPort', url: 'http://localhost:4180', reuseExistingServer: !process.env.CI },
})
