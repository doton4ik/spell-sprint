import { defineConfig, devices } from '@playwright/test'

// End-to-end tests in a real browser: `pnpm test:e2e` (builds the site, then serves dist/).
// Each test starts with empty storage, like a new visitor.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  // The local preview server now and then refuses a connection when several tests open pages at once (ERR_CONNECTION_REFUSED,
  // ERR_NETWORK_ACCESS_DENIED on goto); a test that really fails fails every time, so a retry only hides that noise.
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4180', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'pnpm preview --port 4180 --strictPort', url: 'http://localhost:4180', reuseExistingServer: !process.env.CI },
})
