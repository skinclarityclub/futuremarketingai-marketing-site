'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import {
  TIER_PRICING,
  priceForTier,
  creditsForTier,
  defaultWorkspaces,
  priceRangeForTier,
  formatEur,
} from '@/lib/pricing-data'
import type { TierKey } from '@/lib/skills-data'

type TierLabelKey = 'founding' | 'growth' | 'professional' | 'enterprise'

const TIER_KEY_MAP: Record<TierLabelKey, TierKey> = {
  founding: 'FOUNDING_MEMBER',
  growth: 'GROWTH',
  professional: 'PROFESSIONAL',
  enterprise: 'ENTERPRISE',
}

// For unbounded Enterprise, the slider needs a finite upper bound. 35 above
// minWorkspaces is enough headroom to communicate "scales freely" without
// pretending the cap is real.
const ENTERPRISE_SLIDER_HEADROOM = 35

interface TierPricingCardProps {
  tierLabel: TierLabelKey
  highlighted?: boolean
  badge?: 'founding'
  featureCount: number
  locale: string
  /** Founding-only: counter values for description interpolation. */
  foundingCounter?: { taken: number; total: number }
}

export function TierPricingCard({
  tierLabel,
  highlighted,
  badge,
  featureCount,
  locale,
  foundingCounter,
}: TierPricingCardProps) {
  const t = useTranslations('pricing')
  const tierKey = TIER_KEY_MAP[tierLabel]
  const config = TIER_PRICING[tierKey]
  const isFixed = config.pricingModel === 'fixed'

  const [workspaces, setWorkspaces] = useState(defaultWorkspaces(tierKey))
  const total = priceForTier(tierKey, workspaces)
  const credits = creditsForTier(tierKey, workspaces)

  const sliderMax =
    !isFixed && config.maxWorkspaces === -1
      ? config.minWorkspaces + ENTERPRISE_SLIDER_HEADROOM
      : !isFixed
        ? config.maxWorkspaces
        : 0

  return (
    <GlassCard highlighted={highlighted} className="relative flex flex-col h-full">
      {badge === 'founding' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-[#F5A623] text-bg-deep">
            {t(`tiers.${tierLabel}.subtitle`)}
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold font-display text-text-primary mb-1 mt-2">
        {t(`tiers.${tierLabel}.name`)}
      </h3>
      <p className="text-xs text-text-muted mb-4">{t(`tiers.${tierLabel}.subtitle`)}</p>

      {isFixed ? (
        <div className="mb-4">
          <div>
            <span className="font-mono text-3xl font-bold text-text-primary">
              €{formatEur(config.price, locale)}
            </span>
            <span className="text-text-muted text-sm">/mo</span>
            <span className="ml-2 text-xs font-medium text-[#F5A623]">
              {t('tiers.lifetimeBadge')}
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">
            {t('tiers.creditsTotalLabel', { credits: formatEur(config.credits, locale) })}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          {/* Anchor: vanaf €X */}
          <div>
            <span className="text-text-muted text-xs uppercase tracking-wide">
              {t('tiers.fromLabel')}
            </span>{' '}
            <span className="font-mono text-2xl font-bold text-text-primary">
              €{formatEur(priceRangeForTier(tierKey).min, locale)}
            </span>
            <span className="text-text-muted text-sm">/mo</span>
          </div>
          <p className="text-accent-system text-sm font-medium mt-0.5">
            €{config.pricePerWorkspace} {t('tiers.perWorkspaceLabel')}
          </p>

          {/* Slider */}
          <div className="mt-3">
            <label htmlFor={`workspaces-${tierLabel}`} className="block">
              <span className="text-text-secondary text-xs block mb-1">
                {t('tiers.workspacesPickerLabel')}:{' '}
                <span className="font-mono text-text-primary font-semibold">{workspaces}</span>
                {config.maxWorkspaces === -1 && workspaces === sliderMax ? '+' : ''}
              </span>
              <input
                id={`workspaces-${tierLabel}`}
                type="range"
                min={config.minWorkspaces}
                max={sliderMax}
                value={workspaces}
                onChange={(e) => setWorkspaces(Number(e.target.value))}
                className="w-full accent-accent-system cursor-pointer"
                aria-valuemin={config.minWorkspaces}
                aria-valuemax={sliderMax}
                aria-valuenow={workspaces}
              />
            </label>
          </div>

          {/* Live total */}
          <div
            className="mt-3 rounded-md bg-bg-elevated/50 px-3 py-2 border border-border-primary/50"
            aria-live="polite"
          >
            <p className="text-xs text-text-muted">
              {t('tiers.totalLabel', { workspaces })}
            </p>
            <p className="font-mono text-xl font-bold text-text-primary">
              €{formatEur(total, locale)}
              <span className="text-text-muted text-sm font-normal">/mo</span>
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {t('tiers.creditsTotalLabel', { credits: formatEur(credits, locale) })}
            </p>
          </div>
        </div>
      )}

      <p className="text-text-muted text-xs mb-4">
        {t('onboardingLabel')}: €{formatEur(config.onboardingFee, locale)}
      </p>

      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
        {tierLabel === 'founding' && foundingCounter
          ? t(`tiers.founding.description`, foundingCounter)
          : t(`tiers.${tierLabel}.description`)}
      </p>

      <div className="border-t border-border-primary mb-4" />

      <ul className="space-y-2 mb-6 flex-1">
        {Array.from({ length: featureCount }).map((_, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-text-secondary"
          >
            <svg
              className="w-4 h-4 text-accent-system flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{t(`tiers.${tierLabel}.features_${i}`)}</span>
          </li>
        ))}
      </ul>

      <CTAButton
        href="/apply"
        variant={highlighted ? 'primary' : 'secondary'}
        className="w-full justify-center"
      >
        {t('applyCta')}
      </CTAButton>
    </GlassCard>
  )
}
