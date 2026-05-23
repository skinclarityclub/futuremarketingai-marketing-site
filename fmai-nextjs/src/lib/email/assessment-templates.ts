/**
 * AI Readiness Assessment email templates — Archetype + Stage model.
 *
 * Two flavours:
 *   - assessmentConfirmEmail: double-opt-in confirmation. Subject names the
 *     archetype to bait the click.
 *   - assessmentResultEmail: the full report sent post-confirmation.
 *     Archetype card, stage badge, 4 per-category score bars, 3 recommended
 *     skills with deep links, 4-week roadmap, CTA → /apply (UTM-tagged).
 *
 * Inline HTML + inline CSS, same style as apply-templates.ts. No React
 * Email setup in this repo and no plans to add one for two templates.
 */

import type {
  Archetype,
  AssessmentCategory,
  CategoryScores,
  Stage,
} from '@/lib/assessment/types'
import { getRecommendedSkillsByArchetype } from '@/lib/assessment/skill-routing'

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Locale = 'nl' | 'en' | 'es'

// ─── Archetype display names ────────────────────────────────────────────

const ARCHETYPE_NAMES: Record<Locale, Record<Archetype, string>> = {
  nl: {
    'strategy-led': 'Strategie-bureau',
    'data-led': 'Data-bureau',
    'tooling-led': 'Workflow-bureau',
    'team-led': 'People-bureau',
    balanced: 'Allround-bureau',
  },
  en: {
    'strategy-led': 'Strategy Agency',
    'data-led': 'Data Agency',
    'tooling-led': 'Workflow Agency',
    'team-led': 'People Agency',
    balanced: 'Generalist Agency',
  },
  es: {
    'strategy-led': 'Agencia de Estrategia',
    'data-led': 'Agencia de Datos',
    'tooling-led': 'Agencia de Workflows',
    'team-led': 'Agencia de Personas',
    balanced: 'Agencia Generalista',
  },
}

const STAGE_NAMES: Record<Locale, Record<Stage, string>> = {
  nl: { emerging: 'Ontluikend', scaling: 'Groeiend', leading: 'Maatgevend' },
  en: { emerging: 'Emerging', scaling: 'Scaling', leading: 'Leading' },
  es: { emerging: 'Emergente', scaling: 'Creciendo', leading: 'Referente' },
}

// ─── Confirmation email ─────────────────────────────────────────────────

const CONFIRM_COPY: Record<Locale, Record<Archetype, { subject: string; lead: string; cta: string }>> = {
  nl: {
    'strategy-led': {
      subject: 'Bevestig je AI Readiness Scan — je bent een Strategie-bureau',
      lead: 'Je bent een Strategie-bureau. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.',
      cta: 'Bevestig en bekijk mijn rapport',
    },
    'data-led': {
      subject: 'Bevestig je AI Readiness Scan — je bent een Data-bureau',
      lead: 'Je bent een Data-bureau. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.',
      cta: 'Bevestig en bekijk mijn rapport',
    },
    'tooling-led': {
      subject: 'Bevestig je AI Readiness Scan — je bent een Workflow-bureau',
      lead: 'Je bent een Workflow-bureau. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.',
      cta: 'Bevestig en bekijk mijn rapport',
    },
    'team-led': {
      subject: 'Bevestig je AI Readiness Scan — je bent een People-bureau',
      lead: 'Je bent een People-bureau. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.',
      cta: 'Bevestig en bekijk mijn rapport',
    },
    balanced: {
      subject: 'Bevestig je AI Readiness Scan — je bent een Allround-bureau',
      lead: 'Je bent een Allround-bureau. Klik hieronder om je volledige actieplan en de 3 aanbevolen Clyde-vaardigheden te ontvangen.',
      cta: 'Bevestig en bekijk mijn rapport',
    },
  },
  en: {
    'strategy-led': {
      subject: 'Confirm your AI Readiness Scan — you are a Strategy Agency',
      lead: 'You are a Strategy Agency. Click below to receive your full action plan and the 3 recommended Clyde skills.',
      cta: 'Confirm and view my report',
    },
    'data-led': {
      subject: 'Confirm your AI Readiness Scan — you are a Data Agency',
      lead: 'You are a Data Agency. Click below to receive your full action plan and the 3 recommended Clyde skills.',
      cta: 'Confirm and view my report',
    },
    'tooling-led': {
      subject: 'Confirm your AI Readiness Scan — you are a Workflow Agency',
      lead: 'You are a Workflow Agency. Click below to receive your full action plan and the 3 recommended Clyde skills.',
      cta: 'Confirm and view my report',
    },
    'team-led': {
      subject: 'Confirm your AI Readiness Scan — you are a People Agency',
      lead: 'You are a People Agency. Click below to receive your full action plan and the 3 recommended Clyde skills.',
      cta: 'Confirm and view my report',
    },
    balanced: {
      subject: 'Confirm your AI Readiness Scan — you are a Generalist Agency',
      lead: 'You are a Generalist Agency. Click below to receive your full action plan and the 3 recommended Clyde skills.',
      cta: 'Confirm and view my report',
    },
  },
  es: {
    'strategy-led': {
      subject: 'Confirma tu AI Readiness Scan — eres una Agencia de Estrategia',
      lead: 'Eres una Agencia de Estrategia. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.',
      cta: 'Confirmar y ver mi informe',
    },
    'data-led': {
      subject: 'Confirma tu AI Readiness Scan — eres una Agencia de Datos',
      lead: 'Eres una Agencia de Datos. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.',
      cta: 'Confirmar y ver mi informe',
    },
    'tooling-led': {
      subject: 'Confirma tu AI Readiness Scan — eres una Agencia de Workflows',
      lead: 'Eres una Agencia de Workflows. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.',
      cta: 'Confirmar y ver mi informe',
    },
    'team-led': {
      subject: 'Confirma tu AI Readiness Scan — eres una Agencia de Personas',
      lead: 'Eres una Agencia de Personas. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.',
      cta: 'Confirmar y ver mi informe',
    },
    balanced: {
      subject: 'Confirma tu AI Readiness Scan — eres una Agencia Generalista',
      lead: 'Eres una Agencia Generalista. Haz clic para recibir tu plan de acción completo y las 3 habilidades Clyde recomendadas.',
      cta: 'Confirmar y ver mi informe',
    },
  },
}

export function assessmentConfirmEmail(args: {
  locale: Locale
  archetype: Archetype
  confirmUrl: string
}): { subject: string; html: string } {
  const copy = CONFIRM_COPY[args.locale][args.archetype]
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

const ARCHETYPE_BG: Record<Archetype, string> = {
  'strategy-led': 'linear-gradient(135deg, #60a5fa 0%, #00d4aa 100%)',
  'data-led': 'linear-gradient(135deg, #00d4aa 0%, #22c55e 100%)',
  'tooling-led': 'linear-gradient(135deg, #f5a623 0%, #ef4444 100%)',
  'team-led': 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
  balanced: 'linear-gradient(135deg, #f5a623 0%, #00d4aa 100%)',
}

const RESULT_SUBJECT: Record<Locale, Record<Archetype, string>> = {
  nl: {
    'strategy-led': 'Je AI Readiness rapport — Strategie-bureau',
    'data-led': 'Je AI Readiness rapport — Data-bureau',
    'tooling-led': 'Je AI Readiness rapport — Workflow-bureau',
    'team-led': 'Je AI Readiness rapport — People-bureau',
    balanced: 'Je AI Readiness rapport — Allround-bureau',
  },
  en: {
    'strategy-led': 'Your AI Readiness report — Strategy Agency',
    'data-led': 'Your AI Readiness report — Data Agency',
    'tooling-led': 'Your AI Readiness report — Workflow Agency',
    'team-led': 'Your AI Readiness report — People Agency',
    balanced: 'Your AI Readiness report — Generalist Agency',
  },
  es: {
    'strategy-led': 'Tu informe AI Readiness — Agencia de Estrategia',
    'data-led': 'Tu informe AI Readiness — Agencia de Datos',
    'tooling-led': 'Tu informe AI Readiness — Agencia de Workflows',
    'team-led': 'Tu informe AI Readiness — Agencia de Personas',
    balanced: 'Tu informe AI Readiness — Agencia Generalista',
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

const ARCHETYPE_SUMMARY: Record<Locale, Record<Archetype, string>> = {
  nl: {
    'strategy-led': 'Jouw bureau heeft de scherpste visie in de kamer. Wat je mist is een productiemotor die je ideeën omzet in live campagnes, zonder wekelijks handmatig doorsturen.',
    'data-led': 'Jouw bureau spreekt in cijfers, attributie en rendement. De volgende stap is de directe koppeling van die data aan je contentproductie, zodat inzicht automatisch stuurt wat er gemaakt wordt.',
    'tooling-led': 'Je bureau draait op AI-workflows en automatiseringen — meer dan de meeste concurrenten. De sprong die je nu kunt maken is van losse flows naar één centraal systeem dat alle merken kent en alle Clyde-vaardigheden aanstuurt.',
    'team-led': 'Jouw bureau heeft het sterkste menselijke vakmanschap van de vijf profielen. De kans zit in AI als krachtversterker voor je seniors: minder operationeel werk, meer creatieve sturing.',
    balanced: 'Je bureau heeft AI-kennis verspreid over strategie, data, tools en team — een zeldzame en sterke basis. De volgende stap is een helder profiel kiezen: bureaus met een herkenbare specialisatie trekken betere klanten aan.',
  },
  en: {
    'strategy-led': "Your agency has the sharpest vision in the room. What's missing is a production engine that turns your ideas into live campaigns without weekly manual handoffs.",
    'data-led': 'Your agency speaks in numbers, attribution and return. The next step is directly connecting that data to your content production so insights automatically steer what gets made.',
    'tooling-led': 'Your agency runs on AI workflows and automations — more than most competitors. The leap you can make now is from disconnected flows to one central system that knows all brands and orchestrates all Clyde skills.',
    'team-led': 'Your agency has the strongest human craft of the five profiles. The opportunity is AI as a force multiplier for your seniors: less operational work, more creative direction.',
    balanced: 'Your agency has AI knowledge spread across strategy, data, tools and team — a rare and strong foundation. The next step is picking a clear profile: agencies with a recognizable specialization attract better clients.',
  },
  es: {
    'strategy-led': 'Tu agencia tiene la visión más nítida de la sala. Lo que falta es un motor de producción que convierta tus ideas en campañas en vivo sin pasar por manos manualmente cada semana.',
    'data-led': 'Tu agencia habla en cifras, atribución y retorno. El siguiente paso es conectar directamente esos datos a tu producción de contenido para que los insights dirijan automáticamente lo que se crea.',
    'tooling-led': 'Tu agencia funciona con flujos de trabajo de IA y automatizaciones — más que la mayoría de los competidores. El salto que puedes dar ahora es de flujos desconectados a un sistema central que conoce todas las marcas y orquesta todas las habilidades de Clyde.',
    'team-led': 'Tu agencia tiene el oficio humano más fuerte de los cinco perfiles. La oportunidad está en usar la IA como multiplicador de fuerza para tus seniors: menos trabajo operativo, más dirección creativa.',
    balanced: 'Tu agencia tiene conocimiento de IA distribuido entre estrategia, datos, herramientas y equipo — una base rara y sólida. El siguiente paso es elegir un perfil claro: las agencias con una especialización reconocible atraen mejores clientes.',
  },
}

const ROADMAP_STEPS: Record<Locale, Record<Archetype, [string, string, string, string]>> = {
  nl: {
    'strategy-led': [
      'Maak de brief van één klant herbruikbaar in één AI-workflow. Strategie-kennis hoeft maar één keer ingevoerd te worden.',
      'Koppel je sterkste strategie-frameworks aan je content-pipelines. Zorg dat elke merkstem een AI-leesbaar doeldoc heeft.',
      'Schaal je best presterende strategie-template naar twee extra merken. Meet de output-tijdwinst per merk.',
      'Voeg meting toe: welke strategie-principes leveren aantoonbaar meer resultaat? Gebruik dat als positionering richting nieuwe klanten.',
    ],
    'data-led': [
      'Verbind één databron direct aan de briefing van volgende maand. Geen kopieer-plakwerk meer.',
      'Automatiseer de maandrapportage voor je twee drukste klanten. Geef de vrijgekomen tijd aan contentproductie.',
      'Koppel performance-data aan je content-planning: welke formats scoren het best per merk en per kanaal?',
      'Rapporteer AI-bijdrage per klant expliciet. Maak van jouw data-transparantie een concurrentievoordeel.',
    ],
    'tooling-led': [
      'Verbind één bestaande tool dieper aan één klant-merkdossier. Diepte werkt beter dan breedte.',
      'Audit welke flows handmatig worden gekopieerd voor elke nieuwe klant. Dat is je standaardisatiekans.',
      'Bouw de schaalbaarheidstest: kan je meest complexe workflow in 48 uur worden opgestart voor een nieuw merk?',
      'Voeg vendor-afhankelijkheidsaudit toe. Lijst je top-3 tools, check EU-hosting, documenteer exit-clausules.',
    ],
    'team-led': [
      'Identificeer één taak die je beste medewerker elke week minimaal twee uur kost. Dat is je eerste automatiseringstarget.',
      'Voer een adoptiemeting in: hoeveel teamleden gebruiken AI-tools minstens 3 keer per week?',
      'Maak je senior onboarding-kennis reproduceerbaar in een AI-systeem. Kwaliteit van één persoon wordt kwaliteit van het team.',
      'Test AI als co-creator naast je seniors: welke creatieve taken worden beter met AI als partner, niet als vervanger?',
    ],
    balanced: [
      'Vraag je drie beste klanten welk probleem jij beter oplost dan anderen. Dat antwoord vertelt je welk profiel je al hebt.',
      'Kies de categorie waar je bijna bovengemiddeld op scoort en investeer er dubbel in deze maand.',
      "Maak je profiel expliciet in één pitchdeck-slide: 'wij zijn een [profiel]-bureau' met drie concrete voorbeelden.",
      'Test welk profiel het beste resoneert bij de klanten die je wil aantrekken. Gebruik dit als positioneringstest voor je volgende vijf salesgesprekken.',
    ],
  },
  en: {
    'strategy-led': [
      "Make one client's brief automatically reusable in one AI workflow. Strategic knowledge only needs to be entered once.",
      'Connect your strongest strategy frameworks to your content pipelines. Ensure every brand voice has an AI-readable target doc.',
      'Scale your best-performing strategy template to two more brands. Measure output time savings per brand.',
      'Add measurement: which strategy principles demonstrably deliver more results? Use that as positioning for new clients.',
    ],
    'data-led': [
      "Connect one data source directly to next month's briefing. No more copy-pasting.",
      'Automate the monthly report for your two busiest clients. Put the freed time into content production.',
      'Connect performance data to your content planning: which formats score best per brand and per channel?',
      'Report AI contribution per client explicitly. Make your data transparency a competitive advantage.',
    ],
    'tooling-led': [
      'Connect one existing tool deeper to one client brand file. Depth beats breadth.',
      'Audit which flows are manually copied for each new client. That is your standardisation opportunity.',
      'Build the scalability test: can your most complex workflow be onboarded for a new brand in 48 hours?',
      'Add a vendor dependency audit. List your top-3 tools, check EU hosting, document exit clauses.',
    ],
    'team-led': [
      'Identify one task that costs your best team member at least two hours every week. That is your first automation target.',
      'Introduce adoption measurement: how many team members use AI tools at least 3 times per week?',
      "Make your senior onboarding knowledge reproducible in an AI system. One person's quality becomes the team's quality.",
      'Test AI as co-creator alongside your seniors: which creative tasks become better with AI as partner, not replacement?',
    ],
    balanced: [
      'Ask your three best clients what problem you solve better than anyone else. That answer tells you which profile you already have.',
      'Pick the category where you are almost above average and invest double this month.',
      "Make your profile explicit in one pitch deck slide: 'we are a [profile] agency' with three concrete examples.",
      'Test which profile resonates best with the clients you want to attract. Use this as a positioning test for your next five sales conversations.',
    ],
  },
  es: {
    'strategy-led': [
      'Haz que el brief de un cliente sea automáticamente reutilizable en un flujo de IA. El conocimiento estratégico solo necesita introducirse una vez.',
      'Conecta tus frameworks de estrategia más sólidos a tus pipelines de contenido. Asegúrate de que cada voz de marca tenga un doc objetivo legible por IA.',
      'Escala tu mejor plantilla de estrategia a dos marcas más. Mide el ahorro de tiempo de output por marca.',
      '¿Qué principios de estrategia entregan resultados demostrablemente mejores? Úsalo como posicionamiento para nuevos clientes.',
    ],
    'data-led': [
      "Conecta una fuente de datos directamente al briefing del próximo mes. Sin más copiar y pegar.",
      'Automatiza el informe mensual de tus dos clientes más ocupados. Dedica el tiempo liberado a producción de contenido.',
      '¿Qué formatos funcionan mejor por marca y canal? Conecta los datos de rendimiento a tu planificación de contenido.',
      'Reporta la contribución de IA por cliente explícitamente. Convierte tu transparencia de datos en una ventaja competitiva.',
    ],
    'tooling-led': [
      'Conecta una herramienta existente más profundamente al expediente de marca de un cliente. La profundidad supera a la amplitud.',
      'Revisa qué flujos se copian manualmente para cada nuevo cliente. Esa es tu oportunidad de estandarización.',
      '¿Puede tu workflow más complejo iniciarse para una nueva marca en 48 horas? Construye el test de escalabilidad.',
      'Añade una auditoría de dependencia de vendors. Lista tus top-3 herramientas, comprueba hosting EU, documenta cláusulas de salida.',
    ],
    'team-led': [
      'Identifica una tarea que le cueste a tu mejor empleado al menos dos horas cada semana. Ese es tu primer objetivo de automatización.',
      '¿Cuántos miembros del equipo usan herramientas de IA al menos 3 veces por semana? Introduce medición de adopción.',
      'Haz reproducible el conocimiento de onboarding de tus seniors en un sistema de IA. La calidad de una persona se convierte en la calidad del equipo.',
      'Prueba la IA como co-creator junto a tus seniors: ¿qué tareas creativas mejoran con la IA como socio, no como sustituto?',
    ],
    balanced: [
      'Pregunta a tus tres mejores clientes qué problema resuelves mejor que nadie. Esa respuesta te dice qué perfil ya tienes.',
      'Elige la categoría donde casi estás por encima de la media e invierte el doble este mes.',
      "Haz tu perfil explícito en una diapositiva del pitch deck: 'somos una agencia de [perfil]' con tres ejemplos concretos.",
      'Prueba qué perfil resuena mejor con los clientes que quieres atraer. Úsalo como test de posicionamiento para tus próximas cinco conversaciones de ventas.',
    ],
  },
}

const LABELS: Record<Locale, {
  archetypeLabel: string
  stageLabel: string
  scoresHeading: string
  roadmapHeading: string
  skillsHeading: string
  weekLabel: (n: number) => string
  totalLabel: string
  footnote: string
}> = {
  nl: {
    archetypeLabel: 'Jouw type bureau',
    stageLabel: 'Volwassenheidsniveau',
    scoresHeading: 'Je scores per categorie',
    roadmapHeading: 'Je 4-week roadmap',
    skillsHeading: 'Drie Clyde-vaardigheden die de grootste sprong leveren',
    weekLabel: (n) => `Week ${n}`,
    totalLabel: 'Totaal',
    footnote: 'Vragen? Reply rechtstreeks op deze mail.',
  },
  en: {
    archetypeLabel: 'Your agency type',
    stageLabel: 'Maturity level',
    scoresHeading: 'Your scores per category',
    roadmapHeading: 'Your 4-week roadmap',
    skillsHeading: 'Three Clyde skills that move the needle most',
    weekLabel: (n) => `Week ${n}`,
    totalLabel: 'Total',
    footnote: 'Questions? Reply directly to this email.',
  },
  es: {
    archetypeLabel: 'Tu tipo de agencia',
    stageLabel: 'Nivel de madurez',
    scoresHeading: 'Tus puntuaciones por categoría',
    roadmapHeading: 'Tu roadmap de 4 semanas',
    skillsHeading: 'Tres habilidades Clyde que marcan la diferencia',
    weekLabel: (n) => `Semana ${n}`,
    totalLabel: 'Total',
    footnote: '¿Preguntas? Responde directamente a este correo.',
  },
}

const ARCHETYPE_CTA: Record<Locale, Record<Archetype, string>> = {
  nl: {
    'strategy-led': 'Bouw je productiemotor — Plan een gesprek',
    'data-led': 'Verbind data aan productie — Plan een gesprek',
    'tooling-led': 'Centraliseer je stack — Plan een gesprek',
    'team-led': 'Versterk je team met AI — Plan een gesprek',
    balanced: 'Kies je profiel — Plan een gesprek',
  },
  en: {
    'strategy-led': 'Build your production engine — Book a call',
    'data-led': 'Connect data to production — Book a call',
    'tooling-led': 'Centralise your stack — Book a call',
    'team-led': 'Empower your team with AI — Book a call',
    balanced: 'Define your profile — Book a call',
  },
  es: {
    'strategy-led': 'Construye tu motor de producción — Agenda una llamada',
    'data-led': 'Conecta datos a producción — Agenda una llamada',
    'tooling-led': 'Centraliza tu stack — Agenda una llamada',
    'team-led': 'Potencia tu equipo con IA — Agenda una llamada',
    balanced: 'Define tu perfil — Agenda una llamada',
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
  archetype: Archetype
  stage: Stage
  scores: CategoryScores
  total: number
  lowestCategory: AssessmentCategory
  siteUrl: string
}): { subject: string; html: string } {
  const { locale, archetype, stage, scores, total, lowestCategory, siteUrl } = args
  const lab = LABELS[locale]
  const cats = CATEGORY_LABELS[locale]
  const archetypeName = ARCHETYPE_NAMES[locale][archetype]
  const stageName = STAGE_NAMES[locale][stage]
  const summary = ARCHETYPE_SUMMARY[locale][archetype]
  const roadmap = ROADMAP_STEPS[locale][archetype]
  const skills = getRecommendedSkillsByArchetype(archetype, lowestCategory)
  const applyUrl = `${siteUrl}/${locale}/apply?utm_source=assessment&utm_medium=email&utm_content=${archetype}_${lowestCategory}`
  const archetypeCta = ARCHETYPE_CTA[locale][archetype]

  const scoreBars =
    renderScoreBar(cats.strategy, scores.strategy, '#00d4aa') +
    renderScoreBar(cats.data, scores.data, '#00d4aa') +
    renderScoreBar(cats.tools, scores.tools, '#f5a623') +
    renderScoreBar(cats.team, scores.team, '#f5a623') +
    renderScoreBar(lab.totalLabel, total, '#22c55e')

  const skillCards = skills
    .map((s) => `
      <tr><td style="padding:8px 0;">
        <a href="${escape(siteUrl)}/${escape(locale)}${escape(s.route)}?utm_source=assessment&utm_medium=email&utm_content=${escape(archetype)}" style="display:block;padding:18px;background:#111520;border:1px solid #1a1f2e;border-radius:12px;text-decoration:none;color:#e8ecf4;">
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
    <tr><td style="padding:36px 32px;background:${ARCHETYPE_BG[archetype]};border-radius:16px 16px 0 0;text-align:center;">
      <div style="font-size:13px;font-weight:600;color:rgba(10,13,20,0.7);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">${escape(lab.archetypeLabel)}</div>
      <div style="font-size:40px;font-weight:900;color:#0a0d14;line-height:1.1;margin-bottom:12px;">${escape(archetypeName)}</div>
      <div style="display:inline-block;padding:4px 14px;background:rgba(10,13,20,0.2);border-radius:999px;font-size:13px;font-weight:600;color:rgba(10,13,20,0.75);">${escape(lab.stageLabel)}: ${escape(stageName)}</div>
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
      <a href="${escape(applyUrl)}" style="display:inline-block;padding:14px 28px;background:#00d4aa;color:#0a0d14;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">${escape(archetypeCta)}</a>
      <p style="margin:20px 0 0;font-size:12px;color:#8C98AD;">${escape(lab.footnote)}</p>
    </td></tr>
  </table>
</body></html>`

  return { subject: RESULT_SUBJECT[locale][archetype], html }
}
