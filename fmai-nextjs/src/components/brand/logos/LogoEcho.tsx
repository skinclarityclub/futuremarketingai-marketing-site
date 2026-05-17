import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

/**
 * Echo — two asymmetric crescent lenses, AI × human dialogue.
 *
 * Concept: top crescent (teal, AI) and bottom crescent (amber, human) face
 * each other across a 2px negative-space midline. They breathe toward and
 * away from each other (1px max). Reads as partnership without literal
 * handshake/brain metaphors. Pure colors, no gradient.
 */
function LogoEchoComponent({ size = 32, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 28) / 32}
      viewBox="0 0 32 28"
      role="img"
      aria-label={ariaLabel}
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top crescent — AI */}
      <path
        d="M 6 13 Q 16 3 26 13 Q 16 8 6 13 Z"
        fill="#00d4aa"
        className="logo-echo-top"
      />

      {/* Bottom crescent — human */}
      <path
        d="M 6 15 Q 16 25 26 15 Q 16 20 6 15 Z"
        fill="#f5a623"
        className="logo-echo-bottom"
      />
    </svg>
  )
}

export const LogoEcho = memo(LogoEchoComponent)
