/**
 * HTML email templates for /api/apply.
 *
 * WHY: plain-text Resend emails look unprofessional. These templates render
 * table-based, inline-styled HTML (the only layout primitives every mail client
 * supports) in a clean LIGHT shell. Light is deliberate and non-negotiable for
 * deliverability: Outlook's dark-mode colour adjustment turns a dark background
 * into a muddy grey, so the whole transactional family stays light (the Stripe /
 * Linear / GitHub standard). There is no grey frame: the email is white
 * edge-to-edge, brand identity comes from the colour logo, teal/amber accents
 * and typography, not from a coloured canvas.
 *
 * Canonical URL + brand assets come from seo-config / calConfig so the domain
 * migration and the Cal.com scheduling migration cascade automatically.
 */
import { SITE_URL } from '@/lib/seo-config'
import { calHostedUrl } from '@/config/calConfig'

const LOGO_URL = `${SITE_URL}/logo.png`

// Light palette. Neutrals are warm-tinted (never pure #000/#fff). Accent text
// colours are darkened from the brand teal/amber so they pass contrast on white.
const PAPER = '#fdfdfc' // outer + body background (warm near-white)
const INK = '#161b24' // headings
const BODY = '#39414f' // body copy
const MUTED = '#717885' // labels
const DIM = '#9aa0ad' // footer / meta
const HAIRLINE = '#eceef2' // 1px rules + row dividers
const TEAL = '#00d4aa' // brand teal (decorative only)
const TEAL_TEXT = '#00866b' // legible teal on white
const AMBER = '#f5a623' // brand amber (CTA bg + decorative)
const AMBER_TEXT = '#b06f08' // legible amber on white

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const MONO = "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace"

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

/** Mono uppercase section eyebrow, echoing the site's labels. */
function eyebrow(text: string): string {
  return `<p style="margin:30px 0 12px; font-family:${MONO}; font-size:11px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:${TEAL_TEXT};">${text}</p>`
}

/**
 * Shared light shell. `inner` is trusted HTML produced by the callers below
 * (all user data inside it is already escaped). `preheader` is the hidden inbox
 * preview line. No card fill, no grey frame: white edge-to-edge, sections
 * separated by hairline rules.
 */
function wrapEmail({ preheader, inner }: { preheader: string; inner: string }): string {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>FutureMarketingAI</title>
  </head>
  <body style="margin:0; padding:0; background-color:${PAPER}; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:${PAPER}; font-size:1px; line-height:1px;">${escape(
      preheader
    )}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PAPER}" style="background-color:${PAPER};">
      <tr>
        <td align="center" style="padding:36px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="${PAPER}" style="width:600px; max-width:600px; background-color:${PAPER};">
            <!-- Header -->
            <tr>
              <td align="center" style="padding:8px 24px 26px; border-bottom:1px solid ${HAIRLINE};">
                <img src="${LOGO_URL}" width="46" height="46" alt="FutureMarketingAI" style="display:block; margin:0 auto 12px; border:0;">
                <div style="font-family:${FONT}; font-size:20px; font-weight:700; color:${INK}; letter-spacing:-0.02em;">FutureMarketing<span style="color:${TEAL_TEXT};">AI</span></div>
                <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:16px auto 0;">
                  <tr>
                    <td width="30" height="3" bgcolor="${TEAL}" style="background-color:${TEAL}; border-radius:2px 0 0 2px; font-size:0; line-height:0;">&nbsp;</td>
                    <td width="20" height="3" bgcolor="${AMBER}" style="background-color:${AMBER}; border-radius:0 2px 2px 0; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:32px 40px 36px;">
                ${inner}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:22px 40px; border-top:1px solid ${HAIRLINE};">
                <p style="margin:0; font-family:${FONT}; font-size:12px; line-height:1.7; color:${DIM};">
                  FutureMarketingAI &middot; <a href="${SITE_URL}" style="color:${MUTED}; text-decoration:none;">future-marketing.ai</a><br>
                  Jouw AI Marketing Medewerker. EU-native, zonder lock-in.
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
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0 6px;">
    <tr>
      <td bgcolor="${AMBER}" style="background-color:${AMBER}; border-radius:10px;">
        <a href="${href}" target="_blank" rel="noreferrer" style="display:inline-block; padding:15px 32px; font-family:${FONT}; font-size:15px; font-weight:700; color:${INK}; text-decoration:none; border-radius:10px;">${label} &rarr;</a>
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

  // Full-bordered status box with a leading status dot (no side-stripe banner).
  const statusBox =
    p.score !== undefined && p.branch
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
          <tr>
            <td bgcolor="${isQualified ? '#eefaf5' : '#fff7e9'}" style="background-color:${
              isQualified ? '#eefaf5' : '#fff7e9'
            }; border:1px solid ${isQualified ? '#c4ebdf' : '#f1dcb0'}; border-radius:12px; padding:16px 18px;">
              <p style="margin:0 0 6px; font-family:${MONO}; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:${
                isQualified ? TEAL_TEXT : AMBER_TEXT
              };">&#9679;&nbsp; ${
                isQualified ? 'Qualified &middot; agenda geserveerd (Cal.com)' : 'Review &middot; Daley reviewt persoonlijk'
              }</p>
              <p style="margin:0; font-family:${FONT}; font-size:20px; font-weight:700; color:${INK};">Score ${p.score} <span style="color:${DIM}; font-weight:600;">/ ${p.maxScore ?? '?'}</span></p>
            </td>
          </tr>
        </table>`
      : ''

  const tierLine = p.tier
    ? `<p style="margin:18px 0 0; font-family:${FONT}; font-size:14px; line-height:1.6; color:${MUTED};">Service-niveau: <strong style="color:${INK}; font-weight:600;">${safe(
        TIER_LABELS[p.tier] ?? p.tier
      )}</strong>${
        typeof p.workspaces === 'number' && p.workspaces > 0
          ? ` &middot; Werkruimtes: <strong style="color:${INK}; font-weight:600;">${p.workspaces}</strong>`
          : ''
      }</p>`
    : `<p style="margin:18px 0 0; font-family:${FONT}; font-size:14px; line-height:1.6; color:${MUTED};">Service-niveau wordt tijdens de call afgestemd.</p>`

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:11px 0; border-bottom:1px solid ${HAIRLINE}; font-family:${FONT}; font-size:14px; color:${MUTED}; width:150px; vertical-align:top;">${label}</td>
      <td style="padding:11px 0; border-bottom:1px solid ${HAIRLINE}; font-family:${FONT}; font-size:14px; color:${INK}; font-weight:600;">${value}</td>
    </tr>`

  const dataTable = (rows: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`

  const assessmentBlock = p.assessment
    ? eyebrow('AI Bureau Scan handoff') +
      dataTable(
        row('Archetype', safe(p.assessment.archetype)) +
          row('Stage', safe(p.assessment.stage)) +
          row('Zwakste categorie', safe(p.assessment.lowestCategory))
      )
    : ''

  const qualificationBlock =
    p.revenue || p.clientCount || p.urgency || typeof p.maturity === 'number'
      ? eyebrow('Kwalificatie') +
        dataTable(
          (p.revenue ? row('Omzet', safe(REVENUE_LABELS[p.revenue] ?? p.revenue)) : '') +
            (p.clientCount ? row('Klantportfolio', safe(CLIENT_COUNT_LABELS[p.clientCount] ?? p.clientCount)) : '') +
            (p.urgency ? row('Urgentie', safe(p.urgency)) : '') +
            (typeof p.maturity === 'number' ? row('AI maturiteit (1-5)', String(p.maturity)) : '')
        )
      : ''

  const problemBlock = p.problem
    ? eyebrow('Context') +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td bgcolor="#f8f9fb" style="background-color:#f8f9fb; border:1px solid ${HAIRLINE}; border-radius:12px; padding:16px 18px; font-family:${FONT}; font-size:14px; line-height:1.65; color:${BODY}; white-space:pre-wrap;">${safe(
          p.problem
        )}</td></tr>
      </table>`
    : ''

  const inner = `
    <h1 style="margin:0 0 20px; font-family:${FONT}; font-size:22px; font-weight:700; color:${INK}; letter-spacing:-0.01em;">${agencyHeading}</h1>
    ${statusBox}
    ${tierLine}
    ${eyebrow('Contact')}
    ${dataTable(
      row('Naam', safe(p.name)) +
        (p.role ? row('Rol', safe(p.role)) : '') +
        row('E-mail', `<a href="mailto:${safe(p.email)}" style="color:${TEAL_TEXT}; text-decoration:none;">${safe(p.email)}</a>`) +
        (p.agency ? row('Bureau', safe(p.agency)) : '') +
        row('Locale', safe(p.locale))
    )}
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
  const cta = isQualified ? ctaButton(calHostedUrl({ name: p.name, email: p.email }), ctaLabel) : ''

  const signoff = isEn ? 'Best,' : isEs ? 'Un saludo,' : 'Groet,'
  const roleLine = isEn ? 'Founder, FutureMarketingAI' : isEs ? 'Fundador, FutureMarketingAI' : 'Oprichter, FutureMarketingAI'
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
    <p style="margin:0 0 20px; font-family:${FONT}; font-size:21px; font-weight:700; color:${INK}; letter-spacing:-0.01em;">${greeting},</p>
    <p style="margin:0 0 24px; font-family:${FONT}; font-size:16px; line-height:1.65; color:${BODY};">${body}</p>
    ${cta}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
      <tr><td style="border-top:1px solid ${HAIRLINE}; padding-top:22px;">
        <p style="margin:0 0 2px; font-family:${FONT}; font-size:15px; color:${MUTED};">${signoff}</p>
        <p style="margin:0; font-family:${FONT}; font-size:16px; font-weight:700; color:${INK};">Daley van Diest</p>
        <p style="margin:3px 0 0; font-family:${MONO}; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:${DIM};">${roleLine}</p>
      </td></tr>
    </table>`

  return wrapEmail({ preheader, inner })
}
