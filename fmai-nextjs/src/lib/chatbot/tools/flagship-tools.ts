import { tool } from 'ai'
import type { Tool } from 'ai'
import { z } from 'zod'
import { conciergeTools } from './concierge-tools'
import { ecommerceTools } from './ecommerce-tools'
import { leadgenTools } from './leadgen-tools'
import { supportTools } from './support-tools'
import { demoGuideTools } from './demo-guide-tools'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyToolRecord = Record<string, Tool<any, any>>

/**
 * Merged navigate_to_page tool: combines concierge routes (marketing pages)
 * and demo-guide routes (demo pages) into a single unified navigation tool.
 */
const navigate_to_page = tool({
  description:
    'Navigate the user to any page on the FMai website, including marketing pages and demo pages.',
  inputSchema: z.object({
    page: z
      .enum([
        // Marketing pages (from concierge)
        '/',
        '/automations',
        '/chatbots',
        '/voice-agents',
        '/marketing-machine',
        '/pricing',
        '/about',
        '/contact',
        '/how-it-works',
        // Demo pages (from demo-guide)
        'explorer',
        'calculator',
        'dashboard',
      ])
      .describe('The page URL or demo page to navigate to'),
    reason: z.string().optional().describe('Why suggesting this navigation'),
  }),
  execute: async ({ page, reason }) => {
    const PAGE_LABELS: Record<string, string> = {
      '/': 'Home',
      '/automations': 'Automations',
      '/chatbots': 'AI Chatbots',
      '/voice-agents': 'Voice Agents',
      '/marketing-machine': 'Marketing Machine',
      '/pricing': 'Pricing',
      '/about': 'About Us',
      '/contact': 'Contact',
      '/how-it-works': 'How It Works',
      explorer: 'Module Explorer',
      calculator: 'ROI Calculator',
      dashboard: 'Live Dashboard',
    }

    // Demo pages get prefixed with /marketing-machine/
    const isDemoPage = ['explorer', 'calculator', 'dashboard'].includes(page)
    const url = isDemoPage ? `/marketing-machine/${page}` : page

    return {
      action: 'navigate',
      url,
      label: PAGE_LABELS[page] || page,
      reason: reason || undefined,
    }
  },
})

/**
 * Unified booking tool: concierge's book_call serves as the single booking tool.
 * Replaces schedule_demo (leadgen) and book_demo (demo-guide) which do the same thing.
 */
const book_call = conciergeTools.book_call

/**
 * Flagship tools: merged and deduplicated from all 5 personas.
 *
 * Deduplication:
 * - navigate_to_page: Merged concierge + demo-guide routes into one tool
 * - book_call: Concierge version as single booking tool (replaces schedule_demo + book_demo)
 * - get_roi_info (demo-guide) + get_roi_estimate (leadgen): Both kept -- different purposes
 *
 * Result: 16 unique tools
 */
export const flagshipTools: AnyToolRecord = {
  // Unified tools
  navigate_to_page,
  book_call,

  // Concierge tools
  get_services: conciergeTools.get_services,
  get_case_study: conciergeTools.get_case_study,

  // E-commerce tools
  search_products: ecommerceTools.search_products,
  get_product_details: ecommerceTools.get_product_details,
  build_routine: ecommerceTools.build_routine,
  add_to_cart_suggestion: ecommerceTools.add_to_cart_suggestion,

  // Lead-gen tools
  qualify_lead: leadgenTools.qualify_lead,
  get_pricing_info: leadgenTools.get_pricing_info,
  get_roi_estimate: leadgenTools.get_roi_estimate,

  // Support tools
  search_knowledge_base: supportTools.search_knowledge_base,
  create_ticket: supportTools.create_ticket,
  check_status: supportTools.check_status,
  escalate_to_human: supportTools.escalate_to_human,

  // Demo-guide tools
  explain_module: demoGuideTools.explain_module,
  get_roi_info: demoGuideTools.get_roi_info,
}
