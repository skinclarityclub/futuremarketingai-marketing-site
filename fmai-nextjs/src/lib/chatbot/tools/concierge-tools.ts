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
  testimonial?: string
  url: string
}

const CASE_STUDY_SKC: Record<ChatbotLocale, CaseStudy> = {
  nl: {
    client: 'SkinClarity Club',
    industry: 'Huidverzorging: een club, een webshop en het account van oprichter Sindy',
    challenge:
      'SkinClarity Club is onze eerste klant, en FutureMarketingAI is het bureau. Drie Instagram-accounts (@skinclarityclub, @sindy_huidtherapeut, @skinclarityshop), elk met een eigen publiek, toon en agenda, plus een blog en een webshop.',
    solution:
      'Eén werkruimte voor SkinClarity Club met 3 Instagram-accounts en één geheugen voor de hele klant. Van mei tot oktober 2026 maakte Clyde de posts in de stem van elk account; een post ging pas live als hij in de app was goedgekeurd, op de tijd uit de agenda.',
    results: [
      'Posts voor 3 Instagram-accounts, elk in een eigen stem',
      'Van mei tot oktober 2026, vanuit één geheugen',
      'Live pas na goedkeuring in de app',
    ],
    url: 'https://future-marketing.ai/nl/case-studies/skinclarity-club',
  },
  en: {
    client: 'SkinClarity Club',
    industry: 'Skincare: a club, a webshop and the account of founder Sindy',
    challenge:
      'SkinClarity Club is our first client, and FutureMarketingAI is the agency. Three Instagram accounts (@skinclarityclub, @sindy_huidtherapeut, @skinclarityshop), each with its own audience, tone and agenda, plus a blog and a webshop.',
    solution:
      'One workspace for SkinClarity Club with 3 Instagram accounts and one memory for the whole client. From May to October 2026 Clyde made the posts in the voice of each account; a post went live only after approval in the app, at the time from the calendar.',
    results: [
      'Posts for 3 Instagram accounts, each in its own voice',
      'May to October 2026, from one memory',
      'Live only after approval in the app',
    ],
    url: 'https://future-marketing.ai/en/case-studies/skinclarity-club',
  },
  es: {
    client: 'SkinClarity Club',
    industry: 'Cuidado de la piel: un club, una tienda online y la cuenta de la fundadora Sindy',
    challenge:
      'SkinClarity Club es nuestro primer cliente, y FutureMarketingAI es la agencia. Tres cuentas de Instagram (@skinclarityclub, @sindy_huidtherapeut, @skinclarityshop), cada una con su propio público, tono y agenda, además de un blog y una tienda online.',
    solution:
      'Un espacio de trabajo para SkinClarity Club con 3 cuentas de Instagram y una memoria para todo el cliente. De mayo a octubre de 2026 Clyde hizo los posts con la voz de cada cuenta; un post solo se publicaba tras aprobarse en la app, a la hora de la agenda.',
    results: [
      'Posts para 3 cuentas de Instagram, cada una con su propia voz',
      'De mayo a octubre de 2026, desde una sola memoria',
      'Publicado solo tras la aprobación en la app',
    ],
    url: 'https://future-marketing.ai/es/case-studies/skinclarity-club',
  },
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/skills/social-media': 'Social Media Manager',
  '/skills/blog-factory': 'Blog Factory',
  '/skills/ad-manager': 'Ad Manager',
  '/skills/reel-builder': 'Reel Builder',
  '/skills/voice-agent': 'Voice Agent',
  '/skills/lead-qualifier': 'Lead Qualifier',
  '/skills/email-management': 'Email Management',
  '/skills/manychat': 'ManyChat DM',
  '/skills/reporting': 'Reporting & Analytics',
  '/skills/seo-geo': 'SEO / GEO Analyst',
  '/skills/research': 'Research',
  '/skills/clyde': 'Clyde, AI colleague',
  '/memory': 'Memory System',
  '/case-studies/skinclarity-club': 'SkinClarity Club Case Study',
  '/apply': 'Apply',
  '/pricing': 'Pricing',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/how-it-works': 'How It Works',
}

export function buildConciergeTools(locale: ChatbotLocale) {
  return {
    get_skills: tool({
      description:
        'Get information about FutureMarketingAI skills. Use "all" for an overview of all 12 skills (10 live and 2 coming_soon), or pick a specific skill id. Skills are the core product: Clyde orchestrates these 12 skills across client brands.',
      inputSchema: z.object({
        skillId: z
          .enum([
            'all',
            'social-media',
            'blog-factory',
            'ad-manager',
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
            '/case-studies/skinclarity-club',
            '/skills/social-media',
            '/skills/blog-factory',
            '/skills/ad-manager',
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
        'Get the SkinClarity Club case study: how Clyde works for our first client (no published result figures yet). Use when user asks for proof, evidence, real results, case study, testimonial, bewijs, concrete resultaten, heeft het gewerkt, echt gebruik, referentie, or wants to see a real example before deciding.',
      inputSchema: z.object({
        studyId: z.enum(['skc']).default('skc').describe('The case study identifier'),
      }),
      execute: async () => ({ caseStudy: CASE_STUDY_SKC[locale] }),
    }),
  }
}

/** Backward-compatible static export (NL build). */
export const conciergeTools = buildConciergeTools('nl')
