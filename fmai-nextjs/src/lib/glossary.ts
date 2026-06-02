/**
 * Glossary term registry (KB-05).
 *
 * Structural data ONLY — copy (name + definition) lives in the `glossary`
 * message namespace (NL authoritative) and is resolved per-locale by the page
 * that renders <Glossary />. Keeping copy out of this module preserves the
 * i18n single-source-of-truth rule and lets the same id drive both the
 * `#anchor` and the DefinedTerm `@id` fragment.
 *
 * Categories reuse the BLOG_CATEGORIES taxonomy (geo / ai-marketing-automation /
 * agency-ops) so the knowledge base stays consistent across blog + resources.
 */

export interface GlossaryTermRef {
  /** anchor id + DefinedTerm @id fragment. Must be a stable URL-safe slug. */
  id: string
  category: 'geo' | 'ai-marketing-automation' | 'agency-ops'
}

export const GLOSSARY_TERMS: GlossaryTermRef[] = [
  { id: 'geo', category: 'geo' },
  { id: 'ai-marketing-medewerker', category: 'ai-marketing-automation' },
  { id: 'citation-monitoring', category: 'geo' },
  { id: 'tier-caps', category: 'agency-ops' },
]
