import React from 'react'
import { useIsMobile, useIsTablet, useIsDesktop } from '../../hooks'

// Legacy compatibility - map new hooks to old useBreakpoints interface
const useBreakpoints = () => {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  }
}

/**
 * Props for responsive wrapper components
 */
interface ResponsiveProps {
  children: React.ReactNode
}

/**
 * Mobile - Only renders children on mobile devices (< 768px)
 *
 * @example
 * ```tsx
 * <Mobile>
 *   <SimplifiedMobileView />
 * </Mobile>
 * ```
 */
export const Mobile: React.FC<ResponsiveProps> = ({ children }) => {
  const { isMobile } = useBreakpoints()
  return isMobile ? <>{children}</> : null
}

/**
 * Tablet - Only renders children on tablets (768px - 1023px)
 *
 * @example
 * ```tsx
 * <Tablet>
 *   <TabletView />
 * </Tablet>
 * ```
 */
export const Tablet: React.FC<ResponsiveProps> = ({ children }) => {
  const { isTablet } = useBreakpoints()
  return isTablet ? <>{children}</> : null
}

/**
 * Desktop - Only renders children on desktop (≥ 1024px)
 *
 * @example
 * ```tsx
 * <Desktop>
 *   <FullDesktopExperience />
 * </Desktop>
 * ```
 */
export const Desktop: React.FC<ResponsiveProps> = ({ children }) => {
  const { isDesktop } = useBreakpoints()
  return isDesktop ? <>{children}</> : null
}

/**
 * MobileOrTablet - Renders children on mobile or tablet (< 1024px)
 *
 * @example
 * ```tsx
 * <MobileOrTablet>
 *   <TouchOptimizedView />
 * </MobileOrTablet>
 * ```
 */
export const MobileOrTablet: React.FC<ResponsiveProps> = ({ children }) => {
  const { isMobileOrTablet } = useBreakpoints()
  return isMobileOrTablet ? <>{children}</> : null
}

/**
 * TabletOrDesktop - Renders children on tablet or desktop (≥ 768px)
 *
 * @example
 * ```tsx
 * <TabletOrDesktop>
 *   <AdvancedFeatures />
 * </TabletOrDesktop>
 * ```
 */
export const TabletOrDesktop: React.FC<ResponsiveProps> = ({ children }) => {
  const { isTabletOrDesktop } = useBreakpoints()
  return isTabletOrDesktop ? <>{children}</> : null
}

/**
 * ResponsiveContainer - Provides responsive padding and max-width
 *
 * @example
 * ```tsx
 * <ResponsiveContainer>
 *   <Content />
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer: React.FC<ResponsiveProps> = ({ children }) => {
  return <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">{children}</div>
}

/**
 * Responsive Grid - Auto-adjusting grid layout
 *
 * @example
 * ```tsx
 * <ResponsiveGrid>
 *   <Card />
 *   <Card />
 *   <Card />
 * </ResponsiveGrid>
 * ```
 */
interface ResponsiveGridProps extends ResponsiveProps {
  /** Minimum column width (default: 280px) */
  minColumnWidth?: string
  /** Gap between items (default: 1rem) */
  gap?: string
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  minColumnWidth = '280px',
  gap = '1rem',
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  )
}
