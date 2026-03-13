import { useRef, useCallback, useState } from 'react'
import type React from 'react'

/**
 * useTilt — Mouse-tracking card tilt hook for desktop parallax effect.
 *
 * Returns a ref, inline style object, and mouse event handlers that
 * apply a CSS perspective transform following the cursor position.
 *
 * Desktop-only guard: This hook returns values unconditionally.
 * Callers should only apply the handlers on desktop viewports,
 * e.g. by checking `@media (hover: hover) and (pointer: fine)`
 * via matchMedia or the existing useIsMobile hook. This keeps
 * the hook pure and testable.
 *
 * @param maxTilt - Maximum tilt angle in degrees (default: 8)
 */
export function useTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null)

  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.15s ease-out',
  })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) {
        return
      }

      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      setStyle({
        transform: `perspective(800px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`,
        transition: 'transform 0.15s ease-out',
      })
    },
    [maxTilt]
  )

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.4s ease-out',
    })
  }, [])

  return { ref, style, handleMouseMove, handleMouseLeave }
}
