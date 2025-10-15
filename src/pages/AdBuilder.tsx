/**
 * Ad Builder Page - AI-Powered Ad Creation Studio
 *
 * Standalone page for creating professional video ads from a single photo
 */

import React from 'react'
import { usePageAnalytics } from '../hooks'
import { AIAdBuilderStudio } from '../components/command-center/ad-builder'

export const AdBuilder: React.FC = () => {
  // Track page analytics
  usePageAnalytics('AI Ad Builder')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <AIAdBuilderStudio />
      </div>
    </div>
  )
}

export default AdBuilder
