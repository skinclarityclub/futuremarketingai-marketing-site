import { tool } from 'ai'
import { z } from 'zod'
import { MODULE_INFO } from '../knowledge/demo-guide-kb'

export const demoGuideTools = {
  navigate_to_page: tool({
    description:
      'Navigate the user to a specific demo page or the main Marketing Machine page. Use this when the user wants to explore a particular section of the demo.',
    inputSchema: z.object({
      page: z
        .enum(['explorer', 'calculator', 'dashboard', 'marketing-machine'])
        .describe('The demo page to navigate to'),
      reason: z.string().optional().describe('Why suggesting this navigation'),
    }),
    execute: async ({ page, reason }) => {
      const url = '/marketing-machine' + (page !== 'marketing-machine' ? '/' + page : '')
      const labels: Record<string, string> = {
        explorer: 'Module Explorer',
        calculator: 'ROI Calculator',
        dashboard: 'Live Dashboard',
        'marketing-machine': 'Marketing Machine Overview',
      }
      return {
        action: 'navigate',
        url,
        label: labels[page] || page,
        reason: reason || undefined,
      }
    },
  }),

  explain_module: tool({
    description:
      'Get detailed information about a specific Marketing Machine module. Use this when the user asks about a particular module.',
    inputSchema: z.object({
      moduleId: z
        .enum([
          'research-planning',
          'manager-workflow',
          'content-pipeline',
          'telegram-control',
          'publishing-layer',
          'analytics-lab',
          'ad-builder',
        ])
        .describe('The module identifier to explain'),
    }),
    execute: async ({ moduleId }) => {
      const info = MODULE_INFO[moduleId]
      if (!info) {
        return { error: `Unknown module: ${moduleId}` }
      }
      return { module: info }
    },
  }),

  get_roi_info: tool({
    description:
      'Calculate ROI projections based on team size and marketing budget. Use this when the user asks about savings, costs, or return on investment.',
    inputSchema: z.object({
      teamSize: z.number().default(5).describe('Number of people on the marketing team'),
      monthlyMarketingBudget: z
        .number()
        .default(5000)
        .describe('Current monthly marketing tool budget in EUR'),
    }),
    execute: async ({ teamSize, monthlyMarketingBudget }) => {
      const hoursSavedPerMonth = teamSize * 8 * 4 // 8 hrs/week/person, 4 weeks
      const laborSavingsPerMonth = hoursSavedPerMonth * 50 // EUR 50/hr
      const toolSavingsPerMonth = Math.round(monthlyMarketingBudget * 0.6)
      const totalMonthlySavings = laborSavingsPerMonth + toolSavingsPerMonth
      const annualSavings = totalMonthlySavings * 12

      return {
        hoursSavedPerMonth,
        laborSavingsPerMonth,
        toolSavingsPerMonth,
        totalMonthlySavings,
        annualSavings,
        implementationTime: '2 weeks',
      }
    },
  }),

  book_demo: tool({
    description:
      'Open the Calendly booking page for a Marketing Machine demo. Use this when the user is ready to book or expresses strong interest.',
    inputSchema: z.object({
      reason: z.string().optional().describe('Why the user wants to book a demo'),
    }),
    execute: async ({ reason }) => ({
      action: 'open_calendly',
      url: 'https://calendly.com/futuremarketingai/marketing-machine-demo',
      reason: reason || undefined,
      duration: '45 minutes',
    }),
  }),
}
