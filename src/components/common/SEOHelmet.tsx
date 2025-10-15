import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useDemoSEO } from '../../hooks'

/**
 * SEOHelmet Component
 *
 * Dynamically sets SEO metadata for the current page based on route and language.
 * Uses react-helmet-async to manage document head tags.
 *
 * @example
 * ```tsx
 * // In any page component:
 * <SEOHelmet />
 * ```
 *
 * @features
 * - Dynamic titles and descriptions per page
 * - Internationalization support (EN/NL)
 * - Open Graph tags for Facebook/LinkedIn
 * - Twitter Card tags
 * - Canonical URLs
 * - Structured data (JSON-LD)
 */

interface SEOHelmetProps {
  /**
   * Override the default title from useDemoSEO
   */
  title?: string
  /**
   * Override the default description from useDemoSEO
   */
  description?: string
  /**
   * Override the default OG image from useDemoSEO
   */
  ogImage?: string
  /**
   * Additional structured data (JSON-LD)
   */
  structuredData?: Record<string, unknown>
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title: titleOverride,
  description: descriptionOverride,
  ogImage: ogImageOverride,
  structuredData,
}) => {
  const seoData = useDemoSEO()

  // Use overrides if provided, otherwise use hook data
  const title = titleOverride || seoData.title
  const description = descriptionOverride || seoData.description
  const ogImage = ogImageOverride || seoData.ogImage

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seoData.keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={seoData.canonicalUrl} />

      {/* Hreflang Tags for Multi-Language SEO */}
      <link rel="alternate" hrefLang="nl" href={`${seoData.ogUrl}?lang=nl`} />
      <link rel="alternate" hrefLang="en" href={`${seoData.ogUrl}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={seoData.ogUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={seoData.ogTitle} />
      <meta property="og:description" content={seoData.ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={seoData.ogUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.twitterTitle} />
      <meta name="twitter:description" content={seoData.twitterDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  )
}

/**
 * Default structured data for the demo
 * Can be extended per page
 */
export const defaultStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FutureMarketingAI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
  },
}
