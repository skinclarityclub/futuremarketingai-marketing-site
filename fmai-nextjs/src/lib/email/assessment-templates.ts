/**
 * AI Readiness Assessment email templates.
 *
 * Two flavours:
 *   - assessmentConfirmEmail: double-opt-in confirmation, mirrors the
 *     newsletter pattern. Subject mentions the persona to bait the click.
 *   - assessmentResultEmail: the full report sent post-confirmation.
 *     Persona card, 4 per-category score bars, 3 recommended skills with
 *     deep links, 4-week roadmap, CTA → /apply (UTM-tagged).
 *
 * Inline HTML + inline CSS, same style as apply-templates.ts. No React
 * Email setup in this repo and no plans to add one for two templates.
 */

import type {
  AssessmentCategory,
  AssessmentPersona,
  CategoryScores,
} from '@/lib/assessment/types'
import { getRecommendedSkills } from '@/lib/assessment/skill-routing'

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Locale = 'nl' | 'en' | 'es'

// ─── Confirmation email ─────────────────────────────────────────────────

const CONFIRM_COPY: Record<Locale, Record<AssessmentPersona, { subject: string; lead: string; cta: string }>> = {
  nl: {
    explorer: { subject: 'Bevestig je AI Readiness Scan — je bent een Explorer', lead: 'Je bent een Explorer. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.', cta: 'Bevestig en bekijk mijn rapport' },
    builder: { subject: 'Bevestig je AI Readiness Scan — je bent een Builder', lead: 'Je bent een Builder. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.', cta: 'Bevestig en bekijk mijn rapport' },
    operator: { subject: 'Bevestig je AI Readiness Scan — je bent een Operator', lead: 'Je bent een Operator. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.', cta: 'Bevestig en bekijk mijn rapport' },
  },
  en: {
    explorer: { subject: 'Confirm your AI Readiness Scan — you are an Explorer', lead: 'You are an Explorer. Click below to receive your full action plan and the 3 recommended Clyde skills.', cta: 'Confirm and view my report' },
    builder: { subject: 'Confirm your AI Readiness Scan — you are a Builder', lead: 'You are a Builder. Click below to receive your full action plan and the 3 recommended Clyde skills.', cta: 'Confirm and view my report' },
    operator: { subject: 'Confirm your AI Readiness Scan — you are an Operator', lead: 'You are an Operator. Click below to receive your full action plan and the 3 recommended Clyde skills.', cta: 'Confirm and view my report' },
  },
  es: {
    explorer: { subject: 'Confirma tu AI Readiness Scan — eres un Explorer', lead: 'Eres un Explorer. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.', cta: 'Confirmar y ver mi informe' },
    builder: { subject: 'Confirma tu AI Readiness Scan — eres un Builder', lead: 'Eres un Builder. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.', cta: 'Confirmar y ver mi informe' },
    operator: { subject: 'Confirma tu AI Readiness Scan — eres un Operator', lead: 'Eres un Operator. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.', cta: 'Confirmar y ver mi informe' },
  },
}

export function assessmentConfirmEmail(args: {
  locale: Locale
  persona: AssessmentPersona
  confirmUrl: string
}): { subject: string; html: string } {
  const copy = CONFIRM_COPY[args.locale][args.persona]
  const html = `
<!doctype html>
<html><body style="margin:0;padding:24px;background:#0a0d14;color:#e8ecf4;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr><td style="padding:32px;background:#111520;border:1px solid #1a1f2e;border-radius:16px;">
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#e8ecf4;">${escape(copy.lead)}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#9ba3b5;">
        ${args.locale === 'nl' ? 'Dit is je dubbele opt-in. Eén klik en het rapport landt in je inbox.' : args.locale === 'es' ? 'Este es tu doble opt-in. Un clic y el informe llega a tu bandeja.' : 'This is your double opt-in. One click and the report lands in your inbox.'}
      </p>
      <p style="margin:0 0 24px;">
        <a href="${escape(args.confirmUrl)}" style="display:inline-block;padding:14px 24px;background:#00d4aa;color:#0a0d14;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">${escape(copy.cta)}</a>
      </p>
      <p style="margin:0;font-size:12px;color:#8C98AD;">
        ${args.locale === 'nl' ? 'Heb je dit niet aangevraagd? Negeer dit bericht.' : args.locale === 'es' ? '¿No solicitaste esto? Ignora este correo.' : 'Did you not request this? Ignore this email.'}
      </p>
    </td></tr>
  </table>
</body></html>`
  return { subject: copy.subject, html }
}

// ─── Result email ───────────────────────────────────────────────────────

const PERSONA_BG: Record<AssessmentPersona, string> = {
  explorer: 'linear-gradient(135deg, #60a5fa 0%, #00d4aa 100%)',
  builder: 'linear-gradient(135deg, #00d4aa 0%, #f5a623 100%)',
  operator: 'linear-gradient(135deg, #f5a623 0%, #ef4444 60%, #a855f7 100%)',
}

const RESULT_SUBJECT: Record<Locale, Record<AssessmentPersona, string>> = {
  nl: {
    explorer: 'Je AI Readiness rapport — Explorer',
    builder: 'Je AI Readiness rapport — Builder',
    operator: 'Je AI Readiness rapport — Operator',
  },
  en: {
    explorer: 'Your AI Readiness report — Explorer',
    builder: 'Your AI Readiness report — Builder',
    operator: 'Your AI Readiness report — Operator',
  },
  es: {
    explorer: 'Tu informe AI Readiness — Explorer',
    builder: 'Tu informe AI Readiness — Builder',
    operator: 'Tu informe AI Readiness — Operator',
  },
}

const CATEGORY_LABELS: Record<Locale, Record<AssessmentCategory, string>> = {
  nl: {
    strategy: 'Strategie & Visie',
    data: 'Data & Inzichten',
    tools: 'Tools & Workflows',
    team: 'Team & Governance',
  },
  en: {
    strategy: 'Strategy & Vision',
    data: 'Data & Insights',
    tools: 'Tools & Workflows',
    team: 'Team & Governance',
  },
  es: {
    strategy: 'Estrategia y Visión',
    data: 'Datos e Insights',
    tools: 'Herramientas y Workflows',
    team: 'Equipo y Governance',
  },
}

const PERSONA_SUMMARY: Record<Locale, Record<AssessmentPersona, string>> = {
  nl: {
    explorer:
      'Je experimenteert met AI, maar mist een systeem. De grootste sprong zit in één centraal brein dat alle merken kent en alle vaardigheden orkestreert.',
    builder:
      'Werkende workflows, klaar voor opschaling. De grootste sprong zit in meer merken op dezelfde infrastructuur met diepere meting.',
    operator:
      'AI draait autonoom in je operatie. De volgende sprong zit in creatieve productie op schaal en cutting-edge formats die concurrenten niet hebben.',
  },
  en: {
    explorer:
      'You experiment with AI but a system is missing. The biggest leap is one central brain that knows every brand and orchestrates every skill.',
    builder:
      'Working workflows, ready to scale. The biggest leap is more brands on the same infrastructure with deeper measurement.',
    operator:
      'AI runs autonomously in your operation. The next leap is creative production at scale and cutting-edge formats your competitors do not have.',
  },
  es: {
    explorer:
      'Experimentas con AI, pero falta un sistema. El mayor salto está en un cerebro central que conoce cada marca y orquesta cada habilidad.',
    builder:
      'Workflows funcionando, listos para escalar. El mayor salto está en más marcas en la misma infraestructura con medición más profunda.',
    operator:
      'AI corre autónomamente en tu operación. El siguiente salto es producción creativa a escala y formatos cutting-edge que tus competidores no tienen.',
  },
}

const ROADMAP_STEPS: Record<Locale, Record<AssessmentPersona, [string, string, string, string]>> = {
  nl: {
    explorer: [
      'Stop met losse public-AI-tools per medewerker; kies één centraal startpunt',
      'Centraliseer brand voice, doelgroep en KPI\'s per merk in één kennisbank',
      'Pak één workflow (bijv. social posts) en maak hem systematisch met Clyde',
      'Meet één KPI per merk (tijdsbesparing of output-volume) en deel wekelijks',
    ],
    builder: [
      'Audit bestaande pipelines: waar leeft data, waar lekken handoffs?',
      'Voeg cross-skill datadeling toe (wat Clyde leert over X gebruikt hij bij Y)',
      'Schaal naar 2 extra merken op dezelfde infrastructuur',
      'Activeer wekelijkse performance-digest naar elke klant',
    ],
    operator: [
      'Audit vendor-afhankelijkheid; check EU-hosting en exit-pad per tool',
      'Introduceer 1 nieuw cutting-edge format (Voice Agent, Reel Builder, Ad Creator)',
      'Implementeer transparantie-disclosure naar klanten conform EU AI Act art. 50',
      'Meet AI-toegerekende omzet-uplift per klant en rapporteer maandelijks',
    ],
  },
  en: {
    explorer: [
      'Stop using disjointed public AI tools per employee; pick one central starting point',
      'Centralise brand voice, audience and KPIs per brand in one knowledge base',
      'Take one workflow (e.g. social posts) and systematise it with Clyde',
      'Measure one KPI per brand (time saved or output volume) and share weekly',
    ],
    builder: [
      'Audit existing pipelines: where does data live, where do handoffs leak?',
      'Add cross-skill data sharing (what Clyde learns about X he uses at Y)',
      'Scale to 2 additional brands on the same infrastructure',
      'Activate the weekly performance digest to every client',
    ],
    operator: [
      'Audit vendor dependency; check EU hosting and exit path per tool',
      'Introduce one new cutting-edge format (Voice Agent, Reel Builder, Ad Creator)',
      'Implement transparency disclosure to clients per EU AI Act art. 50',
      'Measure AI-attributed revenue uplift per client and report monthly',
    ],
  },
  es: {
    explorer: [
      'Deja de usar herramientas AI públicas dispersas por empleado; elige un punto central',
      'Centraliza brand voice, audiencia y KPIs por marca en una base de conocimiento',
      'Toma un workflow (por ejemplo, posts sociales) y sistematízalo con Clyde',
      'Mide un KPI por marca (tiempo ahorrado o volumen de output) y compártelo semanalmente',
    ],
    builder: [
      'Audita pipelines existentes: ¿dónde viven los datos, dónde se pierden los handoffs?',
      'Añade compartición cross-skill de datos (lo que Clyde aprende en X lo usa en Y)',
      'Escala a 2 marcas adicionales sobre la misma infraestructura',
      'Activa el digest semanal de rendimiento a cada cliente',
    ],
    operator: [
      'Audita dependencia de vendors; revisa hosting EU y vía de salida por herramienta',
      'Introduce un nuevo formato cutting-edge (Voice Agent, Reel Builder, Ad Creator)',
      'Implementa disclosure de transparencia a clientes según EU AI Act art. 50',
      'Mide el uplift de ingresos atribuible a AI por cliente y reporta mensualmente',
    ],
  },
}

const LABELS: Record<Locale, {
  scoresHeading: string
  roadmapHeading: string
  skillsHeading: string
  weekLabel: (n: number) => string
  cta: string
  totalLabel: string
  footnote: string
}> = {
  nl: {
    scoresHeading: 'Je scores per categorie',
    roadmapHeading: 'Je 4-week roadmap',
    skillsHeading: 'Drie Clyde-vaardigheden die de grootste sprong leveren',
    weekLabel: (n) => `Week ${n}`,
    cta: 'Plan een gesprek',
    totalLabel: 'Totaal',
    footnote: 'Vragen? Reply rechtstreeks op deze mail.',
  },
  en: {
    scoresHeading: 'Your scores per category',
    roadmapHeading: 'Your 4-week roadmap',
    skillsHeading: 'Three Clyde skills that move the needle most',
    weekLabel: (n) => `Week ${n}`,
    cta: 'Book a call',
    totalLabel: 'Total',
    footnote: 'Questions? Reply directly to this email.',
  },
  es: {
    scoresHeading: 'Tus puntuaciones por categoría',
    roadmapHeading: 'Tu roadmap de 4 semanas',
    skillsHeading: 'Tres habilidades Clyde que marcan la diferencia',
    weekLabel: (n) => `Semana ${n}`,
    cta: 'Agenda una llamada',
    totalLabel: 'Total',
    footnote: '¿Preguntas? Responde directamente a este correo.',
  },
}

function renderScoreBar(label: string, score: number, accent: string): string {
  const pct = Math.max(0, Math.min(100, score))
  return `
  <tr><td style="padding:8px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-bottom:6px;font-size:13px;color:#9ba3b5;">${escape(label)}</td>
        <td align="right" style="padding-bottom:6px;font-size:13px;color:#e8ecf4;font-weight:600;">${pct}/100</td>
      </tr>
      <tr><td colspan="2" style="background:#1a1f2e;border-radius:999px;overflow:hidden;height:8px;">
        <div style="width:${pct}%;background:${accent};height:8px;border-radius:999px;"></div>
      </td></tr>
    </table>
  </td></tr>`
}

export function assessmentResultEmail(args: {
  locale: Locale
  persona: AssessmentPersona
  scores: CategoryScores
  total: number
  lowestCategory: AssessmentCategory
  siteUrl: string
}): { subject: string; html: string } {
  const { locale, persona, scores, total, lowestCategory, siteUrl } = args
  const lab = LABELS[locale]
  const cats = CATEGORY_LABELS[locale]
  const summary = PERSONA_SUMMARY[locale][persona]
  const roadmap = ROADMAP_STEPS[locale][persona]
  const skills = getRecommendedSkills(persona, lowestCategory)
  const applyUrl = `${siteUrl}/${locale}/apply?utm_source=assessment&utm_medium=email&utm_content=${persona}`

  const personaName = persona.charAt(0).toUpperCase() + persona.slice(1)

  const scoreBars =
    renderScoreBar(cats.strategy, scores.strategy, '#00d4aa') +
    renderScoreBar(cats.data, scores.data, '#00d4aa') +
    renderScoreBar(cats.tools, scores.tools, '#f5a623') +
    renderScoreBar(cats.team, scores.team, '#f5a623') +
    renderScoreBar(lab.totalLabel, total, '#22c55e')

  const skillCards = skills
    .map((s) => `
      <tr><td style="padding:8px 0;">
        <a href="${escape(siteUrl)}/${escape(locale)}${escape(s.route)}?utm_source=assessment&utm_medium=email&utm_content=${escape(persona)}" style="display:block;padding:18px;background:#111520;border:1px solid #1a1f2e;border-radius:12px;text-decoration:none;color:#e8ecf4;">
          <div style="font-size:11px;font-weight:600;color:#00d4aa;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">${escape(s.serviceType)}</div>
          <div style="font-size:17px;font-weight:600;color:#e8ecf4;margin-bottom:4px;">${escape(s.name)}</div>
          <div style="font-size:13px;color:#9ba3b5;line-height:1.5;">${escape(s.shortDescription)}</div>
        </a>
      </td></tr>`)
    .join('')

  const roadmapList = roadmap
    .map((step, i) => `
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.55;color:#e8ecf4;">
        <span style="display:inline-block;min-width:64px;font-size:11px;font-weight:600;color:#f5a623;text-transform:uppercase;letter-spacing:0.08em;">${lab.weekLabel(i + 1)}</span>
        ${escape(step)}
      </td></tr>`)
    .join('')

  const html = `
<!doctype html>
<html><body style="margin:0;padding:24px;background:#0a0d14;color:#e8ecf4;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr><td style="padding:36px 32px;background:${PERSONA_BG[persona]};border-radius:16px 16px 0 0;text-align:center;">
      <div style="font-size:13px;font-weight:600;color:rgba(10,13,20,0.7);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">${escape(locale === 'nl' ? 'Je persona' : locale === 'es' ? 'Tu persona' : 'Your persona')}</div>
      <div style="font-size:44px;font-weight:900;color:#0a0d14;line-height:1.05;">${escape(personaName)}</div>
    </td></tr>

    <tr><td style="padding:24px 32px;background:#111520;border-left:1px solid #1a1f2e;border-right:1px solid #1a1f2e;">
      <p style="margin:0;font-size:15px;line-height:1.6;color:#e8ecf4;">${escape(summary)}</p>
    </td></tr>

    <tr><td style="padding:24px 32px;background:#111520;border-left:1px solid #1a1f2e;border-right:1px solid #1a1f2e;">
      <h2 style="margin:0 0 16px;font-size:17px;font-weight:700;color:#e8ecf4;">${escape(lab.scoresHeading)}</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${scoreBars}</table>
    </td></tr>

    <tr><td style="padding:24px 32px;background:#111520;border-left:1px solid #1a1f2e;border-right:1px solid #1a1f2e;">
      <h2 style="margin:0 0 16px;font-size:17px;font-weight:700;color:#e8ecf4;">${escape(lab.roadmapHeading)}</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${roadmapList}</table>
    </td></tr>

    <tr><td style="padding:24px 32px;background:#111520;border-left:1px solid #1a1f2e;border-right:1px solid #1a1f2e;">
      <h2 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#e8ecf4;">${escape(lab.skillsHeading)}</h2>
      <p style="margin:0 0 12px;font-size:13px;color:#9ba3b5;">${escape(locale === 'nl' ? 'Op basis van je laagste score (' + cats[lowestCategory] + ').' : locale === 'es' ? 'Basado en tu puntuación más baja (' + cats[lowestCategory] + ').' : 'Based on your lowest score (' + cats[lowestCategory] + ').')}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${skillCards}</table>
    </td></tr>

    <tr><td style="padding:32px;background:#111520;border:1px solid #1a1f2e;border-top:none;border-radius:0 0 16px 16px;text-align:center;">
      <a href="${escape(applyUrl)}" style="display:inline-block;padding:14px 28px;background:#00d4aa;color:#0a0d14;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">${escape(lab.cta)}</a>
      <p style="margin:20px 0 0;font-size:12px;color:#8C98AD;">${escape(lab.footnote)}</p>
    </td></tr>
  </table>
</body></html>`

  return { subject: RESULT_SUBJECT[locale][persona], html }
}
