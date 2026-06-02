import type { BlogCitation } from '@/lib/blog'

interface CitationsProps {
  items: BlogCitation[]
  /** Heading shown above the list. Defaults to "Bronnen". */
  title?: string
}

/**
 * Source list rendered at the foot of an article. Real, linkable sources are an
 * E-E-A-T signal and make the content safer to cite for AI engines.
 */
export function Citations({ items, title = 'Bronnen' }: CitationsProps) {
  if (!items.length) return null

  return (
    <section className="mt-12 border-t border-border-primary pt-8">
      <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">{title}</h2>
      <ol className="space-y-2">
        {items.map((c, i) => (
          <li key={i} className="text-sm leading-relaxed text-text-muted">
            <span className="mr-2 text-text-secondary">[{i + 1}]</span>
            {c.url ? (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-system hover:underline"
              >
                {c.title}
              </a>
            ) : (
              <span className="text-text-secondary">{c.title}</span>
            )}
            {c.source && <span>, {c.source}</span>}
            {c.year && <span> ({c.year})</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
