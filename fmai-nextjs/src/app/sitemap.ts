import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL, PAGE_DATES } from '@/lib/seo-config'
import { getAllPosts } from '@/lib/blog'

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

  const blogPosts = getAllPosts()
  const blogEntries = blogPosts.map((post) => {
    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}/blog/${post.slug}`
    }

    return {
      url: `${SITE_URL}/en/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages,
      },
    }
  })

  return [...staticEntries, ...blogEntries]
}
