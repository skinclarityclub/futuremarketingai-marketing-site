import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * ConnectionBeam - Premium Bezier curve energy beam with side sparks
 *
 * Features:
 * - Dynamic cubic Bezier curve calculation
 * - Multi-stop gradient energy flow
 * - Drop-shadow glow effects
 * - Canvas-based side sparks
 * - Interactive states (idle, hover, click)
 * - Pulsing intensity effects
 * - Performance optimized rendering
 */

export interface BeamNode {
  x: number // Percentage (0-100)
  y: number // Percentage (0-100)
  color: string
}

export interface ConnectionBeamProps {
  id: string
  from: BeamNode
  to: BeamNode
  intensity?: number // 0-1, controls glow and animation speed
  isInteractive?: boolean // Enable hover/click effects
  onHover?: (id: string | null) => void
  onClick?: (id: string) => void
  className?: string
}

interface BezierPoints {
  startX: number
  startY: number
  cp1X: number
  cp1Y: number
  cp2X: number
  cp2Y: number
  endX: number
  endY: number
}

interface Spark {
  id: number
  t: number // Position along curve (0-1)
  offset: number // Perpendicular offset from curve
  opacity: number
  size: number
  velocity: number
}

/**
 * Calculate cubic Bezier control points for smooth organic curves
 */
function calculateBezierPoints(from: BeamNode, to: BeamNode): BezierPoints {
  const startX = from.x
  const startY = from.y
  const endX = to.x
  const endY = to.y

  // Calculate curve direction and distance
  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Control point offset based on distance (creates organic curves)
  const curvature = Math.min(distance * 0.3, 15) // Max 15% offset

  // Calculate perpendicular vector for control points
  const perpX = -dy / distance
  const perpY = dx / distance

  // First control point - closer to start, offset perpendicular
  const cp1X = startX + dx * 0.25 + perpX * curvature
  const cp1Y = startY + dy * 0.25 + perpY * curvature

  // Second control point - closer to end, offset opposite direction
  const cp2X = startX + dx * 0.75 - perpX * curvature
  const cp2Y = startY + dy * 0.75 - perpY * curvature

  return {
    startX,
    startY,
    cp1X,
    cp1Y,
    cp2X,
    cp2Y,
    endX,
    endY,
  }
}

/**
 * Get point on cubic Bezier curve at t (0-1)
 */
function getBezierPoint(t: number, points: BezierPoints): { x: number; y: number } {
  const { startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY } = points
  const mt = 1 - t
  const mt2 = mt * mt
  const mt3 = mt2 * mt
  const t2 = t * t
  const t3 = t2 * t

  return {
    x: mt3 * startX + 3 * mt2 * t * cp1X + 3 * mt * t2 * cp2X + t3 * endX,
    y: mt3 * startY + 3 * mt2 * t * cp1Y + 3 * mt * t2 * cp2Y + t3 * endY,
  }
}

export const ConnectionBeam: React.FC<ConnectionBeamProps> = ({
  id,
  from,
  to,
  intensity = 0.7,
  isInteractive = true,
  onHover,
  onClick,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [sparks, setSparks] = useState<Spark[]>([])
  const sparkIdCounter = useRef(0)

  // Calculate Bezier points (recalculates when nodes move)
  const bezierPoints = useMemo(() => calculateBezierPoints(from, to), [from, to])

  // Generate SVG path string
  const pathString = useMemo(() => {
    const { startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY } = bezierPoints
    return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
  }, [bezierPoints])

  // Spawn sparks at intervals
  useEffect(() => {
    const spawnInterval = setInterval(
      () => {
        if (sparks.length < 10) {
          // Max 10 sparks per beam
          const newSpark: Spark = {
            id: sparkIdCounter.current++,
            t: 0, // Start at beginning of curve
            offset: (Math.random() - 0.5) * 2, // Random perpendicular offset
            opacity: 0.8,
            size: Math.random() * 0.8 + 0.5,
            velocity: 0.008 + Math.random() * 0.005, // Speed along curve
          }
          setSparks((prev) => [...prev, newSpark])
        }
      },
      1000 + Math.random() * 1000
    ) // Spawn every 1-2 seconds

    return () => clearInterval(spawnInterval)
  }, [sparks.length])

  // Animate sparks along the curve
  useEffect(() => {
    let animationFrame: number

    const animateSparks = () => {
      setSparks(
        (prevSparks) =>
          prevSparks
            .map((spark) => ({
              ...spark,
              t: spark.t + spark.velocity,
              opacity: spark.t > 0.7 ? spark.opacity * 0.95 : spark.opacity, // Fade near end
            }))
            .filter((spark) => spark.t < 1 && spark.opacity > 0.1) // Remove completed sparks
      )

      animationFrame = requestAnimationFrame(animateSparks)
    }

    animateSparks()
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Render sparks on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw each spark
    sparks.forEach((spark) => {
      const point = getBezierPoint(spark.t, bezierPoints)

      // Calculate perpendicular offset
      const nextPoint = getBezierPoint(Math.min(spark.t + 0.01, 1), bezierPoints)
      const dx = nextPoint.x - point.x
      const dy = nextPoint.y - point.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const perpX = (-dy / dist) * spark.offset
      const perpY = (dx / dist) * spark.offset

      const x = point.x + perpX
      const y = point.y + perpY

      // Draw spark with glow
      ctx.save()
      ctx.globalAlpha = spark.opacity
      ctx.shadowBlur = spark.size * 3
      ctx.shadowColor = to.color

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, spark.size * 0.8)
      gradient.addColorStop(0, to.color + 'FF')
      gradient.addColorStop(0.5, to.color + '88')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, spark.size * 0.8, 0, Math.PI * 2)
      ctx.fill()

      // Bright center
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(x, y, spark.size * 0.3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    })
  }, [sparks, bezierPoints, to.color])

  // Handle interactions
  const handleMouseEnter = () => {
    if (!isInteractive) {
      return
    }
    setIsHovered(true)
    onHover?.(id)
  }

  const handleMouseLeave = () => {
    if (!isInteractive) {
      return
    }
    setIsHovered(false)
    onHover?.(null)
  }

  const handleClick = () => {
    if (!isInteractive) {
      return
    }
    onClick?.(id)
  }

  // Dynamic intensity based on interaction
  const currentIntensity = isHovered ? Math.min(intensity + 0.3, 1) : intensity

  return (
    <g className={className}>
      {/* Canvas for side sparks - positioned absolutely */}
      <foreignObject x="0" y="0" width="100" height="100">
        <canvas
          ref={canvasRef}
          width={100}
          height={100}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
      </foreignObject>

      {/* Base glow path */}
      <motion.path
        d={pathString}
        fill="none"
        stroke={to.color}
        strokeWidth={0.8 * currentIntensity}
        strokeOpacity={0.3}
        filter="url(#beamGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Main energy beam with gradient flow */}
      <motion.path
        d={pathString}
        fill="none"
        stroke={`url(#beamGradient-${id})`}
        strokeWidth={0.5 * currentIntensity}
        strokeOpacity={1}
        strokeLinecap="round"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: isInteractive ? 'pointer' : 'default' }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{
          pathLength: { duration: 1.5, ease: 'easeInOut' },
          opacity: { duration: 0.5 },
        }}
        whileHover={isInteractive ? { strokeWidth: 0.7 * currentIntensity } : {}}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id={`beamGradient-${id}`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={from.color} stopOpacity="0.3">
            <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="30%" stopColor={to.color} stopOpacity="1">
            <animate attributeName="offset" values="-0.2;1.8" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="70%" stopColor={to.color} stopOpacity="1">
            <animate attributeName="offset" values="0.2;2.2" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor={to.color} stopOpacity="0">
            <animate attributeName="offset" values="0.5;2.5" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>

        <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </g>
  )
}

export default ConnectionBeam
