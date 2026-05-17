/**
 * POST /api/newsletter/resend-confirm
 *
 * Re-sends a double-opt-in confirmation email when the original link has
 * expired or was lost. Used by the retry form on /[locale]/newsletter/confirm
 * when the user lands with an invalid/expired token.
 *
 * Flow:
 *   1. Rate-limit by sha256(ip + 'resend-confirm') — 3 requests per hour.
 *   2. Validate body {email, locale}.
 *   3. Look up existing newsletter_consents row by email.
 *      - confirmed   → return ok=true (idempotent; user already in audience).
 *      - unsubscribed → 410 (do not silently resurrect — AVG/GDPR).
 *      - pending     → rotate token + reset created_at.
 *      - missing     → insert new pending row with a resend-confirm consent_text.
 *   4. Send the same Resend confirm template as /api/newsletter does.
 *
 * Returns:
 *   200 { ok: true }
 *   400 { ok: false, error: 'validation_failed' | 'invalid_json' }
 *   410 { ok: false, error: 'unsubscribed' }
 *   429 { ok: false, error: 'rate_limited' } with Retry-After header
 *   500 { ok: false, error: 'internal_error' }
 *   502 { ok: false, error: 'email_failed' }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { newsletterResendRateLimit } from '@/lib/ratelimit'
import { supabaseAdmin } from '@/lib/supabase-admin'

const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

const bodySchema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(['nl', 'en', 'es']).default('nl'),
})

const CONFIRM_SUBJECTS: Record<string, string> = {
  nl: 'Bevestig je aanmelding voor de AI Readiness Checklist',
  en: 'Confirm your subscription to the AI Readiness Checklist',
  es: 'Confirma tu suscripción a la AI Readiness Checklist',
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? ''
  return crypto.createHash('sha256').update(ip + salt).digest('hex')
}

function rateLimitKey(ip: string): string {
  return crypto.createHash('sha256').update(`${ip}resend-confirm`).digest('hex')
}

function renderConfirmEmail(locale: string, confirmUrl: string): string {
  // Mirrors /api/newsletter route. Kept inline to avoid coupling to messages/*.json bundle.
  if (locale === 'en') {
    return `
      <p>Here is a fresh confirmation link. Click it to activate your subscription and receive the AI Readiness Checklist.</p>
      <p><a href="${confirmUrl}">Confirm subscription</a></p>
      <p>If you did not request this, ignore this email.</p>`
  }
  if (locale === 'es') {
    return `
      <p>Aquí tienes un nuevo enlace de confirmación. Haz clic para activar tu suscripción y recibir la AI Readiness Checklist.</p>
      <p><a href="${confirmUrl}">Confirmar suscripción</a></p>
      <p>Si no solicitaste esto, ignora este correo.</p>`
  }
  return `
    <p>Hier is een nieuwe bevestigingslink. Klik erop om je aanmelding te activeren en de AI Readiness Checklist te ontvangen.</p>
    <p><a href="${confirmUrl}">Bevestig je aanmelding</a></p>
    <p>Heb je dit niet aangevraagd? Negeer dit bericht.</p>`
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const rl = await newsletterResendRateLimit.limit(rateLimitKey(ip))
  if (!rl.success) {
    const retryAfter = Math.max(0, Math.ceil((rl.reset - Date.now()) / 1000))
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
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
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation_failed' }, { status: 400 })
  }

  const { locale } = parsed.data
  const email = parsed.data.email.toLowerCase()
  const ipHashed = hashIp(ip)
  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? 'unknown'

  // Look up existing consent row by email.
  const { data: existing, error: selectError } = await supabaseAdmin
    .from('newsletter_consents')
    .select('id, status')
    .eq('email', email)
    .maybeSingle()

  if (selectError) {
    console.error('[newsletter/resend-confirm] supabase select failed', selectError)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }

  // Idempotent: already confirmed → user is already in the audience, no email needed.
  if (existing?.status === 'confirmed') {
    return NextResponse.json({ ok: true })
  }
  if (existing?.status === 'unsubscribed') {
    return NextResponse.json({ ok: false, error: 'unsubscribed' }, { status: 410 })
  }

  const token = crypto.randomUUID()

  if (existing) {
    const { error: updateError } = await supabaseAdmin
      .from('newsletter_consents')
      .update({ token, locale, status: 'pending' })
      .eq('id', existing.id)
    if (updateError) {
      console.error('[newsletter/resend-confirm] supabase update failed', updateError)
      return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
    }
  } else {
    const { error: insertError } = await supabaseAdmin.from('newsletter_consents').insert({
      email,
      token,
      status: 'pending',
      ip_hashed: ipHashed,
      user_agent: userAgent,
      consent_text: 'resend-confirm (user requested new link from confirm page)',
      locale,
      source: 'resend-confirm',
    })
    if (insertError) {
      console.error('[newsletter/resend-confirm] supabase insert failed', insertError)
      return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://future-marketing.ai'
  const confirmUrl = `${siteUrl}/${locale}/newsletter/confirm?token=${token}`
  const fromAddr = process.env.APPLY_EMAIL_FROM ?? 'apply@future-marketing.ai'

  try {
    const result = await resend.emails.send({
      from: `FutureMarketingAI <${fromAddr}>`,
      to: [email],
      subject: CONFIRM_SUBJECTS[locale] ?? CONFIRM_SUBJECTS.nl,
      html: renderConfirmEmail(locale, confirmUrl),
    })
    if (result.error) {
      console.error('[newsletter/resend-confirm] resend send failed', result.error)
      return NextResponse.json({ ok: false, error: 'email_failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[newsletter/resend-confirm] resend send threw', err)
    return NextResponse.json({ ok: false, error: 'email_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
