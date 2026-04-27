import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'

/**
 * AI crawler allowlist — explicit Allow rules per bot for GEO-readiness and
 * audit-tool friendliness.
 *
 * Why explicit (instead of relying on the wildcard `*`):
 *   1. Third-party GEO audit tools (Otterly, Profound, Peec, Promptmonitor)
 *      score "implicit allow via *" at 40/100. Per-agent Allow lifts the score.
 *   2. ~73 percent of sites accidentally block AI crawlers via CDN/WAF rules.
 *      An explicit allowlist signals intent so any later edge layer (Vercel
 *      WAF, Cloudflare Bot Fight, etc.) cannot silently strip the signal.
 *   3. GEO is the strategy. If a bot crawls us, we WANT it cited. The cost of
 *      a false-positive block is a missed AI citation; the cost of allow is
 *      zero (content is public marketing copy).
 *
 * Sources confirmed 2026-04-24:
 *   - GPTBot:                 https://platform.openai.com/docs/gptbot
 *   - ChatGPT-User:           https://platform.openai.com/docs/bots
 *   - OAI-SearchBot:          https://platform.openai.com/docs/bots
 *   - ClaudeBot/anthropic-ai/Claude-Web: https://support.anthropic.com/en/articles/8896518
 *   - PerplexityBot/Perplexity-User: https://docs.perplexity.ai/guides/bots
 *   - Google-Extended:        https://blog.google/technology/ai/an-update-on-web-publisher-controls/
 *   - Applebot-Extended:      https://support.apple.com/en-us/HT204683
 *   - CCBot:                  https://commoncrawl.org/ccbot
 *   - Bytespider:             https://darkvisitors.com/agents/bytespider
 *   - Amazonbot:              https://developer.amazon.com/amazonbot
 *   - Meta-ExternalAgent:     https://developers.facebook.com/docs/sharing/webmasters/crawler
 *
 * Bytespider + Meta policy — Allow per DECISIONS-2026-04-24.md Phase-14 Q6:
 *   Public marketing content. Bytespider feeds TikTok search, Meta-ExternalAgent
 *   improves WhatsApp/Instagram link previews + Meta AI training. Blocking
 *   yields no privacy win, only reach loss.
 *
 * Refs:
 *   docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md (Top-15 #7)
 *   docs/research/2026-03-28-geo-llmeo-ai-citation-research.md (sec 3.6, sec 5)
 *   .planning/phases/DECISIONS-2026-04-24.md (Phase 14 Q6 — Bytespider/Meta Allow)
 */
const AI_CRAWLERS: string[] = [
  // OpenAI family
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  // Anthropic family
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  // Perplexity family
  'PerplexityBot',
  'Perplexity-User',
  // Google AI (separate from Googlebot — Google-Extended controls Bard/Gemini training only)
  'Google-Extended',
  // Apple AI (separate from Applebot — Applebot-Extended controls AI training only)
  'Applebot-Extended',
  // Common Crawl (foundation dataset for many open-source models)
  'CCBot',
  // ByteDance (TikTok search index + Doubao)
  'Bytespider',
  // Amazon (Alexa, Rufus shopping assistant)
  'Amazonbot',
  // Meta (WhatsApp/Instagram link previews + Meta AI training)
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  // Diffbot (knowledge-graph aggregator used by enterprise AI products)
  'Diffbot',
]

const SHARED_ALLOW = ['/', '/llms.txt', '/llms-full.txt']
const SHARED_DISALLOW = ['/api/', '/_next/']

export default function robots(): MetadataRoute.Robots {
  // One explicit rule per AI crawler with the same allow/disallow as `*`.
  const aiRules = AI_CRAWLERS.map((userAgent) => ({
    userAgent,
    allow: SHARED_ALLOW,
    disallow: SHARED_DISALLOW,
  }))

  return {
    rules: [
      // Wildcard fallback — matches Googlebot, Bingbot, DuckDuckBot, and any uncataloged crawler.
      {
        userAgent: '*',
        allow: SHARED_ALLOW,
        disallow: SHARED_DISALLOW,
      },
      ...aiRules,
    ],
    // Canonical host declaration — helps post-Phase-10 domain SSoT (future-marketing.ai).
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
