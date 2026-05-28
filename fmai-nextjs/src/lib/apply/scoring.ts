/**
 * /apply wizard — pure scoring functie.
 *
 * Deterministisch + cleancut. Wordt zowel client-side gebruikt voor
 * preview-feedback als server-side gerecomputed in /api/apply
 * ("trust nothing the client says about the math").
 */

import type {
  ApplyScoreBreakdown,
  ApplyWizardSubmission,
  ResultBranch,
} from './types'
import {
  TIER_POINTS,
  REVENUE_POINTS,
  CLIENT_COUNT_POINTS,
  likertMaturityPoints,
  URGENCY_POINTS,
  STAGE_BASELINE,
  PROBLEM_MIN_CHARS_FOR_BONUS,
  PROBLEM_BONUS_POINTS,
  MAX_SCORE_FULL,
  MAX_SCORE_HANDOFF,
  QUALIFIED_THRESHOLD,
} from './questions'

interface ScoreInput {
  qualification?: ApplyWizardSubmission['qualification']
  assessment?: ApplyWizardSubmission['assessment']
  problem?: string
}

export function scoreApplication(input: ScoreInput): ApplyScoreBreakdown {
  const breakdown: ApplyScoreBreakdown['breakdown'] = []

  // Assessment-handoff path: stage baseline replaces Q2/Q3/Q4
  if (input.assessment) {
    const stageBaseline = STAGE_BASELINE[input.assessment.stage] ?? 0
    breakdown.push({
      key: `stage:${input.assessment.stage}`,
      points: stageBaseline,
      max: 5,
    })
  } else if (input.qualification) {
    // Full qualification path: Q2 + Q3 + Q4
    if (input.qualification.q2) {
      breakdown.push({
        key: `q2:${input.qualification.q2}`,
        points: REVENUE_POINTS[input.qualification.q2],
        max: 3,
      })
    }
    if (input.qualification.q3) {
      breakdown.push({
        key: `q3:${input.qualification.q3}`,
        points: CLIENT_COUNT_POINTS[input.qualification.q3],
        max: 3,
      })
    }
    if (input.qualification.q4) {
      breakdown.push({
        key: `q4:${input.qualification.q4}`,
        points: likertMaturityPoints(input.qualification.q4),
        max: 4,
      })
    }
  }

  // Q1 (tier) + Q5 (urgency) — always asked, whether handoff or full path
  if (input.qualification?.q1) {
    breakdown.push({
      key: `q1:${input.qualification.q1}`,
      points: TIER_POINTS[input.qualification.q1],
      max: 3,
    })
  }
  if (input.qualification?.q5) {
    breakdown.push({
      key: `q5:${input.qualification.q5}`,
      points: URGENCY_POINTS[input.qualification.q5],
      max: 3,
    })
  }

  // Problem-field bonus (>=200 chars)
  if (
    input.problem &&
    input.problem.trim().length >= PROBLEM_MIN_CHARS_FOR_BONUS
  ) {
    breakdown.push({
      key: 'problem:bonus',
      points: PROBLEM_BONUS_POINTS,
      max: PROBLEM_BONUS_POINTS,
    })
  }

  const total = breakdown.reduce((sum, b) => sum + b.points, 0)
  const max = input.assessment ? MAX_SCORE_HANDOFF : MAX_SCORE_FULL
  const branch: ResultBranch =
    total >= QUALIFIED_THRESHOLD ? 'qualified' : 'review'

  return { total, max, branch, breakdown }
}

/**
 * Format score as compact log-prefix voor de `problem` Supabase-kolom.
 * Format: `[score:7/17][branch:qualified][from:assessment][a:data-led][st:scaling]`
 *
 * Voorkomt nu een DB-migratie (Phase B). Eenvoudig later SQL-parsable.
 */
export function formatScorePrefix(
  score: ApplyScoreBreakdown,
  assessment?: ApplyWizardSubmission['assessment'],
): string {
  const parts = [
    `[score:${score.total}/${score.max}]`,
    `[branch:${score.branch}]`,
  ]
  if (assessment) {
    parts.push(`[from:assessment][a:${assessment.archetype}][st:${assessment.stage}][lc:${assessment.lowestCategory}]`)
  }
  return parts.join('')
}
