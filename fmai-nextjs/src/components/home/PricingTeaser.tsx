'use client'

import { motion } from 'motion/react'
import { ArrowRight, Crown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { CTAButton } from '@/components/ui/CTAButton'
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
  futurePhaseEyebrow: string
  futureAvailability: string
  foundingCtaLabel: string
  tiers: TierViewModel[]
  tierCopy: Record<TierKey, { label: string; tagline: string; desc: string }>
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
}

function unitLabel(
  unit: TierViewModel['unit'],
  perMonth: string,
  perWorkspace: string,
) {
  if (unit === 'perMonth') return perMonth
  return perWorkspace
}

export function PricingTeaser({
  eyebrow,
  title,
  subtitle,
  ctaLink,
  spotsTaken,
  perMonth,
  perWorkspace,
  futurePhaseEyebrow,
  futureAvailability,
  foundingCtaLabel,
  tiers,
  tierCopy,
}: PricingTeaserProps) {
  const founding = tiers.find((t) => t.key === 'founding')
  const futureTiers = tiers.filter((t) => t.key !== 'founding')

  return (
    <section aria-labelledby="pricing-teaser" className="py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-10 lg:mb-12">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {eyebrow}
          </p>
          <h2
            id="pricing-teaser"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary max-w-3xl leading-tight"
          >
            {title}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_DEFAULT}
        >
          {/* Founding hero tile (full-width) */}
          {founding && (
            <motion.article
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl border border-accent-human/40 bg-gradient-to-br from-accent-human/[0.08] via-bg-surface/30 to-transparent p-6 md:p-8 lg:p-10"
            >
              {/* subtle radial accent top-right */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-accent-human/[0.08] blur-3xl"
              />
              <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-end">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-human/15 border border-accent-human/40 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-accent-human mb-5">
                    <Crown className="w-3 h-3" aria-hidden />
                    {tierCopy.founding.tagline}
                  </span>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-xs uppercase tracking-[0.18em] text-text-secondary">
                      {tierCopy.founding.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-none text-text-primary tabular-nums">
                      €{founding.price}
                    </span>
                    <span className="text-sm md:text-base text-text-secondary">
                      {unitLabel(founding.unit, perMonth, perWorkspace)}
                    </span>
                  </div>
                  <p className="mt-5 text-base md:text-lg text-text-secondary leading-relaxed">
                    {tierCopy.founding.desc}
                  </p>
                  <p className="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-accent-human">
                    {spotsTaken}
                  </p>
                </div>
                <div className="shrink-0">
                  <CTAButton
                    href="/apply"
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {foundingCtaLabel}
                  </CTAButton>
                </div>
              </div>
            </motion.article>
          )}

          {/* Future tiers preview strip */}
          {futureTiers.length > 0 && (
            <div className="mt-12 lg:mt-14">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted">
                  {futurePhaseEyebrow}
                </span>
                <span className="h-px flex-1 bg-border-primary/60" aria-hidden />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
                {futureTiers.map((tier) => (
                  <motion.article
                    key={tier.key}
                    variants={itemVariants}
                    className="relative rounded-2xl border border-border-primary bg-white/[0.015] p-5 md:p-6 flex flex-col transition-colors hover:bg-white/[0.03] hover:border-border-primary/80"
                  >
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                      {tierCopy[tier.key].label}
                    </span>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="font-display text-3xl lg:text-4xl font-bold text-text-primary tabular-nums">
                        €{tier.price}
                      </span>
                      <span className="text-xs text-text-muted">
                        {unitLabel(tier.unit, perMonth, perWorkspace)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-accent-system">
                      {tierCopy[tier.key].tagline}
                    </p>
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed flex-1">
                      {tierCopy[tier.key].desc}
                    </p>
                    <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.12em] text-text-muted">
                      {futureAvailability}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-10">
          <Link
            href="/apply"
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
