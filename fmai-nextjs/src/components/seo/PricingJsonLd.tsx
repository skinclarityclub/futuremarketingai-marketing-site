import { JsonLd } from './JsonLd'
import { FOUNDING, CREDIT_PACKS } from '@/lib/pricing-data'
import { ORG_ID, SITE_URL } from '@/lib/seo-config'

const SELLER = { '@id': ORG_ID } as const
type Founding = typeof FOUNDING

// One text per indexable locale; nl is the default (es is no longer a locale).
const COPY = {
  nl: {
    app: 'Clyde, de AI-collega voor marketingbureaus: strategie, content, goedkeuring, publicatie en rapportage per klantmerk.',
    founding: (f: Founding) =>
      `Founding partner: €${f.price} per maand excl. btw met ${f.includedWorkspaces} klantmerken inbegrepen, €${f.pricePerExtraWorkspace} per extra klantmerk tot ${f.maxWorkspaces}, ${f.creditsPerBrand} credits per klantmerk per maand in één pot voor je bureau, €0 onboarding. Je bureau keurt zelf goed. Prijs ${f.priceLockMonths} betaalde maanden vast, maandelijks opzegbaar. Niet inbegrepen: AI-video, voice-over en advertenties.`,
    pack: (credits: number) => `${credits} extra credits`,
  },
  en: {
    app: 'Clyde, the AI colleague for marketing agencies: strategy, content, approval, publishing and reporting per client brand.',
    founding: (f: Founding) =>
      `Founding partner: €${f.price} per month excl. VAT with ${f.includedWorkspaces} client brands included, €${f.pricePerExtraWorkspace} per extra client brand up to ${f.maxWorkspaces}, ${f.creditsPerBrand} credits per client brand per month in one pool for your agency, €0 onboarding. Your agency approves the work itself. Price fixed for ${f.priceLockMonths} paid months, cancel monthly. Not included: AI video, voice-over and ads.`,
    pack: (credits: number) => `${credits} extra credits`,
  },
} as const

/**
 * The offer on /pricing as the `offers` of SoftwareApplication #clyde, one source
 * (pricing-data.ts): Founding plus the three credit top-ups. Prices exclude VAT.
 */
export function PricingJsonLd({ locale }: { locale: string }) {
  const copy = locale === 'en' ? COPY.en : COPY.nl
  const monthly = (price: number, unitText: string) => ({
    '@type': 'UnitPriceSpecification',
    price: String(price),
    priceCurrency: 'EUR',
    valueAddedTaxIncluded: false,
    billingDuration: 'P1M',
    unitText,
  })
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
        priceSpecification: [
          monthly(FOUNDING.price, `per month, ${FOUNDING.includedWorkspaces} client brands included`),
          monthly(FOUNDING.pricePerExtraWorkspace, 'per extra client brand per month'),
        ],
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: FOUNDING.maxWorkspaces,
          unitText: 'client brand',
        },
        url: `${SITE_URL}/${locale}/pricing#founding`,
        seller: SELLER,
      },
      ...CREDIT_PACKS.map((pack) => ({
        '@type': 'Offer',
        name: copy.pack(pack.credits),
        price: String(pack.price),
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: String(pack.price),
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
        url: `${SITE_URL}/${locale}/pricing#credits`,
        seller: SELLER,
      })),
    ],
  }

  return <JsonLd data={data} />
}
