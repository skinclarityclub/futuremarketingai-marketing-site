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
  /**
   * When true, subsequent `to` changes animate from the current displayed
   * value (instead of restarting from 0). Use for slider-driven counters
   * where the value transitions smoothly between stops.
   */
  smoothUpdates?: boolean
  /** Shorter duration used for smooth-update transitions (default 0.45s). */
  smoothUpdateDuration?: number
}

/**
 * Animates a number from 0 → `to` once the element scrolls into view.
 * Respects prefers-reduced-motion: renders the final value statically.
 *
 * With `smoothUpdates`, subsequent `to` changes animate from the current
 * displayed value rather than restarting at 0 — feels native for slider
 * driven price/credit counters.
 */
export function CountUp({
  to,
  prefix,
  suffix,
  duration = 1.2,
  format,
  locale,
  className,
  smoothUpdates = false,
  smoothUpdateDuration = 0.45,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  // Start at the target so the server HTML carries the real number: crawlers
  // and AI engines without JS read "€997", not "€0" (site audit inv-03).
  const [animatedValue, setAnimatedValue] = useState(to)
  const valueRef = useRef(to)
  const hasAnimatedRef = useRef(false)
  const armedRef = useRef(false)

  // Count up only for numbers that are still below the fold after hydration;
  // resetting a visible number to 0 would flash. A visible one keeps its value.
  useEffect(() => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      hasAnimatedRef.current = true
      return
    }
    armedRef.current = true
    valueRef.current = 0
    setAnimatedValue(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only check
  }, [])

  useEffect(() => {
    if (reduced) return
    if (!inView) return
    if (!armedRef.current && !hasAnimatedRef.current) return
    if (!armedRef.current && !smoothUpdates) {
      // Visible at mount: no count-up, but follow later `to` changes directly.
      valueRef.current = to
      setAnimatedValue(to)
      return
    }
    armedRef.current = false
    const useSmooth = smoothUpdates && hasAnimatedRef.current
    const from = useSmooth ? valueRef.current : 0
    const dur = useSmooth ? smoothUpdateDuration : duration
    hasAnimatedRef.current = true
    const controls = animate(from, to, {
      duration: dur,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        valueRef.current = latest
        setAnimatedValue(latest)
      },
    })
    return () => controls.stop()
  }, [inView, to, duration, reduced, smoothUpdates, smoothUpdateDuration])

  // Reduced-motion renders the target value statically without entering the
  // animate path.
  const displayValue = reduced ? to : animatedValue
  const formatted = format
    ? format(displayValue)
    : new Intl.NumberFormat(locale ?? 'nl-NL', {
        maximumFractionDigits: 0,
      }).format(Math.round(displayValue))

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
