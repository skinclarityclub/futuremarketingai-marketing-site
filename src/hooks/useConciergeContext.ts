import { useEffect, useMemo } from 'react'
import { useChatbotStore } from '../stores/chatbotStore'

/**
 * Page-specific welcome greetings by path and language.
 * Provides context-aware first impressions for the flagship concierge.
 */
const PAGE_GREETINGS: Record<string, Record<string, string>> = {
  '/': {
    en: 'Welcome to FMai! I can help you explore our AI-powered marketing services, see demos, or book a discovery call.',
    nl: 'Welkom bij FMai! Ik kan je helpen onze AI-marketingdiensten te verkennen, demos te bekijken, of een kennismakingsgesprek in te plannen.',
    es: 'Bienvenido a FMai! Puedo ayudarte a explorar nuestros servicios de marketing con IA, ver demos o agendar una llamada.',
  },
  '/chatbots': {
    en: 'Looking at our chatbot solutions? Try the live demos below, or ask me how chatbots can boost your conversions.',
    nl: 'Bekijk je onze chatbot-oplossingen? Probeer de live demos hieronder, of vraag me hoe chatbots je conversies kunnen verhogen.',
    es: 'Explorando nuestras soluciones de chatbot? Prueba las demos abajo, o preguntame como los chatbots pueden aumentar tus conversiones.',
  },
  '/pricing': {
    en: 'Exploring pricing? I can compare plans, calculate your ROI, or help you choose the right tier for your business.',
    nl: 'Prijzen bekijken? Ik kan plannen vergelijken, je ROI berekenen, of je helpen het juiste pakket te kiezen.',
    es: 'Explorando precios? Puedo comparar planes, calcular tu ROI o ayudarte a elegir el nivel adecuado para tu negocio.',
  },
  '/marketing-machine': {
    en: 'Want to learn about the Marketing Machine? I can explain any module, show ROI projections, or guide you through a demo.',
    nl: 'Wil je meer weten over de Marketing Machine? Ik kan elke module uitleggen, ROI-projecties tonen, of je door een demo leiden.',
    es: 'Quieres saber mas sobre la Marketing Machine? Puedo explicar cualquier modulo, mostrar proyecciones de ROI o guiarte en una demo.',
  },
  '/automations': {
    en: 'Checking out our automation services? Ask me about workflow automation, integrations, or how we save teams 20+ hours per week.',
    nl: 'Bekijk je onze automatiseringsdiensten? Vraag me over workflow-automatisering, integraties, of hoe we teams 20+ uur per week besparen.',
    es: 'Revisando nuestros servicios de automatizacion? Preguntame sobre automatizacion de flujos, integraciones o como ahorramos 20+ horas semanales.',
  },
  '/voice-agents': {
    en: 'Interested in voice agents? I can explain our AI voice solutions, share use cases, or help you get started.',
    nl: 'Geinteresseerd in voice agents? Ik kan onze AI-spraakoplossingen uitleggen, voorbeelden delen, of je helpen om te starten.',
    es: 'Interesado en agentes de voz? Puedo explicar nuestras soluciones de voz con IA, compartir casos de uso o ayudarte a comenzar.',
  },
  '/about': {
    en: 'Want to know more about FMai? Ask me about our mission, team, or how we help businesses grow with AI.',
    nl: 'Wil je meer weten over FMai? Vraag me over onze missie, ons team, of hoe we bedrijven helpen groeien met AI.',
    es: 'Quieres saber mas sobre FMai? Preguntame sobre nuestra mision, equipo o como ayudamos a las empresas a crecer con IA.',
  },
  '/contact': {
    en: 'Ready to get in touch? I can help you book a discovery call or answer any last questions before you reach out.',
    nl: 'Klaar om contact op te nemen? Ik kan je helpen een kennismakingsgesprek in te plannen of laatste vragen beantwoorden.',
    es: 'Listo para contactarnos? Puedo ayudarte a agendar una llamada o responder cualquier pregunta antes de comunicarte.',
  },
}

const DEFAULT_GREETING: Record<string, string> = {
  en: "Hey! I'm the FMai Concierge -- ask me anything about our services, pricing, or how AI can transform your marketing.",
  nl: 'Hoi! Ik ben de FMai Concierge -- vraag me alles over onze diensten, prijzen, of hoe AI je marketing kan transformeren.',
  es: 'Hola! Soy el Concierge de FMai -- preguntame sobre nuestros servicios, precios o como la IA puede transformar tu marketing.',
}

/**
 * Page-specific suggested prompts by path and language.
 */
const PAGE_PROMPTS: Record<string, Record<string, string[]>> = {
  '/': {
    en: [
      'What services does FMai offer?',
      'Show me a chatbot demo',
      'How does AI marketing work?',
      'I want to book a call',
    ],
    nl: [
      'Welke diensten biedt FMai aan?',
      'Laat me een chatbot-demo zien',
      'Hoe werkt AI-marketing?',
      'Ik wil een gesprek plannen',
    ],
    es: [
      'Que servicios ofrece FMai?',
      'Muestrame una demo de chatbot',
      'Como funciona el marketing con IA?',
      'Quiero agendar una llamada',
    ],
  },
  '/chatbots': {
    en: [
      'Show me an e-commerce chatbot demo',
      'How do chatbots help with lead gen?',
      'What platforms do you support?',
    ],
    nl: [
      'Laat me een e-commerce chatbot-demo zien',
      'Hoe helpen chatbots bij leadgeneratie?',
      'Welke platformen ondersteunen jullie?',
    ],
    es: [
      'Muestrame una demo de chatbot para e-commerce',
      'Como ayudan los chatbots con la generacion de leads?',
      'Que plataformas soportan?',
    ],
  },
  '/pricing': {
    en: ['Compare plans for me', 'What ROI can I expect?', 'Help me choose a plan'],
    nl: [
      'Vergelijk de plannen voor me',
      'Welke ROI kan ik verwachten?',
      'Help me een plan te kiezen',
    ],
    es: ['Compara los planes por mi', 'Que ROI puedo esperar?', 'Ayudame a elegir un plan'],
  },
  '/marketing-machine': {
    en: [
      'Explain the Marketing Machine modules',
      'Calculate my ROI',
      'How does it compare to doing it manually?',
    ],
    nl: [
      'Leg de Marketing Machine-modules uit',
      'Bereken mijn ROI',
      'Hoe verhoudt het zich tot handmatig werk?',
    ],
    es: [
      'Explica los modulos de la Marketing Machine',
      'Calcula mi ROI',
      'Como se compara con hacerlo manualmente?',
    ],
  },
  '/automations': {
    en: [
      'What workflows can you automate?',
      'How much time will I save?',
      'Show me integration options',
    ],
    nl: [
      'Welke workflows kunnen jullie automatiseren?',
      'Hoeveel tijd bespaar ik?',
      'Laat me integratie-opties zien',
    ],
    es: [
      'Que flujos pueden automatizar?',
      'Cuanto tiempo ahorrare?',
      'Muestrame las opciones de integracion',
    ],
  },
  '/voice-agents': {
    en: ['How do AI voice agents work?', 'What are the use cases?', 'Can I hear a demo?'],
    nl: ['Hoe werken AI voice agents?', 'Wat zijn de toepassingen?', 'Kan ik een demo horen?'],
    es: [
      'Como funcionan los agentes de voz con IA?',
      'Cuales son los casos de uso?',
      'Puedo escuchar una demo?',
    ],
  },
  '/about': {
    en: [
      "What is FMai's mission?",
      'How does FMai help businesses?',
      'Tell me about your approach',
    ],
    nl: ['Wat is de missie van FMai?', 'Hoe helpt FMai bedrijven?', 'Vertel me over jullie aanpak'],
    es: [
      'Cual es la mision de FMai?',
      'Como ayuda FMai a las empresas?',
      'Cuentame sobre su enfoque',
    ],
  },
  '/contact': {
    en: ['Book a discovery call', 'What happens after I reach out?', 'How fast do you respond?'],
    nl: [
      'Plan een kennismakingsgesprek',
      'Wat gebeurt er nadat ik contact opneem?',
      'Hoe snel reageren jullie?',
    ],
    es: ['Agendar una llamada', 'Que pasa despues de contactarlos?', 'Que tan rapido responden?'],
  },
}

const DEFAULT_PROMPTS: Record<string, string[]> = {
  en: ['What services does FMai offer?', 'Show me a demo', 'I want to book a call'],
  nl: ['Welke diensten biedt FMai aan?', 'Laat me een demo zien', 'Ik wil een gesprek plannen'],
  es: ['Que servicios ofrece FMai?', 'Muestrame una demo', 'Quiero agendar una llamada'],
}

const FOLLOW_UP_PROMPTS: Record<string, string[]> = {
  en: ['Book a discovery call', 'Show me case studies', 'Compare your services'],
  nl: ['Plan een kennismakingsgesprek', 'Laat me case studies zien', 'Vergelijk jullie diensten'],
  es: ['Agendar una llamada', 'Muestrame casos de exito', 'Compara tus servicios'],
}

interface ConciergeContext {
  welcomeMessage: string
  suggestedPrompts: string[]
  pageContext: { pathname: string }
}

/**
 * Context-awareness hook for the flagship concierge chatbot.
 * Provides page-specific greetings, suggested prompts, and journey tracking.
 * Lightweight revival of ARIA features (~100 lines vs ARIA's 12,000+).
 */
export function useConciergeContext(pathname: string, lang: string): ConciergeContext {
  const visitedPages = useChatbotStore((s) => s.visitedPages)
  const messageCounts = useChatbotStore((s) => s.messageCounts)
  const addVisitedPage = useChatbotStore((s) => s.addVisitedPage)

  // Track page visit on mount and pathname change
  useEffect(() => {
    addVisitedPage(pathname)
  }, [pathname, addVisitedPage])

  const welcomeMessage = useMemo(() => {
    const langCode = lang.split('-')[0] // normalize 'en-US' -> 'en'
    const pageGreetings = PAGE_GREETINGS[pathname]
    let greeting =
      pageGreetings?.[langCode] ??
      pageGreetings?.en ??
      DEFAULT_GREETING[langCode] ??
      DEFAULT_GREETING.en

    // Personalized touch for returning visitors
    if (visitedPages.length > 2) {
      const suffix: Record<string, string> = {
        en: " I see you've been exploring -- ask me anything!",
        nl: ' Ik zie dat je aan het rondkijken bent -- vraag me alles!',
        es: ' Veo que has estado explorando -- preguntame lo que quieras!',
      }
      greeting += suffix[langCode] ?? suffix.en
    }

    return greeting
  }, [pathname, lang, visitedPages.length])

  const suggestedPrompts = useMemo(() => {
    const langCode = lang.split('-')[0]
    const flagshipCount = messageCounts['flagship'] || 0

    // After 3+ messages, switch to follow-up prompts
    if (flagshipCount > 3) {
      return FOLLOW_UP_PROMPTS[langCode] ?? FOLLOW_UP_PROMPTS.en
    }

    const pagePrompts = PAGE_PROMPTS[pathname]
    return (
      pagePrompts?.[langCode] ?? pagePrompts?.en ?? DEFAULT_PROMPTS[langCode] ?? DEFAULT_PROMPTS.en
    )
  }, [pathname, lang, messageCounts])

  return {
    welcomeMessage,
    suggestedPrompts,
    pageContext: { pathname },
  }
}
