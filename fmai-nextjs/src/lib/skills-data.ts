/**
 * Skills data, website mirror of fma-app/src/lib/skills.ts.
 *
 * WHY: de marketing site moet dezelfde vaardigheden tonen als de SaaS,
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
// Partner tier removed 2026-04-28 (consolidated into Founding-only entry; see
// fma-app commit 297949d7).
export type TierKey = 'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE' | 'FOUNDING_MEMBER'

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
   * Used for special states like "Niet beschikbaar" or "Onbeperkt".
   * If set, takes precedence over `included` + `unit`.
   */
  labelKey?: 'notAvailable' | 'unlimited'
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
    shortDescription: 'Captions, contentkalender, carrousels en prestaties per post, per merk in de juiste merkstem.',
    longDescription:
      'De Social Media Manager beheert het contentproces van idee tot publicatie: captions in de merkstem, een contentkalender per account, carrousels in de huisstijl en prestaties per post. Publiceert na goedkeuring naar Instagram, Facebook, LinkedIn, X, Threads, TikTok en YouTube.',
    features: [
      'AI-gegenereerde captions in de merkstem',
      'Inplannen voor Instagram, Facebook, LinkedIn, X, Threads, TikTok en YouTube',
      'Content kalender met drag & drop',
      'Engagement tracking per post',
      'Carrousels in de huisstijl',
      'Hashtagstrategie per merk',
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
    shortDescription: 'SEO-artikelen van zoekwoord-onderzoek tot publicatie na goedkeuring.',
    longDescription:
      "Blog Factory schrijft SEO-artikelen van onderzoek tot publicatie: zoekwoord-onderzoek, schrijven in de merkstem, meta description, kopstructuur en interne links. De lengte volgt de zoekintentie en de pagina's die al ranken. Publicatie na goedkeuring.",
    features: [
      'Keyword research en topic clustering',
      'Lengte volgens de zoekintentie',
      'SEO-optimalisatie (meta, headings, internal links)',
      'Publicatie na goedkeuring',
      'Consistentie in merkstem',
    ],
    category: 'create',
    status: 'live',
    creditCostLabel: '15 cr / artikel',
    tierCaps: {
      GROWTH: { included: 8 },
      PROFESSIONAL: { included: 20 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 12 },
    },
    serviceType: 'AI Content Writing Service',
  },
  {
    id: 'ad-manager',
    name: 'Ad Manager',
    slug: 'ad-manager',
    route: '/skills/ad-manager',
    shortDescription: 'Ads maken en volgen: klaarzetten voor Meta en per advertentie conversies, ROAS en ad-fatigue.',
    longDescription:
      'Ad Manager maakt complete advertenties (copy, statische visuals en video) en zet ze klaar voor Meta Ads Manager; live gaat een advertentie pas na jouw akkoord. Daarna volgt Clyde elke advertentie: bereik, klikken, conversies, ROAS en ad-fatigue, plus varianten om te testen. Alles in klare taal, ook voor wie geen ads-expert is.',
    features: [
      'AI-gegenereerde ad copy, statische visuals en video-ads',
      'Klaarzetten voor Meta Ads Manager, live na akkoord',
      'Per-advertentie prestaties: conversies, CTR en ROAS',
      'Ad-fatigue-signalen met aanbevelingen in klare taal',
      'Varianten om te testen',
      'Concurrentie-onderzoek in de Meta Ad Library',
    ],
    category: 'create',
    status: 'live',
    creditCostLabel: '10 cr static / 20 cr video',
    tierCaps: {
      GROWTH: { included: 15 },
      PROFESSIONAL: { included: 50 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 25 },
    },
    serviceType: 'Digital Advertising Management Service',
  },
  {
    id: 'reel-builder',
    name: 'Reel Builder',
    slug: 'reel-builder',
    // golf 9a: no page of its own, the old URL 308s to the hub's Binnenkort block
    route: '/skills#binnenkort',
    shortDescription: "Binnenkort: korte verticale video's met captions en muziek voor Instagram Reels.",
    longDescription:
      "Binnenkort: Reel Builder maakt korte verticale video's (9:16) met een script in de merkstem, captions en muziek, voor Instagram en LinkedIn. Nog niet beschikbaar.",
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
    route: '/skills#binnenkort',
    shortDescription: 'Binnenkort: AI-telefoongesprekken voor afspraken, FAQ en doorschakelen.',
    longDescription:
      'Binnenkort: de Voice Agent beantwoordt telefoongesprekken met AI, boekt afspraken, beantwoordt vragen uit de kennisbasis en schakelt door naar een mens wanneer nodig. Nog niet beschikbaar.',
    features: [
      'Inbound en outbound AI telefoongesprekken',
      'Automatische afspraak booking',
      'FAQ beantwoording in natural language',
      'Transcripties van gesprekken',
      'Doorschakelen naar een mens',
      'Campaign management voor outbound calls',
    ],
    category: 'engage',
    status: 'coming_soon',
    creditCostLabel: '5 cr / minuut',
    tierCaps: {
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
    shortDescription: "Instagram-reacties en DM's met een trefwoord krijgen meteen een DM; het vervolg komt in de merkstem.",
    longDescription:
      "De Lead Qualifier beantwoordt Instagram-reacties en DM's met een trefwoord meteen met een DM en de link die erbij hoort. Clyde schrijft het vervolg in de merkstem van de klant, legt het aan je voor en zet leads die via de link binnenkomen in de leadlijst.",
    features: [
      "Trefwoord naar DM, per post of voor alle DM's",
      'Het vervolg in de merkstem van elke klant',
      'Concepten ter goedkeuring in de inbox',
      'Overdracht aan jou als Clyde het antwoord niet weet',
      'Leads uit de DM-link in de leadlijst',
    ],
    category: 'engage',
    status: 'live',
    // golf 9a: ManyChat folded into this skill, so it carries the DM pipeline's price and caps
    // (fma-app CREDIT_COSTS.socialCommandCenter.dm_batch_10 and SKILL_CAPS.socialCommandCenter)
    creditCostLabel: '2 cr / 10 DMs',
    tierCaps: {
      GROWTH: { included: 200, unit: 'dm' },
      PROFESSIONAL: { included: 1000, unit: 'dm' },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 500, unit: 'dm' },
    },
    serviceType: 'Instagram DM Lead Capture Service',
  },
  {
    id: 'email-management',
    name: 'Email Management',
    slug: 'email-management',
    route: '/skills/email-management',
    shortDescription: 'Inbox-classificatie voor Gmail en Outlook, met labels en conceptantwoorden.',
    longDescription:
      'Email Management classificeert je Gmail- of Outlook-inbox met AI: categorieën per klant, een urgentie per mail, statuslabels en conceptantwoorden die pas na goedkeuring verstuurd worden. Elke ochtend zie je wat er binnenkwam. Let op: dit is inbox-classificatie, geen mailcampagnes.',
    features: [
      'AI-classificatie in categorieën per klant',
      'Smart labels en auto-categorisatie',
      'Dagelijkse melding met wat er binnenkwam',
      'Urgentie per mail (1 tot 5)',
      'Conceptantwoorden, verstuurd na goedkeuring',
    ],
    category: 'engage',
    status: 'live',
    creditCostLabel: '5 cr / actie',
    tierCaps: {
      GROWTH: { included: 20 },
      PROFESSIONAL: { included: 60 },
      ENTERPRISE: { included: -1, labelKey: 'unlimited' },
      FOUNDING_MEMBER: { included: 40 },
    },
    serviceType: 'Email Inbox Classification Service',
  },
  {
    id: 'reporting',
    name: 'Reporting & Analytics',
    slug: 'reporting',
    route: '/skills/reporting',
    shortDescription: 'Weekrapport per merk, dashboard per klant en meldingen bij afwijkingen.',
    longDescription:
      'Reporting & Analytics schrijft elke week een rapport per merk, houdt een dashboard per klant bij met dagelijks ververste data uit Instagram, GA4, Search Console, Shopify en Meta Ads, en meldt het je als een cijfer sterk afwijkt.',
    features: [
      'Automatische wekelijkse performance digests',
      'Dashboard per klant, dagelijks ververst',
      'Meldingen bij sterke afwijkingen',
      'Social, web, verkoop en advertenties samen',
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
      'De SEO/GEO Analyst voert automatische SEO-audits uit, volgt je posities via Search Console, monitort Core Web Vitals en houdt bij hoe vaak je merk genoemd wordt door AI-zoekmachines (ChatGPT, Perplexity, Gemini en Google AI Overviews). Fixes op volgorde van prioriteit.',
    features: [
      'Automatische technische SEO audits',
      'Posities uit Search Console',
      'Core Web Vitals monitoring',
      'AI citation monitoring (GEO)',
      "Concurrenten op Core Web Vitals en nieuwe pagina's",
      'Prioritized fix recommendations',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '5 cr audit / 3 cr rapport',
    serviceType: 'SEO and Generative Engine Optimization Service',
  },
  {
    id: 'strategy',
    name: 'Strategie en onderzoek',
    slug: 'strategy',
    route: '/skills/strategy',
    shortDescription:
      'Per klant de doelen, de doelgroep, de platforms en een agenda voor het jaar, met signalen uit onderzoek ernaast.',
    longDescription:
      'Elke klant krijgt een strategiepagina: waar je voor gaat, voor wie, op welke platforms en met welke doelen. Daaruit volgt de agenda voor het jaar. Clyde zet signalen uit onderzoek ernaast, met de bron, en stelt voor wat je ermee doet. Jij beslist.',
    features: [
      'Doel, doelgroep en klantprofiel per klant',
      'Een agenda met vensters voor het hele jaar',
      'Trends en concurrenten per klant',
      'Signalen uit onderzoek met bron en datum',
      'Clyde stelt voor, jij beslist',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '3 cr / query',
    serviceType: 'Content Strategy Service',
  },
  {
    id: 'clyde',
    name: 'Clyde, AI-collega',
    slug: 'clyde',
    route: '/skills/clyde',
    shortDescription: 'De AI-collega die de andere vaardigheden inzet.',
    longDescription:
      'Clyde is de AI-collega die de andere vaardigheden inzet. Geef opdrachten in gewone taal en Clyde kiest de juiste vaardigheid. Werkt in het dashboard, in de web-app op je beginscherm en op WhatsApp. Heeft geheugen per klant en onthoudt eerdere gesprekken, voorkeuren en context.',
    features: [
      'Natural language opdrachten',
      'Concepten, voorstellen en vaste taken per klant',
      'In elk scherm van het dashboard en op WhatsApp',
      'Geheugen en context per klant',
      'Routines en terugkerende taken',
    ],
    category: 'grow',
    status: 'live',
    creditCostLabel: '1-5 cr / chat',
    serviceType: 'AI Marketing Assistant Service',
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

/**
 * Pick related skills for a given slug — same category first, then a fill-in from
 * the cross-category live set so the related grid is never sparse.
 * Excludes coming_soon and the slug itself. Capped at `limit` items (default 3).
 */
export function getRelatedSkills(slug: string, limit = 3): SkillData[] {
  const base = getSkillBySlug(slug)
  if (!base) return []
  const liveOthers = SKILLS_DATA.filter((s) => s.slug !== slug && s.status === 'live')
  const sameCategory = liveOthers.filter((s) => s.category === base.category)
  const otherCategory = liveOthers.filter((s) => s.category !== base.category)
  const merged = [...sameCategory, ...otherCategory]
  return merged.slice(0, limit)
}

export const CATEGORY_LABELS: Record<SkillCategory, { nl: string; en: string; es: string }> = {
  create: { nl: 'Maak & Publiceer', en: 'Create & Publish', es: 'Crea y Publica' },
  engage: { nl: 'Engage & Converteer', en: 'Engage & Convert', es: 'Participa y Convierte' },
  grow: { nl: 'Groei & Optimaliseer', en: 'Grow & Optimize', es: 'Crece y Optimiza' },
}
