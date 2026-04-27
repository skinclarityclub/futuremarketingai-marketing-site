/**
 * POST /api/newsletter
 *
 * Newsletter intake endpoint for the lead-magnet programme (Phase 15-04).
 *
 * Flow:
 *   1. Validate input + honeypot + explicit consent.
 *   2. Insert pending consent row in public.newsletter_consents (RLS bypassed via service_role).
 *   3. Send a double-opt-in email via Resend with a tokenized confirm link.
 *   4. Subscriber is added to the Resend Audience ONLY after the user clicks
 *      the link — see /api/newsletter/confirm.
 *
 * AVG/GDPR notes:
 *   - Raw IP is never persisted. Hashed via SHA-256 with IP_HASH_SALT.
 *   - consent_text is stored verbatim so we can prove which checkbox copy was shown.
 *   - Consent is z.literal(true) — unchecked submissions fail validation.
 *   - Honeypot `website` field silently accepts bot traffic and returns 200.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import crypto from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Resend's constructor throws when the API key is undefined; pass placeholder
// so `next build` page-data collection does not break in pre-provisioning envs.
const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

const newsletterSchema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(['nl', 'en', 'es']).default('nl'),
  source: z.string().max(50).optional(),
  consent: z.literal(true, {
    error: 'Consent is required.',
  }),
  consentText: z.string().min(1).max(500),
  // Honeypot: bots fill, humans do not.
  website: z.string().max(0).optional().default(''),
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

function renderConfirmEmail(locale: string, confirmUrl: string): string {
  // NL is source-of-truth. EN + ES copy lives inline so the email render does
  // not couple to the messages/*.json client bundle.
  if (locale === 'en') {
    return `
      <p>Thanks for signing up. Click the link below to confirm your subscription and receive the AI Readiness Checklist.</p>
      <p><a href="${confirmUrl}">Confirm subscription</a></p>
      <p>If you did not request this, ignore this email.</p>`
  }
  if (locale === 'es') {
    return `
      <p>Gracias por suscribirte. Haz clic en el enlace para confirmar y recibir la AI Readiness Checklist.</p>
      <p><a href="${confirmUrl}">Confirmar suscripción</a></p>
      <p>Si no solicitaste esto, ignora este correo.</p>`
  }
  return `
    <p>Bedankt voor je aanmelding. Klik op de link hieronder om te bevestigen en ontvang de AI Readiness Checklist.</p>
    <p><a href="${confirmUrl}">Bevestig je aanmelding</a></p>
    <p>Heb je dit niet aangevraagd? Negeer dit bericht.</p>`
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 })
  }

  // Honeypot silently accepted: respond 200 so bots cannot tell they were caught.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const { email, locale, source, consentText } = parsed.data

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const ipHashed = hashIp(ip)
  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? 'unknown'

  const token = crypto.randomUUID()

  const { error: dbError } = await supabaseAdmin.from('newsletter_consents').insert({
    email: email.toLowerCase(),
    token,
    status: 'pending',
    ip_hashed: ipHashed,
    user_agent: userAgent,
    consent_text: consentText,
    locale,
    source: source ?? null,
  })

  if (dbError) {
    console.error('[newsletter] supabase insert failed', dbError)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
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
      console.error('[newsletter] resend send failed', result.error)
      return NextResponse.json({ error: 'email_failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[newsletter] resend send threw', err)
    return NextResponse.json({ error: 'email_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
