'use client'

import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'

export function HeroSpline() {
  return (
    <div className="flex-1 relative hidden lg:block min-h-[500px]">
      <div className="w-full h-[500px] relative overflow-hidden rounded-[20px] border border-border-primary bg-bg-surface/50">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#00D4AA" />

        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
