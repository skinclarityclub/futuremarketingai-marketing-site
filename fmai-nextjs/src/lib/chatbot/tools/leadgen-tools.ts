import { tool } from 'ai'
import { z } from 'zod'
import {
  getChatbotTiers,
  getChatbotTier,
  type ChatbotLocale,
  type ChatbotTierKey,
} from '@/lib/chatbot/tool-data'
import { decideFit, type FitSession } from '@/lib/chatbot/fit'

// Without a session (manual tool path) nothing is remembered and no card is offered.
export function buildLeadgenTools(
  locale: ChatbotLocale,
  session: FitSession = { profile: {}, offered: false, offerEnabled: false },
) {
  // No score anywhere: the model cannot state what it never receives (R28). Fit comes
  // from code; the model only passes facts the visitor gave.
  const qualify_lead = tool({
    description:
      'Assess whether the agency of the visitor fits, for a fit question ("past dit bij ons", "is this for us", "¿encaja con nosotros?"). Pass the number of brands the agency manages and its team size as the visitor stated them or as you remember them; leave a field out when it is unknown, never guess. Returns fit (strong, good, unclear or no_fit) and offerApplication. There is no score.',
    inputSchema: z.object({
      brandCount: z.number().optional().describe('Brands or clients the agency manages, as the visitor stated'),
      teamSize: z.number().optional().describe('People working at the agency, as the visitor stated'),
    }),
    execute: async ({ brandCount, teamSize }) => {
      const { fit, offerApplication } = decideFit(session, { brandCount, teamSize })
      const missing = (['brandCount', 'teamSize'] as const).filter((k) => session.profile[k] == null)
      return { fit, offerApplication, ...(fit === 'unclear' ? { missing } : {}) }
    },
  })

  const get_pricing_info = tool({
    description:
      'Retrieve pricing information for a specific tier or all tiers. 4 tiers: Founding Member (997 EUR/mo lifetime, maximum 10 spots), Growth (499 EUR per workspace, 2-4 brands), Professional (399 EUR per workspace, 5-14 brands), Enterprise (299 EUR per workspace, 15+ brands). Workspace-priced tiers have a one-time onboarding fee.',
    inputSchema: z.object({
      tier: z
        .enum(['founding', 'growth', 'professional', 'enterprise', 'all'])
        .default('all')
        .describe('Which tier to retrieve. Use "all" for overview.'),
    }),
    execute: async ({ tier }) => {
      if (tier === 'all') return { tiers: getChatbotTiers(locale) }
      return getChatbotTier(locale, tier as ChatbotTierKey)
    },
  })

  const get_roi_estimate = tool({
    description:
      'Calculate estimated ROI based on team size, current marketing hours, and hourly rate. Returns monthly/annual savings and payback period.',
    inputSchema: z.object({
      teamSize: z.number().describe('Number of marketing team members'),
      currentHoursOnMarketing: z
        .number()
        .describe('Current hours per week each team member spends on manual marketing tasks'),
      averageHourlyRate: z.number().default(50).describe('Average hourly rate in EUR'),
      monthlySubscription: z
        .number()
        .default(998)
        .describe('Monthly subscription cost in EUR (default: Growth starter 998 = 2 workspaces × 499)'),
    }),
    execute: async ({ teamSize, currentHoursOnMarketing, averageHourlyRate, monthlySubscription }) => {
      // Guard degenerate input so the card never shows NaN/Infinity.
      const safeSubscription = Math.max(1, monthlySubscription)
      const hoursSavedPerWeek = Math.min(15, Math.max(0, currentHoursOnMarketing)) * Math.max(1, teamSize)
      const timeSavedMonthly = hoursSavedPerWeek * 4
      const costSavedMonthly = timeSavedMonthly * averageHourlyRate
      const roiPercent = Math.round(((costSavedMonthly - safeSubscription) / safeSubscription) * 100)
      const monthlySavings = Math.round(costSavedMonthly - safeSubscription)
      const annualSavings = monthlySavings * 12
      const paybackPeriodMonths =
        monthlySavings > 0 ? Math.max(1, Math.round(safeSubscription / monthlySavings)) : 0

      return {
        monthlySavings,
        annualSavings,
        roiPercent,
        paybackPeriodMonths,
        breakdown: {
          hoursSavedPerWeek,
          timeSavedMonthly,
          costSavedMonthly: Math.round(costSavedMonthly),
          subscriptionCost: monthlySubscription,
        },
      }
    },
  })

  return { qualify_lead, get_pricing_info, get_roi_estimate }
}

/** Backward-compatible static export (NL build). */
export const leadgenTools = buildLeadgenTools('nl')
