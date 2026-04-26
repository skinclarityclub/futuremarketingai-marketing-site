import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

// Resend uses Svix for webhook signing.
// Headers: svix-id, svix-timestamp, svix-signature ("v1,<base64>" — multiple versions space-separated)
// Signed payload: `${id}.${timestamp}.${rawBody}`
// Secret format: "whsec_<base64>"
function verifySignature(
  secret: string,
  id: string,
  timestamp: string,
  body: string,
  signatureHeader: string,
): boolean {
  const secretBase64 = secret.startsWith('whsec_') ? secret.slice(6) : secret
  let secretBytes: Buffer
  try {
    secretBytes = Buffer.from(secretBase64, 'base64')
  } catch {
    return false
  }
  const expected = crypto
    .createHmac('sha256', secretBytes)
    .update(`${id}.${timestamp}.${body}`)
    .digest('base64')
  const expectedBuf = Buffer.from(expected, 'base64')

  for (const candidate of signatureHeader.split(' ')) {
    const stripped = candidate.startsWith('v1,') ? candidate.slice(3) : candidate
    let candidateBuf: Buffer
    try {
      candidateBuf = Buffer.from(stripped, 'base64')
    } catch {
      continue
    }
    if (
      candidateBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(candidateBuf, expectedBuf)
    ) {
      return true
    }
  }
  return false
}

const CRITICAL_EVENTS = new Set([
  'email.bounced',
  'email.complained',
  'email.delivery_delayed',
  'email.failed',
])

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.error('[CRITICAL][resend:webhook] RESEND_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const id = request.headers.get('svix-id')
  const timestamp = request.headers.get('svix-timestamp')
  const signatureHeader = request.headers.get('svix-signature')

  if (!id || !timestamp || !signatureHeader) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Reject events older than 5 minutes (replay protection)
  const tsSeconds = Number(timestamp)
  if (!Number.isFinite(tsSeconds) || Math.abs(Date.now() / 1000 - tsSeconds) > 300) {
    return NextResponse.json({ error: 'Stale or invalid timestamp' }, { status: 400 })
  }

  const rawBody = await request.text()

  if (!verifySignature(secret, id, timestamp, rawBody, signatureHeader)) {
    console.error('[CRITICAL][resend:webhook] invalid signature', { svix_id: id })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { type?: string; created_at?: string; data?: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = event.type ?? 'unknown'

  if (CRITICAL_EVENTS.has(type)) {
    const data = event.data ?? {}
    console.error(`[CRITICAL][resend:webhook][${type}]`, {
      email_id: data.email_id,
      to: data.to,
      from: data.from,
      subject: data.subject,
      bounce: data.bounce,
      reason: data.reason,
      created_at: event.created_at,
    })
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
