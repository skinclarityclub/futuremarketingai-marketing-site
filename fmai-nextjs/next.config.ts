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
// LIGHTHOUSE_TEST=true strips HSTS + upgrade-insecure-requests so `next start`
// on localhost works with Lighthouse (headless Chrome stores HSTS from the warmup
// navigation and then ERR_ABORTs the main navigation trying to use HTTPS).
const isProduction = process.env.NODE_ENV === 'production'
const isLighthouseTest = process.env.LIGHTHOUSE_TEST === 'true'
const includeHttpsUpgrades = isProduction && !isLighthouseTest

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com https://unpkg.com;
  style-src 'self' 'unsafe-inline' https://assets.calendly.com;
  img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://assets.calendly.com https://prod.spline.design;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com https://calendly.com https://assets.calendly.com https://vitals.vercel-insights.com https://prod.spline.design https://unpkg.com;
  frame-src https://calendly.com;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  ${includeHttpsUpgrades ? 'upgrade-insecure-requests;' : ''}
`

const securityHeaders = [
  // Content-Security-Policy — controls which resources the browser is allowed to load
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  // HSTS — excluded when LIGHTHOUSE_TEST=true: headless Chrome stores HSTS from
  // the warmup navigation and then ERR_ABORTs the second navigation on localhost.
  ...(includeHttpsUpgrades ? [{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  }] : []),
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
  // microphone=(self) so the /skills/voice-agent ElevenLabs demo can request mic access on same-origin
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), browsing-topics=()',
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
  // scripts/dev.mjs sets NEXT_DIST_DIR when starting a parallel dev server on
  // a non-default port, so each instance writes to its own .next-{port}/ and
  // avoids turbopack-persistence panics caused by sharing .next/dev/.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1024, 1280, 1536, 1920],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'motion',
      'react-markdown',
      'zustand',
    ],
    // optimizeCss is Pages-Router only in Next 16 — ignored for App Router.
    // We do the inlining via a postbuild script (scripts/inline-critical-css.mjs).
  },
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    }
    return config
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
      // Legacy top-level routes → skill pages
      {
        source: '/:locale/chatbots',
        destination: '/:locale/skills/lead-qualifier',
        permanent: true,
      },
      {
        source: '/:locale/automations',
        destination: '/:locale/skills/ad-creator',
        permanent: true,
      },
      {
        source: '/:locale/voice-agents',
        destination: '/:locale/skills/voice-agent',
        permanent: true,
      },
      {
        source: '/:locale/marketing-machine',
        destination: '/:locale/skills/social-media',
        permanent: true,
      },
      // Skill pages removed/renamed in v10 content upgrade
      {
        source: '/:locale/skills/chatbot',
        destination: '/:locale/skills/lead-qualifier',
        permanent: true,
      },
      {
        source: '/:locale/skills/content-creator',
        destination: '/:locale/skills/social-media',
        permanent: true,
      },
      {
        source: '/:locale/skills/email',
        destination: '/:locale/skills/email-management',
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
