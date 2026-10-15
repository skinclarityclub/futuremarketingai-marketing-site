import 'server-only'

// Same rule as the app and the DB.
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*-[a-z2-9]{12}$/

export type PageView = {
  firstName: string
  agencyName: string
  email: string
  bookingStart: string | null
}

export type ViewRecord = {
  method: string
  userAgent: string | null
  referrerHost: string | null
}

const TIMEOUT_MS = 4000

// Errors carry the status or error name only: never the slug or the secret.
async function call(path: string, body: unknown): Promise<Response> {
  const base = process.env.VIDEO_PAGES_APP_URL ?? 'https://app.future-marketing.ai'
  try {
    return await fetch(`${base}/api/internal/video-pages/${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-video-pages-secret': process.env.VIDEO_PAGES_SECRET ?? '',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (e) {
    throw new Error(`video-pages ${path}: request failed (${e instanceof Error ? e.name : 'unknown'})`)
  }
}

export async function getVideoPage(slug: string, record: ViewRecord | null): Promise<PageView | null> {
  const res = await call('view', { slug, record })
  if (res.status === 404) return null
  if (res.status !== 200) throw new Error(`video-pages view: status ${res.status}`)
  return ((await res.json()) as { page: PageView }).page
}

/** Resolves with the HTTP status (204, 409, 400, 503, ...); throws only on network error or time-out. */
export async function postEvent(body: Record<string, unknown>): Promise<number> {
  return (await call('event', body)).status
}

export async function postDropoff(body: { v: string; maxSec: number }): Promise<number> {
  return (await call('dropoff', body)).status
}
