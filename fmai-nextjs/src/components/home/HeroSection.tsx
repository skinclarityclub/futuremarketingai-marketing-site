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
  /** Localized alt for the hero preview image (homepage LCP candidate). */
  imageAlt: string
}

/*
  Server-rendered wrapper. Splits hero rendering by viewport so mobile
  doesn't pay the motion-react hydration cost (which pushed LCP to 3.14s
  on throttled mobile — the inline hydration long-task blocked paint
  until ~3s). Mobile gets the static CSS-animated variant; desktop keeps
  the full motion-react experience untouched.

  Both variants are SSR'd in HTML and gated by CSS (`lg:hidden` /
  `hidden lg:flex`). To keep exactly one <h1> TAG in the SSR HTML (the
  crawler counts tags, not visible elements), the mobile variant owns the
  real <h1> and the desktop variant renders the same headline as
  role="heading" aria-level={1}. Only one is visible per viewport, so
  there's no screen-reader conflict.
*/
export function HeroSection({ imageAlt, ...props }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[85dvh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-8 lg:pb-20 overflow-hidden"
    >
      {/* 3D Robot — internally gates desktop scene vs mobile preview */}
      <HeroSpline imageAlt={imageAlt} />

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
