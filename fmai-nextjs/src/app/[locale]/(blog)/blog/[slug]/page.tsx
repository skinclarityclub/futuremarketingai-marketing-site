import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'
import { getAllPosts, getPostSlugsWithLocales, getAllPostsAllLocales } from '@/lib/blog'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { BlogContent } from '@/components/blog/BlogContent'

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
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
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

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ]}
        locale={locale}
      />

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
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-accent-system/10 px-3 py-1 text-xs font-medium text-accent-system">
              {post.category.replace('-', ' ')}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-text-primary">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span>{post.author}</span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={post.publishedAt}>{publishedDate}</time>
          </div>
        </header>

        <BlogContent>
          <Post />
        </BlogContent>
      </article>
    </main>
  )
}
