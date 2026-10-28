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
    get_pricing_info: [
      'Welke vaardigheden zijn beschikbaar?',
      'Bereken mijn ROI',
      'Plan een gesprek',
    ],
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
    get_case_study: [
      '¿Cuáles son las tarifas?',
      '¿Cómo funciona exactamente?',
      'Agenda una llamada',
    ],
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
  memoryAria: string
  newChatAria: string
  closeAria: string
  loading: string
  somethingWrong: string
  retry: string
  aiLabel: string
  disclosure: string
  noAnswer: string
  rejectedPersonal: string
  rejectedTooLong: string
  limitReached: string
  keepTalking: string
  applyCta: string
  inputAria: string
  sendAria: string
  stopAria: string
  answeringAria: string
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
    memoryAria: 'Bekijk wat Clyde onthoudt',
    newChatAria: 'Nieuwe chat starten',
    closeAria: 'Sluit chat',
    loading: 'Laden...',
    somethingWrong: 'Er ging iets mis. Probeer het nog eens.',
    retry: 'Opnieuw',
    aiLabel: 'AI',
    disclosure: 'Clyde is AI en kan zich vergissen.',
    noAnswer: 'Geen antwoord ontvangen',
    rejectedPersonal:
      'Clyde kan geen persoonlijke gegevens zoals een e-mailadres of telefoonnummer ontvangen. Stuur je vraag opnieuw zonder die gegevens.',
    rejectedTooLong: 'Dit bericht is te lang. Maak het korter en stuur het opnieuw.',
    limitReached: 'Dit gesprek zit vol.',
    keepTalking: 'Verder praten?',
    applyCta: 'Aanvraag starten',
    inputAria: 'Typ een bericht voor Clyde',
    sendAria: 'Verstuur bericht',
    stopAria: 'Stop het antwoord',
    answeringAria: 'Clyde antwoordt…',
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
    memoryAria: 'View what Clyde remembers',
    newChatAria: 'Start new chat',
    closeAria: 'Close chat',
    loading: 'Loading...',
    somethingWrong: 'Something went wrong. Please try again.',
    retry: 'Retry',
    aiLabel: 'AI',
    disclosure: 'Clyde is AI and can make mistakes.',
    noAnswer: 'No reply received',
    rejectedPersonal:
      "Clyde can't receive personal details like an email address or phone number. Send your question again without them.",
    rejectedTooLong: 'This message is too long. Shorten it and send it again.',
    limitReached: 'This conversation is full.',
    keepTalking: 'Want to keep talking?',
    applyCta: 'Start an application',
    inputAria: 'Message Clyde',
    sendAria: 'Send message',
    stopAria: 'Stop the reply',
    answeringAria: 'Clyde is replying…',
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
    memoryAria: 'Ver lo que Clyde recuerda',
    newChatAria: 'Iniciar nuevo chat',
    closeAria: 'Cerrar chat',
    loading: 'Cargando...',
    somethingWrong: 'Algo salió mal. Inténtalo de nuevo.',
    retry: 'Reintentar',
    aiLabel: 'IA',
    disclosure: 'Clyde es una IA y puede equivocarse.',
    noAnswer: 'No se recibió respuesta',
    rejectedPersonal:
      'Clyde no puede recibir datos personales como un correo o un teléfono. Vuelve a enviar tu pregunta sin ellos.',
    rejectedTooLong: 'Este mensaje es demasiado largo. Acórtalo y vuelve a enviarlo.',
    limitReached: 'Esta conversación está completa.',
    keepTalking: '¿Seguimos hablando?',
    applyCta: 'Iniciar solicitud',
    inputAria: 'Escribe un mensaje a Clyde',
    sendAria: 'Enviar mensaje',
    stopAria: 'Detener la respuesta',
    answeringAria: 'Clyde está respondiendo…',
  },
}

const RATE_LIMITED: Record<ChatLocale, (m: number) => string> = {
  nl: (m) =>
    `Even te veel vragen tegelijk. Probeer het over ${m} ${m === 1 ? 'minuut' : 'minuten'} opnieuw.`,
  en: (m) => `Too many questions at once. Try again in ${m} ${m === 1 ? 'minute' : 'minutes'}.`,
  es: (m) =>
    `Demasiadas preguntas a la vez. Inténtalo de nuevo en ${m} ${m === 1 ? 'minuto' : 'minutos'}.`,
}

const LIMIT_WARNING: Record<ChatLocale, (n: number) => string> = {
  nl: (n) => `Nog ${n} ${n === 1 ? 'bericht' : 'berichten'} in dit gesprek.`,
  en: (n) => `${n} ${n === 1 ? 'message' : 'messages'} left in this conversation.`,
  es: (n) =>
    `${n === 1 ? 'Queda' : 'Quedan'} ${n} ${n === 1 ? 'mensaje' : 'mensajes'} en esta conversación.`,
}

// Count-aware memory badge label: an explicit aria-label overrides the visible
// number in the badge, so the count must be spoken here or screen-reader users
// lose the at-a-glance "how much Clyde remembers" signal.
const MEMORY_ARIA_COUNT: Record<ChatLocale, (n: number) => string> = {
  nl: (n) => `Bekijk wat Clyde onthoudt (${n} ${n === 1 ? 'feit' : 'feiten'})`,
  en: (n) => `View what Clyde remembers (${n} ${n === 1 ? 'fact' : 'facts'})`,
  es: (n) => `Ver lo que Clyde recuerda (${n} ${n === 1 ? 'dato' : 'datos'})`,
}

export interface ChatChrome extends ChatChromeLabels {
  locale: ChatLocale
  panelTitle: (toolName: string) => string
  followups: (toolName: string) => string[] | null
  memoryAriaCount: (count: number) => string
  rateLimited: (minutes: number) => string
  limitWarning: (remaining: number) => string
}

export function chatChromeFor(locale: ChatLocale): ChatChrome {
  return {
    locale,
    ...LABELS[locale],
    panelTitle: (toolName) => PANEL_TITLES[locale][toolName] ?? PANEL_TITLE_FALLBACK[locale],
    followups: (toolName) => FOLLOWUPS[locale][toolName] ?? null,
    memoryAriaCount: (count) => MEMORY_ARIA_COUNT[locale](count),
    rateLimited: (m) => RATE_LIMITED[locale](m),
    limitWarning: (n) => LIMIT_WARNING[locale](n),
  }
}

export function useChatChrome(): ChatChrome {
  return chatChromeFor(normalize(useLocale()))
}
