'use client'

import Image from 'next/image'
import { SplineScene } from '@/components/ui/splite'

export function HeroSpline() {
  return (
    <>
      {/* Desktop — interactive 3D Spline scene */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        {/* Ambient glow — radiates from the robot's position */}
        <div
          className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-25 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,255,0.35) 0%, rgba(168,85,247,0.12) 50%, transparent 70%)',
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
          }}
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Mobile — static robot image, lightweight */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        {/* Ambient glow — centered for mobile */}
        <div
          className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-20 blur-[80px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(168,85,247,0.15) 50%, transparent 70%)',
          }}
        />

        {/* Static robot render — behind text as atmospheric element */}
        <div
          className="absolute top-[15%] right-[-15%] w-[75%] h-[80%]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 10%, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 75%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 10%, black 65%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 75%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            opacity: 0.4,
          }}
        >
          <Image
            src="/images/hero-robot.png"
            alt="Clyde AI Marketing Employee"
            fill
            className="object-contain object-center"
            sizes="(max-width: 1024px) 75vw, 0px"
            priority
          />
        </div>
      </div>
    </>
  )
}
