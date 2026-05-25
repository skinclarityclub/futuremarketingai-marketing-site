'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/lib/motion/easings'

interface CountUpProps {
  /** Target value to count up to. */
  to: number
  /** Optional prefix prepended to the rendered value (e.g. "€"). */
  prefix?: string
  /** Optional suffix appended (e.g. "%"). */
  suffix?: string
  /** Animation duration in seconds. */
  duration?: number
  /** Custom formatter — overrides default Math.round + locale grouping. */
  format?: (n: number) => string
  /** Locale used for thousands separators when no formatter is supplied. */
  locale?: string
  className?: string
}

/**
 * Animates a number from 0 → `to` once the element scrolls into view.
 * Respects prefers-reduced-motion: renders the final value statically.
 *
 * Plan v2.1 W4 D7 + W5.5.
 */
export function CountUp({
  to,
  prefix,
  suffix,
  duration = 1.2,
  format,
  locale,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? to : 0)

  useEffect(() => {
    if (!inView || reduced) return
    // Snap to 0 before animating so the counter starts fresh on viewport entry.
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => setValue(latest),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduced])

  const formatted = format
    ? format(value)
    : new Intl.NumberFormat(locale ?? 'nl-NL', {
        maximumFractionDigits: 0,
      }).format(Math.round(value))

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
