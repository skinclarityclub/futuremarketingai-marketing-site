import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

/**
 * Bracket — F as open frame, AI-accent in negative space.
 *
 * Concept: F reduced to its essential three strokes, pure teal, no gradient.
 * The "missing" bottom-right of the F becomes intentional negative space —
 * occupied by a single amber dot. Anthropic-style hidden mark (the dot is
 * positioned exactly where the F's optical center-of-gravity sits).
 *
 * Pure colors. Subtle dot pulse is the only motion.
 */
function LogoBracketComponent({ size = 28, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 32) / 28}
      viewBox="0 0 28 32"
      role="img"
      aria-label={ariaLabel}
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* F — pure teal, three rounded strokes */}
      <g fill="#00d4aa">
        {/* Vertical stem (5 wide for optical balance with horizontals) */}
        <rect x="3" y="3" width="5" height="26" rx="1.6" />
        {/* Top bar — extends 14 right of stem-end */}
        <rect x="3" y="3" width="19" height="5" rx="1.6" />
        {/* Mid bar — 4px shorter than top for proportion (optical truth) */}
        <rect x="3" y="14" width="14" height="5" rx="1.6" />
      </g>

      {/* AI-accent: amber dot in the negative space where the F's
          missing bottom bar would be. Anthropic-style hidden ligature. */}
      <circle
        cx="20"
        cy="26"
        r="3.4"
        fill="#f5a623"
        opacity="0.32"
        className="logo-bracket-halo"
      />
      <circle
        cx="20"
        cy="26"
        r="2"
        fill="#f5a623"
        className="logo-bracket-dot"
      />
    </svg>
  )
}

export const LogoBracket = memo(LogoBracketComponent)
