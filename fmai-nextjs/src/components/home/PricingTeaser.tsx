'use client'

import { motion } from 'motion/react'
import { ArrowRight, Crown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { EASE_OUT, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

type TierKey = 'founding' | 'growth' | 'professional' | 'enterprise'

type TierViewModel = {
  key: TierKey
  price: string
  unit: 'perMonth' | 'perWorkspace'
  highlighted: boolean
}

interface PricingTeaserProps {
  eyebrow: string
  title: string
  subtitle: string
  ctaLink: string
  spotsTaken: string
  perMonth: string
  perWorkspace: string
  tiers: TierViewModel[]
  tierCopy: Record<TierKey, { label: string; tagline: string; desc: string }>
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const tierVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
}

export function PricingTeaser({
  eyebrow,
  title,
  subtitle,
  ctaLink,
  spotsTaken,
  perMonth,
  perWorkspace,
  tiers,
  tierCopy,
}: PricingTeaserProps) {
  return (
    <section
      aria-labelledby="pricing-teaser"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 lg:mb-12">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {eyebrow}
          </p>
          <h2
            id="pricing-teaser"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary max-w-3xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/*
          W5.8 — scroll-progressive reveal: each tier eases in with a slight
          scale + y-translate when the grid enters viewport, staggered. Plan
          v2.1 spec proposed full GSAP sticky-pin (400vh extra page height);
          dropped in favor of the lighter reveal — same wow signal without
          the layout cost. MotionConfig reducedMotion=user strips transforms.
        */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_DEFAULT}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.key}
              variants={tierVariants}
              className={
                tier.highlighted
                  ? 'relative rounded-2xl border border-accent-human/40 bg-gradient-to-b from-accent-human/[0.08] to-transparent p-6 flex flex-col'
                  : 'relative rounded-2xl border border-border-primary bg-white/[0.02] p-6 flex flex-col transition-colors hover:bg-white/[0.04]'
              }
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-accent-human/15 border border-accent-human/40 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-accent-human">
                  <Crown className="w-3 h-3" aria-hidden />
                  {tierCopy[tier.key].tagline}
                </span>
              )}

              <div className="mb-1">
                <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  {tierCopy[tier.key].label}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-3xl lg:text-4xl font-bold text-text-primary">
                  €{tier.price}
                </span>
              </div>
              <p className="text-xs text-text-muted mb-4">
                {tier.unit === 'perMonth' ? perMonth : perWorkspace}
              </p>

              {!tier.highlighted && (
                <p className="text-xs text-text-secondary font-medium mb-3">
                  {tierCopy[tier.key].tagline}
                </p>
              )}

              <p className="text-sm text-text-secondary leading-relaxed flex-1">
                {tierCopy[tier.key].desc}
              </p>

              {tier.highlighted && (
                <p className="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-accent-human">
                  {spotsTaken}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
          >
            {ctaLink}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
