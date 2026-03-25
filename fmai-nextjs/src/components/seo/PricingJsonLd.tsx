import { JsonLd } from './JsonLd'

export function PricingJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FutureMarketingAI Pricing Tiers',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'AI Marketing Starter',
        description: 'Growth tier — All 11 AI skills, 5 workspaces, 3,000 credits/month, email support. One-time onboarding EUR 1,500.',
        price: '1497',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '1497',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
      {
        '@type': 'Offer',
        name: 'AI Marketing Pro',
        description: 'Professional tier — All 11 AI skills, 15 workspaces, 8,000 credits/month, dedicated Slack + monthly call. One-time onboarding EUR 3,000.',
        price: '2997',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '2997',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
      {
        '@type': 'Offer',
        name: 'AI Marketing Suite',
        description: 'Enterprise tier — All 11 AI skills, unlimited workspaces, 20,000 credits/month, dedicated CSM + custom SLA. One-time onboarding EUR 5,000.',
        price: '4997',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '4997',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
    ],
  }

  return <JsonLd data={data} />
}
