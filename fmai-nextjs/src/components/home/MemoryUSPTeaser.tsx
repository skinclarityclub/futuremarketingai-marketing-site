'use client'

import { motion } from 'motion/react'
import { ArrowRight, Brain, Layers, History, SlidersHorizontal } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { LucideIcon } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion/easings'
import { MemoryLiveComparison } from './MemoryLiveComparison'

type LayerKey = 'context' | 'merken' | 'historie' | 'voorkeuren'

const LAYERS: { key: LayerKey; index: string; Icon: LucideIcon }[] = [
  { key: 'context',    index: '01', Icon: Brain              },
  { key: 'merken',     index: '02', Icon: Layers             },
  { key: 'historie',   index: '03', Icon: History            },
  { key: 'voorkeuren', index: '04', Icon: SlidersHorizontal  },
]

// Sequential cascade: comparison demo eerst, dan 4 layers in 2x2 grid.
// Stagger 0.14s + 0.5s per item houdt totale reveal onder ~1s.
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_OUT },
  },
}

const MEMORY_VIEWPORT = { once: true, margin: '-80px' } as const

interface MemoryUSPTeaserProps {
  eyebrow: string
  title: string
  intro: string
  layers: Record<LayerKey, { label: string; body: string }>
  compare: {
    eyebrow: string
    promptLabel: string
    responseLabel: string
    prompt: string
    otherLabel: string
    otherTag: string
    otherResponse: string
    otherWarning: string
    clydeLabel: string
    clydeTag: string
    clydeResponse: string
    clydeProof: string
  }
  ctaLink: string
}

export function MemoryUSPTeaser(props: MemoryUSPTeaserProps) {
  const { eyebrow, title, intro, layers, compare, ctaLink } = props

  return (
    <section
      aria-labelledby="memory-usp"
      className="relative py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 lg:mb-12 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {eyebrow}
          </p>
          <h2
            id="memory-usp"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary"
          >
            {title}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary">
            {intro}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={MEMORY_VIEWPORT}
          className="flex flex-col gap-10 lg:gap-12"
        >
          {/* Live comparison demo — beide responses typen parallel in als bewijs */}
          <motion.div variants={itemVariants}>
            <MemoryLiveComparison
              eyebrow={compare.eyebrow}
              promptLabel={compare.promptLabel}
              responseLabel={compare.responseLabel}
              prompt={compare.prompt}
              otherLabel={compare.otherLabel}
              otherTag={compare.otherTag}
              otherResponse={compare.otherResponse}
              otherWarning={compare.otherWarning}
              clydeLabel={compare.clydeLabel}
              clydeTag={compare.clydeTag}
              clydeResponse={compare.clydeResponse}
              clydeProof={compare.clydeProof}
            />
          </motion.div>

          {/* 4-laags geheugen — 2x2 bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {LAYERS.map(({ key, index, Icon }) => (
              <motion.div
                key={key}
                variants={itemVariants}
                className="relative rounded-[var(--radius-card)] border border-border-primary bg-bg-surface/30 p-6 lg:p-7"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted">
                    {index}
                  </span>
                  <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-system/10 text-accent-system">
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-system">
                    {layers[key].label}
                  </span>
                </div>
                <p className="text-sm lg:text-[15px] text-text-secondary leading-relaxed">
                  {layers[key].body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/memory"
            className="inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
          >
            {ctaLink}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

