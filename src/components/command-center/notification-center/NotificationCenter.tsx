/**
 * Notification Center Component
 *
 * Floating drawer that displays real-time notifications and updates.
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBell } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'
import { NotificationItem, type Notification } from './NotificationItem'

export const NotificationCenter: React.FC = () => {
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Campaign Published Successfully',
      message: 'Your "Summer Sale 2024" campaign is now live on Instagram and Facebook.',
      timestamp: '2 min ago',
      isRead: false,
      icon: '🚀',
      actionLabel: 'View Campaign',
    },
    {
      id: '2',
      type: 'update',
      title: 'AI Optimization Complete',
      message: 'GPT-4 has optimized 12 post captions, improving engagement potential by 23%.',
      timestamp: '15 min ago',
      isRead: false,
      icon: '✨',
      actionLabel: 'Review Changes',
    },
    {
      id: '3',
      type: 'warning',
      title: 'Content Approval Pending',
      message: '4 posts are waiting for your review in the approval queue.',
      timestamp: '1 hour ago',
      isRead: false,
      icon: '👁️',
      actionLabel: 'Review Now',
    },
    {
      id: '4',
      type: 'info',
      title: 'Instagram API Sync Complete',
      message: 'Successfully synced 3 accounts. 124 new interactions recorded.',
      timestamp: '2 hours ago',
      isRead: true,
      actionLabel: 'View Details',
    },
    {
      id: '5',
      type: 'success',
      title: 'Weekly Report Ready',
      message: 'Your performance report for Week 23 is ready to view.',
      timestamp: '3 hours ago',
      isRead: true,
      actionLabel: 'Open Report',
    },
    {
      id: '6',
      type: 'update',
      title: 'New Feature Available',
      message: 'A/B testing for headlines is now available in the Campaign Launcher.',
      timestamp: '5 hours ago',
      isRead: true,
      icon: '🎉',
      actionLabel: 'Learn More',
    },
    {
      id: '7',
      type: 'warning',
      title: 'API Rate Limit Warning',
      message: 'Instagram API usage at 85%. Consider scheduling posts during off-peak hours.',
      timestamp: '6 hours ago',
      isRead: true,
      actionLabel: 'View Limits',
    },
    {
      id: '8',
      type: 'info',
      title: 'Content Generated',
      message: 'Claude has generated 5 new blog post drafts based on trending topics.',
      timestamp: 'Yesterday',
      isRead: true,
      actionLabel: 'Review Drafts',
    },
  ])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <>
      {/* Floating Notification Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-[90] w-14 h-14 rounded-full bg-accent-primary hover:bg-accent-primary/80 text-white shadow-2xl flex items-center justify-center transition-all duration-300 group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
        }}
      >
        <HiBell size={24} className="group-hover:animate-bounce" />
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-danger text-white text-xs font-bold flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md backdrop-blur-xl border-l border-white/10 shadow-2xl z-[96] overflow-hidden flex flex-col"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {t('notification_center.title')}
                    </h2>
                    <p className="text-sm text-white/60 mt-1">
                      {t(
                        unreadCount === 1
                          ? 'notification_center.unread_count'
                          : 'notification_center.unread_count_plural',
                        { count: unreadCount }
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all duration-300 group"
                  >
                    <span className="text-white text-xl group-hover:rotate-90 transition-transform duration-300">
                      ×
                    </span>
                  </button>
                </div>

                {/* Action Buttons */}
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex-1 px-4 py-2 rounded-lg hover:text-white text-sm font-medium transition-all duration-300 border border-white/10"
                      disabled={unreadCount === 0}
                    >
                      {t('notification_center.mark_all_read')}
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex-1 px-4 py-2 rounded-lg hover:text-white text-sm font-medium transition-all duration-300 border border-white/10"
                    >
                      {t('notification_center.clear_all')}
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        index={index}
                        onMarkAsRead={handleMarkAsRead}
                        onDismiss={handleDismiss}
                      />
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-6xl mb-4">🔔</div>
                      <p className="text-white/60">{t('notification_center.empty.title')}</p>
                      <p className="text-white/40 text-sm mt-2">
                        {t('notification_center.empty.subtitle')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default NotificationCenter
