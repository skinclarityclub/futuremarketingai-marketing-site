/**
 * useChartInteractivity Hook
 *
 * Provides reusable interactivity features for chart components:
 * - Legend toggle (show/hide data series)
 * - Data series visibility management
 * - Keyboard navigation support
 * - Touch gesture support preparation
 *
 * Usage:
 * ```tsx
 * const { visibleSeries, toggleSeries, isSeriesVisible, resetVisibility } =
 *   useChartInteractivity(['revenue', 'cost', 'profit']);
 * ```
 */

import { useState, useCallback } from 'react'

export interface UseChartInteractivityOptions {
  /** Initial series keys/ids */
  seriesKeys: string[]
  /** Initially hidden series (optional) */
  initiallyHidden?: string[]
  /** Callback when visibility changes */
  onVisibilityChange?: (visibleKeys: string[]) => void
}

export interface ChartInteractivityControls {
  /** Currently visible series keys */
  visibleSeries: Set<string>
  /** Toggle visibility of a specific series */
  toggleSeries: (key: string) => void
  /** Check if a series is currently visible */
  isSeriesVisible: (key: string) => boolean
  /** Reset all series to visible */
  resetVisibility: () => void
  /** Hide all series except one */
  showOnlySeries: (key: string) => void
  /** Get filtered data based on visible series */
  getVisibleSeriesKeys: () => string[]
}

/**
 * Hook for managing chart interactivity
 */
export const useChartInteractivity = ({
  seriesKeys,
  initiallyHidden = [],
  onVisibilityChange,
}: UseChartInteractivityOptions): ChartInteractivityControls => {
  // Initialize visible series (all except initially hidden)
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(() => {
    const initial = new Set(seriesKeys)
    initiallyHidden.forEach((key) => initial.delete(key))
    return initial
  })

  // Toggle a specific series visibility
  const toggleSeries = useCallback(
    (key: string) => {
      setVisibleSeries((prev) => {
        const newSet = new Set(prev)

        if (newSet.has(key)) {
          // Don't allow hiding all series
          if (newSet.size === 1) {
            return prev
          }
          newSet.delete(key)
        } else {
          newSet.add(key)
        }

        // Notify callback
        if (onVisibilityChange) {
          onVisibilityChange(Array.from(newSet))
        }

        return newSet
      })
    },
    [onVisibilityChange]
  )

  // Check if series is visible
  const isSeriesVisible = useCallback(
    (key: string) => {
      return visibleSeries.has(key)
    },
    [visibleSeries]
  )

  // Reset all to visible
  const resetVisibility = useCallback(() => {
    const allVisible = new Set(seriesKeys)
    setVisibleSeries(allVisible)

    if (onVisibilityChange) {
      onVisibilityChange(seriesKeys)
    }
  }, [seriesKeys, onVisibilityChange])

  // Show only one series
  const showOnlySeries = useCallback(
    (key: string) => {
      const singleSeries = new Set([key])
      setVisibleSeries(singleSeries)

      if (onVisibilityChange) {
        onVisibilityChange([key])
      }
    },
    [onVisibilityChange]
  )

  // Get array of visible keys
  const getVisibleSeriesKeys = useCallback(() => {
    return Array.from(visibleSeries)
  }, [visibleSeries])

  return {
    visibleSeries,
    toggleSeries,
    isSeriesVisible,
    resetVisibility,
    showOnlySeries,
    getVisibleSeriesKeys,
  }
}

/**
 * Helper: Filter chart data based on visible series
 */
export const filterChartData = <T extends Record<string, any>>(
  data: T[],
  visibleKeys: string[]
): T[] => {
  return data.map((item) => {
    const filtered: Record<string, any> = {}

    // Keep all non-data fields (labels, metadata, etc.)
    Object.keys(item).forEach((key) => {
      if (visibleKeys.includes(key) || typeof item[key] === 'string') {
        filtered[key] = item[key]
      }
    })

    return filtered as T
  })
}

export default useChartInteractivity
