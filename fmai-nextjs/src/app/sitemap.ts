import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL, PAGE_DATES } from '@/lib/seo-config'
import { getAllPostsAllLocales } from '@/lib/blog'

const pages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/memory', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/apply', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/case-studies/skinclarity-club', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/skills/social-media', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/blog-factory', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/ad-creator', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/reel-builder', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/skills/voice-agent', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/lead-qualifier', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/email-management', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/skills/manychat', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/skills/reporting', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/seo-geo', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/research', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/skills/clyde', changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/founding-member', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/assessment', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/roadmap', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/how-it-works', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/legal', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/legal/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/legal/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/legal/cookies', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/kennisbank', changeFrequency: 'weekly' as const, priority: 0.8 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Emit one <url> entry PER LOCALE for every static page so each indexable
  // language variant (/en, /nl, /es) has its OWN <loc> — not hreflang-only.
  // URLs known to Google only via hreflang get crawled/indexed slower
  // ("Discovered – currently not indexed"); a real <loc> per locale fixes that.
  // Each variant carries the IDENTICAL reciprocal hreflang map: every locale +
  // a self-reference (Next.js does NOT auto-add it) + x-default pointing at the
  // default-locale URL, matching the on-page hreflang exactly.
  const staticEntries = pages.flatMap(({ path, changeFrequency, priority }) => {
    const pathSuffix = path === '/' ? '' : path

    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}${pathSuffix}`
    }
    languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${pathSuffix}`

    const lastModified = PAGE_DATES[path] ? new Date(PAGE_DATES[path]) : new Date()

    return routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${pathSuffix}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }))
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
    // Posts already get one <loc> per existing locale. Add hreflang only when a
    // post exists in multiple locales, and add x-default -> the default-locale
    // version ONLY if that version actually exists (never point x-default at a 404).
    let languages: Record<string, string> | undefined
    if (versions.length > 1) {
      languages = Object.fromEntries(
        versions.map((v) => [v.locale, `${SITE_URL}/${v.locale}/kennisbank/${slug}`])
      )
      if (versions.some((v) => v.locale === routing.defaultLocale)) {
        languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}/kennisbank/${slug}`
      }
    }

    return versions.map((post) => ({
      url: `${SITE_URL}/${post.locale}/kennisbank/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(languages ? { alternates: { languages } } : {}),
    }))
  })

  return [...staticEntries, ...blogEntries]
}
