'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { Brain, RotateCcw, User } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion/easings'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

type Turn = {
  user: string
  diy: string
  clyde: string
}

interface MemoryComparisonProps {
  eyebrow: string
  title: string
  intro: string
  turns: Turn[]
  diyLabel: string
  diyNote: string
  clydeLabel: string
  clydeNote: string
  userLabel: string
  replayLabel: string
}

export function MemoryComparison(props: MemoryComparisonProps) {
  const {
    eyebrow,
    title,
    intro,
    turns,
    diyLabel,
    diyNote,
    clydeLabel,
    clydeNote,
    userLabel,
    replayLabel,
  } = props

  const prefersReducedMotion = useReducedMotion()
  const [visibleTurns, setVisibleTurns] = useState<number>(prefersReducedMotion ? turns.length : 0)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  // Auto-advance turns when section scrolls into view.
  useEffect(() => {
    if (prefersReducedMotion) return
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            // Reveal turn-by-turn with paced delay.
            for (let i = 0; i < turns.length; i++) {
              window.setTimeout(() => setVisibleTurns(i + 1), 700 + i * 1600)
            }
          }
        })
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion, turns.length])

  const replay = () => {
    setVisibleTurns(0)
    for (let i = 0; i < turns.length; i++) {
      window.setTimeout(() => setVisibleTurns(i + 1), 220 + i * 1400)
    }
  }

  return (
    <div ref={sectionRef} className="relative">
      <div className="mb-10 max-w-3xl mx-auto text-center">
        <EyebrowLabel className="inline-block">{eyebrow}</EyebrowLabel>
        <h3 className="mt-3 text-3xl md:text-4xl font-display font-bold text-text-primary">
          {title}
        </h3>
        <p className="mt-4 text-text-secondary text-lg leading-relaxed">{intro}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* DIY column */}
        <div className="rounded-[var(--radius-card)] border border-border-primary bg-bg-surface/40 p-5 lg:p-6">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-text-muted" aria-hidden />
              <span className="font-mono uppercase tracking-[0.18em] text-[11px] text-text-muted">
                {diyLabel}
              </span>
            </div>
            <span className="text-[11px] text-text-muted italic">{diyNote}</span>
          </header>
          <ul className="space-y-3">
            {turns.map((turn, i) => (
              <TurnRow
                key={`diy-${i}`}
                turn={turn}
                index={i}
                visible={i < visibleTurns}
                kind="diy"
                userLabel={userLabel}
              />
            ))}
          </ul>
        </div>

        {/* Clyde column */}
        <div className="rounded-[var(--radius-card)] border border-accent-system/30 bg-gradient-to-br from-accent-system/[0.06] via-bg-surface/40 to-bg-deep p-5 lg:p-6 shadow-[0_0_60px_-30px_rgba(0,212,170,0.4)]">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent-system" aria-hidden />
              <span className="font-mono uppercase tracking-[0.18em] text-[11px] text-accent-system">
                {clydeLabel}
              </span>
            </div>
            <span className="text-[11px] text-accent-system/80 italic">{clydeNote}</span>
          </header>
          <ul className="space-y-3">
            {turns.map((turn, i) => (
              <TurnRow
                key={`clyde-${i}`}
                turn={turn}
                index={i}
                visible={i < visibleTurns}
                kind="clyde"
                userLabel={userLabel}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/25 transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
          {replayLabel}
        </button>
      </div>
    </div>
  )
}

function TurnRow({
  turn,
  index,
  visible,
  kind,
  userLabel,
}: {
  turn: Turn
  index: number
  visible: boolean
  kind: 'diy' | 'clyde'
  userLabel: string
}) {
  return (
    <li className="space-y-1.5">
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <div className="flex gap-2 items-start">
              <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/5 text-text-muted">
                <User className="w-3 h-3" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="font-mono uppercase tracking-[0.16em] text-[10px] text-text-muted">
                  {userLabel} · {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-0.5 text-sm text-text-primary leading-relaxed">{turn.user}</p>
              </div>
            </div>
            <div
              className={`mt-2 ml-7 rounded-md px-3 py-2 text-sm leading-relaxed ${
                kind === 'clyde'
                  ? 'bg-accent-system/[0.08] border border-accent-system/15 text-text-secondary'
                  : 'bg-white/[0.03] border border-white/5 text-text-secondary'
              }`}
            >
              {kind === 'clyde' ? turn.clyde : turn.diy}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!visible && (
        <div className="h-[60px] rounded-md bg-white/[0.015] border border-white/5" aria-hidden />
      )}
    </li>
  )
}
