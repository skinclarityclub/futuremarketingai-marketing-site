/**
 * StructuredData Component
 *
 * Generates Schema.org JSON-LD structured data for enhanced search results.
 * Supports multiple schema types for different page contexts.
 *
 * @see https://schema.org/
 * @see LANDING-PAGE-COMPREHENSIVE-AUDIT-2025.md - Structured Data Implementation
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * Base schema types from schema.org
 */
export type SchemaType =
  | 'WebSite'
  | 'Organization'
  | 'SoftwareApplication'
  | 'Product'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'Article'
  | 'HowTo'

/**
 * Question-Answer pair for FAQ schema
 */
export interface FAQItem {
  question: string
  answer: string
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Rating information
 */
export interface Rating {
  ratingValue: number
  ratingCount: number
  bestRating?: number
}

/**
 * Props for StructuredData component
 */
export interface StructuredDataProps {
  /** The type of schema to generate */
  type: SchemaType
  /** Custom schema data (will be merged with type-specific defaults) */
  data?: Record<string, unknown>
}

/**
 * StructuredData Component
 *
 * Generates JSON-LD structured data for SEO and rich snippets.
 *
 * @example
 * ```tsx
 * // Organization schema
 * <StructuredData type="Organization" />
 *
 * // FAQ schema
 * <StructuredData
 *   type="FAQPage"
 *   data={{
 *     mainEntity: faqItems.map(item => ({
 *       '@type': 'Question',
 *       name: item.question,
 *       acceptedAnswer: {
 *         '@type': 'Answer',
 *         text: item.answer
 *       }
 *     }))
 *   }}
 * />
 * ```
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ type, data = {} }) => {
  const siteUrl = 'https://futuremarketingai.com'

  // Generate schema based on type
  const getSchemaData = (): Record<string, unknown> => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }

    // Add type-specific defaults if not overridden
    switch (type) {
      case 'Organization':
        return {
          ...baseSchema,
          name: data.name || 'Future Marketing AI',
          url: data.url || siteUrl,
          logo: data.logo || `${siteUrl}/logo.png`,
          description: data.description || 'Revolutionary AI-powered marketing automation platform',
          sameAs: data.sameAs || [
            // Add social media profiles
            'https://www.linkedin.com/company/futuremarketingai',
            'https://twitter.com/futuremarketai',
          ],
          contactPoint: data.contactPoint || {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@futuremarketingai.com',
          },
        }

      case 'SoftwareApplication':
        return {
          ...baseSchema,
          name: data.name || 'Future Marketing AI Platform',
          applicationCategory: data.applicationCategory || 'BusinessApplication',
          operatingSystem: data.operatingSystem || 'Web',
          offers: data.offers || {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
            description: 'Interactive demo available free',
          },
          aggregateRating: data.aggregateRating || {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '150',
            bestRating: '5',
          },
          description:
            data.description || 'AI-powered marketing automation platform for enterprise growth',
        }

      case 'WebSite':
        return {
          ...baseSchema,
          name: data.name || 'Future Marketing AI',
          url: data.url || siteUrl,
          description: data.description || 'AI Marketing Automation Platform',
          potentialAction: data.potentialAction || {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        }

      case 'FAQPage':
        // FAQ schema requires mainEntity to be provided in data
        return baseSchema

      case 'BreadcrumbList':
        // Breadcrumb schema requires itemListElement to be provided in data
        return baseSchema

      case 'Product':
        return {
          ...baseSchema,
          name: data.name || 'Future Marketing AI Platform',
          description: data.description || 'AI-powered marketing automation',
          brand: data.brand || {
            '@type': 'Brand',
            name: 'Future Marketing AI',
          },
          offers: data.offers || {
            '@type': 'Offer',
            price: 'Contact for pricing',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
        }

      case 'Article':
        // Article schema requires specific fields to be provided in data
        return baseSchema

      case 'HowTo':
        // HowTo schema requires step information to be provided in data
        return baseSchema

      default:
        return baseSchema
    }
  }

  const schemaData = getSchemaData()

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData, null, 0)}</script>
    </Helmet>
  )
}

/**
 * Helper function to create FAQ schema data
 */
export const createFAQSchema = (faqItems: FAQItem[]) => ({
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})

/**
 * Helper function to create Breadcrumb schema data
 */
export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

/**
 * Helper function to create Rating schema
 */
export const createRatingSchema = (rating: Rating) => ({
  '@type': 'AggregateRating',
  ratingValue: rating.ratingValue.toString(),
  ratingCount: rating.ratingCount.toString(),
  bestRating: (rating.bestRating || 5).toString(),
})

/**
 * Pre-configured structured data for common pages
 */
export const StructuredDataPresets = {
  /**
   * Organization schema for About page or footer
   */
  organization: () => <StructuredData type="Organization" />,

  /**
   * SoftwareApplication schema for product pages
   */
  softwareApplication: () => <StructuredData type="SoftwareApplication" />,

  /**
   * WebSite schema for homepage
   */
  website: () => <StructuredData type="WebSite" />,

  /**
   * FAQ schema with custom items
   */
  faq: (items: FAQItem[]) => <StructuredData type="FAQPage" data={createFAQSchema(items)} />,

  /**
   * Breadcrumb schema for navigation
   */
  breadcrumb: (items: BreadcrumbItem[]) => (
    <StructuredData type="BreadcrumbList" data={createBreadcrumbSchema(items)} />
  ),

  /**
   * Product schema with pricing information
   */
  product: (options: {
    name: string
    description: string
    price: string
    currency: string
    availability?: string
  }) => (
    <StructuredData
      type="Product"
      data={{
        name: options.name,
        description: options.description,
        offers: {
          '@type': 'Offer',
          price: options.price,
          priceCurrency: options.currency,
          availability: options.availability
            ? `https://schema.org/${options.availability}`
            : 'https://schema.org/InStock',
        },
      }}
    />
  ),

  /**
   * WebPage schema for general pages
   */
  webpage: (options: { name: string; description: string; url: string }) => (
    <StructuredData
      type="WebSite"
      data={{
        name: options.name,
        description: options.description,
        url: options.url,
      }}
    />
  ),

  /**
   * FAQ Page schema (alias for compatibility)
   * @deprecated Use `faq(items)` instead with actual FAQ items
   */
  faqPage: () => <StructuredData type="FAQPage" data={{ mainEntity: [] }} />,
}

export default StructuredData
