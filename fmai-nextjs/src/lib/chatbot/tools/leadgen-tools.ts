import { tool } from 'ai'
import { z } from 'zod'
import {
  getChatbotTiers,
  getChatbotTier,
  type ChatbotLocale,
  type ChatbotTierKey,
} from '@/lib/chatbot/tool-data'

type QualLevel = 'qualified' | 'hot' | 'warm' | 'cold'

const QUALIFY_COPY: Record<ChatbotLocale, Record<QualLevel, { recommendation: string; nextSteps: string[] }>> = {
  nl: {
    qualified: {
      recommendation:
        'Uitstekende match. Dit bureau past precies binnen het ICP van FutureMarketingAI.',
      nextSteps: [
        'Dien een aanvraag in via future-marketing.ai/apply',
        'Daley beoordeelt elke aanvraag persoonlijk binnen 48 uur',
        'Na goedkeuring: 30 min strategiegesprek om de juiste setup te bepalen',
      ],
    },
    hot: {
      recommendation:
        'Sterke match. Plan een gesprek om de juiste tier en vaardigheden voor jouw portfolio te bepalen.',
      nextSteps: [
        'Bekijk de SkinClarity Club case study voor concrete resultaten',
        'Bereken jouw ROI op basis van je teamgrootte',
        'Dien een aanvraag in via future-marketing.ai/apply',
      ],
    },
    warm: {
      recommendation: 'Interessante lead. Meer context nodig over portfolio en doelstellingen.',
      nextSteps: [
        'Bekijk hoe het onboardingproces werkt op de Werkwijze-pagina',
        'Lees de SkinClarity Club case study',
        'Stel Clyde een vraag over jouw specifieke situatie',
      ],
    },
    cold: {
      recommendation: 'Vroeg stadium. Leer eerst meer over wat Clyde doet voor bureaus.',
      nextSteps: [
        'Bekijk alle 12 vaardigheden van Clyde',
        'Lees de case study van SkinClarity Club',
        'Stel een vraag als je meer wilt weten',
      ],
    },
  },
  en: {
    qualified: {
      recommendation: "Excellent match. This agency fits squarely within FutureMarketingAI's ICP.",
      nextSteps: [
        'Submit an application at future-marketing.ai/apply',
        'Daley reviews every application personally within 48 hours',
        'After approval: a 30-min strategy call to define the right setup',
      ],
    },
    hot: {
      recommendation:
        'Strong match. Book a call to determine the right tier and skills for your portfolio.',
      nextSteps: [
        'Review the SkinClarity Club case study for concrete results',
        'Calculate your ROI based on your team size',
        'Submit an application at future-marketing.ai/apply',
      ],
    },
    warm: {
      recommendation: 'Interesting lead. We need more context on your portfolio and goals.',
      nextSteps: [
        'See how onboarding works on the How it Works page',
        'Read the SkinClarity Club case study',
        'Ask Clyde about your specific situation',
      ],
    },
    cold: {
      recommendation: 'Early stage. Start by learning what Clyde does for agencies.',
      nextSteps: [
        "Explore all 12 of Clyde's skills",
        'Read the SkinClarity Club case study',
        'Ask a question if you want to know more',
      ],
    },
  },
  es: {
    qualified: {
      recommendation: 'Coincidencia excelente. Esta agencia encaja de lleno en el ICP de FutureMarketingAI.',
      nextSteps: [
        'Envía una solicitud en future-marketing.ai/apply',
        'Daley revisa cada solicitud personalmente en 48 horas',
        'Tras la aprobación: una llamada de estrategia de 30 min para definir la configuración',
      ],
    },
    hot: {
      recommendation:
        'Buena coincidencia. Agenda una llamada para determinar el tier y las habilidades adecuadas para tu portafolio.',
      nextSteps: [
        'Revisa el caso de SkinClarity Club para ver resultados concretos',
        'Calcula tu ROI según el tamaño de tu equipo',
        'Envía una solicitud en future-marketing.ai/apply',
      ],
    },
    warm: {
      recommendation: 'Lead interesante. Necesitamos más contexto sobre tu portafolio y objetivos.',
      nextSteps: [
        'Mira cómo funciona el onboarding en la página How it Works',
        'Lee el caso de SkinClarity Club',
        'Pregúntale a Clyde sobre tu situación específica',
      ],
    },
    cold: {
      recommendation: 'Etapa temprana. Empieza por conocer lo que Clyde hace para las agencias.',
      nextSteps: [
        'Explora las 12 habilidades de Clyde',
        'Lee el caso de SkinClarity Club',
        'Haz una pregunta si quieres saber más',
      ],
    },
  },
}

export function buildLeadgenTools(locale: ChatbotLocale) {
  const qualify_lead = tool({
    description:
      'Qualify a B2B lead based on company profile and buying signals. Returns a lead score (0-100) with qualification level and recommended next steps.',
    inputSchema: z.object({
      companySize: z.number().optional().describe('Number of employees at the company'),
      budget: z.number().optional().describe('Monthly marketing budget in EUR'),
      timeline: z
        .enum(['immediate', '1-3months', '3-6months', '6months+'])
        .optional()
        .describe('Expected implementation timeline'),
      useCase: z.string().optional().describe('Primary use case or pain point'),
      isDecisionMaker: z.boolean().optional().describe('Whether the contact is a decision maker'),
    }),
    execute: async ({ companySize, budget, timeline, useCase, isDecisionMaker }) => {
      let score = 0
      if (companySize !== undefined && companySize >= 20 && companySize <= 500) score += 20
      if (budget !== undefined && budget >= 1000) score += 25
      if (timeline === 'immediate' || timeline === '1-3months') score += 20
      else if (timeline === '3-6months') score += 10
      if (useCase !== undefined && useCase.trim().length > 0) score += 15
      if (isDecisionMaker === true) score += 20

      const level: QualLevel =
        score >= 86 ? 'qualified' : score >= 61 ? 'hot' : score >= 31 ? 'warm' : 'cold'
      const copy = QUALIFY_COPY[locale][level]
      return {
        score,
        qualification: level,
        recommendation: copy.recommendation,
        nextSteps: [...copy.nextSteps],
      }
    },
  })

  const get_pricing_info = tool({
    description:
      'Retrieve pricing information for a specific tier or all tiers. 4 tiers: Founding Member (997 EUR/mo lifetime, 10 spots, 1 taken), Growth (499 EUR per workspace, 2-4 brands), Professional (399 EUR per workspace, 5-14 brands), Enterprise (299 EUR per workspace, 15+ brands). Workspace-priced tiers have a one-time onboarding fee.',
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
