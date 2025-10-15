import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClock } from 'react-icons/fa'
import type { ScheduledContent } from '../../../types/scheduler'
import { PlatformIcon } from './PlatformIcon'

interface TimelineViewProps {
  scheduledContent: ScheduledContent[]
  onEventClick?: (content: ScheduledContent) => void
}

export const TimelineView: React.FC<TimelineViewProps> = ({ scheduledContent, onEventClick }) => {
  const [timeRange, setTimeRange] = useState<'3days' | '7days' | '14days'>('7days')

  // Group content by day
  const groupedByDay = useMemo(() => {
    const rangeMap = {
      '3days': 3,
      '7days': 7,
      '14days': 14,
    }
    const daysToShow = rangeMap[timeRange]

    const now = new Date()
    const groups: Array<{
      date: Date
      dateKey: string
      posts: ScheduledContent[]
    }> = []

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      date.setHours(0, 0, 0, 0)

      const dateKey = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

      const dayPosts = scheduledContent.filter((content) => {
        const contentDate = new Date(content.scheduledTime)
        return (
          contentDate.getDate() === date.getDate() &&
          contentDate.getMonth() === date.getMonth() &&
          contentDate.getFullYear() === date.getFullYear()
        )
      })

      groups.push({ date, dateKey, posts: dayPosts })
    }

    return groups
  }, [scheduledContent, timeRange])

  // Check if today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaClock className="text-violet-400" />
            Timeline View
          </h3>
          <p className="text-white/60">Chronological overview of your scheduled content</p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex gap-2 rounded-lg p-1">
          {[
            { id: '3days' as const, label: '3 Days' },
            { id: '7days' as const, label: '7 Days' },
            { id: '14days' as const, label: '14 Days' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setTimeRange(option.id)}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap font-medium ${
                timeRange === option.id
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {groupedByDay.map((day, dayIndex) => {
            const today = isToday(day.date)

            return (
              <motion.div
                key={day.dateKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: dayIndex * 0.05 }}
                className={`
                  rounded-xl border overflow-hidden
                  ${today ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10'}
                `}
              >
                {/* Day Header */}
                <div
                  className={`
                    px-6 py-4 flex items-center justify-between
                    ${today ? 'bg-indigo-500/10' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-white/90">{day.date.getDate()}</div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="text-sm text-white/60">
                        {day.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    {today && (
                      <div className="ml-3 px-3 py-1 bg-indigo-500 text-white text-sm font-semibold rounded-full">
                        Today
                      </div>
                    )}
                  </div>
                  <div className="text-white/60 font-semibold">
                    {day.posts.length} post{day.posts.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Posts Timeline */}
                {day.posts.length > 0 ? (
                  <div className="p-6 space-y-3">
                    {day.posts.map((post, postIndex) => {
                      const time = new Date(post.scheduledTime)
                      const isPast = time < new Date()

                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: postIndex * 0.03 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          onClick={() => onEventClick?.(post)}
                          className={`
                            relative flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer
                            ${isPast ? 'border-white/10 opacity-70' : 'border-white/20'}
                            hover:border-white/40 hover:bg-white/15
                          `}
                          style={{ borderLeftWidth: '4px', borderLeftColor: post.color }}
                        >
                          {/* Time */}
                          <div className="flex flex-col items-center min-w-[80px]">
                            <div className="text-2xl font-bold text-white">
                              {time.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })}
                            </div>
                            {isPast && (
                              <div className="text-xs text-emerald-400 font-semibold mt-1">
                                Published
                              </div>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="w-px h-12 bg-white/20"></div>

                          {/* Platform Icon */}
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${post.color}20` }}
                          >
                            <PlatformIcon platform={post.platform} size={24} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-lg mb-1 truncate">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs px-2 py-1 rounded-full text-white/80 capitalize">
                                {post.contentType}
                              </span>
                              <span className="text-xs text-white/60">
                                {post.caption && post.caption.slice(0, 60)}
                                {post.caption && post.caption.length > 60 && '...'}
                              </span>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-indigo-400 font-bold">{post.aiConfidence}%</div>
                              <div className="text-white/50 text-xs">AI Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-emerald-400 font-bold">
                                {(post.estimatedReach || 0) > 1000
                                  ? `${((post.estimatedReach || 0) / 1000).toFixed(1)}K`
                                  : post.estimatedReach}
                              </div>
                              <div className="text-white/50 text-xs">Est. Reach</div>
                            </div>
                          </div>

                          {/* Status indicator */}
                          {post.status === 'draft' && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold">
                              Draft
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-white/40">
                    <FaClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No posts scheduled for this day</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-white/60 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-500 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-emerald-500 rounded"></div>
          <span>Published</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/20 rounded border border-yellow-500/40"></div>
          <span>Draft</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="w-4 h-4" />
          <span>24-hour format</span>
        </div>
      </div>
    </div>
  )
}
