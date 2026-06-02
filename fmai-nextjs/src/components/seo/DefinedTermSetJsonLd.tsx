/**
 * DefinedTermSet / DefinedTerm JSON-LD emitter (KB-05).
 *
 * Emits a single DefinedTermSet whose members are the glossary terms. Each
 * DefinedTerm gets a locale-scoped @id pointing at its `/kennisbank#<id>` anchor,
 * matching the anchor ids rendered by <Glossary />. This is a high-leverage,
 * low-cost AI/LLM-citation signal: it tells generative engines that the page
 * is an authoritative definition source for the program's core entities.
 *
 * Refs:
 * - https://schema.org/DefinedTermSet
 * - https://schema.org/DefinedTerm
 */
import { JsonLd } from './JsonLd'
import { SITE_URL } from '@/lib/seo-config'

interface DefinedTermSetJsonLdProps {
  locale: string
  terms: { id: string; name: string; definition: string }[]
}

export function DefinedTermSetJsonLd({ locale, terms }: DefinedTermSetJsonLdProps) {
  const setId = `${SITE_URL}/${locale}/kennisbank#glossary`

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': setId,
    name: 'GEO & AI marketing glossary',
    hasDefinedTerm: terms.map((term) => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/${locale}/kennisbank#${term.id}`,
      name: term.name,
      description: term.definition,
      inDefinedTermSet: setId,
    })),
  }

  return <JsonLd data={data} />
}
