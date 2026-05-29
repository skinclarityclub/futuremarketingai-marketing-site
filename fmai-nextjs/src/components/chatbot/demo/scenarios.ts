export interface DemoCheckpoint {
  prompt: string
  options: { label: string; action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario' }[]
}

export interface DemoStep {
  userMessage: string
  expectTool?: string
  checkpoint?: DemoCheckpoint
}

export interface DemoScenario {
  id: string
  title: string
  subtitle: string
  icon: string // Lucide icon name (see DemoScenarioCard ICON_MAP)
  stepCount: number
  steps: DemoStep[]
}

export type DemoLocale = 'nl' | 'en' | 'es'

function normalizeDemoLocale(value: string): DemoLocale {
  return value === 'en' || value === 'es' ? value : 'nl'
}

/**
 * Guided-demo scenarios, localized per visitor language.
 *
 * WHY: the demo is reachable from the floating Clyde widget on every page, so on
 * /nl it must read Dutch and stay on-product. The legacy skincare + support
 * scenarios (and the non-existent "Marketing Machine") were removed — both
 * remaining scenarios use only the real agency tools (get_skills, get_case_study,
 * get_roi_estimate, get_pricing_info, qualify_lead, book_call). The scripted
 * `userMessage`s are localized so the user bubbles render in the visitor's
 * language; Clyde then replies in that language (persona language-match rule).
 */
const SCENARIOS: Record<DemoLocale, DemoScenario[]> = {
  nl: [
    {
      id: 'new-client',
      title: 'De nieuwe klant',
      subtitle: 'Zie hoe een bureau FutureMarketingAI ontdekt en beoordeelt',
      icon: 'Briefcase',
      stepCount: 6,
      steps: [
        { userMessage: 'Welke vaardigheden biedt FutureMarketingAI?', expectTool: 'get_skills' },
        { userMessage: 'Hebben jullie een case study?', expectTool: 'get_case_study' },
        {
          userMessage:
            'Hoeveel kunnen we besparen met AI-marketing? Ons team is 8 personen en we besteden ongeveer 40 uur per week aan marketing.',
          expectTool: 'get_roi_estimate',
          checkpoint: {
            prompt: 'Zal ik de tarieven laten zien?',
            options: [
              { label: 'Toon tarieven', action: 'next' },
              { label: 'Direct naar gesprek', action: 'skip-to-booking' },
              { label: 'Stop demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'Wat zijn jullie tarieven?', expectTool: 'get_pricing_info' },
        {
          userMessage:
            'Kun je onze fit beoordelen? We zijn een bureau met 6 merken, budget rond 2000 EUR, tijdlijn 1-3 maanden. Ik beslis mee.',
          expectTool: 'qualify_lead',
          checkpoint: {
            prompt: 'Klaar om een gesprek te plannen?',
            options: [
              { label: 'Plan een gesprek', action: 'next' },
              { label: 'Probeer ander scenario', action: 'next-scenario' },
              { label: 'Stop demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'Ik wil graag een kennismakingsgesprek plannen', expectTool: 'book_call' },
      ],
    },
    {
      id: 'scale-portfolio',
      title: 'Portfolio opschalen',
      subtitle: 'Zie hoe Clyde een groeiend merkenportfolio aankan',
      icon: 'TrendingUp',
      stepCount: 4,
      steps: [
        {
          userMessage: 'We beheren 12 merken. Hoe houdt Clyde de merkstem per merk gescheiden?',
          expectTool: 'get_skills',
        },
        {
          userMessage:
            'Wat levert dat op qua tijd voor een team van 5 dat 30 uur per week aan marketing besteedt?',
          expectTool: 'get_roi_estimate',
          checkpoint: {
            prompt: 'Benieuwd of jullie een goede fit zijn?',
            options: [
              { label: 'Beoordeel mijn fit', action: 'next' },
              { label: 'Direct naar gesprek', action: 'skip-to-booking' },
              { label: 'Stop demo', action: 'end' },
            ],
          },
        },
        {
          userMessage:
            'Beoordeel onze fit: bureau met 12 merken, budget 4000 EUR per maand, we willen direct starten en ik ben de beslisser.',
          expectTool: 'qualify_lead',
          checkpoint: {
            prompt: 'Een gesprek plannen?',
            options: [
              { label: 'Plan een gesprek', action: 'next' },
              { label: 'Stop demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'Ik wil een gesprek plannen', expectTool: 'book_call' },
      ],
    },
  ],
  en: [
    {
      id: 'new-client',
      title: 'The New Client Journey',
      subtitle: 'See how an agency discovers and evaluates FutureMarketingAI',
      icon: 'Briefcase',
      stepCount: 6,
      steps: [
        { userMessage: 'What skills does FutureMarketingAI offer?', expectTool: 'get_skills' },
        { userMessage: 'Do you have a case study?', expectTool: 'get_case_study' },
        {
          userMessage:
            'How much could we save with AI marketing? Our team is 8 people and we spend about 40 hours per week on marketing.',
          expectTool: 'get_roi_estimate',
          checkpoint: {
            prompt: 'Want to see the pricing next?',
            options: [
              { label: 'Show pricing', action: 'next' },
              { label: 'Skip to booking', action: 'skip-to-booking' },
              { label: 'End demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'What are your pricing plans?', expectTool: 'get_pricing_info' },
        {
          userMessage:
            'Can you evaluate our fit? We are an agency with 6 brands, budget around 2000 EUR, timeline 1-3 months. I am a decision maker.',
          expectTool: 'qualify_lead',
          checkpoint: {
            prompt: 'Ready to book a call?',
            options: [
              { label: 'Book a call', action: 'next' },
              { label: 'Try another scenario', action: 'next-scenario' },
              { label: 'End demo', action: 'end' },
            ],
          },
        },
        { userMessage: "I'd like to book an intro call", expectTool: 'book_call' },
      ],
    },
    {
      id: 'scale-portfolio',
      title: 'Scaling Your Portfolio',
      subtitle: 'See how Clyde handles a growing brand portfolio',
      icon: 'TrendingUp',
      stepCount: 4,
      steps: [
        {
          userMessage: 'We manage 12 brands. How does Clyde keep each brand voice separate?',
          expectTool: 'get_skills',
        },
        {
          userMessage:
            'What does that save in time for a team of 5 spending 30 hours per week on marketing?',
          expectTool: 'get_roi_estimate',
          checkpoint: {
            prompt: 'Curious whether you are a good fit?',
            options: [
              { label: 'Assess my fit', action: 'next' },
              { label: 'Skip to booking', action: 'skip-to-booking' },
              { label: 'End demo', action: 'end' },
            ],
          },
        },
        {
          userMessage:
            'Evaluate our fit: agency with 12 brands, budget 4000 EUR per month, we want to start right away and I am the decision maker.',
          expectTool: 'qualify_lead',
          checkpoint: {
            prompt: 'Book a call?',
            options: [
              { label: 'Book a call', action: 'next' },
              { label: 'End demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'I want to book a call', expectTool: 'book_call' },
      ],
    },
  ],
  es: [
    {
      id: 'new-client',
      title: 'El recorrido del nuevo cliente',
      subtitle: 'Mira cómo una agencia descubre y evalúa FutureMarketingAI',
      icon: 'Briefcase',
      stepCount: 6,
      steps: [
        { userMessage: '¿Qué habilidades ofrece FutureMarketingAI?', expectTool: 'get_skills' },
        { userMessage: '¿Tenéis un caso de éxito?', expectTool: 'get_case_study' },
        {
          userMessage:
            '¿Cuánto podríamos ahorrar con marketing de IA? Nuestro equipo es de 8 personas y dedicamos unas 40 horas por semana a marketing.',
          expectTool: 'get_roi_estimate',
          checkpoint: {
            prompt: '¿Te muestro las tarifas?',
            options: [
              { label: 'Ver tarifas', action: 'next' },
              { label: 'Ir a la reserva', action: 'skip-to-booking' },
              { label: 'Terminar demo', action: 'end' },
            ],
          },
        },
        { userMessage: '¿Cuáles son vuestras tarifas?', expectTool: 'get_pricing_info' },
        {
          userMessage:
            '¿Puedes evaluar nuestro encaje? Somos una agencia con 6 marcas, presupuesto en torno a 2000 EUR, plazo de 1-3 meses. Soy quien decide.',
          expectTool: 'qualify_lead',
          checkpoint: {
            prompt: '¿Listo para agendar una llamada?',
            options: [
              { label: 'Agendar una llamada', action: 'next' },
              { label: 'Probar otro escenario', action: 'next-scenario' },
              { label: 'Terminar demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'Quiero agendar una llamada de presentación', expectTool: 'book_call' },
      ],
    },
    {
      id: 'scale-portfolio',
      title: 'Escalar tu portafolio',
      subtitle: 'Mira cómo Clyde gestiona un portafolio de marcas en crecimiento',
      icon: 'TrendingUp',
      stepCount: 4,
      steps: [
        {
          userMessage: 'Gestionamos 12 marcas. ¿Cómo mantiene Clyde separada la voz de cada marca?',
          expectTool: 'get_skills',
        },
        {
          userMessage:
            '¿Cuánto tiempo ahorra eso a un equipo de 5 que dedica 30 horas por semana a marketing?',
          expectTool: 'get_roi_estimate',
          checkpoint: {
            prompt: '¿Quieres saber si encajáis bien?',
            options: [
              { label: 'Evaluar mi encaje', action: 'next' },
              { label: 'Ir a la reserva', action: 'skip-to-booking' },
              { label: 'Terminar demo', action: 'end' },
            ],
          },
        },
        {
          userMessage:
            'Evalúa nuestro encaje: agencia con 12 marcas, presupuesto 4000 EUR al mes, queremos empezar ya y soy quien decide.',
          expectTool: 'qualify_lead',
          checkpoint: {
            prompt: '¿Agendamos una llamada?',
            options: [
              { label: 'Agendar una llamada', action: 'next' },
              { label: 'Terminar demo', action: 'end' },
            ],
          },
        },
        { userMessage: 'Quiero agendar una llamada', expectTool: 'book_call' },
      ],
    },
  ],
}

const BOOKING_USER_MESSAGE: Record<DemoLocale, string> = {
  nl: 'Ik wil graag een kennismakingsgesprek plannen',
  en: "I'd like to book an intro call",
  es: 'Quiero agendar una llamada de presentación',
}

/** Localized guided-demo scenarios for the given locale. */
export function getDemoScenarios(locale: string): DemoScenario[] {
  return SCENARIOS[normalizeDemoLocale(locale)]
}

/** Booking step used when the user picks "skip-to-booking" at any checkpoint. */
export function getBookingStep(locale: string): DemoStep {
  return { userMessage: BOOKING_USER_MESSAGE[normalizeDemoLocale(locale)], expectTool: 'book_call' }
}
