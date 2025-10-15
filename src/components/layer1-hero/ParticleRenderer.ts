/**
 * ParticleRenderer - Canvas-based particle rendering
 * Handles drawing all particle types with their unique visual styles
 */

import type { Particle } from './ParticlePool'

export class ParticleRenderer {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Hint for better performance
    })

    if (!ctx) {
      throw new Error('Could not get 2D canvas context')
    }

    this.ctx = ctx
  }

  /**
   * Clear the entire canvas and render premium nebula background
   */
  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Premium nebula/cosmic dust background
    this.renderNebulaBackground()
  }

  /**
   * Render subtle animated nebula clouds - ORIGINEEL (voor vergelijking)
   */
  private renderNebulaBackground(): void {
    const { ctx, canvas } = this
    const time = performance.now() * 0.0001

    ctx.save()
    ctx.globalCompositeOperation = 'screen'

    // Multiple nebula clouds for depth - ORIGINELE KLEUREN
    const clouds = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 300, color: '#1a2540', alpha: 0.15 },
      { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: 400, color: '#2a1540', alpha: 0.12 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 500, color: '#1a3050', alpha: 0.08 },
      { x: canvas.width * 0.8, y: canvas.height * 0.2, radius: 250, color: '#301a40', alpha: 0.1 },
    ]

    clouds.forEach((cloud, i) => {
      // Subtle animated movement
      const offsetX = Math.sin(time + i) * 30
      const offsetY = Math.cos(time + i) * 20

      const gradient = ctx.createRadialGradient(
        cloud.x + offsetX,
        cloud.y + offsetY,
        0,
        cloud.x + offsetX,
        cloud.y + offsetY,
        cloud.radius
      )

      gradient.addColorStop(
        0,
        cloud.color +
          Math.floor(cloud.alpha * 255)
            .toString(16)
            .padStart(2, '0')
      )
      gradient.addColorStop(0.4, cloud.color + '08')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    })

    ctx.restore()
  }

  /**
   * Render all active particles
   */
  public render(particles: Particle[]): void {
    particles.forEach((particle) => {
      switch (particle.type) {
        case 'ambient':
          this.renderAmbient(particle)
          break
        case 'data-stream':
          this.renderDataStream(particle)
          break
        case 'orbital':
          this.renderOrbital(particle)
          break
        case 'burst':
          this.renderBurst(particle)
          break
      }
    })
  }

  /**
   * Render ambient particle - realistic twinkling star with premium effects
   */
  private renderAmbient(particle: Particle): void {
    const { ctx } = this

    ctx.save()

    // Premium twinkle effect - complex multi-layered
    const time = performance.now() * 0.001
    const twinkle1 = Math.sin(time * particle.id * 0.5 + particle.id) * 0.2 + 0.8
    const twinkle2 = Math.sin(time * particle.id * 0.3 + particle.id * 2) * 0.15
    const twinkle = twinkle1 + twinkle2
    ctx.globalAlpha = particle.opacity * twinkle

    // Premium color temperature for realism (blue/white/yellow like real stars)
    let starColor = particle.color
    const temp = particle.id % 100
    if (temp < 10) {
      starColor = '#B8D4FF' // Blue giant
    } else if (temp < 15) {
      starColor = '#FFF4E8' // Yellow star
    } else if (temp < 17) {
      starColor = '#E8F0FF' // Subtle blue
    }

    // Premium star shape - 4-pointed cross with enhanced glow
    const drawPremiumStar = (x: number, y: number, size: number, intensity: number) => {
      // Vertical beam with gradient
      const vertGrad = ctx.createLinearGradient(x, y - size * 2.5, x, y + size * 2.5)
      vertGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      vertGrad.addColorStop(0.3, `rgba(255, 255, 255, ${intensity * 0.8})`)
      vertGrad.addColorStop(0.5, `rgba(255, 255, 255, ${intensity})`)
      vertGrad.addColorStop(0.7, `rgba(255, 255, 255, ${intensity * 0.8})`)
      vertGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = vertGrad
      ctx.fillRect(x - size * 0.2, y - size * 2.5, size * 0.4, size * 5)

      // Horizontal beam with gradient
      const horizGrad = ctx.createLinearGradient(x - size * 2.5, y, x + size * 2.5, y)
      horizGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      horizGrad.addColorStop(0.3, `rgba(255, 255, 255, ${intensity * 0.8})`)
      horizGrad.addColorStop(0.5, `rgba(255, 255, 255, ${intensity})`)
      horizGrad.addColorStop(0.7, `rgba(255, 255, 255, ${intensity * 0.8})`)
      horizGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = horizGrad
      ctx.fillRect(x - size * 2.5, y - size * 0.2, size * 5, size * 0.4)

      // Diagonal beams for brighter stars (8-pointed)
      if (particle.size > 1.5) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(Math.PI / 4)

        // Diagonal 1
        const diag1 = ctx.createLinearGradient(0, -size * 2, 0, size * 2)
        diag1.addColorStop(0, 'rgba(255, 255, 255, 0)')
        diag1.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.6})`)
        diag1.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = diag1
        ctx.fillRect(-size * 0.15, -size * 2, size * 0.3, size * 4)

        // Diagonal 2
        const diag2 = ctx.createLinearGradient(-size * 2, 0, size * 2, 0)
        diag2.addColorStop(0, 'rgba(255, 255, 255, 0)')
        diag2.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.6})`)
        diag2.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = diag2
        ctx.fillRect(-size * 2, -size * 0.15, size * 4, size * 0.3)

        ctx.restore()
      }
    }

    // Premium multi-layer glow effect
    // Outer glow (largest)
    const gradient1 = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size * 6
    )
    gradient1.addColorStop(0, starColor + 'CC')
    gradient1.addColorStop(0.2, starColor + '66')
    gradient1.addColorStop(0.5, starColor + '22')
    gradient1.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient1
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 6, 0, Math.PI * 2)
    ctx.fill()

    // Inner glow (colored)
    const gradient2 = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size * 3
    )
    gradient2.addColorStop(0, '#FFFFFF' + 'FF')
    gradient2.addColorStop(0.4, starColor + 'AA')
    gradient2.addColorStop(0.8, starColor + '44')
    gradient2.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient2
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
    ctx.fill()

    // Draw the premium star shape
    drawPremiumStar(particle.x, particle.y, particle.size, 1)

    // Ultra-bright center point with lens flare effect
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowBlur = particle.size * 2
    ctx.shadowColor = starColor
    ctx.fillRect(
      particle.x - particle.size * 0.3,
      particle.y - particle.size * 0.3,
      particle.size * 0.6,
      particle.size * 0.6
    )

    ctx.restore()
  }

  /**
   * Render data stream particle - shooting star effect
   */
  private renderDataStream(particle: Particle): void {
    const { ctx } = this

    if (!particle.trail || particle.trail.length < 2) {
      this.renderAmbient(particle)
      return
    }

    ctx.save()

    // Subtle shooting star trail - elegant and soft
    const trailLength = Math.min(particle.trail.length, 10) // Shorter trail

    for (let i = Math.max(0, particle.trail.length - trailLength); i < particle.trail.length; i++) {
      const point = particle.trail[i]
      const nextPoint = particle.trail[i + 1]
      if (!nextPoint) {
        continue
      }

      const progress = i / particle.trail.length
      const alpha = particle.opacity * progress * 0.4 // More subtle

      // Soft trail gradient
      const grad = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y)
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`)
      grad.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.5})`)
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.4})`)

      ctx.strokeStyle = grad
      ctx.lineWidth = particle.size * (1 - progress * 0.3) // Thinner
      ctx.lineCap = 'round'

      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(nextPoint.x, nextPoint.y)
      ctx.stroke()
    }

    // Subtle shooting star head - elegant glow
    const headGlow = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size * 5
    )
    headGlow.addColorStop(0, 'rgba(255, 255, 255, 0.7)')
    headGlow.addColorStop(0.3, 'rgba(200, 220, 255, 0.4)')
    headGlow.addColorStop(0.7, 'rgba(150, 200, 255, 0.2)')
    headGlow.addColorStop(1, 'transparent')

    ctx.fillStyle = headGlow
    ctx.globalAlpha = particle.opacity * 0.8
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2)
    ctx.fill()

    // Subtle white core
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowBlur = particle.size * 1.5
    ctx.shadowColor = '#C8E0FF'
    ctx.globalAlpha = particle.opacity
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 0.8, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  /**
   * Render orbital particle - subtle orbiting star
   */
  private renderOrbital(particle: Particle): void {
    // Simplified - same as ambient for peaceful space aesthetic
    this.renderAmbient(particle)
  }

  /**
   * Render burst particle - premium sparkle explosion
   */
  private renderBurst(particle: Particle): void {
    const { ctx } = this

    ctx.save()

    const lifeRatio = particle.life / particle.maxLife
    const expandSize = particle.size * (1 + lifeRatio * 3)

    // Multi-layer burst effect
    // Outer expansion ring
    const outerRing = ctx.createRadialGradient(
      particle.x,
      particle.y,
      expandSize * 0.5,
      particle.x,
      particle.y,
      expandSize * 2
    )
    outerRing.addColorStop(0, 'rgba(255, 255, 255, 0)')
    outerRing.addColorStop(0.3, `rgba(200, 220, 255, ${particle.opacity * (1 - lifeRatio) * 0.6})`)
    outerRing.addColorStop(0.7, `rgba(150, 180, 255, ${particle.opacity * (1 - lifeRatio) * 0.3})`)
    outerRing.addColorStop(1, 'transparent')

    ctx.fillStyle = outerRing
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, expandSize * 2, 0, Math.PI * 2)
    ctx.fill()

    // Inner bright core
    const coreGlow = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      expandSize
    )
    coreGlow.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * (1 - lifeRatio)})`)
    coreGlow.addColorStop(0.4, `rgba(220, 230, 255, ${particle.opacity * (1 - lifeRatio) * 0.7})`)
    coreGlow.addColorStop(1, 'transparent')

    ctx.fillStyle = coreGlow
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, expandSize, 0, Math.PI * 2)
    ctx.fill()

    // Sparkle rays (4-pointed)
    if (lifeRatio < 0.5) {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.globalAlpha = particle.opacity * (1 - lifeRatio * 2)

      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2)
        const rayGrad = ctx.createLinearGradient(0, -expandSize * 1.5, 0, expandSize * 1.5)
        rayGrad.addColorStop(0, 'transparent')
        rayGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)')
        rayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)')
        rayGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.6)')
        rayGrad.addColorStop(1, 'transparent')

        ctx.fillStyle = rayGrad
        ctx.fillRect(-expandSize * 0.15, -expandSize * 1.5, expandSize * 0.3, expandSize * 3)
      }

      ctx.restore()
    }

    ctx.restore()
  }

  /**
   * Update canvas size (call on window resize)
   */
  public updateSize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
  }

  /**
   * Get canvas dimensions
   */
  public getSize(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    }
  }
}
