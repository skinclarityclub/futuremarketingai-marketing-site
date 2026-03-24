import { JsonLd } from './JsonLd'

export function PricingJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FutureMarketingAI Pricing Packs',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Social Media Engine',
        description: 'AI Marketing Employee for social media management — Instagram, Facebook, LinkedIn, Content Factory, Analytics, Clyde 24/7. 3 client workspaces.',
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
        name: 'Ecommerce Growth',
        price: '1497',
        priceCurrency: 'EUR',
        description: 'All Social Media Engine skills plus Blog Factory, ManyChat DM automation, Shopify sync. 5 client workspaces.',
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
        name: 'Full Agency Suite',
        price: '1997',
        priceCurrency: 'EUR',
        description: 'All skills included — Voice Agent, Email Management, Ad Monitoring, Priority Clyde, dedicated success manager. 10 client workspaces.',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '1997',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
    ],
  }

  return <JsonLd data={data} />
}
