import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

function LogoKnotComponent({ size = 38, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 32) / 40}
      viewBox="0 0 40 32"
      role="img"
      aria-label={ariaLabel}
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="knot-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00d4aa" />
          <stop offset="45%" stopColor="#7ff5dc" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>
        <filter id="knot-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      <path
        d="M 6 16 C 6 6 14 6 20 16 C 26 26 34 26 34 16 C 34 6 26 6 20 16 C 14 26 6 26 6 16 Z"
        fill="none"
        stroke="url(#knot-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.32"
        filter="url(#knot-glow)"
      />

      <path
        d="M 6 16 C 6 6 14 6 20 16 C 26 26 34 26 34 16 C 34 6 26 6 20 16 C 14 26 6 26 6 16 Z"
        fill="none"
        stroke="url(#knot-grad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="logo-knot-stroke"
      />

      <circle cx="20" cy="16" r="1.6" fill="#ffffff" className="logo-knot-center" />
    </svg>
  )
}

export const LogoKnot = memo(LogoKnotComponent)
