import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: ['ChatGPT-User', 'Claude-SearchBot', 'OAI-SearchBot', 'PerplexityBot'],
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'anthropic-ai'],
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
