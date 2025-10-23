/**
 * Term Definitions Component
 *
 * SEO and LLM-optimized glossary of key marketing automation terms.
 * Uses semantic HTML <dl> (definition list) for maximum LLM extraction.
 *
 * @see LANDING-PAGE-COMPREHENSIVE-AUDIT-2025.md - LLM Content Optimization
 */

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TermDefinitionsProps {
  /** Show advanced terms in addition to core terms */
  showAdvanced?: boolean
  /** Filter by category */
  category?: string
  /** Show as compact list (no cards) */
  compact?: boolean
  className?: string
}

/**
 * Term Definitions Component
 *
 * Displays marketing automation terminology in LLM-friendly format.
 *
 * @example
 * ```tsx
 * <TermDefinitions />
 *
 * // Compact footer glossary
 * <TermDefinitions compact showAdvanced />
 *
 * // Filter by category
 * <TermDefinitions category="Feature" />
 * ```
 */
export const TermDefinitions: React.FC<TermDefinitionsProps> = ({
  showAdvanced = false,
  category,
  compact = false,
  className = '',
}) => {
  const { t } = useTranslation(['seo'])

  // Load terms from translations
  const coreTerms = t('seo:terms.core_terms', { returnObjects: true }) as Array<{
    term: string
    definition: string
    category: string
  }>
  const advancedTerms = t('seo:terms.advanced_terms', { returnObjects: true }) as Array<{
    term: string
    definition: string
    category: string
  }>

  // Combine terms and filter by category if specified
  const allTerms = showAdvanced ? [...coreTerms, ...advancedTerms] : coreTerms
  const filteredTerms = category ? allTerms.filter((term) => term.category === category) : allTerms

  // Group terms by category for organized display
  const groupedTerms = filteredTerms.reduce(
    (acc, term) => {
      if (!acc[term.category]) {
        acc[term.category] = []
      }
      acc[term.category].push(term)
      return acc
    },
    {} as Record<string, Array<(typeof filteredTerms)[number]>>
  )

  if (compact) {
    return (
      <div className={className}>
        {/* Semantic definition list for LLM extraction */}
        <dl className="space-y-4">
          {filteredTerms.map((item) => (
            <div key={item.term} className="border-l-2 border-blue-500 pl-4">
              <dt className="font-semibold text-white mb-1">{item.term}</dt>
              <dd className="text-sm text-blue-100">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-100">{t('seo:terms.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('seo:terms.title')}</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">{t('seo:terms.subtitle')}</p>
        </div>

        {/* Terms by Category */}
        {Object.entries(groupedTerms).map(([cat, terms]) => (
          <div key={cat} className="mb-12 last:mb-0">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              {cat}
            </h3>

            {/* Semantic Definition List - Optimal for LLM extraction */}
            <dl className="grid md:grid-cols-2 gap-6">
              {terms.map((item, index) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <dt className="text-xl font-bold text-white mb-2 flex items-start gap-2">
                    <span className="text-blue-400 text-2xl">•</span>
                    {item.term}
                  </dt>
                  <dd className="text-blue-100 leading-relaxed pl-7">{item.definition}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        ))}

        {/* CTA to Learn More */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-2">{t('seo:terms.cta_title')}</h3>
          <p className="text-blue-100 mb-4">{t('seo:terms.cta_description')}</p>
          <a
            href="/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {t('seo:terms.cta_button')}
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Inline Term Tooltip
 *
 * Use this to define terms inline within content.
 *
 * @example
 * ```tsx
 * Our <TermTooltip term="ROAS" /> improved by 3.2x.
 * ```
 */
export const TermTooltip: React.FC<{ term: string; children?: React.ReactNode }> = ({
  term,
  children,
}) => {
  const { t } = useTranslation(['seo'])

  const coreTerms = t('seo:terms.core_terms', { returnObjects: true }) as Array<{
    term: string
    definition: string
    category: string
  }>
  const advancedTerms = t('seo:terms.advanced_terms', { returnObjects: true }) as Array<{
    term: string
    definition: string
    category: string
  }>

  const allTerms = [...coreTerms, ...advancedTerms]
  const termDef = allTerms.find((t) => t.term === term)

  if (!termDef) {
    return <span>{children || term}</span>
  }

  return (
    <abbr
      title={termDef.definition}
      className="cursor-help border-b border-dotted border-blue-400 text-blue-300 no-underline hover:text-blue-200 transition-colors"
    >
      {children || term}
    </abbr>
  )
}

export default TermDefinitions
