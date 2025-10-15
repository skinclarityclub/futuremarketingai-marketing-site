/**
 * Campaign Orchestration Canvas
 *
 * Main container for campaign management with grid, bulk actions,
 * and detail modals.
 */

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CampaignGrid } from './CampaignGrid'
import { BulkActionsBar } from './BulkActionsBar'
import { CampaignModal } from './CampaignModal'
import type { CampaignData } from './CampaignCard'

interface CampaignOrchestrationCanvasProps {
  campaigns: CampaignData[]
}

export const CampaignOrchestrationCanvas: React.FC<CampaignOrchestrationCanvasProps> = ({
  campaigns: initialCampaigns,
}) => {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter campaigns based on status
  const filteredCampaigns = useMemo(() => {
    if (filterStatus === 'all') {
      return campaigns
    }
    return campaigns.filter((c) => c.status === filterStatus)
  }, [campaigns, filterStatus])

  // Campaign stats
  const stats = useMemo(() => {
    return {
      total: campaigns.length,
      active: campaigns.filter((c) => c.status === 'active').length,
      paused: campaigns.filter((c) => c.status === 'paused').length,
      draft: campaigns.filter((c) => c.status === 'draft').length,
      completed: campaigns.filter((c) => c.status === 'completed').length,
    }
  }, [campaigns])

  // Selection handlers
  const handleSelectCampaign = (id: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const handleClearSelection = () => {
    setSelectedCampaigns([])
  }

  // Campaign click handler
  const handleCampaignClick = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id)
    if (campaign) {
      setSelectedCampaign(campaign)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedCampaign(null), 300)
  }

  // Quick action handler
  const handleQuickAction = (id: string, action: string) => {
    console.log(`Quick action: ${action} on campaign ${id}`)

    if (action === 'pause') {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'paused' as const } : c))
      )
    } else if (action === 'resume') {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'active' as const } : c))
      )
    } else if (action === 'analytics') {
      handleCampaignClick(id)
    }
  }

  // Bulk action handlers
  const handlePauseSelected = () => {
    setCampaigns((prev) =>
      prev.map((c) =>
        selectedCampaigns.includes(c.id) && c.status === 'active'
          ? { ...c, status: 'paused' as const }
          : c
      )
    )
    setSelectedCampaigns([])
  }

  const handleResumeSelected = () => {
    setCampaigns((prev) =>
      prev.map((c) =>
        selectedCampaigns.includes(c.id) && c.status === 'paused'
          ? { ...c, status: 'active' as const }
          : c
      )
    )
    setSelectedCampaigns([])
  }

  const handleDuplicateSelected = () => {
    const newCampaigns = campaigns
      .filter((c) => selectedCampaigns.includes(c.id))
      .map((c) => ({
        ...c,
        id: `${c.id}-copy-${Date.now()}`,
        name: `${c.name} (Copy)`,
        status: 'draft' as const,
      }))
    setCampaigns((prev) => [...prev, ...newCampaigns])
    setSelectedCampaigns([])
  }

  const handleExportSelected = () => {
    console.log('Exporting campaigns:', selectedCampaigns)
    setSelectedCampaigns([])
  }

  const handleAdjustBudget = () => {
    console.log('Adjusting budget for campaigns:', selectedCampaigns)
    setSelectedCampaigns([])
  }

  const handleDeleteSelected = () => {
    setCampaigns((prev) => prev.filter((c) => !selectedCampaigns.includes(c.id)))
    setSelectedCampaigns([])
  }

  return (
    <div className="space-y-8">
      {/* Campaign Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatCard
          label="Total"
          value={stats.total}
          color="primary"
          isActive={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
        />
        <StatCard
          label="Active"
          value={stats.active}
          color="success"
          isActive={filterStatus === 'active'}
          onClick={() => setFilterStatus('active')}
        />
        <StatCard
          label="Paused"
          value={stats.paused}
          color="warning"
          isActive={filterStatus === 'paused'}
          onClick={() => setFilterStatus('paused')}
        />
        <StatCard
          label="Draft"
          value={stats.draft}
          color="white"
          isActive={filterStatus === 'draft'}
          onClick={() => setFilterStatus('draft')}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="secondary"
          isActive={filterStatus === 'completed'}
          onClick={() => setFilterStatus('completed')}
        />
      </motion.div>

      {/* Campaign Grid */}
      <CampaignGrid
        campaigns={filteredCampaigns}
        selectedCampaigns={selectedCampaigns}
        onSelectCampaign={handleSelectCampaign}
        onCampaignClick={handleCampaignClick}
        onQuickAction={handleQuickAction}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedCampaigns.length}
        onPauseSelected={handlePauseSelected}
        onResumeSelected={handleResumeSelected}
        onDuplicateSelected={handleDuplicateSelected}
        onExportSelected={handleExportSelected}
        onAdjustBudget={handleAdjustBudget}
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={handleClearSelection}
      />

      {/* Campaign Detail Modal */}
      <CampaignModal campaign={selectedCampaign} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'white'
  isActive: boolean
  onClick: () => void
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, isActive, onClick }) => {
  const colorClasses = {
    primary: isActive
      ? 'border-accent-primary bg-accent-primary/20 text-accent-primary'
      : 'text-accent-primary',
    secondary: isActive
      ? 'border-accent-secondary bg-accent-secondary/20 text-accent-secondary'
      : 'text-accent-secondary',
    success: isActive ? 'border-success bg-success/20 text-success' : 'text-success',
    warning: isActive ? 'border-warning bg-warning/20 text-warning' : 'text-warning',
    white: isActive ? 'border-white bg-white/20 text-white' : 'text-white',
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        p-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-200 cursor-pointer
        hover:scale-105
        ${isActive ? colorClasses[color] : 'border-white/10 hover:'}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <p className={`text-sm mb-1 ${isActive ? '' : 'text-white/60'}`}>{label}</p>
      <p className={`text-3xl font-bold ${isActive ? colorClasses[color] : 'text-white'}`}>
        {value}
      </p>
    </motion.button>
  )
}

export default CampaignOrchestrationCanvas
