'use client'

import { useLocale } from 'next-intl'

/**
 * Locale-aware copy + formatting for the chatbot sidebar cards.
 *
 * Card DATA (pricing, case study, recommendations) is localized server-side in
 * the tool layer. This module localizes the card CHROME (headers, labels, CTAs)
 * and number/period formatting so the sidebar reads fully in the visitor's
 * language on /nl, /en and /es. NL is the source of truth.
 */

export type CardLocale = 'nl' | 'en' | 'es'

const INTL_LOCALE: Record<CardLocale, string> = { nl: 'nl-NL', en: 'en-US', es: 'es-ES' }

function normalize(value: string): CardLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

interface CardCopy {
  pricingHeader: string
  skillsHeader: string
  viewSkill: string
  bookCall: string
  popular: string
  comingSoon: string
  roiHeader: string
  recommendation: string
  assessmentFactors: string
  keyFactors: string
  leadScore: string
  monthlySavings: string
  annualSavings: string
  hoursBack: string
  hoursSavedPerMonth: string
  laborSavings: string
  toolSavings: string
  implementationTime: string
  roi: string
  payback: string
  teamSize: string
  roiCta: string
  tellMeMorePrefix: string
  caseChallenge: string
  caseSolution: string
  caseResults: string
  readCase: string
  similarResults: string
  bookingTitle: string
  bookingSubtitle: string
  trustPersonal: string
  trustResponse: string
  trustNoStrings: string
}

const COPY: Record<CardLocale, CardCopy> = {
  nl: {
    pricingHeader: 'Tarieven',
    skillsHeader: 'Onze vaardigheden',
    viewSkill: 'Bekijk vaardigheid',
    bookCall: 'Plan een gesprek',
    popular: 'Populair',
    comingSoon: 'Binnenkort',
    roiHeader: 'ROI berekening',
    recommendation: 'Aanbeveling',
    assessmentFactors: 'Beoordelingsfactoren',
    keyFactors: 'Sleutelfactoren',
    leadScore: 'Lead score',
    monthlySavings: 'Maandelijkse besparing',
    annualSavings: 'Jaarlijkse besparing',
    hoursBack: 'Uren terug/mnd',
    hoursSavedPerMonth: 'Uren bespaard/mnd',
    laborSavings: 'Loonbesparing/mnd',
    toolSavings: 'Toolbesparing/mnd',
    implementationTime: 'Implementatietijd',
    roi: 'ROI',
    payback: 'Terugverdientijd',
    teamSize: 'Teamgrootte',
    roiCta: 'Ontvang jouw ROI-analyse, plan een gesprek',
    tellMeMorePrefix: 'Vertel me meer over',
    caseChallenge: 'Uitdaging',
    caseSolution: 'Oplossing',
    caseResults: 'Resultaten',
    readCase: 'Lees de volledige case study',
    similarResults: 'Vergelijkbare resultaten behalen? Plan een gesprek',
    bookingTitle: 'Plan een gesprek',
    bookingSubtitle: 'Samen kijken of het past',
    trustPersonal: 'Persoonlijk gesprek',
    trustResponse: 'Reactie binnen 24u',
    trustNoStrings: 'Geen verplichtingen',
  },
  en: {
    pricingHeader: 'Pricing',
    skillsHeader: 'Our skills',
    viewSkill: 'View skill',
    bookCall: 'Book a call',
    popular: 'Popular',
    comingSoon: 'Coming soon',
    roiHeader: 'ROI calculation',
    recommendation: 'Recommendation',
    assessmentFactors: 'Assessment factors',
    keyFactors: 'Key factors',
    leadScore: 'Lead score',
    monthlySavings: 'Monthly savings',
    annualSavings: 'Annual savings',
    hoursBack: 'Hours saved/mo',
    hoursSavedPerMonth: 'Hours saved/mo',
    laborSavings: 'Labour savings/mo',
    toolSavings: 'Tool savings/mo',
    implementationTime: 'Implementation time',
    roi: 'ROI',
    payback: 'Payback',
    teamSize: 'Team size',
    roiCta: 'Get your ROI analysis, book a call',
    tellMeMorePrefix: 'Tell me more about',
    caseChallenge: 'Challenge',
    caseSolution: 'Solution',
    caseResults: 'Results',
    readCase: 'Read the full case study',
    similarResults: 'Want similar results? Book a call',
    bookingTitle: 'Book a call',
    bookingSubtitle: "Let's see if it's a fit",
    trustPersonal: 'Personal conversation',
    trustResponse: 'Reply within 24h',
    trustNoStrings: 'No obligations',
  },
  es: {
    pricingHeader: 'Tarifas',
    skillsHeader: 'Nuestras habilidades',
    viewSkill: 'Ver habilidad',
    bookCall: 'Agenda una llamada',
    popular: 'Popular',
    comingSoon: 'Próximamente',
    roiHeader: 'Cálculo de ROI',
    recommendation: 'Recomendación',
    assessmentFactors: 'Factores de evaluación',
    keyFactors: 'Factores clave',
    leadScore: 'Puntuación de lead',
    monthlySavings: 'Ahorro mensual',
    annualSavings: 'Ahorro anual',
    hoursBack: 'Horas/mes',
    hoursSavedPerMonth: 'Horas ahorradas/mes',
    laborSavings: 'Ahorro salarial/mes',
    toolSavings: 'Ahorro en herramientas/mes',
    implementationTime: 'Tiempo de implementación',
    roi: 'ROI',
    payback: 'Amortización',
    teamSize: 'Tamaño del equipo',
    roiCta: 'Recibe tu análisis de ROI, agenda una llamada',
    tellMeMorePrefix: 'Cuéntame más sobre',
    caseChallenge: 'Desafío',
    caseSolution: 'Solución',
    caseResults: 'Resultados',
    readCase: 'Lee el caso completo',
    similarResults: '¿Resultados similares? Agenda una llamada',
    bookingTitle: 'Agenda una llamada',
    bookingSubtitle: 'Veamos si encaja',
    trustPersonal: 'Conversación personal',
    trustResponse: 'Respuesta en 24h',
    trustNoStrings: 'Sin compromisos',
  },
}

export interface CardCopyHandle {
  locale: CardLocale
  t: CardCopy
  money: (value: number | string | undefined) => string | null
  payback: (months: number) => string
}

function formatMoney(locale: CardLocale, value: number | string | undefined): string | null {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') return value
  return `€${new Intl.NumberFormat(INTL_LOCALE[locale]).format(value)}`
}

function formatPayback(locale: CardLocale, months: number): string {
  if (locale === 'en') return `${months} month${months !== 1 ? 's' : ''}`
  if (locale === 'es') return `${months} mes${months !== 1 ? 'es' : ''}`
  return `${months} maand${months !== 1 ? 'en' : ''}`
}

export function useCardCopy(): CardCopyHandle {
  const locale = normalize(useLocale())
  return {
    locale,
    t: COPY[locale],
    money: (value) => formatMoney(locale, value),
    payback: (months) => formatPayback(locale, months),
  }
}
