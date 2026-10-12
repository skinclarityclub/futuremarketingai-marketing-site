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
      'Eén werkruimte voor SkinClarity Club met 3 Instagram-accounts en één geheugen voor de hele klant. Alle 10 live vaardigheden staan aan. Clyde maakt en plant de content volgens de agenda, het bureau keurt goed voordat er iets live gaat, en Sindy heeft een eigen dashboard en Clyde op WhatsApp.',
    results: [
      'Posts en carrousels voor 3 accounts, elk in een eigen toon',
      'SEO-blogs voor skinclarityclub.nl',
      'Elke week een rapport in het dashboard, elke vrijdag het SEO-rapport op WhatsApp',
      'Lead Qualifier, ManyChat DM en Ad Manager staan aan, maar zijn voor SKC nog niet in gebruik',
      'Gemeten resultaten volgen; we publiceren nog geen cijfers',
    ],
    url: 'https://future-marketing.ai/nl/case-studies/skinclarity-club',
  },
  en: {
    client: 'SkinClarity Club',
    industry: 'Skincare: a club, a webshop and the account of founder Sindy',
    challenge:
      'SkinClarity Club is our first client, and FutureMarketingAI is the agency. Three Instagram accounts (@skinclarityclub, @sindy_huidtherapeut, @skinclarityshop), each with its own audience, tone and agenda, plus a blog and a webshop.',
    solution:
      'One workspace for SkinClarity Club with 3 Instagram accounts and one memory for the whole client. All 10 live skills are switched on. Clyde creates and schedules the content from the agenda, the agency approves before anything goes live, and Sindy has her own dashboard and Clyde on WhatsApp.',
    results: [
      'Posts and carousels for 3 accounts, each in its own tone',
      'SEO blogs for skinclarityclub.nl',
      'A weekly report in the dashboard, and the SEO report on WhatsApp every Friday',
      'Lead Qualifier, ManyChat DM and Ad Manager are switched on but not yet in use for SKC',
      'Measured results to follow; we do not publish figures yet',
    ],
    url: 'https://future-marketing.ai/en/case-studies/skinclarity-club',
  },
  es: {
    client: 'SkinClarity Club',
    industry: 'Cuidado de la piel: un club, una tienda online y la cuenta de la fundadora Sindy',
    challenge:
      'SkinClarity Club es nuestro primer cliente, y FutureMarketingAI es la agencia. Tres cuentas de Instagram (@skinclarityclub, @sindy_huidtherapeut, @skinclarityshop), cada una con su propio público, tono y agenda, además de un blog y una tienda online.',
    solution:
      'Un espacio de trabajo para SkinClarity Club con 3 cuentas de Instagram y una memoria para todo el cliente. Las 10 habilidades activas están encendidas. Clyde crea y programa el contenido según la agenda, la agencia aprueba antes de que algo se publique, y Sindy tiene su propio panel y Clyde en WhatsApp.',
    results: [
      'Posts y carruseles para 3 cuentas, cada una con su propio tono',
      'Blogs SEO para skinclarityclub.nl',
      'Un informe semanal en el panel, y el informe SEO por WhatsApp cada viernes',
      'Lead Qualifier, ManyChat DM y Ad Manager están encendidos, pero aún no se usan para SKC',
      'Los resultados medidos llegarán; todavía no publicamos cifras',
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
  '/founding-member': 'Founding Member program',
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
            '/founding-member',
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
