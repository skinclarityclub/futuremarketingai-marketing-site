/**
 * Notification Item Component
 *
 * Individual notification card in the notification center.
 */

import React from 'react'
import { motion } from 'framer-motion'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'update'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  icon?: string
  actionLabel?: string
  actionUrl?: string
}

interface NotificationItemProps {
  notification: Notification
  index: number
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  index,
  onMarkAsRead,
  onDismiss,
}) => {
  const getTypeColor = () => {
    switch (notification.type) {
      case 'success':
        return '#00FF88'
      case 'warning':
        return '#FFD700'
      case 'error':
        return '#FF6B6B'
      case 'info':
        return '#00D4FF'
      case 'update':
        return '#B794F4'
      default:
        return '#FFFFFF50'
    }
  }

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠'
      case 'error':
        return '✕'
      case 'info':
        return 'ℹ'
      case 'update':
        return '↻'
      default:
        return '•'
    }
  }

  return (
    <motion.div
      className={`relative p-4 rounded-xl border transition-all duration-300 group ${
        notification.isRead ? 'border-white/10' : 'border-white/20'
      }`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: getTypeColor() }}
        />
      )}

      <div className="flex items-start gap-3 pl-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: `${getTypeColor()}20`,
            color: getTypeColor(),
          }}
        >
          {notification.icon || getTypeIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
            <span className="text-xs text-white/50 flex-shrink-0">{notification.timestamp}</span>
          </div>
          <p className="text-xs text-white/70 mb-2">{notification.message}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {notification.actionLabel && (
              <button
                className="text-xs font-medium px-3 py-1 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: `${getTypeColor()}20`,
                  color: getTypeColor(),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${getTypeColor()}30`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${getTypeColor()}20`
                }}
              >
                {notification.actionLabel}
              </button>
            )}
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                Mark as read
              </button>
            )}
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-xs font-medium text-white/40 hover:text-white/80 transition-colors ml-auto opacity-0 group-hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NotificationItem
