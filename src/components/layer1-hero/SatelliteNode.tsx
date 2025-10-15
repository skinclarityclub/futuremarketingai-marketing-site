import React from 'react'
import { motion } from 'framer-motion'

/**
 * SatelliteNode - Enhanced glassmorphic node with orbital particles
 *
 * Features:
 * - Glassmorphic center with backdrop blur
 * - Three concentric animated rings
 * - Floating SVG icon/symbol
 * - Orbital particle system integration
 * - Rich interaction states (hover, click, focus)
 * - Full accessibility support
 */

interface SatelliteNodeProps {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  x: number
  y: number
  color: string
  isHovered?: boolean
  isSelected?: boolean
  onHover?: (id: string | null) => void
  onClick?: (id: string) => void
}

export const SatelliteNode: React.FC<SatelliteNodeProps> = ({
  id,
  label,
  description,
  icon,
  x,
  y,
  color,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
}) => {
  const isHighlighted = isHovered || isSelected

  return (
    <g
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(id)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${description}`}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* Outer Ring - Counter-rotating */}
      <motion.circle
        cx={x}
        cy={y}
        r="6"
        fill="none"
        stroke={color}
        strokeWidth="0.3"
        strokeOpacity="0.5"
        strokeDasharray="1 1"
        style={{ pointerEvents: 'none' }}
        animate={{
          rotate: isHighlighted ? [0, 360] : [0, -360],
          scale: isHighlighted ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 2,
            repeat: isHighlighted ? Infinity : 0,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Middle Ring - Counter-rotating opposite direction */}
      <motion.circle
        cx={x}
        cy={y}
        r="5"
        fill="none"
        stroke={color}
        strokeWidth="0.25"
        strokeOpacity="0.6"
        strokeDasharray="2 1"
        style={{ pointerEvents: 'none' }}
        animate={{
          rotate: isHighlighted ? [0, -360] : [0, 360],
          scale: isHighlighted ? [1, 1.05, 1] : 1,
        }}
        transition={{
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 2.5,
            repeat: isHighlighted ? Infinity : 0,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Inner Ring - Breathing effect */}
      <motion.circle
        cx={x}
        cy={y}
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="0.2"
        strokeOpacity="0.7"
        style={{ pointerEvents: 'none' }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glassmorphic Center - Using SVG filters for blur effect */}
      <defs>
        <filter id={`glassmorphic-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0"
            result="transparent"
          />
          <feMerge>
            <feMergeNode in="transparent" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id={`gradient-${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="50%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </radialGradient>

        <filter id={`drop-shadow-${id}`}>
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={color} floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Glassmorphic Background Circle */}
      <motion.circle
        cx={x}
        cy={y}
        r="3.5"
        fill={`url(#gradient-${id})`}
        stroke={color}
        strokeWidth={isHighlighted ? '0.4' : '0.3'}
        strokeOpacity="0.8"
        filter={`url(#glassmorphic-${id}) url(#drop-shadow-${id})`}
        style={{ pointerEvents: 'none' }}
        animate={{
          scale: isHighlighted ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />

      {/* Icon Container with Floating Animation */}
      <motion.g
        style={{ pointerEvents: 'none' }}
        animate={{
          y: [0, -0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Icon Symbol - rendered as SVG foreignObject for React nodes */}
        <foreignObject
          x={x - 1.5}
          y={y - 1.5}
          width="3"
          height="3"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <motion.div
            className="flex items-center justify-center w-full h-full"
            style={{
              color: color,
              filter: `drop-shadow(0 0 4px ${color})`,
              pointerEvents: 'none',
            }}
            animate={{
              scale: isHighlighted ? 1.15 : 1,
              rotate: isHighlighted ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              scale: { type: 'spring', stiffness: 400, damping: 15 },
              rotate: {
                duration: 0.5,
                repeat: isHighlighted ? Infinity : 0,
                repeatDelay: 1,
              },
            }}
          >
            {icon}
          </motion.div>
        </foreignObject>
      </motion.g>

      {/* Invisible hit area for better touch/click targets */}
      <circle cx={x} cy={y} r="8" fill="transparent" pointerEvents="all" />

      {/* Node Label - positioned above nodes */}
      <text
        x={x}
        y={y - 9}
        textAnchor="middle"
        dominantBaseline="alphabetic"
        fill="#FFFFFF"
        fontSize="2.5"
        fontWeight="500"
        className="font-display"
        style={{
          pointerEvents: 'none',
          opacity: 1,
          transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
          transformOrigin: 'center',
          transition: 'transform 0.2s ease',
        }}
      >
        {label}
      </text>

      {/* Focus Indicator Ring */}
      <motion.circle
        cx={x}
        cy={y}
        r="7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.3"
        strokeOpacity="0"
        style={{ pointerEvents: 'none' }}
        animate={{
          strokeOpacity: isSelected ? 0.8 : 0,
          scale: isSelected ? [1, 1.05, 1] : 1,
        }}
        transition={{
          strokeOpacity: { duration: 0.2 },
          scale: {
            duration: 1.5,
            repeat: isSelected ? Infinity : 0,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Orbital Particles - Tornado Effect (only when hovered/selected) */}
      {isHighlighted && (
        <>
          {[...Array(12)].map((_, i) => {
            const baseAngle = (i / 12) * 360
            const orbitRadius = 6 // Match outer ring

            return (
              <g key={`particle-${i}`}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="0.5"
                  fill={color}
                  style={{
                    pointerEvents: 'none',
                    filter: `drop-shadow(0 0 3px ${color})`,
                  }}
                  animate={{
                    cx: [
                      x + Math.cos((baseAngle * Math.PI) / 180) * orbitRadius,
                      x + Math.cos(((baseAngle + 360) * Math.PI) / 180) * orbitRadius,
                    ],
                    cy: [
                      y + Math.sin((baseAngle * Math.PI) / 180) * orbitRadius,
                      y + Math.sin(((baseAngle + 360) * Math.PI) / 180) * orbitRadius,
                    ],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: 'linear',
                  }}
                />

                {/* Motion trail for enhanced effect */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="0.3"
                  fill={color}
                  style={{
                    pointerEvents: 'none',
                  }}
                  animate={{
                    cx: [
                      x + Math.cos((baseAngle * Math.PI) / 180) * orbitRadius,
                      x + Math.cos(((baseAngle + 360) * Math.PI) / 180) * orbitRadius,
                    ],
                    cy: [
                      y + Math.sin((baseAngle * Math.PI) / 180) * orbitRadius,
                      y + Math.sin(((baseAngle + 360) * Math.PI) / 180) * orbitRadius,
                    ],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.08 + 0.1,
                    ease: 'linear',
                  }}
                />
              </g>
            )
          })}
        </>
      )}
    </g>
  )
}

export default SatelliteNode
