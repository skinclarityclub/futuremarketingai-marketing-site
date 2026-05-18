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
  operator: 'linear-gradient(135deg, #f5a623 0%, #ef4444 100%)',
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
      'Inventariseer welke AI-tools nu gebruikt worden en door wie. Documenteer 1 centrale plek waar alle tools en hun toegang staan.',
      'Schrijf voor 1 merk de brand voice, doelgroep en 3 KPI\'s op één pagina. Maak dit doc leesbaar voor je AI-stack.',
      'Pak één workflow (bijvoorbeeld social posts voor merk X) en systematiseer hem volledig met Clyde.',
      'Meet 1 KPI per merk (uren bespaard of output-volume) en deel met je team in een wekelijkse digest.',
    ],
    builder: [
      'Lijst je 5 belangrijkste pipelines. Per pipeline: identificeer 1 handoff waar context verloren gaat.',
      'Activeer cross-skill datadeling: zorg dat brand voice + persona-doc uit research direct in social en blog beschikbaar zijn.',
      'Schaal 1 succesvolle workflow naar 2 extra merken zonder aparte setup-tijd per merk.',
      'Lever 1 klant deze maand een wekelijkse performance-digest met AI-bijdrage benoemd.',
    ],
    operator: [
      'Audit vendor-afhankelijkheid: lijst je top-3 AI-tools, check EU-hosting en documenteer exit-clausules per leverancier.',
      'Test 1 cutting-edge format (Voice Agent, Reel Builder of Ad Creator) bij 1 willekeurige klant en meet 1 KPI.',
      'Communiceer per klant welke onderdelen van hun campagne AI-gestuurd zijn (gewoon zichtbaar in de rapportage).',
      'Rapporteer AI-toegerekende omzet-uplift per klant aan je leadership. Maak hier je nieuwe pricing-argument van.',
    ],
  },
  en: {
    explorer: [
      'Inventory which AI tools are used today and by whom. Document one central location for all tools and their access.',
      'For one brand, write the brand voice, audience and 3 KPIs on a single page. Make this doc readable to your AI stack.',
      'Take one workflow (e.g. social posts for brand X) and systematise it end-to-end with Clyde.',
      'Measure one KPI per brand (hours saved or output volume) and share with your team in a weekly digest.',
    ],
    builder: [
      'List your 5 most important pipelines. Per pipeline, identify one handoff where context leaks today.',
      'Activate cross-skill data sharing: ensure brand voice + persona docs from research land directly in social and blog.',
      'Scale one successful workflow to 2 additional brands without extra setup time per brand.',
      'Deliver one client this month a weekly performance digest that calls out AI contribution explicitly.',
    ],
    operator: [
      'Audit vendor dependency: list your top-3 AI tools, check EU hosting and document exit clauses per vendor.',
      'Test one cutting-edge format (Voice Agent, Reel Builder or Ad Creator) with one client and measure one KPI.',
      'Communicate per client which parts of their campaign are AI-driven (visible right in the report).',
      'Report AI-attributed revenue uplift per client to your leadership. Turn this into your new pricing argument.',
    ],
  },
  es: {
    explorer: [
      'Inventaria qué herramientas AI se usan hoy y por quién. Documenta un lugar central con todas las herramientas y sus accesos.',
      'Para una marca, escribe brand voice, audiencia y 3 KPIs en una sola página. Hazlo legible para tu stack AI.',
      'Coge un workflow (por ejemplo posts sociales de la marca X) y sistematízalo end-to-end con Clyde.',
      'Mide un KPI por marca (horas ahorradas o volumen de output) y compártelo en un digest semanal con el equipo.',
    ],
    builder: [
      'Lista tus 5 pipelines más importantes. Por pipeline, identifica un handoff donde el contexto se pierde hoy.',
      'Activa la compartición de datos cross-skill: brand voice + docs de persona del research deben aterrizar directo en social y blog.',
      'Escala un workflow exitoso a 2 marcas adicionales sin tiempo de setup extra por marca.',
      'Entrega a un cliente este mes un digest semanal de rendimiento que destaque explícitamente la contribución AI.',
    ],
    operator: [
      'Revisa dependencia de vendors: lista tus top-3 herramientas AI, comprueba hosting EU y documenta cláusulas de salida por proveedor.',
      'Prueba un formato cutting-edge (Voice Agent, Reel Builder o Ad Creator) con un cliente y mide un KPI.',
      'Comunica por cliente qué partes de su campaña son AI-driven (visible directamente en el reporte).',
      'Reporta a tu leadership el uplift de ingresos atribuible a AI por cliente. Conviértelo en tu nuevo argumento de pricing.',
    ],
  },
}

const LABELS: Record<Locale, {
  scoresHeading: string
  roadmapHeading: string
  skillsHeading: string
  weekLabel: (n: number) => string
  totalLabel: string
  footnote: string
}> = {
  nl: {
    scoresHeading: 'Je scores per categorie',
    roadmapHeading: 'Je 4-week roadmap',
    skillsHeading: 'Drie Clyde-vaardigheden die de grootste sprong leveren',
    weekLabel: (n) => `Week ${n}`,
    totalLabel: 'Totaal',
    footnote: 'Vragen? Reply rechtstreeks op deze mail.',
  },
  en: {
    scoresHeading: 'Your scores per category',
    roadmapHeading: 'Your 4-week roadmap',
    skillsHeading: 'Three Clyde skills that move the needle most',
    weekLabel: (n) => `Week ${n}`,
    totalLabel: 'Total',
    footnote: 'Questions? Reply directly to this email.',
  },
  es: {
    scoresHeading: 'Tus puntuaciones por categoría',
    roadmapHeading: 'Tu roadmap de 4 semanas',
    skillsHeading: 'Tres habilidades Clyde que marcan la diferencia',
    weekLabel: (n) => `Semana ${n}`,
    totalLabel: 'Total',
    footnote: '¿Preguntas? Responde directamente a este correo.',
  },
}

const PERSONA_CTA: Record<Locale, Record<AssessmentPersona, string>> = {
  nl: {
    explorer: 'Bouw je centraal brein — Plan een gesprek',
    builder: 'Schaal mee — Plan een gesprek',
    operator: 'Ga cutting-edge — Plan een gesprek',
  },
  en: {
    explorer: 'Build your central brain — Book a call',
    builder: 'Scale up — Book a call',
    operator: 'Go cutting-edge — Book a call',
  },
  es: {
    explorer: 'Construye tu cerebro central — Agenda una llamada',
    builder: 'Escala con nosotros — Agenda una llamada',
    operator: 'Avanza al siguiente nivel — Agenda una llamada',
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
  const applyUrl = `${siteUrl}/${locale}/apply?utm_source=assessment&utm_medium=email&utm_content=${persona}_${lowestCategory}`
  const personaCta = PERSONA_CTA[locale][persona]

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
      <a href="${escape(applyUrl)}" style="display:inline-block;padding:14px 28px;background:#00d4aa;color:#0a0d14;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">${escape(personaCta)}</a>
      <p style="margin:20px 0 0;font-size:12px;color:#8C98AD;">${escape(lab.footnote)}</p>
    </td></tr>
  </table>
</body></html>`

  return { subject: RESULT_SUBJECT[locale][persona], html }
}
