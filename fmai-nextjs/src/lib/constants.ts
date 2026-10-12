/**
 * Shared constants — SSoT for numbers used across multiple pages.
 *
 * WHY: prevents drift when home/pricing/founding-member all reference the
 * same capacity numbers. There is no "taken" count: no founding org pays yet, so a
 * number of taken spots cannot be proven (Daley 2026-10-12, counter out).
 */

export const FOUNDING_SPOTS_TOTAL = 10
export const MAX_PARTNERS_PER_YEAR = 10

// ISO 8601 date string.
//
// FOUNDING_COHORT_START is fixed by the partnership program. Once it is in the
// past, FoundingCounter stops rendering the line rather than advertising a
// start date that has been and gone; set the next cohort's date to bring it back.
export const FOUNDING_COHORT_START = '2026-06-01'
