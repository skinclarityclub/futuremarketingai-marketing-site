/**
 * HTML email templates for /api/contact.
 *
 * WHY: same pattern as apply-templates.ts — minimal inline-CSS HTML so every
 * email client renders it without surprises and we avoid pulling react-email.
 *
 * Canonical URL via seo-config so domain migrations cascade.
 */
import { SITE_URL } from '@/lib/seo-config'

export interface ContactPayload {
  name: string
  email: string
  company: string
  message: string
  locale: string
}

function escape(value: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return String(value).replace(/[&<>"']/g, (c) => map[c] ?? c)
}

export function adminContactTemplate(p: ContactPayload): string {
  const safe = escape
  return `
<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, sans-serif; background:#f5f5f5; padding:24px;">
    <table width="100%" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px;">
      <tr><td>
        <h2 style="color:#0A0E27; margin:0 0 16px;">Nieuw contactbericht van ${safe(p.name)}</h2>
        <hr style="border:none; border-top:1px solid #eee; margin:16px 0;">
        <h3 style="color:#0A0E27; margin:0 0 8px;">Contact</h3>
        <p style="margin:4px 0;"><strong>Naam:</strong> ${safe(p.name)}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${safe(p.email)}">${safe(p.email)}</a></p>
        ${p.company ? `<p style="margin:4px 0;"><strong>Bedrijf:</strong> ${safe(p.company)}</p>` : ''}
        <p style="margin:4px 0;"><strong>Locale:</strong> ${safe(p.locale)}</p>
        <h3 style="color:#0A0E27; margin:16px 0 8px;">Bericht</h3>
        <pre style="white-space:pre-wrap; background:#f8f9fa; padding:12px; border-radius:4px; font-family:inherit; color:#222;">${safe(p.message)}</pre>
        <hr style="border:none; border-top:1px solid #eee; margin:24px 0 16px;">
        <p style="font-size:12px; color:#888;">Verstuurd via ${SITE_URL}/contact.</p>
      </td></tr>
    </table>
  </body>
</html>`
}

export function contactConfirmationTemplate(p: ContactPayload): string {
  const safe = escape
  const greeting =
    p.locale === 'en'
      ? `Hi ${safe(p.name)}`
      : p.locale === 'es'
        ? `Hola ${safe(p.name)}`
        : `Hoi ${safe(p.name)}`
  const body =
    p.locale === 'en'
      ? 'Thanks for reaching out. I have received your message and will reply within 48 hours, personally.'
      : p.locale === 'es'
        ? 'Gracias por escribirme. He recibido tu mensaje y te respondere en 48 horas, personalmente.'
        : 'Bedankt voor je bericht. Ik heb het ontvangen en reageer binnen 48 uur, persoonlijk.'
  const signoff = p.locale === 'en' ? 'Best, Daley' : 'Groet, Daley'
  return `
<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, sans-serif; background:#f5f5f5; padding:24px;">
    <table width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px;">
      <tr><td>
        <p style="color:#0A0E27; margin:0 0 16px; font-size:18px;">${greeting},</p>
        <p style="color:#333; line-height:1.6;">${body}</p>
        <p style="color:#333;"><a href="${SITE_URL}/${safe(p.locale)}" style="color:#00D4FF;">future-marketing.ai</a></p>
        <p style="color:#333; margin-top:32px;">${signoff}</p>
      </td></tr>
    </table>
  </body>
</html>`
}
