/**
 * Security Page - Security practices and compliance
 * Placeholder until comprehensive security documentation is ready
 */

import React from 'react'
import { PlaceholderPage } from './PlaceholderPage'
import { Shield } from 'lucide-react'

export const SecurityPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Security Documentation Coming Soon"
      description="We take security seriously. Detailed information about our security practices, data encryption, and compliance certifications will be available here soon."
      seoTitle="Security - Platform Security | Future Marketing AI"
      seoDescription="Learn about Future Marketing AI's security practices, data encryption, SOC2 compliance, and enterprise-grade security features."
      icon={<Shield className="w-16 h-16 text-green-400" />}
      launchEstimate="Q1 2026"
    />
  )
}

export default SecurityPage
