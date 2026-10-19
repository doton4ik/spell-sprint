import { defineConfig, devices } from '@playwright/test'

// End-to-end tests in a real browser: `pnpm test:e2e` (builds the site, then serves dist/).
// Each test starts with empty storage, like a new visitor.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  // On Windows a single connection to the local server now and then fails with ERR_NETWORK_ACCESS_DENIED (see e2e/fixtures.ts,
  // which asks again), and the old "localhost" went to IPv6 only (vite preview listens on ::1), hence the explicit 127.0.0.1 below.
  // A test that really fails fails every time, so a retry hides only what is left of that noise.
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://127.0.0.1:4180', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 4180 --strictPort',
    url: 'http://127.0.0.1:4180',
    reuseExistingServer: !process.env.CI,
  },
})
