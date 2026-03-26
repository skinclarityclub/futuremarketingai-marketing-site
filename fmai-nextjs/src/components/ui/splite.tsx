'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
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

/**
 * SplineScene — renders a Spline 3D scene inside an iframe.
 *
 * Why iframe? Spline's WebGL shader compilation blocks the main thread,
 * causing jank in CSS animations and text rendering. An iframe isolates
 * the WebGL context in a separate browsing context, keeping the main
 * page smooth during initialization.
 *
 * The scene file is self-hosted at /spline/scene.splinecode for fast
 * same-origin delivery with Brotli compression.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)
  const [shouldMount, setShouldMount] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Listen for 'spline-loaded' message from iframe
  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === 'spline-loaded') {
      // Double rAF to let the iframe render a few frames before revealing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoaded(true)
          document.documentElement.classList.remove('spline-loading')
        })
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  useEffect(() => {
    // Pause blur-blobs while WebGL initializes in iframe
    document.documentElement.classList.add('spline-loading')

    // Defer iframe mount until browser is idle
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setShouldMount(true), { timeout: 2000 })
      return () => cancelIdleCallback(id)
    } else {
      const t = setTimeout(() => setShouldMount(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className={className} style={{ contain: 'layout paint' }}>
      {shouldMount && (
        <iframe
          ref={iframeRef}
          src="/spline/viewer.html"
          title="3D Robot"
          className="w-full h-full border-0"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
            colorScheme: 'normal',
            background: 'transparent',
          }}
          loading="eager"
          allow="autoplay"
        />
      )}
      {!loaded && (
        <div className="absolute inset-0">
          <SplineSkeleton />
        </div>
      )}
    </div>
  )
}
