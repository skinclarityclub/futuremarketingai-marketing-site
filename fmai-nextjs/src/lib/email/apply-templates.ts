/**
 * HTML email templates for /api/apply.
 *
 * WHY: plain-text Resend emails look unprofessional. Inline HTML with minimal
 * CSS is the safest path (no react-email dep) and every client renders it.
 *
 * Canonical URL is imported from seo-config, not hardcoded, so the domain
 * migration in plan 10-01 cascades automatically.
 */
import { SITE_URL } from '@/lib/seo-config'

export interface ApplyPayload {
  name: string
  email: string
  agency: string
  role: string
  revenue: string
  clientCount: string
  tier: string
  problem: string
  locale: string
}

const REVENUE_LABELS: Record<string, string> = {
  under_300k: 'Onder 300k',
  '300k_1m': '300k tot 1M',
  '1m_3m': '1M tot 3M',
  '3m_10m': '3M tot 10M',
  over_10m: 'Boven 10M',
}

const CLIENT_COUNT_LABELS: Record<string, string> = {
  solo: 'Solo (1 persoon)',
  '1_5': '1 tot 5',
  '5_15': '5 tot 15',
  '15_50': '15 tot 50',
  over_50: 'Boven 50',
}

const TIER_LABELS: Record<string, string> = {
  partner: 'Partner (347 EUR)',
  growth: 'Growth (2.497 EUR)',
  professional: 'Professional (4.497 EUR)',
  enterprise: 'Enterprise (7.997 EUR)',
  founding: 'Founding Member (997 EUR)',
  unsure: 'Nog onduidelijk',
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

export function adminApplyTemplate(p: ApplyPayload): string {
  const safe = escape
  return `
<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, sans-serif; background:#f5f5f5; padding:24px;">
    <table width="100%" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px;">
      <tr><td>
        <h2 style="color:#0A0E27; margin:0 0 16px;">Nieuwe aanvraag van ${safe(p.agency)}</h2>
        <p style="color:#444; margin:0 0 16px;">Tier gekozen: <strong>${safe(TIER_LABELS[p.tier] ?? p.tier)}</strong></p>
        <hr style="border:none; border-top:1px solid #eee; margin:16px 0;">
        <h3 style="color:#0A0E27; margin:0 0 8px;">Contact</h3>
        <p style="margin:4px 0;"><strong>Naam:</strong> ${safe(p.name)}</p>
        <p style="margin:4px 0;"><strong>Rol:</strong> ${safe(p.role)}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${safe(p.email)}">${safe(p.email)}</a></p>
        <p style="margin:4px 0;"><strong>Bureau:</strong> ${safe(p.agency)}</p>
        <h3 style="color:#0A0E27; margin:16px 0 8px;">Qualificatie</h3>
        <p style="margin:4px 0;"><strong>Omzet:</strong> ${safe(REVENUE_LABELS[p.revenue] ?? p.revenue)}</p>
        <p style="margin:4px 0;"><strong>Klantportfolio:</strong> ${safe(CLIENT_COUNT_LABELS[p.clientCount] ?? p.clientCount)}</p>
        <p style="margin:4px 0;"><strong>Locale:</strong> ${safe(p.locale)}</p>
        <h3 style="color:#0A0E27; margin:16px 0 8px;">Probleem</h3>
        <pre style="white-space:pre-wrap; background:#f8f9fa; padding:12px; border-radius:4px; font-family:inherit; color:#222;">${safe(p.problem)}</pre>
        <hr style="border:none; border-top:1px solid #eee; margin:24px 0 16px;">
        <p style="font-size:12px; color:#888;">Verstuurd via ${SITE_URL}/apply.</p>
      </td></tr>
    </table>
  </body>
</html>`
}

export function applicantConfirmationTemplate(p: ApplyPayload): string {
  const safe = escape
  const greeting =
    p.locale === 'en'
      ? `Hi ${safe(p.name)}`
      : p.locale === 'es'
        ? `Hola ${safe(p.name)}`
        : `Hoi ${safe(p.name)}`
  const body =
    p.locale === 'en'
      ? `Thanks for applying. I have received your application for ${safe(p.agency)} and will review it within 48 hours. You will hear back from me personally, not from a sales team.`
      : p.locale === 'es'
        ? `Gracias por tu solicitud. He recibido tu aplicacion para ${safe(p.agency)} y la revisare en 48 horas. Te respondere yo personalmente, no un equipo comercial.`
        : `Bedankt voor je aanvraag. Ik heb je aanvraag voor ${safe(p.agency)} ontvangen en neem binnen 48 uur persoonlijk contact op. Geen sales-team, maar ik zelf.`
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
