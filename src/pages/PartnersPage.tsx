/**
 * Partners Page - Integration partners and affiliates
 * Placeholder until partner program launches
 */

import React from 'react'
import { PlaceholderPage } from './PlaceholderPage'
import { Handshake } from 'lucide-react'

export const PartnersPage: React.FC = () => {
  return (
    <PlaceholderPage
      title="Partner Program Coming Soon"
      description="We're developing strategic partnerships with leading marketing technology providers. Interested in partnering with us? Get in touch."
      seoTitle="Partners - Integration Partners | Future Marketing AI"
      seoDescription="Partner with Future Marketing AI. Integration partners, affiliates, and strategic partnerships for autonomous marketing automation."
      icon={<Handshake className="w-16 h-16 text-blue-400" />}
      launchEstimate="2026"
    />
  )
}

export default PartnersPage
