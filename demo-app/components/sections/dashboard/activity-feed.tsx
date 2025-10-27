'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Plus, Edit, Trash2, MessageCircle, Filter } from 'lucide-react'

/**
 * Represents an activity in the feed
 */
export interface Activity {
  /** Unique identifier */
  id: string
  /** User who performed the activity */
  user: {
    /** User's name */
    name: string
    /** User's avatar URL (optional) */
    avatar?: string
  }
  /** Action performed */
  action: string
  /** Target of the action (optional) */
  target?: string
  /** Timestamp */
  timestamp: string
  /** Activity type */
  type: 'create' | 'update' | 'delete' | 'comment'
}

/**
 * Props for the ActivityFeed component
 */
export interface ActivityFeedProps {
  /** Array of activities */
  activities: Activity[]
  /** Callback when load more is clicked */
  onLoadMore?: () => void
  /** Callback when filter is applied */
  onFilter?: (type?: Activity['type']) => void
}

const typeConfig = {
  create: {
    icon: Plus,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  update: {
    icon: Edit,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  delete: {
    icon: Trash2,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  comment: {
    icon: MessageCircle,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
}

/**
 * ActivityFeed component displays a chronological feed of user activities.
 * Supports filtering by type and infinite scrolling.
 */
export function ActivityFeed({ activities, onLoadMore, onFilter }: ActivityFeedProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Activity Feed
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Recent team activity
          </p>
        </div>
        {onFilter && (
          <button
            className="btn-secondary flex items-center gap-2"
            aria-label="Filter activities"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const TypeIcon = typeConfig[activity.type].icon

          return (
            <div key={activity.id} className="relative flex gap-4">
              {/* Timeline line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-5 top-12 bottom-[-16px] w-px bg-border" />
              )}

              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${typeConfig[activity.type].bg} flex items-center justify-center z-10`}>
                <TypeIcon className={`w-5 h-5 ${typeConfig[activity.type].color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {activity.user.avatar ? (
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                        {activity.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user.name}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {activity.target && (
                        <>
                          {' '}
                          <span className="font-medium text-primary">{activity.target}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      {onLoadMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="btn-secondary"
          >
            Load More
          </button>
        </div>
      )}
    </EnhancedCard>
  )
}
