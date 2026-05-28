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

/**
 * Phase 17-D D4 simplified the apply form to name + email + agency. All
 * other fields are kept here as optional for backward compatibility with
 * historic submissions and future intake forms; templates render only
 * the fields that arrive.
 */
export interface ApplyPayload {
  name: string
  email: string
  agency?: string
  role?: string
  revenue?: string
  clientCount?: string
  tier?: string
  workspaces?: number
  problem?: string
  locale: string
  /** Wizard-flow only: qualification score + branch. */
  score?: number
  maxScore?: number
  branch?: 'qualified' | 'review'
  /** Wizard-flow only: AI Bureau Scan handoff. */
  assessment?: {
    archetype: string
    stage: string
    lowestCategory: string
  }
  /** Wizard-flow only: per-question urgency answer. */
  urgency?: string
  /** Wizard-flow only: AI maturity likert score 1-5. */
  maturity?: number
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
  founding: 'Founding Member (997 EUR levenslang)',
  growth: 'Growth (499 EUR per werkruimte, 2 tot 4 merken)',
  professional: 'Professional (399 EUR per werkruimte, 5 tot 14 merken)',
  enterprise: 'Enterprise (299 EUR per werkruimte, 15+ merken)',
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
  const agencyHeading = p.agency ? `Nieuwe aanvraag van ${safe(p.agency)}` : 'Nieuwe aanvraag'

  // Score + branch banner (wizard-flow only)
  const branchBanner =
    p.score !== undefined && p.branch
      ? `<div style="margin:0 0 16px; padding:12px 14px; border-radius:6px; background:${
          p.branch === 'qualified' ? '#e6faf4' : '#fff8e6'
        }; border-left:4px solid ${p.branch === 'qualified' ? '#00d4aa' : '#f5a623'};">
        <p style="margin:0 0 4px; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#666; font-weight:600;">${
          p.branch === 'qualified' ? 'QUALIFIED — Calendly geserveerd' : 'REVIEW — Daley reviewt persoonlijk'
        }</p>
        <p style="margin:0; font-size:18px; color:#0a0d14; font-weight:700;">Score: ${p.score} / ${p.maxScore ?? '?'}</p>
      </div>`
      : ''

  const assessmentBlock = p.assessment
    ? `<h3 style="color:#0a0d14; margin:16px 0 8px;">AI Bureau Scan handoff</h3>
       <p style="margin:4px 0;"><strong>Archetype:</strong> ${safe(p.assessment.archetype)}</p>
       <p style="margin:4px 0;"><strong>Stage:</strong> ${safe(p.assessment.stage)}</p>
       <p style="margin:4px 0;"><strong>Zwakste categorie:</strong> ${safe(p.assessment.lowestCategory)}</p>`
    : ''

  const tierLine = p.tier
    ? `<p style="color:#444; margin:0 0 16px;">Service-niveau gekozen: <strong>${safe(TIER_LABELS[p.tier] ?? p.tier)}</strong>${
        typeof p.workspaces === 'number' && p.workspaces > 0
          ? ` &middot; Geschatte werkruimtes: <strong>${p.workspaces}</strong>`
          : ''
      }</p>`
    : '<p style="color:#444; margin:0 0 16px;">Service-niveau wordt tijdens de call afgestemd.</p>'
  const qualificationBlock =
    p.revenue || p.clientCount
      ? `
        <h3 style="color:#0a0d14; margin:16px 0 8px;">Qualificatie</h3>
        ${p.revenue ? `<p style="margin:4px 0;"><strong>Omzet:</strong> ${safe(REVENUE_LABELS[p.revenue] ?? p.revenue)}</p>` : ''}
        ${p.clientCount ? `<p style="margin:4px 0;"><strong>Klantportfolio:</strong> ${safe(CLIENT_COUNT_LABELS[p.clientCount] ?? p.clientCount)}</p>` : ''}`
      : ''
  const problemBlock = p.problem
    ? `<h3 style="color:#0a0d14; margin:16px 0 8px;">Context</h3>
       <pre style="white-space:pre-wrap; background:#f8f9fa; padding:12px; border-radius:4px; font-family:inherit; color:#222;">${safe(p.problem)}</pre>`
    : ''
  return `
<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, sans-serif; background:#f5f5f5; padding:24px;">
    <table width="100%" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px;">
      <tr><td>
        <h2 style="color:#0a0d14; margin:0 0 16px;">${agencyHeading}</h2>
        ${branchBanner}
        ${tierLine}
        <hr style="border:none; border-top:1px solid #eee; margin:16px 0;">
        <h3 style="color:#0a0d14; margin:0 0 8px;">Contact</h3>
        <p style="margin:4px 0;"><strong>Naam:</strong> ${safe(p.name)}</p>
        ${p.role ? `<p style="margin:4px 0;"><strong>Rol:</strong> ${safe(p.role)}</p>` : ''}
        <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${safe(p.email)}">${safe(p.email)}</a></p>
        ${p.agency ? `<p style="margin:4px 0;"><strong>Bureau:</strong> ${safe(p.agency)}</p>` : ''}
        <p style="margin:4px 0;"><strong>Locale:</strong> ${safe(p.locale)}</p>
        ${assessmentBlock}
        ${qualificationBlock}
        ${p.urgency ? `<p style="margin:4px 0;"><strong>Urgentie:</strong> ${safe(p.urgency)}</p>` : ''}
        ${typeof p.maturity === 'number' ? `<p style="margin:4px 0;"><strong>AI maturiteit (1-5):</strong> ${p.maturity}</p>` : ''}
        ${problemBlock}
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
  const orgRef = p.agency ? safe(p.agency) : null

  // Branch-aware body: qualified = calendly waiting; review = "I review personally"
  const body = (() => {
    if (p.branch === 'qualified') {
      return p.locale === 'en'
        ? `Thanks for applying. Based on your context this looks like a strong fit — I've sent you to my calendar to book a 30-min call. See you soon.`
        : p.locale === 'es'
          ? `Gracias por tu solicitud. Según tu contexto, esto encaja bien — te he enviado a mi agenda para reservar una llamada de 30 min. Hasta pronto.`
          : `Bedankt voor je aanvraag. Op basis van je context past dit goed — ik heb je naar mijn agenda gestuurd voor een gesprek van 30 minuten. Tot snel.`
    }
    // Default + review branch
    return p.locale === 'en'
      ? orgRef
        ? `Thanks for applying. I have received your application for ${orgRef} and will review it personally within 3 business days. You will hear back from me, not from a sales team.`
        : `Thanks for applying. I have received your application and will review it personally within 3 business days. You will hear back from me, not from a sales team.`
      : p.locale === 'es'
        ? orgRef
          ? `Gracias por tu solicitud. He recibido tu aplicación para ${orgRef} y la revisaré personalmente en 3 días laborables. Te responderé yo, no un equipo comercial.`
          : `Gracias por tu solicitud. He recibido tu aplicación y la revisaré personalmente en 3 días laborables. Te responderé yo, no un equipo comercial.`
        : orgRef
          ? `Bedankt voor je aanvraag. Ik heb je aanvraag voor ${orgRef} ontvangen en review die persoonlijk binnen 3 werkdagen. Geen sales-team, maar ik zelf.`
          : `Bedankt voor je aanvraag. Ik heb je aanvraag ontvangen en review die persoonlijk binnen 3 werkdagen. Geen sales-team, maar ik zelf.`
  })()

  const signoff = p.locale === 'en' ? 'Best, Daley' : 'Groet, Daley'
  return `
<!doctype html>
<html>
  <body style="font-family: -apple-system, Segoe UI, sans-serif; background:#f5f5f5; padding:24px;">
    <table width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px;">
      <tr><td>
        <p style="color:#0a0d14; margin:0 0 16px; font-size:18px;">${greeting},</p>
        <p style="color:#333; line-height:1.6;">${body}</p>
        <p style="color:#333;"><a href="${SITE_URL}/${safe(p.locale)}" style="color:#00d4aa;">future-marketing.ai</a></p>
        <p style="color:#333; margin-top:32px;">${signoff}</p>
      </td></tr>
    </table>
  </body>
</html>`
}
