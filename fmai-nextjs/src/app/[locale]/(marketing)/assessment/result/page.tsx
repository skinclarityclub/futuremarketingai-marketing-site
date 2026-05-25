import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import {
  pickArchetype,
  pickStage,
  ARCHETYPE_GRADIENT,
  LEGACY_PERSONA_FALLBACK,
} from '@/lib/assessment/persona-presentation'
import {
  SharedResultReveal,
  type SharedResultScore,
} from '@/components/assessment/SharedResultReveal'

/**
 * Public, shareable result page for the AI Readiness Scan.
 *
 * Params (short to keep shared URLs compact):
 *   a   = archetype code: sl | dl | wl | pl | ba
 *   st  = stage code: em | sc | le
 *   t   = total (0..100)
 *   s   = strategy (0..100)
 *   d   = data (0..100)
 *   tl  = tools (0..100)
 *   tm  = team (0..100)
 *
 * Legacy backwards-compat: if only `p` (e|b|o) is present, maps to balanced
 * archetype + matching stage so old shared links still render.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const CATEGORY_KEYS = ['s', 'd', 'tl', 'tm'] as const
type CategoryKey = (typeof CATEGORY_KEYS)[number]

const CATEGORY_I18N: Record<CategoryKey, string> = {
  s: 'strategy',
  d: 'data',
  tl: 'tools',
  tm: 'team',
}

function clampScore(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw
  const n = Number.parseInt(v ?? '', 10)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function str(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw
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
  const tResult = await getTranslations({ locale, namespace: 'assessment.result' })

  // Resolve archetype + stage (legacy p= shim)
  const legacyP = str(sp.p)
  const legacyFallback = legacyP ? LEGACY_PERSONA_FALLBACK[legacyP] : undefined
  const archetype = legacyFallback ? legacyFallback.archetype : pickArchetype(str(sp.a))
  const stage = legacyFallback ? legacyFallback.stage : pickStage(str(sp.st))

  const archetypeName = tResult(`archetypes.${archetype}.name`)
  const stageName = tResult(`stages.${stage}.label`)
  const total = clampScore(sp.t)

  const og = new URLSearchParams()
  og.set('a', archetype)
  og.set('st', stage)
  og.set('t', String(total))
  og.set('s', String(clampScore(sp.s)))
  og.set('d', String(clampScore(sp.d)))
  og.set('tl', String(clampScore(sp.tl)))
  og.set('tm', String(clampScore(sp.tm)))

  const title = t('metaTitle', { persona: `${archetypeName} (${stageName})`, total })
  const description = t('metaDescription', { persona: archetypeName, total })
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

  // Resolve archetype + stage (legacy p= shim)
  const legacyP = str(sp.p)
  const legacyFallback = legacyP ? LEGACY_PERSONA_FALLBACK[legacyP] : undefined
  const archetype = legacyFallback ? legacyFallback.archetype : pickArchetype(str(sp.a))
  const stage = legacyFallback ? legacyFallback.stage : pickStage(str(sp.st))

  const total = clampScore(sp.t)
  const scoresMap: Record<CategoryKey, number> = {
    s: clampScore(sp.s),
    d: clampScore(sp.d),
    tl: clampScore(sp.tl),
    tm: clampScore(sp.tm),
  }
  const lowest = CATEGORY_KEYS.reduce((acc, k) => (scoresMap[k] < scoresMap[acc] ? k : acc))

  const t = await getTranslations({ locale, namespace: 'assessment.resultShared' })
  const tResult = await getTranslations({ locale, namespace: 'assessment.result' })
  const tCats = await getTranslations({ locale, namespace: 'assessment.categories' })

  const scores: readonly SharedResultScore[] = CATEGORY_KEYS.map((k) => ({
    key: k,
    label: tCats(CATEGORY_I18N[k]),
    score: scoresMap[k],
    isLowest: k === lowest,
  }))

  return (
    <PageShell>
      <SharedResultReveal
        eyebrow={t('eyebrow')}
        preTitle={tResult('preTitle')}
        archetypeName={tResult(`archetypes.${archetype}.name`)}
        archetypeGradient={ARCHETYPE_GRADIENT[archetype]}
        stagePrefix={tResult('stagePrefix')}
        stageLabel={tResult(`stages.${stage}.label`)}
        total={total}
        scoresHeading={t('scoresHeading')}
        focusLabel={t('focusLabel')}
        scores={scores}
        ctaHeadline={t('ctaHeadline')}
        ctaButton={t('ctaButton')}
        ctaHint={t('ctaHint')}
      />
    </PageShell>
  )
}
