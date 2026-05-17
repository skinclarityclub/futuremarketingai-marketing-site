import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

/**
 * Atlas — modular F-grid.
 *
 * Concept: F built from 7 discrete 5×5 cells on a 6.5px pitch.
 * Construction-principle visible (Mistral's modular M, Cohere's cells).
 * Pure colors, no gradient. One amber cell at top-right reads as both
 * "AI accent" and "future direction" (Western reading: top-right = forward).
 */
function LogoAtlasComponent({ size = 30, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
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
      {/* Top bar — 3 cells */}
      <rect x="3" y="3" width="5" height="5" rx="1" fill="#00d4aa" />
      <rect x="10" y="3" width="5" height="5" rx="1" fill="#00d4aa" />
      <rect
        x="17"
        y="3"
        width="5"
        height="5"
        rx="1"
        fill="#f5a623"
        className="logo-atlas-accent"
      />

      {/* Mid bar — 2 cells */}
      <rect x="3" y="11" width="5" height="5" rx="1" fill="#00d4aa" />
      <rect x="10" y="11" width="5" height="5" rx="1" fill="#00d4aa" />

      {/* Stem — 2 cells */}
      <rect x="3" y="19" width="5" height="5" rx="1" fill="#00d4aa" />
      <rect x="3" y="27" width="5" height="5" rx="1" fill="#00d4aa" />
    </svg>
  )
}

export const LogoAtlas = memo(LogoAtlasComponent)
