/**
 * Archetype × lowest-scoring category → 3 recommended Clyde-skills.
 *
 * The lowest category is the biggest readiness gap. Recommendations are the
 * three skills that — given the bureau's archetype and current gap — deliver
 * the highest leverage. Different archetypes with the same gap get different
 * recommendations: a data-led bureau weak on tools needs production capacity
 * (ad-creator, social-media), while a tooling-led bureau weak on tools is an
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

type ArchetypeRoutingMatrix = Record<
  Archetype,
  Record<AssessmentCategory, readonly [SkillSlug, SkillSlug, SkillSlug]>
>

const ARCHETYPE_ROUTING_MATRIX: ArchetypeRoutingMatrix = {
  'strategy-led': {
    // Strong vision; needs to execute and measure that vision
    strategy: ['clyde', 'research', 'reporting'],
    data: ['reporting', 'research', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'email-management', 'manychat'],
  },
  'data-led': {
    // Rich insights; needs to translate data into action and production
    strategy: ['clyde', 'research', 'reporting'],
    data: ['research', 'reporting', 'seo-geo'],
    tools: ['ad-creator', 'social-media', 'blog-factory'],
    team: ['reporting', 'clyde', 'email-management'],
  },
  'tooling-led': {
    // High automation; needs strategic direction and team adoption
    strategy: ['clyde', 'research', 'reporting'],
    data: ['reporting', 'research', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['email-management', 'manychat', 'clyde'],
  },
  'team-led': {
    // Strong talent; needs tools and data to scale that craft
    strategy: ['clyde', 'research', 'reporting'],
    data: ['reporting', 'research', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'lead-qualifier', 'email-management'],
  },
  'balanced': {
    // No dominant axis; formalise operations across the board
    strategy: ['clyde', 'research', 'reporting'],
    data: ['reporting', 'research', 'seo-geo'],
    tools: ['clyde', 'social-media', 'blog-factory'],
    team: ['clyde', 'email-management', 'manychat'],
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
