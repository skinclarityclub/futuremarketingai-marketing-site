import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { clientIp, voorAllowed } from '@/lib/voor-ratelimit'
import { getVideoPage, SLUG_RE } from '@/lib/video-pages-app'

export const runtime = 'nodejs'

const NO_STORE = { 'Cache-Control': 'private, no-store' }

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  // Any throw must still carry no-store; no logging, so the slug never lands in a log.
  try {
    return await render(request, ctx)
  } catch {
    return new Response(null, { status: 500, headers: NO_STORE })
  }
}

async function render(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) return new Response(null, { status: 404, headers: NO_STORE })

  // Outside the middleware matcher, so limit here before calling the app or rendering a PNG.
  if (!(await voorAllowed('page', clientIp(request.headers)))) {
    return new Response(null, { status: 429, headers: { ...NO_STORE, 'Retry-After': '600' } })
  }

  // record null: a preview fetch must not count as an open.
  const page = await getVideoPage(slug, null)
  if (!page) return new Response(null, { status: 404, headers: NO_STORE })

  // shortcut: placeholder until plan A delivers; replace in Task 11 step 1.
  const still = await readFile(path.join(process.cwd(), 'public/voor/daley-still.png'))
  const stillSrc = `data:image/png;base64,${still.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0d14',
          color: '#e8ecf4',
          padding: 72,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{page.agencyName}</div>
          <div style={{ fontSize: 32, marginTop: 32, color: '#9aa4b8' }}>Clyde, de AI-collega van je bureau</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stillSrc} width={320} height={180} alt="" style={{ borderRadius: 16 }} />
      </div>
    ),
    { width: 1200, height: 630, headers: NO_STORE },
  )
}
