/**
 * Conversation Personalization
 *
 * Integrates personalization engine with conversation responses.
 * Adapts message content, CTAs, and suggestions based on user context.
 *
 * @module conversationPersonalization
 */

import {
  buildPersonalizationContext,
  personalizeMessage,
  getPersonalizedCTA,
  getIndustryModuleRecommendations,
  getRoleFeatureHighlights,
  getPainPointMessaging,
  getPersonalizedJourneySuggestion,
  getAdaptiveExamples,
  shouldShowPremiumFeatures,
  type PersonalizationContext,
} from './personalizationEngine'
import type { ICPScoreBreakdown } from '../types/icp'

/**
 * Personalization Context from Stores
 */
export interface PersonalizationStoreContext {
  industry: string | null
  role: string | null
  painPoints: string[]
  icpScore: ICPScoreBreakdown | null
  modulesViewed: number
  hasUsedCalculator: boolean
  hasScheduledDemo: boolean
  timeOnSite: number
  personalizationLevel?: 'full' | 'moderate' | 'minimal' | 'off'
}

/**
 * Build personalization context from store data
 */
export function buildContextFromStores(
  storeContext: PersonalizationStoreContext
): PersonalizationContext {
  return buildPersonalizationContext(
    storeContext.industry,
    storeContext.role,
    storeContext.painPoints,
    storeContext.icpScore,
    storeContext.modulesViewed,
    storeContext.hasUsedCalculator,
    storeContext.hasScheduledDemo,
    storeContext.timeOnSite,
    storeContext.personalizationLevel
  )
}

/**
 * Enhance a generic response with personalization
 */
export function enhanceResponseWithPersonalization(
  baseResponse: string,
  context: PersonalizationContext
): string {
  if (context.personalizationLevel === 'off') {
    return baseResponse
  }

  // Add personalization
  let enhanced = personalizeMessage(baseResponse, context)

  // Add pain point messaging for high-value leads
  if (
    context.icpTier === 'primary' &&
    context.painPoints.length > 0 &&
    context.personalizationLevel === 'full'
  ) {
    const painPointMessages = getPainPointMessaging(context.painPoints)
    if (painPointMessages.length > 0) {
      enhanced += `\n\n${painPointMessages[0]}` // Add first pain point message
    }
  }

  return enhanced
}

/**
 * Get personalized welcome message
 */
export function getPersonalizedWelcome(context: PersonalizationContext): string {
  const baseWelcome = "👋 Hey! Welkom bij FutureMarketingAI's interactive demo."

  if (context.personalizationLevel === 'off' || context.personalizationLevel === 'minimal') {
    return baseWelcome + ' Ik help je graag om ons platform te ontdekken!'
  }

  // Industry-specific welcome
  const industryWelcomes: Record<string, string> = {
    ecommerce: `${baseWelcome} Perfect dat je er bent! Voor e-commerce bedrijven zoals jouw, kan ons platform je helpen om **productcampagnes te schalen** zonder manual work.`,
    saas: `${baseWelcome} Fijn dat je er bent! Voor SaaS bedrijven bieden we **geautomatiseerde lead nurturing** en **funnel optimization** op schaal.`,
    agency: `${baseWelcome} Welkom! Voor agencies hebben we **multi-account management** en **white-label rapportage** - perfect om je efficiency te verhogen.`,
  }

  if (context.industry && industryWelcomes[context.industry]) {
    return industryWelcomes[context.industry]
  }

  // Role-specific welcome
  const roleWelcomes: Record<string, string> = {
    owner: `${baseWelcome} Als founder/owner, focus ik op **ROI en strategische groei** - laten we je laten zien hoe je €50k-€200k/jaar kunt besparen.`,
    cmo: `${baseWelcome} Als CMO, laat ik je graag onze **data-driven strategie tools** en **real-time analytics** zien.`,
    manager: `${baseWelcome} Als marketing manager, focus ik op **workflow efficiency** - we kunnen je 40+ uur/week besparen.`,
  }

  if (context.role && roleWelcomes[context.role]) {
    return roleWelcomes[context.role]
  }

  // Default personalized welcome
  return `${baseWelcome} Ik help je graag om het platform te ontdekken en te zien hoe het perfect past bij jouw marketing needs!`
}

/**
 * Get personalized module recommendation
 */
export function getPersonalizedModuleRecommendation(context: PersonalizationContext): string {
  if (context.personalizationLevel === 'off') {
    return 'Je kunt alle modules verkennen via de Explorer.'
  }

  const recommendations = getIndustryModuleRecommendations(context.industry)
  const topModule = recommendations[0]

  const moduleNames: Record<string, string> = {
    'ad-builder': 'AI Ad Builder',
    'content-pipeline': 'Content Pipeline',
    'campaign-orchestrator': 'Campaign Orchestrator',
    'analytics-lab': 'Analytics Lab',
    'multi-account': 'Multi-Account Management',
    'command-center': 'Command Center',
    'publishing-layer': 'Publishing Layer',
  }

  const moduleName = moduleNames[topModule] || topModule

  // Industry-specific recommendation
  const industryRecommendations: Record<string, string> = {
    ecommerce: `Voor e-commerce start ik vaak bij de **${moduleName}** - hier zie je hoe we productcampagnes automatiseren voor duizenden SKUs. 🛍️`,
    saas: `Voor SaaS bedrijven raad ik de **${moduleName}** aan - perfect voor lead nurturing en funnel optimization. 🚀`,
    agency: `Voor agencies is de **${moduleName}** vaak het meest interessant - multi-client management op schaal. 🎯`,
  }

  if (context.industry && industryRecommendations[context.industry]) {
    return industryRecommendations[context.industry]
  }

  return `Ik raad aan om te starten met de **${moduleName}** - dat geeft je een goede overview van wat we kunnen. ✨`
}

/**
 * Get personalized feature explanation
 */
export function getPersonalizedFeatureExplanation(
  featureName: string,
  context: PersonalizationContext
): string[] {
  if (context.personalizationLevel === 'minimal' || context.personalizationLevel === 'off') {
    return [] // No personalization
  }

  return getAdaptiveExamples(featureName, context)
}

/**
 * Get personalized CTA message
 */
export function getPersonalizedCTAMessage(context: PersonalizationContext): {
  message: string
  ctaText: string
  secondaryText?: string
} {
  const cta = getPersonalizedCTA(context)

  // High-value leads (Primary ICP)
  if (context.icpTier === 'primary') {
    return {
      message: `${cta.icon} Je profiel (ICP score: ${context.icpScore}) maakt je een **perfect fit** voor ons platform. Klaar voor een persoonlijk gesprek?`,
      ctaText: cta.primary,
      secondaryText: cta.secondary,
    }
  }

  // Medium-value leads (Secondary ICP)
  if (context.icpTier === 'secondary') {
    return {
      message: `${cta.icon} Op basis van je journey tot nu toe, denk ik dat je er klaar voor bent om de volgende stap te zetten!`,
      ctaText: cta.primary,
      secondaryText: cta.secondary,
    }
  }

  // Nurture leads
  return {
    message: `${cta.icon} Wil je meer weten over hoe FutureMarketingAI kan helpen met jouw marketing?`,
    ctaText: cta.primary,
    secondaryText: cta.secondary,
  }
}

/**
 * Get personalized journey suggestion
 */
export function getPersonalizedJourneySuggestionMessage(context: PersonalizationContext): string {
  if (context.personalizationLevel === 'off' || context.personalizationLevel === 'minimal') {
    return 'Ontdek alle modules in je eigen tempo via de Explorer.'
  }

  return getPersonalizedJourneySuggestion(context)
}

/**
 * Get personalized ROI message
 */
export function getPersonalizedROIMessage(context: PersonalizationContext): string {
  if (context.personalizationLevel === 'off') {
    return '💰 Gebruik onze ROI Calculator om te zien wat je kunt besparen!'
  }

  // Role-specific ROI messaging
  const roleROI: Record<string, string> = {
    owner:
      '💰 **Als founder:** Onze calculator laat zien hoeveel je kunt besparen op agency fees (€50k-€200k/jaar) en team costs.',
    cmo: '💰 **Als CMO:** Bereken de ROI van marketing automation - gemiddeld 40% efficiency gain + 3x campaign output.',
    manager:
      '💰 **Als manager:** Zie hoeveel tijd je terugkrijgt (40+ uur/week) om te focussen op strategie i.p.v. execution.',
    specialist:
      '💰 **ROI Calculator:** Ontdek wat je kunt besparen met AI-powered automation vs manual work.',
  }

  if (context.role && roleROI[context.role]) {
    return roleROI[context.role]
  }

  // ICP tier ROI messaging
  if (context.icpTier === 'primary') {
    return '💰 **Perfect Fit:** Voor teams zoals jouw zien we gemiddeld 340% ROI binnen 6 maanden. Laten we jouw specifieke savings berekenen!'
  }

  return '💰 Gebruik onze ROI Calculator om te zien hoeveel tijd en geld je kunt besparen met AI-automatisering!'
}

/**
 * Should show premium content based on context
 */
export function shouldShowPremiumContent(context: PersonalizationContext): boolean {
  return shouldShowPremiumFeatures(context)
}

/**
 * Get feature highlights based on role
 */
export function getPersonalizedFeatureHighlights(context: PersonalizationContext): string[] {
  if (context.personalizationLevel === 'off' || context.personalizationLevel === 'minimal') {
    return []
  }

  return getRoleFeatureHighlights(context.role)
}

/**
 * Add personalization metadata to response for analytics
 */
export function getPersonalizationMetadata(context: PersonalizationContext): {
  industry: string | null
  role: string | null
  icpTier: string
  personalizationLevel: string
  hasPersonalization: boolean
} {
  return {
    industry: context.industry,
    role: context.role,
    icpTier: context.icpTier,
    personalizationLevel: context.personalizationLevel,
    hasPersonalization: context.personalizationLevel !== 'off',
  }
}
