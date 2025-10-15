/**
 * Conversation Personality & Voice
 *
 * Industry-specific personality traits and message templates
 */

export interface PersonalityTrait {
  tone: 'friendly' | 'professional' | 'enthusiastic' | 'empathetic'
  emoji: boolean
  formality: 'casual' | 'semi-formal' | 'formal'
  enthusiasm: 'high' | 'medium' | 'low'
}

export interface MessageTemplate {
  greeting: string[]
  nudges: {
    explored_two_modules: string[]
    high_engagement: string[]
    calculator_completed: string[]
    time_on_site_2min: string[]
    time_on_site_5min: string[]
  }
  responses: {
    platform_info: string[]
    calculator_request: string[]
    demo_request: string[]
    question: string[]
  }
  encouragement: string[]
  transition: string[]
}

// Personality by industry
export const industryPersonality: Record<string, PersonalityTrait> = {
  ecommerce: {
    tone: 'enthusiastic',
    emoji: true,
    formality: 'casual',
    enthusiasm: 'high',
  },
  saas: {
    tone: 'professional',
    emoji: true,
    formality: 'semi-formal',
    enthusiasm: 'medium',
  },
  agency: {
    tone: 'friendly',
    emoji: true,
    formality: 'semi-formal',
    enthusiasm: 'high',
  },
  default: {
    tone: 'friendly',
    emoji: true,
    formality: 'semi-formal',
    enthusiasm: 'medium',
  },
}

// Message templates by industry
export const messageTemplates: Record<string, MessageTemplate> = {
  ecommerce: {
    greeting: [
      '👋 Welkom! Als e-commerce expert zie ik dat automatisering jouw verkoop kan verveelvoudigen. Waar kan ik je mee helpen?',
      '🚀 Hey! Klaar om je e-commerce marketing naar het volgende level te tillen? Ik help je graag!',
      '💰 Welkom! E-commerce draait om conversie. Laat me je laten zien hoe AI je sales kan boosten.',
    ],
    nudges: {
      explored_two_modules: [
        '🎯 Nice! Je hebt al {count} modules verkend. Benieuwd naar je potentiële ROI? Laten we het berekenen!',
        '⚡ Je bent goed bezig! Wil je zien hoeveel tijd en geld AI automatisering je kan besparen?',
      ],
      high_engagement: [
        '🌟 Ik zie dat je serieus interesse hebt! Wil je een persoonlijke demo met concrete voorbeelden voor e-commerce?',
        '💎 Je bent echt engaged! Perfect moment voor een demo met onze e-commerce specialisten.',
      ],
      calculator_completed: [
        '🎉 Wow! Een ROI van {roi}! Dat is impressive. Zullen we bespreken hoe we dit voor jouw webshop realiseren?',
        '💰 Die cijfers zijn veelbelovend! Klaar om van deze potentie realiteit te maken?',
      ],
      time_on_site_2min: [
        '👀 Neem de tijd om te verkennen! Tip: Check de Content Factory voor automatische productbeschrijvingen.',
        '🔍 Interessant wat je ziet? De ROI Calculator laat zien wat dit voor jouw omzet betekent.',
      ],
      time_on_site_5min: [
        '⭐ Je bent echt aan het verdiepen! Klaar voor een persoonlijk gesprek over jouw e-commerce uitdagingen?',
        '🚀 5 minuten al! Je bent seriously interested. Wil je een demo zien specifiek voor e-commerce?',
      ],
    },
    responses: {
      platform_info: [
        '💫 FutureMarketingAI automatiseert je complete e-commerce marketing: van productbeschrijvingen tot campagnes en analytics. Alles in één platform, AI-powered!',
        '🎯 Ons platform centraliseert je content, campagnes en data. AI doet het zware werk, jij focust op groei.',
      ],
      calculator_request: [
        '📊 Geweldig! De ROI Calculator toont je exacte besparingen en omzetgroei. Scroll naar beneden om hem te zien!',
        '💰 Smart move! Bereken je ROI en zie direct de impact van automatisering op je bottom line.',
      ],
      demo_request: [
        '📅 Excellent keuze! Ik verbind je met ons team voor een persoonlijke demo met e-commerce cases.',
        '🎬 Perfect! Laten we een demo inplannen met concrete voorbeelden voor jouw branche.',
      ],
      question: [
        '❓ Goede vraag! Waar kan ik je mee helpen? Vertel gerust.',
        '🤔 Natuurlijk! Stel je vraag, ik help je graag verder.',
      ],
    },
    encouragement: [
      '🔥 Je bent op de goede weg!',
      '⚡ Awesome progress!',
      '💪 Keep going!',
      '🎯 Perfect!',
    ],
    transition: ['Trouwens...', 'Oh, en...', 'By the way...', 'Even iets anders...'],
  },

  saas: {
    greeting: [
      '👋 Welkom! Als SaaS professional weet je: groei = efficiency. Ik laat je zien hoe we jouw marketing automatiseren.',
      '🚀 Hey! Klaar om je marketing stack te upgraden met AI? Laat me je de mogelijkheden tonen.',
      '💼 Welkom! SaaS marketing vraagt om schaalbaarheid. Laat me je laten zien hoe AI dat mogelijk maakt.',
    ],
    nudges: {
      explored_two_modules: [
        '📊 Goede voortgang! Je hebt {count} modules gezien. Tijd om de cijfers te bekijken?',
        '🎯 Je snapt de waarde. Wil je berekenen wat dit voor jouw MRR betekent?',
      ],
      high_engagement: [
        '💎 Ik zie serieuze interesse. Wil je een technical deep-dive met ons product team?',
        '🌟 Je bent thoroughly engaged. Perfect timing voor een strategisch gesprek.',
      ],
      calculator_completed: [
        '📈 Impressive ROI van {roi}! Laten we bespreken hoe we dit naar jouw pipeline translaten.',
        '💰 Die metrics zijn veelbelovend. Klaar om dit in je stack te integreren?',
      ],
      time_on_site_2min: [
        '🔍 Neem de tijd voor exploratie. Pro tip: Check hoe we integreren met je existing stack.',
        '💡 Interessant toch? De Calculator toont de impact op je customer acquisition cost.',
      ],
      time_on_site_5min: [
        '🎯 Je doet thorough research. Klaar voor een technical discussion?',
        '📊 5 minuten diep in de materie. Wil je een demo met API walkthrough?',
      ],
    },
    responses: {
      platform_info: [
        '🚀 FutureMarketingAI is een unified marketing automation platform met AI at its core. Centraliseer content, campaigns, en analytics.',
        '💼 We bieden een comprehensive solution: content generation, campaign orchestration, en predictive analytics. Alles API-first.',
      ],
      calculator_request: [
        '📊 Smart. De Calculator toont je cost savings en efficiency gains. Check hem hieronder!',
        '💰 Excellent. Bereken je ROI en zie de impact op je unit economics.',
      ],
      demo_request: [
        '📅 Perfect. Ik schedule een demo met technical walkthrough en integration examples.',
        '🎬 Great timing. Laten we een session inplannen met product deep-dive.',
      ],
      question: ['💭 Goede vraag. Wat wil je weten?', '🤓 Zeker. Shoot, ik help je graag.'],
    },
    encouragement: ['✅ Solid progress!', '📈 Great momentum!', '🎯 Spot on!', '💪 Well done!'],
    transition: ['Nog iets...', 'Daarnaast...', 'Ook belangrijk...', 'Een andere vraag...'],
  },

  agency: {
    greeting: [
      '👋 Welkom! Als agency weet je dat client delivery en efficiency key zijn. Laat me je laten zien hoe we dat optimaliseren.',
      '🎨 Hey! Klaar om je agency workflow te transformeren? Ik toon je de mogelijkheden!',
      '💼 Welkom! Agency life is hectisch. Laat me je laten zien hoe AI je team versterkt.',
    ],
    nudges: {
      explored_two_modules: [
        '🎯 Nice work! {count} modules gezien. Wil je zien hoeveel tijd dit je team bespaart?',
        '⚡ Je bent goed bezig! Tijd om te berekenen wat dit je billable hours oplevert?',
      ],
      high_engagement: [
        '🌟 Ik zie echte interesse! Wil je een demo met agency-specific use cases?',
        '💎 Je bent seriously engaged. Perfect voor een gesprek over agency workflow optimization.',
      ],
      calculator_completed: [
        '🎉 ROI van {roi}! Dat is meer tijd voor strategy en client work. Zullen we dit bespreken?',
        '💰 Die cijfers zijn impressive! Klaar om dit voor je agency te realiseren?',
      ],
      time_on_site_2min: [
        '👀 Verken gerust verder! Tip: Kijk hoe we multi-client workflows stroomlijnen.',
        '🔍 Interessant? De Calculator toont wat dit voor je agency margins betekent.',
      ],
      time_on_site_5min: [
        '⭐ Je doet thorough research! Klaar voor een agency-focused demo?',
        '🚀 5 minuten diep! Wil je zien hoe andere agencies dit gebruiken?',
      ],
    },
    responses: {
      platform_info: [
        '💫 FutureMarketingAI helpt agencies scale: automatische content, multi-client campaigns, en geïntegreerde analytics. Focus op strategy, niet execution.',
        '🎯 Ons platform centraliseert je agency workflow: content creation, campaign management, en client reporting. Alles in één systeem.',
      ],
      calculator_request: [
        '📊 Smart! De Calculator laat zien hoeveel billable hours je vrijspeelt. Scroll naar beneden!',
        '💰 Excellent! Bereken je ROI en zie de impact op je agency profitability.',
      ],
      demo_request: [
        '📅 Perfect timing! Ik plan een demo met agency-specific workflows en multi-client examples.',
        '🎬 Great! Laten we een session boeken met concrete agency use cases.',
      ],
      question: [
        '❓ Goede vraag! Vertel, wat wil je weten?',
        '🤔 Natuurlijk! Shoot, ik help je graag.',
      ],
    },
    encouragement: ['🔥 Great work!', '⚡ You got this!', '💪 Keep it up!', '🎯 Nailed it!'],
    transition: ['Oh, en...', 'Trouwens...', 'Even tussendoor...', 'Nog iets...'],
  },

  // Default for non-specific or general industry
  default: {
    greeting: [
      '👋 Welkom bij FutureMarketingAI! Ik ben je AI Marketing Guide. Verken onze mogelijkheden, bereken je ROI, of plan direct een demo.',
      '🚀 Hey! Fijn dat je er bent. Waar kan ik je mee helpen vandaag?',
      '💫 Welkom! Laat me je door onze AI-powered marketing platform leiden.',
    ],
    nudges: {
      explored_two_modules: [
        '🎯 Goed bezig! Je hebt {count} modules gezien. Wil je je potentiële ROI berekenen?',
        '⚡ Nice! {count} modules verkend. Benieuwd naar de cijfers?',
      ],
      high_engagement: [
        '🌟 Ik zie serieuze interesse! Wil je een persoonlijke demo?',
        '💎 Je bent echt engaged! Perfect moment voor een diepgaand gesprek.',
      ],
      calculator_completed: [
        '🎉 Impressive! Een ROI van {roi}. Zullen we bespreken hoe we dit realiseren?',
        '💰 Die cijfers zien er goed uit! Klaar om de volgende stap te zetten?',
      ],
      time_on_site_2min: [
        '👀 Neem de tijd om te verkennen! Elke module heeft unieke capabilities.',
        '🔍 Interessant wat je ziet? Check ook de ROI Calculator!',
      ],
      time_on_site_5min: [
        '⭐ 5 minuten al! Je bent echt aan het verdiepen. Klaar voor een demo?',
        '🚀 Je doet thorough research. Wil je een persoonlijk gesprek?',
      ],
    },
    responses: {
      platform_info: [
        '💫 FutureMarketingAI is een AI-powered marketing platform dat content, campagnes en analytics centraliseert en automatiseert.',
        '🎯 Ons platform combineert AI content generation, campaign orchestration, en predictive analytics in één systeem.',
      ],
      calculator_request: [
        '📊 Goede keuze! De ROI Calculator toont je exacte besparingen en voordelen. Scroll naar beneden!',
        '💰 Smart! Bereken je ROI en zie direct de impact van automatisering.',
      ],
      demo_request: [
        '📅 Excellent! Ik verbind je met ons team voor een persoonlijke demo.',
        '🎬 Perfect! Laten we een demo inplannen die past bij jouw behoeften.',
      ],
      question: [
        '❓ Goede vraag! Waar kan ik je mee helpen?',
        '🤔 Natuurlijk! Stel gerust je vraag.',
      ],
    },
    encouragement: ['🔥 Great!', '⚡ Awesome!', '💪 Nice!', '🎯 Perfect!'],
    transition: ['Trouwens...', 'Oh ja...', 'Even tussendoor...', 'Nog iets...'],
  },
}

// Helper to get random message from array
export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

// Helper to get personality for industry
export function getPersonality(industryId: string | null): PersonalityTrait {
  if (!industryId) {
    return industryPersonality.default
  }
  return industryPersonality[industryId] || industryPersonality.default
}

// Helper to get templates for industry
export function getTemplates(industryId: string | null): MessageTemplate {
  if (!industryId) {
    return messageTemplates.default
  }
  return messageTemplates[industryId] || messageTemplates.default
}

// Helper to format message with variables
export function formatMessage(template: string, variables: Record<string, any>): string {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value))
  })
  return result
}
