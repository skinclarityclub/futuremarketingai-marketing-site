import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

/**
 * Synapse — four-node neural fragment.
 *
 * Concept: brain reduced to a single firing fragment — four nodes, three
 * connections. The minimum visual unit of "thinking". Designer-level
 * neural network suggestion without literally drawing one (no spider web,
 * no chip pattern). One node is amber: the firing synapse, the AI thought.
 *
 * Construction: nodes on an implicit 8px grid. Lines are 1px hairlines
 * for premium feel (heavier strokes read as cheap diagram).
 */
function LogoSynapseComponent({ size = 32, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
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
      {/* Connections — 1px hairlines, render before nodes */}
      <g stroke="#00d4aa" strokeWidth="1" strokeLinecap="round" opacity="0.55">
        <line x1="8" y1="8" x2="16" y2="16" />
        <line x1="16" y1="16" x2="24" y2="8" />
        <line x1="16" y1="16" x2="22" y2="26" />
      </g>

      {/* Firing line — amber, animated dash to suggest pulse */}
      <line
        x1="16"
        y1="16"
        x2="24"
        y2="8"
        stroke="#f5a623"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="logo-synapse-fire"
      />

      {/* Nodes — teal except the firing one */}
      <circle cx="8" cy="8" r="2.4" fill="#00d4aa" />
      <circle cx="16" cy="16" r="2.4" fill="#00d4aa" />
      <circle cx="22" cy="26" r="2.4" fill="#00d4aa" />

      {/* Firing node — amber, the AI synapse */}
      <circle
        cx="24"
        cy="8"
        r="3.2"
        fill="#f5a623"
        opacity="0.32"
        className="logo-synapse-halo"
      />
      <circle
        cx="24"
        cy="8"
        r="2.4"
        fill="#f5a623"
        className="logo-synapse-node"
      />
    </svg>
  )
}

export const LogoSynapse = memo(LogoSynapseComponent)
