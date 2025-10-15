/**
 * Careers Page - Join the team
 * Placeholder until we have open positions
 */

import React from 'react'
import { PlaceholderPage } from './PlaceholderPage'
import { Briefcase } from 'lucide-react'

export const CareersPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Careers Coming Soon"
      description="We're building something special, and we'll soon be looking for talented people to join us. Interested in shaping the future of AI marketing? Stay tuned."
      seoTitle="Careers - Join Our Team | Future Marketing AI"
      seoDescription="Join Future Marketing AI and help build the future of autonomous marketing automation. Career opportunities coming soon."
      icon={<Briefcase className="w-16 h-16 text-blue-400" />}
      launchEstimate="2026"
    />
  )
}

export default CareersPage
