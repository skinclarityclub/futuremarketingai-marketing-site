import { tool } from 'ai'
import { z } from 'zod'
import { PRODUCT_CATALOG } from '../knowledge/ecommerce-kb'

interface ProductStep {
  step: string
  product: { id: string; name: string; price: number }
}

export const ecommerceTools = {
  search_products: tool({
    description:
      'Search the skincare product catalog by skin type, concern, or text query. Returns matching products.',
    inputSchema: z.object({
      query: z.string().optional().describe('Text to search in product names and descriptions'),
      skinType: z
        .enum(['dry', 'oily', 'combination', 'normal', 'sensitive'])
        .optional()
        .describe('Filter by skin type suitability'),
      concern: z
        .string()
        .optional()
        .describe('Filter by skin concern (e.g. acne, hydration, brightening)'),
      limit: z.number().min(1).max(5).default(3).describe('Maximum number of results to return'),
    }),
    execute: async ({ query, skinType, concern, limit }) => {
      let filtered = [...PRODUCT_CATALOG]

      if (skinType) {
        filtered = filtered.filter((p) => p.skinTypes.includes(skinType))
      }

      if (concern) {
        const lowerConcern = concern.toLowerCase()
        filtered = filtered.filter((p) =>
          p.concerns.some((c) => c.toLowerCase().includes(lowerConcern))
        )
      }

      if (query) {
        const lowerQuery = query.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        )
      }

      return { products: filtered.slice(0, limit) }
    },
  }),

  get_product_details: tool({
    description: 'Get full details for a specific product by its ID.',
    inputSchema: z.object({
      productId: z.string().describe('The product identifier (e.g. "hydra-boost-serum")'),
    }),
    execute: async ({ productId }) => {
      const product = PRODUCT_CATALOG.find((p) => p.id === productId)
      if (!product) {
        return { error: `Product not found: ${productId}` }
      }
      return { product }
    },
  }),

  build_routine: tool({
    description: 'Build a personalized skincare routine for a given skin type and time of day.',
    inputSchema: z.object({
      skinType: z
        .enum(['dry', 'oily', 'combination', 'normal', 'sensitive'])
        .describe('The skin type to build a routine for'),
      timeOfDay: z
        .enum(['morning', 'evening', 'both'])
        .default('both')
        .describe('Morning routine, evening routine, or both'),
    }),
    execute: async ({ skinType, timeOfDay }) => {
      const findProduct = (
        concerns: string[]
      ): { id: string; name: string; price: number } | null => {
        const match = PRODUCT_CATALOG.find(
          (p) =>
            p.skinTypes.includes(skinType) &&
            concerns.some((c) => p.concerns.some((pc) => pc.includes(c)))
        )
        return match ? { id: match.id, name: match.name, price: match.price } : null
      }

      const cleanser = findProduct(['cleansing']) || {
        id: 'gentle-cleansing-foam',
        name: 'Gentle Cleansing Foam',
        price: 24.95,
      }
      const toner = findProduct(['balance', 'pores']) || {
        id: 'balancing-toner',
        name: 'Balancing Toner',
        price: 19.95,
      }
      const daySerum = findProduct(['brightening', 'hydration']) || {
        id: 'hydra-boost-serum',
        name: 'Hydra Boost Serum',
        price: 34.95,
      }
      const moisturizer = findProduct(['barrier repair', 'dryness', 'hydration']) || {
        id: 'barrier-repair-cream',
        name: 'Barrier Repair Cream',
        price: 29.95,
      }
      const spf = { id: 'daily-spf-50', name: 'Daily SPF 50', price: 27.95 }
      const nightTreatment = findProduct(['overnight repair', 'anti-aging']) || {
        id: 'night-recovery-mask',
        name: 'Night Recovery Mask',
        price: 36.95,
      }

      const morning: ProductStep[] = [
        { step: 'Cleanser', product: cleanser },
        { step: 'Toner', product: toner },
        { step: 'Serum', product: daySerum },
        { step: 'Moisturizer', product: moisturizer },
        { step: 'SPF', product: spf },
      ]

      const evening: ProductStep[] = [
        { step: 'Cleanser', product: cleanser },
        { step: 'Toner', product: toner },
        { step: 'Treatment', product: nightTreatment },
        { step: 'Night Cream', product: moisturizer },
      ]

      const result: { morning?: ProductStep[]; evening?: ProductStep[] } = {}
      if (timeOfDay === 'morning' || timeOfDay === 'both') {
        result.morning = morning
      }
      if (timeOfDay === 'evening' || timeOfDay === 'both') {
        result.evening = evening
      }

      return result
    },
  }),

  add_to_cart_suggestion: tool({
    description: 'Suggest adding a product to the shopping cart (simulated for demo).',
    inputSchema: z.object({
      productId: z.string().describe('The product identifier to add'),
      quantity: z.number().default(1).describe('Number of units to add'),
    }),
    execute: async ({ productId, quantity }) => {
      const product = PRODUCT_CATALOG.find((p) => p.id === productId)
      if (!product) {
        return { error: `Product not found: ${productId}` }
      }
      return {
        action: 'add_to_cart',
        product: { id: product.id, name: product.name, price: product.price },
        quantity,
        message: 'Added to cart!',
      }
    },
  }),
}
