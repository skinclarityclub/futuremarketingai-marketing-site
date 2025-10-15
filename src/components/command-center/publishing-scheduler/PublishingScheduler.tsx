import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaFileUpload, FaLightbulb } from 'react-icons/fa'
import { CalendarView } from './CalendarView'
import { TimelineView } from './TimelineView'
import { BulkScheduler } from './BulkScheduler'
import { OptimalTimingPanel } from './OptimalTimingPanel'
import { generateScheduledContent, generateOptimalTimeSlots } from '../../../data/mock'
import type { ScheduledContent } from '../../../types/scheduler'

type ViewType = 'calendar' | 'timeline' | 'bulk' | 'optimal'

export const PublishingScheduler: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('calendar')
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null)

  // Generate mock data (14 days with posts from all platforms daily)
  const scheduledContent = useMemo(() => generateScheduledContent(14), [])
  const optimalSlots = useMemo(() => generateOptimalTimeSlots(), [])

  const views: Array<{ id: ViewType; label: string; icon: React.ComponentType<any> }> = [
    { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt },
    { id: 'timeline', label: 'Timeline', icon: FaClock },
    { id: 'bulk', label: 'Bulk Upload', icon: FaFileUpload },
    { id: 'optimal', label: 'AI Timing', icon: FaLightbulb },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Publishing Scheduler</h2>
          <p className="text-xl text-white/70">
            Manage and optimize your content publishing schedule across all platforms
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl border border-white/10"
        >
          <div className="text-3xl font-bold text-indigo-400 mb-1">
            {scheduledContent.filter((c) => c.status === 'scheduled').length}
          </div>
          <div className="text-sm text-white/60">Scheduled Posts</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl border border-white/10"
        >
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {scheduledContent.filter((c) => c.status === 'published').length}
          </div>
          <div className="text-sm text-white/60">Published</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl border border-white/10"
        >
          <div className="text-3xl font-bold text-violet-400 mb-1">
            {scheduledContent.filter((c) => c.status === 'draft').length}
          </div>
          <div className="text-sm text-white/60">Drafts</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl border border-white/10"
        >
          <div className="text-3xl font-bold text-pink-400 mb-1">{optimalSlots.length}</div>
          <div className="text-sm text-white/60">Optimal Slots</div>
        </motion.div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 rounded-xl p-2 border border-white/10 overflow-x-auto">
        {views.map((view) => {
          const Icon = view.icon
          return (
            <motion.button
              key={view.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(view.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap font-medium
                ${
                  activeView === view.id
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{view.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Content Views */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'calendar' && (
          <CalendarView scheduledContent={scheduledContent} onEventClick={setSelectedContent} />
        )}

        {activeView === 'timeline' && (
          <TimelineView scheduledContent={scheduledContent} onEventClick={setSelectedContent} />
        )}

        {activeView === 'bulk' && <BulkScheduler />}

        {activeView === 'optimal' && (
          <OptimalTimingPanel
            optimalSlots={optimalSlots}
            onSelectSlot={(slot) => {
              console.log('Selected optimal slot:', slot)
            }}
          />
        )}
      </motion.div>

      {/* Content Detail Modal (optional) */}
      {selectedContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedContent(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-bg-surface to-bg-dark p-6 rounded-2xl border border-white/20 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">{selectedContent.title}</h3>
            <div className="space-y-3">
              <div>
                <span className="text-white/60 text-sm">Platform:</span>
                <div className="text-white font-semibold capitalize mt-1">
                  {selectedContent.platform}
                </div>
              </div>
              <div>
                <span className="text-white/60 text-sm">Scheduled Time:</span>
                <div className="text-white font-semibold mt-1">
                  {new Date(selectedContent.scheduledTime).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-white/60 text-sm">Content Type:</span>
                <div className="text-white font-semibold capitalize mt-1">
                  {selectedContent.contentType}
                </div>
              </div>
              {selectedContent.caption && (
                <div>
                  <span className="text-white/60 text-sm">Caption:</span>
                  <div className="text-white mt-1">{selectedContent.caption}</div>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <div className="flex-1 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <div className="text-sm text-white/60">AI Confidence</div>
                  <div className="text-xl font-bold text-indigo-400">
                    {selectedContent.aiConfidence}%
                  </div>
                </div>
                <div className="flex-1 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="text-sm text-white/60">Est. Reach</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {(selectedContent.estimatedReach || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedContent(null)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
