import { tool } from 'ai'
import { z } from 'zod'
import { CHATBOT_TIERS, type ChatbotTierKey } from '@/lib/chatbot/tool-data'

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

    // Company size scoring (ICP: 20-500 employees)
    if (companySize !== undefined && companySize >= 20 && companySize <= 500) {
      score += 20
    }

    // Budget scoring (ICP: EUR 1000+/mo)
    if (budget !== undefined && budget >= 1000) {
      score += 25
    }

    // Timeline scoring
    if (timeline === 'immediate' || timeline === '1-3months') {
      score += 20
    } else if (timeline === '3-6months') {
      score += 10
    }

    // Use case scoring
    if (useCase !== undefined && useCase.trim().length > 0) {
      score += 15
    }

    // Decision maker scoring
    if (isDecisionMaker === true) {
      score += 20
    }

    let qualification: 'cold' | 'warm' | 'hot' | 'qualified'
    let recommendation: string
    const nextSteps: string[] = []

    if (score >= 86) {
      qualification = 'qualified'
      recommendation =
        'This lead is fully qualified. Recommend immediate sales handoff and demo booking.'
      nextSteps.push('Schedule a personalized demo')
      nextSteps.push('Prepare custom ROI analysis')
      nextSteps.push('Connect with account executive')
    } else if (score >= 61) {
      qualification = 'hot'
      recommendation =
        'Strong lead with high potential. Gather remaining qualification data and move to demo.'
      nextSteps.push('Complete qualification questions')
      nextSteps.push('Share relevant case studies')
      nextSteps.push('Offer ROI estimate')
    } else if (score >= 31) {
      qualification = 'warm'
      recommendation =
        'Interested prospect but needs nurturing. Focus on education and value demonstration.'
      nextSteps.push('Share product overview materials')
      nextSteps.push('Invite to upcoming webinar')
      nextSteps.push('Follow up in 1-2 weeks')
    } else {
      qualification = 'cold'
      recommendation =
        'Early-stage or poor fit. Provide general information and add to nurture sequence.'
      nextSteps.push('Add to email nurture sequence')
      nextSteps.push('Share educational content')
      nextSteps.push('Revisit in 30 days')
    }

    return { score, qualification, recommendation, nextSteps }
  },
})

const get_pricing_info = tool({
  description:
    'Retrieve pricing information for a specific tier or all tiers of the FutureMarketingAI platform. 5 tiers available: Partner (347 EUR), Growth (2497 EUR), Professional (4497 EUR), Enterprise (7997 EUR), and Founding Member (997 EUR lifetime, 10 spots only).',
  inputSchema: z.object({
    tier: z
      .enum(['partner', 'growth', 'professional', 'enterprise', 'founding', 'all'])
      .default('all')
      .describe('Which tier to retrieve. Use "all" for overview.'),
  }),
  execute: async ({ tier }) => {
    if (tier === 'all') {
      return { tiers: CHATBOT_TIERS }
    }
    return { tier: CHATBOT_TIERS[tier as ChatbotTierKey] }
  },
})

const schedule_demo = tool({
  description:
    'Schedule a product demo for a qualified lead. Captures contact information and preferred time.',
  inputSchema: z.object({
    name: z.string().describe('Full name of the contact'),
    email: z.string().describe('Email address of the contact'),
    companyName: z.string().optional().describe('Company name'),
    preferredTime: z.string().optional().describe('Preferred date/time for the demo'),
  }),
  execute: async ({ name, email, companyName, preferredTime }) => {
    return {
      action: 'schedule_demo',
      confirmationId: 'DEMO-' + Date.now(),
      message: `Demo scheduled! ${name}, we'll send a confirmation to ${email}${preferredTime ? ` for your preferred time: ${preferredTime}` : ''}${companyName ? ` (${companyName})` : ''}. Our team will reach out within 24 hours to confirm.`,
    }
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
    averageHourlyRate: z
      .number()
      .default(50)
      .describe('Average hourly rate of team members in EUR'),
    monthlySubscription: z
      .number()
      .default(2497)
      .describe('Monthly subscription cost in EUR (default: Growth tier at 2497)'),
  }),
  execute: async ({
    teamSize,
    currentHoursOnMarketing,
    averageHourlyRate,
    monthlySubscription,
  }) => {
    // Time saved: platform saves ~15 hours/week per team member (capped at current hours)
    const hoursSavedPerWeek = Math.min(15, currentHoursOnMarketing) * teamSize
    const timeSavedMonthly = hoursSavedPerWeek * 4
    const costSavedMonthly = timeSavedMonthly * averageHourlyRate
    const roiPercent = Math.round(
      ((costSavedMonthly - monthlySubscription) / monthlySubscription) * 100
    )
    const monthlySavings = Math.round(costSavedMonthly - monthlySubscription)
    const annualSavings = monthlySavings * 12
    const paybackPeriodMonths =
      monthlySavings > 0 ? Math.max(1, Math.round(monthlySubscription / monthlySavings)) : 0

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

export const leadgenTools = {
  qualify_lead,
  get_pricing_info,
  schedule_demo,
  get_roi_estimate,
}
