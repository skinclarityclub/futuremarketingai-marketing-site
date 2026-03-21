'use client'

import { SplineScene } from '@/components/ui/splite'

export function HeroSpline() {
  return (
    <div className="absolute inset-0 hidden lg:block pointer-events-none">
      {/* Ambient glow — radiates from the robot's position */}
      <div
        className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(168,85,247,0.15) 50%, transparent 70%)',
        }}
      />

      {/* Spline scene — full hero height, positioned right */}
      <div className="absolute top-0 right-[-5%] w-[55%] h-full pointer-events-auto">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Fade masks — seamless blend into background */}
      {/* Left fade: robot dissolves toward text */}
      <div
        className="absolute top-0 left-[30%] w-[25%] h-full z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #050814 0%, transparent 100%)',
        }}
      />
      {/* Bottom fade: robot dissolves into next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #050814 0%, transparent 100%)',
        }}
      />
      {/* Right edge fade */}
      <div
        className="absolute top-0 right-0 w-24 h-full z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #050814 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
