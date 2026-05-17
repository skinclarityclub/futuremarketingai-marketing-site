import { memo } from 'react'

interface LogoProps {
  size?: number
  ariaLabel?: string
}

function LogoMemoryStackComponent({
  size = 34,
  ariaLabel = 'FutureMarketingAI',
}: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 32) / 36}
      viewBox="0 0 36 32"
      role="img"
      aria-label={ariaLabel}
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mem-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7ff5dc" />
          <stop offset="100%" stopColor="#00d4aa" />
        </linearGradient>
        <linearGradient id="mem-mid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00d4aa" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="mem-bot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>
      </defs>

      <rect
        x="3"
        y="22"
        width="30"
        height="5"
        rx="2.5"
        fill="url(#mem-bot)"
        opacity="0.85"
        className="logo-mem-layer logo-mem-layer-3"
      />
      <rect
        x="6"
        y="13"
        width="24"
        height="5"
        rx="2.5"
        fill="url(#mem-mid)"
        opacity="0.92"
        className="logo-mem-layer logo-mem-layer-2"
      />
      <rect
        x="9"
        y="4"
        width="18"
        height="5"
        rx="2.5"
        fill="url(#mem-top)"
        className="logo-mem-layer logo-mem-layer-1"
      />
    </svg>
  )
}

export const LogoMemoryStack = memo(LogoMemoryStackComponent)
