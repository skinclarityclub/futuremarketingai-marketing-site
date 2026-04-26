import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { applyRateLimit } from '@/lib/ratelimit'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  adminApplyTemplate,
  applicantConfirmationTemplate,
  type ApplyPayload,
} from '@/lib/email/apply-templates'
import { sendCriticalAlert, sendLeadAlert } from '@/lib/telegram-alert'

const REVENUE_ENUM = ['under_300k', '300k_1m', '1m_3m', '3m_10m', 'over_10m'] as const
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
  // Honeypot: bots fill, humans do not.
  website: z.string().max(0).optional().default(''),
  // Optional client-attached locale, fallback nl.
  locale: z.enum(['nl', 'en', 'es']).optional().default('nl'),
})

// Resend's constructor throws when the API key is undefined, which breaks
// `next build` page-data collection. Pass a placeholder when missing; the
// actual send call will surface a real error in the route handler.
const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? ''
  return crypto.createHash('sha256').update(ip + salt).digest('hex')
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const rl = await applyRateLimit.limit(ip)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.reset),
        },
      },
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

  // Honeypot silently accepted: respond 200 so bots cannot tell they were caught.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const payload: ApplyPayload = {
    name: parsed.data.name,
    email: parsed.data.email,
    agency: parsed.data.agency,
    role: parsed.data.role,
    revenue: parsed.data.revenue,
    clientCount: parsed.data.clientCount,
    tier: parsed.data.tier,
    problem: parsed.data.problem,
    locale: parsed.data.locale,
  }

  // 1. Persist in Supabase. Do not fail user submission on DB error.
  const { error: dbError } = await supabaseAdmin.from('applications').insert({
    name: payload.name,
    email: payload.email,
    agency: payload.agency,
    role: payload.role,
    revenue: payload.revenue,
    client_count: payload.clientCount,
    tier: payload.tier,
    problem: payload.problem,
    locale: payload.locale,
    ip_hash: hashIp(ip),
    user_agent: request.headers.get('user-agent') ?? null,
  })
  if (dbError) {
    console.error('[apply][supabase]', dbError)
  }

  // 2. Send admin + applicant confirmation in parallel.
  const fromAddr = process.env.APPLY_EMAIL_FROM ?? 'apply@future-marketing.ai'
  const toAddr = process.env.APPLY_EMAIL_TO ?? 'info@future-marketing.ai'

  const [adminResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: `FutureMarketingAI <${fromAddr}>`,
      to: [toAddr],
      replyTo: payload.email,
      subject: `[Apply] ${payload.agency} (${payload.tier})`,
      html: adminApplyTemplate(payload),
    }),
    resend.emails.send({
      from: `Daley van FutureMarketingAI <${fromAddr}>`,
      to: [payload.email],
      subject:
        payload.locale === 'en'
          ? 'Your application has been received'
          : payload.locale === 'es'
            ? 'Hemos recibido tu solicitud'
            : 'Je aanvraag is ontvangen',
      html: applicantConfirmationTemplate(payload),
    }),
    sendLeadAlert(`Nieuwe apply: ${payload.agency} (${payload.tier})`, {
      name: payload.name,
      email: payload.email,
      agency: payload.agency,
      role: payload.role,
      tier: payload.tier,
      revenue: payload.revenue,
      clients: payload.clientCount,
      locale: payload.locale,
      problem: payload.problem.length > 300 ? payload.problem.slice(0, 300) + '…' : payload.problem,
    }),
  ])

  if (adminResult.error) {
    const ctx = { route: '/api/apply', to: toAddr, from: fromAddr, error: adminResult.error }
    console.error('[CRITICAL][apply][resend:admin]', ctx)
    await sendCriticalAlert('Apply admin mail failed', ctx)
  }
  if (confirmationResult.error) {
    const ctx = { route: '/api/apply', to: payload.email, from: fromAddr, error: confirmationResult.error }
    console.error('[CRITICAL][apply][resend:confirm]', ctx)
    await sendCriticalAlert('Apply confirmation mail failed', ctx)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
