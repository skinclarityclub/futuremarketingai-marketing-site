import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
import withBundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin()

const withAnalyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// ---------------------------------------------------------------------------
// Security Headers
// ---------------------------------------------------------------------------
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com https://unpkg.com;
  style-src 'self' 'unsafe-inline' https://assets.calendly.com;
  img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://assets.calendly.com https://prod.spline.design;
  font-src 'self' data:;
  connect-src 'self' https://api.anthropic.com https://www.google-analytics.com https://calendly.com https://assets.calendly.com https://vitals.vercel-insights.com https://prod.spline.design https://unpkg.com;
  frame-src https://calendly.com;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const securityHeaders = [
  // Content-Security-Policy — controls which resources the browser is allowed to load
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  // HSTS — force HTTPS for 2 years, include subdomains, allow preload list
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Prevent framing (clickjacking) — superseded by CSP frame-ancestors but kept for older browsers
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // Control how much referrer information is sent
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable browser features that are not needed
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  // Explicitly disable XSS Auditor (deprecated; 0 = off is the safest setting)
  {
    key: 'X-XSS-Protection',
    value: '0',
  },
  // Prevent DNS prefetching leaks
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
]

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:locale/chatbots',
        destination: '/:locale/skills/lead-qualifier',
        permanent: true,
      },
      {
        source: '/:locale/automations',
        destination: '/:locale/skills/content-creator',
        permanent: true,
      },
      {
        source: '/:locale/voice-agents',
        destination: '/:locale/skills/voice-agent',
        permanent: true,
      },
      {
        source: '/:locale/marketing-machine',
        destination: '/:locale/skills/content-creator',
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withAnalyze(withNextIntl(withMDX(nextConfig)))
