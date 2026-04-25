/**
 * Shared rate-limit factory for API routes.
 *
 * WHY: the legacy in-memory Map approach does not work on Vercel Fluid Compute
 * because concurrent isolates each hold their own Map. Upstash Redis lives off
 * process so every isolate shares state and counters survive cold starts.
 *
 * Policy: sliding window, 5 requests per 10 minutes per identifier (IP).
 * The chatbot uses a more generous window (20 messages per minute) — see
 * src/lib/chatbot/rate-limiter.ts.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRateLimiter(prefix: string): Ratelimit {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    analytics: true,
    prefix: `fmai:ratelimit:${prefix}`,
  })
}

export const applyRateLimit: Ratelimit = createRateLimiter('apply')
export const contactRateLimit: Ratelimit = createRateLimiter('contact')
