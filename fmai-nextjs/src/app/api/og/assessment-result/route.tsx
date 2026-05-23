import { ImageResponse } from 'next/og'
import { OG_THEME } from '@/lib/og-theme'
import { pickArchetype, pickStage, ARCHETYPE_GRADIENT } from '@/lib/assessment/persona-presentation'

export const runtime = 'edge'

/**
 * GET /api/og/assessment-result
 *
 * Dynamic OG image for shared AI Readiness Scan results. The page at
 * /[locale]/assessment/result reads the same query params and references
 * this image in its metadata.
 *
 * Query params:
 *   a   = archetype code: sl | dl | wl | pl | ba  (default: ba)
 *   st  = stage code: em | sc | le                (default: em)
 *   t   = total (0..100)
 *   s, d, tl, tm = category scores (0..100)
 *
 * Legacy: p = e|b|o still accepted via LEGACY_PERSONA_FALLBACK.
 *
 * Missing or out-of-range params fall back gracefully so we always render
 * a valid card rather than 500.
 */

const ARCHETYPE_NAMES_OG: Record<string, string> = {
  'strategy-led': 'Strategy Agency',
  'data-led': 'Data Agency',
  'tooling-led': 'Workflow Agency',
  'team-led': 'People Agency',
  balanced: 'Generalist Agency',
}

const STAGE_NAMES_OG: Record<string, string> = {
  emerging: 'Emerging',
  scaling: 'Scaling',
  leading: 'Leading',
}

const CATEGORY_LABELS = [
  { key: 's', label: 'Strategy' },
  { key: 'd', label: 'Data' },
  { key: 'tl', label: 'Tools' },
  { key: 'tm', label: 'Team' },
] as const

const LEGACY_MAP: Record<string, { a: string; st: string }> = {
  e: { a: 'ba', st: 'em' },
  b: { a: 'ba', st: 'sc' },
  o: { a: 'ba', st: 'le' },
}

function clampScore(raw: string | null): number {
  const n = Number.parseInt(raw ?? '', 10)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)

  // Resolve archetype + stage with legacy p= shim
  const legacyP = searchParams.get('p')
  const legacy = legacyP ? LEGACY_MAP[legacyP] : undefined
  const archetypeCode = legacy ? legacy.a : (searchParams.get('a') ?? 'ba')
  const stageCode = legacy ? legacy.st : (searchParams.get('st') ?? 'em')

  const archetype = pickArchetype(archetypeCode)
  const stage = pickStage(stageCode)

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

  const archetypeName = ARCHETYPE_NAMES_OG[archetype] ?? 'Generalist Agency'
  const stageName = STAGE_NAMES_OG[stage] ?? 'Emerging'
  const gradient = ARCHETYPE_GRADIENT[archetype]

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

        {/* Archetype name + stage */}
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
              fontSize: 100,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              backgroundImage: gradient,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {archetypeName}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 48,
                fontWeight: 700,
                color: OG_THEME.textPrimary,
                fontFamily: 'monospace',
              }}
            >
              {total}
              <span style={{ color: OG_THEME.textSecondary, fontWeight: 500 }}>/100</span>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '6px 18px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 999,
                fontSize: 22,
                color: OG_THEME.textSecondary,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {stageName}
            </div>
          </div>
        </div>

        {/* Score bars */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginTop: 36,
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
                    fontSize: 20,
                    marginBottom: 5,
                  }}
                >
                  <span style={{ color: isLowest ? OG_THEME.accentHuman : OG_THEME.textPrimary }}>
                    {label}
                    {isLowest && (
                      <span
                        style={{
                          marginLeft: 12,
                          fontSize: 15,
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
                    height: 7,
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
            fontSize: 20,
            color: OG_THEME.textSecondary,
          }}
        >
          Take the free 5-min scan at future-marketing.ai/assessment
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
