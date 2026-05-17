import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

/**
 * Public, shareable result page for the AI Readiness Scan.
 *
 * Driven entirely by URL query params so it works without a database row —
 * the user who took the scan shares a link to /[locale]/assessment/result
 * with their result baked in. The dynamic OG image at /api/og/assessment-result
 * receives the same params and renders the social-share card.
 *
 * Params (all short to keep shared URLs compact):
 *   p   = 'e' | 'b' | 'o'  (explorer/builder/operator)
 *   t   = total (0..100)
 *   s   = strategy   (0..100)
 *   d   = data       (0..100)
 *   tl  = tools      (0..100)
 *   tm  = team       (0..100)
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const PERSONA_KEYS: Record<'e' | 'b' | 'o', 'explorer' | 'builder' | 'operator'> = {
  e: 'explorer',
  b: 'builder',
  o: 'operator',
}

const PERSONA_GRADIENTS: Record<'e' | 'b' | 'o', string> = {
  e: 'linear-gradient(135deg, #60a5fa 0%, #00d4aa 100%)',
  b: 'linear-gradient(135deg, #00d4aa 0%, #f5a623 100%)',
  o: 'linear-gradient(135deg, #f5a623 0%, #ef4444 100%)',
}

const CATEGORY_KEYS = ['s', 'd', 'tl', 'tm'] as const
type CategoryKey = (typeof CATEGORY_KEYS)[number]

const CATEGORY_I18N: Record<CategoryKey, string> = {
  s: 'strategy',
  d: 'data',
  tl: 'tools',
  tm: 'team',
}

function pickPersona(raw: string | string[] | undefined): 'e' | 'b' | 'o' {
  const v = Array.isArray(raw) ? raw[0] : raw
  if (v === 'e' || v === 'b' || v === 'o') return v
  return 'b'
}

function clampScore(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw
  const n = Number.parseInt(v ?? '', 10)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function buildOgUrl(params: URLSearchParams): string {
  return `${SITE_URL}/api/og/assessment-result?${params.toString()}`
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: SearchParams
}): Promise<Metadata> {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'assessment.resultShared' })
  const tPersona = await getTranslations({ locale, namespace: 'assessment.result' })

  const persona = pickPersona(sp.p)
  const personaName = tPersona(`${PERSONA_KEYS[persona]}.name`)
  const total = clampScore(sp.t)

  const og = new URLSearchParams()
  og.set('p', persona)
  og.set('t', String(total))
  og.set('s', String(clampScore(sp.s)))
  og.set('d', String(clampScore(sp.d)))
  og.set('tl', String(clampScore(sp.tl)))
  og.set('tm', String(clampScore(sp.tm)))

  const title = t('metaTitle', { persona: personaName, total })
  const description = t('metaDescription', { persona: personaName, total })
  const url = `${SITE_URL}/${locale}/assessment/result?${og.toString()}`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: buildOgUrl(og), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildOgUrl(og)],
    },
  }
}

export default async function AssessmentResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: SearchParams
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams

  const persona = pickPersona(sp.p)
  const total = clampScore(sp.t)
  const scores: Record<CategoryKey, number> = {
    s: clampScore(sp.s),
    d: clampScore(sp.d),
    tl: clampScore(sp.tl),
    tm: clampScore(sp.tm),
  }
  const lowest = CATEGORY_KEYS.reduce((acc, k) => (scores[k] < scores[acc] ? k : acc))

  const t = await getTranslations({ locale, namespace: 'assessment.resultShared' })
  const tPersona = await getTranslations({ locale, namespace: 'assessment.result' })
  const tCats = await getTranslations({ locale, namespace: 'assessment.categories' })

  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-system">
            {t('eyebrow')}
          </p>
          <p className="mb-2 text-lg text-text-secondary">{tPersona('preTitle')}</p>
          <h1 className="mb-6 font-display text-6xl font-black leading-none tracking-tight sm:text-7xl">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: PERSONA_GRADIENTS[persona] }}
            >
              {tPersona(`${PERSONA_KEYS[persona]}.name`)}
            </span>
          </h1>
          <p className="mb-10 font-mono text-2xl text-text-primary">
            {total}
            <span className="text-text-secondary">/100</span>
          </p>
        </div>

        <section
          className="mb-10 rounded-2xl border border-border-primary bg-white/[0.02] p-6 md:p-8"
          aria-labelledby="shared-scores"
        >
          <h2 id="shared-scores" className="mb-5 text-base font-semibold text-text-primary">
            {t('scoresHeading')}
          </h2>
          <div className="space-y-3.5">
            {CATEGORY_KEYS.map((k) => {
              const score = scores[k]
              const isLowest = k === lowest
              return (
                <div key={k}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className={isLowest ? 'text-accent-human' : 'text-text-primary'}>
                      {tCats(CATEGORY_I18N[k])}
                      {isLowest && (
                        <span className="ml-2 inline-flex items-center rounded-full border border-accent-human/30 bg-accent-human/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-human">
                          {t('focusLabel')}
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        isLowest ? 'text-accent-human' : 'text-text-secondary'
                      }`}
                    >
                      {score}/100
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className={`h-full rounded-full ${
                        isLowest ? 'bg-accent-human' : 'bg-accent-system'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.02] to-accent-system/[0.04] p-6 text-center md:p-8">
          <p className="mb-5 text-base text-text-primary md:text-lg">{t('ctaHeadline')}</p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-6 py-3 text-sm font-semibold text-bg-deep transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            {t('ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-text-muted">{t('ctaHint')}</p>
        </div>
      </main>
    </PageShell>
  )
}
