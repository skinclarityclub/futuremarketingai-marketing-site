import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, ORG_EMAIL, LINKEDIN_URL, ENTITY_DESCRIPTION } from '@/lib/seo-config'

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    email: ORG_EMAIL,
    description: ENTITY_DESCRIPTION,
    foundingDate: '2025',
    founder: {
      '@type': 'Person',
      name: 'Daley',
      jobTitle: 'Founder & CEO',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL',
      addressRegion: 'Netherlands',
    },
    areaServed: ['NL', 'EU', 'Worldwide'],
    knowsAbout: ['AI Automation', 'Chatbots', 'Voice Agents', 'Marketing Automation'],
    knowsLanguage: ['en', 'nl', 'es'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Automations',
            description:
              'Custom AI-powered workflow automations for marketing, sales, and operations.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Chatbots',
            description:
              'Intelligent conversational chatbots for lead qualification, customer support, and engagement.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Voice Agents',
            description: 'AI-powered voice agents for inbound and outbound phone interactions.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Marketing Machine',
            description:
              'End-to-end AI marketing automation system integrating all channels and touchpoints.',
          },
        },
      ],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: ORG_EMAIL,
      contactType: 'sales',
      availableLanguage: ['English', 'Dutch', 'Spanish'],
    },
    sameAs: [LINKEDIN_URL],
    priceRange: '€€€',
  }

  return <JsonLd data={data} />
}
