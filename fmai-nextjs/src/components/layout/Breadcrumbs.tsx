import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'
import { getBreadcrumbSteps } from '@/lib/breadcrumb-config'

interface BreadcrumbsProps {
  /** Route path without locale prefix. Use the same value passed to BreadcrumbJsonLd. */
  path: string
  /** Locale for label translation. */
  locale: string
  /** Optional className override on the nav element. */
  className?: string
}

/**
 * Breadcrumbs — visible navigation chain from root to current route.
 *
 * Server component. Reads `common.breadcrumbs.<labelKey>` from next-intl
 * for each step. Closes audit MF-04 (breadcrumbs absent across 30 non-home
 * routes). Pair with BreadcrumbJsonLd so structured data matches the
 * visible chain.
 *
 * Home route renders nothing. Unknown routes fall back to "Home > <segment>".
 */
export async function Breadcrumbs({ path, locale, className }: BreadcrumbsProps) {
  const steps = getBreadcrumbSteps(path)
  if (steps.length === 0) return null

  const t = await getTranslations({ locale, namespace: 'common.breadcrumbs' })

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ??
        'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 text-sm text-text-muted'
      }
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const label = t(step.labelKey)
          return (
            <li key={step.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-text-secondary font-medium"
                >
                  {label}
                </span>
              ) : (
                <>
                  <Link
                    href={step.path}
                    className="hover:text-text-primary transition-colors"
                  >
                    {label}
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
