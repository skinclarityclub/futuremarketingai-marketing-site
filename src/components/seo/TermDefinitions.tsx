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

/**
 * Key industry terms with clear definitions
 * Optimized for both user understanding and LLM extraction
 */
export const MARKETING_TERMS = [
  {
    term: 'Autonomous Marketing',
    definition:
      "A fully self-operating marketing system that researches, creates, publishes, and optimizes content without human intervention. Future Marketing AI's autonomous approach saves 312 hours per month compared to traditional marketing.",
    category: 'Core Concept',
  },
  {
    term: 'AI Content Pipelines',
    definition:
      'Automated workflows that generate, optimize, and schedule marketing content at scale. Our pipelines produce 15x more content than traditional methods while maintaining premium quality.',
    category: 'Feature',
  },
  {
    term: 'Self-Learning Analytics',
    definition:
      'AI-powered analytics that continuously improve campaign performance through machine learning. The system becomes 23% more effective each month by analyzing every interaction.',
    category: 'Feature',
  },
  {
    term: 'Manager Orchestrator',
    definition:
      'The central AI coordinator that manages all marketing workflows, ensuring seamless integration between research, content creation, publishing, and analytics modules.',
    category: 'Feature',
  },
  {
    term: 'Smart Publishing',
    definition:
      'Intelligent multi-channel content distribution that optimizes timing, platform selection, and messaging for maximum engagement. Achieves 35% better engagement than manual publishing.',
    category: 'Feature',
  },
  {
    term: 'Ad Automation',
    definition:
      'AI-driven advertising campaign management that continuously optimizes ad creative, targeting, and budget allocation. Delivers 3.2x better ROAS compared to traditional ad management.',
    category: 'Feature',
  },
  {
    term: 'ROAS (Return on Ad Spend)',
    definition:
      'A metric measuring revenue generated for every euro spent on advertising. Future Marketing AI clients achieve an average 3.2x ROAS through intelligent ad optimization.',
    category: 'Metric',
  },
  {
    term: 'ICP (Ideal Customer Profile)',
    definition:
      'A detailed description of the perfect customer for a business. Our platform personalizes content based on three primary ICPs: E-commerce (multi-channel), SaaS (post-PMF), and Agencies (10+ clients).',
    category: 'Strategy',
  },
  {
    term: 'Founding Member Pricing',
    definition:
      'Limited-time early adopter rates locked for 24 months. Founding Members save €120,000 vs Standard pricing while gaining roadmap influence and dedicated support.',
    category: 'Pricing',
  },
  {
    term: 'Multi-Channel Marketing',
    definition:
      'Coordinated marketing across multiple platforms (social media, email, ads, etc.). Future Marketing AI synchronizes all channels automatically, eliminating manual coordination.',
    category: 'Strategy',
  },
] as const

/**
 * Additional terms for extended glossary
 */
export const ADVANCED_TERMS = [
  {
    term: 'Proprietary ML Models',
    definition:
      "Custom machine learning algorithms developed exclusively for marketing optimization. These models power Future Marketing AI's self-learning capabilities.",
    category: 'Technology',
  },
  {
    term: 'Campaign Attribution',
    definition:
      'The process of identifying which marketing touchpoints led to conversions. Our analytics provide real-time, cross-channel attribution insights.',
    category: 'Analytics',
  },
  {
    term: 'Content Velocity',
    definition:
      'The speed at which marketing content is produced and published. Our AI Pipelines achieve 15x faster content velocity than traditional methods.',
    category: 'Performance',
  },
  {
    term: 'Workflow Automation',
    definition:
      'The elimination of repetitive manual tasks through intelligent process automation. Saves an average of 312 hours per month per organization.',
    category: 'Efficiency',
  },
  {
    term: 'Platform ROI',
    definition:
      'The total return on investment from using Future Marketing AI. Includes cost savings (€26,000/month in replaced tools) plus revenue gains (847% average ROI).',
    category: 'Value',
  },
] as const

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
  // Combine terms and filter by category if specified
  const allTerms = showAdvanced ? [...MARKETING_TERMS, ...ADVANCED_TERMS] : MARKETING_TERMS
  const filteredTerms = category ? allTerms.filter((t) => t.category === category) : allTerms

  // Group terms by category for organized display
  const groupedTerms = filteredTerms.reduce(
    (acc, term) => {
      if (!acc[term.category]) {
        acc[term.category] = []
      }
      acc[term.category].push(term)
      return acc
    },
    {} as Record<string, Array<typeof filteredTerms[number]>>
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
            <span className="text-sm font-medium text-blue-100">Marketing Automation Glossary</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Key Terms & Definitions
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Understand the terminology behind autonomous AI-powered marketing automation.
          </p>
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
          <h3 className="text-xl font-bold text-white mb-2">
            Want to see these features in action?
          </h3>
          <p className="text-blue-100 mb-4">
            Try our interactive demo to experience autonomous marketing firsthand.
          </p>
          <a
            href="/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Launch Demo
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
  const allTerms = [...MARKETING_TERMS, ...ADVANCED_TERMS]
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
