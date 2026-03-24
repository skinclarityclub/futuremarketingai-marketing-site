'use client'

import { Suspense, lazy, useState, useCallback } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,170,0.3) 0%, rgba(245,166,35,0.1) 50%, transparent 70%)',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-8 rounded-full border border-accent-system/20"
          style={{ animation: 'spin 3s linear infinite' }}
        />
      </div>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => setLoaded(true), [])

  return (
    <div
      className={className}
      style={{
        contain: 'layout paint',
        willChange: 'transform',
      }}
    >
      <Suspense fallback={<SplineSkeleton />}>
        <div
          className="w-full h-full"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease-out' }}
        >
          <Spline scene={scene} className="w-full h-full" onLoad={onLoad} />
        </div>
        {!loaded && (
          <div className="absolute inset-0">
            <SplineSkeleton />
          </div>
        )}
      </Suspense>
    </div>
  )
}
