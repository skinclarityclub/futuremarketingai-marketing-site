'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { SplineScene } from '@/components/ui/spline'

export function HeroSpline() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // W5.3 — GSAP ScrollTrigger scrub on the Spline wrapper. Imports are
  // dynamic so the 85 kB gsap bundle never lands on reduced-motion users
  // or in SSR. The Spline runtime API isn't reliably exposed here, so we
  // animate the wrapper transform (rotate + scale + opacity) instead —
  // visually the robot zooms / spins as the user scrolls past the hero.
  useEffect(() => {
    if (reduced || !sceneRef.current || !containerRef.current) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.to(sceneRef.current, {
          rotateZ: 15,
          scale: 0.78,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }, containerRef)

      cleanup = () => ctx.revert()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reduced])

  return (
    <>
      {/* Desktop — interactive 3D Spline scene */}
      <div
        ref={containerRef}
        className="absolute inset-0 hidden lg:block pointer-events-none"
      >
        {/* Ambient glow — radiates from the robot's position (reduced blur for performance).
            Teal (system) core fading to amber (human) edge: brand-color narrative,
            not the deprecated cyan/purple. */}
        <div
          className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,170,0.35) 0%, rgba(245,166,35,0.10) 45%, transparent 70%)',
            filter: 'blur(80px)',
            willChange: 'auto',
          }}
        />

        {/* Spline scene — masked with CSS mask for seamless edges */}
        <div
          ref={sceneRef}
          className="absolute top-0 right-[-5%] w-[60%] h-full pointer-events-auto will-change-transform"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%), linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%), linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            contain: 'layout paint',
          }}
        >
          <SplineScene
            scene="/spline/scene.splinecode"
            className="w-full h-full"
            previewSrc="/images/hero-robot-preview.webp"
          />
        </div>
      </div>

      {/* Mobile — perspective grid with radial glow */}
      <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
        {/* Perspective grid floor */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[55%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,170,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,170,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center bottom',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)',
          }}
        />

        {/* Central radial glow */}
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-full blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(0,212,170,0.20) 0%, rgba(245,166,35,0.08) 45%, transparent 70%)',
            animation: 'heroGridGlow 4s ease-in-out infinite',
          }}
        />

        {/* Horizon accent line — teal-to-amber sweep mirrors brand duet */}
        <div
          className="absolute top-[52%] left-[8%] right-[8%] h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,212,170,0.28) 30%, rgba(245,166,35,0.22) 70%, transparent)',
          }}
        />
      </div>
    </>
  )
}
