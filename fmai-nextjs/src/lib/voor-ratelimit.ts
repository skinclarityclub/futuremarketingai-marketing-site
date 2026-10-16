import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type VoorKind = 'page' | 'event' | 'withdraw' | 'afhaak'

// Same IP rule as src/app/api/contact/route.ts.
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}

const WINDOWS: Record<VoorKind, number> = {
  page: 60,
  event: 240, // a `watch` event goes out at most every 15 s; 240 also lets a second tab through
  withdraw: 30, // an office behind one IP stays well under this
  afhaak: 10,
}

// Lazy, unlike src/lib/ratelimit.ts: that one calls Redis.fromEnv() at import
// and would crash the middleware when the Upstash env is missing.
let limiters: Record<VoorKind, Ratelimit> | null = null

function getLimiters(): Record<VoorKind, Ratelimit> {
  if (!limiters) {
    const redis = Redis.fromEnv()
    const make = (kind: VoorKind) =>
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(WINDOWS[kind], '10 m'),
        prefix: `fmai:ratelimit:voor-${kind}`,
      })
    limiters = {
      page: make('page'),
      event: make('event'),
      withdraw: make('withdraw'),
      afhaak: make('afhaak'),
    }
  }
  return limiters
}

/** Fails open: missing Upstash env or an Upstash error lets the request through. */
export async function voorAllowed(kind: VoorKind, ip: string): Promise<boolean> {
  try {
    // Web Crypto, not node:crypto: the middleware runs on the edge runtime.
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + kind))
    const key = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
    const { success } = await getLimiters()[kind].limit(key)
    return success
  } catch {
    return true
  }
}
