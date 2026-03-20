import { tool } from 'ai'
import { z } from 'zod'
import { SUPPORT_TOPICS } from '../knowledge/support-kb'

const search_knowledge_base = tool({
  description:
    'Search the knowledge base for topics matching a query. Returns topic keys and snippets.',
  inputSchema: z.object({
    query: z.string().describe('Search query to match against topic content and keywords'),
    category: z
      .enum(['billing', 'technical', 'account', 'getting_started', 'all'])
      .default('all')
      .describe('Category to filter by (matched against topic keywords)'),
    limit: z.number().min(1).max(5).default(3).describe('Maximum number of topics to return'),
  }),
  execute: async ({ query, category, limit }) => {
    const queryLower = query.toLowerCase()

    let filtered = SUPPORT_TOPICS
    if (category !== 'all') {
      filtered = filtered.filter((t) =>
        t.keywords.some((kw) => kw.toLowerCase().includes(category))
      )
    }

    const matched = filtered.filter((topic) => {
      const contentMatch = topic.content.toLowerCase().includes(queryLower)
      const keywordMatch = topic.keywords.some((kw) => kw.toLowerCase().includes(queryLower))
      const keyMatch = topic.key.toLowerCase().includes(queryLower)
      return contentMatch || keywordMatch || keyMatch
    })

    return {
      articles: matched.slice(0, limit).map((t) => ({
        id: t.key,
        title: t.key.replace(/_/g, ' '),
        snippet: t.content.slice(0, 200),
      })),
      totalResults: matched.length,
    }
  },
})

const create_ticket = tool({
  description:
    'Create a support ticket for issues that cannot be resolved through the knowledge base.',
  inputSchema: z.object({
    category: z
      .enum(['billing', 'technical', 'account', 'bug', 'feature_request'])
      .describe('Ticket category'),
    subject: z.string().describe('Brief description of the issue'),
    description: z.string().describe('Detailed description of the issue'),
    priority: z.enum(['low', 'medium', 'high']).default('medium').describe('Ticket priority level'),
  }),
  execute: async ({ category, subject, description, priority }) => {
    return {
      ticketId: 'TKT-' + Date.now(),
      status: 'open',
      category,
      subject,
      description,
      priority,
      estimatedResponse: '24 hours',
      message:
        'Ticket created successfully. Our support team will review your request and respond within 24 hours.',
    }
  },
})

const check_status = tool({
  description: 'Check the current status of a support ticket by its ID.',
  inputSchema: z.object({
    ticketId: z.string().describe('The ticket ID to look up (e.g., TKT-1234567890)'),
  }),
  execute: async ({ ticketId }) => {
    return {
      ticketId,
      status: 'in_progress',
      lastUpdate: 'Our team is reviewing your request and will follow up shortly.',
      updatedAt: new Date().toISOString(),
    }
  },
})

const escalate_to_human = tool({
  description:
    'Escalate the conversation to a human support agent when the bot cannot resolve the issue.',
  inputSchema: z.object({
    reason: z.string().describe('Reason for escalation'),
    ticketId: z.string().optional().describe('Associated ticket ID if one exists'),
  }),
  execute: async ({ reason, ticketId }) => {
    return {
      action: 'escalate',
      message:
        'Connecting you with a human agent. Please hold on — a support representative will be with you shortly.',
      estimatedWait: '2-5 minutes',
      reason,
      ticketId: ticketId ?? null,
    }
  },
})

export const supportTools = {
  search_knowledge_base,
  create_ticket,
  check_status,
  escalate_to_human,
}
