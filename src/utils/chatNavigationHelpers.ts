/**
 * Chat Navigation Helpers
 *
 * Provides contextual navigation actions and help content
 * based on user questions and current demo state
 */

import type { NavigationActionData } from '../components/ai-assistant/NavigationAction'

/**
 * Navigation intent mapping
 */
export type NavigationIntent =
  | 'calculator'
  | 'explorer'
  | 'dashboard'
  | 'strategy'
  | 'roi'
  | 'features'
  | 'analytics'
  | 'automation'

/**
 * Get navigation action for a specific intent
 */
export function getNavigationAction(intent: NavigationIntent): NavigationActionData | null {
  const actions: Record<NavigationIntent, NavigationActionData> = {
    calculator: {
      label: 'ROI Calculator',
      route: '/calculator',
      icon: 'calculator',
      ctaText: 'Bereken je ROI',
      helpText:
        'Ontdek hoeveel tijd en geld je bespaart met ons autonome marketing systeem. Vul je huidige situatie in voor een gepersonaliseerde berekening.',
      features: [
        'Realtime ROI berekening op basis van je team',
        'Vergelijking met huidige marketing kosten',
        'Projecties voor 12 en 24 maanden',
        'Download je persoonlijke business case',
      ],
    },
    explorer: {
      label: 'Platform Explorer',
      route: '/explorer#research-planning',
      icon: 'explorer',
      ctaText: 'Verken Research module',
      helpText:
        'Begin met Research & Planning - de eerste module van ons autonome marketing systeem. Diepgaand online onderzoek met Perplexity AI voor trends, voorspellingen en hashtag strategie.',
      features: [
        '🔍 Perplexity AI integratie voor real-time market research',
        '📊 Automatische trend analyse en voorspellingen',
        '🎯 Hashtag strategie optimalisatie',
        '📈 Competitor intelligence en benchmarking',
        '💡 Strategische inzichten voor 10-50 marketeers',
      ],
    },
    dashboard: {
      label: 'Dashboard & Analytics',
      route: '/dashboard',
      icon: 'dashboard',
      ctaText: 'Zie het dashboard',
      helpText:
        'Bekijk realtime metrics, performance data en AI-driven insights. Volledig transparante rapportage van alle marketing activiteiten.',
      features: [
        'Realtime performance metrics',
        'AI-driven recommendations',
        'Cross-channel attribution',
        'ROI tracking per campaign',
        'Automated reporting',
      ],
    },
    strategy: {
      label: 'Strategy Hub',
      route: '/dashboard?tab=strategy',
      icon: 'sparkles',
      ctaText: 'Open Strategy Hub',
      helpText:
        'Krijg AI-powered strategisch advies op basis van je data, industrie trends en best practices van 1000+ campagnes.',
      features: [
        'Gepersonaliseerde strategie aanbevelingen',
        'Competitor intelligence',
        'Trend analysis en forecasting',
        'Budget allocation optimizer',
        'Campaign planning templates',
      ],
    },
    roi: {
      label: 'ROI Calculator',
      route: '/calculator',
      icon: 'calculator',
      ctaText: 'Bereken besparing',
      helpText:
        'Zie exact hoeveel je bespaart: gemiddeld 312 uur/maand en €15,600 in labor costs. Plus 847% ROI op jaarbasis.',
      features: [
        '⏱️ Tijd besparing: Gemiddeld 20-30 uur per week',
        '💰 Kostenbesparing: Tot 70% reductie in marketing spend',
        '📊 ROI periode: Break-even binnen 3-6 maanden',
        '🎯 Personalisatie: Berekening op basis van jouw situatie',
        '📈 Groei: 3-5x meer output met zelfde team',
      ],
    },
    features: {
      label: 'Platform Features',
      route: '/explorer',
      icon: 'explorer',
      ctaText: 'Bekijk alle modules',
      helpText:
        'Volledig overzicht van alle modules in ons autonome marketing systeem. Elk onderdeel is autonoom maar werkt naadloos samen.',
      features: [
        '🧠 Research & Planning - AI-powered market research',
        '💼 Manager Workflow - Centrale workflow coördinatie',
        '📝 Content Pipeline - Snellere content productie',
        '📱 Telegram Control - Mobiele goedkeuring',
        '🚀 Publishing Layer - Multi-channel distributie',
        '📊 Analytics Lab - Real-time performance tracking',
        '🎨 Ad Builder Studio - AI-gegenereerde advertenties',
      ],
    },
    analytics: {
      label: 'Analytics Engine',
      route: '/dashboard',
      icon: 'dashboard',
      ctaText: 'Zie analytics',
      helpText:
        'Self-learning analytics die automatisch patronen detecteren, optimalisaties voorstellen en resultaten verbeteren. 23% performance lift per maand.',
      features: [
        'Automated anomaly detection',
        'Predictive performance modeling',
        'Cross-channel attribution',
        'Real-time optimization suggestions',
        'Custom dashboard builder',
      ],
    },
    automation: {
      label: 'Marketing Automation',
      route: '/explorer',
      icon: 'sparkles',
      ctaText: 'Zie automation',
      helpText:
        'Van content creation tot ad optimization - alles volledig geautomatiseerd. Het systeem leert van elke campaign en wordt slimmer over tijd.',
      features: [
        'End-to-end campaign automation',
        'Dynamic content generation',
        'Audience segmentation',
        'Budget allocation',
        'Performance optimization',
        'Multi-channel orchestration',
      ],
    },
  }

  return actions[intent] || null
}

/**
 * Detect navigation intent from user message
 */
export function detectNavigationIntent(message: string): NavigationIntent | null {
  const lowerMessage = message.toLowerCase()

  // Calculator related
  if (
    lowerMessage.includes('roi') ||
    lowerMessage.includes('bereken') ||
    lowerMessage.includes('calculator') ||
    lowerMessage.includes('besparing') ||
    lowerMessage.includes('kosten') ||
    lowerMessage.includes('hoeveel')
  ) {
    return 'calculator'
  }

  // Explorer related
  if (
    lowerMessage.includes('verken') ||
    lowerMessage.includes('explorer') ||
    lowerMessage.includes('modules') ||
    lowerMessage.includes('features') ||
    lowerMessage.includes('functionaliteit')
  ) {
    return 'explorer'
  }

  // Dashboard related
  if (
    lowerMessage.includes('dashboard') ||
    lowerMessage.includes('analytics') ||
    lowerMessage.includes('rapportage') ||
    lowerMessage.includes('data') ||
    lowerMessage.includes('metrics')
  ) {
    return 'dashboard'
  }

  // Strategy related
  if (
    lowerMessage.includes('strategi') ||
    lowerMessage.includes('advies') ||
    lowerMessage.includes('aanbeveling') ||
    lowerMessage.includes('planning')
  ) {
    return 'strategy'
  }

  // Automation related
  if (
    lowerMessage.includes('automat') ||
    lowerMessage.includes('ai') ||
    lowerMessage.includes('self-learning') ||
    lowerMessage.includes('autonoom')
  ) {
    return 'automation'
  }

  return null
}

/**
 * Get contextual help based on current route
 */
export function getContextualHelp(pathname: string): string {
  const helps: Record<string, string> = {
    '/': 'Je bent op de homepage. Wil je het platform verkennen, je ROI berekenen, of het dashboard zien?',
    '/explorer':
      'Je bekijkt nu de Platform Explorer. Hier zie je onze modules. Klik op een module voor details, of vraag me wat je wilt weten!',
    '/calculator':
      'Je bent in de ROI Calculator. Vul je gegevens in om te zien hoeveel je bespaart. Vragen over bepaalde velden? Vraag het me!',
    '/dashboard':
      'Je bekijkt het Dashboard. Hier zie je performance metrics en AI insights. Wil je naar de Strategy Hub, of heb je vragen over de data?',
    '/ad-builder':
      'Je bent in de AI Ad Builder. Maak je eerste AI-gegenereerde ad in 3 stappen. Wil je een voorbeeld zien?',
  }

  return helps[pathname] || 'Waarmee kan ik je helpen in de demo?'
}

/**
 * Get suggested next actions based on journey progress
 */
export interface SuggestedAction {
  label: string
  intent: NavigationIntent
  priority: number // 1-10, higher = more important
}

export function getSuggestedActions(
  currentPath: string,
  modulesExplored: number,
  calculatorCompleted: boolean
): SuggestedAction[] {
  const suggestions: SuggestedAction[] = []

  // Not explored yet - suggest explorer (highest priority)
  if (modulesExplored === 0 && currentPath !== '/explorer') {
    suggestions.push({
      label: '🚀 Start rondleiding',
      intent: 'explorer',
      priority: 10,
    })
  }

  // Explored but no calculator - suggest calculator
  if (modulesExplored >= 2 && !calculatorCompleted && currentPath !== '/calculator') {
    suggestions.push({
      label: '💰 Bereken ROI',
      intent: 'calculator',
      priority: 9,
    })
  }

  // Calculator done - suggest dashboard
  if (calculatorCompleted && currentPath !== '/dashboard') {
    suggestions.push({
      label: 'Zie het dashboard',
      intent: 'dashboard',
      priority: 8,
    })
  }

  // Always offer demo booking
  suggestions.push({
    label: '📅 Plan demo',
    intent: 'demo' as any,
    priority: 7,
  })

  // Always offer analytics
  if (currentPath !== '/dashboard') {
    suggestions.push({
      label: 'Zie analytics',
      intent: 'analytics',
      priority: 5,
    })
  }

  return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 3)
}
