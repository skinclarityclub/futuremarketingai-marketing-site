'use client'

import { motion, type Variants } from 'motion/react'
import { Check } from 'lucide-react'
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
 * SpotScarcityGrid — Fase 6 signature experiment for /founding-member.
 *
 * Renders the 10 founding plekken as a 5x2 grid of circular buttons. Filled
 * spots show a check + glow + claimant name on hover. Empty spots have a
 * gentle pulse halo (disabled under reduced-motion via global MotionConfig)
 * and reveal a "claim this" tooltip on hover/focus.
 *
 * The tooltip uses pure CSS visibility tied to hover/focus state — no JS
 * popover lib, zero extra bundle. Keyboard: each spot is a focusable
 * button so the tooltip appears on Tab focus too.
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
      className="grid grid-cols-5 gap-4 sm:gap-5 md:gap-6 max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULT}
    >
      {spots.map(({ position, taken }) => (
        <motion.li
          key={position}
          variants={spotVariants}
          className="relative flex justify-center group"
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
                ? 'spot spot--taken relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent-human text-bg-deep ring-2 ring-accent-human/40 ring-offset-2 ring-offset-bg-deep transition-transform duration-300 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-human cursor-default flex items-center justify-center font-semibold text-sm'
                : 'spot spot--open relative h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-border-primary bg-bg-surface/40 text-text-muted transition-all duration-300 ease-out hover:border-accent-system/60 hover:bg-accent-system/5 hover:text-accent-system hover:scale-110 focus-visible:scale-110 focus-visible:border-accent-system focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-system flex items-center justify-center font-mono text-xs'
            }
            tabIndex={0}
          >
            {taken ? (
              <Check className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
            ) : (
              <span aria-hidden>{String(position).padStart(2, '0')}</span>
            )}
            {!taken && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-accent-system/40 opacity-0 animate-spot-pulse"
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
