import type { ChatLocale } from './useChatChrome'

/**
 * Page-aware welcome messages, keyed by locale then path. The pathname returned
 * by next-intl's usePathname is the locale-stripped path (e.g. "/skills/voice-agent"
 * on both /nl/... and /en/...), so the same path keys cover all locales. NL is the
 * source of truth for tone; en/es follow it so /en and /es visitors are greeted in
 * their own language. "AI colleague" / "compañero de IA" match the
 * site copy (Spanish says "IA", not "AI"). Every greeting names AI up front: EU AI
 * Act art. 50(1) wants the visitor told they are talking to an AI.
 */
export const WELCOME_MESSAGES: Record<ChatLocale, Record<string, string>> = {
  nl: {
    '/': 'Hoi, ik ben Clyde, een AI-collega. Vertel waar ik aan kan werken.',
    '/skills/social-media':
      'Hoi, ik ben Clyde, een AI-collega. Wil je dat ik een content-kalender opzet voor een van je merken?',
    '/skills/voice-agent':
      'Hoi, ik ben Clyde, een AI-collega. Ik kan laten zien hoe ik telefoons opneem of een vraag beantwoorden.',
    '/skills/lead-qualifier':
      'Hoi, ik ben Clyde, een AI-collega. Dit is precies wat je klanten op hun site zouden krijgen.',
    '/skills/ad-manager':
      'Hoi, ik ben Clyde, een AI-collega. Geef me een briefing en ik draai er varianten uit.',
    '/skills/email-management':
      'Hoi, ik ben Clyde, een AI-collega. Ik filter je Gmail en stuur dagelijks een digest van wat ertoe doet.',
    '/skills/reporting':
      'Hoi, ik ben Clyde, een AI-collega. Ik laat zien hoe een weekrapport eruitziet.',
    '/pricing':
      'Hoi, ik ben Clyde, een AI-collega. Ik kan je ROI berekenen of de tiers doorlopen.',
    '/apply':
      'Hoi, ik ben Clyde, een AI-collega. Vragen voordat je je aanmeldt? Stel ze gerust.',
    '/about': 'Hoi, ik ben Clyde, een AI-collega. Wil je weten hoe ik werk?',
    default: 'Hoi, ik ben Clyde, de AI-collega van je bureau. Wat heb je nodig?',
  },
  en: {
    '/': 'Hi, I am Clyde, an AI colleague. Tell me what I can work on.',
    '/skills/social-media':
      'Hi, I am Clyde, an AI colleague. Want me to set up a content calendar for one of your brands?',
    '/skills/voice-agent':
      'Hi, I am Clyde, an AI colleague. I can show you how I answer calls, or just answer a question.',
    '/skills/lead-qualifier':
      'Hi, I am Clyde, an AI colleague. This is exactly what your clients would get on their site.',
    '/skills/ad-manager':
      'Hi, I am Clyde, an AI colleague. Give me a brief and I will spin up variants.',
    '/skills/email-management':
      'Hi, I am Clyde, an AI colleague. I filter your Gmail and send a daily digest of what matters.',
    '/skills/reporting':
      'Hi, I am Clyde, an AI colleague. I can show you what a weekly report looks like.',
    '/pricing':
      'Hi, I am Clyde, an AI colleague. I can calculate your ROI or walk you through the tiers.',
    '/apply':
      'Hi, I am Clyde, an AI colleague. Questions before you apply? Go ahead and ask.',
    '/about': 'Hi, I am Clyde, an AI colleague. Want to know how I work?',
    default: "Hi, I am Clyde, your agency's AI colleague. What do you need?",
  },
  es: {
    '/': 'Hola, soy Clyde, un compañero de IA. Dime en qué puedo ponerme a trabajar.',
    '/skills/social-media':
      'Hola, soy Clyde, un compañero de IA. ¿Quieres que prepare un calendario de contenido para una de tus marcas?',
    '/skills/voice-agent':
      'Hola, soy Clyde, un compañero de IA. Puedo mostrarte cómo atiendo llamadas, o responder una pregunta.',
    '/skills/lead-qualifier':
      'Hola, soy Clyde, un compañero de IA. Esto es exactamente lo que recibirían tus clientes en su web.',
    '/skills/ad-manager':
      'Hola, soy Clyde, un compañero de IA. Dame un briefing y te saco variantes.',
    '/skills/email-management':
      'Hola, soy Clyde, un compañero de IA. Filtro tu Gmail y envío un resumen diario de lo que importa.',
    '/skills/reporting':
      'Hola, soy Clyde, un compañero de IA. Puedo mostrarte cómo es un informe semanal.',
    '/pricing':
      'Hola, soy Clyde, un compañero de IA. Puedo calcular tu ROI o repasar los planes.',
    '/apply':
      'Hola, soy Clyde, un compañero de IA. ¿Dudas antes de aplicar? Pregunta lo que quieras.',
    '/about': 'Hola, soy Clyde, un compañero de IA. ¿Quieres saber cómo trabajo?',
    default: 'Hola, soy Clyde, el compañero de IA de tu agencia. ¿Qué necesitas?',
  },
}

/**
 * Context-aware suggested prompts per locale + page path. Exactly 3 per path: the
 * empty-state renders them as one column of chips. The guided tour is a link, not a
 * chip. These are SENT verbatim as a message when clicked, so localizing them keeps
 * Clyde answering in the visitor's language.
 */
export const SUGGESTED_PROMPTS: Record<ChatLocale, Record<string, string[]>> = {
  nl: {
    '/': ['Wat kun je voor mijn bureau doen?', 'Wat kost het?', 'Laat een echte klant zien'],
    '/skills/social-media': [
      'Plan content voor volgende week',
      'Maak posts voor een skincare-merk',
      'Welke platforms dek je?',
    ],
    '/skills/voice-agent': [
      'Hoe neem je telefoons op?',
      'Laat een gespreksflow zien',
      'Welke talen ondersteun je?',
    ],
    '/skills/lead-qualifier': [
      'Score een voorbeeld-lead',
      'Hoe werkt kwalificatie?',
      'Toon scoring-criteria',
    ],
    '/pricing': ['Bereken ROI voor mijn bureau', 'Vergelijk de tiers', 'Wat zit er in Growth?'],
    default: ['Wat kun je voor mijn bureau doen?', 'Wat kost het?', 'Laat een echte klant zien'],
  },
  en: {
    '/': ['What can you do for my agency?', 'What does it cost?', 'Show me a real client'],
    '/skills/social-media': [
      'Plan content for next week',
      'Create posts for a skincare brand',
      'Which platforms do you cover?',
    ],
    '/skills/voice-agent': [
      'How do you answer calls?',
      'Show a call flow',
      'Which languages do you support?',
    ],
    '/skills/lead-qualifier': [
      'Score a sample lead',
      'How does qualification work?',
      'Show the scoring criteria',
    ],
    '/pricing': ['Calculate ROI for my agency', 'Compare the tiers', "What's in Growth?"],
    default: ['What can you do for my agency?', 'What does it cost?', 'Show me a real client'],
  },
  es: {
    '/': ['¿Qué puedes hacer por mi agencia?', '¿Cuánto cuesta?', 'Muéstrame un cliente real'],
    '/skills/social-media': [
      'Planifica contenido para la próxima semana',
      'Crea publicaciones para una marca de skincare',
      '¿Qué plataformas cubres?',
    ],
    '/skills/voice-agent': [
      '¿Cómo atiendes las llamadas?',
      'Muestra un flujo de llamada',
      '¿Qué idiomas admites?',
    ],
    '/skills/lead-qualifier': [
      'Puntúa un lead de ejemplo',
      '¿Cómo funciona la cualificación?',
      'Muestra los criterios de puntuación',
    ],
    '/pricing': ['Calcula el ROI para mi agencia', 'Compara los planes', '¿Qué incluye Growth?'],
    default: ['¿Qué puedes hacer por mi agencia?', '¿Cuánto cuesta?', 'Muéstrame un cliente real'],
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
export const PROACTIVE_PROMPTS: Record<ChatLocale, Partial<Record<string, string>>> = {
  nl: {
    '/skills/voice-agent': 'Hoe neem je precies een telefoon op?',
    '/skills/social-media': 'Maak een content-plan voor mijn merk',
    '/skills/lead-qualifier': 'Score een voorbeeld-lead voor mij',
    '/skills/ad-manager': 'Genereer 3 ad-varianten voor mij',
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
    '/skills/ad-manager': 'Generate 3 ad variants for me',
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
    '/skills/ad-manager': 'Genera 3 variantes de anuncio para mí',
    '/skills/email-management': '¿Cómo filtras mi bandeja de entrada?',
    '/skills/reporting': 'Muéstrame un informe semanal',
    '/skills/blog-factory': 'Planifica un artículo SEO para mí',
    '/skills/clyde': '¿Cómo trabajas como orquestador?',
    '/skills/research': 'Haz un estudio de mercado para mí',
    '/skills/seo-geo': '¿Cómo monitorizas las citas de IA?',
    '/pricing': 'Calcula mi ROI',
    '/about': '¿Cómo funciona exactamente la plataforma?',
  },
}

/**
 * Proactive in-chat follow-up messages, keyed by locale then path. Injected as a
 * Clyde (assistant) bubble after 2 min of silence in an active conversation, so they
 * are display-only and must read in the visitor's language.
 */
export const PROACTIVE_FOLLOWUPS: Record<ChatLocale, Record<string, string>> = {
  nl: {
    '/': 'Wil je dat ik een korte rondleiding geef door mijn vaardigheden?',
    '/skills/social-media': 'Zal ik een content-kalender voor een testmerk opzetten?',
    '/skills/voice-agent': 'Zal ik laten zien hoe ik een inkomend gesprek afhandel?',
    '/skills/lead-qualifier': 'Wil je dat ik een echte lead voor je kwalificeer?',
    '/skills/ad-manager': 'Zal ik 3 ad-varianten genereren voor een testproduct?',
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
    '/skills/ad-manager': 'Shall I generate 3 ad variants for a test product?',
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
    '/skills/ad-manager': '¿Genero 3 variantes de anuncio para un producto de prueba?',
    '/skills/email-management': '¿Quieres ver cómo organizaría tu bandeja de entrada?',
    '/skills/reporting': '¿Genero un informe semanal de ejemplo?',
    '/skills/blog-factory': '¿Quieres que planifique un artículo SEO para una marca de prueba?',
    '/skills/clyde': '¿Te muestro cómo orquesto varias habilidades a la vez?',
    '/skills/research': '¿Quieres que haga un estudio de mercado para tu nicho?',
    '/skills/seo-geo': '¿Reviso las citas de IA para tu dominio?',
    '/pricing': '¿Quieres que calcule el ROI para el tamaño de tu agencia?',
    '/about': '¿Te muestro cómo trabajo en la práctica?',
    default: '¿Hay algo específico en lo que pueda ayudarte?',
  },
}


/**
 * Page-aware whispers shown after 20s of scroll-idle. Tone: senior
 * Dutch colleague making a statement, not a chatbot asking "how can I
 * help?". Same path keys as WELCOME_MESSAGES; en/es translate the NL lines
 * one-to-one (no extra claims).
 */
export const WHISPERS: Record<ChatLocale, Record<string, string>> = {
  nl: {
    '/': 'Vraag me wat.',
    '/skills/voice-agent': 'Telefoon? Ik laat het zien.',
    '/skills/social-media': 'Content-kalender nodig?',
    '/skills/lead-qualifier': 'Dit is wat je klanten krijgen.',
    '/skills/ad-manager': 'Brief? Ik maak varianten.',
    '/skills/email-management': 'Inbox-classificatie tonen?',
    '/skills/reporting': 'Een weekrapport laten zien?',
    '/pricing': 'ROI berekenen.',
    '/apply': 'Vraag voor je invult?',
    '/about': 'Vraag maar.',
  },
  en: {
    '/': 'Ask me something.',
    '/skills/voice-agent': 'Phone? I will show you.',
    '/skills/social-media': 'Need a content calendar?',
    '/skills/lead-qualifier': 'This is what your clients get.',
    '/skills/ad-manager': 'Brief? I make variants.',
    '/skills/email-management': 'Show the inbox classification?',
    '/skills/reporting': 'Show a weekly report?',
    '/pricing': 'Calculate ROI.',
    '/apply': 'A question before you fill it in?',
    '/about': 'Just ask.',
  },
  es: {
    '/': 'Pregúntame algo.',
    '/skills/voice-agent': '¿Teléfono? Te lo muestro.',
    '/skills/social-media': '¿Necesitas un calendario de contenido?',
    '/skills/lead-qualifier': 'Esto es lo que reciben tus clientes.',
    '/skills/ad-manager': '¿Briefing? Hago variantes.',
    '/skills/email-management': '¿Te muestro la clasificación del correo?',
    '/skills/reporting': '¿Te muestro un informe semanal?',
    '/pricing': 'Calcular el ROI.',
    '/apply': '¿Una pregunta antes de rellenarlo?',
    '/about': 'Pregunta cuando quieras.',
  },
}
