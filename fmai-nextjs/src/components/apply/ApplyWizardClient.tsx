'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useApplyWizard } from '@/lib/apply/store'
import { WIZARD_STEP_ORDER } from '@/lib/apply/types'
import type {
  AssessmentHandoff,
  ApplyWizardSubmission,
  ApplyWizardResponse,
} from '@/lib/apply/types'
import type { Archetype, Stage, AssessmentCategory } from '@/lib/assessment/types'
import { ASSESSMENT_ARCHETYPES, ASSESSMENT_STAGES, ASSESSMENT_CATEGORIES } from '@/lib/assessment/types'
import { WizardProgress } from './WizardProgress'
import { IdentityStep } from './IdentityStep'
import { ScanCheckStep } from './ScanCheckStep'
import { QualificationStep } from './QualificationStep'
import { ScanSummaryStep } from './ScanSummaryStep'
import { ProblemStep } from './ProblemStep'
import { ResultBranchA } from './ResultBranchA'
import { ResultBranchB } from './ResultBranchB'
import { trackAnalyticsEvent } from '@/lib/analytics-consent'

const ASSESSMENT_SESSION_KEY = 'fmai-assessment-v1'

function isArchetype(v: string): v is Archetype {
  return (ASSESSMENT_ARCHETYPES as readonly string[]).includes(v)
}
function isStage(v: string): v is Stage {
  return (ASSESSMENT_STAGES as readonly string[]).includes(v)
}
function isCategory(v: string): v is AssessmentCategory {
  return (ASSESSMENT_CATEGORIES as readonly string[]).includes(v)
}

const ATTRIBUTION_KEYS = ['fmc', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

/** Only the keys the API accepts; the server validates the values. */
function readUrlAttribution(searchParams: URLSearchParams): Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>> {
  const out: Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>> = {}
  for (const k of ATTRIBUTION_KEYS) {
    const v = searchParams.get(k)
    if (v) out[k] = v
  }
  return out
}

/**
 * Read assessment handoff data from URL params first (?a=&st=&lc=),
 * fall back to sessionStorage `fmai-assessment-v1` for tab-scoped recovery.
 */
function detectAssessmentHandoff(
  searchParams: URLSearchParams,
): AssessmentHandoff | null {
  // URL params
  const a = searchParams.get('a')
  const st = searchParams.get('st')
  const lc = searchParams.get('lc')
  if (a && st && lc && isArchetype(a) && isStage(st) && isCategory(lc)) {
    return { archetype: a, stage: st, lowestCategory: lc, source: 'url' }
  }
  // sessionStorage fallback
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(ASSESSMENT_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      state?: { answers?: Record<string, unknown> }
    }
    if (!parsed?.state?.answers) return null
    // Recompute via scoring — assessment store stores only answers, not result
    // To avoid importing scoring here, we rely on the fact that hasRehydrated
    // would have run already in /assessment. Cheaper: trust URL params primarily.
    // If no URL params + only session, skip handoff (user must explicitly opt-in).
    return null
  } catch {
    return null
  }
}

export function ApplyWizardClient() {
  const t = useTranslations('apply.wizard')
  const locale = useLocale() as 'nl' | 'en' | 'es'
  const searchParams = useSearchParams()

  const step = useApplyWizard((s) => s.step)
  const identity = useApplyWizard((s) => s.identity)
  const qualification = useApplyWizard((s) => s.qualification)
  const assessment = useApplyWizard((s) => s.assessment)
  const problem = useApplyWizard((s) => s.problem)
  const heardFrom = useApplyWizard((s) => s.heardFrom)
  const setAssessment = useApplyWizard((s) => s.setAssessment)
  const setScanCheckChoice = useApplyWizard((s) => s.setScanCheckChoice)
  const next = useApplyWizard((s) => s.next)
  const prev = useApplyWizard((s) => s.prev)
  const goToStep = useApplyWizard((s) => s.goToStep)
  const setResult = useApplyWizard((s) => s.setResult)
  const result = useApplyWizard((s) => s.result)
  const stepTopRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // The Next button sits at the bottom of a step and the old step collapses before the new one
  // enters, so without this the visitor lands on the footer. Focus follows, because the clicked
  // button is gone and focus would fall back to <body>.
  const showNewStep = () => {
    const top = stepTopRef.current
    if (!top) return
    top.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    top.focus({ preventScroll: true })
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Detect assessment handoff on mount (URL params take precedence)
  useEffect(() => {
    if (assessment) return
    const handoff = detectAssessmentHandoff(searchParams)
    if (handoff) {
      setAssessment(handoff)
      setScanCheckChoice('yes')
    }
  }, [searchParams, assessment, setAssessment, setScanCheckChoice])

  const onSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    goToStep('submitting')
    try {
      const payload: ApplyWizardSubmission = {
        identity,
        qualification: Object.keys(qualification).length > 0 ? qualification : undefined,
        assessment: assessment ?? undefined,
        problem: problem.trim() || undefined,
        heardFrom: heardFrom ?? undefined,
        locale,
        website: '', // honeypot
        ...readUrlAttribution(searchParams),
      }
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('submit_failed')
      // The send button is type="button" with this fetch, so no submit event
      // reaches the attribution tag (f.js on the page); tell it explicitly.
      // No-op without the tag or without ?fmc= in the URL.
      ;(window as Window & { __fmaiForm?: (name: string) => void }).__fmaiForm?.('aanvraag')
      const data = (await res.json()) as ApplyWizardResponse
      trackAnalyticsEvent('apply_submit', { branch: data.branch })
      setResult({
        branch: data.branch,
        calendlyUrl: data.calendlyUrl,
        score: undefined,
      })
      goToStep(data.branch === 'qualified' ? 'resultQualified' : 'resultReview')
    } catch {
      setSubmitError(t('errors.submitFailed'))
      goToStep('problem')
    } finally {
      setSubmitting(false)
    }
  }

  // Compute progress index — exclude terminal steps
  const visibleSteps = WIZARD_STEP_ORDER.filter((s) =>
    assessment ? s !== 'qualification' : s !== 'scanSummary',
  )
  const currentIndex = visibleSteps.indexOf(step) + 1
  const totalVisible = visibleSteps.length
  const showProgress = currentIndex > 0 && step !== 'submitting'

  return (
    <>
      {showProgress ? (
        <WizardProgress
          current={currentIndex}
          total={totalVisible}
          label={t('progress.stepNumber', { current: currentIndex, total: totalVisible })}
        />
      ) : null}

      <div className="px-6 lg:px-12 pb-32 lg:pb-40">
        {/* scroll-mt clears the fixed header, plus the progress bar that sits on top below lg */}
        <div ref={stepTopRef} tabIndex={-1} className="mx-auto max-w-2xl scroll-mt-32 outline-none lg:scroll-mt-24">
          <AnimatePresence mode="wait" onExitComplete={showNewStep}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            >
              {step === 'identity' && <IdentityStep onNext={next} />}
              {step === 'scanCheck' && <ScanCheckStep onPrev={prev} onNext={next} />}
              {step === 'qualification' && (
                <QualificationStep onPrev={prev} onNext={next} />
              )}
              {step === 'scanSummary' && (
                <ScanSummaryStep onPrev={prev} onNext={next} />
              )}
              {step === 'problem' && (
                <div className="space-y-4">
                  <ProblemStep
                    onPrev={prev}
                    onSubmit={onSubmit}
                    submitting={submitting}
                  />
                  {submitError ? (
                    <p className="text-sm text-error text-center">{submitError}</p>
                  ) : null}
                </div>
              )}
              {step === 'submitting' && (
                <div className="text-center py-20">
                  <div className="loader mx-auto" aria-label="Versturen..." />
                </div>
              )}
              {step === 'resultQualified' && result && <ResultBranchA />}
              {step === 'resultReview' && result && <ResultBranchB />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
