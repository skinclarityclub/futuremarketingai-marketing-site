import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

/**
 * Fold — single elegant cortex-fold suggestion.
 *
 * Concept: instead of drawing a brain, draw the ESSENCE of a brain — the
 * gyrus fold. A single Ω-like curve, geometrically constructed, no
 * anatomy. The amber dot sits inside the fold's basin: the synapse.
 *
 * Pure teal stroke, single amber dot. Stroke-linecap round for craft.
 * One subtle motion: the dot breathes inside its enclosure.
 */
function LogoFoldComponent({ size = 32, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={ariaLabel}
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer fold — a sweeping arch with internal lobes (Ω-like) */}
      <path
        d="M 4 24
           Q 4 8 12 8
           Q 18 8 18 16
           Q 18 22 14 22
           Q 10 22 10 18
           Q 10 14 14 14
           Q 22 14 22 8
           Q 22 4 28 8"
        fill="none"
        stroke="#00d4aa"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Synapse dot — amber, inside the inner basin */}
      <circle
        cx="14"
        cy="18"
        r="3"
        fill="#f5a623"
        opacity="0.32"
        className="logo-fold-halo"
      />
      <circle
        cx="14"
        cy="18"
        r="1.8"
        fill="#f5a623"
        className="logo-fold-dot"
      />
    </svg>
  )
}

export const LogoFold = memo(LogoFoldComponent)
