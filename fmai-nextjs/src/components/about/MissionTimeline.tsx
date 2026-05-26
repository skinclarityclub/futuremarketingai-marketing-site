'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react'
import { EASE_OUT, STAGGER_NORMAL, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

export interface TimelineMilestone {
  /** Marker label (e.g. "Q3 2025"). */
  period: string
  /** Milestone heading (e.g. "FMai geboren"). */
  title: string
  /** Body paragraph. */
  body: string
  /** When true, treat as the current stand-out marker (highlighted ring + accent dot). */
  current?: boolean
}

interface MissionTimelineProps {
  milestones: readonly TimelineMilestone[]
  /** Aria-label for the ordered list (e.g. "Tijdslijn van mijlpalen"). */
  ariaLabel: string
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_NORMAL, delayChildren: 0.1 } },
}

/**
 * MissionTimeline — Fase 7 signature experiment for /about.
 *
 * Renders a vertical scroll-driven timeline of mission milestones with an
 * animated progress-line that fills as the reader scrolls past markers.
 * Each milestone card reveals via stagger + uses a sticky-feeling dot on
 * the rail. Reduced-motion (handled globally via MotionConfig) collapses
 * the progress-line to a static accent stroke and disables y transforms.
 *
 * Mobile-first layout: rail sits on the left edge (24px from container),
 * milestone cards stack right of it. Desktop adds breathing room and a
 * slightly wider rail.
 */
export function MissionTimeline({ milestones, ariaLabel }: MissionTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 25%'],
  })

  const railHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Static rail track */}
      <div
        aria-hidden
        className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-border-primary/60"
      />

      {/* Animated progress fill */}
      <motion.div
        aria-hidden
        className="absolute left-[15px] sm:left-[19px] top-2 w-px bg-gradient-to-b from-accent-system via-accent-system/70 to-accent-human"
        style={reduced ? { height: '100%' } : { height: railHeight }}
      />

      <motion.ol
        aria-label={ariaLabel}
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_DEFAULT}
        className="relative space-y-10 sm:space-y-12 list-none"
      >
        {milestones.map((milestone, idx) => (
          <motion.li
            key={`${milestone.period}-${idx}`}
            variants={itemVariants}
            className="relative pl-12 sm:pl-16"
          >
            {/* Rail dot */}
            <span
              aria-hidden
              className={
                milestone.current
                  ? 'absolute left-2 sm:left-3 top-1 h-4 w-4 rounded-full bg-accent-system ring-4 ring-accent-system/20 shadow-[0_0_14px_rgba(0,212,170,0.45)]'
                  : 'absolute left-2 sm:left-3 top-1.5 h-3 w-3 rounded-full bg-bg-elevated border-2 border-accent-system/50'
              }
            />
            <div
              className={
                milestone.current
                  ? 'relative rounded-2xl border border-accent-system/30 bg-gradient-to-br from-bg-elevated to-bg-surface p-6 shadow-[0_0_0_1px_rgba(0,212,170,0.08)]'
                  : 'relative rounded-2xl border border-border-primary bg-bg-surface/40 p-6'
              }
            >
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent-system mb-2">
                {milestone.period}
              </p>
              <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-2">
                {milestone.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">{milestone.body}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}
