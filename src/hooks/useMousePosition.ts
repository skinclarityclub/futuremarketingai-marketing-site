import { useEffect, useRef, useState } from 'react'

/**
 * Mouse position with normalized coordinates (0-1 range)
 */
export interface MousePosition {
  /** Raw mouse X position in pixels */
  x: number
  /** Raw mouse Y position in pixels */
  y: number
  /** Normalized X position (0-1 range) */
  normalizedX: number
  /** Normalized Y position (0-1 range) */
  normalizedY: number
  /** Smoothed normalized X position using lerp */
  smoothX: number
  /** Smoothed normalized Y position using lerp */
  smoothY: number
}

/**
 * Configuration options for mouse position tracking
 */
export interface UseMousePositionOptions {
  /** Smoothing factor for lerp (0-1, lower = smoother but more lag) */
  smoothing?: number
  /** Whether to enable smoothing */
  enableSmoothing?: boolean
}

/**
 * Linear interpolation function
 * @param start - Starting value
 * @param end - Target value
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated value
 */
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

/**
 * Custom hook for tracking mouse position with lerp smoothing
 * Updates at 60fps with optional smoothing for fluid animations
 *
 * @param options - Configuration options
 * @returns Mouse position data with raw and smoothed coordinates
 *
 * @example
 * ```tsx
 * const mousePos = useMousePosition({ smoothing: 0.1 })
 *
 * // Use smoothed normalized coordinates for parallax
 * const offsetX = (mousePos.smoothX - 0.5) * 100
 * const offsetY = (mousePos.smoothY - 0.5) * 100
 * ```
 */
export function useMousePosition(options: UseMousePositionOptions = {}): MousePosition {
  const { smoothing = 0.1, enableSmoothing = true } = options

  // Raw mouse position
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
    smoothX: 0.5,
    smoothY: 0.5,
  })

  // Refs for smooth animation
  const smoothPosRef = useRef({ x: 0.5, y: 0.5 })
  const targetPosRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>()

  // Animation loop for smooth updates (60fps)
  useEffect(() => {
    if (!enableSmoothing) {
      return
    }

    const animate = () => {
      const current = smoothPosRef.current
      const target = targetPosRef.current

      // Apply lerp smoothing
      const newX = lerp(current.x, target.x, smoothing)
      const newY = lerp(current.y, target.y, smoothing)

      // Only update if there's a meaningful change (avoid unnecessary renders)
      const threshold = 0.001
      if (Math.abs(newX - current.x) > threshold || Math.abs(newY - current.y) > threshold) {
        smoothPosRef.current = { x: newX, y: newY }

        setPosition((prev) => ({
          ...prev,
          smoothX: newX,
          smoothY: newY,
        }))
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [smoothing, enableSmoothing])

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      const { innerWidth, innerHeight } = window

      // Normalize coordinates to 0-1 range
      const normalizedX = clientX / innerWidth
      const normalizedY = clientY / innerHeight

      // Update target position for smooth animation
      targetPosRef.current = {
        x: normalizedX,
        y: normalizedY,
      }

      // Update raw position immediately
      setPosition((prev) => ({
        ...prev,
        x: clientX,
        y: clientY,
        normalizedX,
        normalizedY,
        // If smoothing is disabled, update smooth values immediately too
        ...(enableSmoothing
          ? {}
          : {
              smoothX: normalizedX,
              smoothY: normalizedY,
            }),
      }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enableSmoothing])

  return position
}

/**
 * Hook variant that returns only smoothed normalized coordinates
 * Useful when you only need the smoothed values for parallax/animations
 *
 * @param smoothing - Smoothing factor (0-1, default: 0.1)
 * @returns Object with smoothX and smoothY properties
 *
 * @example
 * ```tsx
 * const { smoothX, smoothY } = useSmoothedMousePosition(0.15)
 * ```
 */
export function useSmoothedMousePosition(smoothing = 0.1) {
  const position = useMousePosition({ smoothing, enableSmoothing: true })
  return {
    smoothX: position.smoothX,
    smoothY: position.smoothY,
  }
}
