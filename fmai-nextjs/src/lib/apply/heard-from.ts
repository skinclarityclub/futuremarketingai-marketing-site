import { z } from 'zod'

/**
 * "Hoe ken je ons?" on /apply: the self-reported source, kept apart from the measured UTM.
 *
 * Pure module (zod only) so the check script can import it without Next aliases.
 * The server is lenient, the UI is strict: a tab opened before the deploy (or the
 * legacy shape) must never lose its lead, so a missing or invalid value resolves
 * to `not_asked` instead of a 4xx. The wizard only lets a visitor submit with a choice.
 * No free text anywhere: "other" is a plain choice. `not_asked` is server-only and
 * never offered in the UI.
 */
export const HEARD_FROM = [
  'linkedin',
  'google',
  'ai_assistant',
  'instagram',
  'podcast_event',
  'referral',
  'partner',
  'other',
  'unknown',
] as const

export type HeardFrom = (typeof HEARD_FROM)[number]

export const heardFromShape = {
  heardFrom: z.enum(HEARD_FROM).optional().catch(undefined),
}

export function resolveHeardFrom(v: HeardFrom | undefined): HeardFrom | 'not_asked' {
  return v ?? 'not_asked'
}
