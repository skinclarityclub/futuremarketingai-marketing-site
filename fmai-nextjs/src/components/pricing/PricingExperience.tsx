'use client'

import { useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { WorkspaceSlider } from './WorkspaceSlider'
import { TierBentoCard } from './TierBentoCard'
import {
  EASE_OUT,
  DEFAULT_DURATION,
  STAGGER_NORMAL,
  VIEWPORT_DEFAULT,
} from '@/lib/motion/easings'

type TierLabelKey = 'founding' | 'growth' | 'professional' | 'enterprise'

interface PricingExperienceProps {
  locale: string
  /** Mid-range workspace default, defined server-side for SSR parity. */
  initialWorkspaces: number
  /** Founding counter values for the Founding card description. */
  foundingCounter: { taken: number; total: number }
  /** Per-tier feature count (deferred render — same shape as old TIER_CONFIG). */
  tierFeatureCounts: Record<TierLabelKey, number>
}

const TIER_ORDER: TierLabelKey[] = ['founding', 'growth', 'professional', 'enterprise']

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_NORMAL } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DEFAULT_DURATION, ease: EASE_OUT },
  },
}

/**
 * PricingExperience — owns the shared `workspaces` state that drives the
 * WorkspaceSlider + 4 TierBentoCard glow states. Replaces the previous
 * per-card-slider TierPricingCard grid. SSR-rendered with the mid-range
 * default so the page paints with sensible numbers before hydration.
 */
export function PricingExperience({
  locale,
  initialWorkspaces,
  foundingCounter,
  tierFeatureCounts,
}: PricingExperienceProps) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces)

  return (
    <div className="space-y-8">
      <WorkspaceSlider workspaces={workspaces} setWorkspaces={setWorkspaces} locale={locale} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_DEFAULT}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {TIER_ORDER.map((tierLabel) => (
          <motion.div key={tierLabel} variants={itemVariants} className="h-full">
            <TierBentoCard
              tierLabel={tierLabel}
              featureCount={tierFeatureCounts[tierLabel]}
              locale={locale}
              workspaces={workspaces}
              foundingCounter={tierLabel === 'founding' ? foundingCounter : undefined}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
