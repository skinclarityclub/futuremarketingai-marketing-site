'use client'

import { useLocale } from 'next-intl'

/**
 * Locale-aware copy + formatting for the chatbot cards.
 *
 * Card DATA (pricing, case study, recommendations) is localized server-side in
 * the tool layer. This module localizes the card CHROME (headers, labels, CTAs)
 * and number/period formatting so the chat reads fully in the visitor's
 * language on /nl, /en and /es. NL is the source of truth.
 */

export type CardLocale = 'nl' | 'en' | 'es'

const INTL_LOCALE: Record<CardLocale, string> = {
  nl: 'nl-NL',
  en: 'en-US',
  es: 'es-ES',
}

function normalize(value: string): CardLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

interface CardCopy {
  pricingHeader: string
  skillsHeader: string
  popular: string
  comingSoon: string
  roiHeader: string
  monthlySavings: string
  roi: string
  payback: string
  readCase: string
  allSkills: string
  allPricing: string
  bookingTitle: string
  bookingSubtitle: string
  trustPersonal: string
  trustResponse: string
  trustNoStrings: string
  assumptions: (hoursPerWeek: number, subscription: string) => string
}

const COPY: Record<CardLocale, CardCopy> = {
  nl: {
    pricingHeader: 'Tarieven',
    skillsHeader: 'Onze vaardigheden',
    popular: 'Populair',
    comingSoon: 'Binnenkort',
    roiHeader: 'ROI berekening',
    monthlySavings: 'Maandelijkse besparing',
    roi: 'ROI',
    payback: 'Terugverdientijd',
    readCase: 'Lees de case →',
    allSkills: 'Alle vaardigheden →',
    allPricing: 'Alle prijzen →',
    bookingTitle: 'Plan een gesprek',
    bookingSubtitle: 'Samen kijken of het past',
    trustPersonal: 'Persoonlijk gesprek',
    trustResponse: 'Reactie binnen 48 uur',
    trustNoStrings: 'Geen verplichtingen',
    assumptions: (h, s) =>
      `Gebaseerd op ${h} uur per week bespaard en ${s} abonnementskosten per maand.`,
  },
  en: {
    pricingHeader: 'Pricing',
    skillsHeader: 'Our skills',
    popular: 'Popular',
    comingSoon: 'Coming soon',
    roiHeader: 'ROI calculation',
    monthlySavings: 'Monthly savings',
    roi: 'ROI',
    payback: 'Payback',
    readCase: 'Read the case →',
    allSkills: 'All skills →',
    allPricing: 'All prices →',
    bookingTitle: 'Book a call',
    bookingSubtitle: "Let's see if it's a fit",
    trustPersonal: 'Personal conversation',
    trustResponse: 'Reply within 48 hours',
    trustNoStrings: 'No obligations',
    assumptions: (h, s) =>
      `Based on ${h} hours saved per week and ${s} subscription cost per month.`,
  },
  es: {
    pricingHeader: 'Tarifas',
    skillsHeader: 'Nuestras habilidades',
    popular: 'Popular',
    comingSoon: 'Próximamente',
    roiHeader: 'Cálculo de ROI',
    monthlySavings: 'Ahorro mensual',
    roi: 'ROI',
    payback: 'Amortización',
    readCase: 'Lee el caso →',
    allSkills: 'Todas las habilidades →',
    allPricing: 'Todas las tarifas →',
    bookingTitle: 'Agenda una llamada',
    bookingSubtitle: 'Veamos si encaja',
    trustPersonal: 'Conversación personal',
    trustResponse: 'Respuesta en 48 horas',
    trustNoStrings: 'Sin compromisos',
    assumptions: (h, s) =>
      `Basado en ${h} horas ahorradas por semana y ${s} de suscripción al mes.`,
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
