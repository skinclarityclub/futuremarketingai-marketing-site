/**
 * AI Readiness Assessment — shared type definitions.
 *
 * Used by:
 * - questions.ts        — the 16-question SSoT
 * - scoring.ts          — pure scoring + archetype/stage derivation
 * - skill-routing.ts    — archetype × lowestCategory → recommended skills
 * - store.ts            — Zustand client state during the scan
 * - /api/assessment     — request body validation + persistence
 * - email-templates     — result-mail payload shape
 */

export type AssessmentCategory = 'strategy' | 'data' | 'tools' | 'team'

export const ASSESSMENT_CATEGORIES: readonly AssessmentCategory[] = [
  'strategy',
  'data',
  'tools',
  'team',
] as const

// ---------------------------------------------------------------------------
// Archetype — what kind of bureau (determined by dominant category score)
// ---------------------------------------------------------------------------

export type Archetype =
  | 'strategy-led'
  | 'data-led'
  | 'tooling-led'
  | 'team-led'
  | 'balanced'

export const ASSESSMENT_ARCHETYPES: readonly Archetype[] = [
  'strategy-led',
  'data-led',
  'tooling-led',
  'team-led',
  'balanced',
] as const

// ---------------------------------------------------------------------------
// Stage — how far along (determined by total score)
// ---------------------------------------------------------------------------

export type Stage = 'emerging' | 'scaling' | 'leading'

export const ASSESSMENT_STAGES: readonly Stage[] = [
  'emerging',
  'scaling',
  'leading',
] as const

// ---------------------------------------------------------------------------
// Backwards-compat aliases — kept for existing DB rows + analytics events
// @deprecated Use Stage / Archetype instead
// ---------------------------------------------------------------------------

/** @deprecated Use `Stage` instead. Kept for DB/analytics backwards-compat. */
export type AssessmentPersona = 'explorer' | 'builder' | 'operator'

/** @deprecated Use `ASSESSMENT_STAGES` instead. */
export const ASSESSMENT_PERSONAS: readonly AssessmentPersona[] = [
  'explorer',
  'builder',
  'operator',
] as const

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export type QuestionId =
  | 'q1' | 'q2' | 'q3' | 'q4'
  | 'q5' | 'q6' | 'q7' | 'q8'
  | 'q9' | 'q10' | 'q11' | 'q12'
  | 'q13' | 'q14' | 'q15' | 'q16'

export type QuestionType = 'single' | 'likert'

/** Single-select option. `points` ranges 0..4 (4 = most mature answer). */
export interface SingleSelectOption {
  /** Stable key persisted in answers; matches i18n option key. */
  key: 'a' | 'b' | 'c' | 'd'
  points: 0 | 1 | 2 | 3 | 4
}

export interface SingleSelectQuestion {
  id: QuestionId
  category: AssessmentCategory
  type: 'single'
  /** Score multiplier. 1 = standard, 2 = critical (e.g. AI Act / GDPR items). */
  weight: 1 | 2
  options: readonly [SingleSelectOption, SingleSelectOption, SingleSelectOption, SingleSelectOption]
}

export interface LikertQuestion {
  id: QuestionId
  category: AssessmentCategory
  type: 'likert'
  weight: 1 | 2
  /**
   * Invert raw score for negatively-worded items so that
   * "strongly agree" on a bad practice contributes 0 points.
   */
  invertScore?: boolean
}

export type AssessmentQuestion = SingleSelectQuestion | LikertQuestion

/** Persisted answer shape — option key for single, integer 1..5 for likert. */
export type AnswerValue = SingleSelectOption['key'] | 1 | 2 | 3 | 4 | 5

export type AssessmentAnswers = Partial<Record<QuestionId, AnswerValue>>

export interface CategoryScores {
  strategy: number  // 0..100
  data: number
  tools: number
  team: number
}

export interface AssessmentResult {
  perCategory: CategoryScores
  /** Average of the four categories, 0..100. */
  total: number
  /** The bureau's operating archetype — determined by dominant category score. */
  archetype: Archetype
  /** How far along the bureau is — determined by total score. */
  stage: Stage
  /** Category with the lowest score — drives skill recommendations. */
  lowestCategory: AssessmentCategory
  /**
   * @deprecated Use `stage` instead. Kept for DB/analytics backwards-compat.
   * Mapped from stage: emerging=explorer, scaling=builder, leading=operator.
   */
  persona: AssessmentPersona
}

/** Payload posted to /api/assessment from the email-gate component. */
export interface AssessmentSubmission {
  email: string
  locale: 'nl' | 'en' | 'es'
  /** Page slug for analytics + Supabase audit trail. */
  source: string
  consent: boolean
  consentText: string
  /** Honeypot field — must be empty. */
  website?: string
  answers: AssessmentAnswers
  scores: CategoryScores
  total: number
  archetype: Archetype
  stage: Stage
  /** @deprecated Use `stage` instead. */
  persona: AssessmentPersona
}
