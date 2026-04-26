import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { contactRateLimit } from '@/lib/ratelimit'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  adminContactTemplate,
  contactConfirmationTemplate,
  type ContactPayload,
} from '@/lib/email/contact-templates'
import { sendCriticalAlert } from '@/lib/telegram-alert'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
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

  const rl = await contactRateLimit.limit(ip)
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

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const payload: ContactPayload = {
    name: result.data.name,
    email: result.data.email,
    company: result.data.company,
    message: result.data.message,
    locale: result.data.locale,
  }

  // 1. Persist in Supabase. Do not fail user submission on DB error.
  const { error: dbError } = await supabaseAdmin.from('contact_submissions').insert({
    name: payload.name,
    email: payload.email,
    company: payload.company || null,
    message: payload.message,
    locale: payload.locale,
    ip_hash: hashIp(ip),
    user_agent: request.headers.get('user-agent') ?? null,
  })
  if (dbError) console.error('[contact][supabase]', dbError)

  // 2. Send admin + submitter confirmation in parallel.
  const fromAddr = process.env.CONTACT_EMAIL_FROM ?? 'contact@future-marketing.ai'
  const toAddr = process.env.CONTACT_EMAIL_TO ?? 'info@future-marketing.ai'

  const [adminResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: `FutureMarketingAI <${fromAddr}>`,
      to: [toAddr],
      replyTo: payload.email,
      subject: `[Contact] ${payload.name}${payload.company ? ' (' + payload.company + ')' : ''}`,
      html: adminContactTemplate(payload),
    }),
    resend.emails.send({
      from: `Daley van FutureMarketingAI <${fromAddr}>`,
      to: [payload.email],
      subject:
        payload.locale === 'en'
          ? 'Your message has been received'
          : payload.locale === 'es'
            ? 'Hemos recibido tu mensaje'
            : 'Je bericht is ontvangen',
      html: contactConfirmationTemplate(payload),
    }),
  ])

  if (adminResult.error) {
    const ctx = { route: '/api/contact', to: toAddr, from: fromAddr, error: adminResult.error }
    console.error('[CRITICAL][contact][resend:admin]', ctx)
    await sendCriticalAlert('Contact admin mail failed', ctx)
  }
  if (confirmationResult.error) {
    const ctx = { route: '/api/contact', to: payload.email, from: fromAddr, error: confirmationResult.error }
    console.error('[CRITICAL][contact][resend:confirm]', ctx)
    await sendCriticalAlert('Contact confirmation mail failed', ctx)
  }

  return NextResponse.json(
    { success: true, message: 'Thank you! We will get back to you shortly.' },
    { status: 200 },
  )
}
