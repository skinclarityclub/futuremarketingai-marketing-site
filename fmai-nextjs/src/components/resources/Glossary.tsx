/**
 * Glossary section (KB-05) — pure presentational component.
 *
 * Receives already-resolved copy as props so the owning page handles i18n
 * (getTranslations) and this component stays a pure, copy-free renderer.
 * Each term gets an `id` anchor + `scroll-mt-28` so a deep link such as
 * `/resources#geo` lands below the sticky header instead of hiding under it.
 */

interface GlossaryTerm {
  id: string
  name: string
  definition: string
}

interface GlossaryProps {
  terms: GlossaryTerm[]
  heading: string
  intro: string
}

export function Glossary({ terms, heading, intro }: GlossaryProps) {
  return (
    <section aria-labelledby="glossary-heading" className="mx-auto max-w-3xl">
      <h2
        id="glossary-heading"
        className="font-display text-2xl font-semibold text-text-primary sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mt-3 text-text-secondary">{intro}</p>

      <dl className="mt-8 space-y-6">
        {terms.map((term) => (
          <div
            key={term.id}
            id={term.id}
            className="scroll-mt-28 rounded-xl border border-white/5 bg-bg-surface p-6"
          >
            <dt className="font-display text-lg font-semibold text-text-primary">
              {term.name}
            </dt>
            <dd className="mt-2 leading-relaxed text-text-secondary">{term.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
