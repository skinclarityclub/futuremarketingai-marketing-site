/**
 * HTML email templates for /api/apply.
 *
 * WHY: plain-text Resend emails look unprofessional. These templates render
 * table-based, inline-styled HTML (the only layout primitives every mail client
 * supports) wrapped in a shared branded shell: a dark FutureMarketingAI header
 * band over a light, readable body. Dark-on-light is deliberate — full dark
 * backgrounds render unreliably across Outlook/Gmail, so the brand lives in the
 * header while the body stays bulletproof.
 *
 * Canonical URL + brand assets come from seo-config / calConfig so the domain
 * migration and the Cal.com scheduling migration cascade automatically.
 */
import { SITE_URL } from '@/lib/seo-config'
import { calHostedUrl } from '@/config/calConfig'

const LOGO_URL = `${SITE_URL}/logo.png`
const TEAL = '#00d4aa'
const AMBER = '#f5a623'
const INK = '#0a0d14'
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

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

/**
 * Shared branded shell. `inner` is trusted HTML produced by the callers below
 * (all user data inside it is already escaped). `preheader` is the hidden inbox
 * preview line.
 */
function wrapEmail({ preheader, inner }: { preheader: string; inner: string }): string {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>FutureMarketingAI</title>
  </head>
  <body style="margin:0; padding:0; background:#eceef1; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#eceef1; font-size:1px; line-height:1px;">${escape(
      preheader
    )}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eceef1;">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(10,13,20,0.08);">
            <!-- Dark branded header -->
            <tr>
              <td align="center" bgcolor="${INK}" style="background:${INK}; padding:30px 24px 22px;">
                <img src="${LOGO_URL}" width="44" height="44" alt="FutureMarketingAI" style="display:block; margin:0 auto 10px; border:0;">
                <div style="font-family:${FONT}; font-size:19px; font-weight:700; color:#e8ecf4; letter-spacing:-0.02em;">FutureMarketing<span style="color:${TEAL};">AI</span></div>
                <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:16px auto 0;">
                  <tr>
                    <td width="28" height="3" bgcolor="${TEAL}" style="border-radius:2px 0 0 2px; font-size:0; line-height:0;">&nbsp;</td>
                    <td width="20" height="3" bgcolor="${AMBER}" style="border-radius:0 2px 2px 0; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td bgcolor="#ffffff" style="background:#ffffff; padding:32px 36px;">
                ${inner}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td bgcolor="#f7f8fa" style="background:#f7f8fa; padding:20px 36px; border-top:1px solid #eceef1;">
                <p style="margin:0; font-family:${FONT}; font-size:12px; line-height:1.6; color:#8a93a3;">
                  FutureMarketingAI &middot; <a href="${SITE_URL}" style="color:#8a93a3; text-decoration:underline;">future-marketing.ai</a><br>
                  Jouw AI Marketing Medewerker, EU-native en zonder lock-in.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/** Bulletproof amber CTA button matching the site's primary CTA. */
function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
    <tr>
      <td bgcolor="${AMBER}" style="border-radius:10px;">
        <a href="${href}" target="_blank" rel="noreferrer" style="display:inline-block; padding:14px 30px; font-family:${FONT}; font-size:15px; font-weight:700; color:${INK}; text-decoration:none; border-radius:10px;">${label} &rarr;</a>
      </td>
    </tr>
  </table>`
}

export function adminApplyTemplate(p: ApplyPayload): string {
  const safe = escape
  const agencyHeading = p.agency
    ? `Nieuwe aanvraag van ${safe(p.agency)}`
    : 'Nieuwe aanvraag'

  const isQualified = p.branch === 'qualified'
  const branchBanner =
    p.score !== undefined && p.branch
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
          <tr>
            <td style="padding:14px 16px; border-radius:10px; background:${
              isQualified ? '#e9faf5' : '#fff7e8'
            }; border-left:4px solid ${isQualified ? TEAL : AMBER};">
              <p style="margin:0 0 4px; font-family:${FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#6b7280; font-weight:700;">${
                isQualified ? 'QUALIFIED &middot; Agenda geserveerd (Cal.com)' : 'REVIEW &middot; Daley reviewt persoonlijk'
              }</p>
              <p style="margin:0; font-family:${FONT}; font-size:18px; color:${INK}; font-weight:700;">Score: ${p.score} / ${p.maxScore ?? '?'}</p>
            </td>
          </tr>
        </table>`
      : ''

  const tierLine = p.tier
    ? `<p style="margin:0 0 18px; font-family:${FONT}; font-size:14px; color:#4b5563;">Service-niveau gekozen: <strong style="color:${INK};">${safe(
        TIER_LABELS[p.tier] ?? p.tier
      )}</strong>${
        typeof p.workspaces === 'number' && p.workspaces > 0
          ? ` &middot; Geschatte werkruimtes: <strong style="color:${INK};">${p.workspaces}</strong>`
          : ''
      }</p>`
    : `<p style="margin:0 0 18px; font-family:${FONT}; font-size:14px; color:#4b5563;">Service-niveau wordt tijdens de call afgestemd.</p>`

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:5px 0; font-family:${FONT}; font-size:14px; color:#6b7280; width:140px; vertical-align:top;">${label}</td>
      <td style="padding:5px 0; font-family:${FONT}; font-size:14px; color:${INK}; font-weight:600;">${value}</td>
    </tr>`

  const sectionHeading = (text: string) =>
    `<p style="margin:22px 0 8px; font-family:${FONT}; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${TEAL};">${text}</p>`

  const assessmentBlock = p.assessment
    ? sectionHeading('AI Bureau Scan handoff') +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row('Archetype', safe(p.assessment.archetype))}
        ${row('Stage', safe(p.assessment.stage))}
        ${row('Zwakste categorie', safe(p.assessment.lowestCategory))}
      </table>`
    : ''

  const qualificationBlock =
    p.revenue || p.clientCount
      ? sectionHeading('Kwalificatie') +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${p.revenue ? row('Omzet', safe(REVENUE_LABELS[p.revenue] ?? p.revenue)) : ''}
          ${p.clientCount ? row('Klantportfolio', safe(CLIENT_COUNT_LABELS[p.clientCount] ?? p.clientCount)) : ''}
          ${p.urgency ? row('Urgentie', safe(p.urgency)) : ''}
          ${typeof p.maturity === 'number' ? row('AI maturiteit (1-5)', String(p.maturity)) : ''}
        </table>`
      : ''

  const problemBlock = p.problem
    ? sectionHeading('Context') +
      `<div style="background:#f7f8fa; border:1px solid #eceef1; border-radius:10px; padding:14px 16px; font-family:${FONT}; font-size:14px; line-height:1.6; color:#374151; white-space:pre-wrap;">${safe(
        p.problem
      )}</div>`
    : ''

  const inner = `
    <h1 style="margin:0 0 18px; font-family:${FONT}; font-size:22px; font-weight:700; color:${INK}; letter-spacing:-0.01em;">${agencyHeading}</h1>
    ${branchBanner}
    ${tierLine}
    ${sectionHeading('Contact')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Naam', safe(p.name))}
      ${p.role ? row('Rol', safe(p.role)) : ''}
      ${row('E-mail', `<a href="mailto:${safe(p.email)}" style="color:${TEAL}; text-decoration:none;">${safe(p.email)}</a>`)}
      ${p.agency ? row('Bureau', safe(p.agency)) : ''}
      ${row('Locale', safe(p.locale))}
    </table>
    ${assessmentBlock}
    ${qualificationBlock}
    ${problemBlock}`

  return wrapEmail({
    preheader: `${agencyHeading}${p.score !== undefined ? ` — score ${p.score}/${p.maxScore ?? '?'}` : ''}`,
    inner,
  })
}

export function applicantConfirmationTemplate(p: ApplyPayload): string {
  const safe = escape
  const isEn = p.locale === 'en'
  const isEs = p.locale === 'es'
  const greeting = isEn ? `Hi ${safe(p.name)}` : isEs ? `Hola ${safe(p.name)}` : `Hoi ${safe(p.name)}`
  const orgRef = p.agency ? safe(p.agency) : null
  const isQualified = p.branch === 'qualified'

  const body = (() => {
    if (isQualified) {
      return isEn
        ? `Thanks for applying. Based on your context this looks like a strong fit. Pick a 30-minute slot in my calendar below and we'll talk soon.`
        : isEs
          ? `Gracias por tu solicitud. Según tu contexto, esto encaja muy bien. Elige un hueco de 30 minutos en mi agenda abajo y hablamos pronto.`
          : `Bedankt voor je aanvraag. Op basis van je context past dit goed. Kies hieronder een slot van 30 minuten in mijn agenda, dan spreken we elkaar snel.`
    }
    return isEn
      ? orgRef
        ? `Thanks for applying. I have received your application for ${orgRef} and will review it personally within 3 business days. You will hear back from me, not from a sales team.`
        : `Thanks for applying. I have received your application and will review it personally within 3 business days. You will hear back from me, not from a sales team.`
      : isEs
        ? orgRef
          ? `Gracias por tu solicitud. He recibido tu aplicación para ${orgRef} y la revisaré personalmente en 3 días laborables. Te responderé yo, no un equipo comercial.`
          : `Gracias por tu solicitud. He recibido tu aplicación y la revisaré personalmente en 3 días laborables. Te responderé yo, no un equipo comercial.`
        : orgRef
          ? `Bedankt voor je aanvraag. Ik heb je aanvraag voor ${orgRef} ontvangen en review die persoonlijk binnen 3 werkdagen. Geen sales-team, maar ik zelf.`
          : `Bedankt voor je aanvraag. Ik heb je aanvraag ontvangen en review die persoonlijk binnen 3 werkdagen. Geen sales-team, maar ik zelf.`
  })()

  const ctaLabel = isEn ? 'Book your call' : isEs ? 'Reserva tu llamada' : 'Plan je gesprek'
  const cta = isQualified
    ? ctaButton(calHostedUrl({ name: p.name, email: p.email }), ctaLabel)
    : ''

  const signoff = isEn ? 'Best,' : isEs ? 'Un saludo,' : 'Groet,'
  const preheader = isQualified
    ? isEn
      ? 'Pick a slot in my calendar'
      : isEs
        ? 'Elige un hueco en mi agenda'
        : 'Kies een slot in mijn agenda'
    : isEn
      ? 'I review every application personally'
      : isEs
        ? 'Reviso cada solicitud personalmente'
        : 'Ik review elke aanvraag persoonlijk'

  const inner = `
    <p style="margin:0 0 18px; font-family:${FONT}; font-size:20px; font-weight:700; color:${INK}; letter-spacing:-0.01em;">${greeting},</p>
    <p style="margin:0 0 22px; font-family:${FONT}; font-size:16px; line-height:1.65; color:#374151;">${body}</p>
    ${cta}
    <p style="margin:28px 0 4px; font-family:${FONT}; font-size:16px; line-height:1.5; color:#374151;">${signoff}</p>
    <p style="margin:0; font-family:${FONT}; font-size:16px; font-weight:700; color:${INK};">Daley van Diest</p>
    <p style="margin:2px 0 0; font-family:${FONT}; font-size:13px; color:#8a93a3;">Founder, FutureMarketingAI</p>`

  return wrapEmail({ preheader, inner })
}
