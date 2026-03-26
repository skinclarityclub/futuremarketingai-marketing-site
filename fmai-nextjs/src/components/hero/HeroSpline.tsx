'use client'

import { SplineScene } from '@/components/ui/splite'

export function HeroSpline() {
  return (
    <>
      {/* Desktop — interactive 3D Spline scene */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        {/* Ambient glow — radiates from the robot's position (reduced blur for performance) */}
        <div
          className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(168,85,247,0.1) 40%, transparent 65%)',
            filter: 'blur(80px)',
            willChange: 'auto',
          }}
        />

        {/* Spline scene — masked with CSS mask for seamless edges */}
        <div
          className="absolute top-0 right-[-5%] w-[60%] h-full pointer-events-auto"
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
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
            previewSrc="/images/hero-robot.webp"
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
              linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)
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
              'radial-gradient(ellipse, rgba(0,212,255,0.18) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)',
            animation: 'heroGridGlow 4s ease-in-out infinite',
          }}
        />

        {/* Horizon accent line */}
        <div
          className="absolute top-[52%] left-[8%] right-[8%] h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(0,212,255,0.25) 30%, rgba(168,85,247,0.25) 70%, transparent)',
          }}
        />
      </div>
    </>
  )
}
