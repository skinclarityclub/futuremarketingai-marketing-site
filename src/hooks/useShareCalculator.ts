import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { handleSilentError } from '../utils/errorHandling'

export interface CalculatorParams {
  teamSize: number
  avgSalary: number
  campaignsPerMonth: number
}

/**
 * useShareCalculator - Hook for URL-based calculator state sharing
 *
 * Features:
 * - Load calculator inputs from URL query params
 * - Generate shareable URLs with current values
 * - Sync URL with state changes (optional)
 */
export const useShareCalculator = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  /**
   * Load calculator values from URL params
   * Returns null if no params found
   */
  const loadFromURL = useCallback((): CalculatorParams | null => {
    const teamSize = searchParams.get('team')
    const avgSalary = searchParams.get('salary')
    const campaigns = searchParams.get('campaigns')

    if (!teamSize || !avgSalary || !campaigns) {
      return null
    }

    return {
      teamSize: Number(teamSize),
      avgSalary: Number(avgSalary),
      campaignsPerMonth: Number(campaigns),
    }
  }, [searchParams])

  /**
   * Generate shareable URL with current calculator values
   */
  const generateShareURL = useCallback((params: CalculatorParams): string => {
    const url = new URL(window.location.href)
    url.searchParams.set('team', params.teamSize.toString())
    url.searchParams.set('salary', params.avgSalary.toString())
    url.searchParams.set('campaigns', params.campaignsPerMonth.toString())
    return url.toString()
  }, [])

  /**
   * Update URL params without navigation
   */
  const updateURL = useCallback(
    (params: CalculatorParams, replace = true) => {
      const newParams = new URLSearchParams()
      newParams.set('team', params.teamSize.toString())
      newParams.set('salary', params.avgSalary.toString())
      newParams.set('campaigns', params.campaignsPerMonth.toString())

      setSearchParams(newParams, { replace })
    },
    [setSearchParams]
  )

  /**
   * Clear URL params
   */
  const clearURL = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  /**
   * Copy shareable URL to clipboard
   */
  const copyToClipboard = useCallback(
    async (params: CalculatorParams): Promise<boolean> => {
      try {
        const url = generateShareURL(params)
        await navigator.clipboard.writeText(url)
        return true
      } catch (error) {
        handleSilentError(error, {
          hook: 'useShareCalculator',
          action: 'copyToClipboard',
        })
        return false
      }
    },
    [generateShareURL]
  )

  /**
   * Share via Web Share API (if available)
   */
  const shareViaNavigator = useCallback(
    async (params: CalculatorParams): Promise<boolean> => {
      if (!navigator.share) {
        return false // Web Share API not supported
      }

      try {
        const url = generateShareURL(params)
        await navigator.share({
          title: 'FutureMarketingAI ROI Calculator',
          text: `Check out my ROI calculation: ${Math.round(((params.campaignsPerMonth * 4) / params.campaignsPerMonth) * 100)}% ROI!`,
          url,
        })
        return true
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // User cancelled, not an error
          return false
        }
        handleSilentError(error, {
          hook: 'useShareCalculator',
          action: 'shareViaNavigator',
        })
        return false
      }
    },
    [generateShareURL]
  )

  return {
    loadFromURL,
    generateShareURL,
    updateURL,
    clearURL,
    copyToClipboard,
    shareViaNavigator,
    hasURLParams: searchParams.has('team'),
  }
}

export default useShareCalculator
