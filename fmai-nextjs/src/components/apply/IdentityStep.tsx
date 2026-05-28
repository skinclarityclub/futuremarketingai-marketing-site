'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useApplyWizard } from '@/lib/apply/store'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

interface FieldError {
  name?: string
  email?: string
  agency?: string
  role?: string
}

function validate(
  identity: ReturnType<typeof useApplyWizard.getState>['identity'],
  t: (key: string) => string,
): FieldError {
  const errors: FieldError = {}
  if (!identity.name.trim()) errors.name = t('errors.nameRequired')
  if (!identity.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email))
    errors.email = t('errors.emailRequired')
  if (!identity.agency.trim()) errors.agency = t('errors.agencyRequired')
  if (!identity.role.trim()) errors.role = t('errors.roleRequired')
  return errors
}

export function IdentityStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('apply.wizard')
  const tForm = useTranslations('apply.form')
  const identity = useApplyWizard((s) => s.identity)
  const setIdentity = useApplyWizard((s) => s.setIdentity)
  const [errors, setErrors] = useState<FieldError>({})

  const onContinue = () => {
    const v = validate(identity, t)
    setErrors(v)
    if (Object.keys(v).length === 0) onNext()
  }

  return (
    <div className="space-y-6">
      <header className="text-center space-y-3">
        <EyebrowLabel>{t('identity.eyebrow')}</EyebrowLabel>
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">
          {t('identity.title')}
        </h2>
        <p className="text-base text-text-secondary leading-relaxed">
          {t('identity.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="apply-name"
          label={tForm('nameLabel')}
          required
          value={identity.name}
          onChange={(v) => setIdentity({ name: v })}
          placeholder={tForm('namePlaceholder')}
          error={errors.name}
        />
        <Field
          id="apply-email"
          label={tForm('emailLabel')}
          required
          type="email"
          value={identity.email}
          onChange={(v) => setIdentity({ email: v })}
          placeholder={tForm('emailPlaceholder')}
          error={errors.email}
        />
        <Field
          id="apply-agency"
          label={tForm('agencyLabel')}
          required
          value={identity.agency}
          onChange={(v) => setIdentity({ agency: v })}
          error={errors.agency}
        />
        <Field
          id="apply-role"
          label={tForm('roleLabel')}
          required
          value={identity.role}
          onChange={(v) => setIdentity({ role: v })}
          placeholder={tForm('rolePlaceholder')}
          error={errors.role}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-system text-bg-deep font-semibold rounded-[var(--radius-btn)] hover:brightness-110 transition-[filter] text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {t('progress.next')} →
        </button>
      </div>
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  placeholder?: string
  error?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
  error,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
        {required ? <span className="text-accent-human ml-1">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full bg-bg-deep/60 border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-system/40 transition-colors ${
          error ? 'border-error' : 'border-border-primary focus:border-accent-system'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
