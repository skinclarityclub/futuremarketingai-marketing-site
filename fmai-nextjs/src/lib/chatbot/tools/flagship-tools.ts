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
