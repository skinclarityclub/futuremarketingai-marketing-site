/**
 * useParticleSystem - React hook for particle system integration
 * Allows external components to trigger particle effects
 */

import { useCallback, useRef, useEffect } from 'react'

export interface ParticleSystemRef {
  triggerBurst: (x: number, y: number, count?: number) => void
}

/**
 * Hook to interact with ParticleSystem component
 * Usage:
 *   const particleRef = useParticleSystem()
 *   particleRef.current?.triggerBurst(x, y, 30)
 */
export function useParticleSystem() {
  const ref = useRef<ParticleSystemRef | null>(null)

  return ref
}

/**
 * Hook to trigger burst on click events
 * Usage:
 *   const handleClick = useParticleBurst(particleSystemRef)
 *   <div onClick={handleClick}>Click me</div>
 */
export function useParticleBurst(
  particleSystemRef: React.RefObject<ParticleSystemRef | null>,
  count: number = 20
) {
  return useCallback(
    (event: React.MouseEvent) => {
      if (!particleSystemRef.current) {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      particleSystemRef.current.triggerBurst(x, y, count)
    },
    [particleSystemRef, count]
  )
}

/**
 * Hook to trigger burst on mount (for animation effects)
 * Usage:
 *   useParticleBurstOnMount(particleSystemRef, { x: 100, y: 100 }, 30)
 */
export function useParticleBurstOnMount(
  particleSystemRef: React.RefObject<ParticleSystemRef | null>,
  position: { x: number; y: number },
  count: number = 20,
  delay: number = 0
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (particleSystemRef.current) {
        particleSystemRef.current.triggerBurst(position.x, position.y, count)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [particleSystemRef, position.x, position.y, count, delay])
}

/**
 * Hook to create random ambient bursts
 * Usage:
 *   useRandomBursts(particleSystemRef, containerRef, { interval: 3000, count: 15 })
 */
export function useRandomBursts(
  particleSystemRef: React.RefObject<ParticleSystemRef | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  options: {
    interval?: number // ms between bursts
    count?: number // particles per burst
    enabled?: boolean
  } = {}
) {
  const { interval = 3000, count = 15, enabled = true } = options

  useEffect(() => {
    if (!enabled) {
      return
    }

    const triggerRandomBurst = () => {
      if (!particleSystemRef.current || !containerRef.current) {
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.random() * rect.width
      const y = Math.random() * rect.height

      particleSystemRef.current.triggerBurst(x, y, count)
    }

    const timer = setInterval(triggerRandomBurst, interval)
    return () => clearInterval(timer)
  }, [particleSystemRef, containerRef, interval, count, enabled])
}
