'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'
import { CTAButton } from '@/components/ui/CTAButton'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { CountUp } from '@/components/motion/CountUp'
import {
  TIER_PRICING,
  priceForTier,
  creditsForTier,
  isTierActiveForWorkspaces,
  isFoundingBetterValueAt,
  formatEur,
} from '@/lib/pricing-data'
import type { TierKey } from '@/lib/skills-data'
import { Check } from 'lucide-react'

type TierLabelKey = 'founding' | 'growth' | 'professional' | 'enterprise'

const TIER_KEY_MAP: Record<TierLabelKey, TierKey> = {
  founding: 'FOUNDING_MEMBER',
  growth: 'GROWTH',
  professional: 'PROFESSIONAL',
  enterprise: 'ENTERPRISE',
}

interface TierBentoCardProps {
  tierLabel: TierLabelKey
  featureCount: number
  locale: string
  /** Shared slider value driving live price + glow state. */
  workspaces: number
  /** Founding-only counter values for description interpolation. */
  foundingCounter?: { taken: number; total: number }
}

/**
 * TierBentoCard — driven by the shared `workspaces` slider. Glows + scales
 * when the workspace count falls in its range (or, for Founding, when the
 * workspace-priced math crosses its €997 fixed price). Replaces the old
 * per-card slider TierPricingCard with a unified UX where the slider lives
 * once above the grid.
 */
export function TierBentoCard({
  tierLabel,
  featureCount,
  locale,
  workspaces,
  foundingCounter,
}: TierBentoCardProps) {
  const t = useTranslations('pricing')
  const reduced = useReducedMotion()
  const tierKey = TIER_KEY_MAP[tierLabel]
  const config = TIER_PRICING[tierKey]
  const isFixed = config.pricingModel === 'fixed'

  const isActive = useMemo(() => {
    if (isFixed) return isFoundingBetterValueAt(workspaces)
    return isTierActiveForWorkspaces(
      tierKey as 'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE',
      workspaces,
    )
  }, [isFixed, tierKey, workspaces])

  const clampedForTier = !isFixed
    ? Math.max(
        config.minWorkspaces,
        Math.min(
          config.maxWorkspaces === -1 ? Infinity : config.maxWorkspaces,
          workspaces,
        ),
      )
    : 0
  const livePrice = !isFixed ? priceForTier(tierKey, clampedForTier) : config.price
  const liveCredits = !isFixed ? creditsForTier(tierKey, clampedForTier) : config.credits

  return (
    <motion.div
      animate={
        reduced
          ? undefined
          : {
              scale: isActive ? 1.02 : 1,
              y: isActive ? -4 : 0,
            }
      }
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="h-full"
    >
      <SpotlightCard
        ariaLabel={t(`tiers.${tierLabel}.name`)}
        className={`spotlight-card relative flex h-full flex-col rounded-2xl border bg-bg-surface/50 p-6 transition-colors duration-300 backdrop-blur-sm ${
          isActive
            ? 'border-accent-system/60 shadow-[0_0_0_1px_rgba(0,212,170,0.18),0_18px_60px_-30px_rgba(0,212,170,0.45)]'
            : 'border-border-primary/70'
        }`}
      >
        {tierLabel === 'founding' && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-[#F5A623] text-bg-deep shadow-lg">
              {t(`tiers.founding.subtitle`)}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 mt-2">
          <h3 className="text-xl font-bold font-display text-text-primary mb-1">
            {t(`tiers.${tierLabel}.name`)}
          </h3>
          <p className="text-xs text-text-muted">{t(`tiers.${tierLabel}.tagline`)}</p>
        </div>

        {/* Bento — price tile (large) */}
        <div
          className={`rounded-xl border px-4 py-4 mb-3 transition-colors duration-300 ${
            isActive
              ? 'border-accent-system/40 bg-accent-system/[0.06]'
              : 'border-border-primary/60 bg-white/[0.02]'
          }`}
          aria-live="polite"
        >
          {isFixed ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-text-primary">
                  €
                  <CountUp
                    to={config.price}
                    locale={locale}
                    format={(n) => formatEur(Math.round(n), locale)}
                  />
                </span>
                <span className="text-text-muted text-sm">/mo</span>
              </div>
              <p className="text-xs font-medium text-[#F5A623] mt-1">{t('tiers.lifetimeBadge')}</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-text-muted text-[10px] uppercase tracking-wide font-mono">
                  {t('tiers.fromLabel')}
                </span>
                <span className="font-mono text-3xl font-bold text-text-primary">
                  €
                  <CountUp
                    to={livePrice}
                    locale={locale}
                    smoothUpdates
                    smoothUpdateDuration={0.35}
                    format={(n) => formatEur(Math.round(n), locale)}
                  />
                </span>
                <span className="text-text-muted text-sm">/mo</span>
              </div>
              <p className="text-accent-system text-xs font-medium mt-1">
                €{config.pricePerWorkspace} {t('tiers.perWorkspaceLabel')} ·{' '}
                {t('tiers.workspaceRange', {
                  min: config.minWorkspaces,
                  max:
                    config.maxWorkspaces === -1
                      ? '∞'
                      : String(config.maxWorkspaces),
                })}
              </p>
            </>
          )}
        </div>

        {/* Bento — twin tiles credits / onboarding */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-lg border border-border-primary/60 bg-white/[0.02] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-0.5">
              {t('tiers.creditsTileLabel')}
            </p>
            <p className="font-mono text-sm font-semibold text-text-primary">
              <CountUp
                to={liveCredits}
                locale={locale}
                smoothUpdates
                smoothUpdateDuration={0.35}
                format={(n) => formatEur(Math.round(n), locale)}
              />
              <span className="text-text-muted text-[10px] font-normal"> /mo</span>
            </p>
          </div>
          <div className="rounded-lg border border-border-primary/60 bg-white/[0.02] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-0.5">
              {t('tiers.onboardingTileLabel')}
            </p>
            <p className="font-mono text-sm font-semibold text-text-primary">
              €{formatEur(config.onboardingFee, locale)}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm mb-4 leading-relaxed">
          {tierLabel === 'founding' && foundingCounter
            ? t(`tiers.founding.description`, foundingCounter)
            : t(`tiers.${tierLabel}.description`)}
        </p>

        {/* Features list */}
        <ul className="space-y-2 mb-6 flex-1">
          {Array.from({ length: featureCount }).map((_, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-secondary"
            >
              <Check
                className="w-4 h-4 text-accent-system flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{t(`tiers.${tierLabel}.features_${i}`)}</span>
            </li>
          ))}
        </ul>

        <CTAButton
          href="/apply"
          variant={isActive ? 'primary' : 'secondary'}
          className="w-full justify-center"
        >
          {t('applyCta')}
        </CTAButton>
      </SpotlightCard>
    </motion.div>
  )
}
