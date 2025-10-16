import React from 'react'
// Direct imports to avoid circular dependency
import { Breadcrumbs } from './Breadcrumbs'
import { NavigationProgress } from './NavigationProgress'
import { PremiumBadge } from './PremiumBadge'

interface AppLayoutProps {
  children: React.ReactNode
  showBreadcrumbs?: boolean
  showProgress?: boolean
  showPremiumBadge?: boolean
  premiumBadgeVariant?: 'floating' | 'inline' | 'banner'
  premiumBadgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * AppLayout - Main layout wrapper with breadcrumbs and progress
 *
 * Provides consistent layout structure across all pages.
 * Includes navigation breadcrumbs, progress indicator, and optional premium badge.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showBreadcrumbs = true,
  showProgress = true,
  showPremiumBadge = false,
  premiumBadgeVariant = 'floating',
  premiumBadgePosition = 'top-right',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark">
      {/* Header with Navigation Tools */}
      {(showBreadcrumbs || showProgress) && (
        <header className="glass-card-subtle border-b border-border-primary sticky top-0 z-30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {showBreadcrumbs && <Breadcrumbs />}
              {showProgress && <NavigationProgress />}
            </div>
          </div>
        </header>
      )}

      {/* Premium Badge - Floating */}
      {showPremiumBadge && premiumBadgeVariant === 'floating' && (
        <PremiumBadge variant="floating" position={premiumBadgePosition} showLabels />
      )}

      {/* Premium Badge - Banner (in header) */}
      {showPremiumBadge && premiumBadgeVariant === 'banner' && (
        <div className="sticky top-[73px] z-20">
          <PremiumBadge variant="banner" />
        </div>
      )}

      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  )
}

export default AppLayout
