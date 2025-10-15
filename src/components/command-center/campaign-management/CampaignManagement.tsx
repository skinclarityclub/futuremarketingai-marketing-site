/**
 * Campaign Management - Unified Component
 *
 * Combines campaign launching and monitoring in one interface.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaList, FaRocket } from 'react-icons/fa'
import { CampaignOrchestrationCanvas } from '../campaign-orchestra'
import { CampaignLauncher } from '../../layer3-dashboard/CampaignLauncher'
import type { CampaignData } from '../campaign-orchestra'

interface CampaignManagementProps {
  campaigns: CampaignData[]
}

type ViewMode = 'monitor' | 'launch'

export const CampaignManagement: React.FC<CampaignManagementProps> = ({ campaigns }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('monitor')

  return (
    <div className="space-y-8">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Campaign Management</h2>
          <p className="text-white/60">Launch new campaigns and monitor active ones</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => setViewMode('monitor')}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm
              transition-all duration-300 flex items-center gap-2
              ${
                viewMode === 'monitor'
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaList />
            Monitor Campaigns
          </motion.button>

          <motion.button
            onClick={() => setViewMode('launch')}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm
              transition-all duration-300 flex items-center gap-2
              ${
                viewMode === 'launch'
                  ? 'bg-success text-white shadow-lg shadow-success/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRocket />
            Launch New Campaign
          </motion.button>
        </div>
      </div>

      {/* Content Area with Animated Transitions */}
      <AnimatePresence mode="wait">
        {viewMode === 'monitor' ? (
          <motion.div
            key="monitor"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CampaignOrchestrationCanvas campaigns={campaigns} />
          </motion.div>
        ) : (
          <motion.div
            key="launch"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Success notification after launch */}
            <motion.div
              className="mb-6 p-4 rounded-xl bg-success/20 border border-success/50 text-success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-semibold">
                💡 Tip: After launching, switch to "Monitor Campaigns" to track your new campaign
              </p>
            </motion.div>

            <CampaignLauncher />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Bar (always visible) */}
      <motion.div
        className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Active Campaigns</p>
          <p className="text-3xl font-bold text-accent-primary">
            {campaigns.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Total Campaigns</p>
          <p className="text-3xl font-bold text-white">{campaigns.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Avg ROI</p>
          <p className="text-3xl font-bold text-success">
            +{Math.round(campaigns.reduce((sum, c) => sum + c.metrics.roi, 0) / campaigns.length)}%
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default CampaignManagement
