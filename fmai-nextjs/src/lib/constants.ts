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
export const MAX_PARTNERS_PER_YEAR = 10

// ISO 8601 date strings.
//
// FOUNDING_LAST_UPDATED is the date the counter was last VERIFIED, not the date
// a spot was last taken. A reader parses "Stand van <date>" as "someone checked
// this then" — under the old convention the date froze on the last sale and the
// badge advertised April on a page served in September, which reads as an
// abandoned site even while the count itself stayed correct. Refresh it whenever
// you confirm the number, sale or no sale.
export const FOUNDING_LAST_UPDATED = '2026-09-01'

// FOUNDING_COHORT_START is fixed by the partnership program. Once it is in the
// past, FoundingCounter stops rendering the line rather than advertising a
// start date that has been and gone; set the next cohort's date to bring it back.
export const FOUNDING_COHORT_START = '2026-06-01'
