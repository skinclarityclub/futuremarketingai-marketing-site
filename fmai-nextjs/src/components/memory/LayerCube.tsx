'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Brain, History, Layers, SlidersHorizontal, type LucideIcon } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion/easings'

type LayerKey = 'hot' | 'warm' | 'cold' | 'context'

interface LayerCopy {
  name: string
  window: string
  description: string
  prompt: string
  clydeAnswer: string
  codeLine: string
}

interface LayerCubeProps {
  layers: Record<LayerKey, LayerCopy>
  scrollLabel: string
  promptLabel: string
  clydeLabel: string
  codeLabel: string
}

const ORDER: LayerKey[] = ['hot', 'warm', 'cold', 'context']

const META: Record<
  LayerKey,
  { Icon: LucideIcon; tint: string; ring: string; glow: string; accent: string }
> = {
  hot: {
    Icon: Brain,
    tint: 'from-[#FF4D4D]/20 via-bg-surface to-bg-deep',
    ring: 'ring-[#FF4D4D]/50',
    glow: 'shadow-[0_30px_120px_-30px_rgba(255,77,77,0.45)]',
    accent: 'text-[#FF8A8A]',
  },
  warm: {
    Icon: History,
    tint: 'from-[#F5A623]/20 via-bg-surface to-bg-deep',
    ring: 'ring-[#F5A623]/50',
    glow: 'shadow-[0_30px_120px_-30px_rgba(245,166,35,0.45)]',
    accent: 'text-[#F5A623]',
  },
  cold: {
    Icon: Layers,
    tint: 'from-accent-system/20 via-bg-surface to-bg-deep',
    ring: 'ring-accent-system/50',
    glow: 'shadow-[0_30px_120px_-30px_rgba(0,212,170,0.45)]',
    accent: 'text-accent-system',
  },
  context: {
    Icon: SlidersHorizontal,
    tint: 'from-accent-human/20 via-bg-surface to-bg-deep',
    ring: 'ring-accent-human/50',
    glow: 'shadow-[0_30px_120px_-30px_rgba(245,166,35,0.4)]',
    accent: 'text-accent-human',
  },
}

export function LayerCube({
  layers,
  scrollLabel,
  promptLabel,
  clydeLabel,
  codeLabel,
}: LayerCubeProps) {
  const [active, setActive] = useState<number>(0)
  const triggerRefs = useRef<Array<HTMLElement | null>>([])
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null
        entries.forEach((entry) => {
          const indexAttr = entry.target.getAttribute('data-layer-index')
          if (!indexAttr) return
          const index = Number(indexAttr)
          if (!entry.isIntersecting) return
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio }
          }
        })
        if (best !== null) {
          setActive((best as { index: number; ratio: number }).index)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.4, 0.7, 1] }
    )
    triggerRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-16">
      {/* Sticky cube column */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div
          className="relative mx-auto w-full max-w-md aspect-[4/5]"
          style={{ perspective: '1400px' }}
          aria-hidden
        >
          <div
            className="relative h-full w-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: prefersReducedMotion
                ? undefined
                : 'rotateX(18deg) rotateY(-14deg)',
            }}
          >
            {ORDER.map((key, i) => {
              const meta = META[key]
              const isActive = i === active
              const baseZ = (ORDER.length - 1 - i) * -60
              const activeShift = isActive ? 80 : 0
              const fade = isActive ? 1 : 0.35
              return (
                <motion.div
                  key={key}
                  className={`absolute inset-0 rounded-[var(--radius-card)] border border-white/10 bg-gradient-to-br ${meta.tint} backdrop-blur-sm p-6 transition-shadow duration-500 ${
                    isActive ? `ring-2 ${meta.ring} ${meta.glow}` : ''
                  }`}
                  initial={false}
                  animate={
                    prefersReducedMotion
                      ? { opacity: isActive ? 1 : 0.6 }
                      : {
                          opacity: fade,
                          z: baseZ + activeShift,
                          y: i * 10,
                        }
                  }
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <meta.Icon className={`w-5 h-5 ${meta.accent}`} aria-hidden />
                      <span
                        className={`font-mono uppercase tracking-[0.18em] text-[11px] ${meta.accent}`}
                      >
                        {String(i + 1).padStart(2, '0')} / {layers[key].window}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-2xl font-display font-bold text-text-primary">
                    {layers[key].name}
                  </h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    {layers[key].description}
                  </p>
                  <div className="mt-5 rounded-md border border-white/5 bg-bg-deep/70 p-3 font-mono text-[11px] text-text-muted leading-relaxed">
                    <span className={meta.accent}>{'> '}</span>
                    {layers[key].codeLine}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
        {/* Tab-style picker, also acts as a11y interaction handle. */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center" role="tablist">
          {ORDER.map((key, i) => {
            const meta = META[key]
            const isActive = i === active
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`px-3 py-1.5 rounded-full font-mono uppercase tracking-[0.16em] text-[10px] transition-colors border ${
                  isActive
                    ? `border-transparent bg-white/10 text-text-primary ${meta.accent}`
                    : 'border-white/10 text-text-muted hover:text-text-primary hover:border-white/20'
                }`}
              >
                {String(i + 1).padStart(2, '0')} · {layers[key].name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scroll-trigger column with per-layer prompt + clyde answer */}
      <div className="flex flex-col gap-12 lg:gap-24">
        <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-text-muted">
          {scrollLabel}
        </p>
        {ORDER.map((key, i) => {
          const meta = META[key]
          return (
            <article
              key={key}
              ref={(el) => {
                triggerRefs.current[i] = el
              }}
              data-layer-index={i}
              className="relative scroll-mt-32"
            >
              <span
                className={`font-mono uppercase tracking-[0.18em] text-[10px] ${meta.accent}`}
              >
                {String(i + 1).padStart(2, '0')} · {layers[key].window}
              </span>
              <h3 className="mt-2 text-2xl md:text-3xl font-display font-bold text-text-primary">
                {layers[key].name}
              </h3>

              <div className="mt-5 rounded-[var(--radius-card)] border border-border-primary bg-bg-surface/60 backdrop-blur-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <p className="font-mono uppercase tracking-[0.16em] text-[10px] text-text-muted mb-1">
                    {promptLabel}
                  </p>
                  <p className="text-text-primary leading-relaxed">{layers[key].prompt}</p>
                </div>
                <div className="px-5 py-4 border-b border-white/5">
                  <p
                    className={`font-mono uppercase tracking-[0.16em] text-[10px] ${meta.accent} mb-1`}
                  >
                    {clydeLabel}
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {layers[key].clydeAnswer}
                  </p>
                </div>
                <div className="px-5 py-3 bg-bg-deep/60">
                  <p className="font-mono uppercase tracking-[0.16em] text-[10px] text-text-muted mb-1">
                    {codeLabel}
                  </p>
                  <pre className="font-mono text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                    <span className={meta.accent}>memory.</span>
                    <span className="text-text-primary">{key}</span>
                    <span className={meta.accent}>.recall</span>
                    <span className="text-text-muted">({layers[key].codeLine})</span>
                  </pre>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
