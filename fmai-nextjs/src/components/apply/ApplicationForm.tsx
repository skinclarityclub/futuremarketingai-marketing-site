'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { ApplyCalendlyInline } from '@/components/interactive/ApplyCalendlyInline'

/**
 * Apply form — Phase 17-D D4 simplified to 3 fields above the fold.
 *
 * Old form collected name + email + agency + role + revenue + clientCount
 * + tier + workspaces + problem. Eight required fields produced measurable
 * conversion friction (MF-09). The new flow:
 *   Step 1 (this form): name + email + optional company.
 *   Step 2 (Calendly inline post-submit): tier, workspaces, problem,
 *     revenue/client-count all collected during the actual call.
 *
 * The API contract still accepts the historic fields as optional so any
 * other intake variation (n8n form, partner-form, etc.) can keep posting
 * the full shape.
 */

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  agency: z.preprocess(
    (v) => (typeof v === 'string' && v.trim().length === 0 ? undefined : v),
    z.string().min(2).max(150).optional(),
  ),
  // Honeypot — bots fill, humans do not.
  website: z.string().max(0).optional(),
})

type Status = 'idle' | 'submitting' | 'success' | 'error'

function mapIssueToKey(field: string, code: string): string {
  if (field === 'email') return 'emailInvalid'
  if (field === 'name') return 'nameMin'
  if (field === 'agency') return 'agencyMin'
  return 'nameMin'
}

export function ApplicationForm() {
  const t = useTranslations('apply.form')
  const tCal = useTranslations('apply.calendly')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submittedName, setSubmittedName] = useState<string | undefined>()
  const [submittedEmail, setSubmittedEmail] = useState<string | undefined>()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string
        if (errors[field]) continue
        const key = mapIssueToKey(field, issue.code)
        errors[field] = t(`errors.${key}` as Parameters<typeof t>[0])
      }
      setFieldErrors(errors)
      setStatus('error')
      setErrorMessage(t('errorValidation'))
      const firstField = Object.keys(errors)[0]
      if (firstField) {
        requestAnimationFrame(() => {
          const el = document.getElementById(firstField)
          el?.focus()
        })
      }
      return
    }

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        if (payload?.fields && typeof payload.fields === 'object') {
          setFieldErrors(payload.fields as Record<string, string>)
        }
        throw new Error(payload.error ?? t('errorNetwork'))
      }

      setSubmittedName(parsed.data.name)
      setSubmittedEmail(parsed.data.email)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : t('errorNetwork'))
    }
  }

  if (status === 'success') {
    return (
      <section aria-live="polite" role="status" className="space-y-6">
        <header className="rounded-[var(--radius-card)] border border-[#00FF88]/40 bg-[#00FF88]/5 p-6 text-center">
          <h3 className="text-2xl font-semibold text-text-primary mb-2">{tCal('title')}</h3>
          <p className="text-text-secondary leading-relaxed">{tCal('subtitle')}</p>
        </header>

        <ApplyCalendlyInline name={submittedName} email={submittedEmail} />

        <p className="text-sm text-text-muted text-center">{tCal('reassurance')}</p>
      </section>
    )
  }

  const inputClasses =
    'w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:border-accent-system focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-xs text-text-muted">{t('requiredNote')}</p>

      {/* Honeypot — hidden from humans, tempting to bots */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="name">
          {t('nameLabel')} <span aria-hidden="true" className="text-[#FF4D4D]">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          minLength={2}
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'name-err' : undefined}
          className={inputClasses}
          placeholder={t('namePlaceholder')}
        />
        {fieldErrors.name && (
          <p id="name-err" role="alert" className="mt-1 text-sm text-[#FF4D4D]">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="email">
          {t('emailLabel')} <span aria-hidden="true" className="text-[#FF4D4D]">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          autoComplete="email"
          inputMode="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-err' : undefined}
          className={inputClasses}
          placeholder={t('emailPlaceholder')}
        />
        {fieldErrors.email && (
          <p id="email-err" role="alert" className="mt-1 text-sm text-[#FF4D4D]">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="agency">
          {t('agencyLabel')} <span className="text-text-muted text-xs">{t('optionalSuffix')}</span>
        </label>
        <input
          id="agency"
          name="agency"
          type="text"
          maxLength={150}
          autoComplete="organization"
          aria-invalid={Boolean(fieldErrors.agency)}
          aria-describedby={fieldErrors.agency ? 'agency-err' : undefined}
          className={inputClasses}
        />
        {fieldErrors.agency && (
          <p id="agency-err" role="alert" className="mt-1 text-sm text-[#FF4D4D]">
            {fieldErrors.agency}
          </p>
        )}
      </div>

      {status === 'error' && errorMessage && (
        <p className="text-sm text-[#FF4D4D]" role="alert">
          {errorMessage}
        </p>
      )}

      <div aria-live="polite" aria-atomic="true">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-6 py-4 rounded-lg bg-accent-system text-bg-deep font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </div>

      <p className="text-xs text-text-muted text-center">{t('privacyNote')}</p>
    </form>
  )
}
