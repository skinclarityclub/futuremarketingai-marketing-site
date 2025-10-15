/**
 * useParticleWorker - Hook for managing Web Worker offloading
 * Automatically offloads physics calculations when CPU usage is high
 */

import { useRef, useEffect, useState } from 'react'
import type { Particle } from './ParticlePool'
import type { WorkerMessage, WorkerResponse } from './particle.worker'

interface UseParticleWorkerOptions {
  enabled?: boolean
  cpuThreshold?: number // CPU % to trigger worker (default: 20%)
}

export function useParticleWorker(options: UseParticleWorkerOptions = {}) {
  const { enabled = true, cpuThreshold = 20 } = options

  const workerRef = useRef<Worker | null>(null)
  const [isWorkerReady, setIsWorkerReady] = useState(false)
  const [isWorkerActive, setIsWorkerActive] = useState(false)
  const pendingCallbackRef = useRef<((particles: Particle[]) => void) | null>(null)

  // Initialize worker
  useEffect(() => {
    if (!enabled) {
      return
    }

    try {
      // Create worker using Vite's worker syntax
      const worker = new Worker(new URL('./particle.worker.ts', import.meta.url), {
        type: 'module',
      })

      worker.addEventListener('message', (event: MessageEvent) => {
        const data = event.data

        if (data.type === 'WORKER_READY') {
          setIsWorkerReady(true)
          console.log('✅ Particle Worker ready')
        } else if (data.type === 'PARTICLES_UPDATED') {
          const response = data as WorkerResponse
          if (pendingCallbackRef.current) {
            pendingCallbackRef.current(response.particles)
            pendingCallbackRef.current = null
          }
        }
      })

      worker.addEventListener('error', (error) => {
        console.error('❌ Particle Worker error:', error)
        setIsWorkerReady(false)
      })

      workerRef.current = worker
    } catch (error) {
      console.warn('⚠️ Web Workers not supported, falling back to main thread')
      setIsWorkerReady(false)
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [enabled])

  /**
   * Update particles using worker (async)
   */
  const updateParticlesAsync = (
    particles: Particle[],
    deltaTime: number,
    canvasSize: { width: number; height: number },
    callback: (updatedParticles: Particle[]) => void
  ): void => {
    if (!workerRef.current || !isWorkerReady) {
      callback(particles) // Fallback: no update, let main thread handle it
      return
    }

    pendingCallbackRef.current = callback

    const message: WorkerMessage = {
      type: 'UPDATE_PARTICLES',
      particles,
      deltaTime,
      canvasSize,
    }

    workerRef.current.postMessage(message)
  }

  /**
   * Decide whether to use worker based on CPU usage
   */
  const shouldUseWorker = (cpuUsage: number): boolean => {
    return enabled && isWorkerReady && cpuUsage > cpuThreshold
  }

  /**
   * Update worker active state
   */
  const setWorkerActive = (active: boolean) => {
    if (active !== isWorkerActive) {
      setIsWorkerActive(active)
      if (active) {
        console.log('🚀 Worker offloading activated (CPU high)')
      } else {
        console.log('💤 Worker offloading deactivated (CPU normal)')
      }
    }
  }

  return {
    isWorkerReady,
    isWorkerActive,
    shouldUseWorker,
    updateParticlesAsync,
    setWorkerActive,
  }
}
