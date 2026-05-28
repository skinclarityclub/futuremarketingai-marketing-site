/**
 * /apply wizard — shared type definitions.
 *
 * Used by:
 * - questions.ts  — 5 qualification questions SSoT
 * - scoring.ts    — pure scoring + branch determination
 * - store.ts      — Zustand wizard state during the flow
 * - /api/apply    — request body validation + server-side rescore
 */

import type { Archetype, Stage, AssessmentCategory } from '@/lib/assessment/types'

export type WizardStep =
  | 'identity'
  | 'scanCheck'
  | 'qualification'
  | 'scanSummary'
  | 'problem'
  | 'submitting'
  | 'resultQualified'
  | 'resultReview'

export const WIZARD_STEP_ORDER: readonly WizardStep[] = [
  'identity',
  'scanCheck',
  'qualification',
  'scanSummary',
  'problem',
] as const

// ---------------------------------------------------------------------------
// Identity (Step 1)
// ---------------------------------------------------------------------------

export interface IdentityFields {
  name: string
  email: string
  agency: string
  role: string
}

// ---------------------------------------------------------------------------
// Qualification questions (Step 3a — only when no scan data)
// ---------------------------------------------------------------------------

export type ApplyQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5'

/**
 * Q1-Q5 option keys are stable across i18n (NL/EN/ES use same keys).
 * Q1 reuses apply.form.tierOptions, Q2 reuses revenueOptions,
 * Q3 reuses clientCountOptions. Q4 likert (1-5). Q5 has its own urgency keys.
 */

export type TierKey = 'founding' | 'growth' | 'professional' | 'enterprise' | 'unsure'
export type RevenueKey = 'under_300k' | '300k_1m' | '1m_3m' | '3m_10m' | 'over_10m'
export type ClientCountKey = 'solo' | '1_5' | '5_15' | '15_50' | 'over_50'
export type UrgencyKey = '30days' | 'quarter' | 'explore' | 'unknown'
export type LikertValue = 1 | 2 | 3 | 4 | 5

export interface QualificationAnswers {
  q1?: TierKey
  q2?: RevenueKey
  q3?: ClientCountKey
  q4?: LikertValue
  q5?: UrgencyKey
}

// ---------------------------------------------------------------------------
// Scan-handoff (Step 3b — when assessment data is available)
// ---------------------------------------------------------------------------

/**
 * Compact codes from assessment shareable URL format.
 * URL param keys: ?a=archetype&st=stage&lc=lowestCategory
 */
export interface AssessmentHandoff {
  archetype: Archetype
  stage: Stage
  lowestCategory: AssessmentCategory
  source: 'url' | 'session' // origin of the data (URL params or sessionStorage)
}

// ---------------------------------------------------------------------------
// Submission payload (POST /api/apply)
// ---------------------------------------------------------------------------

export type ResultBranch = 'qualified' | 'review'

export interface ApplyWizardSubmission {
  identity: IdentityFields
  /** Either qualification answers OR assessment-handoff (mutually exclusive). */
  qualification?: QualificationAnswers
  assessment?: AssessmentHandoff
  /** Free-text problem context (200-2000 chars, optional but +1 score). */
  problem?: string
  locale: 'nl' | 'en' | 'es'
  /** Honeypot — must be empty. */
  website?: string
}

export interface ApplyWizardResponse {
  success: boolean
  branch: ResultBranch
  score: number
  maxScore: number
  /** Calendly URL (only present when branch === 'qualified'). */
  calendlyUrl?: string
}

export interface ApplyScoreBreakdown {
  total: number
  max: number
  branch: ResultBranch
  /** Per-question contribution for analytics + admin email. */
  breakdown: Array<{ key: string; points: number; max: number }>
}
