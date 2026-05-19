/**
 * Breadcrumb route configuration — maps each non-home route to its
 * visible label-key (next-intl) and parent path. Used by both the
 * visible `<Breadcrumbs>` component and the BreadcrumbList JSON-LD.
 *
 * Adding a route: add a `RouteCrumb` entry. Parents resolve transitively
 * up to `/` via repeated lookups. Routes not listed here fall back to a
 * one-level "Home > <path-as-label>" chain at render time.
 *
 * Phase 17-A audit MF-04: breadcrumbs absent across 30 non-home routes.
 * Source: docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md.
 */

export interface RouteCrumb {
  /** Translation key (within `common.breadcrumbs` namespace) for visible label. */
  labelKey: string
  /** Parent route path, or null for top-level routes. */
  parent: string | null
}

/**
 * Map of route paths to crumb config. Paths use the `/<segment>` convention
 * without locale prefix; locale is injected at render time via next-intl.
 */
export const BREADCRUMB_ROUTES: Record<string, RouteCrumb> = {
  '/': { labelKey: 'home', parent: null },

  // Marketing
  '/about': { labelKey: 'about', parent: '/' },
  '/how-it-works': { labelKey: 'how_it_works', parent: '/' },
  '/pricing': { labelKey: 'pricing', parent: '/' },
  '/founding-member': { labelKey: 'founding_member', parent: '/' },
  '/contact': { labelKey: 'contact', parent: '/' },
  '/memory': { labelKey: 'memory', parent: '/' },
  '/apply': { labelKey: 'apply', parent: '/' },
  '/assessment': { labelKey: 'assessment', parent: '/' },
  '/roadmap': { labelKey: 'roadmap', parent: '/' },

  // Case studies
  '/case-studies/skinclarity-club': {
    labelKey: 'case_studies_skc',
    parent: '/',
  },

  // Skills index + 12 skills
  '/skills': { labelKey: 'skills_index', parent: '/' },
  '/skills/social-media': { labelKey: 'skill_social_media', parent: '/skills' },
  '/skills/blog-factory': { labelKey: 'skill_blog_factory', parent: '/skills' },
  '/skills/voice-agent': { labelKey: 'skill_voice_agent', parent: '/skills' },
  '/skills/lead-qualifier': { labelKey: 'skill_lead_qualifier', parent: '/skills' },
  '/skills/ad-creator': { labelKey: 'skill_ad_creator', parent: '/skills' },
  '/skills/reel-builder': { labelKey: 'skill_reel_builder', parent: '/skills' },
  '/skills/email-management': { labelKey: 'skill_email_management', parent: '/skills' },
  '/skills/manychat': { labelKey: 'skill_manychat', parent: '/skills' },
  '/skills/reporting': { labelKey: 'skill_reporting', parent: '/skills' },
  '/skills/seo-geo': { labelKey: 'skill_seo_geo', parent: '/skills' },
  '/skills/research': { labelKey: 'skill_research', parent: '/skills' },
  '/skills/clyde': { labelKey: 'skill_clyde', parent: '/skills' },

  // Blog
  '/blog': { labelKey: 'blog', parent: '/' },

  // Legal
  '/legal': { labelKey: 'legal', parent: '/' },
  '/legal/privacy': { labelKey: 'legal_privacy', parent: '/legal' },
  '/legal/terms': { labelKey: 'legal_terms', parent: '/legal' },
  '/legal/cookies': { labelKey: 'legal_cookies', parent: '/legal' },
}

/**
 * Build the full crumb chain for a given route, from root to current.
 * Returns an empty array for the root route (no breadcrumb needed on home).
 *
 * Routes not in BREADCRUMB_ROUTES return a single-level fallback.
 */
export function getBreadcrumbChain(path: string): RouteCrumb[] {
  if (path === '/') return []

  const chain: RouteCrumb[] = []
  let cursor: string | null = path

  // Walk up the parent chain, collecting crumbs in reverse order.
  const visited = new Set<string>()
  while (cursor && !visited.has(cursor)) {
    visited.add(cursor)
    const crumb: RouteCrumb | undefined = BREADCRUMB_ROUTES[cursor]
    if (!crumb) {
      // Unknown route: insert a fallback crumb using the last segment as label-key.
      const segment = cursor.split('/').filter(Boolean).pop() ?? 'page'
      chain.unshift({ labelKey: segment, parent: '/' })
      cursor = '/'
      continue
    }
    chain.unshift(crumb)
    cursor = crumb.parent
  }

  return chain
}

/**
 * Build an ordered list of {path, labelKey} pairs from root to current,
 * suitable for rendering visible breadcrumbs and emitting JSON-LD.
 */
export interface BreadcrumbStep {
  path: string
  labelKey: string
}

export function getBreadcrumbSteps(path: string): BreadcrumbStep[] {
  if (path === '/') return []

  const steps: BreadcrumbStep[] = [{ path: '/', labelKey: 'home' }]
  let cursor: string | null = path
  const trail: string[] = []
  const visited = new Set<string>()

  while (cursor && cursor !== '/' && !visited.has(cursor)) {
    visited.add(cursor)
    trail.unshift(cursor)
    const crumb: RouteCrumb | undefined = BREADCRUMB_ROUTES[cursor]
    cursor = crumb?.parent ?? '/'
  }

  for (const p of trail) {
    const crumb = BREADCRUMB_ROUTES[p]
    if (crumb) {
      steps.push({ path: p, labelKey: crumb.labelKey })
    } else {
      const segment = p.split('/').filter(Boolean).pop() ?? 'page'
      steps.push({ path: p, labelKey: segment })
    }
  }

  return steps
}
