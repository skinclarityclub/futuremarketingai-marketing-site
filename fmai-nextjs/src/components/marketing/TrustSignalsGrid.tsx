'use client'

import { Sparkles, Layers, Crown, ShieldCheck, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { EASE_OUT, STAGGER_FAST, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

type SignalContent = { value: string; label: string; linkText: string }

type Props = {
  signals: {
    caseStudy: SignalContent
    skills: SignalContent
    founding: SignalContent
    sovereignty: SignalContent
  }
}

const SIGNALS = [
  { key: 'caseStudy' as const,   Icon: Sparkles,    href: '/case-studies/skinclarity-club', accent: 'text-accent-system' },
  { key: 'skills' as const,      Icon: Layers,      href: '/skills',                        accent: 'text-accent-system' },
  { key: 'founding' as const,    Icon: Crown,       href: '/founding-member',               accent: 'text-accent-human' },
  { key: 'sovereignty' as const, Icon: ShieldCheck, href: '/privacy',                       accent: 'text-accent-system' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_FAST },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

export function TrustSignalsGrid({ signals }: Props) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_DEFAULT}
    >
      {SIGNALS.map(({ key, Icon, href, accent }) => {
        const { value, label, linkText } = signals[key]
        return (
          <motion.div
            key={key}
            variants={itemVariants}
            className="flex flex-col border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-2xl p-5 md:p-6 min-h-[180px] md:min-h-[200px] transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5"
          >
            <Icon className={`w-5 h-5 shrink-0 mb-3 ${accent}`} aria-hidden />
            <span className="text-2xl md:text-3xl font-bold leading-tight text-accent-system">
              {value}
            </span>
            <span className="mt-1 text-xs md:text-sm text-text-secondary">{label}</span>
            <span className="block w-8 h-px bg-border-primary my-3" aria-hidden />
            <Link
              href={href}
              className="mt-auto flex items-center gap-1 min-h-[44px] text-xs text-text-muted hover:text-accent-system transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
            >
              {linkText}
              <ArrowRight className="w-3 h-3 shrink-0" aria-hidden />
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
