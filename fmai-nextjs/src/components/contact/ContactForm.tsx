'use client'

import { useState, useRef, type FormEvent } from 'react'
import { CTAButton } from '@/components/ui/CTAButton'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  labels: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    company: string
    companyPlaceholder: string
    message: string
    messagePlaceholder: string
    submit: string
    // Phase 11-03: status labels (i18n)
    statusSending: string
    statusSuccessTitle: string
    statusSuccessBody: string
    statusSendAnother: string
    statusNetworkError: string
    statusGenericError: string
  }
}

export function ContactForm({ labels }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (status === 'submitting') return

    setStatus('submitting')
    setErrorMessage('')
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.fields) {
          setFieldErrors(data.fields)
        }
        setErrorMessage(data.error || labels.statusGenericError)
        setStatus('error')
        return
      }

      setStatus('success')
      formRef.current?.reset()
    } catch {
      setErrorMessage(labels.statusNetworkError)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00FF88]/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#00FF88]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{labels.statusSuccessTitle}</h3>
        <p className="text-text-secondary mb-6">{labels.statusSuccessBody}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-accent-system hover:underline text-sm"
        >
          {labels.statusSendAnother}
        </button>
      </div>
    )
  }

  const inputClasses =
    'w-full px-4 py-3 bg-white/[0.04] border border-border-primary rounded-[var(--radius-btn)] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-system transition-all'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-text-primary mb-2">
          {labels.name}
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'contact-name-err' : undefined}
          className={inputClasses}
          placeholder={labels.namePlaceholder}
          required
          minLength={2}
          maxLength={100}
        />
        {fieldErrors.name && (
          <p id="contact-name-err" role="alert" className="mt-1 text-sm text-red-400">
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-text-primary mb-2">
          {labels.email}
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'contact-email-err' : undefined}
          className={inputClasses}
          placeholder={labels.emailPlaceholder}
          required
        />
        {fieldErrors.email && (
          <p id="contact-email-err" role="alert" className="mt-1 text-sm text-red-400">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label
          htmlFor="contact-company"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          {labels.company}
        </label>
        <input
          type="text"
          id="contact-company"
          name="company"
          autoComplete="organization"
          className={inputClasses}
          placeholder={labels.companyPlaceholder}
          maxLength={100}
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          autoComplete="off"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'contact-message-err' : undefined}
          className={`${inputClasses} resize-none`}
          placeholder={labels.messagePlaceholder}
          required
          minLength={10}
          maxLength={5000}
        />
        {fieldErrors.message && (
          <p id="contact-message-err" role="alert" className="mt-1 text-sm text-red-400">
            {fieldErrors.message[0]}
          </p>
        )}
      </div>

      {/* Error banner */}
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <div aria-live="polite" aria-atomic="true">
        <CTAButton
          type="submit"
          disabled={status === 'submitting'}
          className="w-full justify-center"
        >
          {status === 'submitting' ? labels.statusSending : labels.submit}
        </CTAButton>
      </div>
    </form>
  )
}
