/**
 * Cal.com configuration -- shared between every inline embed (CalInlineEmbed)
 * and the link-only CTAs (contact success state).
 *
 * `calLink` is the Cal.com shorthand "username/event-slug". It comes from
 * NEXT_PUBLIC_CAL_LINK with a fallback to the strategy-call event. No API key
 * or OAuth is required for the embed -- the booking link is public by design.
 *
 * Self-hosting: set NEXT_PUBLIC_CAL_ORIGIN (e.g. https://cal.future-marketing.ai)
 * to point the embed at your own Cal.com instance. Defaults to Cal.com cloud.
 */

const DEFAULT_CAL_LINK = 'daley-van-diest-jszpnt/strategy-call'

export const calConfig = {
  /** Cal.com shorthand link: "username/event-slug". */
  calLink: process.env.NEXT_PUBLIC_CAL_LINK || DEFAULT_CAL_LINK,

  /** Embed namespace -- scopes the Cal API when multiple embeds mount. */
  namespace: 'strategy-call',

  /** Brand accent (teal) injected as the `cal-brand` CSS var on the embed. */
  brandColor: '#00d4aa',

  /**
   * Optional custom origin for self-hosted Cal.com. Undefined => Cal.com cloud
   * (app.cal.com). When set, the embed and hosted links resolve against it.
   */
  origin: process.env.NEXT_PUBLIC_CAL_ORIGIN || undefined,

  /** Default UTM parameters for tracking. */
  utm: {
    utmSource: 'website',
    utmMedium: 'booking-modal',
    utmCampaign: 'strategy-call',
  },
} as const

/**
 * Full hosted Cal.com URL for plain anchor links and embed fallbacks.
 * Encodes name + email as query params so the booking form pre-populates.
 */
export function calHostedUrl(prefill?: { name?: string; email?: string }): string {
  const base = `${calConfig.origin ?? 'https://cal.com'}/${calConfig.calLink}`
  const params = new URLSearchParams()
  if (prefill?.name) params.set('name', prefill.name)
  if (prefill?.email) params.set('email', prefill.email)
  const query = params.toString()
  return query ? `${base}?${query}` : base
}
