import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'
import { getAllPosts, BLOG_CATEGORIES } from '@/lib/blog'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'

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

  const title = 'Blog | Future Marketing AI'
  const description =
    'Insights on AI marketing automation, chatbots, voice agents, and growth strategies for B2B companies.'
  const url = `${SITE_URL}/${locale}/blog`

  const alternates: Record<string, string> = {}
  for (const loc of routing.locales) {
    alternates[loc] = `${SITE_URL}/${loc}/blog`
  }
  alternates['x-default'] = `${SITE_URL}/en/blog`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

interface BlogPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'blog' })

  const allPosts = getAllPosts(locale)
  const activeCategory = category ?? null
  const filteredPosts = activeCategory
    ? allPosts.filter((post) => post.category === activeCategory)
    : allPosts

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <WebPageJsonLd
        name="Blog | Future Marketing AI"
        description="Insights on AI marketing automation, chatbots, voice agents, and growth strategies for B2B companies."
        path="/blog"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
        locale={locale}
      />
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-text-primary">{t('title')}</h1>
      <p className="mb-10 text-lg text-text-secondary">{t('subtitle')}</p>

      <CategoryFilter
        categories={BLOG_CATEGORIES}
        activeCategory={activeCategory}
        locale={locale}
      />

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-text-muted">
            {activeCategory ? t('noPostsInCategory') : t('noPosts')}
          </p>
        </div>
      )}
    </main>
  )
}
