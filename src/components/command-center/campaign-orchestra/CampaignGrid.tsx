/**
 * Campaign Grid Component
 *
 * Responsive grid layout for campaign cards with support for
 * selection, filtering, and organization.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { CampaignCard, type CampaignData } from './CampaignCard'

interface CampaignGridProps {
  campaigns: CampaignData[]
  selectedCampaigns: string[]
  onSelectCampaign: (id: string) => void
  onCampaignClick: (id: string) => void
  onQuickAction: (id: string, action: string) => void
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({
  campaigns,
  selectedCampaigns,
  onSelectCampaign,
  onCampaignClick,
  onQuickAction,
}) => {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-bold text-white mb-2">No campaigns yet</h3>
        <p className="text-white/60">Create your first campaign to get started</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <CampaignCard
            campaign={campaign}
            isSelected={selectedCampaigns.includes(campaign.id)}
            onSelect={onSelectCampaign}
            onClick={onCampaignClick}
            onQuickAction={onQuickAction}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default CampaignGrid
