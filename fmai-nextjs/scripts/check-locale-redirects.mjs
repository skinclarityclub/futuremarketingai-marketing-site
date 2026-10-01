// Runs the real middleware against a NextRequest, no server and no browser, so
// the redirect status is checked without sending a GA4 hit anywhere.
// Usage: node scripts/check-locale-redirects.mjs
import { createJiti } from 'jiti'
import { NextRequest } from 'next/server.js'

const jiti = createJiti(import.meta.url)
const { default: middleware } = await jiti.import('../src/middleware.ts')

const cases = [
  ['/', 307, '/nl'],
  ['/kennisbank/meetbare-ai-marketing-resultaten', 308, '/nl/kennisbank/meetbare-ai-marketing-resultaten'],
  ['/skills/email-management', 308, '/nl/skills/email-management'],
  ['/nl/skills/clyde', 200, null],
]
let failed = 0
for (const [path, status, location] of cases) {
  const res = middleware(new NextRequest(`https://future-marketing.ai${path}`))
  const loc = res.headers.get('location')
  const got = loc ? new URL(loc).pathname : null
  const ok = res.status === status && got === location
  if (!ok) failed++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${path} -> ${res.status} ${got ?? ''}`)
}
process.exit(failed ? 1 : 0)
