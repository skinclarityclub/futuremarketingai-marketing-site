/**
 * Chatbot tier snapshot (v11, workspace-priced since 2026-04-28, locale-aware since 2026-05-29).
 *
 * WHY: both /api/chatbot tools (leadgen + concierge) need tier data to answer
 * pricing questions. One module mirrors fma-app/src/lib/skills.ts AGENT_TIERS.
 *
 * Numeric/structural facts live in CHATBOT_TIERS (locale-neutral). User-facing
 * copy (price label + feature bullets) lives in TIER_COPY per locale so the
 * sidebar pricing card renders in the visitor's language (NL is source of truth).
 *
 * Pricing model:
 * - 'fixed': single monthly price (Founding Member only).
 * - 'workspace': monthly price = pricePerWorkspace * workspaces. `monthlyPrice`
 *   is the starter price for minWorkspaces.
 *
 * When fma-app pricing changes, update this file AND src/lib/skills-data.ts AND
 * messages/*.json simultaneously. See fmai-nextjs/CLAUDE.md "Pricing SoT" rule.
 */

export type ChatbotLocale = 'nl' | 'en' | 'es'

export function normalizeChatbotLocale(value: string | undefined): ChatbotLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

export const CHATBOT_TIERS = {
  founding: {
    name: 'Founding Member',
    pricingModel: 'fixed' as const,
    monthlyPrice: 997,
    onboardingFee: 0,
    workspaces: -1, // unlimited
    credits: 8000,
    spotsTotal: 10,
    spotsTaken: 1,
    skillsIncluded: 12,
    skillsTotal: 12,
  },
  growth: {
    name: 'Growth',
    pricingModel: 'workspace' as const,
    pricePerWorkspace: 499,
    minWorkspaces: 2,
    maxWorkspaces: 4,
    creditsPerWorkspace: 800,
    monthlyPrice: 998, // 499 * 2 starter
    onboardingFee: 1997,
    skillsIncluded: 12,
    skillsTotal: 12,
  },
  professional: {
    name: 'Professional',
    pricingModel: 'workspace' as const,
    pricePerWorkspace: 399,
    minWorkspaces: 5,
    maxWorkspaces: 14,
    creditsPerWorkspace: 800,
    monthlyPrice: 1995, // 399 * 5 starter
    onboardingFee: 3997,
    skillsIncluded: 12,
    skillsTotal: 12,
  },
  enterprise: {
    name: 'Enterprise',
    pricingModel: 'workspace' as const,
    pricePerWorkspace: 299,
    minWorkspaces: 15,
    maxWorkspaces: -1, // unlimited
    creditsPerWorkspace: 800,
    monthlyPrice: 4485, // 299 * 15 starter
    onboardingFee: 5997,
    skillsIncluded: 12,
    skillsTotal: 12,
  },
} as const

export type ChatbotTierKey = keyof typeof CHATBOT_TIERS

interface TierCopy {
  priceLabel: string
  features: string[]
}

const TIER_COPY: Record<ChatbotLocale, Record<ChatbotTierKey, TierCopy>> = {
  nl: {
    founding: {
      priceLabel: '€997/mnd',
      features: [
        'Alle 12 vaardigheden inbegrepen (9 live, 3 binnenkort)',
        'Onbeperkt aantal werkruimtes',
        '8.000 credits per maand',
        'Levenslang vast tarief van €997 (wordt nooit herijkt voor founding members)',
        'Directe toegang tot de founder',
        'Bepaal mee de productroadmap',
        '10 plekken totaal, 1 bezet (SkinClarity Club), geen onboarding-fee',
      ],
    },
    growth: {
      priceLabel: '€499 per werkruimte/mnd',
      features: [
        'Alle 12 vaardigheden inbegrepen',
        '2 tot 4 merk-werkruimtes',
        '€499 per werkruimte per maand (vanaf €998 voor 2 merken)',
        '800 credits per werkruimte (1.600 tot 3.200 totaal per maand)',
        '€1.997 eenmalige onboarding',
        'E-mailondersteuning',
      ],
    },
    professional: {
      priceLabel: '€399 per werkruimte/mnd',
      features: [
        'Alle 12 vaardigheden inbegrepen',
        '5 tot 14 merk-werkruimtes',
        '€399 per werkruimte per maand (vanaf €1.995 voor 5 merken)',
        '800 credits per werkruimte (4.000 tot 11.200 totaal per maand)',
        '€3.997 eenmalige onboarding',
        'Eigen Slack-kanaal',
      ],
    },
    enterprise: {
      priceLabel: '€299 per werkruimte/mnd',
      features: [
        'Alle 12 vaardigheden inbegrepen',
        '15+ merk-werkruimtes (geen bovengrens)',
        '€299 per werkruimte per maand (vanaf €4.485 voor 15 merken)',
        '800 credits per werkruimte (12.000+ totaal per maand)',
        '€5.997 eenmalige onboarding',
        'Eigen Customer Success Manager',
      ],
    },
  },
  en: {
    founding: {
      priceLabel: '€997/mo',
      features: [
        'All 12 skills included (9 live, 3 coming soon)',
        'Unlimited workspaces',
        '8,000 credits per month',
        'Lifetime price lock at €997 (never raises for founding members)',
        'Direct founder access',
        'Shape the product roadmap',
        '10 spots total, 1 taken (SkinClarity Club), no onboarding fee',
      ],
    },
    growth: {
      priceLabel: '€499 per workspace/mo',
      features: [
        'All 12 skills included',
        '2 to 4 brand workspaces',
        '€499 per workspace per month (from €998 for 2 brands)',
        '800 credits per workspace (1,600 to 3,200 total per month)',
        '€1,997 one-time onboarding',
        'Email support',
      ],
    },
    professional: {
      priceLabel: '€399 per workspace/mo',
      features: [
        'All 12 skills included',
        '5 to 14 brand workspaces',
        '€399 per workspace per month (from €1,995 for 5 brands)',
        '800 credits per workspace (4,000 to 11,200 total per month)',
        '€3,997 one-time onboarding',
        'Dedicated Slack channel',
      ],
    },
    enterprise: {
      priceLabel: '€299 per workspace/mo',
      features: [
        'All 12 skills included',
        '15+ brand workspaces (no upper cap)',
        '€299 per workspace per month (from €4,485 for 15 brands)',
        '800 credits per workspace (12,000+ total per month)',
        '€5,997 one-time onboarding',
        'Dedicated Customer Success Manager',
      ],
    },
  },
  es: {
    founding: {
      priceLabel: '€997/mes',
      features: [
        'Las 12 habilidades incluidas (9 activas, 3 próximamente)',
        'Espacios de trabajo ilimitados',
        '8.000 créditos al mes',
        'Precio fijo de por vida de €997 (nunca sube para los miembros founding)',
        'Acceso directo al fundador',
        'Influye en la hoja de ruta del producto',
        '10 plazas en total, 1 ocupada (SkinClarity Club), sin tarifa de incorporación',
      ],
    },
    growth: {
      priceLabel: '€499 por espacio/mes',
      features: [
        'Las 12 habilidades incluidas',
        '2 a 4 espacios de marca',
        '€499 por espacio al mes (desde €998 para 2 marcas)',
        '800 créditos por espacio (1.600 a 3.200 en total al mes)',
        '€1.997 de incorporación única',
        'Soporte por email',
      ],
    },
    professional: {
      priceLabel: '€399 por espacio/mes',
      features: [
        'Las 12 habilidades incluidas',
        '5 a 14 espacios de marca',
        '€399 por espacio al mes (desde €1.995 para 5 marcas)',
        '800 créditos por espacio (4.000 a 11.200 en total al mes)',
        '€3.997 de incorporación única',
        'Canal de Slack dedicado',
      ],
    },
    enterprise: {
      priceLabel: '€299 por espacio/mes',
      features: [
        'Las 12 habilidades incluidas',
        '15+ espacios de marca (sin límite superior)',
        '€299 por espacio al mes (desde €4.485 para 15 marcas)',
        '800 créditos por espacio (12.000+ en total al mes)',
        '€5.997 de incorporación única',
        'Customer Success Manager dedicado',
      ],
    },
  },
}

/** Tiers shaped for ServiceCard (localized price string + features). */
export function getChatbotTiers(locale: ChatbotLocale) {
  return (Object.keys(CHATBOT_TIERS) as ChatbotTierKey[]).map((key) => ({
    name: CHATBOT_TIERS[key].name,
    price: TIER_COPY[locale][key].priceLabel,
    features: TIER_COPY[locale][key].features,
    highlighted: key === 'founding',
  }))
}

/** Single tier shaped for ServiceCard module/detail rendering. */
export function getChatbotTier(locale: ChatbotLocale, key: ChatbotTierKey) {
  return {
    name: CHATBOT_TIERS[key].name,
    description: TIER_COPY[locale][key].priceLabel,
    features: TIER_COPY[locale][key].features,
  }
}
