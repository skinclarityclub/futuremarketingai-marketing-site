/**
 * Archetype × lowest-scoring category → 3 recommended Clyde-skills.
 *
 * The lowest category is the biggest readiness gap. Recommendations are the
 * three skills that — given the bureau's archetype and current gap — deliver
 * the highest leverage. Different archetypes with the same gap get different
 * recommendations: a data-led bureau weak on tools needs production capacity
 * (ad-manager, social-media), while a tooling-led bureau weak on tools is an
 * edge-case fallback (central orchestration focus).
 *
 * 20 cells = 5 archetypes × 4 categories. Order within each cell is the
 * order shown in the result email (most-impact-first).
 *
 * @deprecated getRecommendedSkills(persona, lowestCategory) is kept for
 * backwards-compat with Wave-2 callers. Migrate to getRecommendedSkillsByArchetype.
 */

import { getSkillBySlug, type SkillData } from '@/lib/skills-data'
import type {
  Archetype,
  AssessmentCategory,
  AssessmentPersona,
} from './types'

type SkillSlug =
  | 'social-media'
  | 'blog-factory'
  | 'ad-manager'
  | 'reel-builder'
  | 'voice-agent'
  | 'lead-qualifier'
  | 'email-management'
  | 'reporting'
  | 'seo-geo'
  | 'strategy'
  | 'clyde'

type ArchetypeRoutingMatrix = Record<
  Archetype,
  Record<AssessmentCategory, readonly [SkillSlug, SkillSlug, SkillSlug]>
>

const ARCHETYPE_ROUTING_MATRIX: ArchetypeRoutingMatrix = {
  'strategy-led': {
    // Strong vision; needs to execute and measure that vision
    strategy: ['clyde', 'strategy', 'reporting'],
    data: ['reporting', 'strategy', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'email-management', 'lead-qualifier'],
  },
  'data-led': {
    // Rich insights; needs to translate data into action and production
    strategy: ['clyde', 'strategy', 'reporting'],
    data: ['strategy', 'reporting', 'seo-geo'],
    tools: ['ad-manager', 'social-media', 'blog-factory'],
    team: ['reporting', 'clyde', 'email-management'],
  },
  'tooling-led': {
    // High automation; needs strategic direction and team adoption
    strategy: ['clyde', 'strategy', 'reporting'],
    data: ['reporting', 'strategy', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['email-management', 'lead-qualifier', 'clyde'],
  },
  'team-led': {
    // Strong talent; needs tools and data to scale that craft
    strategy: ['clyde', 'strategy', 'reporting'],
    data: ['reporting', 'strategy', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'lead-qualifier', 'email-management'],
  },
  'balanced': {
    // No dominant axis; formalise operations across the board
    strategy: ['clyde', 'strategy', 'reporting'],
    data: ['reporting', 'strategy', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'email-management', 'lead-qualifier'],
  },
}

export function getRecommendedSkillsByArchetype(
  archetype: Archetype,
  lowestCategory: AssessmentCategory,
): SkillData[] {
  const slugs = ARCHETYPE_ROUTING_MATRIX[archetype][lowestCategory]
  return slugs
    .map((slug) => getSkillBySlug(slug))
    .filter((skill): skill is SkillData => skill !== undefined)
}

/**
 * @deprecated Use getRecommendedSkillsByArchetype instead.
 * Maps legacy persona to balanced archetype as conservative fallback.
 */
export function getRecommendedSkills(
  persona: AssessmentPersona,
  lowestCategory: AssessmentCategory,
): SkillData[] {
  // Old persona keys map to 'balanced' archetype (stage-only, no dominant axis known).
  // Callers should migrate to getRecommendedSkillsByArchetype with the full archetype.
  return getRecommendedSkillsByArchetype('balanced', lowestCategory)
}
