/**
 * Blog Page - Marketing insights and platform updates
 * Placeholder until blog content is ready
 */

import React from 'react'
import { PlaceholderPage } from './PlaceholderPage'
import { BookOpen } from 'lucide-react'

export const BlogPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Blog Coming Soon"
      description="We're preparing in-depth articles about AI marketing automation, implementation strategies, and industry insights. Subscribe to get notified when we publish."
      seoTitle="Blog - AI Marketing Insights | Future Marketing AI"
      seoDescription="Learn about AI marketing automation, autonomous marketing strategies, and platform updates from the Future Marketing AI team."
      icon={<BookOpen className="w-16 h-16 text-blue-400" />}
      launchEstimate="Q1 2026"
    />
  )
}

export default BlogPage
