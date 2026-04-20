'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  agency: z.string().min(2),
  role: z.string().min(2),
  revenue: z.string().min(1),
  clientCount: z.string().min(1),
  tier: z.string().min(1),
  problem: z.string().min(20),
  website: z.string().max(0).optional(),
})

const REVENUE_OPTIONS = ['under_300k', '300k_1m', '1m_3m', '3m_10m', 'over_10m'] as const
const CLIENT_COUNT_OPTIONS = ['solo', '1_5', '5_15', '15_50', 'over_50'] as const
const TIER_OPTIONS = ['partner', 'growth', 'professional', 'enterprise', 'founding', 'unsure'] as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ApplicationForm() {
  const t = useTranslations('apply.form')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      setStatus('error')
      setErrorMessage(t('errorValidation'))
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
        throw new Error(payload.error ?? 'Request failed')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : t('errorNetwork'))
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[var(--radius-card)] border border-[#00FF88]/40 bg-[#00FF88]/5 p-8 text-center">
        <h3 className="text-2xl font-semibold text-text-primary mb-3">{t('successTitle')}</h3>
        <p className="text-text-secondary leading-relaxed">{t('successBody')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, tempting to bots */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="name">
            {t('nameLabel')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-system transition-colors"
            placeholder={t('namePlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="email">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-system transition-colors"
            placeholder={t('emailPlaceholder')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="agency">
            {t('agencyLabel')}
          </label>
          <input
            id="agency"
            name="agency"
            type="text"
            required
            minLength={2}
            maxLength={150}
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary focus:outline-none focus:border-accent-system transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="role">
            {t('roleLabel')}
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            minLength={2}
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-system transition-colors"
            placeholder={t('rolePlaceholder')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="revenue">
            {t('revenueLabel')}
          </label>
          <select
            id="revenue"
            name="revenue"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary focus:outline-none focus:border-accent-system transition-colors"
          >
            <option value="" disabled>
              {t('selectPlaceholder')}
            </option>
            {REVENUE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`revenueOptions.${value}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-text-secondary mb-1"
            htmlFor="clientCount"
          >
            {t('clientCountLabel')}
          </label>
          <select
            id="clientCount"
            name="clientCount"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary focus:outline-none focus:border-accent-system transition-colors"
          >
            <option value="" disabled>
              {t('selectPlaceholder')}
            </option>
            {CLIENT_COUNT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`clientCountOptions.${value}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="tier">
          {t('tierLabel')}
        </label>
        <select
          id="tier"
          name="tier"
          required
          defaultValue=""
          className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary focus:outline-none focus:border-accent-system transition-colors"
        >
          <option value="" disabled>
            {t('selectPlaceholder')}
          </option>
          {TIER_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {t(`tierOptions.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="problem">
          {t('problemLabel')}
        </label>
        <textarea
          id="problem"
          name="problem"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-system transition-colors resize-y"
          placeholder={t('problemPlaceholder')}
        />
      </div>

      {status === 'error' && errorMessage && (
        <p className="text-sm text-[#FF4D4D]" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-6 py-4 rounded-lg bg-accent-system text-bg-deep font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>

      <p className="text-xs text-text-muted text-center">{t('privacyNote')}</p>
    </form>
  )
}
