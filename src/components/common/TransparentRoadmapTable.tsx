import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GlassCard } from './GlassCard'
import { TierBadge } from './TierBadge'
import { SlotProgressIndicator } from './SlotProgressIndicator'
import {
  PricingTier,
  TIER_CONFIGS,
  formatPrice,
  calculateSlotAvailability,
} from '../../types/pricing'

// ============================================================================
// Types
// ============================================================================

export interface TransparentRoadmapTableProps {
  /** Current total customers (for highlighting current tier) */
  currentCustomers: number
  /** Show slot progress bars */
  showProgress?: boolean
  /** Start expanded */
  expandedByDefault?: boolean
  /** Variant: timeline (visual roadmap), table (data table) */
  variant?: 'timeline' | 'table'
  /** Additional CSS classes */
  className?: string
}

interface TierRoadmapItem {
  tier: PricingTier
  slotRange: { min: number; max: number }
  price: number
  lockPeriod: number
  freeMonths: number
  status: 'past' | 'current' | 'future'
}

// ============================================================================
// Component
// ============================================================================

/**
 * TransparentRoadmapTable - Shows pricing progression roadmap
 *
 * Features:
 * - Visual timeline of pricing tiers and slot progression
 * - Current tier highlighting based on customer count
 * - Expandable details for each tier
 * - Slot availability tracking
 * - Transparent pricing increase messaging
 * - 2 variants: timeline (visual), table (data-focused)
 * - Mobile responsive with horizontal scroll
 * - Full accessibility (ARIA, keyboard nav)
 *
 * Purpose: Demonstrates transparency and creates urgency by showing
 * future price increases. Users can see exactly when prices will rise.
 *
 * Usage:
 * ```tsx
 * <TransparentRoadmapTable currentCustomers={3} variant="timeline" showProgress />
 * ```
 */
export const TransparentRoadmapTable: React.FC<TransparentRoadmapTableProps> = ({
  currentCustomers,
  showProgress = true,
  expandedByDefault = false,
  variant = 'timeline',
  className = '',
}) => {
  const { t } = useTranslation('common')
  const [expandedTiers, setExpandedTiers] = useState<Set<PricingTier>>(
    expandedByDefault ? new Set(['founding', 'pioneer', 'innovator', 'standard']) : new Set()
  )

  // Build roadmap items
  const roadmapItems: TierRoadmapItem[] = [
    {
      tier: 'founding',
      slotRange: TIER_CONFIGS.founding.slotRange,
      price: TIER_CONFIGS.founding.price,
      lockPeriod: TIER_CONFIGS.founding.lockPeriodMonths,
      freeMonths: TIER_CONFIGS.founding.freeMonths,
      status: currentCustomers <= 5 ? 'current' : 'past',
    },
    {
      tier: 'pioneer',
      slotRange: TIER_CONFIGS.pioneer.slotRange,
      price: TIER_CONFIGS.pioneer.price,
      lockPeriod: TIER_CONFIGS.pioneer.lockPeriodMonths,
      freeMonths: TIER_CONFIGS.pioneer.freeMonths,
      status:
        currentCustomers > 5 && currentCustomers <= 15
          ? 'current'
          : currentCustomers <= 5
            ? 'future'
            : 'past',
    },
    {
      tier: 'innovator',
      slotRange: TIER_CONFIGS.innovator.slotRange,
      price: TIER_CONFIGS.innovator.price,
      lockPeriod: TIER_CONFIGS.innovator.lockPeriodMonths,
      freeMonths: TIER_CONFIGS.innovator.freeMonths,
      status:
        currentCustomers > 15 && currentCustomers <= 25
          ? 'current'
          : currentCustomers <= 15
            ? 'future'
            : 'past',
    },
    {
      tier: 'standard',
      slotRange: TIER_CONFIGS.standard.slotRange,
      price: TIER_CONFIGS.standard.price,
      lockPeriod: TIER_CONFIGS.standard.lockPeriodMonths,
      freeMonths: TIER_CONFIGS.standard.freeMonths,
      status: currentCustomers > 25 ? 'current' : 'future',
    },
  ]

  const toggleTier = (tier: PricingTier) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev)
      if (next.has(tier)) {
        next.delete(tier)
      } else {
        next.add(tier)
      }
      return next
    })
  }

  // Timeline variant - Visual roadmap
  if (variant === 'timeline') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
            {t('common:pricing.transparent_roadmap')}
          </h3>
          <p className="text-white/90 text-lg">
            Clear pricing progression • Lock in early for maximum savings
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-secondary to-white/20" />

          <div className="space-y-6">
            {roadmapItems.map((item, index) => {
              const config = TIER_CONFIGS[item.tier]
              const availability = calculateSlotAvailability(item.tier, currentCustomers)
              const isExpanded = expandedTiers.has(item.tier)
              const isCurrent = item.status === 'current'

              return (
                <motion.div
                  key={item.tier}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    className={`relative pl-20 pr-6 py-6 ${
                      isCurrent ? 'ring-2 ring-accent-primary' : ''
                    } ${item.status === 'past' ? 'opacity-60' : ''}`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full ${
                        isCurrent
                          ? 'bg-gradient-to-br from-accent-primary to-accent-secondary animate-pulse'
                          : item.status === 'past'
                            ? ''
                            : '0'
                      } border-4 border-background-dark`}
                      style={
                        item.status === 'past' ? { background: 'rgba(0, 0, 0, 0.3)' } : undefined
                      }
                    />

                    {/* Header */}
                    <button
                      onClick={() => toggleTier(item.tier)}
                      className="w-full text-left"
                      aria-expanded={isExpanded}
                      aria-controls={`tier-details-${item.tier}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <TierBadge
                              tier={item.tier}
                              variant="compact"
                              size="md"
                              glow={isCurrent}
                            />
                            {isCurrent && (
                              <span className="px-3 py-1 rounded-full bg-accent-primary text-white text-xs font-semibold">
                                Currently Active
                              </span>
                            )}
                            {item.status === 'past' && (
                              <span
                                className="px-3 py-1 rounded-full text-white/70 text-xs"
                                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                              >
                                {t('common:pricing.sold_out')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/70">
                            Customers {item.slotRange.min}-
                            {item.slotRange.max === Infinity ? '∞' : item.slotRange.max}
                            {availability.remaining > 0 && availability.remaining <= 5 && (
                              <span className="text-accent-warning font-semibold ml-2">
                                {t('slot_progress.only_left', { count: availability.remaining })}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-accent-primary">
                            {formatPrice(item.price, '€')}
                            <span className="text-sm text-white/70 font-normal block">/month</span>
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`tier-details-${item.tier}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-white/10 space-y-4">
                            {/* Benefits */}
                            <div>
                              <p className="text-sm font-semibold text-white mb-2">Benefits:</p>
                              <ul className="space-y-1">
                                {config.benefits.slice(0, 4).map((benefit) => (
                                  <li
                                    key={benefit.id}
                                    className="text-sm text-white/80 flex items-start gap-2"
                                  >
                                    <span className="text-accent-success">✓</span>
                                    <span>{benefit.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Pricing details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-white/70">Rate Lock:</p>
                                <p className="text-white font-semibold">{item.lockPeriod} months</p>
                              </div>
                              {item.freeMonths > 0 && (
                                <div>
                                  <p className="text-white/70">Free Months:</p>
                                  <p className="text-accent-success font-semibold">
                                    {item.freeMonths} months
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-white/70">Year 1 Cost:</p>
                                <p className="text-white font-semibold">
                                  {formatPrice(config.yearOneCost, '€')}
                                </p>
                              </div>
                              {config.savings > 0 && (
                                <div>
                                  <p className="text-white/70">vs Standard:</p>
                                  <p className="text-accent-success font-semibold">
                                    Save {formatPrice(config.savings, '€')}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Progress bar */}
                            {showProgress && availability.remaining > 0 && (
                              <SlotProgressIndicator
                                tier={item.tier}
                                totalCustomers={currentCustomers}
                                variant="compact"
                                showPercentage
                                size="sm"
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand/collapse indicator */}
                    <button
                      onClick={() => toggleTier(item.tier)}
                      className="absolute bottom-4 right-4 text-white/50 hover:text-white transition-colors"
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      <motion.svg
                        className="w-5 h-5"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </button>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Transparency note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <p className="text-sm text-white/80">
            💡 <span className="font-semibold">Full Transparency:</span> Prices increase as we reach
            capacity limits. Your rate is locked for the duration specified in your tier.
          </p>
        </motion.div>
      </div>
    )
  }

  // Table variant - Data-focused
  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
          {t('common:pricing.pricing_roadmap')}
        </h3>
        <p className="text-white/90">{t('common:pricing.roadmap_subtitle')}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-4 px-4 text-sm font-semibold text-white/90">Tier</th>
              <th className="py-4 px-4 text-sm font-semibold text-white/90">Customers</th>
              <th className="py-4 px-4 text-sm font-semibold text-white/90">Price/Month</th>
              <th className="py-4 px-4 text-sm font-semibold text-white/90">Rate Lock</th>
              <th className="py-4 px-4 text-sm font-semibold text-white/90">Status</th>
            </tr>
          </thead>
          <tbody>
            {roadmapItems.map((item) => {
              const availability = calculateSlotAvailability(item.tier, currentCustomers)
              const isCurrent = item.status === 'current'

              return (
                <tr
                  key={item.tier}
                  className={`border-b border-white/10 ${isCurrent ? 'bg-accent-primary/10' : ''}`}
                >
                  <td className="py-4 px-4">
                    <TierBadge tier={item.tier} variant="compact" size="sm" glow={isCurrent} />
                  </td>
                  <td className="py-4 px-4 text-white/90">
                    {item.slotRange.min}-
                    {item.slotRange.max === Infinity ? '∞' : item.slotRange.max}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xl font-bold text-accent-primary">
                      {formatPrice(item.price, '€')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white/90">{item.lockPeriod} months</td>
                  <td className="py-4 px-4">
                    {isCurrent ? (
                      <span className="px-3 py-1 rounded-full bg-accent-primary text-white text-xs font-semibold">
                        Current
                      </span>
                    ) : item.status === 'past' ? (
                      <span
                        className="px-3 py-1 rounded-full text-white/70 text-xs"
                        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                      >
                        {t('common:pricing.sold_out')}
                      </span>
                    ) : availability.remaining > 0 && availability.remaining <= 5 ? (
                      <span className="px-3 py-1 rounded-full bg-accent-warning text-white text-xs font-semibold">
                        {availability.remaining} left
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-white/80 text-xs">
                        {t('common:pricing.available')}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 glass-card p-4 text-center">
        <p className="text-sm text-white/80">
          💡 <span className="font-semibold">Full Transparency:</span> Your rate is locked for the
          period specified in your tier. New customers pay higher rates as we reach capacity.
        </p>
      </div>
    </div>
  )
}

export default TransparentRoadmapTable
