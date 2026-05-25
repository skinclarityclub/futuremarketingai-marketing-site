'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { ArrowRight, Bot } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const TYPE_SPEED_MS = 50
const DELETE_SPEED_MS = 30
const HOLD_BEFORE_DELETE_MS = 2000
const PAUSE_BEFORE_TYPE_MS = 400

function subscribePrefersReducedMotion(callback: () => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getPrefersReducedMotionSnapshot(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerSnapshot(): boolean {
  return false
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getServerSnapshot
  )
}

interface ClydeFeaturedTileProps {
  title: string
  description: string
  statusLabel: string
  promptIntro: string
  prompts: readonly [string, string, string]
  openLink: string
}

export function ClydeFeaturedTile(props: ClydeFeaturedTileProps) {
  const { title, description, statusLabel, promptIntro, prompts, openLink } = props
  const reduced = usePrefersReducedMotion()

  const [text, setText] = useState(prompts[0])
  const [promptIndex, setPromptIndex] = useState(0)

  useEffect(() => {
    if (reduced) {
      // No-op: when reduced-motion is on, we want the first prompt frozen.
      // setText/setPromptIndex would cascade on every mount; rely on the
      // useState initial values + skip the animation loop instead.
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const typeNext = (current: string, written: number) => {
      if (cancelled) return
      if (written < current.length) {
        setText(current.slice(0, written + 1))
        timer = setTimeout(() => typeNext(current, written + 1), TYPE_SPEED_MS)
      } else {
        timer = setTimeout(() => deleteNext(current, current.length), HOLD_BEFORE_DELETE_MS)
      }
    }

    const deleteNext = (current: string, remaining: number) => {
      if (cancelled) return
      if (remaining > 0) {
        setText(current.slice(0, remaining - 1))
        timer = setTimeout(() => deleteNext(current, remaining - 1), DELETE_SPEED_MS)
      } else {
        timer = setTimeout(() => {
          if (cancelled) return
          setPromptIndex((i) => (i + 1) % prompts.length)
        }, PAUSE_BEFORE_TYPE_MS)
      }
    }

    const current = prompts[promptIndex]
    timer = setTimeout(() => {
      setText('')
      typeNext(current, 0)
    }, PAUSE_BEFORE_TYPE_MS)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [promptIndex, reduced, prompts])

  return (
    <Link
      href="/skills/clyde"
      aria-labelledby="clyde-featured"
      className="group relative rounded-[var(--radius-card)] border border-accent-system/40 bg-gradient-to-br from-accent-system/[0.08] via-bg-surface/40 to-transparent p-6 lg:p-8 flex flex-col gap-5 transition-all duration-300 hover:bg-accent-system/[0.04] hover:border-accent-system/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system h-full"
    >
      {/* Status pulse + Clyde header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid place-items-center w-9 h-9 rounded-xl bg-accent-system/15 text-accent-system"
          >
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h3
              id="clyde-featured"
              className="font-display text-xl lg:text-2xl font-bold text-text-primary"
            >
              {title}
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-status-active/10 border border-status-active/30 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-status-active">
          <span aria-hidden className="relative inline-flex w-1.5 h-1.5">
            {!reduced && (
              <span className="absolute inset-0 rounded-full bg-status-active animate-ping opacity-75" />
            )}
            <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-status-active" />
          </span>
          {statusLabel}
        </span>
      </header>

      {/* Description */}
      <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-md">
        {description}
      </p>

      {/* Rotating typewriter prompt */}
      <div className="mt-auto rounded-xl border border-border-primary/70 bg-bg-deep/40 px-4 py-3 min-h-[78px]">
        <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted mb-1.5">
          {promptIntro}
        </p>
        <p
          className="font-mono text-sm text-text-primary leading-snug"
          aria-live="polite"
        >
          <span>{text}</span>
          {!reduced && (
            <span
              aria-hidden
              className="ml-0.5 inline-block w-2 h-4 align-middle bg-accent-system/70 animate-pulse"
            />
          )}
        </p>
      </div>

      {/* Open link footer */}
      <footer>
        <span className="inline-flex items-center gap-1.5 text-sm text-accent-system group-hover:text-text-primary transition-colors">
          {openLink}
          <ArrowRight
            className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </footer>
    </Link>
  )
}
