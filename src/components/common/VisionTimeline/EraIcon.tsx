import React from 'react'
import { motion } from 'framer-motion'
import { TimelineStatus, IconType } from './types'

// ============================================================================
// Props
// ============================================================================

interface EraIconProps {
  icon: IconType
  status: TimelineStatus
}

// ============================================================================
// Component
// ============================================================================

export const EraIcon: React.FC<EraIconProps> = ({ icon, status }) => {
  const isPast = status === 'past'
  const isActive = status === 'active'
  const isFuture = status === 'future'

  // AI-Assisted Era (2020-2023) - Document/Pencil with human collaboration
  if (icon === 'assisted') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="assisted-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isPast ? '#666' : '#00D4FF'} />
            <stop offset="100%" stopColor={isPast ? '#444' : '#0099CC'} />
          </linearGradient>
          <filter id="glass-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* Glassmorphic document background */}
        <rect
          x="30"
          y="20"
          width="60"
          height="80"
          rx="6"
          fill="url(#assisted-grad)"
          opacity="0.15"
          filter="url(#glass-blur)"
        />
        <rect
          x="30"
          y="20"
          width="60"
          height="80"
          rx="6"
          stroke="url(#assisted-grad)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Document lines (text) */}
        <line
          x1="40"
          y1="35"
          x2="80"
          y2="35"
          stroke="url(#assisted-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="40"
          y1="48"
          x2="80"
          y2="48"
          stroke="url(#assisted-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="40"
          y1="61"
          x2="70"
          y2="61"
          stroke="url(#assisted-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Human + AI collaboration symbol (two overlapping circles) */}
        <circle cx="50" cy="80" r="8" fill="url(#assisted-grad)" opacity="0.3" />
        <circle cx="70" cy="80" r="8" fill="url(#assisted-grad)" opacity="0.3" />
        <circle cx="60" cy="80" r="6" fill="url(#assisted-grad)" />
      </svg>
    )
  }

  // Autonomous AI Era (2024-2025) - Neural network with glow
  if (icon === 'autonomous') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="autonomous-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00CC66" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central brain/core */}
        <circle cx="60" cy="60" r="18" fill="url(#autonomous-grad)" opacity="0.2" />
        <circle
          cx="60"
          cy="60"
          r="18"
          stroke="url(#autonomous-grad)"
          strokeWidth="3"
          fill="none"
          filter={isActive ? 'url(#glow)' : ''}
        />
        <circle cx="60" cy="60" r="8" fill="url(#autonomous-grad)" />

        {/* Neural network nodes (8 nodes around center) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const radian = (angle * Math.PI) / 180
          const x = 60 + Math.cos(radian) * 35
          const y = 60 + Math.sin(radian) * 35
          return (
            <g key={i}>
              <line
                x1="60"
                y1="60"
                x2={x}
                y2={y}
                stroke="url(#autonomous-grad)"
                strokeWidth="2"
                opacity="0.4"
              />
              <circle cx={x} cy={y} r="5" fill="url(#autonomous-grad)" opacity="0.8" />
            </g>
          )
        })}

        {/* Pulsating rings for active state */}
        {isActive && (
          <>
            <motion.circle
              cx="60"
              cy="60"
              r="22"
              stroke="url(#autonomous-grad)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              initial={{ r: 18, opacity: 0.3 }}
              animate={{ r: 30, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              cx="60"
              cy="60"
              r="22"
              stroke="url(#autonomous-grad)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              initial={{ r: 18, opacity: 0.3 }}
              animate={{ r: 30, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
            />
          </>
        )}
      </svg>
    )
  }

  // Standard Practice Era (2026+) - Global network/ubiquity
  if (icon === 'standard') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="standard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isFuture ? '#888' : '#8A2BE2'} />
            <stop offset="100%" stopColor={isFuture ? '#666' : '#6A1BC2'} />
          </linearGradient>
        </defs>

        {/* Globe/Earth */}
        <circle cx="60" cy="60" r="35" fill="url(#standard-grad)" opacity="0.1" />
        <circle cx="60" cy="60" r="35" stroke="url(#standard-grad)" strokeWidth="2.5" fill="none" />

        {/* Latitude lines */}
        <ellipse
          cx="60"
          cy="60"
          rx="35"
          ry="12"
          stroke="url(#standard-grad)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="35"
          ry="24"
          stroke="url(#standard-grad)"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Longitude lines */}
        <ellipse
          cx="60"
          cy="60"
          rx="12"
          ry="35"
          stroke="url(#standard-grad)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="24"
          ry="35"
          stroke="url(#standard-grad)"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Connection nodes (global adoption) */}
        {[
          { cx: 40, cy: 40 },
          { cx: 80, cy: 40 },
          { cx: 40, cy: 80 },
          { cx: 80, cy: 80 },
          { cx: 60, cy: 32 },
          { cx: 60, cy: 88 },
          { cx: 32, cy: 60 },
          { cx: 88, cy: 60 },
        ].map((node, i) => (
          <circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="3.5"
            fill="url(#standard-grad)"
            opacity="0.8"
          />
        ))}

        {/* Center hub */}
        <circle cx="60" cy="60" r="6" fill="url(#standard-grad)" />
      </svg>
    )
  }

  return null
}
