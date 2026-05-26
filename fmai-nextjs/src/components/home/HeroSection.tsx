import { HeroSpline } from '@/components/hero/HeroSpline'
import { HeroSectionDesktop } from './HeroSectionDesktop'
import { HeroSectionMobile } from './HeroSectionMobile'

interface HeroSectionProps {
  badge: string
  headlineMain: string
  tagline: React.ReactNode
  subtitle: string
  trustAnchor: string
  ctaPrimary: string
  ctaSecondary: string
  trustClusterTarget: string
  trustClusterFounding: string
  trustClusterAvg: string
}

/*
  Server-rendered wrapper. Splits hero rendering by viewport so mobile
  doesn't pay the motion-react hydration cost (which pushed LCP to 3.14s
  on throttled mobile — the inline hydration long-task blocked paint
  until ~3s). Mobile gets the static CSS-animated variant; desktop keeps
  the full motion-react experience untouched.

  Both variants are SSR'd in HTML and gated by CSS (`lg:hidden` /
  `hidden lg:flex`). Two H1s exist in the DOM, but only one is visible
  per viewport, so they're not in screen-reader conflict in practice.
*/
export function HeroSection(props: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[85dvh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-8 lg:pb-20 overflow-hidden"
    >
      {/* 3D Robot — internally gates desktop scene vs mobile preview */}
      <HeroSpline />

      {/* Mobile (server, CSS animations) */}
      <div className="lg:hidden w-full">
        <div className="relative z-10 max-w-[720px]">
          <HeroSectionMobile {...props} />
        </div>
      </div>

      {/* Desktop (motion-react, unchanged behaviour) */}
      <div className="hidden lg:flex lg:flex-row items-center w-full gap-8">
        <div className="relative z-10 flex-1 max-w-[720px]">
          <HeroSectionDesktop {...props} />
        </div>
        <div className="flex-1" />
      </div>
    </section>
  )
}
