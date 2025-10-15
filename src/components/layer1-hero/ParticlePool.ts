/**
 * ParticlePool - Efficient object pool for particle management
 * Implements pooling and culling strategies for optimal performance
 */

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  opacity: number
  color: string
  type: 'ambient' | 'data-stream' | 'orbital' | 'burst'
  active: boolean
  angle?: number // For orbital particles
  radius?: number // For orbital particles
  trail?: Array<{ x: number; y: number }> // For data-stream particles
}

export interface PoolConfig {
  initialSize: number
  maxSize: number
  enableCulling: boolean
  canvasWidth: number
  canvasHeight: number
  reducedMotion: boolean
}

export class ParticlePool {
  private pool: Particle[] = []
  private activeParticles: Set<number> = new Set()
  private nextId = 0
  private config: PoolConfig

  constructor(config: PoolConfig) {
    this.config = config
    this.initializePool()
  }

  /**
   * Initialize the pool with particles
   */
  private initializePool(): void {
    const size = this.config.reducedMotion
      ? Math.floor(this.config.initialSize * 0.3) // 70% reduction for reduced motion
      : this.config.initialSize

    for (let i = 0; i < size; i++) {
      this.pool.push(this.createParticle())
    }
  }

  /**
   * Create a new particle with default values
   */
  private createParticle(): Particle {
    return {
      id: this.nextId++,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 2,
      opacity: 1,
      color: '#00D4FF',
      type: 'ambient',
      active: false,
    }
  }

  /**
   * Get a particle from the pool or create a new one
   */
  public acquire(type: Particle['type']): Particle | null {
    // Check if we've hit the max size limit
    if (this.activeParticles.size >= this.config.maxSize) {
      return null
    }

    // Find an inactive particle
    let particle = this.pool.find((p) => !p.active)

    // If none available and we haven't hit max, create new one
    if (!particle && this.pool.length < this.config.maxSize) {
      particle = this.createParticle()
      this.pool.push(particle)
    }

    if (particle) {
      particle.active = true
      particle.type = type
      particle.life = 0
      this.activeParticles.add(particle.id)
    }

    return particle || null
  }

  /**
   * Release a particle back to the pool
   */
  public release(particle: Particle): void {
    particle.active = false
    particle.life = 0
    this.activeParticles.delete(particle.id)

    // Clear trail if it exists
    if (particle.trail) {
      particle.trail = []
    }
  }

  /**
   * Get all active particles
   */
  public getActiveParticles(): Particle[] {
    return this.pool.filter((p) => p.active)
  }

  /**
   * Cull particles that are outside the visible canvas area
   * Returns number of culled particles
   */
  public cullOffscreenParticles(): number {
    if (!this.config.enableCulling) {
      return 0
    }

    let culled = 0
    const margin = 50 // Extra margin to prevent popping

    this.pool.forEach((particle) => {
      if (!particle.active) {
        return
      }

      const isOffscreen =
        particle.x < -margin ||
        particle.x > this.config.canvasWidth + margin ||
        particle.y < -margin ||
        particle.y > this.config.canvasHeight + margin

      // Only cull if particle is offscreen AND has lived at least 10% of its life
      // This prevents culling particles that are just spawning
      if (isOffscreen && particle.life > particle.maxLife * 0.1) {
        this.release(particle)
        culled++
      }
    })

    return culled
  }

  /**
   * Update canvas dimensions for culling
   */
  public updateCanvasSize(width: number, height: number): void {
    this.config.canvasWidth = width
    this.config.canvasHeight = height
  }

  /**
   * Get pool statistics for monitoring
   */
  public getStats() {
    return {
      total: this.pool.length,
      active: this.activeParticles.size,
      inactive: this.pool.length - this.activeParticles.size,
      maxSize: this.config.maxSize,
      utilizationPercent: (this.activeParticles.size / this.config.maxSize) * 100,
    }
  }

  /**
   * Clear all particles (useful for cleanup)
   */
  public clear(): void {
    this.pool.forEach((particle) => {
      if (particle.active) {
        this.release(particle)
      }
    })
  }

  /**
   * Adapt pool size based on device capability
   * Can be called dynamically based on performance metrics
   */
  public adaptPoolSize(targetFps: number, currentFps: number): void {
    if (currentFps < targetFps * 0.8) {
      // Performance is poor, reduce max size by 20%
      this.config.maxSize = Math.max(
        Math.floor(this.config.maxSize * 0.8),
        this.config.initialSize * 0.5 // Don't go below 50% of initial
      )
    } else if (
      currentFps > targetFps * 0.95 &&
      this.activeParticles.size > this.config.maxSize * 0.8
    ) {
      // Performance is good and we're using most of the pool, allow slight increase
      this.config.maxSize = Math.min(
        Math.floor(this.config.maxSize * 1.1),
        this.config.initialSize * 2 // Don't exceed 2x initial
      )
    }
  }

  /**
   * Enable or disable reduced motion mode
   */
  public setReducedMotion(enabled: boolean): void {
    this.config.reducedMotion = enabled

    if (enabled) {
      // Release particles beyond the reduced limit
      const limit = Math.floor(this.config.initialSize * 0.3)
      const active = this.getActiveParticles()

      for (let i = limit; i < active.length; i++) {
        this.release(active[i])
      }
    }
  }
}
