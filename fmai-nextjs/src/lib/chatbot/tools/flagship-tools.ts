import { tool } from 'ai'
import type { Tool } from 'ai'
import { z } from 'zod'
import { buildConciergeTools } from './concierge-tools'
import { ecommerceTools } from './ecommerce-tools'
import { buildLeadgenTools } from './leadgen-tools'
import { supportTools } from './support-tools'
import type { ChatbotLocale } from '@/lib/chatbot/tool-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyToolRecord = Record<string, Tool<any, any>>

/**
 * Merged navigate_to_page tool: marketing + demo routes in one. Locale-neutral
 * (returns a relative path; the client Link prefixes the active locale).
 */
const navigate_to_page = tool({
  description:
    'Navigate the user to any page on the FutureMarketingAI website, including marketing pages and demo pages.',
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
    reason: z.string().optional().describe('Why suggesting this navigation'),
  }),
  execute: async ({ page, reason }) => {
    const PAGE_LABELS: Record<string, string> = {
      '/': 'Home',
      '/memory': 'Memory System',
      '/pricing': 'Pricing',
      '/apply': 'Apply',
      '/case-studies/skinclarity-club': 'SkinClarity Club Case Study',
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
      '/skills/clyde': 'Clyde AI Employee',
      '/about': 'About Us',
      '/contact': 'Contact',
      '/how-it-works': 'How It Works',
    }
    return {
      action: 'navigate',
      url: page,
      label: PAGE_LABELS[page] || page,
      reason: reason || undefined,
    }
  },
})

/**
 * Capture tool: records concrete facts the prospect reveals about their agency so
 * Clyde remembers them across the conversation and the memory panel can show them.
 * Locale-neutral — it echoes its input; the card localizes labels and reads the
 * accumulated profile from the store.
 */
const remember_context = tool({
  description:
    'Record a concrete fact the visitor just revealed about their agency so you remember it for the rest of the conversation: agency name, niche/vertical, number of brands or clients they manage, team size, their main pain point, or their goal. Call this whenever the visitor shares a NEW such fact, passing only the fields you just learned. Then refer back to what you remember in later replies.',
  inputSchema: z.object({
    agencyName: z.string().optional().describe('Name of the prospect agency'),
    niche: z.string().optional().describe('Their niche/vertical, e.g. skincare, SaaS, hospitality'),
    brandCount: z.number().optional().describe('How many brands or clients they manage'),
    teamSize: z.number().optional().describe('Number of people on their team'),
    painPoint: z.string().optional().describe('Their main pain or bottleneck'),
    goal: z.string().optional().describe('What they want to achieve'),
  }),
  execute: async ({ agencyName, niche, brandCount, teamSize, painPoint, goal }) => ({
    remembered: { agencyName, niche, brandCount, teamSize, painPoint, goal },
  }),
})

/**
 * Flagship tool set for Clyde, built per request so card-producing tools render
 * in the visitor's locale.
 *
 * The legacy "Marketing Machine" tools (explain_module, get_roi_info) were
 * removed entirely — they described a non-existent 7-module product. The
 * e-commerce/support tools stay defined here but engine.ts strips them in BOTH
 * normal and demo chat: this is a B2B agency product, so skincare ProductCards
 * and support tickets are always off-context. The guided demo uses only the real
 * agency tools below.
 */
export function buildFlagshipTools(locale: ChatbotLocale): AnyToolRecord {
  const concierge = buildConciergeTools(locale)
  const leadgen = buildLeadgenTools(locale)
  return {
    navigate_to_page,
    remember_context,
    book_call: concierge.book_call,

    get_skills: concierge.get_skills,
    get_case_study: concierge.get_case_study,

    search_products: ecommerceTools.search_products,
    get_product_details: ecommerceTools.get_product_details,
    build_routine: ecommerceTools.build_routine,
    add_to_cart_suggestion: ecommerceTools.add_to_cart_suggestion,

    qualify_lead: leadgen.qualify_lead,
    get_pricing_info: leadgen.get_pricing_info,
    get_roi_estimate: leadgen.get_roi_estimate,

    search_knowledge_base: supportTools.search_knowledge_base,
    create_ticket: supportTools.create_ticket,
    check_status: supportTools.check_status,
    escalate_to_human: supportTools.escalate_to_human,
  }
}

/** Backward-compatible static export (NL build). */
export const flagshipTools: AnyToolRecord = buildFlagshipTools('nl')
