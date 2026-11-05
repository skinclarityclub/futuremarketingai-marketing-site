/**
 * Pricing data — marketing-site mirror of fma-app/src/lib/skills.ts AGENT_TIERS.
 *
 * SSoT: fma-app/src/lib/skills.ts. When tier prices, workspace ranges or
 * credits-per-workspace change there, update here too.
 *
 * Two pricing models:
 * - 'fixed': Founding. A flat monthly price that covers `includedWorkspaces`;
 *   every workspace above that adds `pricePerExtraWorkspace`. fma-app calls this
 *   model 'included' (#1904, 10 included since #1943); credits stay fixed.
 * - 'workspace': monthly price = pricePerWorkspace * workspaces. Credits
 *   scale with workspaces (creditsPerWorkspace * workspaces). Per-workspace
 *   tarief recalibrated every 6 months on observed credit usage.
 */

import type { TierKey } from './skills-data'

export interface FixedTierPricing {
  pricingModel: 'fixed'
  price: number
  includedWorkspaces: number
  pricePerExtraWorkspace: number
  credits: number
  onboardingFee: number
}

export interface WorkspaceTierPricing {
  pricingModel: 'workspace'
  pricePerWorkspace: number
  minWorkspaces: number
  /** -1 = unlimited */
  maxWorkspaces: number
  creditsPerWorkspace: number
  onboardingFee: number
}

export type TierPricing = FixedTierPricing | WorkspaceTierPricing

export const TIER_PRICING: Record<TierKey, TierPricing> = {
  FOUNDING_MEMBER: {
    pricingModel: 'fixed',
    price: 997,
    includedWorkspaces: 10,
    pricePerExtraWorkspace: 299,
    credits: 8000,
    onboardingFee: 0,
  },
  GROWTH: {
    pricingModel: 'workspace',
    pricePerWorkspace: 499,
    minWorkspaces: 2,
    maxWorkspaces: 4,
    creditsPerWorkspace: 800,
    onboardingFee: 1997,
  },
  PROFESSIONAL: {
    pricingModel: 'workspace',
    pricePerWorkspace: 399,
    minWorkspaces: 5,
    maxWorkspaces: 14,
    creditsPerWorkspace: 800,
    onboardingFee: 3997,
  },
  ENTERPRISE: {
    pricingModel: 'workspace',
    pricePerWorkspace: 299,
    minWorkspaces: 15,
    maxWorkspaces: -1,
    creditsPerWorkspace: 800,
    onboardingFee: 5997,
  },
}

/** The day the prices on /pricing were last checked against fma-app; shown on the page. */
export const PRICING_CHECKED_ON = '2026-11-06'

/** Founding config, narrowed once so callers do not repeat the model check. */
export const FOUNDING = TIER_PRICING.FOUNDING_MEMBER as FixedTierPricing

/** Monthly price in EUR for a given tier + workspace count. */
export function priceForTier(tier: TierKey, workspaces: number): number {
  const cfg = TIER_PRICING[tier]
  if (cfg.pricingModel === 'fixed') {
    return cfg.price + Math.max(0, workspaces - cfg.includedWorkspaces) * cfg.pricePerExtraWorkspace
  }
  const max = cfg.maxWorkspaces === -1 ? Infinity : cfg.maxWorkspaces
  const clamped = Math.max(cfg.minWorkspaces, Math.min(max, workspaces))
  return clamped * cfg.pricePerWorkspace
}

/** Tier keys that participate in the shared workspace slider (excludes Founding). */
export const WORKSPACE_TIER_KEYS = ['GROWTH', 'PROFESSIONAL', 'ENTERPRISE'] as const
export type WorkspaceTierKey = (typeof WORKSPACE_TIER_KEYS)[number]

/**
 * Detect which workspace-priced tier a given workspace count falls into.
 * Growth: 2-4, Professional: 5-14, Enterprise: 15+. For workspaces=1
 * returns Growth (the lowest applicable tier) so the slider has a sensible
 * "below minimum" fallback rather than rendering nothing active.
 */
export function detectWorkspaceTier(workspaces: number): WorkspaceTierKey {
  for (const tier of WORKSPACE_TIER_KEYS) {
    const cfg = TIER_PRICING[tier] as WorkspaceTierPricing
    const max = cfg.maxWorkspaces === -1 ? Infinity : cfg.maxWorkspaces
    if (workspaces >= cfg.minWorkspaces && workspaces <= max) return tier
  }
  // Workspaces below Growth.minWorkspaces (e.g. 1) → Growth as starting point.
  return 'GROWTH'
}

/** Shared-slider bounds. Lower-bound 1 for transparency about what one
 * client brand costs; upper-bound 30 covers the Enterprise range without
 * pretending Enterprise has a hard cap.
 */
export const SHARED_SLIDER_MIN = 1
export const SHARED_SLIDER_MAX = 30

/** EUR thousands-separator formatter. Use for tier prices. */
export function formatEur(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : locale === 'es' ? 'es-ES' : 'nl-NL', {
    maximumFractionDigits: 0,
  }).format(amount)
}
