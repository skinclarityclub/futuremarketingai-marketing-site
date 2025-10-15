/**
 * SEOHead Component
 *
 * Comprehensive SEO meta tags component using react-helmet-async.
 * Manages page title, description, Open Graph, Twitter Cards, and canonical URLs.
 *
 * @see LANDING-PAGE-COMPREHENSIVE-AUDIT-2025.md - SEO Implementation
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'

export interface SEOHeadProps {
  /** Page title (will be suffixed with site name) */
  title: string
  /** Meta description for search results (150-160 chars recommended) */
  description: string
  /** Keywords for meta tag (optional, comma-separated) */
  keywords?: string[]
  /** Canonical URL for this page */
  canonical?: string
  /** Open Graph image URL (absolute URL required) */
  ogImage?: string
  /** Open Graph type (default: website) */
  ogType?: 'website' | 'article' | 'product'
  /** Twitter card type (default: summary_large_image) */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  /** Noindex directive (for pages you don't want indexed) */
  noindex?: boolean
  /** Additional meta tags */
  additionalMeta?: Array<{ name?: string; property?: string; content: string }>
}

/**
 * SEOHead Component
 *
 * @example
 * ```tsx
 * <SEOHead
 *   title="AI Marketing Automation Platform"
 *   description="Transform your marketing with AI-powered automation"
 *   keywords={['AI marketing', 'automation', 'SaaS']}
 *   ogImage="https://futuremarketingai.com/og-image.png"
 * />
 * ```
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  additionalMeta = [],
}) => {
  // Site configuration
  const siteUrl = 'https://futuremarketingai.com'
  const siteName = 'Future Marketing AI'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const canonicalUrl = canonical || siteUrl

  // Default OG image if not provided
  const defaultOgImage = `${siteUrl}/og-default.png`
  const ogImageUrl = ogImage || defaultOgImage

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="nl_NL" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImageUrl} />

      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => {
        if (meta.name) {
          return <meta key={index} name={meta.name} content={meta.content} />
        }
        if (meta.property) {
          return <meta key={index} property={meta.property} content={meta.content} />
        }
        return null
      })}

      {/* Viewport (mobile-first) */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Theme Color */}
      <meta name="theme-color" content="#0f172a" />
    </Helmet>
  )
}

/**
 * SEO Presets for common pages
 */
export const SEOPresets = {
  home: {
    title: 'AI Marketing Automation Platform',
    description:
      'Transform your marketing with Future Marketing AI. Revolutionary AI-powered marketing automation that turns premium businesses into market leaders. Experience enterprise-grade intelligent marketing.',
    keywords: [
      'AI marketing',
      'marketing automation',
      'SaaS platform',
      'AI content generation',
      'marketing intelligence',
    ],
  },
  demo: {
    title: 'Interactive Demo - See AI Marketing in Action',
    description:
      'Experience our AI marketing platform firsthand. Interactive demo showcasing automated content creation, multi-channel publishing, and intelligent analytics. No signup required.',
    keywords: [
      'marketing demo',
      'AI demo',
      'interactive platform demo',
      'marketing automation demo',
    ],
    noindex: true, // Don't index demo pages
  },
  features: {
    title: 'Features - AI-Powered Marketing Tools',
    description:
      'Discover powerful AI marketing features: automated content creation, intelligent research assistant, multi-channel publishing, and advanced analytics. Built for enterprise growth.',
    keywords: [
      'marketing features',
      'AI tools',
      'marketing automation features',
      'content automation',
    ],
  },
  pricing: {
    title: 'Pricing Plans - Transparent & Flexible',
    description:
      'Choose the perfect plan for your business. From startups to enterprises, transparent pricing with no hidden fees. 30-day money-back guarantee.',
    keywords: ['pricing', 'plans', 'marketing automation pricing', 'SaaS pricing'],
  },
  about: {
    title: 'About Us - The Future of Marketing',
    description:
      'Learn about Future Marketing AI. Our mission is to democratize enterprise-grade marketing automation through intelligent AI technology.',
    keywords: ['about us', 'company', 'marketing technology', 'AI company'],
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description:
      'Ready to transform your marketing? Schedule a consultation with our experts. Get personalized guidance for your business needs.',
    keywords: ['contact', 'consultation', 'demo booking', 'get started'],
  },
}

export default SEOHead
