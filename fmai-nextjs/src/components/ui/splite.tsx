'use client'

import { Suspense, lazy, useState, useCallback, useEffect } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Soft ambient glow matching robot position */}
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,255,0.25) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)',
            animation: 'glow-pulse 2.5s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-12 rounded-full border border-cyan-500/15"
          style={{ animation: 'spin 4s linear infinite' }}
        />
      </div>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [shouldMount, setShouldMount] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const onLoad = useCallback(() => {
    // Small delay to let GPU finish first few frames behind the fade
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLoaded(true)
        // Resume blob animations after Spline is stable
        document.documentElement.classList.remove('spline-loading')
      })
    })
  }, [])

  useEffect(() => {
    // Pause heavy CSS blur-blobs while WebGL initializes
    document.documentElement.classList.add('spline-loading')

    // Defer Spline mount until browser is idle (hero text animates first)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setShouldMount(true), { timeout: 2500 })
      return () => cancelIdleCallback(id)
    } else {
      const t = setTimeout(() => setShouldMount(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div
      className={className}
      style={{ contain: 'layout paint' }}
    >
      {shouldMount ? (
        <Suspense fallback={<SplineSkeleton />}>
          <div
            className="w-full h-full"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.8s ease-out',
            }}
          >
            <Spline scene={scene} className="w-full h-full" onLoad={onLoad} />
          </div>
          {!loaded && (
            <div className="absolute inset-0">
              <SplineSkeleton />
            </div>
          )}
        </Suspense>
      ) : (
        <SplineSkeleton />
      )}
    </div>
  )
}
