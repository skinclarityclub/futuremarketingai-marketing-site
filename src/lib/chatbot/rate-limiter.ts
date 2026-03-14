import type { RateLimitResult } from './types'

const SESSION_LIMIT = 15
const GLOBAL_LIMIT = 100
const IP_LIMIT = 10

/**
 * Persona-specific session limits. Personas not listed here default to SESSION_LIMIT.
 * Flagship persona gets 100 messages/hour (effectively unlimited for demo purposes).
 */
const PERSONA_SESSION_LIMITS: Record<string, number> = {
  flagship: 100,
}

const SESSION_WINDOW_MS = 3_600_000 // 1 hour
const GLOBAL_WINDOW_MS = 3_600_000 // 1 hour
const IP_WINDOW_MS = 60_000 // 1 minute

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now >= entry.resetAt) {
    // Window expired or first request — start new window
    const resetAt = now + windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

export function checkSessionLimit(sessionId: string, personaId?: string): RateLimitResult {
  const limit = PERSONA_SESSION_LIMITS[personaId || ''] || SESSION_LIMIT
  const result = checkRateLimit(`session:${sessionId}`, limit, SESSION_WINDOW_MS)
  return { ...result, limitType: 'session' }
}

export function checkGlobalLimit(): RateLimitResult {
  const result = checkRateLimit('global', GLOBAL_LIMIT, GLOBAL_WINDOW_MS)
  return { ...result, limitType: 'global' }
}

export function checkIpLimit(ip: string): RateLimitResult {
  const result = checkRateLimit(`ip:${ip}`, IP_LIMIT, IP_WINDOW_MS)
  return { ...result, limitType: 'ip' }
}

export function checkAllRateLimits(
  sessionId: string,
  ip: string,
  personaId?: string
): RateLimitResult {
  // Check IP limit first (most granular)
  const ipResult = checkIpLimit(ip)
  if (!ipResult.allowed) {
    return ipResult
  }

  // Then global
  const globalResult = checkGlobalLimit()
  if (!globalResult.allowed) {
    return globalResult
  }

  // Then session (persona-aware)
  const sessionResult = checkSessionLimit(sessionId, personaId)
  if (!sessionResult.allowed) {
    return sessionResult
  }

  // All passed — return success with minimum remaining
  const minRemaining = Math.min(ipResult.remaining, globalResult.remaining, sessionResult.remaining)
  return {
    allowed: true,
    remaining: minRemaining,
    resetAt: Math.min(ipResult.resetAt, globalResult.resetAt, sessionResult.resetAt),
  }
}

// Cleanup expired entries every 60 seconds (SSR-safe)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    rateLimitStore.forEach((entry, key) => {
      if (now >= entry.resetAt) {
        rateLimitStore.delete(key)
      }
    })
  }, 60_000)
}
