'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { ChatWidget } from './ChatWidget'
import { ProactiveNudge } from './ProactiveNudge'
import { useChatbotStore } from '@/stores/chatbotStore'
import { loadMemory, saveMemory } from '@/lib/chatbot/memory-persistence'
import { welcomeBackMessage } from './welcome-back'
import type { ChatLocale } from './useChatChrome'

function normalizeLocale(value: string): ChatLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

/**
 * Page-aware welcome messages, keyed by locale then path. The pathname returned
 * by next-intl's usePathname is the locale-stripped path (e.g. "/skills/voice-agent"
 * on both /nl/... and /en/...), so the same path keys cover all locales. NL is the
 * source of truth for tone; en/es follow it so /en and /es visitors are greeted in
 * their own language. "AI Marketing Employee" / "Empleado AI de Marketing" match the
 * site copy (note: Spanish uses "AI", not "IA").
 */
const WELCOME_MESSAGES: Record<ChatLocale, Record<string, string>> = {
  nl: {
    '/': 'Hoi, ik ben Clyde. Vertel waar ik aan kan werken.',
    '/skills/social-media':
      'Hoi, ik ben Clyde. Wil je dat ik een content-kalender opzet voor een van je merken?',
    '/skills/voice-agent':
      'Hoi, ik ben Clyde. Ik kan laten zien hoe ik telefoons opneem of een vraag beantwoorden.',
    '/skills/lead-qualifier':
      'Hoi, ik ben Clyde. Dit is precies wat je klanten op hun site zouden krijgen.',
    '/skills/ad-creator':
      'Hoi, ik ben Clyde. Geef me een briefing en ik draai er varianten uit.',
    '/skills/email-management':
      'Hoi, ik ben Clyde. Ik filter je Gmail en stuur dagelijks een digest van wat ertoe doet.',
    '/skills/reporting':
      'Hoi, ik ben Clyde. Ik laat zien hoe een weekrapport eruitziet.',
    '/pricing':
      'Hoi, ik ben Clyde. Ik kan je ROI berekenen of de tiers doorlopen.',
    '/apply':
      'Hoi, ik ben Clyde. Vragen voordat je je aanmeldt? Stel ze gerust.',
    '/about': 'Hoi, ik ben Clyde. Wil je weten hoe ik werk?',
    default: 'Hoi, ik ben Clyde, je AI marketing medewerker. Wat heb je nodig?',
  },
  en: {
    '/': 'Hi, I am Clyde. Tell me what I can work on.',
    '/skills/social-media':
      'Hi, I am Clyde. Want me to set up a content calendar for one of your brands?',
    '/skills/voice-agent':
      'Hi, I am Clyde. I can show you how I answer calls, or just answer a question.',
    '/skills/lead-qualifier':
      'Hi, I am Clyde. This is exactly what your clients would get on their site.',
    '/skills/ad-creator':
      'Hi, I am Clyde. Give me a brief and I will spin up variants.',
    '/skills/email-management':
      'Hi, I am Clyde. I filter your Gmail and send a daily digest of what matters.',
    '/skills/reporting':
      'Hi, I am Clyde. I can show you what a weekly report looks like.',
    '/pricing':
      'Hi, I am Clyde. I can calculate your ROI or walk you through the tiers.',
    '/apply':
      'Hi, I am Clyde. Questions before you apply? Go ahead and ask.',
    '/about': 'Hi, I am Clyde. Want to know how I work?',
    default: 'Hi, I am Clyde, your AI marketing employee. What do you need?',
  },
  es: {
    '/': 'Hola, soy Clyde. Dime en qué puedo ponerme a trabajar.',
    '/skills/social-media':
      'Hola, soy Clyde. ¿Quieres que prepare un calendario de contenido para una de tus marcas?',
    '/skills/voice-agent':
      'Hola, soy Clyde. Puedo mostrarte cómo atiendo llamadas, o responder una pregunta.',
    '/skills/lead-qualifier':
      'Hola, soy Clyde. Esto es exactamente lo que recibirían tus clientes en su web.',
    '/skills/ad-creator':
      'Hola, soy Clyde. Dame un briefing y te saco variantes.',
    '/skills/email-management':
      'Hola, soy Clyde. Filtro tu Gmail y envío un resumen diario de lo que importa.',
    '/skills/reporting':
      'Hola, soy Clyde. Puedo mostrarte cómo es un informe semanal.',
    '/pricing':
      'Hola, soy Clyde. Puedo calcular tu ROI o repasar los planes.',
    '/apply':
      'Hola, soy Clyde. ¿Dudas antes de aplicar? Pregunta lo que quieras.',
    '/about': 'Hola, soy Clyde. ¿Quieres saber cómo trabajo?',
    default: 'Hola, soy Clyde, tu empleado AI de marketing. ¿Qué necesitas?',
  },
}

/**
 * Context-aware suggested prompts per locale + page path. Keep to 4 prompts max
 * so the empty-state can render them as a 2x2 grid. These are SENT verbatim as a
 * message when clicked, so localizing them keeps Clyde answering in the visitor's
 * language. CTA phrasing ("Book a call" / "Agenda una llamada") matches useChatChrome.
 */
const SUGGESTED_PROMPTS: Record<ChatLocale, Record<string, string[]>> = {
  nl: {
    '/': [
      'Welke vaardigheden heb je?',
      'Laat me een demo zien',
      'Bereken mijn ROI',
      'Plan een gesprek',
    ],
    '/skills/social-media': [
      'Plan content voor volgende week',
      'Maak posts voor een skincare-merk',
      'Welke platforms dek je?',
      'Plan een gesprek',
    ],
    '/skills/voice-agent': [
      'Hoe neem je telefoons op?',
      'Laat een gespreksflow zien',
      'Welke talen ondersteun je?',
      'Plan een gesprek',
    ],
    '/skills/lead-qualifier': [
      'Score een voorbeeld-lead',
      'Hoe werkt kwalificatie?',
      'Toon scoring-criteria',
      'Plan een gesprek',
    ],
    '/pricing': [
      'Bereken ROI voor mijn bureau',
      'Vergelijk de tiers',
      'Wat zit er in Growth?',
      'Plan een gesprek',
    ],
    default: [
      'Welke vaardigheden heb je?',
      'Laat me een demo zien',
      'Bereken mijn ROI',
      'Plan een gesprek',
    ],
  },
  en: {
    '/': [
      'Which skills do you have?',
      'Show me a demo',
      'Calculate my ROI',
      'Book a call',
    ],
    '/skills/social-media': [
      'Plan content for next week',
      'Create posts for a skincare brand',
      'Which platforms do you cover?',
      'Book a call',
    ],
    '/skills/voice-agent': [
      'How do you answer calls?',
      'Show a call flow',
      'Which languages do you support?',
      'Book a call',
    ],
    '/skills/lead-qualifier': [
      'Score a sample lead',
      'How does qualification work?',
      'Show the scoring criteria',
      'Book a call',
    ],
    '/pricing': [
      'Calculate ROI for my agency',
      'Compare the tiers',
      "What's in Growth?",
      'Book a call',
    ],
    default: [
      'Which skills do you have?',
      'Show me a demo',
      'Calculate my ROI',
      'Book a call',
    ],
  },
  es: {
    '/': [
      '¿Qué habilidades tienes?',
      'Muéstrame una demo',
      'Calcula mi ROI',
      'Agenda una llamada',
    ],
    '/skills/social-media': [
      'Planifica contenido para la próxima semana',
      'Crea publicaciones para una marca de skincare',
      '¿Qué plataformas cubres?',
      'Agenda una llamada',
    ],
    '/skills/voice-agent': [
      '¿Cómo atiendes las llamadas?',
      'Muestra un flujo de llamada',
      '¿Qué idiomas admites?',
      'Agenda una llamada',
    ],
    '/skills/lead-qualifier': [
      'Puntúa un lead de ejemplo',
      '¿Cómo funciona la cualificación?',
      'Muestra los criterios de puntuación',
      'Agenda una llamada',
    ],
    '/pricing': [
      'Calcula el ROI para mi agencia',
      'Compara los planes',
      '¿Qué incluye Growth?',
      'Agenda una llamada',
    ],
    default: [
      '¿Qué habilidades tienes?',
      'Muéstrame una demo',
      'Calcula mi ROI',
      'Agenda una llamada',
    ],
  },
}

/**
 * Proactive nudge prompts, keyed by locale then path. Shown as a bubble above the
 * FAB after 40s of inactivity on pages where Clyde has something specific to offer.
 * Action-oriented: clicking SENDS the message to Clyde, so they live in the visitor's
 * language to keep his reply in that language too.
 *
 * Unlike the other three maps this one has NO `default` key by design: an unmapped
 * path yields `undefined`, which disables the nudge on pages where Clyde has nothing
 * page-specific to offer. The type is `Partial` so that intent is explicit and every
 * reader is forced to guard for `undefined` (they all do: `if (!nudgePrompt) return`,
 * `nudgePrompt ?? ''`).
 */
const PROACTIVE_PROMPTS: Record<ChatLocale, Partial<Record<string, string>>> = {
  nl: {
    '/skills/voice-agent': 'Hoe neem je precies een telefoon op?',
    '/skills/social-media': 'Maak een content-plan voor mijn merk',
    '/skills/lead-qualifier': 'Score een voorbeeld-lead voor mij',
    '/skills/ad-creator': 'Genereer 3 ad-varianten voor mij',
    '/skills/email-management': 'Hoe filter je mijn inbox?',
    '/skills/reporting': 'Laat een weekrapport zien',
    '/skills/blog-factory': 'Plan een SEO-artikel voor mij',
    '/skills/clyde': 'Hoe werk je als orchestrator?',
    '/skills/research': 'Doe een marktonderzoek voor mij',
    '/skills/seo-geo': 'Hoe monitor je AI-citaties?',
    '/pricing': 'Bereken mijn ROI',
    '/about': 'Hoe werkt het platform precies?',
  },
  en: {
    '/skills/voice-agent': 'How exactly do you answer a call?',
    '/skills/social-media': 'Make a content plan for my brand',
    '/skills/lead-qualifier': 'Score a sample lead for me',
    '/skills/ad-creator': 'Generate 3 ad variants for me',
    '/skills/email-management': 'How do you filter my inbox?',
    '/skills/reporting': 'Show me a weekly report',
    '/skills/blog-factory': 'Plan an SEO article for me',
    '/skills/clyde': 'How do you work as an orchestrator?',
    '/skills/research': 'Run market research for me',
    '/skills/seo-geo': 'How do you monitor AI citations?',
    '/pricing': 'Calculate my ROI',
    '/about': 'How exactly does the platform work?',
  },
  es: {
    '/skills/voice-agent': '¿Cómo atiendes exactamente una llamada?',
    '/skills/social-media': 'Crea un plan de contenido para mi marca',
    '/skills/lead-qualifier': 'Puntúa un lead de ejemplo para mí',
    '/skills/ad-creator': 'Genera 3 variantes de anuncio para mí',
    '/skills/email-management': '¿Cómo filtras mi bandeja de entrada?',
    '/skills/reporting': 'Muéstrame un informe semanal',
    '/skills/blog-factory': 'Planifica un artículo SEO para mí',
    '/skills/clyde': '¿Cómo trabajas como orquestador?',
    '/skills/research': 'Haz un estudio de mercado para mí',
    '/skills/seo-geo': '¿Cómo monitorizas las citas de AI?',
    '/pricing': 'Calcula mi ROI',
    '/about': '¿Cómo funciona exactamente la plataforma?',
  },
}

/**
 * Proactive in-chat follow-up messages, keyed by locale then path. Injected as a
 * Clyde (assistant) bubble after 2 min of silence in an active conversation, so they
 * are display-only and must read in the visitor's language.
 */
const PROACTIVE_FOLLOWUPS: Record<ChatLocale, Record<string, string>> = {
  nl: {
    '/': 'Wil je dat ik een korte rondleiding geef door mijn vaardigheden?',
    '/skills/social-media': 'Zal ik een content-kalender voor een testmerk opzetten?',
    '/skills/voice-agent': 'Zal ik laten zien hoe ik een inkomend gesprek afhandel?',
    '/skills/lead-qualifier': 'Wil je dat ik een echte lead voor je kwalificeer?',
    '/skills/ad-creator': 'Zal ik 3 ad-varianten genereren voor een testproduct?',
    '/skills/email-management': 'Wil je zien hoe ik jouw inbox zou indelen?',
    '/skills/reporting': 'Zal ik een voorbeeld weekrapport genereren?',
    '/skills/blog-factory': 'Wil je dat ik een SEO-artikel plan voor een testmerk?',
    '/skills/clyde': 'Zal ik laten zien hoe ik meerdere vaardigheden tegelijk orkestreer?',
    '/skills/research': 'Wil je dat ik een marktonderzoek doe voor jouw niche?',
    '/skills/seo-geo': 'Zal ik AI-citaties voor jouw domein checken?',
    '/pricing': 'Wil je dat ik een ROI-berekening maak voor jouw bureaugrootte?',
    '/about': 'Kan ik laten zien hoe ik in de praktijk werk?',
    default: 'Is er iets specifieks waar ik je mee kan helpen?',
  },
  en: {
    '/': 'Want me to give you a quick tour of my skills?',
    '/skills/social-media': 'Shall I set up a content calendar for a test brand?',
    '/skills/voice-agent': 'Shall I show you how I handle an incoming call?',
    '/skills/lead-qualifier': 'Want me to qualify a real lead for you?',
    '/skills/ad-creator': 'Shall I generate 3 ad variants for a test product?',
    '/skills/email-management': 'Want to see how I would organize your inbox?',
    '/skills/reporting': 'Shall I generate a sample weekly report?',
    '/skills/blog-factory': 'Want me to plan an SEO article for a test brand?',
    '/skills/clyde': 'Shall I show you how I orchestrate several skills at once?',
    '/skills/research': 'Want me to run market research for your niche?',
    '/skills/seo-geo': 'Shall I check AI citations for your domain?',
    '/pricing': 'Want me to calculate ROI for your agency size?',
    '/about': 'Can I show you how I work in practice?',
    default: 'Is there something specific I can help you with?',
  },
  es: {
    '/': '¿Quieres que te dé un recorrido rápido por mis habilidades?',
    '/skills/social-media': '¿Preparo un calendario de contenido para una marca de prueba?',
    '/skills/voice-agent': '¿Te muestro cómo gestiono una llamada entrante?',
    '/skills/lead-qualifier': '¿Quieres que cualifique un lead real para ti?',
    '/skills/ad-creator': '¿Genero 3 variantes de anuncio para un producto de prueba?',
    '/skills/email-management': '¿Quieres ver cómo organizaría tu bandeja de entrada?',
    '/skills/reporting': '¿Genero un informe semanal de ejemplo?',
    '/skills/blog-factory': '¿Quieres que planifique un artículo SEO para una marca de prueba?',
    '/skills/clyde': '¿Te muestro cómo orquesto varias habilidades a la vez?',
    '/skills/research': '¿Quieres que haga un estudio de mercado para tu nicho?',
    '/skills/seo-geo': '¿Reviso las citas de AI para tu dominio?',
    '/pricing': '¿Quieres que calcule el ROI para el tamaño de tu agencia?',
    '/about': '¿Te muestro cómo trabajo en la práctica?',
    default: '¿Hay algo específico en lo que pueda ayudarte?',
  },
}

const NUDGE_DELAY_MS = 40_000
/** After Clyde sends the visitor to a page, he chimes in once this soon. */
const POST_NAV_NUDGE_DELAY_MS = 6_000

export function ChatWidgetIsland() {
  const pathname = usePathname()
  const locale = normalizeLocale(useLocale())
  const isOpen = useChatbotStore((s) => s.isOpen)
  const toggle = useChatbotStore((s) => s.toggle)
  const close = useChatbotStore((s) => s.close)
  const closeSidePanel = useChatbotStore((s) => s.closeSidePanel)
  const sendChatMessage = useChatbotStore((s) => s.sendChatMessage)
  const messageCounts = useChatbotStore((s) => s.messageCounts)
  const memoryProfile = useChatbotStore((s) => s.memoryProfile)
  const setMemoryProfile = useChatbotStore((s) => s.setMemoryProfile)

  const [nudgeVisible, setNudgeVisible] = useState(false)
  // Set when a navigation started from an open chat, so Clyde follows up on the
  // destination page instead of going silent.
  const [cameFromChat, setCameFromChat] = useState(false)
  const prevPathname = useRef(pathname)
  // At most one proactive nudge per page visit (cold timer, scroll, or post-nav).
  const nudgedThisPage = useRef(false)
  const nudgePrompt = PROACTIVE_PROMPTS[locale][pathname]
  const followupMessage = PROACTIVE_FOLLOWUPS[locale][pathname] ?? PROACTIVE_FOLLOWUPS[locale].default
  // Returning visitor with a remembered agency gets a personalized greeting; everyone
  // else falls back to the page-aware welcome.
  const welcomeMessage =
    welcomeBackMessage(locale, memoryProfile) ??
    (WELCOME_MESSAGES[locale][pathname] ?? WELCOME_MESSAGES[locale].default)

  // Hydrate persisted memory once on mount (client-only, consent-gated). Lets Clyde
  // recall an agency across sessions; no-op on the server / without cookie consent.
  const hydratedMemory = useRef(false)
  useEffect(() => {
    if (hydratedMemory.current) return
    hydratedMemory.current = true
    const stored = loadMemory()
    if (Object.keys(stored).length > 0) setMemoryProfile(stored)
  }, [setMemoryProfile])

  // Persist memory whenever it changes (no-op without consent / in private mode).
  // Guarded by hydratedMemory so we never overwrite a stored profile with the empty
  // initial state before hydration has run.
  useEffect(() => {
    if (!hydratedMemory.current) return
    saveMemory(memoryProfile)
  }, [memoryProfile])

  // On any route change: close the chat so the visitor can read the new page,
  // and remember whether they came from an open chat so Clyde can follow up.
  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname
    setNudgeVisible(false)
    nudgedThisPage.current = false
    // Clear any open tool side panel so reopening on the new page starts clean.
    closeSidePanel()
    if (isOpen) {
      close()
      setCameFromChat(true)
    } else {
      setCameFromChat(false)
    }
  }, [pathname, isOpen, close, closeSidePanel])

  // Hide nudge when chat opens
  useEffect(() => {
    if (isOpen) setNudgeVisible(false)
  }, [isOpen])

  // Proactive nudge: fire after NUDGE_DELAY_MS if user hasn't engaged
  useEffect(() => {
    if (!nudgePrompt) return
    const totalMessages = Object.values(messageCounts).reduce((a, b) => a + b, 0)
    if (totalMessages > 0 || isOpen) return
    const timer = setTimeout(() => {
      if (nudgedThisPage.current) return
      nudgedThisPage.current = true
      setNudgeVisible(true)
    }, NUDGE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [nudgePrompt, messageCounts, isOpen, pathname])

  // Post-navigation follow-up: Clyde sent them here, so chime in once, sooner
  // than the cold-visitor timer and regardless of prior engagement.
  useEffect(() => {
    if (!cameFromChat) return
    if (!nudgePrompt || isOpen || nudgedThisPage.current) {
      setCameFromChat(false)
      return
    }
    const timer = setTimeout(() => {
      nudgedThisPage.current = true
      setNudgeVisible(true)
      setCameFromChat(false)
    }, POST_NAV_NUDGE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [cameFromChat, nudgePrompt, isOpen])

  // Scroll-trigger nudge: also fire at 72% scroll depth
  useEffect(() => {
    if (!nudgePrompt) return
    const handleScroll = () => {
      const el = document.documentElement
      const fraction = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)
      if (fraction > 0.72) {
        const total = Object.values(messageCounts).reduce((a, b) => a + b, 0)
        if (total === 0 && !isOpen && !nudgeVisible && !nudgedThisPage.current) {
          nudgedThisPage.current = true
          setNudgeVisible(true)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [nudgePrompt, isOpen, nudgeVisible, messageCounts])

  const handleNudgeAccept = useCallback(() => {
    setNudgeVisible(false)
    if (!isOpen) toggle()
    if (nudgePrompt) sendChatMessage(nudgePrompt)
  }, [isOpen, toggle, sendChatMessage, nudgePrompt])

  const handleNudgeDismiss = useCallback(() => {
    setNudgeVisible(false)
  }, [])

  // Keyboard shortcut: Ctrl+K / Cmd+K → open chat and focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const active = document.activeElement
        // Don't hijack if user is typing in an unrelated input
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active instanceof HTMLElement && active.isContentEditable)
        ) {
          return
        }
        e.preventDefault()
        if (!isOpen) {
          toggle()
        } else {
          const textarea = document.querySelector<HTMLTextAreaElement>(
            '[data-chatwidget-panel] textarea'
          )
          textarea?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, toggle])

  return (
    <>
      <ProactiveNudge
        message={nudgePrompt ?? ''}
        visible={nudgeVisible}
        onAccept={handleNudgeAccept}
        onDismiss={handleNudgeDismiss}
      />
      <ChatWidget
        mode="floating"
        personaId="clyde"
        personaName="Clyde"
        pageContext={{ pathname }}
        suggestedPrompts={SUGGESTED_PROMPTS[locale][pathname] ?? SUGGESTED_PROMPTS[locale].default}
        welcomeMessage={welcomeMessage}
        proactiveFollowupMessage={followupMessage}
      />
    </>
  )
}

export default ChatWidgetIsland
