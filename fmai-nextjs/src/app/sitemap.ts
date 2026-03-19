import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL, PAGE_DATES } from '@/lib/seo-config'
import { getAllPostsAllLocales } from '@/lib/blog'

const pages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/automations', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/chatbots', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/voice-agents', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/marketing-machine', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/how-it-works', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/legal', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = pages.map(({ path, changeFrequency, priority }) => {
    const pathSuffix = path === '/' ? '' : path

    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}${pathSuffix}`
    }

    return {
      url: `${SITE_URL}/en${pathSuffix}`,
      lastModified: PAGE_DATES[path] ? new Date(PAGE_DATES[path]) : new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages,
      },
    }
  })

  // Group posts by slug to find which locales each post exists in
  const allPosts = getAllPostsAllLocales()
  const postsBySlug = new Map<string, typeof allPosts>()
  for (const post of allPosts) {
    const existing = postsBySlug.get(post.slug) ?? []
    existing.push(post)
    postsBySlug.set(post.slug, existing)
  }

  const blogEntries = Array.from(postsBySlug.entries()).flatMap(([slug, versions]) => {
    // Only add hreflang alternates if the post exists in multiple locales
    const languages: Record<string, string> | undefined =
      versions.length > 1
        ? Object.fromEntries(
            versions.map((v) => [v.locale, `${SITE_URL}/${v.locale}/blog/${slug}`])
          )
        : undefined

    return versions.map((post) => ({
      url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(languages ? { alternates: { languages } } : {}),
    }))
  })

  return [...staticEntries, ...blogEntries]
}
