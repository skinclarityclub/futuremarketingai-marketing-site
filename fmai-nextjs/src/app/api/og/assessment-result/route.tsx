import { ImageResponse } from 'next/og'
import { OG_THEME } from '@/lib/og-theme'

export const runtime = 'edge'

/**
 * GET /api/og/assessment-result
 *
 * Dynamic OG image for shared AI Readiness Scan results, baked at the time
 * the recipient unrolls the link (LinkedIn fetches once and caches). The
 * page at /[locale]/assessment/result reads the same query params and
 * references this image in its metadata.
 *
 * Query params (all integers 0..100 except p):
 *   p   = 'e' | 'b' | 'o'  — persona (explorer/builder/operator)
 *   t   = total (0..100)
 *   s   = strategy score
 *   d   = data score
 *   tl  = tools score
 *   tm  = team score
 *
 * The category with the lowest score is highlighted in accent-human (amber)
 * to mirror the inline result reveal. Missing or out-of-range params fall
 * back to zero so we always render a valid card rather than 500.
 */

const PERSONA_NAMES: Record<'e' | 'b' | 'o', string> = {
  e: 'Explorer',
  b: 'Builder',
  o: 'Operator',
}

const PERSONA_GRADIENTS: Record<'e' | 'b' | 'o', string> = {
  e: 'linear-gradient(135deg, #60a5fa 0%, #00d4aa 100%)',
  b: 'linear-gradient(135deg, #00d4aa 0%, #f5a623 100%)',
  o: 'linear-gradient(135deg, #f5a623 0%, #ef4444 100%)',
}

const CATEGORY_LABELS = [
  { key: 's', label: 'Strategy' },
  { key: 'd', label: 'Data' },
  { key: 'tl', label: 'Tools' },
  { key: 'tm', label: 'Team' },
] as const

function clampScore(raw: string | null): number {
  const n = Number.parseInt(raw ?? '', 10)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function pickPersona(raw: string | null): 'e' | 'b' | 'o' {
  if (raw === 'e' || raw === 'b' || raw === 'o') return raw
  return 'b'
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const persona = pickPersona(searchParams.get('p'))
  const total = clampScore(searchParams.get('t'))
  const scores: Record<'s' | 'd' | 'tl' | 'tm', number> = {
    s: clampScore(searchParams.get('s')),
    d: clampScore(searchParams.get('d')),
    tl: clampScore(searchParams.get('tl')),
    tm: clampScore(searchParams.get('tm')),
  }

  const lowestKey = (Object.keys(scores) as Array<'s' | 'd' | 'tl' | 'tm'>).reduce((acc, k) =>
    scores[k] < scores[acc] ? k : acc,
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: OG_THEME.bgDeep,
          color: OG_THEME.textPrimary,
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: OG_THEME.textSecondary,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: OG_THEME.accentSystem, fontWeight: 600 }}>
            AI Readiness Scan
          </span>
          <span>future-marketing.ai</span>
        </div>

        {/* Persona + total */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 132,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              backgroundImage: PERSONA_GRADIENTS[persona],
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {PERSONA_NAMES[persona]}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 56,
              fontWeight: 700,
              color: OG_THEME.textPrimary,
              marginTop: 12,
              fontFamily: 'monospace',
            }}
          >
            {total}
            <span style={{ color: OG_THEME.textSecondary, fontWeight: 500 }}>/100</span>
          </div>
        </div>

        {/* Score bars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            marginTop: 40,
            width: '100%',
          }}
        >
          {CATEGORY_LABELS.map(({ key, label }) => {
            const score = scores[key]
            const isLowest = key === lowestKey
            const barColor = isLowest ? OG_THEME.accentHuman : OG_THEME.accentSystem
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 22,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ color: isLowest ? OG_THEME.accentHuman : OG_THEME.textPrimary }}>
                    {label}
                    {isLowest && (
                      <span
                        style={{
                          marginLeft: 12,
                          fontSize: 16,
                          color: OG_THEME.accentHuman,
                          textTransform: 'uppercase',
                          letterSpacing: 1.5,
                        }}
                      >
                        Focus
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      color: isLowest ? OG_THEME.accentHuman : OG_THEME.textSecondary,
                      fontFamily: 'monospace',
                    }}
                  >
                    {score}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: 8,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${score}%`,
                      height: '100%',
                      background: barColor,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            fontSize: 22,
            color: OG_THEME.textSecondary,
          }}
        >
          Doe de gratis 5-min scan op future-marketing.ai/assessment
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'cache-control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
