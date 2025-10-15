/**
 * Documentation Page - Platform guides and API reference
 * Placeholder until comprehensive documentation is ready
 */

import React from 'react'
import { PlaceholderPage } from './PlaceholderPage'
import { FileText } from 'lucide-react'

export const DocumentationPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Documentation Coming Soon"
      description="Complete platform documentation, implementation guides, and API reference will be available here. For now, explore our interactive demo to see the platform in action."
      seoTitle="Documentation - Platform Guides | Future Marketing AI"
      seoDescription="Comprehensive documentation for Future Marketing AI platform. Implementation guides, API reference, and technical resources."
      icon={<FileText className="w-16 h-16 text-blue-400" />}
      launchEstimate="Q1 2026"
    />
  )
}

export default DocumentationPage
