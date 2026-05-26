'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Check, X } from 'lucide-react'

const THINKING_MS = 1000
const WORD_REVEAL_MS = 58
const VERDICT_DELAY_MS = 350
const VERDICT_HOLD_MS = 1500
const FINAL_HOLD_MS = 4500

type Stage =
  | 'thinkingOther'
  | 'typingOther'
  | 'verdictOther'
  | 'thinkingClyde'
  | 'typingClyde'
  | 'verdictClyde'
  | 'finalHold'

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
  const [stage, setStage] = useState<Stage>('thinkingOther')
  const [otherWordCount, setOtherWordCount] = useState(0)
  const [clydeWordCount, setClydeWordCount] = useState(0)
  const [cycle, setCycle] = useState(0)

  const otherWords = props.otherResponse.split(' ')
  const clydeWords = props.clydeResponse.split(' ')

  useEffect(() => {
    if (reduced) {
      setStage('finalHold')
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

    // Reset
    setStage('thinkingOther')
    setOtherWordCount(0)
    setClydeWordCount(0)

    // Phase A — Andere AI: thinking -> typing -> verdict
    wait(() => setStage('typingOther'), THINKING_MS)
    otherWords.forEach((_, i) => {
      wait(() => setOtherWordCount(i + 1), THINKING_MS + i * WORD_REVEAL_MS)
    })
    const otherTypingEnd = THINKING_MS + otherWords.length * WORD_REVEAL_MS
    wait(() => setStage('verdictOther'), otherTypingEnd + VERDICT_DELAY_MS)

    // Phase B — Clyde: thinking -> typing -> verdict
    const phaseBStart = otherTypingEnd + VERDICT_DELAY_MS + VERDICT_HOLD_MS
    wait(() => setStage('thinkingClyde'), phaseBStart)
    wait(() => setStage('typingClyde'), phaseBStart + THINKING_MS)
    clydeWords.forEach((_, i) => {
      wait(
        () => setClydeWordCount(i + 1),
        phaseBStart + THINKING_MS + i * WORD_REVEAL_MS
      )
    })
    const clydeTypingEnd = phaseBStart + THINKING_MS + clydeWords.length * WORD_REVEAL_MS
    wait(() => setStage('verdictClyde'), clydeTypingEnd + VERDICT_DELAY_MS)

    // Final hold both, then loop
    wait(() => setStage('finalHold'), clydeTypingEnd + VERDICT_DELAY_MS + 200)
    wait(() => setCycle((c) => c + 1), clydeTypingEnd + VERDICT_DELAY_MS + FINAL_HOLD_MS)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [cycle, reduced, otherWords.length, clydeWords.length])

  // Stage helpers per card
  const otherActive = stage === 'thinkingOther' || stage === 'typingOther'
  const otherShowVerdict =
    stage === 'verdictOther' ||
    stage === 'thinkingClyde' ||
    stage === 'typingClyde' ||
    stage === 'verdictClyde' ||
    stage === 'finalHold' ||
    reduced
  const otherShowResponse =
    stage === 'typingOther' ||
    stage === 'verdictOther' ||
    stage === 'thinkingClyde' ||
    stage === 'typingClyde' ||
    stage === 'verdictClyde' ||
    stage === 'finalHold' ||
    reduced
  const otherShowThinking = stage === 'thinkingOther'

  const clydeActive = stage === 'thinkingClyde' || stage === 'typingClyde'
  const clydeShowVerdict = stage === 'verdictClyde' || stage === 'finalHold' || reduced
  const clydeShowResponse = stage === 'typingClyde' || stage === 'verdictClyde' || stage === 'finalHold' || reduced
  const clydeShowThinking = stage === 'thinkingClyde'

  // Dimming: inactive card dims until both are revealed
  const otherDimmed = stage === 'thinkingClyde' || stage === 'typingClyde'
  const clydeDimmed = stage === 'thinkingOther' || stage === 'typingOther' || stage === 'verdictOther'

  return (
    <div>
      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-text-muted mb-4">
        {props.eyebrow}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        <ResponseCard
          tone="muted"
          active={otherActive}
          dimmed={otherDimmed}
          label={props.otherLabel}
          tag={props.otherTag}
          promptLabel={props.promptLabel}
          prompt={props.prompt}
          responseLabel={props.responseLabel}
          showThinking={otherShowThinking}
          showResponse={otherShowResponse}
          revealedResponse={otherWords.slice(0, otherWordCount).join(' ')}
          showCaret={stage === 'typingOther'}
          showVerdict={otherShowVerdict}
          verdict={props.otherWarning}
          verdictIcon="x"
        />
        <ResponseCard
          tone="accent"
          active={clydeActive}
          dimmed={clydeDimmed}
          label={props.clydeLabel}
          tag={props.clydeTag}
          promptLabel={props.promptLabel}
          prompt={props.prompt}
          responseLabel={props.responseLabel}
          showThinking={clydeShowThinking}
          showResponse={clydeShowResponse}
          revealedResponse={clydeWords.slice(0, clydeWordCount).join(' ')}
          showCaret={stage === 'typingClyde'}
          showVerdict={clydeShowVerdict}
          verdict={props.clydeProof}
          verdictIcon="check"
        />
      </div>
    </div>
  )
}

interface ResponseCardProps {
  tone: 'muted' | 'accent'
  active: boolean
  dimmed: boolean
  label: string
  tag: string
  promptLabel: string
  prompt: string
  responseLabel: string
  showThinking: boolean
  showResponse: boolean
  revealedResponse: string
  showCaret: boolean
  showVerdict: boolean
  verdict: string
  verdictIcon: 'x' | 'check'
}

function ResponseCard(props: ResponseCardProps) {
  const isAccent = props.tone === 'accent'
  const VerdictIcon = props.verdictIcon === 'check' ? Check : X

  const baseClasses =
    'rounded-[var(--radius-card)] p-5 lg:p-6 flex flex-col gap-3 min-h-[280px] transition-all duration-500'

  const toneClasses = isAccent
    ? 'border bg-accent-system/[0.04] '
    : 'border bg-bg-surface/40 '

  const borderClasses = props.active
    ? isAccent
      ? 'border-accent-system/60 shadow-[0_0_40px_rgba(0,212,170,0.18)]'
      : 'border-text-muted/40 shadow-[0_0_28px_rgba(255,255,255,0.04)]'
    : isAccent
      ? 'border-accent-system/30 shadow-[0_0_24px_rgba(0,212,170,0.06)]'
      : 'border-border-primary shadow-none'

  const dimClass = props.dimmed ? 'opacity-50' : 'opacity-100'

  return (
    <div className={`${baseClasses} ${toneClasses} ${borderClasses} ${dimClass}`}>
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
        {props.active && (
          <span
            aria-hidden
            className={
              'ml-auto inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.16em] ' +
              (isAccent ? 'text-accent-system' : 'text-text-muted')
            }
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span
                className={
                  'absolute inset-0 rounded-full animate-ping opacity-75 ' +
                  (isAccent ? 'bg-accent-system' : 'bg-text-muted')
                }
              />
              <span
                className={
                  'relative inline-block w-1.5 h-1.5 rounded-full ' +
                  (isAccent ? 'bg-accent-system' : 'bg-text-muted')
                }
              />
            </span>
            Live
          </span>
        )}
      </div>

      {/* Prompt */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted mb-1">
          {props.promptLabel}
        </p>
        <p className="text-xs lg:text-sm text-text-secondary leading-relaxed">{props.prompt}</p>
      </div>

      {/* Response area — thinking dots OR typing reveal OR empty placeholder */}
      <div className="flex-1">
        <p
          className={
            'text-[10px] font-mono uppercase tracking-[0.16em] mb-1.5 ' +
            (isAccent ? 'text-accent-system' : 'text-text-muted')
          }
        >
          {props.responseLabel}
        </p>
        {props.showThinking ? (
          <TypingDots tone={props.tone} />
        ) : props.showResponse ? (
          <p
            className={
              'text-xs lg:text-sm leading-relaxed font-mono ' +
              (isAccent ? 'text-text-primary' : 'text-text-secondary')
            }
          >
            {props.revealedResponse}
            {props.showCaret && (
              <span
                aria-hidden
                className={
                  'ml-0.5 inline-block w-1.5 h-3.5 align-middle animate-pulse ' +
                  (isAccent ? 'bg-accent-system/70' : 'bg-text-muted/50')
                }
              />
            )}
          </p>
        ) : (
          <p className="text-xs text-text-muted/40 italic font-mono">…</p>
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
