/**
 * FAQ Section Component
 *
 * Optimized for both traditional SEO and LLM SEO with:
 * - Question-based H3 headings for LLM extraction
 * - Schema.org FAQPage markup
 * - Clear, concise answers
 * - Semantic HTML structure
 *
 * Content derived from demo knowledge base and platform documentation.
 *
 * @see LANDING-PAGE-COMPREHENSIVE-AUDIT-2025.md - LLM SEO Content Optimization
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StructuredData, createFAQSchema, type FAQItem } from './StructuredData'

interface FAQSectionProps {
  /** Additional FAQ items beyond the defaults */
  additionalFAQs?: FAQItem[]
  /** Maximum number of FAQs to show initially (rest are collapsible) */
  initialVisible?: number
  /** Show/hide schema markup (default: true) */
  includeSchema?: boolean
  /** Custom className for styling */
  className?: string
}

/**
 * FAQ Section Component
 *
 * Displays frequently asked questions in an SEO and LLM-optimized format.
 *
 * @example
 * ```tsx
 * <FAQSection />
 *
 * // With custom FAQs
 * <FAQSection
 *   additionalFAQs={[
 *     { question: 'Custom question?', answer: 'Custom answer.' }
 *   ]}
 *   initialVisible={5}
 * />
 * ```
 */
export const FAQSection: React.FC<FAQSectionProps> = ({
  additionalFAQs = [],
  initialVisible = 6,
  includeSchema = true,
  className = '',
}) => {
  const { t } = useTranslation(['seo'])
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)
  const [showAll, setShowAll] = React.useState(false)

  // Load FAQ items from translations
  const FAQ_ITEMS: FAQItem[] = t('seo:faq.items', { returnObjects: true }) as FAQItem[]

  // Combine default and additional FAQs
  const allFAQs = [...FAQ_ITEMS, ...additionalFAQs]

  // Determine visible FAQs
  const visibleFAQs = showAll ? allFAQs : allFAQs.slice(0, initialVisible)
  const hasMore = allFAQs.length > initialVisible

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <>
      {/* Schema.org FAQPage markup */}
      {includeSchema && <StructuredData type="FAQPage" data={createFAQSchema(allFAQs)} />}

      {/* FAQ Section */}
      <section className={`py-16 md:py-24 ${className}`}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('seo:faq.title')}</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">{t('seo:faq.subtitle')}</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {visibleFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-white/5 transition-colors"
                  aria-expanded={expandedIndex === index}
                >
                  {/* Question Text - H3 for SEO and LLM extraction */}
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>

                  {/* Chevron Icon */}
                  <ChevronDown
                    className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform duration-200 ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer Content */}
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-5"
                  >
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-blue-100 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-white font-medium transition-all"
              >
                {showAll ? (
                  <>
                    {t('seo:faq.show_less')}
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </>
                ) : (
                  <>
                    {t('seo:faq.show_more', { count: allFAQs.length - initialVisible })}
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* CTA Footer */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">
              {t('seo:faq.still_have_questions')}
            </h3>
            <p className="text-blue-100 mb-4">{t('seo:faq.cta_description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                {t('seo:faq.demo_button')}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                {t('seo:faq.contact_button')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * Compact FAQ variant for footer or sidebar
 */
export const FAQCompact: React.FC<{ maxItems?: number }> = ({ maxItems = 5 }) => {
  const { t } = useTranslation(['seo'])
  const FAQ_ITEMS: FAQItem[] = t('seo:faq.items', { returnObjects: true }) as FAQItem[]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">{t('seo:faq.quick_answers')}</h3>
      {FAQ_ITEMS.slice(0, maxItems).map((faq, index) => (
        <details key={index} className="group">
          <summary className="cursor-pointer text-blue-100 hover:text-white transition-colors list-none flex items-start gap-2">
            <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0 group-open:rotate-180 transition-transform" />
            <span className="font-medium">{faq.question}</span>
          </summary>
          <p className="mt-2 ml-6 text-sm text-blue-100/80 leading-relaxed">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

export default FAQSection
