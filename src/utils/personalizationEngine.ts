/**
 * Personalization Engine
 *
 * Adapts content, messaging, and recommendations based on:
 * - ICP Score (primary/secondary/nurture)
 * - Industry (ecommerce/SaaS/agency)
 * - Role (owner/CMO/manager/specialist)
 * - Pain Points (agency-cost, scaling-problem, etc.)
 * - Journey Progress
 *
 * Research-backed approach from 2025 best practices:
 * - Segment-specific messaging increases conversion by 3x
 * - Role-based content improves engagement by 2.5x
 * - Pain point targeting doubles demo booking rates
 *
 * @module personalizationEngine
 */

import type { ICPScoreBreakdown } from '../types/icp'

/**
 * Personalization Level (user preference)
 */
export type PersonalizationLevel = 'full' | 'moderate' | 'minimal' | 'off'

/**
 * Personalized Content Context
 */
export interface PersonalizationContext {
  // User Profile
  industry: string | null
  role: string | null
  painPoints: string[]

  // ICP Scoring
  icpScore: number
  icpTier: 'primary' | 'secondary' | 'nurture'

  // Journey State
  modulesViewed: number
  hasUsedCalculator: boolean
  hasScheduledDemo: boolean
  timeOnSite: number

  // Preferences
  personalizationLevel: PersonalizationLevel
}

/**
 * Industry-specific messaging
 */
const INDUSTRY_MESSAGING = {
  ecommerce: {
    tone: 'results-focused',
    keywords: [
      'conversie',
      'omzet',
      'verkoop',
      'productcampagnes',
      'retargeting',
      'abandoned cart',
    ],
    examples: [
      'Een e-commerce bedrijf verhoogde hun ROAS met 340% met onze AI Ad Builder',
      'Automatiseer productcampagnes voor duizenden SKUs in minuten',
      'Dynamische retargeting op basis van browsergedrag',
    ],
    painPointFocus: ['manual-work', 'channel-overload', 'scaling-problem'],
    ctaPriority: ['calculator', 'demo', 'ad-builder-module'],
  },
  saas: {
    tone: 'strategic',
    keywords: [
      'MRR',
      'churn',
      'lifetime value',
      'lead nurturing',
      'funnel optimization',
      'demo calls',
    ],
    examples: [
      'Een SaaS platform verhoogde hun demo booking rate met 180%',
      'Geautomatiseerde lead nurturing campagnes die sales kwalificeren',
      'A/B testing op schaal voor elke funnel stap',
    ],
    painPointFocus: ['scaling-problem', 'content-bottleneck', 'manual-work'],
    ctaPriority: ['demo', 'content-pipeline-module', 'calculator'],
  },
  agency: {
    tone: 'efficiency-focused',
    keywords: [
      'client management',
      'white-label',
      'rapportage',
      'multi-account',
      'automation',
      'margins',
    ],
    examples: [
      'Agencies besparen gemiddeld 60 uur/week per account manager',
      'White-label rapportage die klanten imponeert',
      'Beheer 50+ clients met hetzelfde team',
    ],
    painPointFocus: ['agency-cost', 'hiring-limitation', 'manual-work'],
    ctaPriority: ['multi-account-module', 'demo', 'calculator'],
  },
  other: {
    tone: 'educational',
    keywords: ['marketing automation', 'AI', 'efficiency', 'groei', 'resultaten'],
    examples: [
      'Bedrijven zien gemiddeld 40% tijdsbesparing binnen de eerste maand',
      'AI-powered marketing automation voor elk type business',
      'Schaalbare campagnes zonder extra team',
    ],
    painPointFocus: ['manual-work', 'scaling-problem'],
    ctaPriority: ['explorer', 'calculator', 'demo'],
  },
}

/**
 * Role-specific messaging
 */
const ROLE_MESSAGING = {
  owner: {
    focus: 'ROI & Strategic Growth',
    painPoints: ['Hoge agency kosten', 'Gebrek aan schaalbare groei', 'Team limitaties'],
    messageStyle: 'direct, ROI-focused',
    ctaVariant: 'Book Founder Call',
    highlights: [
      'ROI binnen 3 maanden',
      'Bespaar €50k-€200k/jaar op agency fees',
      'Schaal zonder extra headcount',
    ],
  },
  cmo: {
    focus: 'Data-Driven Strategy & Efficiency',
    painPoints: ['Channel complexiteit', 'Data inconsistentie', 'Team productiviteit'],
    messageStyle: 'strategic, data-backed',
    ctaVariant: 'Schedule Strategy Session',
    highlights: [
      'Real-time analytics dashboard',
      'Cross-channel attribution',
      'Team collaboration tools',
    ],
  },
  manager: {
    focus: 'Workflow Efficiency & Execution',
    painPoints: ['Manual werk', 'Deadlines', 'Campaign management'],
    messageStyle: 'practical, solution-focused',
    ctaVariant: 'See Demo',
    highlights: [
      '40+ uur/week tijdsbesparing',
      'Geautomatiseerde workflows',
      '1-klik campaign launches',
    ],
  },
  specialist: {
    focus: 'Tools & Capabilities',
    painPoints: ['Tool limitations', 'Creative bottlenecks', 'Testing capacity'],
    messageStyle: 'technical, feature-focused',
    ctaVariant: 'Try Features',
    highlights: ['GPT-4 powered content', 'A/B testing automation', 'Geavanceerde targeting'],
  },
  other: {
    focus: 'General Value Proposition',
    painPoints: ['Efficiency', 'Results', 'Time'],
    messageStyle: 'balanced, exploratory',
    ctaVariant: 'Learn More',
    highlights: ['AI-powered automation', 'Proven results', 'Easy onboarding'],
  },
}

/**
 * ICP Tier-specific messaging
 */
const ICP_TIER_MESSAGING = {
  primary: {
    urgency: 'high',
    ctaText: 'Book Founder Call',
    ctaSecondary: 'Calculate Your ROI',
    messagingStyle: 'premium, personalized, founder-access',
    incentive: 'Early Adopter Discount (20% off)',
    followUpTiming: 'within 24h',
    features: [
      'Premium features',
      'Custom implementation',
      'Direct founder access',
      'Priority support',
    ],
  },
  secondary: {
    urgency: 'medium',
    ctaText: 'Schedule Demo',
    ctaSecondary: 'Explore Features',
    messagingStyle: 'value-focused, proof-driven',
    incentive: 'Extended 30-day trial',
    followUpTiming: 'within 48h',
    features: ['Standard features', 'Case studies', 'Implementation guide', 'Email support'],
  },
  nurture: {
    urgency: 'low',
    ctaText: 'Learn More',
    ctaSecondary: 'Explore Use Cases',
    messagingStyle: 'educational, exploratory',
    incentive: 'Free resources & guides',
    followUpTiming: 'drip campaign',
    features: ['Educational content', 'Getting started guide', 'Community access', 'Webinars'],
  },
}

/**
 * Get ICP tier from score
 */
export function getICPTier(icpScore: number): 'primary' | 'secondary' | 'nurture' {
  if (icpScore >= 70) {
    return 'primary'
  }
  if (icpScore >= 50) {
    return 'secondary'
  }
  return 'nurture'
}

/**
 * Personalize message content based on context
 *
 * Adapts:
 * - Tone and language
 * - Examples and use cases
 * - Feature highlights
 * - CTAs
 * - Urgency level
 */
export function personalizeMessage(baseMessage: string, context: PersonalizationContext): string {
  // Respect personalization preferences
  if (context.personalizationLevel === 'off') {
    return baseMessage
  }

  let personalizedMessage = baseMessage

  // Industry-specific adaptations
  if (context.industry && context.personalizationLevel !== 'minimal') {
    const industryData = INDUSTRY_MESSAGING[context.industry as keyof typeof INDUSTRY_MESSAGING]
    if (industryData) {
      // Add industry-specific example if message is generic
      if (baseMessage.length < 200 && !baseMessage.includes('bijvoorbeeld')) {
        personalizedMessage += `\n\n💡 **Voorbeeld:** ${industryData.examples[0]}`
      }
    }
  }

  // ICP Tier urgency
  if (context.personalizationLevel === 'full') {
    const tierData = ICP_TIER_MESSAGING[context.icpTier]

    // Add incentive for high-value leads
    if (context.icpTier === 'primary' && !personalizedMessage.includes('Early Adopter')) {
      personalizedMessage += `\n\n🎁 **Special Offer:** ${tierData.incentive}`
    }
  }

  return personalizedMessage
}

/**
 * Get personalized CTA based on context
 */
export function getPersonalizedCTA(context: PersonalizationContext): {
  primary: string
  secondary?: string
  icon: string
} {
  const tierData = ICP_TIER_MESSAGING[context.icpTier]
  const roleData = context.role
    ? ROLE_MESSAGING[context.role as keyof typeof ROLE_MESSAGING]
    : ROLE_MESSAGING.other

  return {
    primary: context.personalizationLevel === 'full' ? roleData.ctaVariant : tierData.ctaText,
    secondary: tierData.ctaSecondary,
    icon: context.icpTier === 'primary' ? '🚀' : context.icpTier === 'secondary' ? '✨' : '📚',
  }
}

/**
 * Get industry-specific module recommendations
 */
export function getIndustryModuleRecommendations(industry: string | null): string[] {
  if (!industry) {
    return ['command-center', 'ad-builder', 'analytics-lab']
  }

  const recommendations: Record<string, string[]> = {
    ecommerce: ['ad-builder', 'analytics-lab', 'command-center', 'content-pipeline'],
    saas: ['content-pipeline', 'campaign-orchestrator', 'analytics-lab', 'command-center'],
    agency: ['multi-account', 'command-center', 'ad-builder', 'analytics-lab'],
    other: ['command-center', 'ad-builder', 'content-pipeline'],
  }

  return recommendations[industry] || recommendations.other
}

/**
 * Get role-specific feature highlights
 */
export function getRoleFeatureHighlights(role: string | null): string[] {
  if (!role) {
    return ['AI-powered automation', 'Proven results', 'Easy onboarding']
  }

  const roleData = ROLE_MESSAGING[role as keyof typeof ROLE_MESSAGING] || ROLE_MESSAGING.other
  return roleData.highlights
}

/**
 * Get pain point-specific messaging
 */
export function getPainPointMessaging(painPoints: string[]): string[] {
  const messaging: Record<string, string> = {
    'agency-cost': '💰 **Bespaar €50k-€200k/jaar** op agency fees - doe het in-house met AI',
    'scaling-problem': '📈 **Schaal je marketing 10x** zonder extra team of budget',
    'manual-work': '⚡ **Automatiseer 80% van je manual work** - focus op strategie',
    'channel-overload': '🎯 **Beheer alle kanalen vanuit één dashboard** - end het chaos',
    'content-bottleneck': '✍️ **Generate 100+ content variaties per dag** - never run out',
    'hiring-limitation': '👥 **1 marketeer doet het werk van 5** - AI als virtual team',
  }

  return painPoints.map((p) => messaging[p]).filter(Boolean)
}

/**
 * Should show premium features based on ICP tier and journey progress
 */
export function shouldShowPremiumFeatures(context: PersonalizationContext): boolean {
  if (context.personalizationLevel === 'off' || context.personalizationLevel === 'minimal') {
    return false
  }

  // Show premium to primary ICP or engaged users
  return (
    context.icpTier === 'primary' ||
    (context.modulesViewed >= 3 && context.hasUsedCalculator) ||
    context.hasScheduledDemo
  )
}

/**
 * Get personalized journey suggestion
 */
export function getPersonalizedJourneySuggestion(context: PersonalizationContext): string {
  const industryData = context.industry
    ? INDUSTRY_MESSAGING[context.industry as keyof typeof INDUSTRY_MESSAGING]
    : INDUSTRY_MESSAGING.other

  // High-intent users
  if (context.icpTier === 'primary' && context.hasUsedCalculator) {
    return `🎯 **Volgende stap:** Jouw ICP score (${context.icpScore}) en ROI maken je perfect fit voor ons platform. Klaar voor een persoonlijk gesprek met de founder?`
  }

  // Engaged explorers
  if (context.modulesViewed >= 3 && !context.hasUsedCalculator) {
    return `💰 **Tijd voor ROI:** Je hebt al ${context.modulesViewed} modules verkend. Laten we berekenen hoeveel tijd en geld je kunt besparen!`
  }

  // Early journey
  if (context.modulesViewed < 2) {
    const topModule = industryData.ctaPriority[1] // Second priority = exploration
    return `🚀 **Start hier:** Voor ${context.industry || 'jouw business'} raden we de ${topModule.replace('-', ' ')} aan als perfecte start.`
  }

  // Default
  return `✨ **Blijf ontdekken:** Elke module laat een ander stuk van ons autonome marketing systeem zien.`
}

/**
 * Get adaptive feature examples based on context
 */
export function getAdaptiveExamples(
  featureName: string,
  context: PersonalizationContext
): string[] {
  // Generic examples
  const genericExamples: Record<string, string[]> = {
    'ad-builder': [
      'Generate 50+ ad variaties in 30 seconden',
      'A/B testing op schaal met auto-optimization',
      'Cross-platform consistency zonder manual work',
    ],
    'content-pipeline': [
      'Van blog naar 20+ social posts in 1 klik',
      'Brand voice consistency across all content',
      'Never run out of content ideas',
    ],
    'analytics-lab': [
      'Real-time insights across alle kanalen',
      'Predictive analytics voor campaign optimization',
      'Custom dashboards voor elk team member',
    ],
  }

  // Industry-specific examples
  const industryExamples: Record<string, Record<string, string[]>> = {
    ecommerce: {
      'ad-builder': [
        'Productcampagnes voor 1000+ SKUs in minuten',
        'Dynamic retargeting ads op basis van browse behavior',
        'Seasonal campaigns geautomatiseerd (Black Friday, etc.)',
      ],
      'analytics-lab': [
        'ROAS tracking per product categorie',
        'Customer lifetime value predictions',
        'Inventory-based campaign optimization',
      ],
    },
    saas: {
      'content-pipeline': [
        'Lead nurturing content voor elke funnel stap',
        'Case studies en testimonials op schaal',
        'Demo booking campagnes die converteren',
      ],
      'analytics-lab': [
        'MRR impact per marketing channel',
        'Churn prediction en prevention campaigns',
        'Demo-to-customer conversion tracking',
      ],
    },
    agency: {
      'ad-builder': [
        'White-label ad creation voor alle clients',
        'Bulk campaign launches across accounts',
        'Client-specific brand voice preservation',
      ],
      'analytics-lab': [
        'Multi-client reporting dashboards',
        'Performance benchmarking across clients',
        'Profitability tracking per account',
      ],
    },
  }

  // Get industry-specific examples if available
  if (
    context.industry &&
    context.personalizationLevel !== 'minimal' &&
    industryExamples[context.industry]?.[featureName]
  ) {
    return industryExamples[context.industry][featureName]
  }

  // Fallback to generic
  return genericExamples[featureName] || []
}

/**
 * Get personalization level from user preference (default: full)
 */
export function getPersonalizationLevel(
  userPreference?: PersonalizationLevel
): PersonalizationLevel {
  return userPreference || 'full'
}

/**
 * Build complete personalization context from stores
 */
export function buildPersonalizationContext(
  industry: string | null,
  role: string | null,
  painPoints: string[],
  icpScore: ICPScoreBreakdown | null,
  modulesViewed: number,
  hasUsedCalculator: boolean,
  hasScheduledDemo: boolean,
  timeOnSite: number,
  personalizationLevel?: PersonalizationLevel
): PersonalizationContext {
  return {
    industry,
    role,
    painPoints,
    icpScore: icpScore?.overall || 0,
    icpTier: getICPTier(icpScore?.overall || 0),
    modulesViewed,
    hasUsedCalculator,
    hasScheduledDemo,
    timeOnSite,
    personalizationLevel: getPersonalizationLevel(personalizationLevel),
  }
}
