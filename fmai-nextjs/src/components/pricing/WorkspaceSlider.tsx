'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import {
  detectWorkspaceTier,
  isFoundingBetterValueAt,
  priceForTier,
  creditsForTier,
  formatEur,
  SHARED_SLIDER_MIN,
  SHARED_SLIDER_MAX,
} from '@/lib/pricing-data'
import { CountUp } from '@/components/motion/CountUp'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

interface WorkspaceSliderProps {
  workspaces: number
  setWorkspaces: (n: number) => void
  locale: string
}

const TIER_LABEL_KEY: Record<
  'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE',
  'growth' | 'professional' | 'enterprise'
> = {
  GROWTH: 'growth',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
}

/**
 * Shared workspace slider — the signature interactive experiment of the
 * pricing page. One slider drives all four tier cards: as the user drags,
 * the matching workspace-priced tier (Growth 2-4, Pro 5-14, Ent 15+) lights
 * up and its card scales/glows. Price + credits run via CountUp smoothUpdates
 * for fluid value transitions. When the workspace-priced total exceeds the
 * fixed Founding price (€997), a "Founding wint" pill surfaces next to the
 * active-tier indicator so the math is self-evident.
 */
export function WorkspaceSlider({ workspaces, setWorkspaces, locale }: WorkspaceSliderProps) {
  const t = useTranslations('pricing')
  const tTiers = useTranslations('pricing.tiers')
  const sliderId = useId()

  const activeTier = detectWorkspaceTier(workspaces)
  const activeTierLabel = TIER_LABEL_KEY[activeTier]
  const clampedWorkspaces = Math.max(SHARED_SLIDER_MIN, Math.min(SHARED_SLIDER_MAX, workspaces))
  const total = priceForTier(activeTier, clampedWorkspaces)
  const credits = creditsForTier(activeTier, clampedWorkspaces)
  const foundingWins = isFoundingBetterValueAt(workspaces)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-primary/70 bg-gradient-to-br from-bg-surface/90 via-bg-deep to-bg-surface/60 backdrop-blur-md p-6 md:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at top left, rgba(0,212,170,0.10), transparent 60%), radial-gradient(ellipse at bottom right, rgba(245,166,35,0.06), transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
        {/* Slider column */}
        <div>
          <EyebrowLabel className="mb-2">{t('slider.eyebrow')}</EyebrowLabel>
          <label htmlFor={sliderId} className="block">
            <span className="block text-text-secondary text-sm mb-3">
              {t('slider.label')}:{' '}
              <span className="font-mono text-text-primary font-semibold text-base">
                {workspaces}
              </span>{' '}
              <span className="text-text-muted text-xs">
                {t('slider.unitLabel', { count: workspaces })}
              </span>
            </span>
            <input
              id={sliderId}
              type="range"
              min={SHARED_SLIDER_MIN}
              max={SHARED_SLIDER_MAX}
              value={workspaces}
              onChange={(e) => setWorkspaces(Number(e.target.value))}
              className="w-full accent-accent-system cursor-pointer h-2"
              aria-valuemin={SHARED_SLIDER_MIN}
              aria-valuemax={SHARED_SLIDER_MAX}
              aria-valuenow={workspaces}
              aria-label={t('slider.label')}
            />
          </label>
          <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wide text-text-muted font-mono">
            <span>1</span>
            <span>5</span>
            <span>15</span>
            <span>30+</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-muted">{t('slider.activeTierLabel')}:</span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-system/15 text-accent-system border border-accent-system/30">
              {tTiers(`${activeTierLabel}.name`)}
            </span>
            {foundingWins && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30">
                {t('slider.foundingWinsBadge')}
              </span>
            )}
          </div>
        </div>

        {/* Live totals column */}
        <div
          className="rounded-xl border border-accent-system/20 bg-bg-elevated/60 px-5 py-4 md:min-w-[230px]"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1">
            {t('slider.totalLabel')}
          </p>
          <p className="font-mono text-3xl font-bold text-text-primary leading-none">
            €
            <CountUp
              to={total}
              locale={locale}
              smoothUpdates
              smoothUpdateDuration={0.35}
              format={(n) => formatEur(Math.round(n), locale)}
            />
            <span className="text-text-muted text-sm font-normal align-baseline">/mo</span>
          </p>
          <p className="text-xs text-text-secondary mt-2">
            <CountUp
              to={credits}
              locale={locale}
              smoothUpdates
              smoothUpdateDuration={0.35}
              format={(n) => formatEur(Math.round(n), locale)}
            />{' '}
            {t('slider.creditsSuffix')}
          </p>
        </div>
      </div>
    </div>
  )
}
