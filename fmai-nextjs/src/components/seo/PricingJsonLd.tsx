import { JsonLd } from './JsonLd'
import { TIER_PRICING, priceRangeForTier } from '@/lib/pricing-data'

const SELLER = { '@type': 'Organization', name: 'Future Marketing AI' } as const

/**
 * Emit Offers per service-niveau. Workspace-priced tiers (Growth/Pro/Ent)
 * declare a PriceSpecification range (minPrice + optional maxPrice). Founding
 * stays a single-price Offer because the lifetime €997 is a fixed anchor.
 */
function workspaceOffer(
  name: string,
  description: string,
  tierKey: 'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE',
) {
  const cfg = TIER_PRICING[tierKey]
  if (cfg.pricingModel !== 'workspace') {
    throw new Error(`workspaceOffer called with non-workspace tier ${tierKey}`)
  }
  const range = priceRangeForTier(tierKey)
  return {
    '@type': 'Offer',
    name,
    description,
    priceCurrency: 'EUR',
    // Anchor "from" price so legacy crawlers without PriceSpecification
    // support still surface a sensible figure.
    price: String(range.min),
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'EUR',
      minPrice: String(range.min),
      ...(range.max !== null ? { maxPrice: String(range.max) } : {}),
      unitCode: 'MON',
      unitText: `per workspace, from ${cfg.minWorkspaces}${
        cfg.maxWorkspaces === -1 ? '+' : ` to ${cfg.maxWorkspaces}`
      } workspaces`,
    },
    seller: SELLER,
  }
}

export function PricingJsonLd() {
  const founding = TIER_PRICING.FOUNDING_MEMBER
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FutureMarketingAI Pricing Tiers',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Founders Club',
        description:
          'Founding Member tier (10 spots, grandfathered lifetime). All 12 skills with Pro-level caps, unlimited workspaces, 8,000 credits/month, Founder Slack with Daley. No onboarding fee. Recommended for early adopters.',
        price: String(founding.pricingModel === 'fixed' ? founding.price : 997),
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(founding.pricingModel === 'fixed' ? founding.price : 997),
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: SELLER,
      },
      workspaceOffer(
        'AI Marketing Starter (Growth)',
        'Growth tier — linear per-workspace rate (€499/workspace) for portfolios of 2 to 4 brands. All 12 skills with tier caps, 800 credits per workspace per month, email + app support. One-time onboarding €1,997.',
        'GROWTH',
      ),
      workspaceOffer(
        'AI Marketing Pro (Professional)',
        'Professional tier — linear per-workspace rate (€399/workspace) for portfolios of 5 to 14 brands. All 12 skills with wider caps, 800 credits per workspace per month, Slack support + monthly strategy call. One-time onboarding €3,997.',
        'PROFESSIONAL',
      ),
      workspaceOffer(
        'AI Marketing Suite (Enterprise)',
        'Enterprise tier — linear per-workspace rate (€299/workspace) from 15 brands upward. All 12 skills uncapped (fair use), 800 credits per workspace per month, dedicated CSM + SLA, white-label and API access. One-time onboarding €5,997.',
        'ENTERPRISE',
      ),
    ],
  }

  return <JsonLd data={data} />
}
