import { tool } from 'ai'
import { z } from 'zod'
import { getChatbotSkills, getChatbotSkill, getSkillsOverviewCopy } from '@/lib/chatbot/skill-i18n'
import type { ChatbotLocale } from '@/lib/chatbot/tool-data'

interface CaseStudy {
  client: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  testimonial: string
  url: string
}

const CASE_STUDY_SKC: Record<ChatbotLocale, CaseStudy> = {
  nl: {
    client: 'SkinClarity Club',
    industry: 'Beauty / skincare (DTC en fysieke kliniek)',
    challenge:
      'Sindy runt SkinClarity Club over 4 merken en 3 Instagram-accounts. Als solo-operator zat ze aan haar capaciteitsplafond. Ze wilde organische content opschalen zonder een bureau of junior marketeer in te huren.',
    solution:
      'Clyde (de AI Marketing Medewerker) ingezet met 6 van de 12 vaardigheden: Social Media, Blog Factory, Rapportage, SEO/GEO, Research en de Clyde-orchestrator. Geheugen per account gescheiden. Wekelijkse performance-digest op maandag 08:00. Nachtelijke geheugenconsolidatie.',
    results: [
      'Circa 21 carrousels per week over 3 Instagram-accounts',
      'Circa 15 Instagram-posts per week',
      '2 tot 4 longform blogartikelen per maand, SEO-geoptimaliseerd',
      'Wekelijks SEO-rapport en maandagse performance-digest',
      'Goedkeuringstijd carrousel van 4 minuten naar 30 seconden',
      'Geen extra personeel',
    ],
    testimonial:
      '"Clyde beheert onze volledige social-contentoperatie over 3 Instagram-accounts en 4 merken. Wat eerst een hele middag per week kostte, draait nu autonoom op de achtergrond. Ik beoordeel, Clyde voert uit." Sindy, founder SkinClarity Club',
    url: 'https://future-marketing.ai/nl/case-studies/skinclarity-club',
  },
  en: {
    client: 'SkinClarity Club',
    industry: 'Beauty / skincare (DTC plus physical clinic)',
    challenge:
      'Sindy runs SkinClarity Club across 4 brands and 3 Instagram accounts. As a single operator she hit her capacity ceiling. She wanted to scale organic content without hiring an agency or a junior marketer.',
    solution:
      'Deployed Clyde (the AI Marketing Employee) with 6 of 12 skills active: Social Media, Blog Factory, Reporting, SEO/GEO, Research and the Clyde orchestrator. Per-account memory isolation. Weekly performance digest at Monday 08:00. Overnight memory consolidation.',
    results: [
      'About 21 carousels per week across 3 Instagram accounts',
      'About 15 Instagram posts per week',
      '2 to 4 longform blog articles per month, SEO-optimized',
      'Weekly SEO report and Monday performance digest',
      'Carousel approval time from 4 minutes to 30 seconds',
      'Zero added headcount',
    ],
    testimonial:
      '"Clyde runs our entire social content operation across 3 Instagram accounts and 4 brands. What used to take a whole afternoon a week now runs autonomously in the background. I review, Clyde executes." Sindy, founder of SkinClarity Club',
    url: 'https://future-marketing.ai/en/case-studies/skinclarity-club',
  },
  es: {
    client: 'SkinClarity Club',
    industry: 'Belleza / cuidado de la piel (DTC y clínica física)',
    challenge:
      'Sindy gestiona SkinClarity Club en 4 marcas y 3 cuentas de Instagram. Como operadora en solitario llegó a su límite de capacidad. Quería escalar el contenido orgánico sin contratar una agencia ni un marketero junior.',
    solution:
      'Se desplegó Clyde (el Empleado de Marketing IA) con 6 de las 12 habilidades: Social Media, Blog Factory, Reporting, SEO/GEO, Research y el orquestador Clyde. Memoria aislada por cuenta. Resumen de rendimiento semanal los lunes a las 08:00. Consolidación de memoria nocturna.',
    results: [
      'Cerca de 21 carruseles por semana en 3 cuentas de Instagram',
      'Cerca de 15 publicaciones de Instagram por semana',
      '2 a 4 artículos de blog largos al mes, optimizados para SEO',
      'Informe SEO semanal y resumen de rendimiento de los lunes',
      'Tiempo de aprobación de carrusel de 4 minutos a 30 segundos',
      'Sin personal adicional',
    ],
    testimonial:
      '"Clyde gestiona toda nuestra operación de contenido social en 3 cuentas de Instagram y 4 marcas. Lo que antes ocupaba toda una tarde a la semana ahora funciona de forma autónoma en segundo plano. Yo reviso, Clyde ejecuta." Sindy, fundadora de SkinClarity Club',
    url: 'https://future-marketing.ai/es/case-studies/skinclarity-club',
  },
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/skills/social-media': 'Social Media Manager',
  '/skills/blog-factory': 'Blog Factory',
  '/skills/ad-creator': 'Ad Creator',
  '/skills/reel-builder': 'Reel Builder',
  '/skills/voice-agent': 'Voice Agent',
  '/skills/lead-qualifier': 'Lead Qualifier',
  '/skills/email-management': 'Email Management',
  '/skills/manychat': 'ManyChat DM',
  '/skills/reporting': 'Reporting & Analytics',
  '/skills/seo-geo': 'SEO / GEO Analyst',
  '/skills/research': 'Research',
  '/skills/clyde': 'Clyde AI Employee',
  '/memory': 'Memory System',
  '/case-studies/skinclarity-club': 'SkinClarity Club Case Study',
  '/apply': 'Apply',
  '/pricing': 'Pricing',
  '/founding-member': 'Founding Member program',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/how-it-works': 'How It Works',
}

export function buildConciergeTools(locale: ChatbotLocale) {
  return {
    get_skills: tool({
      description:
        'Get information about FutureMarketingAI skills. Use "all" for an overview of all 12 skills (9 live and 3 coming_soon), or pick a specific skill id. Skills are the core product: Clyde orchestrates these 12 skills across client brands.',
      inputSchema: z.object({
        skillId: z
          .enum([
            'all',
            'social-media',
            'blog-factory',
            'ad-creator',
            'reel-builder',
            'voice-agent',
            'lead-qualifier',
            'email-management',
            'manychat',
            'reporting',
            'seo-geo',
            'research',
            'clyde',
          ])
          .describe('Which skill to get details about'),
      }),
      execute: async ({ skillId }) => {
        const skills = getChatbotSkills(locale)
        if (skillId === 'all') {
          const liveCount = skills.filter((s) => s.status === 'live').length
          const comingSoonCount = skills.filter((s) => s.status === 'coming_soon').length
          const overview = getSkillsOverviewCopy(locale)
          return {
            name: overview.name,
            description: overview.summary(liveCount, comingSoonCount),
            services: skills.map((s) => ({
              name: s.name,
              description: s.shortDescription,
              url: s.route,
              status: s.status,
            })),
          }
        }
        const skill = getChatbotSkill(locale, skillId)
        if (!skill) return { error: `Unknown skill: ${skillId}` }
        return {
          name: skill.name,
          description: skill.longDescription,
          features: skill.features,
          url: skill.route,
          status: skill.status,
        }
      },
    }),

    book_call: tool({
      description:
        'Open the application page for a partnership call. Clyde does not self-serve; bookings are application-gated.',
      inputSchema: z.object({
        reason: z.string().describe('Why the user wants to book a call'),
      }),
      execute: async ({ reason }) => ({
        action: 'open_apply',
        url: `https://future-marketing.ai/${locale}/apply`,
        reason,
      }),
    }),

    navigate_to_page: tool({
      description: 'Navigate the user to a specific page on the FutureMarketingAI website.',
      inputSchema: z.object({
        page: z
          .enum([
            '/',
            '/memory',
            '/pricing',
            '/apply',
            '/founding-member',
            '/case-studies/skinclarity-club',
            '/skills/social-media',
            '/skills/blog-factory',
            '/skills/ad-creator',
            '/skills/reel-builder',
            '/skills/voice-agent',
            '/skills/lead-qualifier',
            '/skills/email-management',
            '/skills/manychat',
            '/skills/reporting',
            '/skills/seo-geo',
            '/skills/research',
            '/skills/clyde',
            '/about',
            '/contact',
            '/how-it-works',
          ])
          .describe('The page URL to navigate to'),
      }),
      execute: async ({ page }) => ({
        action: 'navigate',
        url: page,
        label: PAGE_LABELS[page] ?? page,
      }),
    }),

    get_case_study: tool({
      description:
        'Get the SkinClarity Club case study showing FMai results with a real client. Use when user asks for proof, evidence, real results, case study, testimonial, bewijs, concrete resultaten, heeft het gewerkt, echt gebruik, referentie, or wants to see a real example before deciding.',
      inputSchema: z.object({
        studyId: z.enum(['skc']).default('skc').describe('The case study identifier'),
      }),
      execute: async () => ({ caseStudy: CASE_STUDY_SKC[locale] }),
    }),
  }
}

/** Backward-compatible static export (NL build). */
export const conciergeTools = buildConciergeTools('nl')
