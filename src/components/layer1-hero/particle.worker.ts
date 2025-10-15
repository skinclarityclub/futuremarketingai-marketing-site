/**
 * Particle Physics Web Worker
 * Offloads CPU-intensive particle update calculations to a separate thread
 */

import type { Particle } from './ParticlePool'
import { lerp, normalizeAngle } from './particleUtils'

// Worker message types
export interface WorkerMessage {
  type: 'UPDATE_PARTICLES'
  particles: Particle[]
  deltaTime: number
  canvasSize: { width: number; height: number }
}

export interface WorkerResponse {
  type: 'PARTICLES_UPDATED'
  particles: Particle[]
}

/**
 * Particle behavior implementations (duplicated for worker context)
 * Note: Workers don't have access to main thread memory
 */
class WorkerParticleBehaviors {
  /**
   * Update ambient particle
   */
  static updateAmbient(
    particle: Particle,
    deltaTime: number,
    canvas: { width: number; height: number }
  ): void {
    particle.life += deltaTime

    // Gentle drift with noise-like movement
    const time = performance.now() * 0.0001 + particle.id * 0.1
    const noiseX = Math.sin(time + particle.id * 0.1) * 0.3
    const noiseY = Math.cos(time + particle.id * 0.15) * 0.3

    particle.vx = lerp(particle.vx, noiseX, 0.05)
    particle.vy = lerp(particle.vy, noiseY, 0.05)

    particle.x += particle.vx * deltaTime * 60
    particle.y += particle.vy * deltaTime * 60

    // Wrap around edges
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

    // Fade opacity
    const lifeRatio = particle.life / particle.maxLife
    if (lifeRatio > 0.8) {
      particle.opacity = lerp(0.7, 0, (lifeRatio - 0.8) / 0.2)
    }
  }

  /**
   * Update data stream particle
   */
  static updateDataStream(particle: Particle, deltaTime: number): void {
    const GRAVITY = 0.05

    particle.life += deltaTime

    // Physics: velocity and gravity
    particle.vy += GRAVITY * deltaTime * 60

    particle.x += particle.vx * deltaTime * 60
    particle.y += particle.vy * deltaTime * 60

    // Update trail
    if (!particle.trail) {
      particle.trail = []
    }
    particle.trail.push({ x: particle.x, y: particle.y })
    if (particle.trail.length > 8) {
      particle.trail.shift()
    }

    // Fade
    const lifeRatio = particle.life / particle.maxLife
    particle.opacity = 1 - lifeRatio
  }

  /**
   * Update orbital particle
   */
  static updateOrbital(
    particle: Particle,
    deltaTime: number,
    canvas: { width: number; height: number }
  ): void {
    particle.life += deltaTime

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Update angle
    particle.angle! += particle.vx * deltaTime * 60
    particle.angle = normalizeAngle(particle.angle!)

    // Calculate elliptical position
    particle.x = centerX + Math.cos(particle.angle) * particle.radius!
    particle.y = centerY + Math.sin(particle.angle) * particle.radius! * 0.6

    // Pulsing size
    const pulse = Math.sin(particle.life * 2) * 0.5 + 1
    particle.size = (2 + pulse) * 1.5

    // Fade out
    const lifeRatio = particle.life / particle.maxLife
    if (lifeRatio > 0.7) {
      particle.opacity = lerp(0.8, 0, (lifeRatio - 0.7) / 0.3)
    }
  }

  /**
   * Update burst particle
   */
  static updateBurst(particle: Particle, deltaTime: number): void {
    particle.life += deltaTime

    // Deceleration
    const friction = 0.95
    particle.vx *= friction
    particle.vy *= friction

    particle.x += particle.vx * deltaTime * 60
    particle.y += particle.vy * deltaTime * 60

    // Fade out
    const lifeRatio = particle.life / particle.maxLife
    particle.opacity = 1 - lifeRatio
    particle.size = lerp(particle.size, 0.5, lifeRatio)
  }

  /**
   * Main update dispatcher
   */
  static update(
    particle: Particle,
    deltaTime: number,
    canvas: { width: number; height: number }
  ): void {
    switch (particle.type) {
      case 'ambient':
        this.updateAmbient(particle, deltaTime, canvas)
        break
      case 'data-stream':
        this.updateDataStream(particle, deltaTime)
        break
      case 'orbital':
        this.updateOrbital(particle, deltaTime, canvas)
        break
      case 'burst':
        this.updateBurst(particle, deltaTime)
        break
    }
  }
}

/**
 * Worker message handler
 */
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, particles, deltaTime, canvasSize } = event.data

  if (type === 'UPDATE_PARTICLES') {
    // Update all particles
    particles.forEach((particle) => {
      WorkerParticleBehaviors.update(particle, deltaTime, canvasSize)
    })

    // Send back updated particles
    const response: WorkerResponse = {
      type: 'PARTICLES_UPDATED',
      particles,
    }

    self.postMessage(response)
  }
})

// Signal worker is ready
self.postMessage({ type: 'WORKER_READY' })
