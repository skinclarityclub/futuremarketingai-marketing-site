import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

// Simple in-memory rate limiter: IP -> { count, resetAt }
const rateLimit = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return true
  }

  return false
}

// Periodically clean stale entries to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) {
      rateLimit.delete(ip)
    }
  }
}, 60_000)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429, headers: corsHeaders }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400, headers: corsHeaders })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    return NextResponse.json(
      { error: 'Validation failed.', fields: fieldErrors },
      { status: 422, headers: corsHeaders }
    )
  }

  const { name, email, company, message } = result.data

  // Log the submission (replace with email service later)
  console.log('[Contact Form Submission]', {
    name,
    email,
    company,
    message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    ip,
    timestamp: new Date().toISOString(),
  })

  // TODO: Send email via Resend, SendGrid, etc.

  return NextResponse.json(
    { success: true, message: 'Thank you! We will get back to you shortly.' },
    { status: 200, headers: corsHeaders }
  )
}
