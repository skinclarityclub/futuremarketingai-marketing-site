import type { BlogFaqItem } from '@/lib/blog'
import { FaqAccordion } from '@/components/home/FaqAccordion'

interface BlogFaqProps {
  items: BlogFaqItem[]
  /** Heading shown above the accordion. Defaults to "Veelgestelde vragen". */
  title?: string
}

/**
 * Renders article FAQs using the shared accordion. Pair with <FaqJsonLd> on the
 * page so the same Q&A pairs emit FAQPage structured data.
 */
export function BlogFaq({ items, title = 'Veelgestelde vragen' }: BlogFaqProps) {
  if (!items.length) return null

  return (
    <section className="mt-12 border-t border-border-primary pt-8">
      <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">{title}</h2>
      <FaqAccordion
        items={items.map((item, i) => ({
          key: String(i),
          question: item.question,
          answer: item.answer,
        }))}
      />
    </section>
  )
}
