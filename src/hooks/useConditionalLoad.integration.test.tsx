import { render, screen, waitFor } from '@testing-library/react'
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'
import React, { Suspense } from 'react'
import { createConditionalComponent, createDeviceVariants } from './useConditionalLoad'

// Mock useMediaQuery to control device states
vi.mock('./useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
  useIsMobile: vi.fn(),
  useIsTablet: vi.fn(),
  useIsDesktop: vi.fn(),
  useIsMobileOrTablet: vi.fn(),
}))

import { useIsMobile, useIsTablet, useIsDesktop, useIsMobileOrTablet } from './useMediaQuery'

const mockUseIsMobile = vi.mocked(useIsMobile)
const mockUseIsTablet = vi.mocked(useIsTablet)
const mockUseIsDesktop = vi.mocked(useIsDesktop)
const mockUseIsMobileOrTablet = vi.mocked(useIsMobileOrTablet)

// Mock components for testing
const HeavyDesktopComponent: React.FC<{ testId?: string }> = ({ testId = 'heavy-component' }) => (
  <div data-testid={testId}>Heavy Desktop Component Loaded</div>
)

const LightMobileComponent: React.FC<{ testId?: string }> = ({ testId = 'light-component' }) => (
  <div data-testid={testId}>Light Mobile Component Loaded</div>
)

const FallbackComponent: React.FC = () => <div data-testid="fallback">Loading...</div>

describe('Conditional Loading Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    mockUseIsMobile.mockReturnValue(false)
    mockUseIsTablet.mockReturnValue(false)
    mockUseIsDesktop.mockReturnValue(false)
    mockUseIsMobileOrTablet.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('createConditionalComponent Integration', () => {
    it('should load heavy component only on desktop', async () => {
      mockUseIsDesktop.mockReturnValue(true)

      const ConditionalHeavyComponent = createConditionalComponent(
        () => Promise.resolve({ default: HeavyDesktopComponent }),
        { loadOn: 'desktop' }
      )

      render(<ConditionalHeavyComponent testId="test-heavy" />)

      await waitFor(() => {
        expect(screen.getByTestId('test-heavy')).toBeInTheDocument()
        expect(screen.getByText('Heavy Desktop Component Loaded')).toBeInTheDocument()
      })
    })

    it('should not load heavy component on mobile', () => {
      mockUseIsMobile.mockReturnValue(true)

      const ConditionalHeavyComponent = createConditionalComponent(
        () => Promise.resolve({ default: HeavyDesktopComponent }),
        { loadOn: 'desktop' }
      )

      render(<ConditionalHeavyComponent testId="test-heavy" />)

      expect(screen.queryByTestId('test-heavy')).not.toBeInTheDocument()
    })

    it('should show fallback on unsupported device', () => {
      mockUseIsMobile.mockReturnValue(true)

      const ConditionalHeavyComponent = createConditionalComponent(
        () => Promise.resolve({ default: HeavyDesktopComponent }),
        {
          loadOn: 'desktop',
          fallback: FallbackComponent,
        }
      )

      render(<ConditionalHeavyComponent />)

      expect(screen.getByTestId('fallback')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should load component on mobile or tablet', async () => {
      mockUseIsMobileOrTablet.mockReturnValue(true)
      mockUseIsMobile.mockReturnValue(true)

      const ConditionalMobileComponent = createConditionalComponent(
        () => Promise.resolve({ default: LightMobileComponent }),
        { loadOn: 'mobileOrTablet' }
      )

      render(<ConditionalMobileComponent testId="test-mobile" />)

      await waitFor(() => {
        expect(screen.getByTestId('test-mobile')).toBeInTheDocument()
      })
    })

    it('should handle multiple device types in loadOn array', async () => {
      mockUseIsTablet.mockReturnValue(true)

      const ConditionalComponent = createConditionalComponent(
        () => Promise.resolve({ default: HeavyDesktopComponent }),
        { loadOn: ['tablet', 'desktop'] }
      )

      render(<ConditionalComponent testId="test-multi" />)

      await waitFor(() => {
        expect(screen.getByTestId('test-multi')).toBeInTheDocument()
      })
    })

    it('should respect delay option', async () => {
      mockUseIsDesktop.mockReturnValue(true)

      const ConditionalDelayedComponent = createConditionalComponent(
        () => Promise.resolve({ default: HeavyDesktopComponent }),
        {
          loadOn: 'desktop',
          delay: 100,
          fallback: FallbackComponent,
        }
      )

      render(<ConditionalDelayedComponent testId="test-delayed" />)

      // Should show fallback initially
      expect(screen.getByTestId('fallback')).toBeInTheDocument()

      // After delay, should show component
      await waitFor(
        () => {
          expect(screen.getByTestId('test-delayed')).toBeInTheDocument()
        },
        { timeout: 200 }
      )
    })
  })

  describe('createDeviceVariants Integration', () => {
    const MobileVariant: React.FC = () => <div data-testid="mobile-variant">Mobile Version</div>
    const TabletVariant: React.FC = () => <div data-testid="tablet-variant">Tablet Version</div>
    const DesktopVariant: React.FC = () => <div data-testid="desktop-variant">Desktop Version</div>
    const FallbackVariant: React.FC = () => <div data-testid="fallback-variant">Fallback</div>

    it('should render mobile variant on mobile device', () => {
      mockUseIsMobile.mockReturnValue(true)

      const ResponsiveComponent = createDeviceVariants({
        mobile: MobileVariant,
        tablet: TabletVariant,
        desktop: DesktopVariant,
      }) as React.FC

      render(<ResponsiveComponent />)

      expect(screen.getByTestId('mobile-variant')).toBeInTheDocument()
      expect(screen.queryByTestId('tablet-variant')).not.toBeInTheDocument()
      expect(screen.queryByTestId('desktop-variant')).not.toBeInTheDocument()
    })

    it('should render tablet variant on tablet device', () => {
      mockUseIsTablet.mockReturnValue(true)

      const ResponsiveComponent = createDeviceVariants({
        mobile: MobileVariant,
        tablet: TabletVariant,
        desktop: DesktopVariant,
      }) as React.FC

      render(<ResponsiveComponent />)

      expect(screen.getByTestId('tablet-variant')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-variant')).not.toBeInTheDocument()
      expect(screen.queryByTestId('desktop-variant')).not.toBeInTheDocument()
    })

    it('should render desktop variant on desktop device', () => {
      mockUseIsDesktop.mockReturnValue(true)

      const ResponsiveComponent = createDeviceVariants({
        mobile: MobileVariant,
        tablet: TabletVariant,
        desktop: DesktopVariant,
      }) as React.FC

      render(<ResponsiveComponent />)

      expect(screen.getByTestId('desktop-variant')).toBeInTheDocument()
      expect(screen.queryByTestId('mobile-variant')).not.toBeInTheDocument()
      expect(screen.queryByTestId('tablet-variant')).not.toBeInTheDocument()
    })

    it('should render fallback when no specific variant is available', () => {
      mockUseIsMobile.mockReturnValue(true)

      const ResponsiveComponent = createDeviceVariants({
        desktop: DesktopVariant,
        fallback: FallbackVariant,
      }) as React.FC

      render(<ResponsiveComponent />)

      expect(screen.getByTestId('fallback-variant')).toBeInTheDocument()
      expect(screen.queryByTestId('desktop-variant')).not.toBeInTheDocument()
    })

    it('should render nothing when no variants match and no fallback', () => {
      mockUseIsMobile.mockReturnValue(true)

      const ResponsiveComponent = createDeviceVariants({
        desktop: DesktopVariant,
      }) as React.FC

      const { container } = render(<ResponsiveComponent />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Real-World Scenario Tests', () => {
    it('should simulate SystemDiagram loading only on desktop', async () => {
      mockUseIsDesktop.mockReturnValue(true)

      // Simulate the real SystemDiagram component
      const MockSystemDiagram: React.FC = () => (
        <div data-testid="system-diagram">3D System Visualization</div>
      )

      const SystemDiagram = createConditionalComponent(
        () => Promise.resolve({ default: MockSystemDiagram }),
        {
          loadOn: 'desktop',
          fallback: () => (
            <div data-testid="system-diagram-fallback">
              View on desktop for interactive 3D system visualization
            </div>
          ),
        }
      )

      render(<SystemDiagram />)

      await waitFor(() => {
        expect(screen.getByTestId('system-diagram')).toBeInTheDocument()
      })
    })

    it('should show fallback message for SystemDiagram on mobile', () => {
      mockUseIsMobile.mockReturnValue(true)

      const MockSystemDiagram: React.FC = () => (
        <div data-testid="system-diagram">3D System Visualization</div>
      )

      const SystemDiagram = createConditionalComponent(
        () => Promise.resolve({ default: MockSystemDiagram }),
        {
          loadOn: 'desktop',
          fallback: () => (
            <div data-testid="system-diagram-fallback">
              View on desktop for interactive 3D system visualization
            </div>
          ),
        }
      )

      render(<SystemDiagram />)

      expect(screen.getByTestId('system-diagram-fallback')).toBeInTheDocument()
      expect(
        screen.getByText('View on desktop for interactive 3D system visualization')
      ).toBeInTheDocument()
      expect(screen.queryByTestId('system-diagram')).not.toBeInTheDocument()
    })

    it('should load VisionTimeline only on desktop and tablet', async () => {
      mockUseIsTablet.mockReturnValue(true)

      const MockVisionTimeline: React.FC = () => <div data-testid="vision-timeline">Timeline</div>

      const VisionTimeline = createConditionalComponent(
        () => Promise.resolve({ default: MockVisionTimeline }),
        { loadOn: ['desktop', 'tablet'] }
      )

      render(<VisionTimeline />)

      await waitFor(() => {
        expect(screen.getByTestId('vision-timeline')).toBeInTheDocument()
      })
    })

    it('should not load VisionTimeline on mobile', () => {
      mockUseIsMobile.mockReturnValue(true)

      const MockVisionTimeline: React.FC = () => <div data-testid="vision-timeline">Timeline</div>

      const VisionTimeline = createConditionalComponent(
        () => Promise.resolve({ default: MockVisionTimeline }),
        { loadOn: ['desktop', 'tablet'] }
      )

      render(<VisionTimeline />)

      expect(screen.queryByTestId('vision-timeline')).not.toBeInTheDocument()
    })
  })

  describe('Performance and Bundle Size Tests', () => {
    it('should not execute import function when device does not match', () => {
      mockUseIsMobile.mockReturnValue(true)

      const importFn = vi.fn(() => Promise.resolve({ default: HeavyDesktopComponent }))

      const ConditionalComponent = createConditionalComponent(importFn, {
        loadOn: 'desktop',
      })

      render(<ConditionalComponent />)

      // Import function should never be called on mobile
      expect(importFn).not.toHaveBeenCalled()
    })

    it('should execute import function only when device matches', async () => {
      mockUseIsDesktop.mockReturnValue(true)

      const importFn = vi.fn(() => Promise.resolve({ default: HeavyDesktopComponent }))

      const ConditionalComponent = createConditionalComponent(importFn, {
        loadOn: 'desktop',
      })

      render(<ConditionalComponent />)

      await waitFor(() => {
        expect(importFn).toHaveBeenCalledTimes(1)
      })
    })
  })
})

