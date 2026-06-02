import type { BlogTocItem } from '@/lib/blog'

interface TableOfContentsProps {
  items: BlogTocItem[]
  /** Heading shown above the list. Defaults to "In dit artikel". */
  title?: string
}

/**
 * Anchor-based table of contents for long-form articles. Each `id` must match
 * the slugified heading id in the MDX body. Improves scannability + GEO
 * (engines extract section structure).
 */
export function TableOfContents({ items, title = 'In dit artikel' }: TableOfContentsProps) {
  if (!items.length) return null

  return (
    <nav aria-label={title} className="my-8 rounded-xl border border-border-primary bg-bg-surface/30 p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">{title}</p>
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-sm text-text-secondary transition-colors hover:text-accent-system"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
