/**
 * ParticleTypes - Four distinct particle behaviors
 * 1. Ambient - Passive floating particles
 * 2. DataStream - Velocity-based physics with motion blur
 * 3. Orbital - Elliptical path particles
 * 4. Burst - Rapid dispersal events
 */

import type { Particle } from './ParticlePool'
import { random, lerp, normalizeAngle } from './particleUtils'

/**
 * Color palettes for different particle types
 */
// Realistic starfield colors - mostly white with subtle variations
export const PARTICLE_COLORS = {
  ambient: ['#FFFFFF', '#F8F9FF', '#F0F4FF', '#E8EFFF', '#FFFFFF', '#FFFFFF'], // Mostly pure white
  dataStream: ['#F5F8FF', '#F0F3FF', '#EDF2FF', '#F8FAFF'], // Very subtle variations
  orbital: ['#FFFFFF', '#F5F7FF', '#EFF3FF', '#FAFBFF'], // Nearly white
  burst: ['#FFFFFF', '#FFFFFF', '#F8F9FF', '#FAFBFF'], // Pure white twinkles
} as const

/**
 * Base interface for particle behavior
 */
export interface ParticleBehavior {
  update(particle: Particle, deltaTime: number, canvas: { width: number; height: number }): void
  initialize(particle: Particle, canvas: { width: number; height: number }): void
}

/**
 * AMBIENT PARTICLES
 * Float passively with gentle Perlin noise-like movement
 */
export class AmbientParticleBehavior implements ParticleBehavior {
  private noiseOffset = Math.random() * 1000

  initialize(particle: Particle, canvas: { width: number; height: number }): void {
    particle.x = random(0, canvas.width)
    particle.y = random(0, canvas.height)
    particle.vx = random(-0.1, 0.1) // Very slow drift for stars
    particle.vy = random(-0.1, 0.1)

    // More variation in star sizes - mostly small with some brighter ones
    const sizeRoll = Math.random()
    if (sizeRoll < 0.7) {
      particle.size = random(0.5, 1.2) // Tiny distant stars (70%)
    } else if (sizeRoll < 0.95) {
      particle.size = random(1.2, 2) // Medium stars (25%)
    } else {
      particle.size = random(2, 3) // Bright stars (5%)
    }

    particle.maxLife = random(15, 30) // Very long lifespan
    particle.opacity = random(0.4, 0.7) // More visible stars
    particle.color =
      PARTICLE_COLORS.ambient[Math.floor(Math.random() * PARTICLE_COLORS.ambient.length)]
  }

  update(particle: Particle, deltaTime: number, canvas: { width: number; height: number }): void {
    // Increment life
    particle.life += deltaTime

    // Gentle drift with noise-like movement
    const time = performance.now() * 0.0001 + this.noiseOffset
    const noiseX = Math.sin(time + particle.id * 0.1) * 0.3
    const noiseY = Math.cos(time + particle.id * 0.15) * 0.3

    particle.vx = lerp(particle.vx, noiseX, 0.05)
    particle.vy = lerp(particle.vy, noiseY, 0.05)

    // Update position
    particle.x += particle.vx * deltaTime * 60
    particle.y += particle.vy * deltaTime * 60

    // Wrap around edges for continuous effect
    if (particle.x < -10) {
      particle.x = canvas.width + 10
    }
    if (particle.x > canvas.width + 10) {
      particle.x = -10
    }
    if (particle.y < -10) {
      particle.y = canvas.height + 10
    }
    if (particle.y > canvas.height + 10) {
      particle.y = -10
    }

    // Very gentle fade for stars - stars don't suddenly disappear
    const lifeRatio = particle.life / particle.maxLife
    if (lifeRatio > 0.9) {
      particle.opacity = lerp(particle.opacity, 0, (lifeRatio - 0.9) / 0.1)
    }
  }
}

/**
 * DATA STREAM PARTICLES
 * Velocity-based physics with motion blur trails
 */
export class DataStreamParticleBehavior implements ParticleBehavior {
  private readonly TRAIL_LENGTH = 8
  private readonly GRAVITY = 0.05

  initialize(particle: Particle, canvas: { width: number; height: number }): void {
    // Subtle shooting stars - rare and elegant
    const corner = Math.random() < 0.5 ? 0 : 1

    if (corner === 0) {
      // Top left to bottom right - slower and more subtle
      particle.x = random(-50, canvas.width * 0.3)
      particle.y = -50
      particle.vx = random(3, 6) // Slower, elegant movement
      particle.vy = random(2, 5) // Gentle fall
    } else {
      // Top right to bottom left - slower and more subtle
      particle.x = random(canvas.width * 0.7, canvas.width + 50)
      particle.y = -50
      particle.vx = random(-6, -3) // Slower, elegant movement
      particle.vy = random(2, 5) // Gentle fall
    }

    particle.size = random(0.8, 1.5) // Smaller, more subtle
    particle.maxLife = random(3, 6) // Longer lifespan for elegance
    particle.opacity = 0.5 // Subtle, not too bright
    particle.color =
      PARTICLE_COLORS.dataStream[Math.floor(Math.random() * PARTICLE_COLORS.dataStream.length)]
    particle.trail = []
  }

  update(particle: Particle, deltaTime: number, _canvas: { width: number; height: number }): void {
    particle.life += deltaTime

    // Physics: velocity and slight gravity
    particle.vy += this.GRAVITY * deltaTime * 60

    // Update position
    particle.x += particle.vx * deltaTime * 60
    particle.y += particle.vy * deltaTime * 60

    // Update trail
    if (!particle.trail) {
      particle.trail = []
    }
    particle.trail.push({ x: particle.x, y: particle.y })
    if (particle.trail.length > this.TRAIL_LENGTH) {
      particle.trail.shift()
    }

    // Fade based on life
    const lifeRatio = particle.life / particle.maxLife
    particle.opacity = 1 - lifeRatio
  }
}

/**
 * ORBITAL PARTICLES
 * Follow elliptical paths around a center point
 */
export class OrbitalParticleBehavior implements ParticleBehavior {
  private centerX = 0
  private centerY = 0

  initialize(particle: Particle, canvas: { width: number; height: number }): void {
    this.centerX = canvas.width / 2
    this.centerY = canvas.height / 2

    particle.angle = random(0, Math.PI * 2)
    particle.radius = random(100, 300)
    particle.vx = random(0.005, 0.015) // Slower orbit
    particle.size = random(0.5, 1.5) // Tiny stars
    particle.maxLife = random(15, 25) // Very long life
    particle.opacity = random(0.4, 0.6) // Subtle but visible
    particle.color =
      PARTICLE_COLORS.orbital[Math.floor(Math.random() * PARTICLE_COLORS.orbital.length)]

    // Set initial position
    particle.x = this.centerX + Math.cos(particle.angle) * particle.radius
    particle.y = this.centerY + Math.sin(particle.angle) * particle.radius * 0.6 // Ellipse
  }

  update(particle: Particle, deltaTime: number, canvas: { width: number; height: number }): void {
    particle.life += deltaTime

    // Update center point (can be dynamic)
    this.centerX = canvas.width / 2
    this.centerY = canvas.height / 2

    // Update angle
    particle.angle! += particle.vx * deltaTime * 60
    particle.angle = normalizeAngle(particle.angle!)

    // Calculate elliptical position
    particle.x = this.centerX + Math.cos(particle.angle) * particle.radius!
    particle.y = this.centerY + Math.sin(particle.angle) * particle.radius! * 0.6

    // No pulsing - keep stars stable
    // Size remains constant for peaceful starfield

    // Gentle fade out at end of life
    const lifeRatio = particle.life / particle.maxLife
    if (lifeRatio > 0.85) {
      particle.opacity = lerp(particle.opacity, 0, (lifeRatio - 0.85) / 0.15)
    }
  }
}

/**
 * BURST PARTICLES
 * Rapid dispersal from a point with deceleration
 */
export class BurstParticleBehavior implements ParticleBehavior {
  private sourceX = 0
  private sourceY = 0

  /**
   * Set burst origin point
   */
  public setBurstOrigin(x: number, y: number): void {
    this.sourceX = x
    this.sourceY = y
  }

  initialize(particle: Particle, _canvas: { width: number; height: number }): void {
    particle.x = this.sourceX
    particle.y = this.sourceY

    // Random direction with gentle burst
    const angle = random(0, Math.PI * 2)
    const speed = random(1, 3) // Very gentle
    particle.vx = Math.cos(angle) * speed
    particle.vy = Math.sin(angle) * speed

    particle.size = random(0.8, 2) // Tiny twinkle
    particle.maxLife = random(1.5, 3) // Brief sparkle
    particle.opacity = 0.6 // Visible but subtle
    particle.color = PARTICLE_COLORS.burst[Math.floor(Math.random() * PARTICLE_COLORS.burst.length)]
  }

  update(particle: Particle, deltaTime: number, _canvas: { width: number; height: number }): void {
    particle.life += deltaTime

    // Deceleration (friction)
    const friction = 0.95
    particle.vx *= friction
    particle.vy *= friction

    // Update position
    particle.x += particle.vx * deltaTime * 60
    particle.y += particle.vy * deltaTime * 60

    // Fade out quickly
    const lifeRatio = particle.life / particle.maxLife
    particle.opacity = 1 - lifeRatio
    particle.size = lerp(particle.size, 0.5, lifeRatio)
  }
}

/**
 * Factory to get behavior instance for particle type
 */
export class ParticleBehaviorFactory {
  private static behaviors = new Map<Particle['type'], ParticleBehavior>([
    ['ambient', new AmbientParticleBehavior()],
    ['data-stream', new DataStreamParticleBehavior()],
    ['orbital', new OrbitalParticleBehavior()],
    ['burst', new BurstParticleBehavior()],
  ])

  static getBehavior(type: Particle['type']): ParticleBehavior {
    return this.behaviors.get(type)!
  }

  static setBurstOrigin(x: number, y: number): void {
    const burstBehavior = this.behaviors.get('burst') as BurstParticleBehavior
    burstBehavior.setBurstOrigin(x, y)
  }
}
