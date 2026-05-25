'use client'

import { motion } from 'motion/react'
import { ArrowRight, Brain, Layers, History, SlidersHorizontal } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { LucideIcon } from 'lucide-react'
import { EASE_OUT, VIEWPORT_DEFAULT } from '@/lib/motion/easings'

type LayerKey = 'context' | 'merken' | 'historie' | 'voorkeuren'

const LAYERS: { key: LayerKey; index: string; Icon: LucideIcon }[] = [
  { key: 'context',    index: '01', Icon: Brain              },
  { key: 'merken',     index: '02', Icon: Layers             },
  { key: 'historie',   index: '03', Icon: History            },
  { key: 'voorkeuren', index: '04', Icon: SlidersHorizontal  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const layerVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

interface MemoryUSPTeaserProps {
  eyebrow: string
  title: string
  intro: string
  layers: Record<LayerKey, { label: string; body: string }>
  ctaLink: string
}

export function MemoryUSPTeaser(props: MemoryUSPTeaserProps) {
  const { eyebrow, title, intro, layers, ctaLink } = props

  return (
    <section
      aria-labelledby="memory-usp"
      className="relative py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
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

        {/*
          4-layer stack with sequential reveal at scroll-in.
          MotionConfig reducedMotion=user strips x-translate; opacity stays.
        */}
        <motion.div
          className="relative rounded-[var(--radius-card)] overflow-hidden border border-border-primary bg-gradient-to-b from-bg-surface via-bg-surface/60 to-bg-deep"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_DEFAULT}
        >
          {LAYERS.map(({ key, index, Icon }, i) => (
            <motion.div
              key={key}
              variants={layerVariants}
              className={
                'relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 px-6 lg:px-8 py-6 lg:py-7' +
                (i > 0 ? ' border-t border-accent-system/20' : '')
              }
            >
              {/* Connector dot — links the layers as a visual through-line */}
              <span
                aria-hidden
                className="absolute left-6 lg:left-8 -top-[5px] hidden sm:block w-2 h-2 rounded-full bg-accent-system/40 ring-2 ring-bg-deep"
              />

              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0 sm:w-32">
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted">
                  {index}
                </span>
                <Icon className="w-5 h-5 text-accent-system" aria-hidden />
                <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-system">
                  {layers[key].label}
                </span>
              </div>

              <p className="text-base text-text-secondary leading-relaxed flex-1 max-w-2xl">
                {layers[key].body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
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

