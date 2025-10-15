/**
 * Assistant Journey Configurations
 *
 * Defines personalized demo journeys for each industry,
 * including steps, welcome messages, tips, and milestones.
 *
 * @module assistantJourneys
 */

import type { JourneyStep, JourneyMilestone } from '../stores/journeyStore'

/**
 * Journey Configuration per Industry
 */
export interface JourneyConfig {
  industryId: string
  welcomeMessage: string
  steps: Omit<JourneyStep, 'completed' | 'unlocked'>[]
  tips: Record<string, string>
  milestones: JourneyMilestone[]
}

/**
 * Common Milestones (shared across all industries)
 */
const commonMilestones: JourneyMilestone[] = [
  {
    id: 'first_step',
    title: 'Eerste Stap',
    description: 'Je hebt je eerste demo module bekeken!',
    badgeIcon: '🎯',
    requirement: 'View first module',
    achieved: false,
  },
  {
    id: 'explorer',
    title: 'Ontdekker',
    description: 'Je hebt 3 verschillende modules bekeken',
    badgeIcon: '🔍',
    requirement: 'View 3 modules',
    achieved: false,
  },
  {
    id: 'deep_dive',
    title: 'Deep Dive',
    description: 'Je hebt 5+ modules grondig verkend',
    badgeIcon: '🏊',
    requirement: 'View 5+ modules',
    achieved: false,
  },
  {
    id: 'roi_calculator',
    title: 'ROI Expert',
    description: 'Je hebt je potentiële ROI berekend',
    badgeIcon: '💰',
    requirement: 'Complete ROI Calculator',
    achieved: false,
  },
  {
    id: 'demo_booked',
    title: 'Volgende Stap',
    description: 'Je hebt een demo gepland met ons team!',
    badgeIcon: '📅',
    requirement: 'Schedule demo',
    achieved: false,
  },
  {
    id: 'journey_master',
    title: 'Journey Master',
    description: 'Je hebt de volledige demo ervaren!',
    badgeIcon: '🏆',
    requirement: 'Complete all steps',
    achieved: false,
  },
]

/**
 * E-commerce Journey
 */
export const ecommerceJourney: JourneyConfig = {
  industryId: 'ecommerce',
  welcomeMessage:
    '👋 Welkom! Ik help je ontdekken hoe AI je e-commerce marketing transformeert. Klaar voor een rondleiding?',

  steps: [
    {
      id: 'intro',
      title: 'Verken het Platform',
      description: 'Bekijk het Command Center en ontdek de belangrijkste features',
      order: 1,
      moduleId: 'command-center',
    },
    {
      id: 'ad_builder',
      title: 'AI Ad Builder Studio',
      description: 'Zie hoe we in minuten productadvertenties genereren',
      order: 2,
      moduleId: 'ad-builder',
    },
    {
      id: 'analytics',
      title: 'Analytics Hub',
      description: 'Volg je cross-platform performance in één dashboard',
      order: 3,
      moduleId: 'analytics-hub',
    },
    {
      id: 'roi_calculator',
      title: 'Bereken Je ROI',
      description: 'Zie hoeveel tijd en geld je bespaart',
      order: 4,
      moduleId: 'roi-calculator',
    },
    {
      id: 'schedule',
      title: 'Plan Je Demo',
      description: 'Bespreek je specifieke use case met ons team',
      order: 5,
    },
  ],

  tips: {
    ad_builder:
      'E-commerce brands besparen gemiddeld 15-20 uur per week met onze AI Ad Builder. Je upload een productfoto, en onze AI genereert varianten voor alle kanalen.',
    analytics:
      'Geen switching meer tussen 5 verschillende dashboards. Zie al je Meta, Google, TikTok en LinkedIn data in één overzicht.',
    roi_calculator:
      'De gemiddelde e-commerce klant bespaart €5.000/maand op agency kosten en ziet 30% snellere campaign launches.',
    schedule:
      'Perfect! Je hebt de kern gezien. Laten we bespreken hoe dit voor jouw specifieke producten werkt.',
  },

  milestones: commonMilestones,
}

/**
 * SaaS Journey
 */
export const saasJourney: JourneyConfig = {
  industryId: 'saas',
  welcomeMessage:
    '👋 Hey! Klaar om te zien hoe AI je SaaS marketing kan automatiseren? Ik leid je door de highlights.',

  steps: [
    {
      id: 'intro',
      title: 'Platform Overzicht',
      description: 'Bekijk het Command Center en de core capabilities',
      order: 1,
      moduleId: 'command-center',
    },
    {
      id: 'campaign_orchestra',
      title: 'Campaign Orchestrator',
      description: 'Lanceer multi-channel campaigns in minuten',
      order: 2,
      moduleId: 'campaign-orchestrator',
    },
    {
      id: 'content_pipeline',
      title: 'Content Pipeline',
      description: 'Automatiseer je content workflow van idee tot publicatie',
      order: 3,
      moduleId: 'content-pipeline',
    },
    {
      id: 'roi_calculator',
      title: 'ROI Calculator',
      description: 'Bereken je potentiële besparingen',
      order: 4,
      moduleId: 'roi-calculator',
    },
    {
      id: 'schedule',
      title: 'Plan Een Call',
      description: 'Bespreek integratie met je tech stack',
      order: 5,
    },
  ],

  tips: {
    campaign_orchestra:
      'SaaS companies lanceren campaigns 5x sneller met onze orchestrator. Plan je release, en AI coördineert alle channels.',
    content_pipeline:
      'Van blog posts tot social content - onze AI genereert consistent, on-brand content voor je hele funnel.',
    roi_calculator:
      'Typische SaaS marketing teams besparen 25-30 uur per week en verdubbelen hun campaign output.',
    schedule:
      'Geweldig! Laten we je specifieke use case doorspreken: welke kanalen, integrations, en workflows zijn voor jou prioriteit?',
  },

  milestones: commonMilestones,
}

/**
 * Agency Journey
 */
export const agencyJourney: JourneyConfig = {
  industryId: 'agency',
  welcomeMessage:
    '👋 Welkom! Ik laat je zien hoe AI je agency schaalt zonder extra headcount. Ready?',

  steps: [
    {
      id: 'intro',
      title: 'Platform Tour',
      description: 'Zie hoe agencies hun workflow stroomlijnen',
      order: 1,
      moduleId: 'command-center',
    },
    {
      id: 'multi_account',
      title: 'Multi-Account Manager',
      description: 'Beheer alle klanten vanuit één interface',
      order: 2,
      moduleId: 'multi-account-manager',
    },
    {
      id: 'ad_builder',
      title: 'AI Ad Builder',
      description: 'Genereer client campaigns op schaal',
      order: 3,
      moduleId: 'ad-builder',
    },
    {
      id: 'roi_calculator',
      title: 'ROI voor Agencies',
      description: 'Bereken je capacity gains',
      order: 4,
      moduleId: 'roi-calculator',
    },
    {
      id: 'schedule',
      title: 'Agency Partnership',
      description: 'Bespreek white-label en volume pricing',
      order: 5,
    },
  ],

  tips: {
    multi_account:
      'Agencies beheren gemiddeld 15+ client accounts met ons platform. Switch tussen clients met één klik.',
    ad_builder:
      'Produceer client campaigns 10x sneller. Perfect voor agencies die willen schalen zonder team uit te breiden.',
    roi_calculator:
      'Agencies verhogen hun client capacity met 300% zonder extra hires. Typische ROI: €15.000/maand extra margin.',
    schedule:
      'Perfect timing! Veel agencies zijn geïnteresseerd in white-label options. Laten we je specifieke setup bespreken.',
  },

  milestones: commonMilestones,
}

/**
 * Other/General Journey
 */
export const generalJourney: JourneyConfig = {
  industryId: 'other',
  welcomeMessage:
    '👋 Welkom bij FutureMarketingAI! Ik help je de mogelijkheden verkennen. Klaar voor een tour?',

  steps: [
    {
      id: 'intro',
      title: 'Platform Overzicht',
      description: 'Ontdek wat AI marketing automation voor je kan doen',
      order: 1,
      moduleId: 'command-center',
    },
    {
      id: 'explore',
      title: 'Verken Features',
      description: 'Bekijk de modules die relevant zijn voor jouw use case',
      order: 2,
    },
    {
      id: 'roi_calculator',
      title: 'ROI Calculator',
      description: 'Bereken je potentiële ROI',
      order: 3,
      moduleId: 'roi-calculator',
    },
    {
      id: 'schedule',
      title: 'Plan Een Demo',
      description: 'Bespreek je specifieke situatie met ons',
      order: 4,
    },
  ],

  tips: {
    explore:
      'Neem de tijd om rond te kijken. Elke module toont een ander aspect van autonomous AI marketing.',
    roi_calculator:
      'Zelfs zonder specifieke industrie zien we typisch 40-60% tijdsbesparing en 25-50% kostenbesparing.',
    schedule:
      'Geweldig! In een persoonlijke demo kunnen we dieper ingaan op jouw specifieke needs.',
  },

  milestones: commonMilestones,
}

/**
 * Journey Configuration Map
 */
export const journeyConfigs: Record<string, JourneyConfig> = {
  ecommerce: ecommerceJourney,
  saas: saasJourney,
  agency: agencyJourney,
  other: generalJourney,
}

/**
 * Get journey configuration by industry ID
 */
export const getJourneyConfig = (industryId: string | null): JourneyConfig => {
  if (!industryId || !journeyConfigs[industryId]) {
    return generalJourney
  }
  return journeyConfigs[industryId]
}

/**
 * Get contextual tip for current context
 */
export const getContextualTip = (
  industryId: string | null,
  context: string
): string | undefined => {
  const config = getJourneyConfig(industryId)
  return config.tips[context]
}
