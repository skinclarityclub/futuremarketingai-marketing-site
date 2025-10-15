/**
 * Page Context Utilities
 *
 * Provides context-aware chat features:
 * - Location detection
 * - Contextual greetings
 * - Page-specific quick replies
 * - Progress tracking
 */

import type { QuickReply } from '../types/chat'

export type PageRoute = 'home' | 'calculator' | 'explorer' | 'dashboard' | 'unknown'

/**
 * Detect current page from pathname
 */
export function detectPage(pathname: string): PageRoute {
  if (pathname === '/' || pathname === '') {
    return 'home'
  }
  if (pathname.includes('calculator')) {
    return 'calculator'
  }
  if (pathname.includes('explorer')) {
    return 'explorer'
  }
  if (pathname.includes('dashboard')) {
    return 'dashboard'
  }
  return 'unknown'
}

/**
 * Get contextual greeting for current page
 */
export function getContextualGreeting(
  page: PageRoute,
  isFirstVisit: boolean,
  visitedPages: string[]
): string {
  const progress = visitedPages.length
  const totalPages = 3 // home, calculator, explorer

  const greetings: Record<PageRoute, string> = {
    home: isFirstVisit
      ? '✨ Welkom bij FutureMarketingAI! Ik ben ARIA, jouw persoonlijke demo gids. Waar kan ik je mee helpen?'
      : `✨ Hé, welkom terug! Je hebt ${progress} van ${totalPages} secties bezocht. Zullen we verder gaan?`,

    calculator:
      '💰 Perfect! Je bekijkt de ROI Calculator. Laten we samen kijken hoeveel tijd en geld je kunt besparen.',

    explorer:
      '🚀 Super! Je verkent de Platform Explorer. Hier ontdek je alle 7 AI-modules. Welke module interesseert je het meest?',

    dashboard:
      '📊 Geweldig! Op het Dashboard zie je alle features in één oogopslag. Zal ik je een rondleiding geven?',

    unknown: '✨ Hallo! Ik ben ARIA, jouw AI Marketing Assistent. Laten we samen verkennen!',
  }

  return greetings[page]
}

/**
 * Get page-specific quick replies
 */
export function getPageSpecificReplies(page: PageRoute): QuickReply[] {
  const pageReplies: Record<PageRoute, QuickReply[]> = {
    home: [
      { label: '🚀 Start rondleiding', value: 'explorer', icon: 'explorer' },
      { label: '💰 Bereken ROI', value: 'calculator', icon: 'calculator' },
      { label: '📅 Plan demo', value: 'plan demo', icon: 'calendar' },
    ],

    calculator: [
      { label: '📅 Plan demo', value: 'plan demo', icon: 'calendar' },
      { label: '💡 Bereken nu', value: 'calculate_now', icon: 'calculator' },
      { label: '🎨 Bekijk modules', value: 'explorer', icon: 'explorer' },
    ],

    explorer: [
      { label: '✍️ Content Factory', value: 'module_content', icon: 'sparkles' },
      { label: '🎯 Lead Scoring', value: 'module_leads', icon: 'sparkles' },
      { label: '📅 Plan demo', value: 'plan demo', icon: 'calendar' },
    ],

    dashboard: [
      { label: '📊 Dashboard uitleg', value: 'dashboard_help', icon: 'sparkles' },
      { label: '🎯 Volgende stap', value: 'next_step', icon: 'message' },
      { label: '📅 Plan demo', value: 'plan demo', icon: 'calendar' },
    ],

    unknown: [
      { label: '✨ Ontdek ARIA', value: 'platform_info', icon: 'sparkles' },
      { label: '💰 ROI Calculator', value: 'calculator', icon: 'calculator' },
      { label: '📅 Plan demo', value: 'plan demo', icon: 'calendar' },
    ],
  }

  return pageReplies[page]
}

/**
 * Get page-specific FAQ/help content
 */
export function getPageFAQ(page: PageRoute): Array<{ question: string; answer: string }> {
  const faqs: Record<PageRoute, Array<{ question: string; answer: string }>> = {
    calculator: [
      {
        question: 'Hoe gebruik ik de calculator?',
        answer:
          'Vul je huidige team size, marketing spend en channels in. De calculator berekent automatisch je potentiële besparing en ROI op 6 en 12 maanden.',
      },
      {
        question: 'Zijn deze cijfers realistisch?',
        answer:
          'Ja! Onze berekeningen zijn gebaseerd op data van 500+ klanten. Gemiddelde besparing is 20-30 uur per week en 70% lagere kosten.',
      },
      {
        question: 'Kan ik de resultaten exporteren?',
        answer:
          'Absoluut! Klik op "Download Business Case" om een professioneel PDF rapport te krijgen voor intern gebruik.',
      },
    ],

    explorer: [
      {
        question: 'Hoeveel modules zijn er?',
        answer:
          'Ons platform heeft 7 core modules: Content Factory, Lead Scoring, Campaign Optimizer, AI Advisory, Social Intelligence, Workflow Automation en Customer Insights.',
      },
      {
        question: 'Werken alle modules samen?',
        answer:
          'Ja! Elke module deelt data met de anderen. Lead Scoring informeert bijvoorbeeld Campaign Optimizer voor betere targeting.',
      },
      {
        question: 'Kan ik modules individueel gebruiken?',
        answer:
          'Technisch wel, maar de échte kracht zit in de synergie. Volledige integratie geeft 3-5x betere resultaten.',
      },
    ],

    home: [
      {
        question: 'Wat is FutureMarketingAI?',
        answer:
          'Een volledig autonoom marketing platform dat je team 20-30 uur per week bespaart door AI-gedreven automatisering van content, campaigns, lead scoring en meer.',
      },
      {
        question: 'Voor wie is dit platform?',
        answer:
          'Voor B2B marketing teams (2-10 personen) die meer willen bereiken met minder manueel werk. Ideaal voor SaaS, Tech en Professional Services.',
      },
      {
        question: 'Hoe start ik?',
        answer:
          'Begin met de ROI Calculator om je besparing te zien, verken dan de Platform Explorer om alle modules te ontdekken. Of plan direct een demo!',
      },
    ],

    dashboard: [],
    unknown: [],
  }

  return faqs[page] || []
}

/**
 * Format progress message
 */
export function getProgressMessage(visitedPages: string[]): string {
  const pages = ['/', '/calculator', '/explorer']
  const visited = visitedPages.filter((p) => pages.includes(p)).length
  const total = pages.length

  if (visited === 0) {
    return '🚀 Je bent net begonnen met de demo. Laten we alles verkennen!'
  }

  if (visited === total) {
    return '🎉 Geweldig! Je hebt alle secties gezien. Klaar om de volgende stap te zetten?'
  }

  const percentage = Math.round((visited / total) * 100)
  return `📊 Je hebt ${visited} van ${total} secties bezocht (${percentage}%). Zullen we verder gaan?`
}
