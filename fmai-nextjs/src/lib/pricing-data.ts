/**
 * Pricing data — marketing-site mirror of fma-app/src/lib/skills.ts AGENT_TIERS.
 *
 * SSoT: fma-app/src/lib/skills.ts. When tier prices, workspace ranges or
 * credits-per-workspace change there, update here too.
 *
 * Two pricing models since 2026-04-28:
 * - 'fixed': single monthly price (Founding only).
 * - 'workspace': monthly price = pricePerWorkspace * workspaces. Credits
 *   scale with workspaces (creditsPerWorkspace * workspaces). Per-workspace
 *   tarief recalibrated every 6 months on observed credit usage.
 */

import type { TierKey } from './skills-data'

export interface FixedTierPricing {
  pricingModel: 'fixed'
  price: number
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

/** Monthly price in EUR for a given tier + workspace count. */
export function priceForTier(tier: TierKey, workspaces: number): number {
  const cfg = TIER_PRICING[tier]
  if (cfg.pricingModel === 'fixed') return cfg.price
  const max = cfg.maxWorkspaces === -1 ? Infinity : cfg.maxWorkspaces
  const clamped = Math.max(cfg.minWorkspaces, Math.min(max, workspaces))
  return clamped * cfg.pricePerWorkspace
}

/** Monthly credit allocation for a given tier + workspace count. */
export function creditsForTier(tier: TierKey, workspaces: number): number {
  const cfg = TIER_PRICING[tier]
  if (cfg.pricingModel === 'fixed') return cfg.credits
  const max = cfg.maxWorkspaces === -1 ? Infinity : cfg.maxWorkspaces
  const clamped = Math.max(cfg.minWorkspaces, Math.min(max, workspaces))
  return clamped * cfg.creditsPerWorkspace
}

/**
 * Min/max monthly price for a workspace-tier (used for /pricing card range
 * display + JSON-LD priceSpecification). Fixed-tier returns price both ways.
 * For unbounded max (Enterprise), returns null on max.
 */
export function priceRangeForTier(tier: TierKey): { min: number; max: number | null } {
  const cfg = TIER_PRICING[tier]
  if (cfg.pricingModel === 'fixed') return { min: cfg.price, max: cfg.price }
  const min = cfg.minWorkspaces * cfg.pricePerWorkspace
  const max = cfg.maxWorkspaces === -1 ? null : cfg.maxWorkspaces * cfg.pricePerWorkspace
  return { min, max }
}

/** Default workspace count for slider initial value (mid-range). */
export function defaultWorkspaces(tier: TierKey): number {
  const cfg = TIER_PRICING[tier]
  if (cfg.pricingModel === 'fixed') return 0
  if (cfg.maxWorkspaces === -1) return cfg.minWorkspaces
  return Math.floor((cfg.minWorkspaces + cfg.maxWorkspaces) / 2)
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

/**
 * Returns whether a tier is "active" for the given workspace count — used
 * to glow / scale the matching tier card on the shared slider.
 */
export function isTierActiveForWorkspaces(tier: WorkspaceTierKey, workspaces: number): boolean {
  return detectWorkspaceTier(workspaces) === tier
}

/**
 * Returns whether Founding (fixed €997) is cheaper than the workspace-priced
 * tier at the current slider value. When true, the Founding tile shows a
 * "better deal for your portfolio" glow next to the slider's active tier.
 */
export function isFoundingBetterValueAt(workspaces: number): boolean {
  if (workspaces < 1) return true
  const founding = TIER_PRICING.FOUNDING_MEMBER
  if (founding.pricingModel !== 'fixed') return false
  const tier = detectWorkspaceTier(workspaces)
  const workspacePrice = priceForTier(tier, workspaces)
  return workspacePrice >= founding.price
}

/** Shared-slider bounds. Lower-bound 1 (sub-Growth) for transparency about
 * what 1-workspace would cost; upper-bound 30 covers full Enterprise range
 * without pretending Enterprise has a hard cap.
 */
export const SHARED_SLIDER_MIN = 1
export const SHARED_SLIDER_MAX = 30

/** EUR thousands-separator formatter. Use for tier prices. */
export function formatEur(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : locale === 'es' ? 'es-ES' : 'nl-NL', {
    maximumFractionDigits: 0,
  }).format(amount)
}
