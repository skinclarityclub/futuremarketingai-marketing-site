/**
 * Pricing Types for Early Adopter Strategy
 * Based on Model B: Founding 5, Pioneer 10, Innovator 10, Standard tiers
 */

export type PricingTier = 'founding' | 'pioneer' | 'innovator' | 'standard'

export interface TierConfig {
  id: PricingTier
  name: string
  displayName: string
  price: number // Monthly price in EUR
  currency: string
  slotRange: { min: number; max: number }
  benefits: TierBenefit[]
  lockPeriodMonths: number
  freeMonths: number
  badge: TierBadgeConfig
  yearOneCost: number // Total year 1 cost after free months
  savings: number // Savings vs standard rate
}

export interface TierBenefit {
  id: string
  text: string
  highlight?: boolean
  icon?: string
}

export interface TierBadgeConfig {
  icon: string
  color: 'cyan' | 'purple' | 'green' | 'gray'
  gradient: string
  glowClass: string
}

export interface SlotAvailability {
  tier: PricingTier
  total: number
  claimed: number
  remaining: number
  percentFilled: number
}

export interface PricingState {
  currentTier: PricingTier
  slotsAvailability: Record<PricingTier, SlotAvailability>
  lastUpdated: Date
}

/**
 * Tier Configurations - Model B
 */
export const TIER_CONFIGS: Record<PricingTier, TierConfig> = {
  founding: {
    id: 'founding',
    name: 'Founding 5 Members',
    displayName: 'Founding Member',
    price: 15000,
    currency: '€',
    slotRange: { min: 1, max: 5 },
    lockPeriodMonths: 24,
    freeMonths: 2,
    yearOneCost: 120000, // 10 months * 15k
    savings: 30000,
    badge: {
      icon: '🏆',
      color: 'cyan',
      gradient: 'from-cyan-400 to-blue-500',
      glowClass: 'shadow-[0_0_20px_rgba(0,212,255,0.4)]',
    },
    benefits: [
      { id: 'lock', text: 'Rate LOCKED for 24 months', icon: '🔒', highlight: true },
      { id: 'free', text: '2 Months FREE (€30k Year 1 savings)', icon: '🎁', highlight: true },
      { id: 'roadmap', text: 'Roadmap Influence - You decide what we build', icon: '🗺️' },
      { id: 'support', text: 'Premium Support - Direct Slack/WhatsApp', icon: '💬' },
      { id: 'marketing', text: 'Co-Marketing - We promote your success', icon: '📢' },
      { id: 'badge', text: 'Founding Member Badge', icon: '🏅' },
    ],
  },
  pioneer: {
    id: 'pioneer',
    name: 'Pioneer 10',
    displayName: 'Pioneer Member',
    price: 17500,
    currency: '€',
    slotRange: { min: 6, max: 15 },
    lockPeriodMonths: 18,
    freeMonths: 1,
    yearOneCost: 192500, // 11 months * 17.5k
    savings: 17500,
    badge: {
      icon: '💎',
      color: 'purple',
      gradient: 'from-purple-400 to-purple-600',
      glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    },
    benefits: [
      { id: 'lock', text: 'Rate LOCKED for 18 months', icon: '🔒', highlight: true },
      { id: 'free', text: '1 Month FREE (€17.5k Year 1 savings)', icon: '🎁', highlight: true },
      { id: 'support', text: 'Priority Support', icon: '⚡' },
      { id: 'beta', text: 'Beta Access to New Features', icon: '🚀' },
      { id: 'case', text: 'Case Study Feature', icon: '📊' },
    ],
  },
  innovator: {
    id: 'innovator',
    name: 'Innovator 10',
    displayName: 'Innovator',
    price: 20000,
    currency: '€',
    slotRange: { min: 16, max: 25 },
    lockPeriodMonths: 12,
    freeMonths: 0,
    yearOneCost: 240000,
    savings: 0,
    badge: {
      icon: '🚀',
      color: 'green',
      gradient: 'from-emerald-400 to-green-500',
      glowClass: 'shadow-[0_0_20px_rgba(0,255,136,0.4)]',
    },
    benefits: [
      { id: 'lock', text: 'Rate LOCKED for 12 months', icon: '🔒' },
      { id: 'features', text: 'All Premium Features', icon: '✨' },
      { id: 'support', text: 'Premium Support', icon: '💬' },
    ],
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    displayName: 'Standard',
    price: 22500,
    currency: '€',
    slotRange: { min: 26, max: 999 },
    lockPeriodMonths: 12,
    freeMonths: 0,
    yearOneCost: 270000,
    savings: 0,
    badge: {
      icon: '📈',
      color: 'gray',
      gradient: 'from-gray-400 to-gray-600',
      glowClass: 'shadow-[0_0_20px_rgba(107,114,128,0.3)]',
    },
    benefits: [
      { id: 'features', text: 'All Features', icon: '✨' },
      { id: 'support', text: 'Standard Support', icon: '💬' },
    ],
  },
}

/**
 * Get the current active tier based on slot count
 */
export function getCurrentTier(totalCustomers: number): PricingTier {
  if (totalCustomers <= 5) {
    return 'founding'
  }
  if (totalCustomers <= 15) {
    return 'pioneer'
  }
  if (totalCustomers <= 25) {
    return 'innovator'
  }
  return 'standard'
}

/**
 * Get tier configuration
 */
export function getTierConfig(tier: PricingTier): TierConfig {
  return TIER_CONFIGS[tier]
}

/**
 * Calculate slot availability
 */
export function calculateSlotAvailability(
  tier: PricingTier,
  totalCustomers: number
): SlotAvailability {
  const config = TIER_CONFIGS[tier]
  const tierCustomers = Math.max(
    0,
    Math.min(
      totalCustomers - config.slotRange.min + 1,
      config.slotRange.max - config.slotRange.min + 1
    )
  )
  const total = config.slotRange.max - config.slotRange.min + 1
  const claimed = tierCustomers
  const remaining = total - claimed
  const percentFilled = (claimed / total) * 100

  return {
    tier,
    total,
    claimed,
    remaining,
    percentFilled,
  }
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency = '€'): string {
  return `${currency}${price.toLocaleString('nl-NL')}`
}
