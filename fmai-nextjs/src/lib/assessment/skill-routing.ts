/**
 * Persona × lowest-scoring category → 3 recommended Clyde-skills.
 *
 * The lowest category is the biggest readiness gap. Recommendations are
 * the three skills that, given the agency's current maturity (persona),
 * deliver the highest leverage to close that gap. Coming-soon skills are
 * deliberately included for Operator-level gaps where bleeding-edge
 * tooling matches the agency's appetite.
 *
 * 12 cells = 3 personas × 4 categories. Order within each cell is the
 * order shown in the result email (most-impact-first).
 */

import { getSkillBySlug, type SkillData } from '@/lib/skills-data'
import type { AssessmentCategory, AssessmentPersona } from './types'

type SkillSlug =
  | 'social-media'
  | 'blog-factory'
  | 'ad-creator'
  | 'reel-builder'
  | 'voice-agent'
  | 'lead-qualifier'
  | 'email-management'
  | 'manychat'
  | 'reporting'
  | 'seo-geo'
  | 'research'
  | 'clyde'

type RoutingMatrix = Record<
  AssessmentPersona,
  Record<AssessmentCategory, readonly [SkillSlug, SkillSlug, SkillSlug]>
>

const ROUTING_MATRIX: RoutingMatrix = {
  explorer: {
    // Fragmented AI use; biggest leverage is one orchestrator + cheap wins
    strategy: ['clyde', 'research', 'reporting'],
    data: ['research', 'reporting', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'email-management', 'social-media'],
  },
  builder: {
    // Working pilots; formalise + measure + scale core ops
    strategy: ['clyde', 'reporting', 'research'],
    data: ['reporting', 'research', 'seo-geo'],
    tools: ['social-media', 'blog-factory', 'lead-qualifier'],
    team: ['clyde', 'email-management', 'manychat'],
  },
  operator: {
    // Autonomous workflows; competitive edge via depth + production scale
    strategy: ['clyde', 'reporting', 'ad-creator'],
    data: ['reporting', 'seo-geo', 'research'],
    tools: ['ad-creator', 'reel-builder', 'voice-agent'],
    team: ['clyde', 'lead-qualifier', 'manychat'],
  },
}

export function getRecommendedSkills(
  persona: AssessmentPersona,
  lowestCategory: AssessmentCategory,
): SkillData[] {
  const slugs = ROUTING_MATRIX[persona][lowestCategory]
  return slugs
    .map((slug) => getSkillBySlug(slug))
    .filter((skill): skill is SkillData => skill !== undefined)
}
