/**
 * Skills data, website mirror of fma-app/src/lib/skills.ts.
 *
 * WHY: de marketing site moet dezelfde 12 skills tonen als de SaaS,
 * maar zonder een harde dependency op fma-app. Bij wijzigingen in
 * fma-app/src/lib/skills.ts (pricing SSoT) ook hier bijwerken.
 *
 * Bevat: per-skill metadata (naam, slug, beschrijving, features) +
 * per-tier caps + status (live / coming_soon) + category voor mega-menu.
 */

export type SkillCategory = 'create' | 'engage' | 'grow'

export type SkillStatus = 'live' | 'coming_soon'

// Keep TierKey and per-skill tierCaps in sync with fma-app/src/lib/skills.ts
// (AGENT_TIERS keys + SKILL_CAPS). Pricing SSoT = fma-app.
export type TierKey = 'PARTNER' | 'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE' | 'FOUNDING_MEMBER'

/**
 * Unit for rendering the included count in the tier matrix.
 * The matrix component looks up `pricing.matrix.{unit}PerMonth` to format.
 * e.g. unit: 'min' → "30 min/mnd" in NL, "30 min/mo" in EN.
 */
export type SkillCapUnit = 'count' | 'min' | 'dm'

export interface SkillTierCap {
  /** -1 = unlimited / fair use, 0 = not available, n = monthly cap */
  included: number
  /** Unit for rendering: 'count' → "12/mnd", 'min' → "30 min/mnd", 'dm' → "500 DMs/mnd". Default 'count'. */
  unit?: SkillCapUnit
  /**
   * i18n key (in `pricing.matrix.*`) to render instead of the numeric cap.
   * Used for special states like "Add-on €97" or "Niet beschikbaar".
   * If set, takes precedence over `included` + `unit`.
   */
  labelKey?: 'addOn47' | 'addOn97' | 'notAvailable' | 'unlimited'
}

export interface SkillData {
  id: string
  name: string
  slug: string
  /** Route on website (not fma-app) */
  route: string
  shortDescription: string
  longDescription: string
  features: readonly string[]
  category: SkillCategory
  status: SkillStatus
  /** Credit cost per action, display label like "2 cr / post" */
  creditCostLabel: string
  /** Per-tier availability, null = fair use on all tiers */
  tierCaps?: Record<TierKey, SkillTierCap>
  /** Schema.org Service.serviceType — Google-classified category for rich results (Phase 14-02) */
  serviceType: string
}

export const SKILLS_DATA: readonly SkillData[] = [
  {
    id: 'social-media',
    name: 'Social Media Manager',
    slug: 'social-media',
    route: '/skills/social-media',
    shortDescription: 'Captions, inplanning, carrousels en engagement, per merk in de juiste merkstem.',
    longDescription:
      'De Social Media Manager beheert het volledige contentproces van idee tot publicatie. AI analyseert trending topics, genereert captions in de juiste merkstem, plant posts op optimale tijdstippen en volgt engagement metrics. Geschikt voor Instagram, Facebook en LinkedIn.',
    features: [
      'AI-gegenereerde captions in de merkstem',
      'Multi-platform scheduling met optimale timing',
      'Content kalender met drag & drop',
      'Engagement tracking per post',
      'Carousel en story builder',
      'Hashtag research en optimalisatie',
    ],
    category: 'create',
    status: 'live',
    creditCostLabel: '1-2 cr / post',
    serviceType: 'Social Media Content Service',
  },
  {
    id: 'blog-factory',
    name: 'Blog Factory',
    slug: 'blog-factory',
    route: '/skills/blog-factory',
    shortDescription: 'Longform SEO-artikelen van keyword research tot automatische publicatie.',
    longDescription:
      'Blog Factory produceert SEO-geoptimaliseerde longform artikelen van onderzoek tot publicatie. Keyword research, schrijven in de merkstem, meta descriptions, heading structuur, interne links: alles automatisch. Output 1.500 tot 3.000 woorden, publicatieklaar.',
    features: [
      'Keyword research en topic clustering',
      'Longform artikelen (1500-3000 woorden)',
      'SEO-optimalisatie (meta, headings, internal links)',
      'Automatische publicatie naar website',
      'Consistentie in merkstem',
    ],
    category: 'create',
    status: 'live',
    creditCostLabel: '15 cr / artikel',
    tierCaps: {
      PARTNER: { included: 2 },
      GROWTH: { included: 8 },
      PROFESSIONAL: { included: 20 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 12 },
    },
    serviceType: 'AI Content Writing Service',
  },
  {
    id: 'ad-creator',
    name: 'Ad Creator',
    slug: 'ad-creator',
    route: '/skills/ad-creator',
    shortDescription: 'Statische ads en video-ads voor Meta. Publiceer A/B-varianten direct.',
    longDescription:
      'Ad Creator genereert complete advertenties: van copy tot visuals. AI maakt statische en video ads, optimaliseert voor verschillende formaten (Stories, Feed, Reels) en publiceert direct naar Meta Ads Manager. A/B test varianten inclusief.',
    features: [
      'AI-gegenereerde ad copy en visuals',
      'Statische en video ad creatie',
      'Multi-format output (Stories, Feed, Reels)',
      'Concurrentie ad library research',
      'Direct publiceren naar Meta Ads',
      'A/B test varianten generatie',
    ],
    category: 'create',
    status: 'live',
    creditCostLabel: '10 cr static / 20 cr video',
    tierCaps: {
      PARTNER: { included: 0, labelKey: 'addOn97' },
      GROWTH: { included: 15 },
      PROFESSIONAL: { included: 50 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 25 },
    },
    serviceType: 'Digital Advertising Creation Service',
  },
  {
    id: 'reel-builder',
    name: 'Reel Builder',
    slug: 'reel-builder',
    route: '/skills/reel-builder',
    shortDescription: "Korte verticale video's met captions, muziek en transities voor Reels, TikTok en Shorts.",
    longDescription:
      "Reel Builder creëert korte verticale video's (9:16) met AI: inclusief captions, muziek en transities. Ideaal voor Instagram Reels, TikTok en YouTube Shorts. Van script tot publicatie-klare video.",
    features: [
      'AI-gegenereerde video scripts',
      'Automatische caption generatie',
      'Muziek selectie en timing',
      'Verticaal formaat (9:16) optimalisatie',
      'Template library voor snelle creatie',
    ],
    category: 'create',
    status: 'coming_soon',
    creditCostLabel: '25 cr / reel',
    tierCaps: {
      PARTNER: { included: 0, labelKey: 'notAvailable' },
      GROWTH: { included: 4 },
      PROFESSIONAL: { included: 15 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 8 },
    },
    serviceType: 'Short-Form Video Production Service',
  },
  {
    id: 'voice-agent',
    name: 'Voice Agent',
    slug: 'voice-agent',
    route: '/skills/voice-agent',
    shortDescription: 'Inkomende en uitgaande AI-gesprekken: afspraken, FAQ, escalatie.',
    longDescription:
      'De Voice Agent handelt telefoonverkeer af met AI, zowel inkomend als uitgaand. Boekt afspraken, beantwoordt FAQ, logt gesprekken en escaleert naar een mens wanneer nodig. Volledig aanpasbaar per klant (stem, persoonlijkheid, kennisbasis).',
    features: [
      'Inbound en outbound AI telefoongesprekken',
      'Automatische afspraak booking',
      'FAQ beantwoording in natural language',
      'Gesprekslogging en transcripties',
      'Escalatie naar menselijke medewerker',
      'Campaign management voor outbound calls',
    ],
    category: 'engage',
    status: 'live',
    creditCostLabel: '5 cr / minuut',
    tierCaps: {
      PARTNER: { included: 0, labelKey: 'notAvailable' },
      GROWTH: { included: 30, unit: 'min' },
      PROFESSIONAL: { included: 120, unit: 'min' },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 60, unit: 'min' },
    },
    serviceType: 'AI Phone Answering Service',
  },
  {
    id: 'lead-qualifier',
    name: 'Lead Qualifier',
    slug: 'lead-qualifier',
    route: '/skills/lead-qualifier',
    shortDescription: 'Website chatbot die leads kwalificeert en routeert naar CRM of sales.',
    longDescription:
      'De Lead Qualifier plaatst een AI chatbot op je website die bezoekers kwalificeert, scores toekent op basis van intent en gedrag, en warme leads automatisch routeert naar je CRM of salesteam.',
    features: [
      'Embeddable AI chatbot voor websites',
      'Automatische lead scoring',
      'CRM routing op basis van kwalificatie',
      'Conversation analytics',
      'Custom kwalificatie criteria per client',
    ],
    category: 'engage',
    status: 'live',
    creditCostLabel: '2 cr / score',
    serviceType: 'Chatbot Lead Qualification Service',
  },
  {
    id: 'email-management',
    name: 'Email Management',
    slug: 'email-management',
    route: '/skills/email-management',
    shortDescription: 'Gmail inbox classificatie + smart labels + dagelijkse digest.',
    longDescription:
      'Email Management classificeert je Gmail inbox automatisch met AI, voegt smart labels toe en genereert een dagelijkse digest van belangrijke berichten. Bespaar uren per week op email management. Let op: dit is inbox classify, geen email campaigns.',
    features: [
      'AI inbox classificatie (urgent, actie, info)',
      'Smart labels en auto-categorisatie',
      'Dagelijkse email digest',
      'Priority ranking van berichten',
      'Suggested replies',
    ],
    category: 'engage',
    status: 'coming_soon',
    creditCostLabel: '5 cr / actie',
    tierCaps: {
      PARTNER: { included: 5, unit: 'count' },
      GROWTH: { included: 20 },
      PROFESSIONAL: { included: 60 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 40 },
    },
    serviceType: 'Email Inbox Classification Service',
  },
  {
    id: 'manychat',
    name: 'ManyChat DM',
    slug: 'manychat',
    route: '/skills/manychat',
    shortDescription: 'Instagram DM keyword triggers + AI antwoorden + lead capture.',
    longDescription:
      'ManyChat DM Automation reageert automatisch op Instagram DMs met AI-gegenereerde antwoorden. Stel keyword triggers in, vang leads op en routeer warme prospects naar je CRM of salesteam.',
    features: [
      'Keyword-based DM triggers',
      'AI-gegenereerde antwoorden in de merkstem',
      'Lead capture en CRM routing',
      'Conversation flows met branching',
      'Performance analytics per trigger',
    ],
    category: 'engage',
    status: 'coming_soon',
    creditCostLabel: '2 cr / 10 DMs',
    tierCaps: {
      PARTNER: { included: 0, labelKey: 'addOn47' },
      GROWTH: { included: 200, unit: 'dm' },
      PROFESSIONAL: { included: 1000, unit: 'dm' },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 500, unit: 'dm' },
    },
    serviceType: 'Instagram DM Automation Service',
  },
  {
    id: 'reporting',
    name: 'Reporting & Analytics',
    slug: 'reporting',
    route: '/skills/reporting',
    shortDescription: 'Dashboards + wekelijkse digests + anomaly detection per klant.',
    longDescription:
      'Reporting & Analytics levert automatische dashboards, wekelijkse digests en real-time KPI tracking. Het systeem detecteert anomalieen in je data en waarschuwt proactief wanneer metrics afwijken.',
    features: [
      'Automatische wekelijkse performance digests',
      'Real-time KPI dashboards',
      'Anomalie detectie met alerts',
      'Cross-platform analytics (social, web, sales)',
      'Custom rapport generatie',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '5 cr / rapport',
    serviceType: 'Marketing Analytics Reporting Service',
  },
  {
    id: 'seo-geo',
    name: 'SEO / GEO Analyst',
    slug: 'seo-geo',
    route: '/skills/seo-geo',
    shortDescription: 'SEO audits + keyword tracking + Core Web Vitals + AI citation monitoring.',
    longDescription:
      'De SEO/GEO Analyst voert automatische SEO audits uit, trackt keyword rankings, monitort Core Web Vitals en houdt bij hoe vaak je merk geciteerd wordt door AI-zoekmachines (ChatGPT, Perplexity, Google AI Overviews). Actionable fixes per prioriteit.',
    features: [
      'Automatische technische SEO audits',
      'Keyword ranking tracking',
      'Core Web Vitals monitoring',
      'AI citation monitoring (GEO)',
      'Concurrentie keyword analyse',
      'Prioritized fix recommendations',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '5 cr audit / 3 cr rapport',
    serviceType: 'SEO and Generative Engine Optimization Service',
  },
  {
    id: 'research',
    name: 'Research',
    slug: 'research',
    route: '/skills/research',
    shortDescription: 'Marktonderzoek + trend monitoring + concurrentieanalyse met bronvermelding.',
    longDescription:
      'De Research skill voert continu marktonderzoek uit, monitort trends in jouw niche en analyseert concurrenten. AI doorzoekt bronnen, vat inzichten samen en levert bruikbare aanbevelingen direct in je dashboard, met bronvermelding bij elk inzicht.',
    features: [
      'Geautomatiseerd marktonderzoek',
      'Trend monitoring in jouw niche',
      'Concurrentie analyse met benchmarks',
      'Actionable insights en recommendations',
      'Bronvermelding bij elk inzicht',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '3 cr / query',
    serviceType: 'Market Research Service',
  },
  {
    id: 'clyde',
    name: 'Clyde AI Employee',
    slug: 'clyde',
    route: '/skills/clyde',
    shortDescription: 'De centrale AI-medewerker die alle andere vaardigheden orkestreert.',
    longDescription:
      'Clyde is de centrale AI medewerker die alle andere skills aanstuurt. Geef opdrachten in natural language en Clyde routeert naar de juiste skill. Werkt via chat, Slack, Telegram en andere kanalen. Heeft geheugen per klant en onthoudt eerdere gesprekken, voorkeuren en context.',
    features: [
      'Natural language opdrachten',
      'Orkestratie van alle andere skills',
      'Multi-channel (chat, Slack, Telegram)',
      'Geheugen en context per klant',
      'Kennisbank met zoekfunctie',
      'Routines en terugkerende taken',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '1-5 cr / chat',
    serviceType: 'AI Marketing Orchestration Service',
  },
] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getSkillsByCategory(): Record<SkillCategory, SkillData[]> {
  return {
    create: SKILLS_DATA.filter((s) => s.category === 'create'),
    engage: SKILLS_DATA.filter((s) => s.category === 'engage'),
    grow: SKILLS_DATA.filter((s) => s.category === 'grow'),
  }
}

export function getSkillBySlug(slug: string): SkillData | undefined {
  return SKILLS_DATA.find((s) => s.slug === slug)
}

export const CATEGORY_LABELS: Record<SkillCategory, { nl: string; en: string; es: string }> = {
  create: { nl: 'Maak & Publiceer', en: 'Create & Publish', es: 'Crea y Publica' },
  engage: { nl: 'Engage & Converteer', en: 'Engage & Convert', es: 'Participa y Convierte' },
  grow: { nl: 'Groei & Optimaliseer', en: 'Grow & Optimize', es: 'Crece y Optimiza' },
}
