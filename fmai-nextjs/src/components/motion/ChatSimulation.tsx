'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

const TYPE_SPEED_MS = 32
const REVEAL_WORD_MS = 65
const PAUSE_AFTER_USER_MS = 500
const THINKING_MS = 1200
const HOLD_AFTER_RESPONSE_MS = 3200
const PAIR_GAP_MS = 700

type Stage = 'typingUser' | 'pauseAfterUser' | 'thinking' | 'revealingClyde' | 'hold'

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

export interface ChatPair {
  user: string
  clyde: string
}

interface ChatSimulationProps {
  pairs: readonly ChatPair[]
  userLabel: string
  clydeLabel: string
}

export function ChatSimulation({ pairs, userLabel, clydeLabel }: ChatSimulationProps) {
  const reduced = usePrefersReducedMotion()
  const [pairIdx, setPairIdx] = useState(0)
  const [stage, setStage] = useState<Stage>('typingUser')
  const [animatedUserText, setUserText] = useState('')
  const [animatedClydeWords, setClydeWords] = useState(0)

  const current = pairs[pairIdx] ?? pairs[0]
  const clydeWordList = current.clyde.split(' ')

  // Derive visible state in render so reduced-motion users never hit a
  // setState-in-effect (React 19 react-hooks/set-state-in-effect rule).
  // When reduced motion is on we just show the full pair immediately;
  // the animation effect below early-returns and no state is touched.
  const userText = reduced ? current.user : animatedUserText
  const clydeWords = reduced ? clydeWordList.length : animatedClydeWords

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const next = (fn: () => void, delay: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn()
      }, delay)
    }

    if (stage === 'typingUser') {
      setUserText('')
      setClydeWords(0)
      const target = current.user
      const typeChar = (i: number) => {
        if (cancelled) return
        setUserText(target.slice(0, i + 1))
        if (i + 1 < target.length) {
          next(() => typeChar(i + 1), TYPE_SPEED_MS)
        } else {
          next(() => setStage('pauseAfterUser'), PAUSE_AFTER_USER_MS)
        }
      }
      next(() => typeChar(0), 200)
    } else if (stage === 'pauseAfterUser') {
      next(() => setStage('thinking'), 0)
    } else if (stage === 'thinking') {
      next(() => setStage('revealingClyde'), THINKING_MS)
    } else if (stage === 'revealingClyde') {
      const revealWord = (i: number) => {
        if (cancelled) return
        setClydeWords(i + 1)
        if (i + 1 < clydeWordList.length) {
          next(() => revealWord(i + 1), REVEAL_WORD_MS)
        } else {
          next(() => setStage('hold'), HOLD_AFTER_RESPONSE_MS)
        }
      }
      next(() => revealWord(0), 0)
    } else if (stage === 'hold') {
      next(() => {
        setPairIdx((i) => (i + 1) % pairs.length)
        setStage('typingUser')
      }, PAIR_GAP_MS)
    }

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [stage, pairIdx, reduced, current.user, clydeWordList.length])

  const showThinking = !reduced && stage === 'thinking'
  const showClyde = stage === 'revealingClyde' || stage === 'hold' || reduced

  return (
    <div className="flex flex-col gap-2.5" aria-live="polite">
      {/* User bubble */}
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-[10px] font-mono uppercase tracking-[0.14em] text-text-muted mt-1 w-10">
          {userLabel}
        </span>
        <p className="flex-1 font-mono text-xs lg:text-sm text-text-primary leading-relaxed min-h-[1.2em]">
          <span>{userText}</span>
          {!reduced && stage === 'typingUser' && (
            <span
              aria-hidden
              className="ml-0.5 inline-block w-1.5 h-3.5 align-middle bg-accent-system/70 animate-pulse"
            />
          )}
        </p>
      </div>

      {/* Clyde response or thinking */}
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-[10px] font-mono uppercase tracking-[0.14em] text-accent-system mt-1 w-10">
          {clydeLabel}
        </span>
        <div className="flex-1 min-h-[1.2em]">
          {showThinking && <TypingDots />}
          {showClyde && (
            <p className="font-mono text-xs lg:text-sm text-text-secondary leading-relaxed">
              {clydeWordList.slice(0, clydeWords).join(' ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Clyde is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent-system/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
