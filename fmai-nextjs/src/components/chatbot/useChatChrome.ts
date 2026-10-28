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
 * "Opnieuw genereren") are relied on by the e2e
 * suite (which runs on /nl) — keep their NL values byte-identical.
 */

export type ChatLocale = 'nl' | 'en' | 'es'

function normalize(value: string): ChatLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
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
  askFurther: string
  copy: string
  copied: string
  copyAria: string
  edit: string
  editAria: string
  regenerate: string
  regenerateAria: string
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
    askFurther: 'Vraag verder',
    copy: 'Kopieer',
    copied: 'Gekopieerd',
    copyAria: 'Kopieer bericht',
    edit: 'Bewerk',
    editAria: 'Bewerk dit bericht',
    regenerate: 'Opnieuw genereren',
    regenerateAria: 'Opnieuw genereren',
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
    askFurther: 'Ask more',
    copy: 'Copy',
    copied: 'Copied',
    copyAria: 'Copy message',
    edit: 'Edit',
    editAria: 'Edit this message',
    regenerate: 'Regenerate',
    regenerateAria: 'Regenerate',
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
    askFurther: 'Pregunta más',
    copy: 'Copiar',
    copied: 'Copiado',
    copyAria: 'Copiar mensaje',
    edit: 'Editar',
    editAria: 'Editar este mensaje',
    regenerate: 'Regenerar',
    regenerateAria: 'Regenerar',
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

export interface ChatChrome extends ChatChromeLabels {
  locale: ChatLocale
  followups: (toolName: string) => string[] | null
  rateLimited: (minutes: number) => string
  limitWarning: (remaining: number) => string
}

export function chatChromeFor(locale: ChatLocale): ChatChrome {
  return {
    locale,
    ...LABELS[locale],
    followups: (toolName) => FOLLOWUPS[locale][toolName] ?? null,
    rateLimited: (m) => RATE_LIMITED[locale](m),
    limitWarning: (n) => LIMIT_WARNING[locale](n),
  }
}

export function useChatChrome(): ChatChrome {
  return chatChromeFor(normalize(useLocale()))
}
