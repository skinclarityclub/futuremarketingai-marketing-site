/**
 * Utility functions for particle system
 * Device capability detection and performance monitoring
 */

export interface DeviceCapability {
  tier: 'low' | 'medium' | 'high'
  maxParticles: number
  enableWebWorkers: boolean
  reducedMotion: boolean
}

/**
 * Detect device capability based on hardware and user preferences
 */
export function detectDeviceCapability(): DeviceCapability {
  // Check for reduced motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Check for low-end device indicators
  const isLowEnd =
    // @ts-ignore - navigator.deviceMemory is not in all browsers
    (navigator.deviceMemory && navigator.deviceMemory < 4) ||
    // @ts-ignore - navigator.hardwareConcurrency
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Determine device tier
  let tier: DeviceCapability['tier'] = 'high'
  let maxParticles = 1000

  if (isLowEnd || isMobile) {
    tier = 'low'
    maxParticles = 300
  }

  // Reduce further if reduced motion is enabled
  if (reducedMotion) {
    maxParticles = Math.floor(maxParticles * 0.3)
  }

  return {
    tier,
    maxParticles,
    enableWebWorkers: tier === 'high' && !reducedMotion,
    reducedMotion,
  }
}

/**
 * FPS counter for performance monitoring
 */
export class FPSCounter {
  private frames: number[] = []
  private lastTime = performance.now()

  /**
   * Update the FPS counter
   * Call this every frame
   */
  public update(): number {
    const now = performance.now()
    const delta = now - this.lastTime
    this.lastTime = now

    // Add frame time
    this.frames.push(delta)

    // Keep only last 60 frames (1 second at 60fps)
    if (this.frames.length > 60) {
      this.frames.shift()
    }

    return this.getFPS()
  }

  /**
   * Get current FPS
   */
  public getFPS(): number {
    if (this.frames.length === 0) {
      return 60
    }

    const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length
    return Math.round(1000 / avgFrameTime)
  }

  /**
   * Reset the counter
   */
  public reset(): void {
    this.frames = []
    this.lastTime = performance.now()
  }
}

/**
 * CPU usage estimator
 * Monitors main thread blocking time
 */
export class CPUMonitor {
  private samples: number[] = []
  private measuring = false
  private measureStart = 0

  /**
   * Start measuring a frame
   */
  public startFrame(): void {
    this.measureStart = performance.now()
    this.measuring = true
  }

  /**
   * End measuring a frame
   */
  public endFrame(): void {
    if (!this.measuring) {
      return
    }

    const duration = performance.now() - this.measureStart
    this.samples.push(duration)

    // Keep last 120 samples (2 seconds at 60fps)
    if (this.samples.length > 120) {
      this.samples.shift()
    }

    this.measuring = false
  }

  /**
   * Get estimated CPU usage percentage
   * Based on how much of the 16.67ms frame budget is used
   */
  public getCPUUsage(): number {
    if (this.samples.length === 0) {
      return 0
    }

    const avgDuration = this.samples.reduce((a, b) => a + b, 0) / this.samples.length
    const frameBudget = 16.67 // 60fps budget in ms

    return Math.min((avgDuration / frameBudget) * 100, 100)
  }

  /**
   * Check if CPU usage exceeds threshold
   */
  public exceedsThreshold(threshold: number): boolean {
    return this.getCPUUsage() > threshold
  }

  /**
   * Reset the monitor
   */
  public reset(): void {
    this.samples = []
    this.measuring = false
  }
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Random number between min and max
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Get random color from palette
 */
export function randomColor(palette: string[]): string {
  return palette[randomInt(0, palette.length - 1)]
}

/**
 * Check if two circles intersect (for collision detection)
 */
export function circlesIntersect(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < r1 + r2
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Normalize angle to 0-2π range
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += Math.PI * 2
  }
  while (angle > Math.PI * 2) {
    angle -= Math.PI * 2
  }
  return angle
}
