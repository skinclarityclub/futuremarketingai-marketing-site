import type { ReactNode } from 'react'
import { Info, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react'

type CalloutVariant = 'info' | 'warning' | 'tip' | 'success'

const VARIANTS: Record<
  CalloutVariant,
  { Icon: typeof Info; accent: string; ring: string }
> = {
  info: { Icon: Info, accent: 'text-accent-system', ring: 'border-accent-system/30 bg-accent-system/[0.06]' },
  warning: { Icon: AlertTriangle, accent: 'text-accent-human', ring: 'border-accent-human/30 bg-accent-human/[0.06]' },
  tip: { Icon: Lightbulb, accent: 'text-accent-human', ring: 'border-accent-human/30 bg-accent-human/[0.06]' },
  success: { Icon: CheckCircle2, accent: 'text-status-active', ring: 'border-status-active/30 bg-status-active/[0.06]' },
}

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: ReactNode
}

/**
 * Inline MDX callout for emphasis, warnings, and tips inside long-form articles.
 * Usage in MDX: <Callout variant="tip" title="...">body</Callout>
 */
export function Callout({ variant = 'info', title, children }: CalloutProps) {
  const { Icon, accent, ring } = VARIANTS[variant]

  return (
    <div className={`my-6 flex gap-3 rounded-xl border p-4 ${ring}`}>
      <Icon aria-hidden className={`mt-0.5 h-5 w-5 shrink-0 ${accent}`} />
      <div className="min-w-0 space-y-1">
        {title && <p className={`font-display text-sm font-semibold ${accent}`}>{title}</p>}
        <div className="text-sm leading-relaxed text-text-secondary [&>p]:m-0 [&>p+p]:mt-2">
          {children}
        </div>
      </div>
    </div>
  )
}
