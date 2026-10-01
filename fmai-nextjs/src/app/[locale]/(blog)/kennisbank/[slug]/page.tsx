import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { SITE_URL, SITE_NAME, LINKEDIN_DALEY_URL } from '@/lib/seo-config'
import { isIndexableLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { OG_LOCALE_MAP } from '@/lib/metadata'
import {
  getAllPosts,
  getPostSlugsWithLocales,
  getAllPostsAllLocales,
  getCategoryLabel,
  formatPostDate,
  type BlogPostMeta,
} from '@/lib/blog'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogContent } from '@/components/blog/BlogContent'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { KeyTakeaways } from '@/components/blog/KeyTakeaways'
import { BlogFaq } from '@/components/blog/BlogFaq'
import { Citations } from '@/components/blog/Citations'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PageShell } from '@/components/layout/PageShell'

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  // Only generate routes for the locale each post is written in.
  // This prevents /nl/kennisbank/english-post from being generated.
  return getPostSlugsWithLocales().map(({ slug, locale }) => ({ locale, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getAllPosts(locale).find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const url = `${SITE_URL}/${locale}/kennisbank/${slug}`

  // Only include hreflang alternates for locales that actually have this post
  const allVersions = getAllPostsAllLocales().filter((p) => p.slug === slug)
  const alternates: Record<string, string> = {}
  for (const version of allVersions) {
    alternates[version.locale] = `${SITE_URL}/${version.locale}/kennisbank/${slug}`
  }
  if (alternates['en']) {
    alternates['x-default'] = alternates['en']
  }

  const ogImage = post.heroImage
    ? post.heroImage.startsWith('http')
      ? post.heroImage
      : `${SITE_URL}${post.heroImage}`
    : undefined

  return {
    // Keep the brand suffix only when the full title still fits <=60 chars; otherwise render the
    // (already <=60) article title alone. `absolute` bypasses any root title template so the brand
    // is never appended a second time (the kennisbank article titles are descriptive + long).
    title: {
      absolute:
        `${post.title} | ${SITE_NAME}`.length <= 60 ? `${post.title} | ${SITE_NAME}` : post.title,
    },
    description: post.description,
    // This route builds its own metadata instead of going through
    // generatePageMetadata, so the indexable-locale rule has to be repeated
    // here. Today no article carries a non-indexable locale, which is exactly
    // why a future one would slip through unnoticed.
    ...(isIndexableLocale(locale) ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: url,
      languages: Object.keys(alternates).length > 1 ? alternates : undefined,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE_MAP[locale] ?? locale,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const posts = getAllPosts(locale)
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  let Post: React.ComponentType
  try {
    const mod = await import(`@content/blog/${slug}.mdx`)
    Post = mod.default
  } catch {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'blog' })
  const tAbout = await getTranslations({ locale, namespace: 'about' })

  // "Last updated" only shows when updatedAt was raised for a real content change;
  // equal dates mean the article was never revised.
  const isUpdated = post.updatedAt > post.publishedAt
  const isDaley = post.author === 'Daley van Diest' || post.author === 'Daley'

  // A related slug whose post was removed or merged must not render a dead card.
  const relatedPosts = (post.relatedSlugs ?? [])
    .map((s) => posts.find((p) => p.slug === s))
    .filter((p): p is BlogPostMeta => p !== undefined)

  const heroAbsolute = post.heroImage
    ? post.heroImage.startsWith('http')
      ? post.heroImage
      : `${SITE_URL}${post.heroImage}`
    : undefined

  return (
    <PageShell>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        author={post.author}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        slug={slug}
        locale={locale}
        image={heroAbsolute}
        type={post.schemaType ?? (post.pillar ? 'Article' : 'BlogPosting')}
      />
      {/* ArticleJsonLd points mainEntityOfPage at #webpage, so the node has to exist here. */}
      <WebPageJsonLd
        name={post.title}
        description={post.description}
        path={`/kennisbank/${slug}`}
        locale={locale}
        dateModified={post.updatedAt}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Kennisbank', path: '/kennisbank' },
          { name: post.title, path: `/kennisbank/${slug}` },
        ]}
        locale={locale}
      />
      {post.faqs && post.faqs.length > 0 && (
        <FaqJsonLd items={post.faqs} path={`/kennisbank/${slug}`} locale={locale} />
      )}

      <Breadcrumbs
        locale={locale}
        items={[
          { label: 'Home', href: '/' },
          { label: 'Kennisbank', href: '/kennisbank' },
          { label: post.title },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-20 pt-8">
        <header className="mb-10 space-y-4">
          <EyebrowLabel>{t('post.eyebrow')}</EyebrowLabel>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent-system/10 px-3 py-1 text-xs font-medium text-accent-system">
              {getCategoryLabel(post.category)}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed text-text-secondary">{post.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
            {isDaley ? (
              <Link href="/about" className="hover:text-accent-system">
                {post.author}
              </Link>
            ) : (
              <span>{post.author}</span>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>
              {t('post.published')}{' '}
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
            </span>
            {isUpdated ? (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>
                  {t('post.updated')}{' '}
                  <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt, locale)}</time>
                </span>
              </>
            ) : null}
            {post.readTime ? (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{t('post.readTime', { minutes: post.readTime })}</span>
              </>
            ) : null}
          </div>
        </header>

        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <TableOfContents items={post.tableOfContents} />
        )}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <KeyTakeaways items={post.keyTakeaways} />
        )}

        <BlogContent>
          <Post />
        </BlogContent>

        {post.faqs && post.faqs.length > 0 && <BlogFaq items={post.faqs} />}
        {post.citations && post.citations.length > 0 && <Citations items={post.citations} />}

        {isDaley && (
          <aside className="mt-12 rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              {t('post.writtenBy')}
            </p>
            <p className="mt-2 font-display text-lg font-semibold text-text-primary">
              {tAbout('founder.fullName')}
            </p>
            <p className="text-sm text-text-secondary">{tAbout('founder.role')}</p>
            <div className="mt-3 flex gap-4 text-sm">
              <Link href="/about" className="text-accent-system hover:underline">
                {t('post.aboutAuthor')}
              </Link>
              <a
                href={LINKEDIN_DALEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-system hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </aside>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-12 border-t border-border-primary pt-8">
            <h2 className="mb-6 font-display text-lg font-semibold text-text-primary">
              {t('post.related')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <BlogPostCard key={related.slug} post={related} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  )
}
