import { z } from 'zod'

/**
 * Attribution carried from a DM link (future-marketing.ai/apply?fmc=..&utm_..=..)
 * to the inbox, so a request lands on the DM keyword that produced it.
 *
 * Pure module (zod only) so the check script can import it without Next aliases.
 * `fmc` has the format of the command center's CODE_RE: 7 alphanumerics.
 * An invalid value is dropped silently (`.catch(undefined)`), never refused: the
 * application is the work, the attribution is secondary, and a retry could not
 * succeed while the bad value stays in the URL. The inbox webhook in the app
 * validates `fmc` strictly again.
 *
 * ponytail: the code only survives when the CTA links to /apply itself (the wizard
 * reads its own URL); a code kept in sessionStorage is the upgrade if a homepage
 * CTA is wanted.
 */
export const attributionShape = {
  fmc: z.string().regex(/^[0-9A-Za-z]{7}$/).optional().catch(undefined),
  utm_source: z.string().max(200).optional().catch(undefined),
  utm_medium: z.string().max(200).optional().catch(undefined),
  utm_campaign: z.string().max(200).optional().catch(undefined),
  utm_content: z.string().max(200).optional().catch(undefined),
}

export interface AttributionFields {
  fmc?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
}

export interface LeadAttribution {
  fmc?: string
  utm?: { source?: string; medium?: string; campaign?: string; content?: string }
}

export function readAttribution(f: AttributionFields): LeadAttribution {
  const utm: NonNullable<LeadAttribution['utm']> = {}
  if (f.utm_source) utm.source = f.utm_source
  if (f.utm_medium) utm.medium = f.utm_medium
  if (f.utm_campaign) utm.campaign = f.utm_campaign
  if (f.utm_content) utm.content = f.utm_content
  return {
    ...(f.fmc ? { fmc: f.fmc } : {}),
    ...(Object.keys(utm).length > 0 ? { utm } : {}),
  }
}
