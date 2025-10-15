/**
 * ParticleSystem - Main particle engine component
 * Integrates pool, behaviors, rendering, and performance adaptation
 */

import React, { useEffect, useRef, useState } from 'react'
import { ParticlePool } from './ParticlePool'
import { ParticleRenderer } from './ParticleRenderer'
import { ParticleBehaviorFactory } from './ParticleTypes'
import { detectDeviceCapability, FPSCounter, CPUMonitor } from './particleUtils'
import { useParticleWorker } from './useParticleWorker'
import type { Particle } from './ParticlePool'

interface ParticleSystemProps {
  className?: string
  spawnRate?: number // Particles per second per type
  enablePerformanceMonitor?: boolean
  enableWorker?: boolean // Enable Web Worker offloading (default: true)
  workerCpuThreshold?: number // CPU % to activate worker (default: 20%)
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  className = '',
  spawnRate = 2,
  enablePerformanceMonitor = false,
  enableWorker = true,
  workerCpuThreshold = 20,
}) => {
  // Worker integration
  const worker = useParticleWorker({
    enabled: enableWorker,
    cpuThreshold: workerCpuThreshold,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<ParticlePool | null>(null)
  const rendererRef = useRef<ParticleRenderer | null>(null)
  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const fpsCounterRef = useRef<FPSCounter>(new FPSCounter())
  const cpuMonitorRef = useRef<CPUMonitor>(new CPUMonitor())
  const spawnTimersRef = useRef<Record<Particle['type'], number>>({
    ambient: 0,
    'data-stream': 0,
    orbital: 0,
    burst: 0,
  })

  const [stats, setStats] = useState({
    fps: 60,
    cpu: 0,
    particles: 0,
    workerActive: false,
  })

  // Initialize system
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const capability = detectDeviceCapability()

    // Setup canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      if (poolRef.current) {
        poolRef.current.updateCanvasSize(canvas.width, canvas.height)
      }
      if (rendererRef.current) {
        rendererRef.current.updateSize(canvas.width, canvas.height)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    // Initialize pool and renderer
    poolRef.current = new ParticlePool({
      initialSize: 100,
      maxSize: capability.maxParticles,
      enableCulling: true,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      reducedMotion: capability.reducedMotion,
    })

    rendererRef.current = new ParticleRenderer(canvas)

    // Start animation loop
    lastTimeRef.current = performance.now()
    animate()

    return () => {
      window.removeEventListener('resize', updateSize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (poolRef.current) {
        poolRef.current.clear()
      }
    }
  }, [])

  // Main animation loop
  const animate = () => {
    const now = performance.now()
    const deltaTime = Math.min((now - lastTimeRef.current) / 1000, 0.1) // Cap at 100ms
    lastTimeRef.current = now

    const pool = poolRef.current
    const renderer = rendererRef.current

    if (!pool || !renderer) {
      animationFrameRef.current = requestAnimationFrame(animate)
      return
    }

    // Performance monitoring
    cpuMonitorRef.current.startFrame()

    // Spawn new particles
    spawnParticles(deltaTime, pool, renderer)

    // Update all active particles
    const activeParticles = pool.getActiveParticles()
    const canvasSize = renderer.getSize()
    const currentCPU = cpuMonitorRef.current.getCPUUsage()

    // Decide whether to use worker based on CPU
    const useWorker = worker.shouldUseWorker(currentCPU)
    worker.setWorkerActive(useWorker)

    if (useWorker && activeParticles.length > 50) {
      // Use Web Worker for physics (async)
      worker.updateParticlesAsync(activeParticles, deltaTime, canvasSize, (updatedParticles) => {
        // Worker callback - particles are already updated
        updatedParticles.forEach((particle) => {
          if (particle.life >= particle.maxLife) {
            pool.release(particle)
          }
        })
      })
    } else {
      // Use main thread (synchronous)
      activeParticles.forEach((particle) => {
        const behavior = ParticleBehaviorFactory.getBehavior(particle.type)
        behavior.update(particle, deltaTime, canvasSize)

        // Release particles that exceeded their lifetime
        if (particle.life >= particle.maxLife) {
          pool.release(particle)
        }
      })
    }

    // Cull offscreen particles
    pool.cullOffscreenParticles()

    // Render
    renderer.clear()
    renderer.render(pool.getActiveParticles())

    // Performance monitoring
    cpuMonitorRef.current.endFrame()
    const fps = fpsCounterRef.current.update()
    const cpu = cpuMonitorRef.current.getCPUUsage()

    // Adapt pool size based on performance
    pool.adaptPoolSize(60, fps)

    // Update stats periodically
    if (Math.random() < 0.02 && enablePerformanceMonitor) {
      // Update ~2% of frames (≈1x per second at 60fps)
      setStats({
        fps,
        cpu: Math.round(cpu),
        particles: pool.getStats().active,
        workerActive: worker.isWorkerActive,
      })
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  // Spawn particles based on spawn rate
  const spawnParticles = (deltaTime: number, pool: ParticlePool, renderer: ParticleRenderer) => {
    const canvasSize = renderer.getSize()

    // Different spawn rates for different particle types
    // Ambient & orbital: frequent (beautiful starfield)
    // Data-stream (shooting stars): rare (subtle, occasional)
    const particleConfigs = [
      { type: 'ambient' as const, rate: spawnRate },
      { type: 'orbital' as const, rate: spawnRate },
      { type: 'data-stream' as const, rate: spawnRate * 0.15 }, // 85% less frequent!
    ]

    particleConfigs.forEach(({ type, rate }) => {
      spawnTimersRef.current[type] += deltaTime

      const interval = 1 / rate
      while (spawnTimersRef.current[type] >= interval) {
        spawnTimersRef.current[type] -= interval

        const particle = pool.acquire(type)
        if (particle) {
          const behavior = ParticleBehaviorFactory.getBehavior(type)
          behavior.initialize(particle, canvasSize)
        }
      }
    })
  }

  // Public method to trigger burst effect
  const triggerBurst = (x: number, y: number, count: number = 20) => {
    if (!poolRef.current || !rendererRef.current) {
      return
    }

    const canvasSize = rendererRef.current.getSize()
    ParticleBehaviorFactory.setBurstOrigin(x, y)

    for (let i = 0; i < count; i++) {
      const particle = poolRef.current.acquire('burst')
      if (particle) {
        const behavior = ParticleBehaviorFactory.getBehavior('burst')
        behavior.initialize(particle, canvasSize)
      }
    }
  }

  // Expose triggerBurst via ref
  useEffect(() => {
    if (canvasRef.current) {
      // @ts-ignore - Adding custom method to canvas element
      canvasRef.current.triggerBurst = triggerBurst
    }
  }, [])

  return (
    <div className={`absolute inset-0 ${className}`} style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen', // Beautiful additive blending!
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {enablePerformanceMonitor && (
        <div
          className="absolute top-2 right-2 bg-black/50 text-white text-xs font-mono p-2 rounded backdrop-blur-sm pointer-events-none"
          style={{ zIndex: 200 }}
        >
          <div>FPS: {stats.fps}</div>
          <div>CPU: {stats.cpu}%</div>
          <div>Particles: {stats.particles}</div>
          <div className={stats.workerActive ? 'text-green-400' : 'text-white/60'}>
            Worker: {stats.workerActive ? '🚀 Active' : '💤 Idle'}
          </div>
        </div>
      )}
    </div>
  )
}

export default ParticleSystem
