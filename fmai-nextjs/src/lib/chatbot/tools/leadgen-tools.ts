import { tool } from 'ai'
import { z } from 'zod'
import {
  getChatbotTiers,
  getChatbotTier,
  type ChatbotLocale,
  type ChatbotTierKey,
} from '@/lib/chatbot/tool-data'
import { decideFit, noOfferSession, type FitSession } from '@/lib/chatbot/fit'

const ASSUMED_HOURLY_RATE = 50
const HOURS_CAP_PER_PERSON = 15

export function buildLeadgenTools(locale: ChatbotLocale, session: FitSession = noOfferSession()) {
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
      'Calculate an indicative ROI from the team size and the hours the whole team spends on manual marketing per week, both only as the visitor stated them. Leave a field out when the visitor did not say it, never estimate: the result then lists needsInput and you ask for that in one short question. Returns monthly/annual savings and payback period.',
    inputSchema: z.object({
      teamSize: z
        .number()
        .optional()
        .describe('People on the marketing team, only as the visitor stated; leave out when unknown'),
      teamHoursPerWeek: z
        .number()
        .optional()
        .describe(
          'Hours the WHOLE team spends on manual marketing per week, only as the visitor stated (hours per person times the stated team size); leave out when unknown, never estimate',
        ),
      averageHourlyRate: z
        .number()
        .optional()
        .describe('Hourly rate in EUR, only when the visitor stated it; leave out otherwise'),
      monthlySubscription: z
        .number()
        .default(998)
        .describe('Monthly subscription cost in EUR (default: Growth starter 998 = 2 workspaces × 499)'),
    }),
    execute: async ({ teamSize, teamHoursPerWeek, averageHourlyRate, monthlySubscription }) => {
      // Only stated facts count: labels do not repair invented input (RCC 2026/00196). A number
      // counts as stated when the visitor typed it; the remembered team size counts as known.
      const stated = (n: number | undefined): n is number =>
        typeof n === 'number' && Number.isFinite(n) && n > 0 && session.said.includes(n)
      const known = (n: number | undefined): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0
      const team = stated(teamSize) ? teamSize : session.profile.teamSize
      // per-person hours times the team are stated too
      const hours =
        known(teamHoursPerWeek) &&
        (stated(teamHoursPerWeek) || (known(team) && stated(teamHoursPerWeek / team)))
          ? teamHoursPerWeek
          : undefined
      const needsInput = [...(known(team) ? [] : ['teamSize']), ...(known(hours) ? [] : ['teamHoursPerWeek'])]
      if (!known(team) || !known(hours)) return { needsInput }

      const visitorRate = stated(averageHourlyRate) ? averageHourlyRate : undefined
      const hourlyRate = visitorRate ?? ASSUMED_HOURLY_RATE
      // Guard degenerate input so the card never shows NaN/Infinity.
      const safeSubscription = Math.max(1, monthlySubscription)
      const hoursSavedPerWeek = Math.min(hours, HOURS_CAP_PER_PERSON * team)
      const timeSavedMonthly = hoursSavedPerWeek * 4
      const costSavedMonthly = timeSavedMonthly * hourlyRate
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
        // Every assumption goes to the card, so the visitor sees what the figures rest on.
        breakdown: {
          teamSize: team,
          teamHoursPerWeek: hours,
          hoursCapPerPerson: HOURS_CAP_PER_PERSON,
          hoursSavedPerWeek,
          timeSavedMonthly,
          hourlyRate,
          rateAssumed: visitorRate === undefined,
          costSavedMonthly: Math.round(costSavedMonthly),
          subscriptionCost: monthlySubscription,
        },
      }
    },
  })

  return { qualify_lead, get_pricing_info, get_roi_estimate }
}
