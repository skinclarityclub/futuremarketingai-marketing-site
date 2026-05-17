'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'motion/react'
import { ArrowRight, Mail } from 'lucide-react'
import type {
  AssessmentAnswers,
  AssessmentPersona,
} from '@/lib/assessment/types'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type Status = 'idle' | 'submitting' | 'error'

interface AssessmentEmailGateProps {
  persona: AssessmentPersona
  answers: AssessmentAnswers
  startedAt: string | null
  onSuccess: () => void
}

export function AssessmentEmailGate({
  persona,
  answers,
  startedAt,
  onSuccess,
}: AssessmentEmailGateProps) {
  const t = useTranslations('assessment.emailGate')
  const locale = useLocale()
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const email = String(fd.get('email') ?? '')
    const consent = fd.get('consent') === 'on'
    const website = String(fd.get('website') ?? '')
    const consentText = t('consent')

    setStatus('submitting')
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          locale,
          source: 'assessment',
          consent,
          consentText,
          website,
          answers,
          startedAt,
        }),
      })
      if (!res.ok) throw new Error('request_failed')
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'email_captured_post_assessment', {
          persona,
          locale,
        })
      }
      onSuccess()
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-xl rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.03] to-accent-system/[0.05] p-6 text-left md:p-8"
    >
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent-system">
        <Mail className="h-4 w-4" />
        {t('eyebrow')}
      </div>
      <h2 className="mb-2 text-xl font-semibold text-text-primary md:text-2xl">{t('title')}</h2>
      <p className="mb-5 text-sm leading-relaxed text-text-secondary">{t('subtitle')}</p>

      <ul className="mb-6 space-y-1.5 text-sm text-text-secondary">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-system" />
          {t('bullet1')}
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-system" />
          {t('bullet2')}
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-system" />
          {t('bullet3')}
        </li>
      </ul>

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div aria-hidden="true" className="hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="block">
          <span className="block text-xs font-medium text-text-secondary">
            {t('emailLabel')}
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={t('emailPlaceholder')}
            className="mt-1 w-full rounded-lg border border-border-primary bg-white/[0.02] px-3 py-2.5 text-text-primary placeholder:text-text-muted focus:border-accent-system focus:outline-none"
          />
        </label>

        <label className="flex items-start gap-2 text-xs text-text-secondary">
          <input name="consent" type="checkbox" required className="mt-0.5" />
          <span>
            {t('consent')}{' '}
            <a
              href={`/${locale}/legal/privacy`}
              className="underline text-accent-system focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
            >
              {t('privacyLink')}
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-system px-5 py-3 text-base font-semibold text-bg-deep transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
          {status !== 'submitting' && <ArrowRight className="h-4 w-4" />}
        </button>

        {status === 'error' ? (
          <p role="alert" className="text-xs text-red-400">
            {t('error')}
          </p>
        ) : null}
      </form>
    </motion.aside>
  )
}
