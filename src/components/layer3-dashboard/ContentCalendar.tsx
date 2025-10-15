import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GlassCard, Button } from '../common'

interface ContentItem {
  id: number
  title: string
  platform: 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'TikTok' | 'YouTube'
  date: string
  time: string
  status: 'scheduled' | 'published' | 'draft'
}

const platformColors = {
  Facebook: 'bg-blue-500/20 border-blue-500 text-blue-400',
  Instagram: 'bg-pink-500/20 border-pink-500 text-pink-400',
  LinkedIn: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
  Twitter: 'bg-sky-500/20 border-sky-500 text-sky-400',
  TikTok: 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400',
  YouTube: 'bg-red-500/20 border-red-500 text-red-400',
}

export const ContentCalendar: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common'])
  const [view, setView] = useState<'week' | 'month'>('week')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'Facebook',
    'Instagram',
    'LinkedIn',
    'Twitter',
    'TikTok',
    'YouTube',
  ])

  // Mock content data
  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: 'Product Launch Post',
      platform: 'Facebook',
      date: '2024-01-15',
      time: '10:00',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Behind the Scenes',
      platform: 'Instagram',
      date: '2024-01-15',
      time: '14:00',
      status: 'scheduled',
    },
    {
      id: 3,
      title: 'Industry Insights',
      platform: 'LinkedIn',
      date: '2024-01-16',
      time: '09:00',
      status: 'scheduled',
    },
    {
      id: 4,
      title: 'Customer Testimonial',
      platform: 'Twitter',
      date: '2024-01-16',
      time: '15:00',
      status: 'scheduled',
    },
    {
      id: 5,
      title: 'Tutorial Video',
      platform: 'YouTube',
      date: '2024-01-17',
      time: '12:00',
      status: 'scheduled',
    },
    {
      id: 6,
      title: 'Dance Challenge',
      platform: 'TikTok',
      date: '2024-01-17',
      time: '18:00',
      status: 'scheduled',
    },
    {
      id: 7,
      title: 'Weekly Recap',
      platform: 'Facebook',
      date: '2024-01-18',
      time: '11:00',
      status: 'draft',
    },
    {
      id: 8,
      title: 'Product Showcase',
      platform: 'Instagram',
      date: '2024-01-18',
      time: '16:00',
      status: 'scheduled',
    },
    {
      id: 9,
      title: 'Team Spotlight',
      platform: 'LinkedIn',
      date: '2024-01-19',
      time: '10:00',
      status: 'scheduled',
    },
    {
      id: 10,
      title: 'Flash Sale',
      platform: 'Twitter',
      date: '2024-01-19',
      time: '14:00',
      status: 'scheduled',
    },
  ]

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  // Filter content by selected platforms
  const filteredContent = contentItems.filter((item) => selectedPlatforms.includes(item.platform))

  // Group content by date
  const contentByDate = filteredContent.reduce(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = []
      }
      acc[item.date].push(item)
      return acc
    },
    {} as Record<string, ContentItem[]>
  )

  // Generate week days
  const weekDays = [
    t('dashboard:content_calendar.days.mon'),
    t('dashboard:content_calendar.days.tue'),
    t('dashboard:content_calendar.days.wed'),
    t('dashboard:content_calendar.days.thu'),
    t('dashboard:content_calendar.days.fri'),
    t('dashboard:content_calendar.days.sat'),
    t('dashboard:content_calendar.days.sun'),
  ]
  const weekDates = [
    '2024-01-15',
    '2024-01-16',
    '2024-01-17',
    '2024-01-18',
    '2024-01-19',
    '2024-01-20',
    '2024-01-21',
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-text-primary">
          {t('dashboard:content_calendar.title')}
        </h2>

        <div className="flex gap-3">
          <Button
            variant={view === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            {t('dashboard:content_calendar.view.week')}
          </Button>
          <Button
            variant={view === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
          >
            {t('dashboard:content_calendar.view.month')}
          </Button>
        </div>
      </div>

      {/* Platform Filter */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-white/90 font-semibold">
            {t('dashboard:content_calendar.filter.by_platform')}
          </span>
          {Object.keys(platformColors).map((platform) => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
                selectedPlatforms.includes(platform)
                  ? platformColors[platform as keyof typeof platformColors]
                  : 'border-white/10 text-white/80 hover:border-accent-primary/30'
              }`}
              style={
                !selectedPlatforms.includes(platform)
                  ? { background: 'rgba(0, 0, 0, 0.3)' }
                  : undefined
              }
            >
              {platform}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Week View Calendar */}
      {view === 'week' && (
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-text-primary">
              {t('dashboard:content_calendar.week_of', { range: 'January 15-21, 2024' })}
            </h3>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {/* Day Headers */}
            {weekDays.map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-white/90 font-semibold mb-2">{day}</div>
                <div className="text-white/80 text-sm mb-3">
                  {new Date(weekDates[index]).getDate()}
                </div>
              </div>
            ))}

            {/* Calendar Days */}
            {weekDates.map((date) => (
              <div
                key={date}
                className="min-h-[200px] rounded-lg border border-white/10 p-2"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="space-y-2">
                  {contentByDate[date]?.map((item) => (
                    <motion.div
                      key={item.id}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.1}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, zIndex: 50, rotate: 2 }}
                      className={`p-3 rounded-lg border cursor-move ${
                        platformColors[item.platform]
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">{item.platform}</div>
                      <div className="text-text-primary text-sm font-medium mb-1">{item.title}</div>
                      <div className="text-white/70 text-xs">{item.time}</div>
                      {item.status === 'draft' && (
                        <div className="text-xs text-yellow-500 mt-1">
                          {t('dashboard:content_calendar.status.draft')}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Month View */}
      {view === 'month' && (
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-text-primary">January 2024</h3>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {/* Day Headers */}
            {[
              t('dashboard:content_calendar.days.sun'),
              t('dashboard:content_calendar.days.mon'),
              t('dashboard:content_calendar.days.tue'),
              t('dashboard:content_calendar.days.wed'),
              t('dashboard:content_calendar.days.thu'),
              t('dashboard:content_calendar.days.fri'),
              t('dashboard:content_calendar.days.sat'),
            ].map((day) => (
              <div key={day} className="text-center text-white/90 font-semibold py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month start */}
            {[...Array(1)].map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px]" />
            ))}

            {/* Calendar days */}
            {[...Array(31)].map((_, i) => {
              const day = i + 1
              const date = `2024-01-${day.toString().padStart(2, '0')}`
              const dayContent = contentByDate[date] || []

              return (
                <div
                  key={day}
                  className="min-h-[120px] rounded-lg border border-white/10 p-2"
                  style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="text-white/80 text-sm mb-2">{day}</div>
                  <div className="space-y-1">
                    {dayContent.slice(0, 3).map((item) => (
                      <motion.div
                        key={item.id}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.1}
                        whileHover={{ scale: 1.05 }}
                        whileDrag={{ scale: 1.1, zIndex: 50, rotate: 3 }}
                        className={`p-1.5 rounded text-xs border cursor-move ${
                          platformColors[item.platform]
                        }`}
                      >
                        {item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title}
                      </motion.div>
                    ))}
                    {dayContent.length > 3 && (
                      <div className="text-xs text-white/70">
                        {t('dashboard:content_calendar.more_items', {
                          count: dayContent.length - 3,
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}

      {/* Legend */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-white/90 font-semibold">
            {t('dashboard:content_calendar.legend')}
          </span>
          {Object.entries(platformColors).map(([platform, colorClass]) => (
            <div key={platform} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border ${colorClass}`} />
              <span className="text-white/80 text-sm">{platform}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default ContentCalendar
