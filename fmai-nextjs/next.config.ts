import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'
import withBundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin()

const withAnalyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withAnalyze(withNextIntl(withMDX(nextConfig)))
