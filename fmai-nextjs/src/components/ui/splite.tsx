'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

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

    // Wait 3 seconds for page to be fully rendered and interactive
    // This ensures hero text animations, navbar, and CSS play first
    const timer = setTimeout(() => {
      if (!mountedRef.current) {
        mountedRef.current = true
        setPhase('loading')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

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
