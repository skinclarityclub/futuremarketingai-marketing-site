/**
 * Case Studies Page - Customer success stories
 * Placeholder until we have real case studies from founding members
 */

import React from 'react'
import { PlaceholderPage } from './PlaceholderPage'
import { Award } from 'lucide-react'

export const CaseStudiesPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Case Studies Coming Soon"
      description="We're currently working with our founding members to document real results and success stories. Check back soon to see how businesses are transforming their marketing with autonomous AI."
      seoTitle="Case Studies | Future Marketing AI"
      seoDescription="Discover real results from businesses using Future Marketing AI. Customer success stories, ROI data, and implementation insights from our founding members."
      icon={<Award className="w-16 h-16 text-blue-400" />}
      launchEstimate="Q1 2026"
    />
  )
}

export default CaseStudiesPage
