export interface OgImageProps {
  title: string
  description: string
  label?: string
}

/*
 * Dynamic OG template — per-locale styled text card.
 * The Synapse mark lives in the static public/og-image.png (generated via
 * scripts/generate-brand-assets.mjs) which metadata.ts uses as DEFAULT_OG_IMAGE.
 * Inline SVG in Satori (next/og) is too brittle for line+circle primitives —
 * "failed to pipe response" on non-trivial SVG children. We keep this route
 * text-only and let the static asset carry brand identity.
 */
export function OgImageTemplate({
  title,
  description,
  label = 'Future Marketing AI',
}: OgImageProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: '#0a0d14',
        padding: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          color: '#00d4aa',
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 24,
          letterSpacing: 2,
          textTransform: 'uppercase' as const,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          color: '#FFFFFF',
          fontSize: 60,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          color: '#8890A4',
          fontSize: 26,
          lineHeight: 1.4,
          maxWidth: 800,
        }}
      >
        {description}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid #1a2040',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#00d4aa',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          future-marketing.ai
        </div>
      </div>
    </div>
  )
}
