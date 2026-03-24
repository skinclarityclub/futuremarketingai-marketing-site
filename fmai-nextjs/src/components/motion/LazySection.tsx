'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  /** Minimum height placeholder before content loads */
  minHeight?: string
  /** IntersectionObserver rootMargin — how early to trigger */
  rootMargin?: string
  className?: string
}

/**
 * LazySection — Defers rendering of children until the section
 * is within `rootMargin` of the viewport. Shows a min-height
 * placeholder until triggered. Once triggered, stays rendered.
 */
export function LazySection({
  children,
  minHeight = '200px',
  rootMargin = '200px',
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} className={className} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? children : null}
    </div>
  )
}
