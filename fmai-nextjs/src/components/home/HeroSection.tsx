'use client'

import { motion } from 'motion/react'
import { Zap, ArrowRight } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'
import { Link } from '@/i18n/navigation'
import { HeroSpline } from '@/components/hero/HeroSpline'
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

export function HeroSection(props: HeroSectionProps) {
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
    <section
      aria-labelledby="hero"
      className="relative min-h-[85dvh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-8 lg:pb-20 overflow-hidden"
    >
      {/* 3D Robot — absolute, bleeds across full hero */}
      <HeroSpline />

      <div className="flex flex-col lg:flex-row items-center w-full gap-8">
        {/* Left content */}
        <div className="relative z-10 flex-1 max-w-[720px]">
          {/* Eyebrow badge */}
          <motion.div
            className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-4 lg:mb-8 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            {badge}
          </motion.div>

          {/* Headline — kinetic word-by-word reveal on H1, plain tagline below.
              Premium 2-tier hierarchy (Anthropic/Cursor pattern) — single
              dominant display line + secondary tagline with accent fragment. */}
          <h1
            id="hero"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-3"
          >
            <KineticHeadline
              text={headlineMain}
              className="block"
              baseDelay={0.25}
            />
          </h1>

          {/* Tagline — secondary display line, fades in after H1 reveal */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl font-normal text-text-secondary mb-6 lg:mb-8 [&_span]:text-accent-system [&_span]:font-medium"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.05, duration: DEFAULT_DURATION, ease: EASE_OUT }}
          >
            {tagline}
          </motion.p>

          {/*
            Description — the mobile LCP element. Keep it SSR-visible
            (no `opacity: 0` initial) so LCP fires at FCP instead of
            waiting on the framer-motion animation. Subtle y-translate
            still happens because the element starts 12px below position
            and animates upward, but it's painted from the first frame.
          */}
          <motion.p
            className="speakable-hero text-base lg:text-xl text-text-secondary max-w-xl mb-4 lg:mb-6 leading-relaxed"
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: DEFAULT_DURATION, ease: EASE_OUT }}
          >
            {subtitle}
          </motion.p>

          {/* Trust anchor */}
          <motion.p
            className="speakable-tldr text-sm text-text-muted mb-6 lg:mb-10"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.7, duration: DEFAULT_DURATION, ease: EASE_OUT }}
          >
            {trustAnchor}
          </motion.p>

          {/* Trust cluster — client proof + founding scarcity + AVG badge */}
          <TrustClusterHero
            targetLabel={trustClusterTarget}
            foundingLabel={trustClusterFounding}
            avgLabel={trustClusterAvg}
          />

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-start gap-3"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.9, duration: DEFAULT_DURATION, ease: EASE_OUT }}
          >
            <CTAButton href="/apply" size="lg">
              <Zap className="mr-1 h-5 w-5" />
              {ctaPrimary}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>

            <Link
              href="/skills/clyde"
              className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
            >
              {ctaSecondary}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Right spacer — reserves space for the absolute-positioned 3D scene */}
        <div className="flex-1 hidden lg:block" />
      </div>
    </section>
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
