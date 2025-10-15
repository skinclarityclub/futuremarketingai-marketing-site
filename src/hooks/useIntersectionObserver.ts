import { useEffect, useState, useRef, RefObject } from 'react'

/**
 * Configuration options for Intersection Observer
 */
export interface UseIntersectionObserverOptions {
  /** Root element for intersection (default: viewport) */
  root?: Element | null
  /** Margin around root (e.g., '10px') */
  rootMargin?: string
  /** Threshold(s) for triggering callback (0-1) */
  threshold?: number | number[]
  /** Only trigger once and then disconnect */
  triggerOnce?: boolean
}

/**
 * Custom hook for observing element visibility using Intersection Observer API
 * Useful for pausing/resuming animations when elements enter/exit viewport
 *
 * @param options - Configuration options
 * @returns Tuple of [ref to attach, isIntersecting boolean]
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 })
 *
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? 'Visible!' : 'Hidden'}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const { root = null, rootMargin = '0px', threshold = 0, triggerOnce = false } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<T>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) {
      return
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting)

          // If triggerOnce and now intersecting, disconnect
          if (triggerOnce && entry.isIntersecting && observerRef.current) {
            observerRef.current.disconnect()
          }
        })
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )

    // Start observing
    observerRef.current.observe(target)

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [root, rootMargin, threshold, triggerOnce])

  return [targetRef, isIntersecting]
}

/**
 * Hook variant that accepts an external ref
 * Useful when you need to use an existing ref
 *
 * @param ref - External ref to observe
 * @param options - Configuration options
 * @returns isIntersecting boolean
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const ref = useRef<HTMLDivElement>(null)
 *   const isVisible = useIntersectionObserverWithRef(ref, { threshold: 0.5 })
 *
 *   return <div ref={ref}>Content</div>
 * }
 * ```
 */
export function useIntersectionObserverWithRef<T extends Element = HTMLDivElement>(
  ref: RefObject<T>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const { root = null, rootMargin = '0px', threshold = 0, triggerOnce = false } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const target = ref.current
    if (!target) {
      return
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting)

          // If triggerOnce and now intersecting, disconnect
          if (triggerOnce && entry.isIntersecting && observerRef.current) {
            observerRef.current.disconnect()
          }
        })
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )

    // Start observing
    observerRef.current.observe(target)

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [ref, root, rootMargin, threshold, triggerOnce])

  return isIntersecting
}
