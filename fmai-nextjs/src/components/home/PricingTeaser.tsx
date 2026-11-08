'use client'

import { motion } from 'motion/react'
import { ArrowRight, Crown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { CTAButton } from '@/components/ui/CTAButton'
import { EASE_OUT, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

interface PricingTeaserProps {
  eyebrow: string
  title: string
  subtitle: string
  ctaLink: string
  spotsTaken: string
  perMonth: string
  /** One line in place of the old tier strip: regular plans follow after the cohort (plan A1.4 D2). */
  regularNote: string
  foundingCtaLabel: string
  /** Founding is the only offer on the site (Founding A1.4, 9 Nov 2026). */
  founding: { price: string; label: string; tagline: string; desc: string }
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

export function PricingTeaser({
  eyebrow,
  title,
  subtitle,
  ctaLink,
  spotsTaken,
  perMonth,
  regularNote,
  foundingCtaLabel,
  founding,
}: PricingTeaserProps) {

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
                    {founding.tagline}
                  </span>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-xs uppercase tracking-[0.18em] text-text-secondary">
                      {founding.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-none text-text-primary tabular-nums">
                      €{founding.price}
                    </span>
                    <span className="text-sm md:text-base text-text-secondary">
                      {perMonth}
                    </span>
                  </div>
                  <p className="mt-5 text-base md:text-lg text-text-secondary leading-relaxed">
                    {founding.desc}
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

          <p className="mt-8 text-sm text-text-muted">{regularNote}</p>
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
