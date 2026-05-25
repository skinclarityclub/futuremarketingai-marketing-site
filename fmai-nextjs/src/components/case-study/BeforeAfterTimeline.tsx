import type { ReactNode } from 'react'
import { Clock, Sparkles } from 'lucide-react'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'

interface TimelineStep {
  label: string
  body: string
  /** Optional duration estimate (e.g. "45 min/post") rendered as a chip. */
  duration?: string
}

interface BeforeAfterTimelineProps {
  beforeTitle: ReactNode
  beforeIntro?: ReactNode
  beforeSteps: readonly TimelineStep[]
  afterTitle: ReactNode
  afterIntro?: ReactNode
  afterSteps: readonly TimelineStep[]
  /** Optional accessible label for the wrapping section. */
  ariaLabel?: string
}

/**
 * BeforeAfterTimeline — side-by-side narrative of the pre-Clyde manual workflow
 * versus the post-Clyde autonomous workflow. Two columns on desktop, stacked on
 * mobile. Each column is a vertical sequence of steps with timing chips and a
 * subtle column tint to distinguish "before" (muted) from "after" (accent).
 *
 * Reveal motion via RevealContainer; reduced-motion is handled globally by
 * MotionConfig so transforms strip automatically and the columns simply fade.
 */
export function BeforeAfterTimeline({
  beforeTitle,
  beforeIntro,
  beforeSteps,
  afterTitle,
  afterIntro,
  afterSteps,
  ariaLabel,
}: BeforeAfterTimelineProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label={ariaLabel}>
      <Column
        title={beforeTitle}
        intro={beforeIntro}
        steps={beforeSteps}
        tone="muted"
      />
      <Column
        title={afterTitle}
        intro={afterIntro}
        steps={afterSteps}
        tone="accent"
      />
    </div>
  )
}

interface ColumnProps {
  title: ReactNode
  intro?: ReactNode
  steps: readonly TimelineStep[]
  tone: 'muted' | 'accent'
}

function Column({ title, intro, steps, tone }: ColumnProps) {
  const isAccent = tone === 'accent'
  const Icon = isAccent ? Sparkles : Clock
  return (
    <div
      className={
        'relative rounded-2xl border p-6 lg:p-8 ' +
        (isAccent
          ? 'border-accent-system/30 bg-accent-system/[0.04]'
          : 'border-border-primary bg-bg-surface/40')
      }
    >
      <div className="flex items-start gap-3 mb-4">
        <span
          aria-hidden
          className={
            'shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full ' +
            (isAccent
              ? 'bg-accent-system/15 text-accent-system'
              : 'bg-bg-elevated text-text-muted')
          }
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-text-primary">{title}</h3>
          {intro && (
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">{intro}</p>
          )}
        </div>
      </div>
      <RevealContainer as="ol" className="relative space-y-5 pl-5 border-l border-border-primary/70">
        {steps.map((step, idx) => (
          <RevealItem key={`${tone}-${idx}`} as="li" className="relative">
            <span
              aria-hidden
              className={
                'absolute -left-[1.55rem] top-[0.4rem] flex h-3 w-3 items-center justify-center rounded-full ' +
                (isAccent
                  ? 'bg-accent-system/30 ring-2 ring-accent-system'
                  : 'bg-bg-elevated ring-2 ring-border-primary')
              }
            >
              <span
                className={
                  'block h-1 w-1 rounded-full ' +
                  (isAccent ? 'bg-accent-system' : 'bg-text-muted')
                }
              />
            </span>
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-medium text-text-primary text-sm">{step.label}</span>
              {step.duration && (
                <span
                  className={
                    'font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full ' +
                    (isAccent
                      ? 'text-accent-system bg-accent-system/10'
                      : 'text-text-muted bg-bg-elevated')
                  }
                >
                  {step.duration}
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{step.body}</p>
          </RevealItem>
        ))}
      </RevealContainer>
    </div>
  )
}
