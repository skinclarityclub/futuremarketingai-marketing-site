import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { GlassCard } from '../common/GlassCard'

interface ComparisonSectionProps {
  className?: string
}

interface ComparisonRow {
  category: string
  template: string
  custom: string
}

/**
 * ComparisonSection - Template SaaS vs. Custom-Built Solution
 *
 * Visual comparison table showing the advantages of custom-built solutions
 * over template-based SaaS offerings.
 */
export const ComparisonSection = memo(function ComparisonSection({
  className = '',
}: ComparisonSectionProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const comparisons: ComparisonRow[] = [
    {
      category: 'Implementation',
      template: 'Configure yourself',
      custom: 'Built FOR you',
    },
    {
      category: 'Workflow',
      template: 'Adapt to the software',
      custom: 'Adapts to YOUR workflow',
    },
    {
      category: 'Industry Fit',
      template: 'Generic approach',
      custom: 'YOUR industry specifics',
    },
    {
      category: 'Scaling',
      template: 'Hit template limitations',
      custom: 'Grows with YOUR business',
    },
    {
      category: 'Customization',
      template: 'Limited to template options',
      custom: 'Unlimited possibilities',
    },
    {
      category: 'Updates',
      template: 'Hope they add your feature',
      custom: 'We build what you need',
    },
  ]

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <motion.header
        className="text-center mb-12"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
      >
        <div className="inline-block px-4 py-2 mb-4 rounded-full bg-accent-warning/10 border border-accent-warning/30">
          <span className="text-sm font-semibold text-accent-warning uppercase tracking-wider">
            ⚔️ Comparison
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Template SaaS vs. Custom-Built Solution
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          See why custom-built outperforms one-size-fits-all templates
        </p>
      </motion.header>

      {/* Comparison Table */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        <GlassCard className="overflow-hidden">
          {/* Table Header */}
          <div
            className="grid grid-cols-3 gap-4 p-6 border-b border-accent-primary/20"
            style={{ background: 'rgba(100, 200, 255, 0.05)' }}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-white/70">Category</h3>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <X className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-red-400">Template SaaS</h3>
              </div>
              <p className="text-xs text-white/60">Off-the-shelf solutions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 text-success" />
                <h3 className="text-lg font-bold text-success">Custom-Built</h3>
              </div>
              <p className="text-xs text-white/60">FutureMarketingAI</p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {comparisons.map((row, index) => (
              <motion.div
                key={row.category}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: index * 0.1 }
                }
                className="grid grid-cols-3 gap-4 p-6 hover:bg-accent-primary/5 transition-colors"
              >
                {/* Category */}
                <div className="flex items-center">
                  <span className="font-semibold text-text-primary">{row.category}</span>
                </div>

                {/* Template Option */}
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-white/70">{row.template}</span>
                </div>

                {/* Custom Option */}
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" aria-hidden="true" />
                  <span className="text-white/90 font-medium">{row.custom}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Message */}
          <div className="p-6 bg-gradient-to-r from-accent-gold/10 to-accent-primary/10 border-t border-accent-gold/30">
            <p className="text-center text-white/90">
              <strong className="text-accent-gold">Bottom Line:</strong> Template solutions force
              you to compromise. Custom-built solutions are designed around{' '}
              <strong className="text-white">YOUR</strong> exact needs.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Additional Context */}
      <motion.div
        className="mt-8 text-center max-w-3xl mx-auto"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
      >
        <p className="text-white/70">
          💡 <strong className="text-white">Why custom-built?</strong> Because your business isn't a
          template, your marketing automation shouldn't be either. Every team has unique workflows,
          industry requirements, and scaling needs that generic solutions can't address.
        </p>
      </motion.div>
    </div>
  )
})
