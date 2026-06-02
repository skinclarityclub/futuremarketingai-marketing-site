/**
 * PillarHubCard — one strategic pillar bucket on the /kennisbank hub.
 *
 * Pure Server Component. Bundles a pillar's headline + description with the
 * pillar pages and their cluster pages that exist in this bucket. Degrades
 * gracefully (research Pitfall 2): when neither pillar nor cluster posts exist
 * yet, it renders `emptyLabel` instead of an empty list so the strategic
 * structure stays visible before cornerstone content lands in Phase 3.
 *
 * All copy arrives via props (page owns i18n). Links use the locale-aware
 * next-intl Link, so hrefs stay locale-relative (`/blog/<slug>`).
 */
import { Link } from '@/i18n/navigation'
import { GlassCard } from '@/components/ui/GlassCard'

interface PillarHubPost {
  slug: string
  title: string
}

interface PillarHubCardProps {
  title: string
  description: string
  /** Pillar posts in this bucket (may be empty before Phase 3). */
  pillarPosts: PillarHubPost[]
  /** Cluster posts grouped under this bucket (may be empty). */
  clusterPosts: PillarHubPost[]
  /** Active locale (kept for parity with the hub's data model). */
  locale: string
  /** Copy shown when there are no posts yet. */
  emptyLabel: string
}

export function PillarHubCard({
  title,
  description,
  pillarPosts,
  clusterPosts,
  emptyLabel,
}: PillarHubCardProps) {
  const posts = [...pillarPosts, ...clusterPosts]
  const hasPosts = posts.length > 0

  return (
    <GlassCard className="flex h-full flex-col text-left">
      <h3 className="font-display text-xl font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 leading-relaxed text-text-secondary">{description}</p>

      {hasPosts ? (
        <ul className="mt-5 space-y-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/kennisbank/${post.slug}`}
                className="text-accent-system transition-colors hover:text-text-primary"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm italic text-text-muted">{emptyLabel}</p>
      )}
    </GlassCard>
  )
}
