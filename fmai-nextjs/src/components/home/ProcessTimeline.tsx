'use client'

import { motion } from 'motion/react'
import { EASE_OUT, STAGGER_NORMAL, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

const WEEKS = ['1', '2', '3', '4'] as const

interface ProcessTimelineProps {
  eyebrow: string
  title: string
  subtitle: string
  weeks: Record<'1' | '2' | '3' | '4', { label: string; heading: string; body: string }>
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
export function ProcessTimeline({ eyebrow, title, subtitle, weeks }: ProcessTimelineProps) {
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
          {/* Horizontal connector — desktop only */}
          <span
            aria-hidden
            className="hidden lg:block absolute top-[14px] left-[8px] right-[8px] h-px bg-gradient-to-r from-accent-system/60 via-accent-system/30 to-transparent"
          />

          <motion.ol
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_DEFAULT}
          >
            {WEEKS.map((week, i) => (
              <motion.li
                key={week}
                variants={weekVariants}
                className="relative flex lg:flex-col gap-4 lg:gap-0"
              >
                {/* Vertical connector — mobile only */}
                {i < WEEKS.length - 1 && (
                  <span
                    aria-hidden
                    className="lg:hidden absolute left-[7px] top-7 bottom-[-1.5rem] w-px bg-accent-system/30"
                  />
                )}

                {/* Node + index — desktop sits on horizontal line */}
                <div className="flex lg:items-center gap-3 lg:mb-5 shrink-0">
                  <span
                    aria-hidden
                    className="relative grid place-items-center w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-bg-deep border border-accent-system"
                  >
                    <span className="block w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent-system" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-system lg:flex-1">
                    {weeks[week].label}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-lg lg:text-xl font-bold text-text-primary mb-2">
                    {weeks[week].heading}
                  </h3>
                  <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-md">
                    {weeks[week].body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
