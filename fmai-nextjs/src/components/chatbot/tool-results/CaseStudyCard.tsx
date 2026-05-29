'use client'

import { motion } from 'motion/react'
import { Building2, AlertTriangle, Lightbulb, TrendingUp, Quote, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useCardCopy } from './cardI18n'
import { ApplyCtaButton } from '../ApplyCtaButton'

export interface CaseStudyData {
  caseStudy: {
    client: string
    industry: string
    challenge: string
    solution: string
    results: string[]
    testimonial?: string
    url?: string
  }
}

export function CaseStudyCard({ data }: { data: CaseStudyData }) {
  const { t } = useCardCopy()
  const study = data.caseStudy
  if (!study) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4"
    >
      <div className="rounded-xl bg-gradient-to-br from-accent-system/20 to-accent-human/10 border border-accent-system/20 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-system/20">
            <Building2 className="h-4 w-4 text-accent-system" />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-text-primary">{study.client}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{study.industry}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-4">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-amber-400">
            {t.caseChallenge}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">{study.challenge}</p>
      </div>

      <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-accent-system" />
          <span className="text-xs font-medium uppercase tracking-wider text-accent-system">
            {t.caseSolution}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">{study.solution}</p>
      </div>

      <div className="rounded-xl border border-accent-success/20 bg-accent-success/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-accent-success" />
          <span className="text-xs font-medium uppercase tracking-wider text-accent-success">
            {t.caseResults}
          </span>
        </div>
        <ul className="space-y-2">
          {study.results.map((result, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.2 }}
              className="flex items-start gap-2 text-xs text-text-secondary"
            >
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-success" />
              {result}
            </motion.li>
          ))}
        </ul>
      </div>

      {study.testimonial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="rounded-xl border border-accent-system/15 bg-accent-system/5 p-4"
        >
          <Quote className="h-4 w-4 text-accent-system/50 mb-2" />
          <p className="text-xs leading-relaxed text-text-secondary italic">{study.testimonial}</p>
        </motion.div>
      )}

      <div className="space-y-2">
        {study.url && (
          <Link
            href="/case-studies/skinclarity-club"
            className="group flex items-center justify-center gap-2 rounded-xl border border-accent-system/30 bg-accent-system/10 px-4 py-3 text-xs font-medium text-accent-system transition-all duration-200 hover:bg-accent-system/15"
          >
            {t.readCase}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        )}
        <ApplyCtaButton size="sm">{t.similarResults}</ApplyCtaButton>
      </div>
    </motion.div>
  )
}

export default CaseStudyCard
