/**
 * /apply wizard — 5-question qualification SSoT.
 *
 * Question text + option labels live in messages/{nl,en,es}.json under:
 *   - apply.form.tierOptions       (Q1 keys: founding/growth/professional/enterprise/unsure)
 *   - apply.form.revenueOptions    (Q2 keys: under_300k/300k_1m/1m_3m/3m_10m/over_10m)
 *   - apply.form.clientCountOptions (Q3 keys: solo/1_5/5_15/15_50/over_50)
 *   - apply.wizard.qualification.q4Anchors (Q4 likert anchors)
 *   - apply.wizard.qualification.q5Options (Q5 urgency keys: 30days/quarter/explore/unknown)
 *
 * This file is the structural SSoT — only id, type, option keys + points.
 * Server-side rescore via @/lib/apply/scoring uses these exact tables.
 */

import type {
  ApplyQuestionId,
  TierKey,
  RevenueKey,
  ClientCountKey,
  UrgencyKey,
} from './types'

// ---------------------------------------------------------------------------
// Q1 — Tier interest (single, max 3 points)
// ---------------------------------------------------------------------------

export const TIER_POINTS: Record<TierKey, number> = {
  founding: 3,
  growth: 2,
  professional: 2,
  enterprise: 3,
  unsure: 0,
} as const

// ---------------------------------------------------------------------------
// Q2 — Revenue range (single, max 3 points)
// ---------------------------------------------------------------------------

export const REVENUE_POINTS: Record<RevenueKey, number> = {
  under_300k: 0,
  '300k_1m': 2,
  '1m_3m': 3,
  '3m_10m': 3,
  over_10m: 3,
} as const

// ---------------------------------------------------------------------------
// Q3 — Client count (single, max 3 points)
// ---------------------------------------------------------------------------

export const CLIENT_COUNT_POINTS: Record<ClientCountKey, number> = {
  solo: 0,
  '1_5': 2,
  '5_15': 3,
  '15_50': 3,
  over_50: 3,
} as const

// ---------------------------------------------------------------------------
// Q4 — AI/automation maturity (likert 1-5, max 4 points)
// Linear mapping: (value - 1)
// ---------------------------------------------------------------------------

export function likertMaturityPoints(value: number): number {
  if (value < 1 || value > 5) return 0
  return value - 1
}

// ---------------------------------------------------------------------------
// Q5 — Urgency (single, max 3 points)
// ---------------------------------------------------------------------------

export const URGENCY_POINTS: Record<UrgencyKey, number> = {
  '30days': 3,
  quarter: 2,
  explore: 1,
  unknown: 0,
} as const

// ---------------------------------------------------------------------------
// Problem field bonus (200+ chars → +1 point)
// ---------------------------------------------------------------------------

export const PROBLEM_MIN_CHARS_FOR_BONUS = 200
export const PROBLEM_BONUS_POINTS = 1

// ---------------------------------------------------------------------------
// Assessment-handoff baseline (when scan data replaces qualification)
// Stage → baseline points (replaces Q2 + Q3 + Q4 = max 10 points).
// Q1 (tier) + Q5 (urgency) + problem-bonus still asked.
// ---------------------------------------------------------------------------

export const STAGE_BASELINE: Record<string, number> = {
  leading: 5,
  scaling: 3,
  emerging: 1,
} as const

// ---------------------------------------------------------------------------
// Score totals
// ---------------------------------------------------------------------------

/** Full qualification path: Q1(3) + Q2(3) + Q3(3) + Q4(4) + Q5(3) + problem(1) = 17 */
export const MAX_SCORE_FULL = 17

/** Assessment-handoff path: stage(5) + Q1(3) + Q5(3) + problem(1) = 12 */
export const MAX_SCORE_HANDOFF = 12

/** Score threshold for Branch A (instant Calendly). */
export const QUALIFIED_THRESHOLD = 7

/** Question order for rendering (only used in QualificationStep). */
export const QUALIFICATION_QUESTION_ORDER: readonly ApplyQuestionId[] = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
] as const
