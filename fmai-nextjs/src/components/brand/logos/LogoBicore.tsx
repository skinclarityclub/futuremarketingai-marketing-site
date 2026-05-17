import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

/**
 * Bicore — two asymmetric hemispheres, AI × human as brain duality.
 *
 * Concept: brain reduced to its most essential structural truth — two
 * hemispheres separated by a fissure. No gyri, no anatomy. Left teal,
 * right amber. The 2px gap is the corpus callosum: where they meet.
 *
 * Asymmetric: right hemisphere is 1px taller (intentional optical
 * imbalance, like real brain morphology — never perfectly symmetrical).
 */
function LogoBicoreComponent({ size = 32, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
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
      {/* Left hemisphere — teal (AI / system) */}
      <path
        d="M 15 7 A 9 9 0 0 0 15 25 Q 14 16 15 7 Z"
        fill="#00d4aa"
        className="logo-bicore-left"
      />

      {/* Right hemisphere — amber (human / partnership), 1px taller for asymmetry */}
      <path
        d="M 17 6 A 9.5 9.5 0 0 1 17 26 Q 18 16 17 6 Z"
        fill="#f5a623"
        className="logo-bicore-right"
      />
    </svg>
  )
}

export const LogoBicore = memo(LogoBicoreComponent)
