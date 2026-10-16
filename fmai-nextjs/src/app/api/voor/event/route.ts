import { z } from 'zod'
import { postEvent, SLUG_RE } from '@/lib/video-pages-app'
import { clientIp, voorAllowed } from '@/lib/voor-ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 2048
const respond = (status: number) => new Response(null, { status, headers: { 'cache-control': 'no-store' } })

// Mirrors the app's EventBody. `v` is only length-checked here: the app owns the list of known versions.
const slug = z.string().regex(SLUG_RE)
const common = {
  slug,
  visitor: z.string().uuid(),
  v: z.string().min(1).max(16),
  seq: z.number().int().min(1).max(Number.MAX_SAFE_INTEGER),
}
const EventBody = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('consent'), ...common, textVersion: z.literal('v1') }).strict(),
  z.object({ kind: z.literal('consent_withdrawn'), ...common }).strict(),
  z
    .object({ kind: z.literal('watch'), ...common, from: z.number().min(0), to: z.number().max(3600) })
    .strict()
    .refine((b) => b.to > b.from && b.to - b.from <= 600),
  z.object({ kind: z.literal('cta_click'), ...common }).strict(),
])

// Never logs the body or the IP.
export async function POST(req: Request): Promise<Response> {
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_BYTES) return respond(413)
  const text = await req.text()
  if (new TextEncoder().encode(text).length > MAX_BYTES) return respond(413)

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return respond(400)
  }
  const parsed = EventBody.safeParse(json)
  if (!parsed.success) return respond(400)

  // Own bucket for a withdrawal: watch traffic can never use up the room for it.
  const bucket = parsed.data.kind === 'consent_withdrawn' ? 'withdraw' : 'event'
  if (!(await voorAllowed(bucket, clientIp(req.headers)))) return respond(429)

  try {
    const status = await postEvent(parsed.data)
    // 409 (refused or stale) and 400 pass through; every other answer means "not recorded".
    return respond(status === 204 || status === 400 || status === 409 ? status : 503)
  } catch {
    return respond(503)
  }
}
