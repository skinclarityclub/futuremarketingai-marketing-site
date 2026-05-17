'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { OptionButton } from './OptionButton'
import { LikertScale } from './LikertScale'
import type {
  AnswerValue,
  AssessmentQuestion,
  SingleSelectQuestion,
} from '@/lib/assessment/types'

interface QuestionCardProps {
  question: AssessmentQuestion
  value: AnswerValue | undefined
  index: number
  total: number
  onAnswer: (value: AnswerValue) => void
  onNext: () => void
  onPrev: () => void
  canGoBack: boolean
}

const SINGLE_KEYS = ['a', 'b', 'c', 'd'] as const

export function QuestionCard({
  question,
  value,
  index,
  total,
  onAnswer,
  onNext,
  onPrev,
  canGoBack,
}: QuestionCardProps) {
  const t = useTranslations('assessment')
  const tQ = useTranslations(`assessment.questions.${question.id}`)
  const tCat = useTranslations('assessment.categories')

  function handleSingleSelect(key: SingleSelectQuestion['options'][number]['key']) {
    onAnswer(key)
  }

  function handleLikert(v: 1 | 2 | 3 | 4 | 5) {
    onAnswer(v)
  }

  const isLast = index === total - 1
  const hasAnswer = value !== undefined

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-white/[0.02] px-3 py-1 text-xs font-medium uppercase tracking-wider text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-system" aria-hidden="true" />
          {tCat(question.category)}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {index + 1} / {total}
        </span>
      </div>

      <h1 className="mb-8 text-2xl font-semibold leading-tight text-text-primary sm:text-3xl md:text-4xl">
        {tQ('text')}
      </h1>

      {question.type === 'single' ? (
        <div className="space-y-3">
          {SINGLE_KEYS.map((key) => (
            <OptionButton
              key={key}
              letter={key}
              label={tQ(`options.${key}`)}
              selected={value === key}
              onClick={() => handleSingleSelect(key)}
            />
          ))}
        </div>
      ) : (
        <LikertScale
          value={value as 1 | 2 | 3 | 4 | 5 | undefined}
          onChange={handleLikert}
          minLabel={tQ('likert.min')}
          maxLabel={tQ('likert.max')}
        />
      )}

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoBack}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasAnswer}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-5 py-2.5 text-sm font-semibold text-bg-deep transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {isLast ? t('finish') : t('next')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
