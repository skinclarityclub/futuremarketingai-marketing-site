import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogFaqItem {
  question: string
  answer: string
}

export interface BlogCitation {
  title: string
  /** Source URL or DOI link. */
  url?: string
  /** Publication / journal / site name. */
  source?: string
  year?: number
}

export interface BlogTocItem {
  /** Anchor id matching the heading slug in the MDX body. */
  id: string
  title: string
  level: 2 | 3
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  locale: string

  // ── SKC-grade additions (all optional, backward-compatible) ──
  /** Absolute or root-relative hero/OG image. 1200x630 recommended. */
  heroImage?: string
  /** Reading time in minutes. Falls back to a word-count estimate when omitted. */
  readTime?: number
  keyTakeaways?: string[]
  faqs?: BlogFaqItem[]
  citations?: BlogCitation[]
  tableOfContents?: BlogTocItem[]
  /** True for pillar (cornerstone) pages; false/undefined for cluster posts. */
  pillar?: boolean
  /** Slug of the pillar this cluster post supports. */
  clusterOf?: string
  /** Slugs of related posts for internal linking. */
  relatedSlugs?: string[]
  schemaType?: 'Article' | 'BlogPosting'
}

export const BLOG_CATEGORIES = [
  { id: 'geo', label: 'GEO' },
  { id: 'ai-marketing-automation', label: 'AI Marketing Automation' },
  { id: 'agency-ops', label: 'Agency Ops' },
  { id: 'comparisons', label: 'Comparisons' },
  { id: 'guides', label: 'Guides' },
  // Legacy categories — kept so existing posts keep resolving a label.
  { id: 'ai-marketing', label: 'AI Marketing' },
  { id: 'automation', label: 'Automation' },
  { id: 'chatbots', label: 'Chatbots' },
  { id: 'voice-agents', label: 'Voice Agents' },
] as const

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

const WORDS_PER_MINUTE = 200

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/**
 * Single source of truth for turning a parsed MDX file into BlogPostMeta.
 * Used by every reader below so new frontmatter fields only need to be added once.
 */
function toMeta(filename: string, data: Record<string, unknown>, content: string): BlogPostMeta {
  const meta: BlogPostMeta = {
    slug: filename.replace(/\.mdx$/, ''),
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    author: (data.author as string) ?? '',
    publishedAt: (data.publishedAt as string) ?? '',
    updatedAt: (data.updatedAt as string) ?? (data.publishedAt as string) ?? '',
    category: (data.category as string) ?? '',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    locale: (data.locale as string) ?? 'en',
    readTime: typeof data.readTime === 'number' ? data.readTime : estimateReadTime(content),
  }

  if (typeof data.heroImage === 'string') meta.heroImage = data.heroImage
  if (Array.isArray(data.keyTakeaways)) meta.keyTakeaways = data.keyTakeaways as string[]
  if (Array.isArray(data.faqs)) meta.faqs = data.faqs as BlogFaqItem[]
  if (Array.isArray(data.citations)) meta.citations = data.citations as BlogCitation[]
  if (Array.isArray(data.tableOfContents)) meta.tableOfContents = data.tableOfContents as BlogTocItem[]
  if (typeof data.pillar === 'boolean') meta.pillar = data.pillar
  if (typeof data.clusterOf === 'string') meta.clusterOf = data.clusterOf
  if (Array.isArray(data.relatedSlugs)) meta.relatedSlugs = data.relatedSlugs as string[]
  if (data.schemaType === 'Article' || data.schemaType === 'BlogPosting') meta.schemaType = data.schemaType

  return meta
}

function readMeta(filename: string): BlogPostMeta {
  const fileContents = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
  const { data, content } = matter(fileContents)
  return toMeta(filename, data, content)
}

function mdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
}

export function getAllPosts(locale?: string): BlogPostMeta[] {
  const targetLocale = locale ?? 'en'

  return mdxFiles()
    .map(readMeta)
    .filter((post) => post.locale === targetLocale)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostSlugs(): string[] {
  return mdxFiles().map((f) => f.replace(/\.mdx$/, ''))
}

/**
 * Returns slug+locale pairs for all posts across all locales.
 * Used by generateStaticParams to only generate routes for
 * the locale each post is written in.
 */
export function getPostSlugsWithLocales(): { slug: string; locale: string }[] {
  return mdxFiles().map((filename) => {
    const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8'))
    return {
      slug: filename.replace(/\.mdx$/, ''),
      locale: (data.locale as string) ?? 'en',
    }
  })
}

/**
 * Returns all posts regardless of locale.
 * Each post includes its locale field so callers can build
 * locale-specific URLs.
 */
export function getAllPostsAllLocales(): BlogPostMeta[] {
  return mdxFiles()
    .map(readMeta)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

/** Resolve a human label for a category id, falling back to a title-cased id. */
export function getCategoryLabel(id: string): string {
  const found = BLOG_CATEGORIES.find((c) => c.id === id)
  if (found) return found.label
  return id.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
}

/** Posts that are pillars (cornerstone pages). */
export function getPillarPosts(locale?: string): BlogPostMeta[] {
  return getAllPosts(locale).filter((p) => p.pillar)
}

/** Cluster posts that support a given pillar slug. */
export function getClusterPosts(pillarSlug: string, locale?: string): BlogPostMeta[] {
  return getAllPosts(locale).filter((p) => p.clusterOf === pillarSlug)
}
