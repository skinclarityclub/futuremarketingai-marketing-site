/**
 * SEO Components Export
 */

export { SEOHead, SEOPresets, type SEOHeadProps } from './SEOHead'
export {
  StructuredData,
  StructuredDataPresets,
  createFAQSchema,
  createBreadcrumbSchema,
  createRatingSchema,
  type SchemaType,
  type FAQItem,
  type BreadcrumbItem,
  type Rating,
  type StructuredDataProps,
} from './StructuredData'
export { FAQSection, FAQCompact } from './FAQSection'
export { PricingTable, FeatureComparisonTable, ToolComparisonTable } from './ComparisonTables'
export { TermDefinitions, TermTooltip } from './TermDefinitions'

// Landing Page Components (in landing/ folder, re-exported for convenience)
export { FeaturesSection } from '../landing/FeaturesSection'
export { SocialProof, TrustIndicators } from '../landing/SocialProof'
