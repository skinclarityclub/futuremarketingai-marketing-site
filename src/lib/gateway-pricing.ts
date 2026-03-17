/**
 * Gateway Pricing Data Module
 * Single source of truth for all gateway service pricing tiers, FAQs, and helpers.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GatewayTierId = 'starter' | 'growth' | 'scale'

export type ServiceType = 'chatbot' | 'voice' | 'automations'

export interface ServiceLimit {
  service: ServiceType
  label: string
  value: number
  unit: string
}

export interface GatewayTier {
  id: GatewayTierId
  name: string
  price: number
  setupFee: number
  includedServices: number
  limits: ServiceLimit[]
  highlighted?: boolean
  badge?: string
  description: string
}

export interface PricingFaq {
  question: string
  answer: string
}

// ---------------------------------------------------------------------------
// Data — Gateway Tiers
// ---------------------------------------------------------------------------

export const GATEWAY_TIERS: GatewayTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1497,
    setupFee: 2500,
    includedServices: 1,
    description: 'Perfect for businesses ready to automate their first customer-facing channel.',
    limits: [
      { service: 'chatbot', label: 'Conversations', value: 1000, unit: 'conversations/mo' },
      { service: 'voice', label: 'Voice Minutes', value: 200, unit: 'min/mo' },
      { service: 'automations', label: 'Workflows', value: 5, unit: 'workflows' },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 2497,
    setupFee: 4500,
    includedServices: 2,
    highlighted: true,
    badge: 'Most Popular',
    description: 'Ideal for scaling teams that need multi-channel AI across sales and support.',
    limits: [
      { service: 'chatbot', label: 'Conversations', value: 3000, unit: 'conversations/mo' },
      { service: 'voice', label: 'Voice Minutes', value: 500, unit: 'min/mo' },
      { service: 'automations', label: 'Workflows', value: 10, unit: 'workflows' },
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 3997,
    setupFee: 7500,
    includedServices: 3,
    description: 'Full-stack AI deployment — chatbot, voice, and automations working together.',
    limits: [
      { service: 'chatbot', label: 'Conversations', value: 5000, unit: 'conversations/mo' },
      { service: 'voice', label: 'Voice Minutes', value: 1000, unit: 'min/mo' },
      { service: 'automations', label: 'Workflows', value: 20, unit: 'workflows' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Data — Pricing FAQs
// ---------------------------------------------------------------------------

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: 'What happens if I exceed my usage limits?',
    answer:
      'We use a soft-cap model. If you approach your limit we will notify you and discuss options — your service is never cut off mid-conversation. Overages are billed at a transparent per-unit rate.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Absolutely. You can move between tiers at any time. Upgrades take effect immediately and downgrades apply at the start of your next billing cycle.',
  },
  {
    question: 'What does the setup fee cover?',
    answer:
      'The one-time setup fee covers custom AI model training on your brand voice, integration with your existing systems (CRM, helpdesk, etc.), and a dedicated onboarding sprint to get you live fast.',
  },
  {
    question: 'How long does onboarding take?',
    answer:
      'Most clients are fully live within 2-3 weeks. Complex integrations or multi-channel deployments may take up to 4 weeks.',
  },
  {
    question: 'Can I choose which services to include?',
    answer:
      'Yes. On the Starter plan you pick one service, on Growth you pick two. The Scale plan includes all three. You can always add more services later.',
  },
  {
    question: 'Are there long-term contracts?',
    answer:
      'No. All plans are month-to-month with no long-term commitment. We earn your business every month.',
  },
  {
    question: 'What if I need more capacity than the Scale plan offers?',
    answer:
      'We offer custom enterprise packages for high-volume deployments. Contact us and we will design a plan that fits your exact requirements.',
  },
  {
    question: 'What level of support is included?',
    answer:
      'Every plan includes dedicated Slack/email support and a monthly strategy call. Growth and Scale clients also receive priority response times and quarterly performance reviews.',
  },
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Format a price in euros with locale-aware thousands separator.
 * Example: 2497 -> "€2,497"
 */
export function formatGatewayPrice(price: number): string {
  return `€${price.toLocaleString('en-US')}`
}

/**
 * Retrieve the limits for a specific service across all tiers.
 * Returns an array of { tierId, tierName, limit } objects.
 */
export function getServiceLimits(service: ServiceType) {
  return GATEWAY_TIERS.map((tier) => {
    const limit = tier.limits.find((l) => l.service === service)
    return {
      tierId: tier.id,
      tierName: tier.name,
      limit: limit ?? null,
    }
  })
}
