import { defineConfig } from '@playwright/test'

// Own config: the shared playwright.config.ts targets port 3000 and three engines. Here one real Chrome
// (Playwright's Chromium cannot play H.264/AAC), a stub of the app, and a production server that talks to it.
// reuseExistingServer is false so a busy port fails hard instead of testing against some other server.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'voor.spec.ts',
  timeout: 90_000,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3998', channel: 'chrome' },
  projects: [{ name: 'voor-chrome' }],
  webServer: [
    {
      command: 'node tests/e2e/stubs/video-pages-app.mjs',
      url: 'http://localhost:3999/__log',
      reuseExistingServer: false,
    },
    {
      // A production server, not `next dev`: dev replaces every page's Cache-Control with `no-cache, must-revalidate`
      // (next/dist/server/base-server.js, `if (this.dev)`), so the no-store header of next.config could never be seen.
      command: 'npx next build && npx next start --port 3998',
      url: 'http://localhost:3998/voor/studio-lumen-readyreadyyy',
      reuseExistingServer: false,
      timeout: 300_000,
      env: {
        VIDEO_PAGES_APP_URL: 'http://localhost:3999',
        VIDEO_PAGES_SECRET: 'test-secret',
        NEXT_DIST_DIR: '.next-voor-e2e',
        // The copied .env.local holds real Upstash keys, so override them: the e2e must never write into that Redis.
        // Not '' (ruling R18): with no URL the Upstash client retries its failing fetch with backoff for ~4.3 s per
        // call (measured), and every event would answer 4 s late. The stub answers 404 at once and the limiter fails open.
        UPSTASH_REDIS_REST_URL: 'http://localhost:3999',
        UPSTASH_REDIS_REST_TOKEN: 'e2e-not-a-real-token',
      },
    },
  ],
})
