/**
 * Presentation layer for archetype + stage display.
 * Gradients, short URL codes, and display helpers for UI and OG image.
 */

import type { Archetype, Stage } from './types'

export const ARCHETYPE_GRADIENT: Record<Archetype, string> = {
  'strategy-led': 'linear-gradient(135deg, #60a5fa 0%, #00d4aa 100%)',
  'data-led': 'linear-gradient(135deg, #00d4aa 0%, #22c55e 100%)',
  'tooling-led': 'linear-gradient(135deg, #f5a623 0%, #ef4444 100%)',
  'team-led': 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
  balanced: 'linear-gradient(135deg, #f5a623 0%, #00d4aa 100%)',
}

// Short codes used in shareable URLs: ?a=sl&st=em
export const ARCHETYPE_CODE: Record<Archetype, string> = {
  'strategy-led': 'sl',
  'data-led': 'dl',
  'tooling-led': 'wl',
  'team-led': 'pl',
  balanced: 'ba',
}

export const CODE_TO_ARCHETYPE: Record<string, Archetype> = {
  sl: 'strategy-led',
  dl: 'data-led',
  wl: 'tooling-led',
  pl: 'team-led',
  ba: 'balanced',
}

export const STAGE_CODE: Record<Stage, string> = {
  emerging: 'em',
  scaling: 'sc',
  leading: 'le',
}

export const CODE_TO_STAGE: Record<string, Stage> = {
  em: 'emerging',
  sc: 'scaling',
  le: 'leading',
}

// Legacy persona short code → best-fit archetype + stage for backwards-compat URLs
export const LEGACY_PERSONA_FALLBACK: Record<string, { archetype: Archetype; stage: Stage }> = {
  e: { archetype: 'balanced', stage: 'emerging' },
  b: { archetype: 'balanced', stage: 'scaling' },
  o: { archetype: 'balanced', stage: 'leading' },
}

export function pickArchetype(raw: string | undefined): Archetype {
  if (!raw) return 'balanced'
  return CODE_TO_ARCHETYPE[raw] ?? 'balanced'
}

export function pickStage(raw: string | undefined): Stage {
  if (!raw) return 'emerging'
  return CODE_TO_STAGE[raw] ?? 'emerging'
}
