'use client'

import Image from 'next/image'
import { motion, type Variants } from 'motion/react'
import {
  EASE_OUT,
  STAGGER_FAST,
  VIEWPORT_DEFAULT,
} from '@/lib/motion/easings'

export interface TakenSpot {
  /** 1-indexed spot position (1..total). */
  position: number
  /** Display label inside the tooltip (e.g. "SkinClarity Club"). */
  name: string
  /** Secondary line in tooltip (e.g. "Founding partner sinds Q4 2025"). */
  since: string
  /** Optional brand emblem path (e.g. "/brand/skc-emblem.png"). */
  emblem?: string
}

interface SpotScarcityGridProps {
  total: number
  takenSpots: readonly TakenSpot[]
  /** Tooltip body for empty spots (e.g. "Deze spot kan voor jouw bureau zijn"). */
  openLabel: string
  /** Tooltip header for empty spots (e.g. "Founding plek beschikbaar"). */
  openHeading: string
  /** Aria-label for the grid container. */
  ariaLabel: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_FAST, delayChildren: 0.05 } },
}

const spotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
}

/**
 * SpotScarcityGrid — /founding-member signature experiment.
 *
 * 5x2 grid of rounded-2xl tiles representing the 10 founding plekken.
 * Filled tiles display the partner's brand emblem on a brand-accent backdrop;
 * open tiles show a prominent position number with a pulse halo. Tooltip on
 * hover/focus reveals partner-name + since-line (or claim-this prompt).
 */
export function SpotScarcityGrid({
  total,
  takenSpots,
  openLabel,
  openHeading,
  ariaLabel,
}: SpotScarcityGridProps) {
  const takenByPosition = new Map<number, TakenSpot>(
    takenSpots.map((spot) => [spot.position, spot]),
  )

  const spots = Array.from({ length: total }, (_, idx) => {
    const position = idx + 1
    const taken = takenByPosition.get(position)
    return { position, taken }
  })

  return (
    <motion.ul
      aria-label={ariaLabel}
      role="list"
      className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULT}
    >
      {spots.map(({ position, taken }) => (
        <motion.li
          key={position}
          variants={spotVariants}
          className="relative group"
        >
          <button
            type="button"
            aria-label={
              taken
                ? `${taken.name}, ${taken.since}`
                : `${openHeading}: ${openLabel}`
            }
            aria-describedby={`spot-${position}-tip`}
            className={
              taken
                ? 'relative aspect-square w-full rounded-2xl bg-[#127059] ring-2 ring-[#127059]/40 ring-offset-2 ring-offset-bg-deep transition-transform duration-300 ease-out hover:scale-105 focus-visible:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-human cursor-default flex items-center justify-center overflow-hidden'
                : 'relative aspect-square w-full rounded-2xl border-2 border-border-primary bg-bg-surface/40 text-text-muted transition-all duration-300 ease-out hover:border-accent-system/60 hover:bg-accent-system/5 hover:text-accent-system hover:scale-105 focus-visible:scale-105 focus-visible:border-accent-system focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-system flex items-center justify-center font-mono text-sm sm:text-base font-semibold'
            }
            tabIndex={0}
          >
            {taken ? (
              taken.emblem ? (
                <Image
                  src={taken.emblem}
                  alt={`${taken.name} logo`}
                  width={48}
                  height={48}
                  className="h-3/5 w-3/5 object-contain"
                  // Sole/first <img> on /founding-member. priority removes the
                  // default loading="lazy" so the page's first image is eager
                  // (LCP_LAZY_LOADING). Single small emblem — perf-safe.
                  // Descriptive alt (partner name) instead of decorative ""
                  // so crawlers don't flag ALT_MISSING; the wrapping <button>'s
                  // aria-label still owns the SR accessible name (aria-label
                  // overrides nested alt), so no double-announce.
                  priority
                />
              ) : (
                <span className="text-white font-bold text-lg" aria-hidden>
                  {taken.name.charAt(0)}
                </span>
              )
            ) : (
              <span aria-hidden>{String(position).padStart(2, '0')}</span>
            )}
            {!taken && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-accent-system/40 opacity-0 animate-spot-pulse"
              />
            )}
          </button>
          <div
            id={`spot-${position}-tip`}
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-56 sm:w-64 -translate-x-1/2 rounded-xl border border-border-primary bg-bg-elevated/95 backdrop-blur px-4 py-3 text-center shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ease-out"
          >
            {taken ? (
              <>
                <p className="text-sm font-semibold text-text-primary">{taken.name}</p>
                <p className="text-xs text-text-muted mt-1">{taken.since}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-accent-system">{openHeading}</p>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{openLabel}</p>
              </>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}
