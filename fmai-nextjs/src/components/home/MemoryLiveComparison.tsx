'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Check, X } from 'lucide-react'

const THINKING_MS = 1100
const WORD_REVEAL_MS = 55
const VERDICT_DELAY_MS = 350
const HOLD_AFTER_MS = 6500

type Stage = 'thinking' | 'typing' | 'verdict' | 'hold'

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

export interface MemoryLiveComparisonProps {
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

export function MemoryLiveComparison(props: MemoryLiveComparisonProps) {
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState<Stage>('thinking')
  const [otherWordCount, setOtherWordCount] = useState(0)
  const [clydeWordCount, setClydeWordCount] = useState(0)
  const [cycle, setCycle] = useState(0)

  const otherWords = props.otherResponse.split(' ')
  const clydeWords = props.clydeResponse.split(' ')
  const longestCount = Math.max(otherWords.length, clydeWords.length)

  useEffect(() => {
    if (reduced) {
      setStage('verdict')
      setOtherWordCount(otherWords.length)
      setClydeWordCount(clydeWords.length)
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timers.push(t)
    }

    // Reset + start
    setStage('thinking')
    setOtherWordCount(0)
    setClydeWordCount(0)

    wait(() => {
      setStage('typing')
      // Reveal both responses word-by-word in parallel
      otherWords.forEach((_, i) => {
        wait(() => setOtherWordCount(i + 1), i * WORD_REVEAL_MS)
      })
      clydeWords.forEach((_, i) => {
        wait(() => setClydeWordCount(i + 1), i * WORD_REVEAL_MS)
      })
    }, THINKING_MS)

    const typingDuration = (longestCount - 1) * WORD_REVEAL_MS
    wait(() => setStage('verdict'), THINKING_MS + typingDuration + VERDICT_DELAY_MS)
    wait(
      () => setCycle((c) => c + 1),
      THINKING_MS + typingDuration + HOLD_AFTER_MS
    )

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [cycle, reduced, otherWords.length, clydeWords.length, longestCount])

  const showVerdict = stage === 'verdict' || stage === 'hold' || reduced

  return (
    <div>
      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted mb-4">
        {props.eyebrow}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        <ResponseCard
          tone="muted"
          label={props.otherLabel}
          tag={props.otherTag}
          promptLabel={props.promptLabel}
          prompt={props.prompt}
          responseLabel={props.responseLabel}
          revealedResponse={otherWords.slice(0, otherWordCount).join(' ')}
          stage={stage}
          showVerdict={showVerdict}
          verdict={props.otherWarning}
          verdictIcon="x"
        />
        <ResponseCard
          tone="accent"
          label={props.clydeLabel}
          tag={props.clydeTag}
          promptLabel={props.promptLabel}
          prompt={props.prompt}
          responseLabel={props.responseLabel}
          revealedResponse={clydeWords.slice(0, clydeWordCount).join(' ')}
          stage={stage}
          showVerdict={showVerdict}
          verdict={props.clydeProof}
          verdictIcon="check"
        />
      </div>
    </div>
  )
}

interface ResponseCardProps {
  tone: 'muted' | 'accent'
  label: string
  tag: string
  promptLabel: string
  prompt: string
  responseLabel: string
  revealedResponse: string
  stage: Stage
  showVerdict: boolean
  verdict: string
  verdictIcon: 'x' | 'check'
}

function ResponseCard(props: ResponseCardProps) {
  const isAccent = props.tone === 'accent'
  const VerdictIcon = props.verdictIcon === 'check' ? Check : X

  return (
    <div
      className={
        'rounded-[var(--radius-card)] p-5 lg:p-6 flex flex-col gap-3 min-h-[280px] ' +
        (isAccent
          ? 'border border-accent-system/40 bg-accent-system/[0.04] shadow-[0_0_32px_rgba(0,212,170,0.10)]'
          : 'border border-border-primary bg-bg-surface/40')
      }
    >
      {/* Card header — label + tag */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className={
            'text-[11px] font-mono uppercase tracking-[0.16em] font-semibold ' +
            (isAccent ? 'text-accent-system' : 'text-text-muted')
          }
        >
          {props.label}
        </span>
        <span className="text-[10px] font-mono text-text-muted/60">{props.tag}</span>
      </div>

      {/* Prompt */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted mb-1">
          {props.promptLabel}
        </p>
        <p className="text-xs lg:text-sm text-text-secondary leading-relaxed">{props.prompt}</p>
      </div>

      {/* Response area — thinking dots OR typing reveal */}
      <div className="flex-1">
        <p
          className={
            'text-[10px] font-mono uppercase tracking-[0.16em] mb-1.5 ' +
            (isAccent ? 'text-accent-system' : 'text-text-muted')
          }
        >
          {props.responseLabel}
        </p>
        {props.stage === 'thinking' ? (
          <TypingDots tone={props.tone} />
        ) : (
          <p
            className={
              'text-xs lg:text-sm leading-relaxed font-mono ' +
              (isAccent ? 'text-text-primary' : 'text-text-secondary')
            }
          >
            {props.revealedResponse}
            {props.stage === 'typing' && (
              <span
                aria-hidden
                className={
                  'ml-0.5 inline-block w-1.5 h-3.5 align-middle animate-pulse ' +
                  (isAccent ? 'bg-accent-system/70' : 'bg-text-muted/50')
                }
              />
            )}
          </p>
        )}
      </div>

      {/* Verdict — fades in after response complete */}
      <div
        className={
          'mt-1 flex items-start gap-2 text-xs leading-relaxed transition-opacity duration-300 ' +
          (props.showVerdict ? 'opacity-100' : 'opacity-0') +
          ' ' +
          (isAccent ? 'text-status-active' : 'text-error')
        }
      >
        <VerdictIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden />
        <span>{props.verdict}</span>
      </div>
    </div>
  )
}

function TypingDots({ tone }: { tone: 'muted' | 'accent' }) {
  const color = tone === 'accent' ? 'bg-accent-system/60' : 'bg-text-muted/50'
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={'inline-block w-1.5 h-1.5 rounded-full animate-bounce ' + color}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
