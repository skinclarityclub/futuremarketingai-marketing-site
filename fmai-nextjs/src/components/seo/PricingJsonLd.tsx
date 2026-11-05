import { JsonLd } from './JsonLd'
import { FOUNDING, TIER_PRICING, WORKSPACE_TIER_KEYS, type WorkspaceTierPricing } from '@/lib/pricing-data'
import { ORG_ID, SITE_URL } from '@/lib/seo-config'

const SELLER = { '@id': ORG_ID } as const
const TIER_NAMES = { GROWTH: 'Growth', PROFESSIONAL: 'Professional', ENTERPRISE: 'Enterprise' } as const

// One text per indexable locale; nl is the default (es is no longer a locale).
const COPY = {
  nl: {
    app: 'Clyde, de AI-collega voor marketingbureaus: strategie, content, goedkeuring, publicatie en rapportage per klantmerk.',
    founding: (f: typeof FOUNDING) =>
      `Founding partner: ${f.includedWorkspaces} klantmerken inbegrepen, €${f.pricePerExtraWorkspace} per extra klantmerk per maand, ${f.credits} credits per maand, €0 onboarding en een directe WhatsApp-lijn met Daley. Het tarief blijft vast zolang je klant blijft.`,
    workspace: (name: string, c: WorkspaceTierPricing) =>
      `${name}: €${c.pricePerWorkspace} per klantmerk per maand, ${
        c.maxWorkspaces === -1 ? `vanaf ${c.minWorkspaces}` : `${c.minWorkspaces} tot ${c.maxWorkspaces}`
      } klantmerken, ${c.creditsPerWorkspace} credits per klantmerk per maand, eenmalige onboarding €${c.onboardingFee}. Actief zodra de founding-plekken bezet zijn.`,
  },
  en: {
    app: 'Clyde, the AI colleague for marketing agencies: strategy, content, approval, publishing and reporting per client brand.',
    founding: (f: typeof FOUNDING) =>
      `Founding partner: ${f.includedWorkspaces} client brands included, €${f.pricePerExtraWorkspace} per extra client brand per month, ${f.credits} credits per month, €0 onboarding and a direct WhatsApp line with Daley. The rate stays fixed for as long as you remain a client.`,
    workspace: (name: string, c: WorkspaceTierPricing) =>
      `${name}: €${c.pricePerWorkspace} per client brand per month, ${
        c.maxWorkspaces === -1 ? `from ${c.minWorkspaces}` : `${c.minWorkspaces} to ${c.maxWorkspaces}`
      } client brands, ${c.creditsPerWorkspace} credits per client brand per month, one-time onboarding €${c.onboardingFee}. Active once the founding spots are taken.`,
  },
} as const

/**
 * The prices on /pricing as the `offers` of SoftwareApplication #clyde, one source
 * (pricing-data.ts). Workspace tiers carry their unit price per workspace, not a
 * range of monthly totals: that read as "€998 per workspace" in the old schema.
 */
export function PricingJsonLd({ locale }: { locale: string }) {
  const copy = locale === 'en' ? COPY.en : COPY.nl
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#clyde`,
    name: 'Clyde',
    description: copy.app,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE_URL}/${locale}/pricing`,
    inLanguage: locale,
    provider: SELLER,
    offers: [
      {
        '@type': 'Offer',
        name: 'Founding',
        description: copy.founding(FOUNDING),
        price: String(FOUNDING.price),
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(FOUNDING.price),
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
          unitText: 'per month',
        },
        url: `${SITE_URL}/${locale}/pricing#founding`,
        seller: SELLER,
      },
      ...WORKSPACE_TIER_KEYS.map((tier) => {
        const cfg = TIER_PRICING[tier] as WorkspaceTierPricing
        return {
          '@type': 'Offer',
          name: TIER_NAMES[tier],
          description: copy.workspace(TIER_NAMES[tier], cfg),
          price: String(cfg.pricePerWorkspace),
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: String(cfg.pricePerWorkspace),
            priceCurrency: 'EUR',
            billingDuration: 'P1M',
            unitText: 'per workspace per month',
          },
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            minValue: cfg.minWorkspaces,
            ...(cfg.maxWorkspaces === -1 ? {} : { maxValue: cfg.maxWorkspaces }),
            unitText: 'workspace',
          },
          seller: SELLER,
        }
      }),
    ],
  }

  return <JsonLd data={data} />
}
