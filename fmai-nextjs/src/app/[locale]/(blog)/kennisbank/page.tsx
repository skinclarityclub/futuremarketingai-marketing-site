import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { getAllPosts, BLOG_CATEGORIES } from '@/lib/blog'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { LeadMagnetCTA } from '@/components/conversion/LeadMagnetCTA'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { DefinedTermSetJsonLd } from '@/components/seo/DefinedTermSetJsonLd'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PageShell } from '@/components/layout/PageShell'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
import { Glossary } from '@/components/resources/Glossary'
import { GLOSSARY_TERMS } from '@/lib/glossary'

/**
 * /kennisbank — the knowledge base.
 *
 * The card-grid index of every cornerstone (filterable by category, each card
 * carries its branded hero thumbnail) is the landing. The GEO/AI-marketing
 * glossary (DefinedTermSet JSON-LD) is preserved below the grid for entity
 * citation value. NL hero copy comes from the `resources` namespace.
 */

export const revalidate = 3600

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

interface KennisbankPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function KennisbankPage({ params, searchParams }: KennisbankPageProps) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'resources' })
  const bt = await getTranslations({ locale, namespace: 'blog' })
  const gt = await getTranslations({ locale, namespace: 'glossary' })

  const allPosts = getAllPosts(locale)
  const activeCategory = category ?? null
  const filteredPosts = activeCategory
    ? allPosts.filter((post) => post.category === activeCategory)
    : allPosts

  // Only show filter chips for categories that actually have posts in this locale
  // (hides empty legacy buckets like chatbots/voice-agents).
  const usedCategories = BLOG_CATEGORIES.filter((c) =>
    allPosts.some((post) => post.category === c.id)
  )

  const glossaryTerms = GLOSSARY_TERMS.map((term) => ({
    id: term.id,
    name: gt(`${term.id}.name`),
    definition: gt(`${term.id}.definition`),
  }))

  return (
    <PageShell>
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

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <header className="mb-10 max-w-3xl space-y-3">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
            {t('hero.heading')}
          </h1>
          <p className="text-lg leading-relaxed text-text-secondary">{t('hero.intro')}</p>
        </header>

        <CategoryFilter
          categories={usedCategories}
          activeCategory={activeCategory}
          locale={locale}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {filteredPosts.length > 0 ? (
              <RevealContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredPosts.map((post) => (
                  <RevealItem key={post.slug}>
                    <BlogPostCard post={post} locale={locale} />
                  </RevealItem>
                ))}
              </RevealContainer>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-text-muted">
                  {activeCategory ? bt('noPostsInCategory') : bt('noPosts')}
                </p>
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <LeadMagnetCTA source="blog" variant="sidebar" />
          </aside>
        </div>

        {/* Glossary — preserved for GEO / DefinedTerm citation value. */}
        <section
          aria-labelledby="glossary-heading"
          className="mt-20 border-t border-border-primary pt-16"
        >
          <Glossary
            terms={glossaryTerms}
            heading={t('glossaryHeading')}
            intro={t('glossaryIntro')}
          />
        </section>
      </div>
    </PageShell>
  )
}
