import { defineConfig, devices } from '@playwright/test'

/**
 * Standalone config for visual logo review.
 * Reuses Daley's running dev server on :3005 — no webServer spawn.
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'logo-visual.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],

  use: {
    baseURL: 'http://localhost:3005',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
