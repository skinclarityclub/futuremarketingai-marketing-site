/**
 * Locale-aware skill copy for the Clyde chatbot.
 *
 * WHY: `SKILLS_DATA` (src/lib/skills-data.ts) mirrors the fma-app pricing SSoT
 * and is authored in NL only. The chatbot's `get_skills` tool feeds those
 * descriptions into the sidebar ServiceCard, so on /en and /es the card used to
 * render Dutch text. This module overlays EN/ES translations of the text fields
 * (short/long description + features) keyed by skill id. Names, routes and
 * status stay locale-neutral and come straight from SKILLS_DATA.
 *
 * NL is the source of truth: it is read from SKILLS_DATA, never duplicated here.
 * Any id missing from the EN/ES overlay falls back to the NL source, so adding a
 * skill never silently breaks — it just shows NL until translated.
 */

import { SKILLS_DATA, type SkillStatus } from '@/lib/skills-data'
import type { ChatbotLocale } from '@/lib/chatbot/tool-data'

export interface ChatbotSkill {
  id: string
  name: string
  route: string
  status: SkillStatus
  shortDescription: string
  longDescription: string
  features: string[]
}

interface SkillText {
  shortDescription: string
  longDescription: string
  features: string[]
}

/** EN/ES overlays keyed by skill id. NL is sourced from SKILLS_DATA. */
const SKILL_TEXT: Record<'en' | 'es', Record<string, SkillText>> = {
  en: {
    'social-media': {
      shortDescription:
        'Captions, scheduling, carousels and engagement, per brand in the right brand voice.',
      longDescription:
        'The Social Media Manager runs the full content process from idea to publication. AI analyses trending topics, writes captions in the right brand voice, schedules posts at optimal times and tracks engagement metrics. Works for Instagram, Facebook and LinkedIn.',
      features: [
        'AI-generated captions in the brand voice',
        'Multi-platform scheduling with optimal timing',
        'Content calendar with drag & drop',
        'Engagement tracking per post',
        'Carousel and story builder',
        'Hashtag research and optimisation',
      ],
    },
    'blog-factory': {
      shortDescription: 'Longform SEO articles from keyword research to automatic publishing.',
      longDescription:
        'Blog Factory produces SEO-optimised longform articles from research to publication. Keyword research, writing in the brand voice, meta descriptions, heading structure, internal links: all automatic. Output 1,500 to 3,000 words, publish-ready.',
      features: [
        'Keyword research and topic clustering',
        'Longform articles (1,500-3,000 words)',
        'SEO optimisation (meta, headings, internal links)',
        'Automatic publishing to your site',
        'Consistency in brand voice',
      ],
    },
    'ad-manager': {
      shortDescription: 'Create ads and steer them: publish to Meta and track leads, cost per lead and ad fatigue per ad.',
      longDescription:
        'Ad Manager builds complete ads (copy, static visuals and video) and publishes them straight to Meta Ads Manager. From there Clyde steers on results: per-ad performance, leads and cost per lead, ranking and ad-fatigue signals, plus A/B variants. All in plain language, even if you are not an ads expert.',
      features: [
        'AI-generated ad copy, static visuals and video ads',
        'Publish directly to Meta Ads Manager',
        'Per-ad performance: leads, cost per lead and ROAS',
        'Ad-fatigue and ranking signals with plain-language recommendations',
        'Generate and compare A/B variants',
        'Competitor research in the Meta Ad Library',
      ],
    },
    'reel-builder': {
      shortDescription:
        'Short vertical videos with captions, music and transitions for Reels, TikTok and Shorts.',
      longDescription:
        'Reel Builder creates short vertical videos (9:16) with AI: including captions, music and transitions. Ideal for Instagram Reels, TikTok and YouTube Shorts. From script to publish-ready video.',
      features: [
        'AI-generated video scripts',
        'Automatic caption generation',
        'Music selection and timing',
        'Vertical format (9:16) optimisation',
        'Template library for fast creation',
      ],
    },
    'voice-agent': {
      shortDescription: 'Inbound and outbound AI calls: appointments, FAQ, escalation.',
      longDescription:
        'The Voice Agent handles phone traffic with AI, both inbound and outbound. Books appointments, answers FAQs, logs calls and escalates to a human when needed. Fully customisable per client (voice, personality, knowledge base).',
      features: [
        'Inbound and outbound AI phone calls',
        'Automatic appointment booking',
        'FAQ answering in natural language',
        'Call logging and transcripts',
        'Escalation to a human agent',
        'Campaign management for outbound calls',
      ],
    },
    'lead-qualifier': {
      shortDescription: 'Website chatbot that scores leads and sends them to your CRM via a webhook.',
      longDescription:
        'The Lead Qualifier puts an AI chatbot on your website that qualifies visitors, gives every lead a score on profile, intent and conversation quality, and sends the lead via a webhook to the CRM you already use.',
      features: [
        'Embeddable AI chatbot for websites',
        'Automatic lead scoring',
        'Leads to your CRM via a webhook',
        'Conversations and leads searchable per chatbot',
        'Custom qualification criteria per client',
      ],
    },
    'email-management': {
      shortDescription: 'Inbox classification for Gmail and Outlook, with labels and draft replies.',
      longDescription:
        'Email Management classifies your Gmail or Outlook inbox with AI: categories per client, an urgency per email, status labels and draft replies that are sent only after approval. Every morning you see what came in. Note: this is inbox classification, not email campaigns.',
      features: [
        'AI classification into categories per client',
        'Smart labels and auto-categorisation',
        'A daily note of what came in',
        'Urgency per email (1 to 5)',
        'Draft replies, sent after approval',
      ],
    },
    manychat: {
      shortDescription: 'Instagram DMs with keyword triggers, AI drafts and lead capture.',
      longDescription:
        'ManyChat DM answers Instagram DMs, comments and story replies with keyword triggers: whoever sends the keyword gets the reply you set, with a link. For other messages Clyde writes a draft in the brand voice, and everyone who responds lands in your lead list.',
      features: [
        'Keyword-based DM triggers',
        'AI drafts in the brand voice',
        'Lead capture in your lead list',
        'Replies to comments, DMs and story replies',
        'Every reply logged',
      ],
    },
    reporting: {
      shortDescription: 'Dashboards + weekly digests + anomaly detection per client.',
      longDescription:
        'Reporting & Analytics delivers automatic dashboards, weekly digests and real-time KPI tracking. The system detects anomalies in your data and proactively alerts you when metrics deviate.',
      features: [
        'Automatic weekly performance digests',
        'Real-time KPI dashboards',
        'Anomaly detection with alerts',
        'Cross-platform analytics (social, web, sales)',
        'Custom report generation',
      ],
    },
    'seo-geo': {
      shortDescription: 'SEO audits + keyword tracking + Core Web Vitals + AI citation monitoring.',
      longDescription:
        'The SEO/GEO Analyst runs automatic SEO audits, tracks keyword rankings, monitors Core Web Vitals and keeps track of how often your brand is cited by AI search engines (ChatGPT, Perplexity, Google AI Overviews). Actionable fixes by priority.',
      features: [
        'Automatic technical SEO audits',
        'Keyword ranking tracking',
        'Core Web Vitals monitoring',
        'AI citation monitoring (GEO)',
        'Competitor keyword analysis',
        'Prioritised fix recommendations',
      ],
    },
    research: {
      shortDescription: 'Market research + trend monitoring + competitor analysis with citations.',
      longDescription:
        'The Research skill continuously runs market research, monitors trends in your niche and analyses competitors. AI searches sources, summarises insights and delivers usable recommendations straight to your dashboard, with a citation for every insight.',
      features: [
        'Automated market research',
        'Trend monitoring in your niche',
        'Competitor analysis with benchmarks',
        'Actionable insights and recommendations',
        'A citation for every insight',
      ],
    },
    clyde: {
      shortDescription: 'The AI colleague that orchestrates all other skills.',
      longDescription:
        'Clyde is the AI colleague that drives all other skills. Give instructions in natural language and Clyde routes them to the right skill. Works in the dashboard, on WhatsApp and via Telegram. Has per-client memory and remembers earlier conversations, preferences and context.',
      features: [
        'Natural language instructions',
        'Orchestration of all other skills',
        'In every screen of the dashboard and on WhatsApp',
        'Memory and context per client',
        'Knowledge base with search',
        'Routines and recurring tasks',
      ],
    },
  },
  es: {
    'social-media': {
      shortDescription:
        'Captions, programación, carruseles y engagement, por marca y con la voz de marca correcta.',
      longDescription:
        'El Social Media Manager gestiona todo el proceso de contenido, de la idea a la publicación. La IA analiza temas en tendencia, genera captions con la voz de marca correcta, programa publicaciones en los momentos óptimos y sigue las métricas de engagement. Apto para Instagram, Facebook y LinkedIn.',
      features: [
        'Captions generados por IA con la voz de marca',
        'Programación multiplataforma con timing óptimo',
        'Calendario de contenido con arrastrar y soltar',
        'Seguimiento de engagement por publicación',
        'Creador de carruseles e historias',
        'Investigación y optimización de hashtags',
      ],
    },
    'blog-factory': {
      shortDescription:
        'Artículos SEO de formato largo, desde la investigación de keywords hasta la publicación automática.',
      longDescription:
        'Blog Factory produce artículos SEO de formato largo, de la investigación a la publicación. Investigación de keywords, redacción con la voz de marca, meta descripciones, estructura de encabezados, enlaces internos: todo automático. Salida de 1.500 a 3.000 palabras, lista para publicar.',
      features: [
        'Investigación de keywords y agrupación de temas',
        'Artículos de formato largo (1.500-3.000 palabras)',
        'Optimización SEO (meta, encabezados, enlaces internos)',
        'Publicación automática en tu web',
        'Consistencia en la voz de marca',
      ],
    },
    'ad-manager': {
      shortDescription: 'Crea anuncios y gestiónalos: publica en Meta y sigue leads, coste por lead y fatiga por anuncio.',
      longDescription:
        'Ad Manager crea anuncios completos (copy, visuales estáticos y vídeo) y los publica directamente en Meta Ads Manager. A partir de ahí Clyde dirige por resultados: rendimiento por anuncio, leads y coste por lead, señales de ranking y fatiga publicitaria, además de variantes A/B. Todo en lenguaje claro, también para quien no es experto en anuncios.',
      features: [
        'Copy, visuales estáticos y anuncios de vídeo generados por IA',
        'Publicación directa en Meta Ads Manager',
        'Rendimiento por anuncio: leads, coste por lead y ROAS',
        'Señales de fatiga y ranking con recomendaciones en lenguaje claro',
        'Generar y comparar variantes A/B',
        'Investigación de competencia en la Meta Ad Library',
      ],
    },
    'reel-builder': {
      shortDescription:
        'Vídeos verticales cortos con captions, música y transiciones para Reels, TikTok y Shorts.',
      longDescription:
        'Reel Builder crea vídeos verticales cortos (9:16) con IA: incluye captions, música y transiciones. Ideal para Instagram Reels, TikTok y YouTube Shorts. Del guion al vídeo listo para publicar.',
      features: [
        'Guiones de vídeo generados por IA',
        'Generación automática de captions',
        'Selección de música y timing',
        'Optimización de formato vertical (9:16)',
        'Biblioteca de plantillas para crear rápido',
      ],
    },
    'voice-agent': {
      shortDescription: 'Llamadas de IA entrantes y salientes: citas, FAQ, escalado.',
      longDescription:
        'El Voice Agent gestiona el tráfico telefónico con IA, tanto entrante como saliente. Reserva citas, responde FAQs, registra llamadas y escala a una persona cuando hace falta. Totalmente personalizable por cliente (voz, personalidad, base de conocimiento).',
      features: [
        'Llamadas de IA entrantes y salientes',
        'Reserva automática de citas',
        'Respuesta de FAQ en lenguaje natural',
        'Registro y transcripción de llamadas',
        'Escalado a un agente humano',
        'Gestión de campañas para llamadas salientes',
      ],
    },
    'lead-qualifier': {
      shortDescription: 'Chatbot web que puntúa leads y los envía a tu CRM mediante un webhook.',
      longDescription:
        'El Lead Qualifier coloca un chatbot de IA en tu web que califica a los visitantes, da a cada lead una puntuación según perfil, intención y calidad de la conversación, y envía el lead mediante un webhook al CRM que ya usas.',
      features: [
        'Chatbot de IA integrable para webs',
        'Puntuación automática de leads',
        'Leads a tu CRM mediante un webhook',
        'Conversaciones y leads consultables por chatbot',
        'Criterios de calificación personalizados por cliente',
      ],
    },
    'email-management': {
      shortDescription: 'Clasificación de la bandeja de Gmail y Outlook, con etiquetas y borradores de respuesta.',
      longDescription:
        'Email Management clasifica tu bandeja de Gmail u Outlook con IA: categorías por cliente, una urgencia por email, etiquetas de estado y borradores de respuesta que solo se envían tras tu aprobación. Cada mañana ves lo que ha entrado. Nota: es clasificación de bandeja, no campañas de email.',
      features: [
        'Clasificación con IA en categorías por cliente',
        'Etiquetas inteligentes y autocategorización',
        'Un aviso diario de lo que ha entrado',
        'Urgencia por email (1 a 5)',
        'Borradores de respuesta, enviados tras aprobación',
      ],
    },
    manychat: {
      shortDescription: 'DMs de Instagram con triggers por palabra clave, borradores de IA y captura de leads.',
      longDescription:
        'ManyChat DM responde a DMs, comentarios y respuestas a historias de Instagram con triggers por palabra clave: quien envía la palabra clave recibe la respuesta que tú fijas, con un enlace. Para otros mensajes Clyde escribe un borrador con la voz de marca, y quien responde entra en tu lista de leads.',
      features: [
        'Triggers de DM por palabra clave',
        'Borradores de IA con la voz de marca',
        'Captura de leads en tu lista de leads',
        'Respuestas a comentarios, DMs y respuestas a historias',
        'Cada respuesta registrada',
      ],
    },
    reporting: {
      shortDescription: 'Dashboards + resúmenes semanales + detección de anomalías por cliente.',
      longDescription:
        'Reporting & Analytics ofrece dashboards automáticos, resúmenes semanales y seguimiento de KPIs en tiempo real. El sistema detecta anomalías en tus datos y avisa de forma proactiva cuando las métricas se desvían.',
      features: [
        'Resúmenes de rendimiento semanales automáticos',
        'Dashboards de KPIs en tiempo real',
        'Detección de anomalías con alertas',
        'Analítica multiplataforma (social, web, ventas)',
        'Generación de informes personalizados',
      ],
    },
    'seo-geo': {
      shortDescription:
        'Auditorías SEO + seguimiento de keywords + Core Web Vitals + monitorización de citas de IA.',
      longDescription:
        'El SEO/GEO Analyst realiza auditorías SEO automáticas, rastrea posiciones de keywords, monitoriza los Core Web Vitals y sigue con qué frecuencia citan tu marca los buscadores de IA (ChatGPT, Perplexity, Google AI Overviews). Correcciones accionables por prioridad.',
      features: [
        'Auditorías SEO técnicas automáticas',
        'Seguimiento de posiciones de keywords',
        'Monitorización de Core Web Vitals',
        'Monitorización de citas de IA (GEO)',
        'Análisis de keywords de la competencia',
        'Recomendaciones de correcciones priorizadas',
      ],
    },
    research: {
      shortDescription: 'Investigación de mercado + monitorización de tendencias + análisis de competencia con fuentes.',
      longDescription:
        'La habilidad Research realiza investigación de mercado continua, monitoriza tendencias en tu nicho y analiza competidores. La IA rastrea fuentes, resume insights y entrega recomendaciones útiles directamente en tu dashboard, con una fuente en cada insight.',
      features: [
        'Investigación de mercado automatizada',
        'Monitorización de tendencias en tu nicho',
        'Análisis de competencia con benchmarks',
        'Insights y recomendaciones accionables',
        'Una fuente en cada insight',
      ],
    },
    clyde: {
      shortDescription: 'El compañero de IA que orquesta todas las demás habilidades.',
      longDescription:
        'Clyde es el compañero de IA que dirige todas las demás habilidades. Da instrucciones en lenguaje natural y Clyde las enruta a la habilidad adecuada. Funciona en el dashboard, en WhatsApp y vía Telegram. Tiene memoria por cliente y recuerda conversaciones, preferencias y contexto previos.',
      features: [
        'Instrucciones en lenguaje natural',
        'Orquestación de todas las demás habilidades',
        'En cada pantalla del dashboard y en WhatsApp',
        'Memoria y contexto por cliente',
        'Base de conocimiento con búsqueda',
        'Rutinas y tareas recurrentes',
      ],
    },
  },
}

/** Overview-card chrome: title + "N live · M coming soon" subtitle. */
const OVERVIEW_COPY: Record<ChatbotLocale, { name: string; summary: (live: number, soon: number) => string }> = {
  nl: { name: 'Alle vaardigheden', summary: (l, s) => `${l} live · ${s} binnenkort beschikbaar` },
  en: { name: 'All skills', summary: (l, s) => `${l} live · ${s} coming soon` },
  es: { name: 'Todas las habilidades', summary: (l, s) => `${l} activas · ${s} próximamente` },
}

/**
 * Full skill list in the visitor's locale. NL comes from SKILLS_DATA; EN/ES
 * overlay the text fields, falling back to NL per field if an id is untranslated.
 */
export function getChatbotSkills(locale: ChatbotLocale): ChatbotSkill[] {
  return SKILLS_DATA.map((s) => {
    const overlay = locale === 'nl' ? undefined : SKILL_TEXT[locale]?.[s.id]
    return {
      id: s.id,
      name: s.name,
      route: s.route,
      status: s.status,
      shortDescription: overlay?.shortDescription ?? s.shortDescription,
      longDescription: overlay?.longDescription ?? s.longDescription,
      features: overlay?.features ?? [...s.features],
    }
  })
}

export function getChatbotSkill(locale: ChatbotLocale, id: string): ChatbotSkill | undefined {
  return getChatbotSkills(locale).find((s) => s.id === id)
}

export function getSkillsOverviewCopy(locale: ChatbotLocale) {
  return OVERVIEW_COPY[locale] ?? OVERVIEW_COPY.nl
}
