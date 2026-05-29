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
    'ad-creator': {
      shortDescription: 'Static and video ads for Meta. Publish A/B variants directly.',
      longDescription:
        'Ad Creator generates complete ads: from copy to visuals. AI produces static and video ads, optimises for different formats (Stories, Feed, Reels) and publishes straight to Meta Ads Manager. A/B test variants included.',
      features: [
        'AI-generated ad copy and visuals',
        'Static and video ad creation',
        'Multi-format output (Stories, Feed, Reels)',
        'Competitor ad library research',
        'Publish directly to Meta Ads',
        'A/B test variant generation',
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
      shortDescription: 'Website chatbot that qualifies leads and routes them to CRM or sales.',
      longDescription:
        'The Lead Qualifier puts an AI chatbot on your website that qualifies visitors, scores them based on intent and behaviour, and automatically routes warm leads to your CRM or sales team.',
      features: [
        'Embeddable AI chatbot for websites',
        'Automatic lead scoring',
        'CRM routing based on qualification',
        'Conversation analytics',
        'Custom qualification criteria per client',
      ],
    },
    'email-management': {
      shortDescription: 'Gmail inbox classification + smart labels + daily digest.',
      longDescription:
        'Email Management classifies your Gmail inbox automatically with AI, adds smart labels and generates a daily digest of important messages. Save hours per week on email management. Note: this is inbox classify, not email campaigns.',
      features: [
        'AI inbox classification (urgent, action, info)',
        'Smart labels and auto-categorisation',
        'Daily email digest',
        'Priority ranking of messages',
        'Suggested replies',
      ],
    },
    manychat: {
      shortDescription: 'Instagram DM keyword triggers + AI replies + lead capture.',
      longDescription:
        'ManyChat DM Automation replies automatically to Instagram DMs with AI-generated answers. Set keyword triggers, capture leads and route warm prospects to your CRM or sales team.',
      features: [
        'Keyword-based DM triggers',
        'AI-generated replies in the brand voice',
        'Lead capture and CRM routing',
        'Conversation flows with branching',
        'Performance analytics per trigger',
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
      shortDescription: 'The central AI employee that orchestrates all other skills.',
      longDescription:
        'Clyde is the central AI employee that drives all other skills. Give instructions in natural language and Clyde routes them to the right skill. Works via chat, Slack, Telegram and other channels. Has per-client memory and remembers earlier conversations, preferences and context.',
      features: [
        'Natural language instructions',
        'Orchestration of all other skills',
        'Multi-channel (chat, Slack, Telegram)',
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
    'ad-creator': {
      shortDescription: 'Anuncios estáticos y de vídeo para Meta. Publica variantes A/B directamente.',
      longDescription:
        'Ad Creator genera anuncios completos: del copy a los visuales. La IA crea anuncios estáticos y de vídeo, optimiza para distintos formatos (Stories, Feed, Reels) y publica directamente en Meta Ads Manager. Variantes de test A/B incluidas.',
      features: [
        'Copy y visuales de anuncios generados por IA',
        'Creación de anuncios estáticos y de vídeo',
        'Salida multiformato (Stories, Feed, Reels)',
        'Investigación de la biblioteca de anuncios de la competencia',
        'Publicación directa en Meta Ads',
        'Generación de variantes de test A/B',
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
      shortDescription: 'Chatbot web que califica leads y los enruta a CRM o ventas.',
      longDescription:
        'El Lead Qualifier coloca un chatbot de IA en tu web que califica a los visitantes, les asigna una puntuación según intención y comportamiento, y enruta automáticamente los leads cálidos a tu CRM o equipo de ventas.',
      features: [
        'Chatbot de IA integrable para webs',
        'Puntuación automática de leads',
        'Enrutamiento a CRM según calificación',
        'Analítica de conversaciones',
        'Criterios de calificación personalizados por cliente',
      ],
    },
    'email-management': {
      shortDescription: 'Clasificación de la bandeja de Gmail + etiquetas inteligentes + resumen diario.',
      longDescription:
        'Email Management clasifica tu bandeja de Gmail automáticamente con IA, añade etiquetas inteligentes y genera un resumen diario de los mensajes importantes. Ahorra horas por semana en gestión de email. Nota: es clasificación de bandeja, no campañas de email.',
      features: [
        'Clasificación de bandeja con IA (urgente, acción, info)',
        'Etiquetas inteligentes y autocategorización',
        'Resumen diario de email',
        'Priorización de mensajes',
        'Respuestas sugeridas',
      ],
    },
    manychat: {
      shortDescription: 'Triggers por palabra clave en DMs de Instagram + respuestas IA + captura de leads.',
      longDescription:
        'ManyChat DM Automation responde automáticamente a los DMs de Instagram con respuestas generadas por IA. Configura triggers por palabra clave, captura leads y enruta prospectos cálidos a tu CRM o equipo de ventas.',
      features: [
        'Triggers de DM por palabra clave',
        'Respuestas generadas por IA con la voz de marca',
        'Captura de leads y enrutamiento a CRM',
        'Flujos de conversación con ramificación',
        'Analítica de rendimiento por trigger',
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
      shortDescription: 'El empleado de IA central que orquesta todas las demás habilidades.',
      longDescription:
        'Clyde es el empleado de IA central que dirige todas las demás habilidades. Da instrucciones en lenguaje natural y Clyde las enruta a la habilidad adecuada. Funciona vía chat, Slack, Telegram y otros canales. Tiene memoria por cliente y recuerda conversaciones, preferencias y contexto previos.',
      features: [
        'Instrucciones en lenguaje natural',
        'Orquestación de todas las demás habilidades',
        'Multicanal (chat, Slack, Telegram)',
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
