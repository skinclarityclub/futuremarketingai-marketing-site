'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  FOUNDING,
  TIER_PRICING,
  detectWorkspaceTier,
  priceForTier,
  formatEur,
  SHARED_SLIDER_MIN,
  SHARED_SLIDER_MAX,
  type WorkspaceTierPricing,
} from '@/lib/pricing-data'
import { CountUp } from '@/components/motion/CountUp'

interface WorkspaceSliderProps {
  locale: string
  /** Server-chosen start value, so the server HTML already shows real amounts. */
  initialWorkspaces: number
}

const TIER_LABEL_KEY = {
  GROWTH: 'growth',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const

/**
 * The calculator on /pricing: drag to a number of client brands and see what
 * Founding costs now, per brand, next to the tariff that applies once the
 * founding spots are taken. Founding is the offer of today, so it is the big number.
 */
export function WorkspaceSlider({ locale, initialWorkspaces }: WorkspaceSliderProps) {
  const t = useTranslations('pricing.example.slider')
  const tTiers = useTranslations('pricing.tiers')
  const sliderId = useId()
  const [workspaces, setWorkspaces] = useState(initialWorkspaces)

  const founding = priceForTier('FOUNDING_MEMBER', workspaces)
  const perBrand = Math.round(founding / workspaces)
  const laterTier = detectWorkspaceTier(workspaces)
  const laterCfg = TIER_PRICING[laterTier] as WorkspaceTierPricing
  const later = priceForTier(laterTier, workspaces)
  const eur = (n: number) => formatEur(Math.round(n), locale)

  return (
    <div className="rounded-2xl bg-[#0e121b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] md:p-8">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div>
          <p className="mb-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#5eead4]">
            {t('eyebrow')}
          </p>
          <label htmlFor={sliderId} className="block">
            <span className="mb-3 block text-sm text-[#c4ccd8]">
              {t('label')}:{' '}
              <span className="font-mono text-base font-semibold text-[#f4f7fb]">{workspaces}</span>
            </span>
            <input
              id={sliderId}
              type="range"
              min={SHARED_SLIDER_MIN}
              max={SHARED_SLIDER_MAX}
              value={workspaces}
              onChange={(e) => setWorkspaces(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#2dd4bf]"
            />
          </label>
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wide text-[#8f9aae]">
            <span>{SHARED_SLIDER_MIN}</span>
            <span>{FOUNDING.includedWorkspaces}</span>
            <span>20</span>
            <span>{SHARED_SLIDER_MAX}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#a3adbd]">
            {t('later', {
              tier: tTiers(`${TIER_LABEL_KEY[laterTier]}.name`),
              price: eur(later),
            })}
            {workspaces < laterCfg.minWorkspaces &&
              ` ${t('laterMinimum', { min: laterCfg.minWorkspaces })}`}
          </p>
        </div>

        <div
          className="rounded-xl bg-[#0a0d14] px-5 py-4 shadow-[0_0_0_1px_rgba(0,212,170,0.28)] md:min-w-[240px]"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-[#8f9aae]">
            {t('totalLabel')}
          </p>
          <p className="font-mono text-3xl font-bold leading-none text-[#f4f7fb]">
            €
            <CountUp to={founding} locale={locale} smoothUpdates smoothUpdateDuration={0.35} format={eur} />
            <span className="align-baseline text-sm font-normal text-[#8f9aae]"> {t('perMonth')}</span>
          </p>
          <p className="mt-2 text-xs text-[#c4ccd8]">{t('perBrand', { price: eur(perBrand) })}</p>
        </div>
      </div>
    </div>
  )
}
