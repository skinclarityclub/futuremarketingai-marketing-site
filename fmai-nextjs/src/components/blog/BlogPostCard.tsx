import Link from 'next/link'
import Image from 'next/image'
import type { BlogPostMeta } from '@/lib/blog'

interface BlogPostCardProps {
  post: BlogPostMeta
  locale: string
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-accent-system/30 hover:bg-white/[0.04] hover:shadow-glow-sm"
    >
      {post.heroImage && (
        <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-border-primary">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="p-6">
      <span className="mb-3 inline-block rounded-full bg-accent-system/10 px-3 py-1 text-xs font-medium text-accent-system">
        {post.category}
      </span>
      <h3 className="mb-2 text-lg font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent-system">
        {post.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
        {post.description}
      </p>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{post.author}</span>
        <time dateTime={post.publishedAt}>{formattedDate}</time>
      </div>
      </div>
    </Link>
  )
}
