/**
 * Rich Message Examples
 *
 * Demo data for showcasing rich message capabilities
 */

import type { CardData } from '../../../types/chat'

// Example rich cards
export const exampleCards: CardData[] = [
  {
    title: '🎯 ROI Calculator',
    description: 'Bereken je potentiële return on investment met onze geavanceerde calculator.',
    icon: '📊',
    badge: {
      text: 'Populair',
      variant: 'success',
    },
    actions: [
      {
        label: 'Open Calculator',
        action: 'open_calculator',
        variant: 'primary',
        icon: 'arrow',
      },
      {
        label: 'Meer info',
        action: 'calculator_info',
        variant: 'secondary',
      },
    ],
  },
  {
    title: '🚀 AI Advisory',
    description: 'Ontvang persoonlijke AI-powered marketing strategie aanbevelingen.',
    icon: '🤖',
    badge: {
      text: 'Premium',
      variant: 'premium',
    },
    actions: [
      {
        label: 'Start Advisory',
        action: 'start_advisory',
        variant: 'primary',
        icon: 'sparkles',
      },
    ],
  },
  {
    title: '📅 Plan een Demo',
    description: 'Boek een persoonlijke demo met ons team en zie de kracht van automatisering.',
    icon: '🎬',
    actions: [
      {
        label: 'Boek Demo',
        action: 'book_demo',
        variant: 'primary',
        icon: 'calendar',
      },
      {
        label: 'Bekijk Testimonials',
        action: 'view_testimonials',
        variant: 'outline',
      },
    ],
  },
]

// Example carousel for modules
export const moduleCarousel: CardData[] = [
  {
    title: 'Content Factory',
    description: 'Genereer automatisch hoogwaardige content voor al je kanalen.',
    icon: '📝',
    badge: {
      text: 'AI-Powered',
      variant: 'info',
    },
    actions: [
      {
        label: 'Verken Module',
        action: 'explore_content_factory',
        variant: 'primary',
      },
    ],
  },
  {
    title: 'Campaign Manager',
    description: 'Orchestreer multi-channel campagnes vanuit één centraal platform.',
    icon: '🎯',
    actions: [
      {
        label: 'Verken Module',
        action: 'explore_campaign_manager',
        variant: 'primary',
      },
    ],
  },
  {
    title: 'Analytics Monitor',
    description: 'Real-time inzichten en predictive analytics voor je marketing.',
    icon: '📊',
    actions: [
      {
        label: 'Verken Module',
        action: 'explore_analytics',
        variant: 'primary',
      },
    ],
  },
]

// Example quick replies
export const welcomeQuickReplies = [
  {
    label: 'Wat kan dit platform?',
    value: 'explain_platform',
    icon: 'sparkles',
  },
  {
    label: 'Bereken mijn ROI',
    value: 'open_calculator',
    icon: 'calculator',
  },
  {
    label: 'Plan een demo',
    value: 'book_demo',
    icon: 'calendar',
  },
  {
    label: 'Ik heb een vraag',
    value: 'ask_question',
    icon: 'help',
  },
]

// Example achievements
export const achievements = {
  explorer: {
    title: '🎉 Explorer Badge Unlocked!',
    description: 'Je hebt alle modules ontdekt. Time om je ROI te berekenen!',
    icon: '🏆',
    points: 50,
  },
  calculator: {
    title: '💰 ROI Expert!',
    description: 'Je hebt de ROI Calculator gebruikt. Impressive results!',
    icon: '💎',
    points: 100,
  },
  engagement: {
    title: '⭐ Highly Engaged!',
    description: 'Je bent echt geïnteresseerd! Klaar voor een persoonlijke demo?',
    icon: '🚀',
    points: 75,
  },
}
