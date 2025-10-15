import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'
import type { ScheduledContent } from '../../../types/scheduler'
import { PlatformIcon } from './PlatformIcon'

interface CalendarViewProps {
  scheduledContent: ScheduledContent[]
  onEventClick?: (content: ScheduledContent) => void
}

export const CalendarView: React.FC<CalendarViewProps> = ({ scheduledContent, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('week')
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

  // Calendar calculations
  const monthStart = useMemo(() => {
    const date = new Date(currentDate)
    date.setDate(1)
    return date
  }, [currentDate])

  const monthEnd = useMemo(() => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() + 1, 0)
    return date
  }, [currentDate])

  const startDate = useMemo(() => {
    const date = new Date(monthStart)
    const day = date.getDay()
    date.setDate(date.getDate() - day)
    return date
  }, [monthStart])

  const endDate = useMemo(() => {
    const date = new Date(monthEnd)
    const day = date.getDay()
    date.setDate(date.getDate() + (6 - day))
    return date
  }, [monthEnd])

  const days: Date[] = useMemo(() => {
    const daysList: Date[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      daysList.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return daysList
  }, [startDate, endDate])

  // Week view calculations
  const weekDays = useMemo(() => {
    if (view !== 'week') {
      return []
    }

    const weekStart = new Date(currentDate)
    const day = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - day) // Start from Sunday

    const weekList: Date[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      weekList.push(date)
    }
    return weekList
  }, [currentDate, view])

  const displayDays = view === 'week' ? weekDays : days

  const getEventsForDay = (date: Date) => {
    return scheduledContent.filter((content) => {
      const contentDate = new Date(content.scheduledTime)
      return (
        contentDate.getDate() === date.getDate() &&
        contentDate.getMonth() === date.getMonth() &&
        contentDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const getDayKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  const isDayExpanded = (date: Date) => {
    return expandedDays.has(getDayKey(date))
  }

  const toggleDayExpanded = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation()
    const dayKey = getDayKey(date)
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dayKey)) {
      newExpanded.delete(dayKey)
    } else {
      newExpanded.add(dayKey)
    }
    setExpandedDays(newExpanded)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaCalendarAlt className="text-indigo-400" />
            Calendar View
          </h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('prev')}
              className="p-2 hover:rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-white/70" />
            </motion.button>
            <div className="px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('next')}
              className="p-2 hover:rounded-lg transition-colors"
            >
              <FaChevronRight className="text-white/70" />
            </motion.button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 rounded-lg p-1">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg transition-all ${
              view === 'month'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg transition-all ${
              view === 'week'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl p-4 border border-white/10">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-white/60 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentDate.toISOString()}-${view}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-7 gap-2"
          >
            {displayDays.map((date, index) => {
              const events = getEventsForDay(date)
              const isTodayDate = isToday(date)
              const isCurrentMonthDate = view === 'week' ? true : isCurrentMonth(date)
              const expanded = isDayExpanded(date)
              const maxPreviewEvents = view === 'week' ? 4 : 2
              const hasMore = events.length > maxPreviewEvents

              return (
                <motion.div
                  key={index}
                  layout
                  className={`
                    ${expanded ? 'col-span-full' : ''} 
                    ${view === 'week' ? 'min-h-[200px]' : 'min-h-[100px]'} 
                    p-3 rounded-lg border transition-all
                    ${isTodayDate ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 '}
                    ${!isCurrentMonthDate ? 'opacity-40' : ''}
                    ${expanded ? 'border-white/20' : 'hover:border-white/30 hover:'}
                  `}
                >
                  {/* Day Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isTodayDate
                            ? 'text-indigo-400'
                            : isCurrentMonthDate
                              ? 'text-white'
                              : 'text-white/40'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {expanded && (
                        <span className="text-xs text-white/60">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {events.length > 0 && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                          {events.length}
                        </span>
                      )}
                      {hasMore && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleDayExpanded(date, e)}
                          className="p-1 hover:rounded transition-colors"
                        >
                          {expanded ? (
                            <FaChevronUp className="w-3 h-3 text-white/60" />
                          ) : (
                            <FaChevronDown className="w-3 h-3 text-white/60" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Events */}
                  <div
                    className={`space-y-1 ${expanded ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2' : ''}`}
                  >
                    <AnimatePresence mode="sync">
                      {(expanded ? events : events.slice(0, maxPreviewEvents)).map((event) => {
                        const time = new Date(event.scheduledTime)

                        return (
                          <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick?.(event)
                            }}
                            className={`
                              ${expanded ? 'p-3' : 'p-1.5'} 
                              rounded-lg hover:bg-white/10 transition-colors cursor-pointer border-l-2
                              ${expanded ? 'border-l-4' : ''}
                            `}
                            style={{ borderLeftColor: event.color }}
                          >
                            {expanded ? (
                              // Expanded view - detailed card
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0">
                                    <PlatformIcon platform={event.platform} size={20} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-semibold text-sm truncate">
                                      {event.title}
                                    </h4>
                                    <p className="text-white/60 text-xs line-clamp-2 mt-0.5">
                                      {event.caption}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1 text-white/70">
                                    <FaClock className="w-3 h-3" />
                                    <span className="font-mono">
                                      {time.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                      })}
                                    </span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full text-white/80 capitalize">
                                    {event.contentType}
                                  </span>
                                </div>

                                <div className="flex gap-3 pt-2 border-t border-white/10">
                                  <div className="flex-1 text-center">
                                    <div className="text-indigo-400 font-bold text-sm">
                                      {event.aiConfidence}%
                                    </div>
                                    <div className="text-white/50 text-xs">AI</div>
                                  </div>
                                  <div className="flex-1 text-center">
                                    <div className="text-emerald-400 font-bold text-sm">
                                      {(event.estimatedReach || 0) > 1000
                                        ? `${((event.estimatedReach || 0) / 1000).toFixed(1)}K`
                                        : event.estimatedReach}
                                    </div>
                                    <div className="text-white/50 text-xs">Reach</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Compact view
                              <div>
                                <div className="flex items-center gap-1">
                                  <PlatformIcon platform={event.platform} size={12} />
                                  <span className="text-white/90 truncate text-xs">
                                    {event.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5 text-white/50">
                                  <FaClock className="w-2.5 h-2.5" />
                                  <span className="text-xs">
                                    {time.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Show more indicator (collapsed view) */}
                  {!expanded && hasMore && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={(e) => toggleDayExpanded(date, e)}
                      className="w-full mt-2 text-xs text-indigo-400 hover:text-indigo-300 py-1 px-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <span>+{events.length - maxPreviewEvents} more posts</span>
                      <FaChevronDown className="w-3 h-3" />
                    </motion.button>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <FaChevronDown className="w-3 h-3" />
          <span>Click to expand day</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="w-3 h-3" />
          <span>24-hour time format</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-white/30"></div>
          <span>Click post for details</span>
        </div>
      </div>
    </div>
  )
}
