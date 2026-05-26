import { Zap, ArrowRight } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'
import { Link } from '@/i18n/navigation'
import { TrustClusterHero } from '@/components/marketing/TrustClusterHero'

interface HeroSectionMobileProps {
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
  Server-rendered mobile hero variant. The desktop variant (HeroSectionDesktop)
  is a `'use client'` motion-react component — its hydration cost on throttled
  mobile pushed LCP to 3.14s because the inline hydration long-task blocks
  paint until ~3s. This variant has zero JS hydration and uses CSS keyframes
  declared in globals.css. LCP-element (the subtitle paragraph) paints as
  soon as CSS arrives (~1.7s on throttled 4G).

  One animation per semantic block (eyebrow / headline / tagline / subtitle /
  trust-anchor / cta) instead of per-word — that avoids the v8/v9 mobile-GPU
  regression where 8+ parallel CSS anims caused paint flushes.
*/
export function HeroSectionMobile(props: HeroSectionMobileProps) {
  const {
    badge,
    headlineMain,
    tagline,
    subtitle,
    trustAnchor,
    ctaPrimary,
    ctaSecondary,
    trustClusterTarget,
    trustClusterFounding,
    trustClusterAvg,
  } = props

  const ease = 'cubic-bezier(0.23, 1, 0.32, 1)'

  return (
    <>
      <p
        className="hero-mobile-anim inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-4 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system"
        style={{ animation: `hero-mobile-fade-up-sm 0.6s ${ease} 0s both` }}
      >
        {badge}
      </p>

      <h1
        className="hero-mobile-anim text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-text-primary mb-3"
        style={{ animation: `hero-mobile-fade-up-sm 0.55s ${ease} 0.15s both` }}
      >
        {headlineMain}
      </h1>

      <p
        className="hero-mobile-anim text-xl sm:text-2xl font-normal text-text-secondary mb-6 [&_span]:text-accent-system [&_span]:font-medium"
        style={{ animation: `hero-mobile-fade-up-sm 0.55s ${ease} 0.3s both` }}
      >
        {tagline}
      </p>

      {/*
        LCP element — paints from the first frame. No `opacity:0` initial
        state, just a 12px slide-up that holds the visible final transform.
        The `both` fill-mode means the element is at translateY(12px) until
        the anim begins, which still counts as paintable.
      */}
      <p
        className="hero-mobile-anim speakable-hero text-base text-text-secondary max-w-xl mb-4 leading-relaxed"
        style={{ animation: `hero-mobile-slide-up-sm 0.45s ${ease} 0.1s both` }}
      >
        {subtitle}
      </p>

      <p
        className="hero-mobile-anim speakable-tldr text-sm text-text-muted mb-6"
        style={{ animation: `hero-mobile-fade-up-sm 0.55s ${ease} 0.5s both` }}
      >
        {trustAnchor}
      </p>

      <TrustClusterHero
        targetLabel={trustClusterTarget}
        foundingLabel={trustClusterFounding}
        avgLabel={trustClusterAvg}
      />

      <div
        className="hero-mobile-anim flex flex-col items-start gap-3"
        style={{ animation: `hero-mobile-fade-up-sm 0.55s ${ease} 0.7s both` }}
      >
        <CTAButton href="/apply" size="lg" prefetch={false}>
          <Zap className="mr-1 h-5 w-5" />
          {ctaPrimary}
          <ArrowRight className="ml-1 h-4 w-4" />
        </CTAButton>

        <Link
          href="/skills/clyde"
          prefetch={false}
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
        >
          {ctaSecondary}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  )
}
