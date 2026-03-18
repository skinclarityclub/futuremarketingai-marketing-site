/**
 * Calendly configuration -- shared between CalendlyModal and useCalendlyBooking.
 *
 * The actual booking URL comes from NEXT_PUBLIC_CALENDLY_URL env var
 * with a fallback to the default strategy call page.
 */

export const calendlyConfig = {
  url:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    'https://calendly.com/futureai/strategy-call?background_color=111520&text_color=e8ecf4&primary_color=00D4FF',

  /** Default UTM parameters for tracking */
  utm: {
    utmSource: 'website',
    utmMedium: 'chatbot',
    utmCampaign: 'demo-playground',
  },
} as const
