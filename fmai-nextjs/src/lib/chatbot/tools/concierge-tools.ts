import { tool } from 'ai'
import { z } from 'zod'

const SERVICE_DATA: Record<
  string,
  { name: string; description: string; highlights: string[]; starting_price: string }
> = {
  chatbots: {
    name: 'AI Chatbots',
    description:
      'Multi-platform conversational AI with persona-based responses, 24/7 availability, and multi-lingual support.',
    highlights: [
      'Deploy on website, WhatsApp, Instagram, Messenger',
      '24/7 availability with zero downtime',
      'Multi-lingual (EN, NL, ES and more)',
      'Seamless human agent handoff',
    ],
    starting_price: 'From EUR 500/mo',
  },
  'voice-agents': {
    name: 'Voice Agents',
    description:
      'AI-powered phone systems for inbound and outbound calls through our partnership model.',
    highlights: [
      'Natural conversation handling',
      'Appointment scheduling and FAQ resolution',
      'Call routing and escalation',
      'Reduces call center load by up to 60%',
    ],
    starting_price: 'From EUR 750/mo',
  },
  automations: {
    name: 'Automations',
    description:
      'n8n-powered workflow automation for content pipelines, lead nurturing, and business process optimization.',
    highlights: [
      'Content pipelines: blogs, social, newsletters',
      'Lead nurturing sequences',
      'CRM integrations and reporting',
      'Custom workflow design',
    ],
    starting_price: 'From EUR 500/mo',
  },
  'marketing-machine': {
    name: 'Marketing Machine',
    description:
      'Full autonomous marketing system combining chatbots, voice agents, and automations into one unified engine.',
    highlights: [
      'AI-driven content creation and distribution',
      'All services working as one unified system',
      'Monthly strategy reviews with dashboards',
      'Continuous optimization and improvement',
    ],
    starting_price: 'Custom pricing',
  },
}

const CASE_STUDIES: Record<
  string,
  { client: string; industry: string; challenge: string; solution: string; results: string[] }
> = {
  skc: {
    client: 'Premium Skincare E-commerce Brand',
    industry: 'Direct-to-consumer skincare',
    challenge:
      'Overwhelmed support team, no 24/7 availability, content creation bottleneck, and manual product recommendations not scalable for European expansion.',
    solution:
      'Deployed AI chatbot (Sindy) for 24/7 skincare advice, automated content pipeline for blog and social media, and multi-language support across EN, NL, and ES.',
    results: [
      '24/7 product advice without additional staff',
      '4x increase in monthly content output',
      'Multi-language support at no extra headcount cost',
      'Measurable increase in customer engagement and average order value',
    ],
  },
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/skills/chatbot': 'AI Chatbot',
  '/skills/content-creator': 'Content Creator',
  '/skills/voice-agent': 'Voice Agent',
  '/skills/ad-creator': 'Ad Creator',
  '/skills/social-media': 'Social Media',
  '/skills/lead-qualifier': 'Lead Qualifier',
  '/pricing': 'Pricing',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/how-it-works': 'How It Works',
}

export const conciergeTools = {
  get_services: tool({
    description:
      'Get information about FMai services. Use "all" to get an overview of every service, or pick a specific one.',
    inputSchema: z.object({
      serviceType: z
        .enum(['chatbots', 'voice-agents', 'automations', 'marketing-machine', 'all'])
        .describe('Which service to get details about'),
    }),
    execute: async ({ serviceType }) => {
      if (serviceType === 'all') {
        return { services: SERVICE_DATA }
      }
      const service = SERVICE_DATA[serviceType]
      if (!service) {
        return { error: `Unknown service: ${serviceType}` }
      }
      return { service }
    },
  }),

  book_call: tool({
    description: 'Open the Calendly booking page for a discovery call with FMai.',
    inputSchema: z.object({
      reason: z.string().describe('Why the user wants to book a call'),
    }),
    execute: async ({ reason }) => ({
      action: 'open_calendly',
      url: 'https://calendly.com/futuremarketingai/discovery',
      reason,
    }),
  }),

  navigate_to_page: tool({
    description: 'Navigate the user to a specific page on the FMai website.',
    inputSchema: z.object({
      page: z
        .enum([
          '/',
          '/skills/chatbot',
          '/skills/content-creator',
          '/skills/voice-agent',
          '/skills/ad-creator',
          '/skills/social-media',
          '/skills/lead-qualifier',
          '/pricing',
          '/about',
          '/contact',
          '/how-it-works',
        ])
        .describe('The page URL to navigate to'),
    }),
    execute: async ({ page }) => ({
      action: 'navigate',
      url: page,
      label: PAGE_LABELS[page] || page,
    }),
  }),

  get_case_study: tool({
    description: 'Get a detailed case study showing FMai results with a real client.',
    inputSchema: z.object({
      studyId: z.enum(['skc']).default('skc').describe('The case study identifier'),
    }),
    execute: async ({ studyId }) => {
      const study = CASE_STUDIES[studyId]
      if (!study) {
        return { error: `Case study not found: ${studyId}` }
      }
      return { caseStudy: study }
    },
  }),
}
