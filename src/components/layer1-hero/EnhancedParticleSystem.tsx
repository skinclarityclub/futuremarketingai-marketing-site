import React, { useEffect, useRef } from 'react'

/**
 * EnhancedParticleSystem - Advanced 500+ particle engine
 *
 * Features:
 * - 100+ ambient background particles
 * - 200 data stream particles (50 per connection)
 * - Object pooling for performance
 * - Motion blur trails
 * - Velocity-based physics
 * - Offscreen culling
 */

interface Module {
  x: number // Target position (edge of satellite)
  y: number // Target position (edge of satellite)
  color: string
  startX?: number // Optional: start position (edge of core)
  startY?: number // Optional: start position (edge of core)
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: 'ambient' | 'stream' | 'orbital' | 'burst'
  age: number
  maxAge: number
  startX?: number // Starting position (edge of core)
  startY?: number // Starting position (edge of core)
  targetX?: number
  targetY?: number
  progress?: number
  speed?: number
  trail?: Array<{ x: number; y: number; opacity: number }>
}

interface ParticleSystemProps {
  modules: Module[]
  corePosition: { x: number; y: number }
  width: number
  height: number
}

export const EnhancedParticleSystem: React.FC<ParticleSystemProps> = ({
  modules,
  corePosition,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  // Initialize particles - ONLY ON-PATH ENERGY BEAMS
  useEffect(() => {
    const particles: Particle[] = []

    // ENERGY BEAM PARTICLES - flowing along connection lines
    // More particles per connection for visible energy flow
    modules.forEach((module) => {
      // Use custom start position if provided, otherwise use core center
      const startX = module.startX !== undefined ? module.startX : corePosition.x
      const startY = module.startY !== undefined ? module.startY : corePosition.y

      for (let i = 0; i < 25; i++) {
        particles.push({
          x: startX,
          y: startY,
          startX: startX, // Store start position for reset
          startY: startY, // Store start position for reset
          vx: 0,
          vy: 0,
          size: 2 + Math.random() * 1.5, // Larger, visible energy particles
          opacity: 0.6 + Math.random() * 0.4, // Bright (60-100%)
          color: module.color,
          type: 'stream',
          age: 0,
          maxAge: 100 + Math.random() * 50,
          targetX: module.x,
          targetY: module.y,
          progress: i / 25, // Evenly distributed along path
          speed: 0.004 + Math.random() * 0.002, // Varied speed for organic feel
          trail: [],
        })
      }
    })

    particlesRef.current = particles
  }, [modules, corePosition, width, height])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    canvas.width = width
    canvas.height = height

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((particle) => {
        // Update particle - only stream type now
        updateStreamParticle(particle, corePosition)

        // Render particle with trail for energy beam effect
        renderParticleWithTrail(ctx, particle)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [width, height, corePosition])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  )
}

// Particle update functions
function updateStreamParticle(particle: Particle, corePosition: { x: number; y: number }) {
  if (
    !particle.targetX ||
    !particle.targetY ||
    particle.progress === undefined ||
    !particle.speed
  ) {
    return
  }

  // Update progress along path
  particle.progress += particle.speed

  if (particle.progress > 1) {
    // Reset to start (use stored start position if available)
    particle.progress = 0
    particle.x = particle.startX !== undefined ? particle.startX : corePosition.x
    particle.y = particle.startY !== undefined ? particle.startY : corePosition.y
    if (particle.trail) {
      particle.trail = []
    }
  }

  // Ease-in-out for smooth acceleration/deceleration
  const eased = easeInOutCubic(particle.progress)

  // Calculate position using particle's start position
  const startPosX = particle.startX !== undefined ? particle.startX : corePosition.x
  const startPosY = particle.startY !== undefined ? particle.startY : corePosition.y
  const newX = startPosX + (particle.targetX - startPosX) * eased
  const newY = startPosY + (particle.targetY - startPosY) * eased

  // Add to trail (energy beam effect)
  if (particle.trail) {
    particle.trail.push({
      x: particle.x,
      y: particle.y,
      opacity: particle.opacity * 0.7,
    })

    // Longer trail for energy beam effect (8 frames)
    if (particle.trail.length > 8) {
      particle.trail.shift()
    }
  }

  particle.x = newX
  particle.y = newY
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Particle rendering functions
function renderParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
  // Subtle glow for visibility
  const gradient = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.size * 1.5
  )

  const alpha = Math.floor(particle.opacity * 255)
    .toString(16)
    .padStart(2, '0')
  const alphaGlow = Math.floor(particle.opacity * 0.5 * 255)
    .toString(16)
    .padStart(2, '0')

  gradient.addColorStop(0, particle.color + alpha)
  gradient.addColorStop(0.6, particle.color + alphaGlow)
  gradient.addColorStop(1, particle.color + '00')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2)
  ctx.fill()
}

function renderParticleWithTrail(ctx: CanvasRenderingContext2D, particle: Particle) {
  // Render energy beam trail for motion
  if (particle.trail && particle.trail.length > 0) {
    particle.trail.forEach((point, index) => {
      const trailOpacity = (index / particle.trail!.length) * point.opacity * 0.6
      const trailSize = particle.size * (0.6 + (index / particle.trail!.length) * 0.4)

      // Glow effect for energy beam
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        trailSize * 1.5
      )

      const alpha = Math.floor(trailOpacity * 255)
        .toString(16)
        .padStart(2, '0')
      const alphaGlow = Math.floor(trailOpacity * 0.4 * 255)
        .toString(16)
        .padStart(2, '0')

      gradient.addColorStop(0, particle.color + alpha)
      gradient.addColorStop(0.6, particle.color + alphaGlow)
      gradient.addColorStop(1, particle.color + '00')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, trailSize * 1.5, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // Render main particle (brighter)
  renderParticle(ctx, particle)
}

export default EnhancedParticleSystem
