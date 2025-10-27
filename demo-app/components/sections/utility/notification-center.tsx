'use client'

import * as React from 'react'
import { Bell, Check, Trash2, Mail, MailOpen } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface Notification {
  /** Notification ID */
  id: string
  /** Notification title */
  title: string
  /** Notification message */
  message: string
  /** Timestamp */
  timestamp: string
  /** Is read */
  read: boolean
  /** Notification type */
  type?: 'info' | 'success' | 'warning' | 'error'
}

export interface NotificationCenterProps {
  /** List of notifications */
  notifications: Notification[]
  /** Mark as read callback */
  onMarkAsRead?: (id: string) => void
  /** Mark all as read callback */
  onMarkAllAsRead?: () => void
  /** Delete notification callback */
  onDelete?: (id: string) => void
  /** Clear all notifications callback */
  onClearAll?: () => void
  /** Show only unread */
  showUnreadOnly?: boolean
  /** Max height */
  maxHeight?: string
}

/**
 * NotificationCenter - Notification list/center
 *
 * @example
 * ```tsx
 * <NotificationCenter
 *   notifications={notifications}
 *   onMarkAsRead={(id) => markAsRead(id)}
 *   onMarkAllAsRead={() => markAllAsRead()}
 *   onDelete={(id) => deleteNotification(id)}
 *   onClearAll={() => clearAll()}
 * />
 * ```
 */
export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  showUnreadOnly = false,
  maxHeight = '600px',
}: NotificationCenterProps) {
  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const typeColors = {
    info: 'bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500 text-blue-700 dark:text-blue-300',
    success: 'bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-500 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-500 text-red-700 dark:text-red-300',
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="w-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <div>
              <h3 className="text-lg font-heading font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div
        className="divide-y divide-border overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
              <Bell className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h4 className="text-lg font-heading font-semibold mb-2">
              {showUnreadOnly ? 'No unread notifications' : 'No notifications'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {showUnreadOnly
                ? "You're all caught up!"
                : "When you receive notifications, they'll appear here"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                p-4 transition-colors hover:bg-muted/30
                ${!notification.read ? 'bg-muted/10' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Read/Unread Indicator */}
                <div className="flex-shrink-0 mt-1">
                  {notification.read ? (
                    <MailOpen className="w-5 h-5 text-muted-foreground/50" />
                  ) : (
                    <Mail className="w-5 h-5 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4
                      className={`text-sm font-semibold ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Type Badge */}
                  {notification.type && (
                    <span
                      className={`
                        inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium border
                        ${typeColors[notification.type] || typeColors.info}
                      `}
                    >
                      {notification.type}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && onMarkAsRead && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(notification.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </EnhancedCard>
  )
}
