import { tool } from 'ai'
import { z } from 'zod'
import {
  foundingPriceFor,
  getChatbotTiers,
  getChatbotTier,
  type ChatbotLocale,
} from '@/lib/chatbot/tool-data'
import { decideFit, noOfferSession, type FitSession } from '@/lib/chatbot/fit'

// Founding price for the brand count (tool-data.ts). 1 brand is no fit, above 15 Founding has no price.
function subscriptionFor(brands: number) {
  const subscription = brands >= 2 ? foundingPriceFor(brands) : undefined
  return subscription === undefined ? undefined : { brandCount: brands, subscription }
}

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
      'Retrieve the offer for new agencies. There is one: Clyde at the introductory price, 1,297 EUR per month excl. VAT with 5 client brands included, 199 EUR per extra brand up to 15, 1,500 credits per brand per month in one agency pool, 0 EUR onboarding, price fixed for 12 paid months, 3 spots. Regular plans follow after the first three agencies, expected around 2,400-2,500 EUR per month for 5 brands; agencies on the introductory price pay 30% below that after the 12 fixed months while they stay. Never call the offer Founding or Founder. Growth, Professional and Enterprise are not for sale.',
    inputSchema: z.object({
      tier: z.enum(['founding', 'all']).default('all').describe('Use "all" for the overview.'),
    }),
    execute: async ({ tier }) => {
      if (tier === 'all') return { tiers: getChatbotTiers(locale) }
      return getChatbotTier(locale, tier)
    },
  })

  // No measured saving exists (support-kb "roi_calculations"; RCC 2026/00196), so this tool
  // returns no hours saved, euros, ROI or payback: only the visitor's own hours and the price.
  const get_roi_estimate = tool({
    description:
      'For ROI, savings or "what does it bring us": show the hours the whole team spends on manual marketing per week, as the visitor stated them, and the monthly subscription for their number of brands. Leave a field out when the visitor did not say it, never estimate: the result then lists needsInput and you ask for that in one short question. There is no measured saving: never state hours saved, a euro saving, ROI percentage or payback; say that how much Clyde takes over is worked out in the call with their own numbers.',
    inputSchema: z.object({
      teamHoursPerWeek: z
        .number()
        .optional()
        .describe(
          'Hours the WHOLE team spends on manual marketing per week, only as the visitor stated (hours per person times the stated team size); leave out when unknown, never estimate',
        ),
      brandCount: z.number().optional().describe('Client brands the agency manages, only as the visitor stated'),
    }),
    execute: async ({ teamHoursPerWeek, brandCount }) => {
      // Only numbers the visitor typed in THIS conversation, with that unit, count (paid test
      // 10-28: the model passed hours nobody said). A remembered or client-sent profile value
      // counts only when it was typed here too (Codex R1: a stored 15 brands priced the card).
      const known = (n: number | undefined): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0
      const { hours: typedHours, brands: typedBrands, people: typedPeople } = session.said
      // counts compare exactly (Codex R2: a tolerance let 14.9999999995 brands through)
      const brands = [brandCount, session.profile.brandCount].find((n) => known(n) && typedBrands.includes(n))
      // Team hours are typed hours, or typed per-person hours times a typed head count. The card
      // shows that product, never the model's own figure; the tolerance only absorbs float error.
      const hours = known(teamHoursPerWeek)
        ? [...typedHours, ...typedHours.flatMap((h) => typedPeople.map((p) => h * p))].find(
            (t) => known(t) && Math.abs(t - teamHoursPerWeek) < 0.01,
          )
        : undefined
      if (hours === undefined) return { needsInput: ['teamHoursPerWeek'] }
      return {
        teamHoursPerWeek: Math.round(hours * 100) / 100,
        teamHoursPerMonth: Math.round((hours * 52) / 12),
        ...(brands !== undefined ? subscriptionFor(brands) : undefined),
      }
    },
  })

  return { qualify_lead, get_pricing_info, get_roi_estimate }
}
