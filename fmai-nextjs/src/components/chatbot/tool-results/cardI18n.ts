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
  hoursHeader: string
  perWeekManual: string
  perMonthManual: string
  hours: (n: number) => string
  subscription: (brands: number) => string
  ownHoursNote: string
  readCase: string
  allSkills: string
  allPricing: string
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
    popular: 'Populair',
    comingSoon: 'Binnenkort',
    hoursHeader: 'Jullie uren nu',
    perWeekManual: 'per week handmatig',
    perMonthManual: 'per maand handmatig',
    hours: (n) => `${n.toLocaleString(INTL_LOCALE.nl)} uur`,
    subscription: (b) => `abonnement per maand (${b} merken)`,
    ownHoursNote:
      'Dit zijn jullie eigen uren. Hoeveel Clyde daarvan overneemt is nog niet gemeten; in het gesprek rekenen we het uit met jullie cijfers.',
    readCase: 'Lees de case →',
    allSkills: 'Alle vaardigheden →',
    allPricing: 'Alle prijzen →',
    bookingTitle: 'Plan een gesprek',
    bookingSubtitle: 'Samen kijken of het past',
    trustPersonal: 'Persoonlijk gesprek',
    trustResponse: 'Reactie binnen 48 uur',
    trustNoStrings: 'Geen verplichtingen',
  },
  en: {
    pricingHeader: 'Pricing',
    skillsHeader: 'Our skills',
    popular: 'Popular',
    comingSoon: 'Coming soon',
    hoursHeader: "Your team's hours today",
    perWeekManual: 'per week, manual',
    perMonthManual: 'per month, manual',
    hours: (n) => `${n.toLocaleString(INTL_LOCALE.en)} hours`,
    subscription: (b) => `subscription per month (${b} brands)`,
    ownHoursNote:
      'These are your own hours. How much of them Clyde takes over is not measured yet; in the call we work it out with your numbers.',
    readCase: 'Read the case →',
    allSkills: 'All skills →',
    allPricing: 'All prices →',
    bookingTitle: 'Book a call',
    bookingSubtitle: "Let's see if it's a fit",
    trustPersonal: 'Personal conversation',
    trustResponse: 'Reply within 48 hours',
    trustNoStrings: 'No obligations',
  },
  es: {
    pricingHeader: 'Tarifas',
    skillsHeader: 'Nuestras habilidades',
    popular: 'Popular',
    comingSoon: 'Próximamente',
    hoursHeader: 'Horas de tu equipo hoy',
    perWeekManual: 'por semana, a mano',
    perMonthManual: 'por mes, a mano',
    hours: (n) => `${n.toLocaleString(INTL_LOCALE.es)} horas`,
    subscription: (b) => `suscripción al mes (${b} marcas)`,
    ownHoursNote:
      'Son las horas de tu propio equipo. Cuánto asume Clyde aún no está medido; en la llamada lo calculamos con tus cifras.',
    readCase: 'Lee el caso →',
    allSkills: 'Todas las habilidades →',
    allPricing: 'Todas las tarifas →',
    bookingTitle: 'Agenda una llamada',
    bookingSubtitle: 'Veamos si encaja',
    trustPersonal: 'Conversación personal',
    trustResponse: 'Respuesta en 48 horas',
    trustNoStrings: 'Sin compromisos',
  },
}

export interface CardCopyHandle {
  locale: CardLocale
  t: CardCopy
  money: (value: number | string | undefined) => string | null
}

function formatMoney(locale: CardLocale, value: number | string | undefined): string | null {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') return value
  return `€${new Intl.NumberFormat(INTL_LOCALE[locale]).format(value)}`
}

export function useCardCopy(): CardCopyHandle {
  const locale = normalize(useLocale())
  return {
    locale,
    t: COPY[locale],
    money: (value) => formatMoney(locale, value),
  }
}
