import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
}

export const BLOG_CATEGORIES = [
  { id: 'ai-marketing', label: 'AI Marketing' },
  { id: 'automation', label: 'Automation' },
  { id: 'chatbots', label: 'Chatbots' },
  { id: 'voice-agents', label: 'Voice Agents' },
] as const

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

export function getAllPosts(locale?: string): BlogPostMeta[] {
  const targetLocale = locale ?? 'en'

  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  const posts: BlogPostMeta[] = files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename)
      const fileContents = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContents)

      return {
        slug: filename.replace(/\.mdx$/, ''),
        title: data.title ?? '',
        description: data.description ?? '',
        author: data.author ?? '',
        publishedAt: data.publishedAt ?? '',
        updatedAt: data.updatedAt ?? '',
        category: data.category ?? '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        locale: data.locale ?? 'en',
      }
    })
    .filter((post) => post.locale === targetLocale)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return posts
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}
