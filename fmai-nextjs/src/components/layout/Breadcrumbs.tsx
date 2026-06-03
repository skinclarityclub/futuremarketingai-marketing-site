import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'
import { getBreadcrumbSteps } from '@/lib/breadcrumb-config'

export interface BreadcrumbItem {
  /** Already-resolved visible label. */
  label: string
  /** Locale-relative href. Omit for the current (last) crumb. */
  href?: string
}

interface BreadcrumbsProps {
  /** Config-driven mode: route path without locale prefix (labels resolved via i18n). */
  path?: string
  /** Explicit mode: pre-resolved crumbs — for dynamic routes like article slugs. */
  items?: BreadcrumbItem[]
  /** Locale for label translation (config-driven mode only). */
  locale: string
  /** Optional className override on the nav element. */
  className?: string
}

/**
 * Breadcrumbs — visible navigation chain from root to current route.
 *
 * Server component. Two modes:
 *  - `path`: looks up the chain in breadcrumb-config and translates labels via
 *    `common.breadcrumbs.<labelKey>` (every static route).
 *  - `items`: explicit, pre-resolved crumbs for dynamic routes (e.g. article
 *    slugs) where the final label is data, not a translation key.
 *
 * Both modes render identically, so breadcrumbs sit in the same place site-wide.
 * Pair with BreadcrumbJsonLd so structured data matches the visible chain.
 */
export async function Breadcrumbs({ path, items, locale, className }: BreadcrumbsProps) {
  let steps: BreadcrumbItem[]
  if (items) {
    steps = items
  } else if (path) {
    const t = await getTranslations({ locale, namespace: 'common.breadcrumbs' })
    steps = getBreadcrumbSteps(path).map((step) => ({ label: t(step.labelKey), href: step.path }))
  } else {
    return null
  }
  if (steps.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ?? 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 text-sm text-text-muted'
      }
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <li key={step.href ?? step.label} className="flex items-center gap-1.5">
              {isLast || !step.href ? (
                <span aria-current="page" className="text-text-secondary font-medium">
                  {step.label}
                </span>
              ) : (
                <>
                  <Link
                    href={step.href}
                    className="hover:text-text-primary transition-colors"
                  >
                    {step.label}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
