import { z } from 'zod'
import { postDropoff } from '@/lib/video-pages-app'
import { clientIp, voorAllowed } from '@/lib/voor-ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 2048
const respond = (status: number) => new Response(null, { status, headers: { 'cache-control': 'no-store' } })

const DropoffBody = z
  .object({ v: z.string().min(1).max(16), maxSec: z.number().int().min(0).max(3600) })
  .strict()

// Anonymous: no slug, no visitor, no Referer read. A beacon cannot act on the app's answer, so the
// browser always gets 204 after a valid body; a non-204 from the app is logged as a status only.
export async function POST(req: Request): Promise<Response> {
  if (!(await voorAllowed('afhaak', clientIp(req.headers)))) return respond(429)
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BYTES) return respond(413)
  const text = await req.text()
  if (new TextEncoder().encode(text).length > MAX_BYTES) return respond(413)

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return respond(400)
  }
  const parsed = DropoffBody.safeParse(json)
  if (!parsed.success) return respond(400)

  try {
    const status = await postDropoff(parsed.data)
    if (status !== 204) console.error(`voor afhaak: app status ${status}`)
  } catch (e) {
    console.error(`voor afhaak: ${e instanceof Error ? e.message : 'failed'}`)
  }
  return respond(204)
}
