/**
 * Locale-aware skill copy for the Clyde chatbot.
 *
 * WHY: `SKILLS_DATA` (src/lib/skills-data.ts) mirrors the fma-app pricing SSoT
 * and is authored in NL only. The chatbot's `get_skills` tool feeds those
 * descriptions into the ServiceCard, so on /en and /es the card used to
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
        'Captions, content calendar, carousels and performance per post, per brand in the right brand voice.',
      longDescription:
        'The Social Media Manager runs the content process from idea to publication: captions in the brand voice, a content calendar per account, carousels in the house style and performance per post. Publishes to Instagram and LinkedIn after approval; other networks via Postiz on request.',
      features: [
        'AI-generated captions in the brand voice',
        'Scheduling for Instagram and LinkedIn',
        'Content calendar with drag & drop',
        'Engagement tracking per post',
        'Carousels in the house style',
        'Hashtag strategy per brand',
      ],
    },
    'blog-factory': {
      shortDescription: 'SEO articles from keyword research to publication after approval.',
      longDescription:
        'Blog Factory writes SEO articles from research to publication: keyword research, writing in the brand voice, meta description, heading structure and internal links. The length follows the search intent and the pages that already rank. Published after approval.',
      features: [
        'Keyword research and topic clustering',
        'Length that follows the search intent',
        'SEO optimisation (meta, headings, internal links)',
        'Publishing after approval',
        'Consistency in brand voice',
      ],
    },
    'ad-manager': {
      shortDescription: 'Create and track ads: queued for Meta, with conversions, ROAS and ad fatigue per ad.',
      longDescription:
        'Ad Manager builds complete ads (copy, static visuals and video) and queues them for Meta Ads Manager; an ad only goes live after your approval. After that Clyde tracks every ad: reach, clicks, conversions, ROAS and ad fatigue, plus variants to test. All in plain language, even if you are not an ads expert.',
      features: [
        'AI-generated ad copy, static visuals and video ads',
        'Queued for Meta Ads Manager, live after approval',
        'Per-ad performance: conversions, CTR and ROAS',
        'Ad-fatigue signals with plain-language recommendations',
        'Variants to test',
        'Competitor research in the Meta Ad Library',
      ],
    },
    'reel-builder': {
      shortDescription: 'Coming soon: short vertical videos with captions and music for Instagram Reels.',
      longDescription:
        'Coming soon: Reel Builder makes short vertical videos (9:16) with a script in the brand voice, captions and music, for Instagram and LinkedIn. Not available yet.',
      features: [
        'AI-generated video scripts',
        'Automatic caption generation',
        'Music selection and timing',
        'Vertical format (9:16) optimisation',
        'Template library for fast creation',
      ],
    },
    'voice-agent': {
      shortDescription: 'Coming soon: AI phone calls for appointments, FAQ and handoff.',
      longDescription:
        'Coming soon: the Voice Agent answers phone calls with AI, books appointments, answers questions from the knowledge base and hands off to a human when needed. Not available yet.',
      features: [
        'Inbound and outbound AI phone calls',
        'Automatic appointment booking',
        'FAQ answering in natural language',
        'Call transcripts',
        'Handoff to a human',
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
      shortDescription: 'Weekly report per brand, dashboard per client and alerts on deviations.',
      longDescription:
        'Reporting & Analytics writes a report per brand every week, keeps a dashboard per client with data refreshed daily from Instagram, GA4, Search Console, Shopify and Meta Ads, and lets you know when a figure deviates sharply.',
      features: [
        'Automatic weekly performance digests',
        'Dashboard per client, refreshed daily',
        'Alerts on sharp deviations',
        'Social, web, sales and ads together',
        'Custom report generation',
      ],
    },
    'seo-geo': {
      shortDescription: 'SEO audits + keyword tracking + Core Web Vitals + AI citation monitoring.',
      longDescription:
        'The SEO/GEO Analyst runs automatic SEO audits, follows your positions via Search Console, monitors Core Web Vitals and keeps track of how often your brand is mentioned by AI search engines (ChatGPT, Perplexity, Gemini and Google AI Overviews). Fixes in order of priority.',
      features: [
        'Automatic technical SEO audits',
        'Positions from Search Console',
        'Core Web Vitals monitoring',
        'AI citation monitoring (GEO)',
        'Competitors on Core Web Vitals and new pages',
        'Prioritised fix recommendations',
      ],
    },
    research: {
      shortDescription: 'Market research + trend monitoring + competitor analysis with citations.',
      longDescription:
        'The Research skill runs scheduled research per client into market trends, competitors and news, and answers targeted questions. Every insight comes with its source and link.',
      features: [
        'Scheduled research runs per client',
        'Trend monitoring in your niche',
        'Competitor analysis',
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
        'Routines and recurring tasks',
      ],
    },
  },
  es: {
    'social-media': {
      shortDescription:
        'Captions, calendario de contenido, carruseles y rendimiento por publicación, por marca y con la voz de marca correcta.',
      longDescription:
        'El Social Media Manager gestiona el proceso de contenido de la idea a la publicación: captions con la voz de marca, un calendario de contenido por cuenta, carruseles con el estilo de la marca y rendimiento por publicación. Publica en Instagram y LinkedIn tras tu aprobación; otras redes vía Postiz bajo petición.',
      features: [
        'Captions generados por IA con la voz de marca',
        'Programación para Instagram y LinkedIn',
        'Calendario de contenido con arrastrar y soltar',
        'Seguimiento de engagement por publicación',
        'Carruseles con el estilo de la marca',
        'Estrategia de hashtags por marca',
      ],
    },
    'blog-factory': {
      shortDescription: 'Artículos SEO desde la investigación de keywords hasta la publicación tras tu aprobación.',
      longDescription:
        'Blog Factory escribe artículos SEO de la investigación a la publicación: investigación de keywords, redacción con la voz de marca, meta descripción, estructura de encabezados y enlaces internos. La extensión se adapta a la intención de búsqueda y a las páginas que ya posicionan. Se publica tras tu aprobación.',
      features: [
        'Investigación de keywords y agrupación de temas',
        'Extensión según la intención de búsqueda',
        'Optimización SEO (meta, encabezados, enlaces internos)',
        'Publicación tras aprobación',
        'Consistencia en la voz de marca',
      ],
    },
    'ad-manager': {
      shortDescription: 'Crea y sigue anuncios: listos para Meta, con conversiones, ROAS y fatiga por anuncio.',
      longDescription:
        'Ad Manager crea anuncios completos (copy, visuales estáticos y vídeo) y los deja listos para Meta Ads Manager; un anuncio solo se publica después de tu aprobación. Después Clyde sigue cada anuncio: alcance, clics, conversiones, ROAS y fatiga publicitaria, además de variantes para probar. Todo en lenguaje claro, también para quien no es experto en anuncios.',
      features: [
        'Copy, visuales estáticos y anuncios de vídeo generados por IA',
        'Listos para Meta Ads Manager, publicados tras aprobación',
        'Rendimiento por anuncio: conversiones, CTR y ROAS',
        'Señales de fatiga con recomendaciones en lenguaje claro',
        'Variantes para probar',
        'Investigación de competencia en la Meta Ad Library',
      ],
    },
    'reel-builder': {
      shortDescription: 'Próximamente: vídeos verticales cortos con captions y música para Instagram Reels.',
      longDescription:
        'Próximamente: Reel Builder hará vídeos verticales cortos (9:16) con un guion en la voz de marca, captions y música, para Instagram y LinkedIn. Todavía no disponible.',
      features: [
        'Guiones de vídeo generados por IA',
        'Generación automática de captions',
        'Selección de música y timing',
        'Optimización de formato vertical (9:16)',
        'Biblioteca de plantillas para crear rápido',
      ],
    },
    'voice-agent': {
      shortDescription: 'Próximamente: llamadas de IA para citas, FAQ y traspaso a una persona.',
      longDescription:
        'Próximamente: el Voice Agent atenderá llamadas con IA, reservará citas, responderá preguntas desde la base de conocimiento y pasará la llamada a una persona cuando haga falta. Todavía no disponible.',
      features: [
        'Llamadas de IA entrantes y salientes',
        'Reserva automática de citas',
        'Respuesta de FAQ en lenguaje natural',
        'Transcripciones de llamadas',
        'Traspaso a una persona',
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
      shortDescription: 'Informe semanal por marca, panel por cliente y avisos cuando algo se desvía.',
      longDescription:
        'Reporting & Analytics escribe cada semana un informe por marca, mantiene un panel por cliente con datos actualizados a diario de Instagram, GA4, Search Console, Shopify y Meta Ads, y te avisa cuando una cifra se desvía mucho.',
      features: [
        'Resúmenes de rendimiento semanales automáticos',
        'Panel por cliente, actualizado a diario',
        'Avisos ante desviaciones fuertes',
        'Social, web, ventas y anuncios juntos',
        'Generación de informes personalizados',
      ],
    },
    'seo-geo': {
      shortDescription:
        'Auditorías SEO + seguimiento de keywords + Core Web Vitals + monitorización de citas de IA.',
      longDescription:
        'El SEO/GEO Analyst realiza auditorías SEO automáticas, sigue tus posiciones a través de Search Console, monitoriza los Core Web Vitals y registra con qué frecuencia mencionan tu marca los buscadores de IA (ChatGPT, Perplexity, Gemini y Google AI Overviews). Correcciones por orden de prioridad.',
      features: [
        'Auditorías SEO técnicas automáticas',
        'Posiciones desde Search Console',
        'Monitorización de Core Web Vitals',
        'Monitorización de citas de IA (GEO)',
        'Competidores por Core Web Vitals y páginas nuevas',
        'Recomendaciones de correcciones priorizadas',
      ],
    },
    research: {
      shortDescription: 'Investigación de mercado + monitorización de tendencias + análisis de competencia con fuentes.',
      longDescription:
        'La habilidad Research ejecuta investigaciones programadas por cliente sobre tendencias de mercado, competidores y noticias, y responde preguntas concretas. Cada insight incluye su fuente con enlace.',
      features: [
        'Investigaciones programadas por cliente',
        'Monitorización de tendencias en tu nicho',
        'Análisis de competencia',
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
