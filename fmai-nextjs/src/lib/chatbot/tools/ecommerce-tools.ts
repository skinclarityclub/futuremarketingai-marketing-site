import { tool } from 'ai'
import { z } from 'zod'
import { ECOMMERCE_TOPICS } from '../knowledge/ecommerce-kb'

export const ecommerceTools = {
  search_products: tool({
    description:
      'Search the knowledge base for topics matching a query. Returns matching topic content.',
    inputSchema: z.object({
      query: z.string().optional().describe('Text to search in topic content and keywords'),
      skinType: z
        .enum(['dry', 'oily', 'combination', 'normal', 'sensitive'])
        .optional()
        .describe('Filter by skin type keyword'),
      concern: z.string().optional().describe('Filter by concern keyword'),
      limit: z.number().min(1).max(5).default(3).describe('Maximum number of results to return'),
    }),
    execute: async ({ query, skinType, concern, limit }) => {
      let filtered = [...ECOMMERCE_TOPICS]

      if (skinType) {
        filtered = filtered.filter(
          (t) =>
            t.content.toLowerCase().includes(skinType) ||
            t.keywords.some((kw) => kw.toLowerCase().includes(skinType))
        )
      }

      if (concern) {
        const lowerConcern = concern.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.content.toLowerCase().includes(lowerConcern) ||
            t.keywords.some((kw) => kw.toLowerCase().includes(lowerConcern))
        )
      }

      if (query) {
        const lowerQuery = query.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.key.toLowerCase().includes(lowerQuery) ||
            t.content.toLowerCase().includes(lowerQuery) ||
            t.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
        )
      }

      return {
        products: filtered.slice(0, limit).map((t) => ({
          id: t.key,
          name: t.key.replace(/_/g, ' '),
          snippet: t.content.slice(0, 200),
        })),
      }
    },
  }),

  get_product_details: tool({
    description: 'Get full details for a specific topic by its key.',
    inputSchema: z.object({
      productId: z.string().describe('The topic key identifier'),
    }),
    execute: async ({ productId }) => {
      const topic = ECOMMERCE_TOPICS.find((t) => t.key === productId)
      if (!topic) {
        return { error: `Topic not found: ${productId}` }
      }
      return {
        product: {
          id: topic.key,
          name: topic.key.replace(/_/g, ' '),
          content: topic.content,
          keywords: topic.keywords,
        },
      }
    },
  }),

  build_routine: tool({
    description: 'Build a recommended workflow based on a topic area.',
    inputSchema: z.object({
      skinType: z
        .enum(['dry', 'oily', 'combination', 'normal', 'sensitive'])
        .describe('The topic area to build recommendations for'),
      timeOfDay: z
        .enum(['morning', 'evening', 'both'])
        .default('both')
        .describe('Morning routine, evening routine, or both'),
    }),
    execute: async ({ skinType, timeOfDay }) => {
      const relevantTopics = ECOMMERCE_TOPICS.filter(
        (t) =>
          t.content.toLowerCase().includes(skinType) ||
          t.keywords.some((kw) => kw.toLowerCase().includes(skinType))
      )

      return {
        routine: timeOfDay,
        recommendations: relevantTopics.map((t) => ({
          id: t.key,
          name: t.key.replace(/_/g, ' '),
          snippet: t.content.slice(0, 150),
        })),
      }
    },
  }),

  add_to_cart_suggestion: tool({
    description: 'Suggest adding a topic/product to the shopping cart (simulated for demo).',
    inputSchema: z.object({
      productId: z.string().describe('The topic key identifier to add'),
      quantity: z.number().default(1).describe('Number of units to add'),
    }),
    execute: async ({ productId, quantity }) => {
      const topic = ECOMMERCE_TOPICS.find((t) => t.key === productId)
      if (!topic) {
        return { error: `Topic not found: ${productId}` }
      }
      return {
        action: 'add_to_cart',
        product: { id: topic.key, name: topic.key.replace(/_/g, ' ') },
        quantity,
        message: 'Added to cart!',
      }
    },
  }),
}
