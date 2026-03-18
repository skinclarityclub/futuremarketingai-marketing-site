import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL, PAGE_DATES } from '@/lib/seo-config'

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
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, changeFrequency, priority }) => {
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
}
