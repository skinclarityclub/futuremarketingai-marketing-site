/**
 * Analytics Hooks
 *
 * Custom React hooks for common analytics tracking patterns
 */

import { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageLoad, trackEngagementTime, hotjarEvent, HotjarEvents } from '../utils/analytics'

/**
 * Track scroll depth milestones (25%, 50%, 75%, 100%)
 * Fires events when user reaches each milestone
 */
export const useScrollDepthTracking = () => {
  const milestones = useRef<Set<number>>(new Set())
  const location = useLocation()

  useEffect(() => {
    // Reset milestones when route changes
    milestones.current.clear()

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100

      // Check each milestone
      const checkpoints = [
        { threshold: 25, event: HotjarEvents.SCROLL_DEPTH_25 },
        { threshold: 50, event: HotjarEvents.SCROLL_DEPTH_50 },
        { threshold: 75, event: HotjarEvents.SCROLL_DEPTH_75 },
        { threshold: 100, event: HotjarEvents.SCROLL_DEPTH_100 },
      ]

      checkpoints.forEach(({ threshold, event }) => {
        if (scrollPercentage >= threshold && !milestones.current.has(threshold)) {
          milestones.current.add(threshold)
          hotjarEvent(event)

          if (import.meta.env.DEV) {
            console.log(`📊 Scroll Depth: ${threshold}%`)
          }
        }
      })
    }

    // Throttle scroll events (max once per 500ms)
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })

    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [location.pathname])
}

/**
 * Track time spent on page
 * Fires events at 30s and 60s milestones
 *
 * @param pageName - Name of the current page for tracking
 */
export const useEngagementTimeTracking = (pageName: string) => {
  const startTime = useRef<number>(Date.now())
  const milestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    startTime.current = Date.now()
    milestones.current.clear()

    const checkInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime.current) / 1000)

      // 30 second milestone
      if (elapsedSeconds >= 30 && !milestones.current.has(30)) {
        milestones.current.add(30)
        hotjarEvent(HotjarEvents.TIME_ON_PAGE_30S)
        trackEngagementTime(pageName, 30)

        if (import.meta.env.DEV) {
          console.log(`📊 Engagement Time: 30s on ${pageName}`)
        }
      }

      // 60 second milestone
      if (elapsedSeconds >= 60 && !milestones.current.has(60)) {
        milestones.current.add(60)
        hotjarEvent(HotjarEvents.TIME_ON_PAGE_60S)
        trackEngagementTime(pageName, 60)

        if (import.meta.env.DEV) {
          console.log(`📊 Engagement Time: 60s on ${pageName}`)
        }
      }

      // Stop after 60s milestone
      if (elapsedSeconds >= 60) {
        clearInterval(checkInterval)
      }
    }, 1000) // Check every second

    return () => {
      clearInterval(checkInterval)

      // Track final engagement time on unmount
      const finalTime = Math.floor((Date.now() - startTime.current) / 1000)
      if (finalTime > 0) {
        trackEngagementTime(pageName, finalTime)
      }
    }
  }, [pageName])
}

/**
 * Track page load event
 * Automatically fires when component mounts
 *
 * @param pageName - Name of the page being loaded
 */
export const usePageLoadTracking = (pageName: string) => {
  useEffect(() => {
    trackPageLoad(pageName)
    hotjarEvent(HotjarEvents.PAGE_LOAD)

    if (import.meta.env.DEV) {
      console.log(`📊 Page Load: ${pageName}`)
    }
  }, [pageName])
}

/**
 * Combined analytics hook
 * Tracks page load, scroll depth, and engagement time
 *
 * @param pageName - Name of the page for tracking
 * @param options - Optional configuration
 */
export const usePageAnalytics = (
  pageName: string,
  options: {
    trackScroll?: boolean
    trackEngagement?: boolean
  } = {}
) => {
  const { trackScroll: _trackScroll = true, trackEngagement: _trackEngagement = true } = options

  // Track page load
  usePageLoadTracking(pageName)

  // Track scroll depth - hooks must be called unconditionally
  useScrollDepthTracking()

  // Track engagement time - hooks must be called unconditionally
  useEngagementTimeTracking(pageName)

  // TODO: Implement conditional activation inside the hooks themselves if needed
}

/**
 * Track when a section/element comes into view
 * Uses Intersection Observer API
 *
 * @param sectionName - Name of the section being viewed
 * @param options - Intersection Observer options
 */
export const useViewTracking = (
  sectionName: string,
  options: IntersectionObserverInit = { threshold: 0.5 }
) => {
  const hasTracked = useRef(false)

  const trackView = useCallback(() => {
    if (!hasTracked.current) {
      hasTracked.current = true
      hotjarEvent(`${sectionName}_view`)

      if (import.meta.env.DEV) {
        console.log(`📊 Section View: ${sectionName}`)
      }
    }
  }, [sectionName])

  const elementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackView()
            observer.disconnect()
          }
        })
      }, options)

      observer.observe(node)

      return () => {
        observer.disconnect()
      }
    },
    [trackView, options]
  )

  return elementRef
}
