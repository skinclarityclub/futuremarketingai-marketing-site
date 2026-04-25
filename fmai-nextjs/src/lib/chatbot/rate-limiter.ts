/**
 * Chatbot rate-limiter — Upstash Redis backed.
 *
 * WHY: the legacy in-memory Map approach fragmented across Vercel Fluid Compute
 * isolates. Audit 08 section 7 flagged this as a P0. We now share state via
 * Upstash so every isolate sees the same counters.
 *
 * Three sliding-window limits per request, each on its own Upstash counter
 * with the original semantic:
 *  - ip: 10 messages per minute per IP
 *  - global: 100 messages per hour, server-wide cap
 *  - session: 15 messages per hour per session (100 for the flagship persona)
 *
 * The exported function names + return shape are preserved so existing callers
 * (engine.ts, index.ts re-exports) keep working with one tweak: the API is
 * now async because Upstash is a network round-trip.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { RateLimitResult } from './types'

const SESSION_LIMIT = 15
const FLAGSHIP_SESSION_LIMIT = 100
const GLOBAL_LIMIT = 100
const IP_LIMIT = 10

const PERSONA_SESSION_LIMITS: Record<string, number> = {
  flagship: FLAGSHIP_SESSION_LIMIT,
}

const redis = Redis.fromEnv()

const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(IP_LIMIT, '1 m'),
  analytics: true,
  prefix: 'fmai:ratelimit:chatbot:ip',
})

const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(GLOBAL_LIMIT, '1 h'),
  analytics: true,
  prefix: 'fmai:ratelimit:chatbot:global',
})

const sessionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(SESSION_LIMIT, '1 h'),
  analytics: true,
  prefix: 'fmai:ratelimit:chatbot:session',
})

const flagshipSessionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(FLAGSHIP_SESSION_LIMIT, '1 h'),
  analytics: true,
  prefix: 'fmai:ratelimit:chatbot:session:flagship',
})

function toResult(
  upstash: { success: boolean; remaining: number; reset: number },
  limitType: RateLimitResult['limitType'],
): RateLimitResult {
  return {
    allowed: upstash.success,
    remaining: upstash.remaining,
    resetAt: upstash.reset,
    limitType,
  }
}

export async function checkIpLimit(ip: string): Promise<RateLimitResult> {
  const r = await ipLimiter.limit(`ip:${ip}`)
  return toResult(r, 'ip')
}

export async function checkGlobalLimit(): Promise<RateLimitResult> {
  const r = await globalLimiter.limit('global')
  return toResult(r, 'global')
}

export async function checkSessionLimit(
  sessionId: string,
  personaId?: string,
): Promise<RateLimitResult> {
  const usesFlagship = (personaId ?? '') in PERSONA_SESSION_LIMITS
  const limiter = usesFlagship ? flagshipSessionLimiter : sessionLimiter
  const r = await limiter.limit(`session:${sessionId}`)
  return toResult(r, 'session')
}

/**
 * Run all three limits in priority order (ip -> global -> session). Returns
 * the first denial, or an aggregated success result with min(remaining).
 *
 * NOTE: this is now async (was sync in the Map-based implementation).
 * engine.ts must `await` the call.
 */
export async function checkAllRateLimits(
  sessionId: string,
  ip: string,
  personaId?: string,
): Promise<RateLimitResult> {
  const ipResult = await checkIpLimit(ip)
  if (!ipResult.allowed) return ipResult

  const globalResult = await checkGlobalLimit()
  if (!globalResult.allowed) return globalResult

  const sessionResult = await checkSessionLimit(sessionId, personaId)
  if (!sessionResult.allowed) return sessionResult

  return {
    allowed: true,
    remaining: Math.min(ipResult.remaining, globalResult.remaining, sessionResult.remaining),
    resetAt: Math.min(ipResult.resetAt, globalResult.resetAt, sessionResult.resetAt),
  }
}
