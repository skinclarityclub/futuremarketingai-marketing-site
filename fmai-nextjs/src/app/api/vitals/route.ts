import { NextRequest, NextResponse } from 'next/server'

/**
 * /api/vitals — Web Vitals collection endpoint (Phase 17-D D3).
 *
 * Receives a POST with a Web Vitals metric envelope and logs it. Lives
 * in parallel with @vercel/speed-insights (which already captures p75
 * field data automatically) so we have an internal endpoint for:
 *  - Local development debugging beyond the console reporter.
 *  - Future custom collectors (n8n, Supabase, Grafana) that can ingest
 *    a stable JSON shape without depending on Vercel-managed UI.
 *  - Bypass for visitors whose ad-blockers reject /va.vercel-scripts.com.
 *
 * Storage is intentionally a console log for now. Vercel KV was retired,
 * and Supabase writes would 50x our function-invocation cost. When the
 * Marketplace database story stabilises (or n8n picks this up as a webhook
 * target) the body parsing here will already be in the right shape.
 *
 * Body shape:
 *   { name, value, id, rating?, route?, locale?, viewport? }
 */

interface VitalEnvelope {
  name: string
  value: number
  id: string
  rating?: 'good' | 'needs-improvement' | 'poor'
  route?: string
  locale?: string
  viewport?: { width: number; height: number }
}

function isVitalEnvelope(input: unknown): input is VitalEnvelope {
  if (typeof input !== 'object' || input === null) return false
  const candidate = input as Record<string, unknown>
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.value === 'number' &&
    typeof candidate.id === 'string'
  )
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!isVitalEnvelope(body)) {
    return NextResponse.json(
      { error: 'Expected { name: string, value: number, id: string, ... }' },
      { status: 400 },
    )
  }

  // Log in a stable shape; future collectors can grep this prefix.
  console.log('[vitals]', JSON.stringify(body))

  return NextResponse.json({ success: true }, { status: 200 })
}
