'use client'

import { Layers, Crown, ShieldCheck, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { EASE_OUT, STAGGER_FAST, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

type SecondarySignal = { value: string; label: string; linkText: string }

type Props = {
  eyebrow: string
  hero: {
    valueLead: string
    valueTrail: string
    label: string
    detail: string
    linkText: string
  }
  signals: {
    skills: SecondarySignal
    founding: SecondarySignal
    sovereignty: SecondarySignal
  }
}

const SECONDARIES = [
  {
    key: 'skills' as const,
    Icon: Layers,
    href: '/skills',
    accent: 'system' as const,
  },
  {
    key: 'founding' as const,
    Icon: Crown,
    href: '/founding-member',
    accent: 'human' as const,
  },
  {
    key: 'sovereignty' as const,
    Icon: ShieldCheck,
    href: '/privacy',
    accent: 'system' as const,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_FAST } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
}

export function TrustSignalsGrid({ eyebrow, hero, signals }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULT}
    >
      <motion.p
        variants={itemVariants}
        className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-8 md:mb-10"
      >
        {eyebrow}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Hero tile — case-study proof */}
        <motion.article
          variants={itemVariants}
          className="md:col-span-3 group relative overflow-hidden border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:border-accent-system/35"
        >
          {/* subtle radial accent in background, top-right */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full bg-accent-system/[0.06] blur-3xl"
          />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-baseline gap-2 md:gap-3">
                <span className="font-display text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] text-accent-system tabular-nums">
                  {hero.valueLead}
                </span>
                <span className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-text-secondary leading-none">
                  {hero.valueTrail}
                </span>
              </div>
              <h3 className="mt-5 md:mt-6 font-display text-lg md:text-xl lg:text-2xl font-semibold text-text-primary leading-snug">
                {hero.label}
              </h3>
              <p className="mt-2 text-sm md:text-base text-text-secondary leading-relaxed">
                {hero.detail}
              </p>
            </div>
            <Link
              href="/case-studies/skinclarity-club"
              className="shrink-0 inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
            >
              {hero.linkText}
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </motion.article>

        {/* Secondary tiles */}
        {SECONDARIES.map(({ key, Icon, href, accent }) => {
          const { value, label, linkText } = signals[key]
          const isFounding = accent === 'human'
          const tileClass = isFounding
            ? 'border border-accent-human/40 bg-gradient-to-b from-accent-human/[0.06] to-transparent'
            : 'border border-border-primary bg-white/[0.02]'
          const numberClass = isFounding ? 'text-accent-human' : 'text-accent-system'
          const iconClass = isFounding ? 'text-accent-human' : 'text-accent-system'

          return (
            <motion.article
              key={key}
              variants={itemVariants}
              className={`group relative flex flex-col ${tileClass} backdrop-blur-sm rounded-2xl p-5 md:p-6 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 ${
                isFounding
                  ? 'hover:border-accent-human/60'
                  : 'hover:border-accent-system/35'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-4 h-4 ${iconClass}`} aria-hidden />
                {isFounding && (
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-accent-human/80">
                    Schaarste
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`font-display text-3xl md:text-4xl font-bold leading-none ${numberClass} tabular-nums`}
                >
                  {value}
                </span>
              </div>
              <p className="mt-3 text-sm text-text-secondary leading-snug">{label}</p>
              <Link
                href={href}
                className="mt-auto pt-5 inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-system transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
              >
                {linkText}
                <ArrowRight className="w-3 h-3 shrink-0" aria-hidden />
              </Link>
            </motion.article>
          )
        })}
      </div>
    </motion.div>
  )
}
