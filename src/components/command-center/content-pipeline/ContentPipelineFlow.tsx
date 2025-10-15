/**
 * Content Pipeline Flow Component
 *
 * Visualizes the entire content production pipeline from research to publishing.
 */

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PipelineStage, type PipelineStageData } from './PipelineStage'
import { PipelineStageModal } from './PipelineStageModal'

export const ContentPipelineFlow: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStageData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleStageClick = (stage: PipelineStageData) => {
    setSelectedStage(stage)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Keep selectedStage for exit animation, clear after a delay
    setTimeout(() => setSelectedStage(null), 300)
  }
  // Mock pipeline data - in real app this would come from props/API
  const pipelineStages: PipelineStageData[] = useMemo(
    () => [
      {
        id: 'research',
        name: 'Research',
        icon: '🔍',
        count: 3,
        status: 'processing',
        color: '#B794F4',
        description: 'AI-powered market research & trend analysis',
        items: [
          {
            id: '1',
            title: 'Q2 Fashion Trends',
            platform: 'Instagram',
            timeInStage: '15 min',
          },
          {
            id: '2',
            title: 'Competitor Analysis',
            platform: 'Multi',
            timeInStage: '8 min',
          },
          {
            id: '3',
            title: 'Audience Insights',
            platform: 'TikTok',
            timeInStage: '3 min',
          },
        ],
      },
      {
        id: 'creation',
        name: 'Creation',
        icon: '✨',
        count: 5,
        status: 'active',
        color: '#00D4FF',
        description: 'AI content generation & optimization',
        items: [
          {
            id: '4',
            title: 'Summer Sale Post',
            platform: 'Facebook',
            timeInStage: '22 min',
          },
          {
            id: '5',
            title: 'Product Showcase Video',
            platform: 'TikTok',
            timeInStage: '45 min',
          },
          {
            id: '6',
            title: 'Newsletter Content',
            platform: 'Email',
            timeInStage: '12 min',
          },
          {
            id: '7',
            title: 'Brand Story Post',
            platform: 'LinkedIn',
            timeInStage: '5 min',
          },
          {
            id: '8',
            title: 'Carousel Design',
            platform: 'Instagram',
            timeInStage: '30 min',
          },
        ],
      },
      {
        id: 'review',
        name: 'Review',
        icon: '👁️',
        count: 4,
        status: 'active',
        color: '#FFD700',
        description: 'Human review & quality check',
        items: [
          {
            id: '9',
            title: 'Weekend Promotion',
            platform: 'Instagram',
            timeInStage: '1h 20m',
          },
          {
            id: '10',
            title: 'Client Testimonial',
            platform: 'LinkedIn',
            timeInStage: '45 min',
          },
          {
            id: '11',
            title: 'Product Launch',
            platform: 'Multi',
            timeInStage: '2h 10m',
          },
          {
            id: '12',
            title: 'Behind the Scenes',
            platform: 'TikTok',
            timeInStage: '30 min',
          },
        ],
      },
      {
        id: 'approval',
        name: 'Approval',
        icon: '✅',
        count: 2,
        status: 'processing',
        color: '#00FF88',
        description: 'Stakeholder approval workflow',
        items: [
          {
            id: '13',
            title: 'Partnership Announcement',
            platform: 'LinkedIn',
            timeInStage: '3h 45m',
          },
          {
            id: '14',
            title: 'New Collection Launch',
            platform: 'Instagram',
            timeInStage: '1h 15m',
          },
        ],
      },
      {
        id: 'scheduling',
        name: 'Scheduling',
        icon: '📅',
        count: 8,
        status: 'active',
        color: '#FF6B6B',
        description: 'Optimal timing & queue management',
        items: [
          {
            id: '15',
            title: 'Morning Motivation',
            platform: 'Instagram',
            timeInStage: 'Scheduled: Tomorrow 9:00',
          },
          {
            id: '16',
            title: 'Flash Sale Alert',
            platform: 'Facebook',
            timeInStage: 'Scheduled: Today 18:00',
          },
          {
            id: '17',
            title: 'Product Tutorial',
            platform: 'TikTok',
            timeInStage: 'Scheduled: Tomorrow 14:00',
          },
        ],
      },
      {
        id: 'publishing',
        name: 'Publishing',
        icon: '🚀',
        count: 1,
        status: 'processing',
        color: '#FF00FF',
        description: 'Multi-platform distribution',
        items: [
          {
            id: '18',
            title: 'Daily Inspiration Quote',
            platform: 'Multi',
            timeInStage: 'Publishing now...',
          },
        ],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        icon: '📊',
        count: 12,
        status: 'complete',
        color: '#00FF88',
        description: 'Performance tracking & insights',
        items: [
          {
            id: '19',
            title: 'Weekend Campaign',
            platform: 'Instagram',
            timeInStage: 'Completed 2h ago',
          },
          {
            id: '20',
            title: 'Product Feature',
            platform: 'LinkedIn',
            timeInStage: 'Completed 5h ago',
          },
        ],
      },
    ],
    []
  )

  const totalItems = pipelineStages.reduce((sum, stage) => sum + stage.count, 0)
  const activeItems = pipelineStages
    .filter((s) => s.status === 'processing' || s.status === 'active')
    .reduce((sum, stage) => sum + stage.count, 0)

  return (
    <div className="space-y-8">
      {/* Pipeline Overview Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Total in Pipeline</p>
          <p className="text-2xl font-bold text-accent-primary">{totalItems}</p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Active Now</p>
          <p className="text-2xl font-bold text-accent-secondary">{activeItems}</p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-success">12</p>
        </div>
      </motion.div>

      {/* Pipeline Flow Visualization */}
      <div className="relative">
        {/* Scrollable container for horizontal flow */}
        <div className="overflow-x-auto pb-6 hide-scrollbar">
          <div className="flex items-start min-w-max gap-0">
            {pipelineStages.map((stage, index) => (
              <PipelineStage
                key={stage.id}
                stage={stage}
                index={index}
                isLast={index === pipelineStages.length - 1}
                onClick={() => handleStageClick(stage)}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-4">
          <span className="text-xs text-white/50">← Scroll horizontally to see all stages →</span>
        </div>
      </div>

      {/* Pipeline Actions */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Pipeline operating smoothly</h4>
            <p className="text-sm text-white/70">
              All stages processing content efficiently with AI assistance
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-xl hover:bg-white/10 text-white font-semibold transition-all duration-300 border border-white/20">
              Add Content
            </button>
            <button className="px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary/80 text-white font-semibold transition-all duration-300">
              View Reports
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Stage Modal */}
      <PipelineStageModal stage={selectedStage} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default ContentPipelineFlow
