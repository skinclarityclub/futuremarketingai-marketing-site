import { Check } from 'lucide-react'

interface KeyTakeawaysProps {
  items: string[]
  /** Heading shown above the list. Defaults to "Key takeaways". */
  title?: string
}

/**
 * Scannable summary box, rendered near the top of a cornerstone article.
 * Doubles as an AI-citation anchor: concise, quotable claims.
 */
export function KeyTakeaways({ items, title = 'Key takeaways' }: KeyTakeawaysProps) {
  if (!items.length) return null

  return (
    <aside className="my-8 rounded-xl border border-accent-system/20 bg-accent-system/[0.04] p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-system">
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent-system" />
            <span className="text-sm leading-relaxed text-text-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
