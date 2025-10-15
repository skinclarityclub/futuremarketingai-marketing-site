import React, { useEffect, useRef } from 'react'

/**
 * OrbitalParticles - Particle system for SatelliteNode orbital effects
 *
 * Features:
 * - Particles orbit around a central point
 * - Multiple orbital rings with different speeds
 * - Color-matched to parent node
 * - Smooth fade in/out based on distance
 * - Performance optimized with canvas
 */

interface OrbitalParticlesProps {
  x: number // Center X (percentage)
  y: number // Center Y (percentage)
  color: string
  isActive?: boolean
  particleCount?: number
  orbitRadius?: number // Base radius in percentage
  containerWidth: number
  containerHeight: number
}

interface OrbitalParticle {
  angle: number
  radius: number
  speed: number
  size: number
  opacity: number
  orbitOffset: number // Slight variation in orbit
}

export const OrbitalParticles: React.FC<OrbitalParticlesProps> = ({
  x,
  y,
  color,
  isActive = true,
  particleCount = 12,
  orbitRadius = 8,
  containerWidth,
  containerHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<OrbitalParticle[]>([])
  const animationFrameRef = useRef<number>()

  // Convert percentage to pixels
  // IMPORTANT: Use containerWidth for X-axis scaling to match SVG viewBox behavior
  const centerX = (x / 100) * containerWidth
  const centerY = (y / 100) * containerHeight
  const baseRadius = (orbitRadius / 100) * containerWidth // Use containerWidth for consistent scaling

  // Initialize orbital particles
  useEffect(() => {
    const particles: OrbitalParticle[] = []

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles evenly around the orbit
      const baseAngle = (i / particleCount) * Math.PI * 2

      particles.push({
        angle: baseAngle,
        radius: baseRadius + (Math.random() - 0.5) * 10, // Slight radius variation
        speed: 0.01 + Math.random() * 0.015, // Varied orbital speed
        size: 1 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.4,
        orbitOffset: (Math.random() - 0.5) * 5, // Slight orbital path variation
      })
    }

    particlesRef.current = particles
  }, [particleCount, baseRadius])

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

    canvas.width = containerWidth
    canvas.height = containerHeight

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight)

      if (!isActive) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      particlesRef.current.forEach((particle) => {
        // Update angle for orbital motion
        particle.angle += particle.speed

        // Calculate position on orbital path
        const currentRadius = particle.radius + particle.orbitOffset * Math.sin(particle.angle * 2)
        const px = centerX + Math.cos(particle.angle) * currentRadius
        const py = centerY + Math.sin(particle.angle) * currentRadius

        // Distance-based opacity fade
        const distanceFromCenter = Math.sqrt(Math.pow(px - centerX, 2) + Math.pow(py - centerY, 2))
        const normalizedDistance = distanceFromCenter / baseRadius
        const fadeFactor = Math.sin(normalizedDistance * Math.PI) // Smooth fade

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity * fadeFactor
        ctx.fillStyle = color
        ctx.shadowBlur = 4
        ctx.shadowColor = color

        ctx.beginPath()
        ctx.arc(px, py, particle.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        // Draw subtle trail (motion blur)
        const prevAngle = particle.angle - particle.speed * 2
        const prevRadius = particle.radius + particle.orbitOffset * Math.sin(prevAngle * 2)
        const prevX = centerX + Math.cos(prevAngle) * prevRadius
        const prevY = centerY + Math.sin(prevAngle) * prevRadius

        ctx.save()
        ctx.globalAlpha = particle.opacity * fadeFactor * 0.3
        ctx.strokeStyle = color
        ctx.lineWidth = particle.size * 0.8
        ctx.lineCap = 'round'

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(px, py)
        ctx.stroke()

        ctx.restore()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [centerX, centerY, baseRadius, color, isActive, containerWidth, containerHeight])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 15,
      }}
      aria-hidden="true"
    />
  )
}

export default OrbitalParticles
