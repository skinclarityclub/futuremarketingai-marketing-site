import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration — Next.js site
 *
 * Compares feature parity with the current Vite site.
 * Next.js uses next-intl with localePrefix: 'always', so all routes are prefixed (e.g. /en/).
 */
export default defineConfig({
  testDir: './tests/e2e',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? [['html'], ['github']] : [['html'], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://localhost:3000/en',
    reuseExistingServer: true,
    timeout: 180 * 1000,
  },
})
