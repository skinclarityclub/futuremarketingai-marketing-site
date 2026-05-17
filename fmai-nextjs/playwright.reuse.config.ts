import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Reuse-config hits a hot dev server with Turbopack first-compile; the slow
  // path can blow the default 5s assertion timeout under parallel load. One
  // retry absorbs the cold-route flake without masking real regressions.
  retries: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
