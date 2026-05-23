/**
 * AI Readiness Assessment — pure scoring, archetype classification, stage derivation.
 *
 * No side effects, no IO. Given the answer map, produces per-category
 * percentages, a total, the derived archetype + stage, and the lowest-scoring
 * category (which drives skill recommendations).
 *
 * Math:
 *   - Single-select: option.points (0..4) × question.weight
 *   - Likert (1..5): (response − 1) × question.weight; if invertScore is
 *     set, (5 − response) × question.weight is used instead.
 *   - Category score = sum of points / CATEGORY_MAX_POINTS[cat] × 100,
 *     rounded to nearest integer.
 *   - Missing answers contribute 0 points (defensive; the API also
 *     validates completeness).
 *   - Total = mean of the four category scores, rounded.
 *
 * Stage thresholds (calibrate after ~50 completes):
 *   total <  40 → emerging
 *   40 ≤ total < 70 → scaling
 *   total ≥ 70 → leading
 *
 * Archetype classification:
 *   Spread (max category − min category) ≤ 12 → balanced
 *   Otherwise → dominant category (strategy > data > tools > team tie-break)
 */

import { ASSESSMENT_QUESTIONS, CATEGORY_MAX_POINTS } from './questions'
import {
  ASSESSMENT_CATEGORIES,
  type AnswerValue,
  type Archetype,
  type AssessmentAnswers,
  type AssessmentCategory,
  type AssessmentPersona,
  type AssessmentQuestion,
  type AssessmentResult,
  type CategoryScores,
  type Stage,
} from './types'

const STAGE_EMERGING_MAX = 39
const STAGE_SCALING_MAX = 69

// Minimum spread between highest and lowest category for an archetype to be
// considered dominant. Below this the bureau is Balanced. Calibrate after 50+.
const ARCHETYPE_SPREAD_THRESHOLD = 12

function pointsForQuestion(
  question: AssessmentQuestion,
  answer: AnswerValue | undefined,
): number {
  if (answer === undefined) return 0

  if (question.type === 'single') {
    const option = question.options.find((opt) => opt.key === answer)
    return (option?.points ?? 0) * question.weight
  }

  // Likert: response is 1..5.
  const response = typeof answer === 'number' ? answer : 0
  if (response < 1 || response > 5) return 0
  const raw = question.invertScore ? 5 - response : response - 1
  return raw * question.weight
}

function categoryScore(
  answers: AssessmentAnswers,
  category: AssessmentCategory,
): number {
  const max = CATEGORY_MAX_POINTS[category]
  if (max === 0) return 0
  const sum = ASSESSMENT_QUESTIONS.filter((q) => q.category === category).reduce(
    (acc, q) => acc + pointsForQuestion(q, answers[q.id]),
    0,
  )
  return Math.round((sum / max) * 100)
}

function deriveStage(total: number): Stage {
  if (total <= STAGE_EMERGING_MAX) return 'emerging'
  if (total <= STAGE_SCALING_MAX) return 'scaling'
  return 'leading'
}

/** @deprecated Maps stage to old persona key for DB/analytics backwards-compat. */
function derivePersona(stage: Stage): AssessmentPersona {
  if (stage === 'emerging') return 'explorer'
  if (stage === 'scaling') return 'builder'
  return 'operator'
}

/**
 * Classifies the bureau's archetype from their category score profile.
 * Tie-break order: strategy > data > tools > team (matches narrative arc).
 */
function classify(scores: CategoryScores): Archetype {
  const values = ASSESSMENT_CATEGORIES.map((c) => scores[c])
  const max = Math.max(...values)
  const min = Math.min(...values)

  if (max - min <= ARCHETYPE_SPREAD_THRESHOLD) return 'balanced'

  const map: Record<AssessmentCategory, Archetype> = {
    strategy: 'strategy-led',
    data: 'data-led',
    tools: 'tooling-led',
    team: 'team-led',
  }

  // ASSESSMENT_CATEGORIES is in canonical tie-break order (strategy first)
  for (const cat of ASSESSMENT_CATEGORIES) {
    if (scores[cat] === max) return map[cat]
  }

  return 'balanced'
}

/**
 * Tie-break in canonical strategy/data/tools/team order, matching the
 * narrative arc shown on the result page.
 */
function findLowestCategory(scores: CategoryScores): AssessmentCategory {
  let lowest: AssessmentCategory = ASSESSMENT_CATEGORIES[0]
  for (const cat of ASSESSMENT_CATEGORIES) {
    if (scores[cat] < scores[lowest]) lowest = cat
  }
  return lowest
}

export function scoreAssessment(answers: AssessmentAnswers): AssessmentResult {
  const perCategory: CategoryScores = {
    strategy: categoryScore(answers, 'strategy'),
    data: categoryScore(answers, 'data'),
    tools: categoryScore(answers, 'tools'),
    team: categoryScore(answers, 'team'),
  }
  const total = Math.round(
    (perCategory.strategy + perCategory.data + perCategory.tools + perCategory.team) / 4,
  )
  const stage = deriveStage(total)
  return {
    perCategory,
    total,
    archetype: classify(perCategory),
    stage,
    lowestCategory: findLowestCategory(perCategory),
    persona: derivePersona(stage),
  }
}
