import React from 'react'
import { motion } from 'framer-motion'

// ============================================================================
// Props
// ============================================================================

interface TimelineConnectorProps {
  isVertical?: boolean
}

// ============================================================================
// Component
// ============================================================================

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({ isVertical = false }) => {
  if (isVertical) {
    // Mobile: Vertical connector
    return (
      <div className="flex justify-center" role="presentation" aria-hidden="true">
        <div className="relative w-1 h-16">
          {/* Background line */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 rounded-full" />

          {/* Animated flowing gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent rounded-full"
            animate={{
              y: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Arrow */}
          <svg
            viewBox="0 0 20 20"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 text-cyan-400"
            fill="currentColor"
          >
            <path d="M10 15 L5 10 L7 10 L10 13 L13 10 L15 10 Z" />
          </svg>
        </div>
      </div>
    )
  }

  // Desktop: Horizontal connector with animated flow
  return (
    <div
      className="flex items-center justify-center w-16 lg:w-24"
      role="presentation"
      aria-hidden="true"
    >
      <div className="relative w-full h-1">
        {/* Background line */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-full" />

        {/* Animated flowing gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rounded-full"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Arrow */}
        <svg
          viewBox="0 0 20 20"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400"
          fill="currentColor"
        >
          <path d="M15 10 L10 5 L10 7 L13 10 L10 13 L10 15 Z" />
        </svg>
      </div>
    </div>
  )
}
