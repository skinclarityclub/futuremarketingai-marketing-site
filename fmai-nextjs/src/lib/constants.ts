/**
 * Shared constants — SSoT for numbers used across multiple pages.
 *
 * WHY: prevents drift when home/pricing/founding-member all reference the
 * same capacity counters. If FOUNDING_SPOTS_TAKEN changes, update it here.
 * Dates (FOUNDING_LAST_UPDATED + FOUNDING_COHORT_START) add credibility to
 * the otherwise-vague "1 of 10 bezet" counter — see audit 03 leak #5.
 */

export const FOUNDING_SPOTS_TAKEN = 1
export const FOUNDING_SPOTS_TOTAL = 10
export const MAX_PARTNERS_PER_YEAR = 20

// ISO 8601 date strings. Update FOUNDING_LAST_UPDATED whenever a founding
// spot is taken. FOUNDING_COHORT_START is fixed by the partnership program.
export const FOUNDING_LAST_UPDATED = '2026-04-24'
export const FOUNDING_COHORT_START = '2026-06-01'
