'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { EASE_OUT, STAGGER_FAST, VIEWPORT_DEFAULT } from '@/lib/motion/easings'
import { CountUp } from '@/components/motion/CountUp'

interface CapacityBarProps {
  /** Total slots in a year (e.g. 20). */
  totalPerYear: number
  /** Slots currently taken (e.g. 1). */
  taken: number
  /** Eyebrow label for the segment readout. */
  takenLabel: string
  /** Eyebrow label for the available segment readout. */
  availableLabel: string
  /** Eyebrow label above the segmented row. */
  legendLabel: string
}

const segmentVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.4 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
}

const rowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_FAST, delayChildren: 0.1 } },
}

/**
 * CapacityBar — Fase 7 capacity visualisation for /about.
 *
 * Renders the yearly partner cap (default 20) as a segmented horizontal bar
 * where taken slots glow amber, available slots are muted, plus a CountUp
 * readout of taken/total. Origin-bottom scaleY stagger gives the bar a
 * tactile "filling up" feel without scroll-pin complexity.
 *
 * Reduced-motion is handled globally via MotionConfig — segments resolve
 * to opacity-only fades, CountUp renders the static target value.
 */
export function CapacityBar({
  totalPerYear,
  taken,
  takenLabel,
  availableLabel,
  legendLabel,
}: CapacityBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  const [animatedAvailable, setAnimatedAvailable] = useState(0)
  const available = Math.max(totalPerYear - taken, 0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setAnimatedAvailable(available)
      return
    }
    const start = performance.now()
    const duration = 900
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setAnimatedAvailable(Math.round(available * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, available, reduced])

  const segments = Array.from({ length: totalPerYear }, (_, idx) => {
    const isTaken = idx < taken
    return { idx, isTaken }
  })

  return (
    <div ref={ref} className="rounded-2xl border border-border-primary bg-bg-surface/40 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent-system mb-2">
            {legendLabel}
          </p>
          <p className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-none">
            <CountUp to={taken} />{' '}
            <span className="text-text-muted font-normal text-2xl md:text-3xl">/ {totalPerYear}</span>
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm bg-accent-human" />
            <span>{takenLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span aria-hidden className="inline-block h-3 w-3 rounded-sm border border-accent-system/40 bg-accent-system/10" />
            <span>
              {availableLabel}: <span className="text-text-primary font-semibold">{animatedAvailable}</span>
            </span>
          </div>
        </div>
      </div>

      <motion.div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={totalPerYear}
        aria-valuenow={taken}
        aria-label={`${takenLabel}: ${taken} / ${totalPerYear}`}
        variants={rowVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_DEFAULT}
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${totalPerYear}, minmax(0, 1fr))` }}
      >
        {segments.map((segment) => (
          <motion.span
            key={segment.idx}
            aria-hidden
            variants={segmentVariants}
            className={
              segment.isTaken
                ? 'h-8 sm:h-10 rounded-sm bg-accent-human shadow-[0_0_12px_rgba(245,166,35,0.35)] origin-bottom'
                : 'h-8 sm:h-10 rounded-sm border border-accent-system/30 bg-accent-system/5 origin-bottom'
            }
          />
        ))}
      </motion.div>
    </div>
  )
}
