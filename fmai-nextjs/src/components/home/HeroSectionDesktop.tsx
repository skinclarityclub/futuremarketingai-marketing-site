'use client'

import { motion } from 'motion/react'
import { Zap, ArrowRight } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'
import { Link } from '@/i18n/navigation'
import { TrustClusterHero } from '@/components/marketing/TrustClusterHero'
import { EASE_OUT, DEFAULT_DURATION } from '@/lib/motion/easings'

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

export function HeroSectionDesktop(props: HeroSectionProps) {
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

  return (
    <>
      <motion.div
        className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-4 lg:mb-8 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        {badge}
      </motion.div>

      {/*
        role="heading" aria-level={1} instead of a real <h1>: the mobile
        variant (HeroSectionMobile) owns the single <h1> tag so the SSR HTML
        has exactly one h1 (avoids the H1_MULTIPLE crawler finding). This stays
        a semantic level-1 heading for screen readers on desktop.
      */}
      <div
        role="heading"
        aria-level={1}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-3"
      >
        <KineticHeadline text={headlineMain} className="block" baseDelay={0.25} />
      </div>

      <motion.p
        className="text-xl sm:text-2xl lg:text-3xl font-normal text-text-secondary mb-6 lg:mb-8 [&_span]:text-accent-system [&_span]:font-medium"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.05, duration: DEFAULT_DURATION, ease: EASE_OUT }}
      >
        {tagline}
      </motion.p>

      <motion.p
        className="speakable-hero text-base lg:text-xl text-text-secondary max-w-xl mb-4 lg:mb-6 leading-relaxed"
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: DEFAULT_DURATION, ease: EASE_OUT }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="speakable-tldr text-sm text-text-muted mb-6 lg:mb-10"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.7, duration: DEFAULT_DURATION, ease: EASE_OUT }}
      >
        {trustAnchor}
      </motion.p>

      <TrustClusterHero
        targetLabel={trustClusterTarget}
        foundingLabel={trustClusterFounding}
        avgLabel={trustClusterAvg}
      />

      <motion.div
        className="flex flex-col items-start gap-3"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.9, duration: DEFAULT_DURATION, ease: EASE_OUT }}
      >
        {/*
          prefetch={false} on both above-the-fold CTAs — the default
          auto-prefetch pulls /apply (Zod + ApplicationForm chunks) and
          /skills/clyde (ChatSimulation chunk) at idle, competing with
          hero LCP. Next.js still warm-fetches on hover, so the click
          penalty is ~50 ms vs. 1-2 s of contended bandwidth.
        */}
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
      </motion.div>
    </>
  )
}

interface KineticHeadlineProps {
  text: string
  className?: string
  style?: React.CSSProperties
  /** Delay before the first word animates in (seconds). */
  baseDelay?: number
}

/**
 * Word-by-word blur-stagger headline reveal. Caps total stagger duration so
 * long headlines don't drag — when there are more than 8 words, the per-word
 * delay shrinks to keep the full reveal under ~0.6s.
 *
 * MotionConfig reducedMotion="user" strips the blur + y-translate so the
 * fallback is a pure opacity fade.
 */
function KineticHeadline({ text, className, style, baseDelay = 0 }: KineticHeadlineProps) {
  const words = text.split(' ')
  const MAX_TOTAL_STAGGER = 1.1
  const PER_WORD_DELAY = Math.min(0.18, MAX_TOTAL_STAGGER / Math.max(words.length, 1))

  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            delay: baseDelay + i * PER_WORD_DELAY,
            duration: 0.55,
            ease: EASE_OUT,
          }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
