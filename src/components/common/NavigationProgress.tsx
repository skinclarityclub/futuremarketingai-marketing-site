import React from 'react'
import { useLocation } from 'react-router-dom'
import { ProgressIndicator } from './ProgressIndicator'

/**
 * NavigationProgress - Visual progress indicator for layer navigation
 *
 * Shows user's progress through the layered navigation:
 * Hero (0%) → Explorer (33%) → Dashboard (66%) → Calculator (100%)
 */
export const NavigationProgress: React.FC = () => {
  const location = useLocation()

  // Map routes to progress values
  const routeProgress: Record<string, number> = {
    '/': 0,
    '/explorer': 33,
    '/dashboard': 66,
    '/calculator': 100,
  }

  const progress = routeProgress[location.pathname] ?? 0

  // Determine color based on progress
  const getColor = () => {
    if (progress < 50) {
      return 'primary' as const
    }
    if (progress < 100) {
      return 'secondary' as const
    }
    return 'success' as const
  }

  // Get current layer name
  const getLayerName = () => {
    const labels: Record<string, string> = {
      '/': 'Hero',
      '/explorer': 'Explorer',
      '/dashboard': 'Dashboard',
      '/calculator': 'Calculator',
    }
    return labels[location.pathname] || 'Unknown'
  }

  return (
    <div className="w-full max-w-md">
      <ProgressIndicator
        value={progress}
        color={getColor()}
        showLabel
        label={`Navigation Progress - ${getLayerName()}`}
      />
    </div>
  )
}

export default NavigationProgress
