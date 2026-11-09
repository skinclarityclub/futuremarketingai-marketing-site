/**
 * Pricing data — the one offer the site sells: Founding A1.4.
 *
 * SSoT: fma-app docs/plans/2026-11-09-founding-a14-credits-PLAN.md §1-§2 (Daley,
 * 9 Nov 2026). Growth, Professional and Enterprise left the site that night
 * (decision D2): regular plans follow after Founding, from three measured
 * months. Existing founding partners keep their own agreement; nothing here
 * describes or changes it.
 */

export interface FoundingPricing {
  /** Monthly price in EUR, excl. VAT, covering `includedWorkspaces` client brands. */
  price: number
  includedWorkspaces: number
  pricePerExtraWorkspace: number
  maxWorkspaces: number
  /** Credits per active client brand per month, pooled across the agency. */
  creditsPerBrand: number
  onboardingFee: number
  /** The price stays fixed for this many paid months. */
  priceLockMonths: number
  /** After the lock: percent below the regular price while the subscription runs without a break (Daley 2026-11-09). */
  loyaltyDiscountPct: number
}

export const FOUNDING: FoundingPricing = {
  price: 1297,
  includedWorkspaces: 5,
  pricePerExtraWorkspace: 199,
  maxWorkspaces: 15,
  creditsPerBrand: 1500,
  onboardingFee: 0,
  priceLockMonths: 12,
  loyaltyDiscountPct: 30,
}

/**
 * Expected regular price for five client brands, shown as an expectation, not a price
 * (D2, Daley 2026-11-09). The fase-A cost audit puts the 70% contribution floor at
 * EUR 2,398.98 for five brands; the A1 proposal had EUR 2,497.
 */
export const REGULAR_EXPECTED = { min: 2400, max: 2500, brands: 5 } as const

/** Credit top-ups: €0.08 per credit, no volume discount (plan §2). */
export const CREDIT_PACKS = [
  { credits: 500, price: 40 },
  { credits: 2000, price: 160 },
  { credits: 5000, price: 400 },
] as const

/** The day the prices on /pricing were last checked against the plan; shown on the page. */
export const PRICING_CHECKED_ON = '2026-11-09'

/**
 * Monthly Founding price in EUR for a number of active client brands. Fewer than
 * the included five still pay the base price; more than the maximum is not on offer.
 */
export function foundingPrice(workspaces: number): number {
  if (!Number.isInteger(workspaces) || workspaces < 1 || workspaces > FOUNDING.maxWorkspaces) {
    throw new RangeError(`Founding covers 1-${FOUNDING.maxWorkspaces} client brands, got ${workspaces}`)
  }
  return FOUNDING.price + Math.max(0, workspaces - FOUNDING.includedWorkspaces) * FOUNDING.pricePerExtraWorkspace
}

/** EUR thousands-separator formatter. Use for prices and credit counts. */
export function formatEur(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : locale === 'es' ? 'es-ES' : 'nl-NL', {
    maximumFractionDigits: 0,
  }).format(amount)
}
