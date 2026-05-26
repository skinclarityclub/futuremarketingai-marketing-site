'use client'

import { motion } from 'motion/react'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { EASE_OUT, STAGGER_NORMAL, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

const WEEKS = ['1', '2', '3', '4'] as const

interface ProcessTimelineProps {
  eyebrow: string
  title: string
  subtitle: string
  weeks: Record<
    '1' | '2' | '3' | '4',
    {
      label: string
      heading: string
      body: string
      deliverable: string
      clientHours: string
    }
  >
  ctaLabel: string
  ctaHint: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_NORMAL, delayChildren: 0.1 },
  },
}

const weekVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

/**
 * 4-week onboarding timeline. Horizontal desktop, vertical mobile.
 *
 * W5.4 revision (2026-05-25): de oorspronkelijke pin-stack scrub (300vh
 * pinned scroll) gaf een dead-zone scroll-gevoel tussen Onboarding en
 * FounderSection. Vervangen door whileInView stagger reveal — consistent
 * met MemoryUSP / Pricing. Reduced-motion: MotionConfig stript de y-translate.
 */
export function ProcessTimeline({ eyebrow, title, subtitle, weeks, ctaLabel, ctaHint }: ProcessTimelineProps) {
  return (
    <section
      aria-labelledby="process-timeline"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 lg:mb-16 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {eyebrow}
          </p>
          <h2
            id="process-timeline"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary"
          >
            {title}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary">
            {subtitle}
          </p>
        </div>

        <div className="relative">
          <motion.ol
            className="grid grid-cols-1 lg:grid-cols-4 gap-5 relative items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_DEFAULT}
          >
            {WEEKS.map((week, i) => (
              <motion.li
                key={week}
                variants={weekVariants}
                className="relative h-full"
              >
                {/* Vertical connector — mobile only */}
                {i < WEEKS.length - 1 && (
                  <span
                    aria-hidden
                    className="lg:hidden absolute left-[7px] top-7 bottom-[-1.25rem] w-px bg-accent-system/30"
                  />
                )}

                <article className="relative h-full flex flex-col rounded-[var(--radius-card)] border border-border-primary bg-bg-surface/30 p-5 lg:p-6">
                  {/* Node + label header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      aria-hidden
                      className="relative grid place-items-center w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-bg-deep border border-accent-system shrink-0"
                    >
                      <span className="block w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent-system" />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-system">
                      {weeks[week].label}
                    </span>
                  </div>

                  {/* Tijd-investering chip — vaste positie onder label */}
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-border-primary bg-bg-deep/40 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted mb-4">
                    <Clock className="w-3 h-3" aria-hidden />
                    {weeks[week].clientHours}
                  </span>

                  {/* Body — neemt resterende ruimte tot deliverable footer */}
                  <div className="flex-1 mb-5">
                    <h3 className="font-display text-lg lg:text-xl font-bold text-text-primary mb-2 leading-tight">
                      {weeks[week].heading}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {weeks[week].body}
                    </p>
                  </div>

                  {/* Deliverable footer — altijd onderaan, mt-auto via flex-col h-full */}
                  <div className="flex items-start gap-2 pt-4 border-t border-border-primary/50 mt-auto">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-status-active" aria-hidden />
                    <span className="text-xs text-text-secondary leading-relaxed">
                      {weeks[week].deliverable}
                    </span>
                  </div>
                </article>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        {/* CTA na timeline — push naar volgende stap */}
        <div className="mt-12 lg:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/apply"
            className="group inline-flex items-center gap-2 rounded-full bg-accent-system px-6 py-3 text-sm font-bold text-bg-deep shadow-[0_0_24px_rgba(0,212,170,0.30)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,212,170,0.50)] hover:brightness-105 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <span className="text-xs text-text-muted">{ctaHint}</span>
        </div>
      </div>
    </section>
  )
}
