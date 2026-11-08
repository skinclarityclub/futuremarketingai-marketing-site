/**
 * Shared constants — SSoT for numbers used across multiple pages.
 *
 * WHY: prevents drift when home/pricing/apply all reference the same capacity
 * numbers. FOUNDING_SPOTS_TAKEN counts signed agencies on Founding A1.4 only;
 * legacy, demo and internal orgs never count (plan A1.4 §8). Raise it by hand
 * when a contract is signed, never before.
 */

export const FOUNDING_SPOTS_TOTAL = 3
export const FOUNDING_SPOTS_TAKEN = 0

// ISO 8601 date string.
//
// FOUNDING_COHORT_START is fixed by the partnership program. Once it is in the
// past, FoundingCounter stops rendering the line rather than advertising a
// start date that has been and gone; set the next cohort's date to bring it back.
export const FOUNDING_COHORT_START = '2026-06-01'
