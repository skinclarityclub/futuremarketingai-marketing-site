'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useApplyWizard } from '@/lib/apply/store'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { HEARD_FROM } from '@/lib/apply/heard-from'

export function ProblemStep({
  onPrev,
  onSubmit,
  submitting,
}: {
  onPrev: () => void
  onSubmit: () => void
  submitting: boolean
}) {
  const t = useTranslations('apply.wizard')
  const problem = useApplyWizard((s) => s.problem)
  const setProblem = useApplyWizard((s) => s.setProblem)
  const heardFrom = useApplyWizard((s) => s.heardFrom)
  const setHeardFrom = useApplyWizard((s) => s.setHeardFrom)
  const [showHeardFromError, setShowHeardFromError] = useState(false)
  const fieldsetRef = useRef<HTMLFieldSetElement>(null)

  // The button stays enabled so an attempt without a choice can explain itself.
  const handleSubmit = () => {
    if (!heardFrom) {
      setShowHeardFromError(true)
      fieldsetRef.current?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus()
      return
    }
    onSubmit()
  }

  return (
    <div className="space-y-6">
      <header className="text-center space-y-3">
        <EyebrowLabel>{t('problem.eyebrow')}</EyebrowLabel>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
          {t('problem.title')}
        </h2>
        <p className="text-base text-text-secondary leading-relaxed">
          {t('problem.subtitle')}
        </p>
      </header>

      <fieldset
        ref={fieldsetRef}
        className="space-y-3"
        aria-describedby={`apply-heard-from-hint${showHeardFromError && !heardFrom ? ' apply-heard-from-error' : ''}`}
      >
        <legend className="text-sm font-semibold text-text-primary">
          {t('problem.heardFrom.legend')}
        </legend>
        <p id="apply-heard-from-hint" className="text-xs text-text-muted">
          {t('problem.heardFrom.hint')}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {HEARD_FROM.map((value) => (
            <label
              key={value}
              className="flex items-center gap-2.5 bg-bg-deep/60 border border-border-primary rounded-lg px-3.5 py-2.5 text-sm text-text-primary cursor-pointer transition-colors hover:border-accent-system has-[:checked]:border-accent-system has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-system/40"
            >
              <input
                type="radio"
                name="apply-heard-from"
                value={value}
                checked={heardFrom === value}
                onChange={() => setHeardFrom(value)}
                className="accent-accent-system"
              />
              {t(`problem.heardFrom.options.${value}`)}
            </label>
          ))}
        </div>
        {showHeardFromError && !heardFrom && (
          <p id="apply-heard-from-error" role="alert" className="text-xs text-red-400">
            {t('problem.heardFrom.error')}
          </p>
        )}
      </fieldset>

      <div className="space-y-2">
        <textarea
          id="apply-problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder={t('problem.placeholder')}
          rows={6}
          maxLength={2000}
          className="w-full bg-bg-deep/60 border border-border-primary rounded-lg px-3.5 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-system/40 focus:border-accent-system transition-colors resize-y"
        />
        <div className="flex items-center justify-between text-xs">
          <p className="text-text-muted">{t('problem.help')}</p>
          <p className="text-text-muted font-mono">
            {t('problem.counter', { count: problem.length })}
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={submitting}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40"
        >
          ← {t('progress.previous')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-human text-bg-deep font-semibold rounded-[var(--radius-btn)] hover:brightness-110 transition-[filter] text-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-human"
        >
          {submitting ? '...' : t('progress.submit')}
        </button>
      </div>
    </div>
  )
}
