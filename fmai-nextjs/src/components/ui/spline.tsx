'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Dynamic import with SSR disabled — prevents server-side WebGL errors
// and splits the 638KB Spline runtime into a separate chunk
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
})

interface SplineSceneProps {
  scene: string
  className?: string
  /** Static preview image shown instantly while 3D loads */
  previewSrc?: string
}

/**
 * SplineScene — progressive 3D loading with zero perceived jank.
 *
 * The Spline runtime (638KB) blocks the main thread for ~1.6s during
 * shader compilation. We can't prevent this, but we can HIDE it:
 *
 * 1. Show static WebP preview instantly (17KB, priority image)
 * 2. Wait 3s for page to be fully interactive (text, animations, nav)
 * 3. Mount Spline behind the preview (invisible, opacity: 0)
 * 4. Main thread blocks for ~1.6s BUT user sees the static preview
 * 5. After onLoad, cross-fade from preview to interactive 3D
 * 6. Resume blob animations
 *
 * The user never notices the block because the preview covers it.
 */
export function SplineScene({ scene, className, previewSrc }: SplineSceneProps) {
  const [phase, setPhase] = useState<'preview' | 'loading' | 'ready'>('preview')
  const mountedRef = useRef(false)
  // Returns null on first SSR pass, boolean after hydration. We treat null as
  // "no preference yet" so the 3D path is only skipped after a confirmed read.
  const reducedMotion = useReducedMotion()

  const onLoad = useCallback(() => {
    // GPU needs a few frames to stabilize after shader compilation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('ready')
          document.documentElement.classList.remove('spline-loading')
        })
      })
    })
  }, [])

  useEffect(() => {
    // Pause blur-blobs during the entire loading process
    document.documentElement.classList.add('spline-loading')

    // Reduced-motion: stay on the static preview indefinitely. Skips the
    // 638KB Spline runtime download + shader compilation, in line with WCAG
    // 2.3.3 Animation from Interactions. Preview WebP already gives the user
    // the brand image; the 3D interactivity is the motion-bearing feature.
    if (reducedMotion) {
      document.documentElement.classList.remove('spline-loading')
      return
    }

    // Save-data hint: visitors on metered or restricted connections (mobile
    // data saver, Lite Mode, etc.) get the static preview only. Same payload
    // savings as reduced-motion — 638KB Spline runtime never downloads.
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean }
    }
    if (nav.connection?.saveData) {
      document.documentElement.classList.remove('spline-loading')
      return
    }

    // Idle-defer the upgrade so hero text + LCP image paint first, the
    // navbar hydrates, and any above-fold interactions finish. Falls back
    // to a 3-second setTimeout on Safari, which still lacks
    // requestIdleCallback in stable as of 2026-05-19. The `timeout: 4000`
    // option guarantees the callback fires within 4s even on a busy main
    // thread, so the Spline upgrade does not get starved forever.
    type IdleHandle = number
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => IdleHandle
      cancelIdleCallback?: (handle: IdleHandle) => void
    }
    const w = window as IdleWindow

    let idleHandle: IdleHandle | null = null
    let timerHandle: ReturnType<typeof setTimeout> | null = null

    const upgrade = () => {
      if (!mountedRef.current) {
        mountedRef.current = true
        setPhase('loading')
      }
    }

    if (typeof w.requestIdleCallback === 'function') {
      idleHandle = w.requestIdleCallback(upgrade, { timeout: 4000 })
    } else {
      timerHandle = setTimeout(upgrade, 3000)
    }

    return () => {
      if (idleHandle !== null && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleHandle)
      }
      if (timerHandle !== null) {
        clearTimeout(timerHandle)
      }
    }
  }, [reducedMotion])

  return (
    <div className={className} style={{ contain: 'layout paint', position: 'relative' }}>
      {/* Static preview — always rendered, fades out when 3D ready */}
      {previewSrc && (
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: phase === 'ready' ? 0 : 1,
            transition: 'opacity 1s ease-out',
            pointerEvents: phase === 'ready' ? 'none' : 'auto',
          }}
        >
          <Image
            src={previewSrc}
            alt=""
            fill
            className="object-contain object-center"
            priority
            sizes="60vw"
          />
        </div>
      )}

      {/* Interactive 3D — mounts after 3s delay, hidden until onLoad */}
      {phase !== 'preview' && (
        <div
          className="w-full h-full absolute inset-0"
          style={{
            opacity: phase === 'ready' ? 1 : 0,
            transition: 'opacity 1s ease-out',
          }}
        >
          <Spline scene={scene} className="w-full h-full" onLoad={onLoad} />
        </div>
      )}
    </div>
  )
}
