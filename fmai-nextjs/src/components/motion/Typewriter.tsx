'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { twMerge } from 'tailwind-merge'

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

interface TypewriterProps {
  /** Set of strings to cycle. Must have at least 1 entry. */
  prompts: readonly string[]
  /** Element classes for the rendered text. */
  className?: string
  /** Show a blinking caret after the text. Default true. */
  caret?: boolean
  /** ARIA live region for screen readers. Default 'polite'. */
  ariaLive?: 'off' | 'polite' | 'assertive'
}

/**
 * Typewriter — rotating string display.
 * Types each prompt in, holds, deletes, then advances. Reduced-motion safe:
 * shows the first prompt statically and skips the timer loop. Used in
 * ClydeFeaturedTile + skill-page heroes.
 */
export function Typewriter({
  prompts,
  className,
  caret = true,
  ariaLive = 'polite',
}: TypewriterProps) {
  const reduced = usePrefersReducedMotion()
  const [text, setText] = useState(prompts[0] ?? '')
  const [promptIndex, setPromptIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    if (prompts.length === 0) return

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

    const current = prompts[promptIndex] ?? ''
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
    <p className={twMerge('font-mono text-sm text-text-primary leading-snug', className)} aria-live={ariaLive}>
      <span>{text}</span>
      {caret && !reduced && (
        <span
          aria-hidden
          className="ml-0.5 inline-block w-2 h-4 align-middle bg-accent-system/70 animate-pulse"
        />
      )}
    </p>
  )
}
