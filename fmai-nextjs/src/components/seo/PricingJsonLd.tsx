import { JsonLd } from './JsonLd'

export function PricingJsonLd() {
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
        price: '997',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '997',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
      {
        '@type': 'Offer',
        name: 'AI Marketing Starter',
        description:
          'Growth tier. All 12 skills with tier caps, 5 workspaces, 4,000 credits/month, email + app support. One-time onboarding EUR 1,997.',
        price: '2497',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '2497',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
      {
        '@type': 'Offer',
        name: 'AI Marketing Pro',
        description:
          'Professional tier. All 12 skills with wider caps, 15 workspaces, 12,000 credits/month, Slack support + monthly strategy call. One-time onboarding EUR 3,997.',
        price: '4497',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '4497',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
      {
        '@type': 'Offer',
        name: 'AI Marketing Suite',
        description:
          'Enterprise tier. All 12 skills unlimited (fair use), unlimited workspaces, 30,000 credits/month, dedicated CSM + SLA. One-time onboarding EUR 5,997.',
        price: '7997',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '7997',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
    ],
  }

  return <JsonLd data={data} />
}
