import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const REVENUE_ENUM = [
  'under_300k',
  '300k_1m',
  '1m_3m',
  '3m_10m',
  'over_10m',
] as const

const CLIENT_COUNT_ENUM = ['solo', '1_5', '5_15', '15_50', 'over_50'] as const

const TIER_ENUM = ['partner', 'growth', 'professional', 'enterprise', 'founding', 'unsure'] as const

const applicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  agency: z.string().min(2).max(150),
  role: z.string().min(2).max(100),
  revenue: z.enum(REVENUE_ENUM),
  clientCount: z.enum(CLIENT_COUNT_ENUM),
  tier: z.enum(TIER_ENUM),
  problem: z.string().min(20).max(5000),
  // honeypot — bots fill this, humans do not
  website: z.string().max(0).optional().default(''),
})

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(ip)
  }
}, 60_000)

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = applicationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  // Honeypot filled = silently accept (return success to avoid tipping off bots)
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  // TODO: wire to Resend/SMTP for real email delivery. For now, log + store.
  // When RESEND_API_KEY is set, we can add a real send step here.
  console.log('[Application Submission]', {
    ...parsed.data,
    problem: parsed.data.problem.substring(0, 200) + (parsed.data.problem.length > 200 ? '...' : ''),
    ip,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
