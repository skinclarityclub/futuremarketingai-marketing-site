import { HeroVideo } from '@/components/hero/HeroVideo'
import { HeroSectionDesktop } from './HeroSectionDesktop'
import { HeroSectionMobile } from './HeroSectionMobile'

interface HeroSectionProps {
  /** One-word brand name shown as an eyebrow above the badge (entity SEO signal). */
  brandKicker: string
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
  /** Localized description of the loop animation (aria-label on the video). */
  imageAlt: string
  videoPause: string
  videoPlay: string
  /** Only the NL render exists; other locales show the poster (Clyde's logo). */
  showVideo: boolean
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
export function HeroSection({ imageAlt, videoPause, videoPlay, showVideo, ...props }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-[85dvh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-8 lg:pb-20 overflow-hidden"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
        <div className="relative z-10 max-w-[720px]">
          {/* Mobile (server, CSS animations) */}
          <div className="lg:hidden">
            <HeroSectionMobile {...props} />
          </div>

          {/* Desktop (motion-react, unchanged behaviour) */}
          <div className="hidden lg:block">
            <HeroSectionDesktop {...props} />
          </div>
        </div>

        {/* The loop animation plays on desktop only; phones get its poster. */}
        <HeroVideo
          src={showVideo ? '/videos/clyde-kring.mp4' : undefined}
          poster="/images/clyde-kring-poster.webp"
          label={imageAlt}
          pauseLabel={videoPause}
          playLabel={videoPlay}
        />
      </div>
    </section>
  )
}
