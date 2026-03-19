import { JsonLd } from './JsonLd'

export function PricingJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FutureMarketingAI Pricing Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Starter',
        description: 'Single AI service - chatbot, automation, or voice agent',
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
        name: 'Growth',
        price: '2497',
        priceCurrency: 'EUR',
        description: 'Two AI services combined',
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
        name: 'Scale',
        price: '3997',
        priceCurrency: 'EUR',
        description: 'Full AI suite - all services included',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '3997',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        seller: { '@type': 'Organization', name: 'Future Marketing AI' },
      },
    ],
  }

  return <JsonLd data={data} />
}
