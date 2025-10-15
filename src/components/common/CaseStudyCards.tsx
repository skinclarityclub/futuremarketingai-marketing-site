import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { GlassCard } from './GlassCard'

// ============================================================================
// Types
// ============================================================================

export interface CaseStudy {
  id: string
  industry: string
  company: string
  logo?: string
  painPoint: string
  solution: string
  results: string
  metrics: {
    label: string
    value: string
    improvement: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

interface CaseStudyCardsProps {
  caseStudies: CaseStudy[]
  title?: string
  subtitle?: string
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export function CaseStudyCards({
  caseStudies,
  title,
  subtitle,
  className = '',
}: CaseStudyCardsProps) {
  const { t } = useTranslation(['common'])

  // Use translations as defaults if props not provided
  const finalTitle = title || t('common:case_studies.title')
  const finalSubtitle = subtitle || t('common:case_studies.subtitle')

  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{finalTitle}</h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">{finalSubtitle}</p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {caseStudies.map((caseStudy) => (
          <motion.div key={caseStudy.id} variants={cardVariants}>
            <GlassCard
              className="p-6 h-full cursor-pointer hover-lift group"
              onClick={() => setSelectedCase(caseStudy)}
            >
              {/* Industry Badge */}
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-accent-primary/10 border border-accent-primary/30">
                <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
                  {caseStudy.industry}
                </span>
              </div>

              {/* Company */}
              <h3 className="text-xl font-bold text-text-primary mb-3">{caseStudy.company}</h3>

              {/* Pain Point - Red Theme */}
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-400/20">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                  Problem
                </p>
                <p className="text-sm text-white/80 line-clamp-2">{caseStudy.painPoint}</p>
              </div>

              {/* Results Preview - Green Theme */}
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-success/10 to-green-500/5 border border-success/20">
                <p className="text-xs font-bold text-success uppercase tracking-wider mb-1">
                  Result
                </p>
                <p className="text-sm text-white/80 line-clamp-2">{caseStudy.results}</p>
              </div>

              {/* Key Metrics */}
              <div className="flex items-center gap-2 mb-4">
                {caseStudy.metrics.slice(0, 3).map((metric, idx) => (
                  <div key={idx} className="flex-1 text-center p-2 rounded border border-white/10">
                    <div className="text-lg font-bold text-accent-primary">{metric.value}</div>
                    <div className="text-xs text-white/70 truncate">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Read More CTA */}
              <div className="flex items-center justify-between text-sm font-semibold text-accent-primary group-hover:text-accent-secondary transition-colors">
                <span>Read full story</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCase && (
          <Modal
            isOpen={!!selectedCase}
            onClose={() => setSelectedCase(null)}
            title={`${selectedCase.company} - ${selectedCase.industry}`}
            size="xl"
          >
            <div className="space-y-6">
              {/* Industry Badge */}
              <div className="inline-block px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/30">
                <span className="text-sm font-semibold text-accent-primary uppercase tracking-wider">
                  {selectedCase.industry}
                </span>
              </div>

              {/* The Problem */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/15 via-orange-500/10 to-red-500/15 border border-red-400/30 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <svg
                    className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-red-400">The Problem</h3>
                </div>
                <p className="text-white/90 leading-relaxed">{selectedCase.painPoint}</p>
              </div>

              {/* The Solution */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-cyan-500/15 border border-cyan-400/30 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <svg
                    className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-cyan-400">The Solution</h3>
                </div>
                <p className="text-white/90 leading-relaxed">{selectedCase.solution}</p>
              </div>

              {/* The Result */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-success/15 via-green-500/10 to-success/15 border border-success/30 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <svg
                    className="w-6 h-6 text-success flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-success">The Result</h3>
                </div>
                <p className="text-white/95 leading-relaxed font-semibold mb-4">
                  {selectedCase.results}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {selectedCase.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center p-4 rounded-xl border border-white/10">
                      <div className="text-3xl font-bold text-success mb-1">{metric.value}</div>
                      <div className="text-xs text-white/70 mb-1">{metric.label}</div>
                      <div className="text-xs text-accent-primary font-semibold">
                        {metric.improvement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial (optional) */}
              {selectedCase.testimonial && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20">
                  <svg
                    className="w-10 h-10 text-accent-primary/30 mb-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                  <p className="text-white/90 leading-relaxed italic mb-4">
                    "{selectedCase.testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {selectedCase.testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold">
                        {selectedCase.testimonial.author}
                      </p>
                      <p className="text-sm text-white/70">{selectedCase.testimonial.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
