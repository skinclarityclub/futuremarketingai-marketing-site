import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'
import { getAllPosts, getPostSlugsWithLocales, getAllPostsAllLocales, getCategoryLabel } from '@/lib/blog'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { BlogContent } from '@/components/blog/BlogContent'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { KeyTakeaways } from '@/components/blog/KeyTakeaways'
import { BlogFaq } from '@/components/blog/BlogFaq'
import { Citations } from '@/components/blog/Citations'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  // Only generate routes for the locale each post is written in.
  // This prevents /nl/blog/english-post from being generated.
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

  const url = `${SITE_URL}/${locale}/blog/${slug}`

  // Only include hreflang alternates for locales that actually have this post
  const allVersions = getAllPostsAllLocales().filter((p) => p.slug === slug)
  const alternates: Record<string, string> = {}
  for (const version of allVersions) {
    alternates[version.locale] = `${SITE_URL}/${version.locale}/blog/${slug}`
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
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    alternates: {
      canonical: url,
      languages: Object.keys(alternates).length > 1 ? alternates : undefined,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      locale,
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
  const post = getAllPosts(locale).find((p) => p.slug === slug)

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

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const heroAbsolute = post.heroImage
    ? post.heroImage.startsWith('http')
      ? post.heroImage
      : `${SITE_URL}${post.heroImage}`
    : undefined

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-32">
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
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ]}
        locale={locale}
      />
      {post.faqs && post.faqs.length > 0 && (
        <FaqJsonLd items={post.faqs} path={`/blog/${slug}`} locale={locale} />
      )}

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li>
            <Link href={`/${locale}/blog`} className="transition-colors hover:text-accent-system">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-secondary">{post.title}</li>
        </ol>
      </nav>

      <article>
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
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span>{post.author}</span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={post.publishedAt}>{publishedDate}</time>
            {post.readTime ? (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readTime} min read</span>
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
      </article>
    </main>
  )
}
