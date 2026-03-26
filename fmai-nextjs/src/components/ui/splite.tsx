'use client'

import { Suspense, lazy, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  /** Static preview image shown instantly while 3D loads */
  previewSrc?: string
}

/**
 * SplineScene — smooth-loading 3D scene with instant static preview.
 *
 * Strategy:
 * 1. Show static WebP screenshot instantly (13KB, zero delay)
 * 2. Defer Spline mount until browser is idle (requestIdleCallback)
 * 3. Pause blur-blob CSS animations during WebGL shader compilation
 * 4. Cross-fade from static image to interactive 3D (0.8s ease-out)
 * 5. Resume blob animations after scene is stable
 */
export function SplineScene({ scene, className, previewSrc }: SplineSceneProps) {
  const [shouldMount, setShouldMount] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const onLoad = useCallback(() => {
    // Let GPU render a few frames before revealing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLoaded(true)
        // Resume blob animations
        document.documentElement.classList.remove('spline-loading')
      })
    })
  }, [])

  useEffect(() => {
    // Pause heavy blur-blobs while WebGL initializes
    document.documentElement.classList.add('spline-loading')

    // Defer Spline mount until browser is idle
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setShouldMount(true), { timeout: 2500 })
      return () => cancelIdleCallback(id)
    } else {
      const t = setTimeout(() => setShouldMount(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className={className} style={{ contain: 'layout paint', position: 'relative' }}>
      {/* Static preview — visible instantly, fades out when 3D is ready */}
      {previewSrc && (
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.8s ease-out',
            pointerEvents: loaded ? 'none' : 'auto',
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

      {/* Interactive 3D — loads behind the preview, fades in when ready */}
      {shouldMount && (
        <Suspense fallback={null}>
          <div
            className="w-full h-full"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.8s ease-out',
            }}
          >
            <Spline scene={scene} className="w-full h-full" onLoad={onLoad} />
          </div>
        </Suspense>
      )}
    </div>
  )
}
