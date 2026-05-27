import { ArrowRight, RefreshCw } from 'lucide-react'

interface ImprovementLoopCycleProps {
  eyebrow: string
  title: string
  description: string
  stages: [string, string, string, string]
}

/**
 * Cyclic 4-stage flow visualisation for the /how-it-works improvement loop.
 * 4 stage-tiles met arrow connectors, sequential pulse via CSS animation-delay.
 * WHY: een muted text-tile zegt "loop" maar toont 'm niet. Visuele cyclus
 * maakt het continue ritme tastbaar voor scanning users.
 */
export function ImprovementLoopCycle({
  eyebrow,
  title,
  description,
  stages,
}: ImprovementLoopCycleProps) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-accent-system/25 bg-gradient-to-br from-accent-system/[0.08] via-accent-system/[0.03] to-transparent p-8 lg:p-10">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-system/15 blur-3xl"
        aria-hidden="true"
      />

      <style>{`
        @keyframes hiwLoopPulse {
          0%, 100% { border-color: var(--color-border-primary); background-color: rgba(10, 13, 20, 0.6); }
          15%, 30% { border-color: rgba(0, 212, 170, 0.55); background-color: rgba(0, 212, 170, 0.08); }
        }
        .hiw-loop-tile { animation: hiwLoopPulse 4.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hiw-loop-tile { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-3xl text-center space-y-3">
        <p className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-xs text-accent-system">
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          {eyebrow}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold font-display text-text-primary">
          {title}
        </h3>
        <p className="text-text-secondary leading-relaxed">{description}</p>
      </div>

      <ol
        className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-2 lg:flex-nowrap"
        aria-label={title}
      >
        {stages.map((stage, index) => (
          <li
            key={stage}
            className="flex items-center gap-2 sm:flex-1"
          >
            <div
              className="hiw-loop-tile relative flex-1 rounded-[var(--radius-button)] border px-4 py-3 text-center"
              style={{ animationDelay: `${index * 1.2}s` }}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block font-semibold text-text-primary">
                {stage}
              </span>
            </div>
            {index < stages.length - 1 ? (
              <ArrowRight
                className="hidden h-4 w-4 shrink-0 text-accent-system/60 sm:block"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {stages[0]} <span className="text-accent-system/60">→</span> {stages[1]}{' '}
        <span className="text-accent-system/60">→</span> {stages[2]}{' '}
        <span className="text-accent-system/60">→</span> {stages[3]}{' '}
        <span className="text-accent-system">↻</span>
      </p>
    </div>
  )
}
