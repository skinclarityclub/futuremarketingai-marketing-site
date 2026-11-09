/**
 * Chatbot offer snapshot (Founding A1.4 since 2026-11-09, locale-aware since 2026-05-29).
 *
 * WHY: both /api/chatbot tools (leadgen + concierge) need offer data to answer
 * pricing questions. One module mirrors the offer in src/lib/pricing-data.ts and
 * fma-app docs/plans/2026-11-09-founding-a14-credits-PLAN.md §1.
 *
 * Numeric facts live in CHATBOT_TIERS (locale-neutral). User-facing copy (price
 * label + feature bullets) lives in TIER_COPY per locale so the pricing card
 * renders in the visitor's language (NL is source of truth).
 *
 * There is one offer for new agencies: Founding. Growth, Professional and
 * Enterprise are off the site until the regular plans follow the Founding cohort.
 *
 * When the offer changes, update this file AND src/lib/pricing-data.ts AND
 * messages/*.json simultaneously. See fmai-nextjs/CLAUDE.md "Pricing SoT" rule.
 */

export type ChatbotLocale = 'nl' | 'en' | 'es'

export function normalizeChatbotLocale(value: string | undefined): ChatbotLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

export const CHATBOT_TIERS = {
  founding: {
    name: 'Founding',
    monthlyPrice: 1297, // EUR excl. VAT, covers includedBrands
    includedBrands: 5,
    pricePerExtraBrand: 199,
    maxBrands: 15,
    creditsPerBrand: 1500,
    onboardingFee: 0,
    spotsTotal: 3,
  },
} as const

export type ChatbotTierKey = keyof typeof CHATBOT_TIERS

/** Founding price for a brand count, or undefined outside 1..maxBrands. */
export function foundingPriceFor(brands: number): number | undefined {
  const f = CHATBOT_TIERS.founding
  if (!Number.isInteger(brands) || brands < 1 || brands > f.maxBrands) return undefined
  return f.monthlyPrice + Math.max(0, brands - f.includedBrands) * f.pricePerExtraBrand
}

interface TierCopy {
  priceLabel: string
  features: string[]
}

const TIER_COPY: Record<ChatbotLocale, Record<ChatbotTierKey, TierCopy>> = {
  nl: {
    founding: {
      priceLabel: '€1.297/mnd excl. btw',
      features: [
        '5 klantmerken inbegrepen, €199 per extra klantmerk tot 15',
        '1.500 credits per klantmerk per maand, in één pot voor je bureau',
        'Per merk genoeg voor ~20 unieke stukken: 12 posts, 4 carrousels, 4 shorts uit eigen beeldmateriaal',
        'Je bureau keurt zelf goed; begeleiding kan op aanvraag',
        '€0 onboarding',
        'Prijs 12 betaalde maanden vast, maandelijks opzegbaar',
        'Daarna 30% onder de reguliere prijs (verwacht rond €2.400-2.500 voor 5 merken), zolang je klant blijft',
        'Niet inbegrepen: AI-video, voice-over, advertenties',
        '3 founding-plekken',
      ],
    },
  },
  en: {
    founding: {
      priceLabel: '€1,297/mo excl. VAT',
      features: [
        '5 client brands included, €199 per extra client brand up to 15',
        '1,500 credits per client brand per month, in one pool for your agency',
        'Per brand enough for ~20 unique pieces: 12 posts, 4 carousels, 4 shorts from your own footage',
        'Your agency approves the work itself; guidance is available on request',
        '€0 onboarding',
        'Price fixed for 12 paid months, cancel monthly',
        'After that 30% below the regular price (expected around €2,400-2,500 for 5 brands), as long as you stay a client',
        'Not included: AI video, voice-over, ads',
        '3 founding spots',
      ],
    },
  },
  es: {
    founding: {
      priceLabel: '€1.297/mes sin IVA',
      features: [
        '5 marcas cliente incluidas, €199 por cada marca extra hasta 15',
        '1.500 créditos por marca cliente al mes, en una bolsa para tu agencia',
        'Por marca da para ~20 piezas únicas: 12 posts, 4 carruseles, 4 shorts con tu propio material',
        'Tu agencia aprueba el trabajo; el acompañamiento está disponible bajo petición',
        '€0 de onboarding',
        'Precio fijo durante 12 meses pagados, cancelación mensual',
        'No incluido: vídeo con IA, locución, anuncios',
        '3 plazas en el primer grupo',
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
