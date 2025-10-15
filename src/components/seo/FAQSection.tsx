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
import { StructuredData, createFAQSchema, type FAQItem } from './StructuredData'

/**
 * FAQ items optimized for SEO and LLM extraction
 * Based on actual platform knowledge and common user questions
 */
export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is Future Marketing AI and how does it work?',
    answer:
      'Future Marketing AI is an autonomous AI-powered marketing automation platform that transforms premium businesses into market leaders. It uses 6 core AI modules (Research & Planning, Manager Orchestrator, Content Pipelines, Smart Publishing, Self-Learning Analytics, and Ad Automation) to automate your entire marketing workflow. The platform is completely autonomous and self-learning, becoming smarter with every campaign.',
  },
  {
    question: 'How much time does Future Marketing AI save?',
    answer:
      'On average, businesses save 312 hours per month with Future Marketing AI. This includes automated content creation (15x faster production), 24/7 AI research and planning, intelligent publishing across all channels, and self-optimizing analytics. Many clients report eliminating the need for multiple full-time marketing roles.',
  },
  {
    question: 'What ROI can I expect from the platform?',
    answer:
      'Our clients see an average ROI of 847% within the first 90 days. The platform replaces €26,000/month in traditional tools and labor costs, while our Early Adopter pricing starts at €15,000/month - saving you €11,000/month immediately. Additionally, businesses typically see 35% better engagement and 3.2x better ROAS on advertising spend.',
  },
  {
    question: 'What industries does Future Marketing AI serve?',
    answer:
      'We specialize in three primary industries: E-commerce & Retail (managing multiple sales channels), Technology & SaaS (post-PMF, scaling content), and Marketing Agencies (managing 10+ client campaigns). However, any fast-growing business that needs to scale marketing operations can benefit from our platform.',
  },
  {
    question: 'Is there a free trial or demo available?',
    answer:
      'Yes! We offer a comprehensive interactive demo where you can explore all platform features without signup. Experience our AI Research Assistant, Content Pipelines, Multi-Channel Publisher, and more. The demo is personalized to your industry and shows real-world use cases. Simply visit our demo page to get started.',
  },
  {
    question: 'What is Early Adopter pricing and how long is it available?',
    answer:
      'Early Adopter pricing is our limited-time founding offer with rates locked for 24 months. We have three tiers: Founding Member (€15,000/month, 2 of 5 slots remaining), Pioneer (€17,500/month, 4 of 10 slots), and Innovator (€20,000/month, 2 of 10 slots). This pricing represents a 42% discount versus our Standard rate and includes 2 months free plus roadmap influence.',
  },
  {
    question: 'How long does implementation take?',
    answer:
      'Implementation time varies by industry: E-commerce typically sees first results in 30 days, SaaS in 45 days, and Agencies can onboard their first client in just 15 days. Our platform is designed for rapid deployment with minimal setup required. Most businesses are fully operational within 4-6 weeks.',
  },
  {
    question: 'Do I need technical expertise to use the platform?',
    answer:
      'No technical expertise is required. Future Marketing AI is built for marketers and business owners, not developers. The platform features an intuitive interface with guided workflows. Our AI Manager Orchestrator handles all technical complexity, coordinating workflows automatically. You focus on strategy while AI handles execution.',
  },
  {
    question: 'What makes Future Marketing AI different from other marketing automation tools?',
    answer:
      'Unlike traditional tools that require manual setup and constant monitoring, Future Marketing AI is fully autonomous and self-learning. It uses proprietary ML models to optimize performance 24/7, becoming smarter with every campaign. The platform replaces 10+ separate tools (saving €26,000/month) with one unified, intelligent system that requires minimal human intervention.',
  },
  {
    question: 'Can I manage multiple clients or brands with one account?',
    answer:
      'Absolutely! Our platform is built for scale. Marketing agencies can manage 20+ client accounts with white-label dashboards and automated reporting. E-commerce businesses can handle multiple brands or product lines. Each account has isolated campaigns, content pipelines, and analytics, all managed from one central hub.',
  },
]

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
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)
  const [showAll, setShowAll] = React.useState(false)

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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Everything you need to know about Future Marketing AI. Can't find the answer you're
              looking for? Try our interactive demo or contact us directly.
            </p>
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
                    Show Less
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </>
                ) : (
                  <>
                    Show {allFAQs.length - initialVisible} More Questions
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* CTA Footer */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-blue-100 mb-4">
              Try our interactive demo or schedule a consultation with our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Try Interactive Demo
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                Contact Us
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
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Quick Answers</h3>
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
