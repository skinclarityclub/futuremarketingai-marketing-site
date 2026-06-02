import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { DefinedTermSetJsonLd } from '@/components/seo/DefinedTermSetJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { PillarHubCard } from '@/components/resources/PillarHubCard'
import { Glossary } from '@/components/resources/Glossary'
import { GLOSSARY_TERMS } from '@/lib/glossary'
import { getPillarPosts, getClusterPosts } from '@/lib/blog'

/**
 * /kennisbank — the knowledge-base hub (KB-04).
 *
 * Exposes the program's content structure: three strategic pillar buckets
 * (each bundling its pillar + cluster pages) and the GEO/AI-marketing glossary.
 * Follows the proven memory/page.tsx pattern. Pillar buckets render even when
 * zero pillar posts exist yet (graceful degradation — research Pitfall 2), so
 * the structure is visible before cornerstone content lands in Phase 3.
 */

/** The strategic pillar buckets, by BLOG_CATEGORIES id. Order is intentional. */
const PILLAR_BUCKETS = ['geo', 'ai-marketing-automation', 'agency-ops', 'product-clyde'] as const

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'resources', path: '/kennisbank' })
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'resources' })
  const gt = await getTranslations({ locale, namespace: 'glossary' })

  // Real content: pillars (cornerstone pages) for this locale.
  const pillarPosts = getPillarPosts(locale)

  // Build each bucket: pillars in this category + every cluster supporting them.
  const buckets = PILLAR_BUCKETS.map((bucketId) => {
    const bucketPillars = pillarPosts.filter((p) => p.category === bucketId)
    const clusterPosts = bucketPillars.flatMap((pillar) =>
      getClusterPosts(pillar.slug, locale)
    )

    return {
      id: bucketId,
      title: t(`pillars.${bucketId}.title`),
      description: t(`pillars.${bucketId}.description`),
      pillarPosts: bucketPillars.map((p) => ({ slug: p.slug, title: p.title })),
      clusterPosts: clusterPosts.map((p) => ({ slug: p.slug, title: p.title })),
    }
  })

  // Glossary copy resolved from the glossary namespace; structure from GLOSSARY_TERMS.
  const glossaryTerms = GLOSSARY_TERMS.map((term) => ({
    id: term.id,
    name: gt(`${term.id}.name`),
    definition: gt(`${term.id}.definition`),
  }))

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/kennisbank"
        locale={locale}
      />
      <DefinedTermSetJsonLd locale={locale} terms={glossaryTerms} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.heading'), path: '/kennisbank' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/kennisbank" locale={locale} />

      {/* Hero */}
      <section
        aria-labelledby="resources-hero"
        className="relative px-6 lg:px-12 pt-24 lg:pt-[140px] pb-12"
      >
        <div className="max-w-5xl mx-auto text-center">
          <EyebrowLabel className="mb-6 inline-block">{t('hero.eyebrow')}</EyebrowLabel>
          <h1
            id="resources-hero"
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-text-primary"
          >
            {t('hero.heading')}
          </h1>
          <p className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('hero.intro')}
          </p>
        </div>
      </section>

      {/* Pillar buckets */}
      <section aria-labelledby="resources-pillars" className="py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 id="resources-pillars" className="sr-only">
            {t('hero.heading')}
          </h2>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buckets.map((bucket) => (
                <PillarHubCard
                  key={bucket.id}
                  title={bucket.title}
                  description={bucket.description}
                  pillarPosts={bucket.pillarPosts}
                  clusterPosts={bucket.clusterPosts}
                  locale={locale}
                  emptyLabel={t('emptyCluster')}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Glossary */}
      <section aria-labelledby="glossary-heading" className="py-16 px-6 lg:px-12 bg-bg-surface/30">
        <Glossary
          terms={glossaryTerms}
          heading={t('glossaryHeading')}
          intro={t('glossaryIntro')}
        />
      </section>
    </PageShell>
  )
}
