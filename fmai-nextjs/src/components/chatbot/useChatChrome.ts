'use client'

import { useLocale } from 'next-intl'

/**
 * Locale-aware chrome for the Clyde chat widget: sidebar panel titles, follow-up
 * chips, message-action labels and header status. Card DATA + card chrome live in
 * tool-results/cardI18n; this covers the surrounding widget shell so /en and /es
 * no longer show Dutch titles ("Onze vaardigheden") over localized cards.
 *
 * The follow-up chips are also SENT as messages when clicked, so localizing them
 * keeps Clyde answering in the visitor's language.
 *
 * NL is the source of truth. A handful of NL aria-labels ("Sluit chat",
 * "Opnieuw genereren") and the SidePanel aria-labels are relied on by the e2e
 * suite (which runs on /nl) — keep their NL values byte-identical.
 */

export type ChatLocale = 'nl' | 'en' | 'es'

function normalize(value: string): ChatLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

const PANEL_TITLES: Record<ChatLocale, Record<string, string>> = {
  nl: {
    get_skills: 'Onze vaardigheden',
    get_pricing_info: 'Tarieven',
    get_case_study: 'Case study',
    book_call: 'Plan een gesprek',
    qualify_lead: 'Jouw match',
    get_roi_estimate: 'ROI berekening',
    search_products: 'Producten',
    get_product_details: 'Productdetails',
    build_routine: 'Routine',
    search_knowledge_base: 'Kennisbank',
    create_ticket: 'Aanvraag',
    check_status: 'Status',
    remember_context: 'Wat Clyde onthoudt',
  },
  en: {
    get_skills: 'Our skills',
    get_pricing_info: 'Pricing',
    get_case_study: 'Case study',
    book_call: 'Book a call',
    qualify_lead: 'Your match',
    get_roi_estimate: 'ROI calculation',
    search_products: 'Products',
    get_product_details: 'Product details',
    build_routine: 'Routine',
    search_knowledge_base: 'Knowledge base',
    create_ticket: 'Request',
    check_status: 'Status',
    remember_context: 'What Clyde remembers',
  },
  es: {
    get_skills: 'Nuestras habilidades',
    get_pricing_info: 'Tarifas',
    get_case_study: 'Caso de éxito',
    book_call: 'Agenda una llamada',
    qualify_lead: 'Tu encaje',
    get_roi_estimate: 'Cálculo de ROI',
    search_products: 'Productos',
    get_product_details: 'Detalles del producto',
    build_routine: 'Rutina',
    search_knowledge_base: 'Base de conocimiento',
    create_ticket: 'Solicitud',
    check_status: 'Estado',
    remember_context: 'Lo que Clyde recuerda',
  },
}

const PANEL_TITLE_FALLBACK: Record<ChatLocale, string> = {
  nl: 'Details',
  en: 'Details',
  es: 'Detalles',
}

const FOLLOWUPS: Record<ChatLocale, Record<string, string[]>> = {
  nl: {
    get_skills: ['Wat kost dit?', 'Laat de case study zien', 'Plan een gesprek'],
    get_pricing_info: ['Welke vaardigheden zijn beschikbaar?', 'Bereken mijn ROI', 'Plan een gesprek'],
    get_case_study: ['Wat zijn de tarieven?', 'Hoe werkt het precies?', 'Plan een gesprek'],
    book_call: ['Welke vaardigheden zijn beschikbaar?', 'Laat de case study zien'],
    qualify_lead: ['Wat kost dit?', 'Plan een gesprek', 'Welke vaardigheden zijn beschikbaar?'],
    get_roi_estimate: ['Wat kost dit?', 'Plan een gesprek', 'Welke vaardigheden zijn beschikbaar?'],
  },
  en: {
    get_skills: ['What does it cost?', 'Show the case study', 'Book a call'],
    get_pricing_info: ['Which skills are available?', 'Calculate my ROI', 'Book a call'],
    get_case_study: ['What are the prices?', 'How does it work exactly?', 'Book a call'],
    book_call: ['Which skills are available?', 'Show the case study'],
    qualify_lead: ['What does it cost?', 'Book a call', 'Which skills are available?'],
    get_roi_estimate: ['What does it cost?', 'Book a call', 'Which skills are available?'],
  },
  es: {
    get_skills: ['¿Cuánto cuesta?', 'Muestra el caso de éxito', 'Agenda una llamada'],
    get_pricing_info: ['¿Qué habilidades hay?', 'Calcula mi ROI', 'Agenda una llamada'],
    get_case_study: ['¿Cuáles son las tarifas?', '¿Cómo funciona exactamente?', 'Agenda una llamada'],
    book_call: ['¿Qué habilidades hay?', 'Muestra el caso de éxito'],
    qualify_lead: ['¿Cuánto cuesta?', 'Agenda una llamada', '¿Qué habilidades hay?'],
    get_roi_estimate: ['¿Cuánto cuesta?', 'Agenda una llamada', '¿Qué habilidades hay?'],
  },
}

interface ChatChromeLabels {
  viewDetails: string
  askFurther: string
  copy: string
  copied: string
  copyAria: string
  edit: string
  editAria: string
  regenerate: string
  regenerateAria: string
  online: string
  memoryAria: string
  newChatAria: string
  minimizeAria: string
  closeAria: string
  loading: string
  somethingWrong: string
  inputSend: string
  inputNewline: string
}

const LABELS: Record<ChatLocale, ChatChromeLabels> = {
  nl: {
    viewDetails: 'Bekijk details',
    askFurther: 'Vraag verder',
    copy: 'Kopieer',
    copied: 'Gekopieerd',
    copyAria: 'Kopieer bericht',
    edit: 'Bewerk',
    editAria: 'Bewerk dit bericht',
    regenerate: 'Opnieuw genereren',
    regenerateAria: 'Opnieuw genereren',
    online: 'Nu online',
    memoryAria: 'Bekijk wat Clyde onthoudt',
    newChatAria: 'Nieuwe chat starten',
    minimizeAria: 'Minimaliseer chat',
    closeAria: 'Sluit chat',
    loading: 'Laden...',
    somethingWrong: 'Er ging iets mis',
    inputSend: 'versturen',
    inputNewline: 'nieuwe regel',
  },
  en: {
    viewDetails: 'View details',
    askFurther: 'Ask more',
    copy: 'Copy',
    copied: 'Copied',
    copyAria: 'Copy message',
    edit: 'Edit',
    editAria: 'Edit this message',
    regenerate: 'Regenerate',
    regenerateAria: 'Regenerate',
    online: 'Online now',
    memoryAria: 'View what Clyde remembers',
    newChatAria: 'Start new chat',
    minimizeAria: 'Minimize chat',
    closeAria: 'Close chat',
    loading: 'Loading...',
    somethingWrong: 'Something went wrong',
    inputSend: 'to send',
    inputNewline: 'for a new line',
  },
  es: {
    viewDetails: 'Ver detalles',
    askFurther: 'Pregunta más',
    copy: 'Copiar',
    copied: 'Copiado',
    copyAria: 'Copiar mensaje',
    edit: 'Editar',
    editAria: 'Editar este mensaje',
    regenerate: 'Regenerar',
    regenerateAria: 'Regenerar',
    online: 'En línea',
    memoryAria: 'Ver lo que Clyde recuerda',
    newChatAria: 'Iniciar nuevo chat',
    minimizeAria: 'Minimizar chat',
    closeAria: 'Cerrar chat',
    loading: 'Cargando...',
    somethingWrong: 'Algo salió mal',
    inputSend: 'para enviar',
    inputNewline: 'nueva línea',
  },
}

export interface ChatChrome extends ChatChromeLabels {
  locale: ChatLocale
  panelTitle: (toolName: string) => string
  followups: (toolName: string) => string[] | null
}

export function chatChromeFor(locale: ChatLocale): ChatChrome {
  return {
    locale,
    ...LABELS[locale],
    panelTitle: (toolName) => PANEL_TITLES[locale][toolName] ?? PANEL_TITLE_FALLBACK[locale],
    followups: (toolName) => FOLLOWUPS[locale][toolName] ?? null,
  }
}

export function useChatChrome(): ChatChrome {
  return chatChromeFor(normalize(useLocale()))
}
