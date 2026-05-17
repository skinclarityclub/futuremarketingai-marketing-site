import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

function LogoFMarkComponent({ size = 30, ariaLabel = 'FutureMarketingAI' }: LogoProps) {
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
      <defs>
        <linearGradient id="fmark-stem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ff5dc" />
          <stop offset="55%" stopColor="#00d4aa" />
          <stop offset="100%" stopColor="#0a8d72" />
        </linearGradient>
        <radialGradient id="fmark-dot-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4d6" />
          <stop offset="50%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#c47410" />
        </radialGradient>
        <filter id="fmark-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      <g fill="url(#fmark-stem)">
        <rect x="6" y="4" width="4.5" height="24" rx="1.6" />
        <rect x="6" y="4" width="18" height="4.5" rx="1.6" />
        <rect x="6" y="14" width="13" height="4.5" rx="1.6" />
      </g>
      <circle
        cx="24"
        cy="25"
        r="4.2"
        fill="#f5a623"
        opacity="0.45"
        filter="url(#fmark-dot-glow)"
        className="logo-fmark-dot-halo"
      />
      <circle
        cx="24"
        cy="25"
        r="2.6"
        fill="url(#fmark-dot-fill)"
        className="logo-fmark-dot"
      />
    </svg>
  )
}

export const LogoFMark = memo(LogoFMarkComponent)
