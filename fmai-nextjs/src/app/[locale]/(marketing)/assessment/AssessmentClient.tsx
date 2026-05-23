'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence } from 'motion/react'
import { AssessmentIntro } from '@/components/assessment/AssessmentIntro'
import { QuestionCard } from '@/components/assessment/QuestionCard'
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress'
import { ResultReveal } from '@/components/assessment/ResultReveal'
import { AssessmentEmailGate } from '@/components/assessment/AssessmentEmailGate'
import { AssessmentSuccess } from '@/components/assessment/AssessmentSuccess'
import { ASSESSMENT_QUESTIONS, TOTAL_QUESTIONS } from '@/lib/assessment/questions'
import { getRecommendedSkillsByArchetype } from '@/lib/assessment/skill-routing'
import { useAssessment } from '@/lib/assessment/store'
import type { AnswerValue } from '@/lib/assessment/types'

export function AssessmentClient() {
  const t = useTranslations('assessment')
  const step = useAssessment((s) => s.step)
  const currentIndex = useAssessment((s) => s.currentIndex)
  const answers = useAssessment((s) => s.answers)
  const result = useAssessment((s) => s.result)
  const startedAt = useAssessment((s) => s.startedAt)
  const start = useAssessment((s) => s.start)
  const setAnswer = useAssessment((s) => s.setAnswer)
  const next = useAssessment((s) => s.next)
  const prev = useAssessment((s) => s.prev)
  const markSubmitted = useAssessment((s) => s.markSubmitted)

  const question = ASSESSMENT_QUESTIONS[currentIndex]
  const progressLabel = t('progress', { current: currentIndex + 1, total: TOTAL_QUESTIONS })

  // Fire assessment_completed exactly once when result first appears.
  const completedFired = useRef(false)
  useEffect(() => {
    if (step !== 'result' || !result || completedFired.current) return
    completedFired.current = true
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'assessment_completed', {
        persona: result.persona,
        total_score: result.total,
        lowest_category: result.lowestCategory,
      })
    }
  }, [step, result])

  function handleStart() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'assessment_start')
    }
    start()
  }

  return (
    <>
      <section className="px-6 py-16 pt-24 lg:px-12 lg:pt-[120px]">
        <AnimatePresence mode="wait">
          {step === 'intro' && <AssessmentIntro key="intro" onStart={handleStart} />}

          {step === 'questions' && question && (
            <QuestionCard
              key={question.id}
              question={question}
              value={answers[question.id] as AnswerValue | undefined}
              index={currentIndex}
              total={TOTAL_QUESTIONS}
              onAnswer={(value) => setAnswer(question.id, value)}
              onNext={() => next(TOTAL_QUESTIONS)}
              onPrev={prev}
              canGoBack={currentIndex > 0}
            />
          )}

          {step === 'result' && result && (
            <ResultReveal
              key="result"
              result={result}
              recommendedSkills={getRecommendedSkillsByArchetype(result.archetype, result.lowestCategory)}
              emailGate={
                <AssessmentEmailGate
                  persona={result.persona}
                  answers={answers}
                  startedAt={startedAt}
                  onSuccess={markSubmitted}
                />
              }
            />
          )}

          {step === 'submitted' && <AssessmentSuccess key="submitted" />}
        </AnimatePresence>
      </section>

      {step === 'questions' && (
        <AssessmentProgress
          current={currentIndex + 1}
          total={TOTAL_QUESTIONS}
          label={progressLabel}
        />
      )}
    </>
  )
}
