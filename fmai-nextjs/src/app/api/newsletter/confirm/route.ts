/**
 * POST /api/newsletter/confirm
 *
 * Double-opt-in confirmation handler for the lead-magnet programme.
 *
 * Flow:
 *   1. Validate token shape (UUID v4, 36 chars).
 *   2. Look up consent row.
 *   3. Idempotent: already-confirmed returns ok+alreadyConfirmed.
 *   4. Already-unsubscribed returns 410.
 *   5. Flip status to confirmed + stamp confirmed_at.
 *   6. Add to Resend Audience (RESEND_AUDIENCE_ID). Non-fatal if missing.
 *   7. Send PDF delivery email pointing to /downloads/nl-bureau-ai-readiness-checklist.pdf.
 *
 * The PDF asset itself is delivered separately by Daley dropping the file in
 * fmai-nextjs/public/downloads/ — see SUMMARY.md launch prerequisites.
 */
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-admin'

const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')

function deliverSubject(locale: string): string {
  switch (locale) {
    case 'en':
      return 'Your AI Readiness Checklist is ready'
    case 'es':
      return 'Tu AI Readiness Checklist está lista'
    default:
      return 'Je AI Readiness Checklist staat klaar'
  }
}

function renderDeliveryEmail(locale: string, pdfUrl: string): string {
  if (locale === 'en') {
    return `<p>Thanks for confirming. Download your checklist:</p><p><a href="${pdfUrl}">NL Bureau AI Readiness Checklist (PDF)</a></p>`
  }
  if (locale === 'es') {
    return `<p>Gracias por confirmar. Descarga tu checklist:</p><p><a href="${pdfUrl}">NL Bureau AI Readiness Checklist (PDF)</a></p>`
  }
  return `<p>Bedankt voor je bevestiging. Download je checklist:</p><p><a href="${pdfUrl}">NL Bureau AI Readiness Checklist (PDF)</a></p>`
}

export async function POST(request: NextRequest) {
  const { token } = (await request.json().catch(() => ({}))) as { token?: string }
  if (!token || typeof token !== 'string' || token.length !== 36) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 })
  }

  const { data: row, error: selectError } = await supabaseAdmin
    .from('newsletter_consents')
    .select('id, email, status, locale')
    .eq('token', token)
    .maybeSingle()

  if (selectError || !row) {
    return NextResponse.json({ error: 'token_not_found' }, { status: 404 })
  }
  if (row.status === 'confirmed') {
    return NextResponse.json({ ok: true, alreadyConfirmed: true })
  }
  if (row.status === 'unsubscribed') {
    return NextResponse.json({ error: 'unsubscribed' }, { status: 410 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('newsletter_consents')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', row.id)
  if (updateError) {
    console.error('[newsletter/confirm] update failed', updateError)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }

  // Add to Resend Audience. Non-fatal: if RESEND_AUDIENCE_ID is unset (e.g.
  // dev pre-provisioning) the user is still confirmed and receives the PDF.
  // Documented as a launch prerequisite in 15-04-SUMMARY.md.
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (audienceId) {
    try {
      await resend.contacts.create({
        audienceId,
        email: row.email,
        unsubscribed: false,
      })
    } catch (err) {
      console.warn('[newsletter/confirm] resend contacts.create non-fatal', err)
    }
  } else {
    console.warn(
      '[newsletter/confirm] RESEND_AUDIENCE_ID is not set — contact NOT added to audience',
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://future-marketing.ai'
  const pdfUrl = `${siteUrl}/downloads/nl-bureau-ai-readiness-checklist.pdf`
  const fromAddr = process.env.APPLY_EMAIL_FROM ?? 'apply@future-marketing.ai'

  try {
    const result = await resend.emails.send({
      from: `FutureMarketingAI <${fromAddr}>`,
      to: [row.email],
      subject: deliverSubject(row.locale),
      html: renderDeliveryEmail(row.locale, pdfUrl),
    })
    if (result.error) {
      console.error('[newsletter/confirm] delivery mail send returned error', result.error)
      // Non-fatal: user is already confirmed and in the audience.
    }
  } catch (err) {
    console.error('[newsletter/confirm] delivery mail threw', err)
    // Non-fatal.
  }

  return NextResponse.json({ ok: true })
}
