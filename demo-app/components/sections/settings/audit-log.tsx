'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Filter, Download, User, Clock, Activity } from 'lucide-react'

/**
 * Represents an audit log event
 */
export interface AuditEvent {
  /** Unique identifier for the event */
  id: string
  /** Timestamp of when the event occurred */
  timestamp: string
  /** User who performed the action */
  user: {
    /** User's name */
    name: string
    /** User's avatar URL (optional) */
    avatar?: string
  }
  /** Action performed */
  action: string
  /** Resource affected by the action */
  resource: string
  /** Additional details about the event */
  details?: string
  /** IP address of the user when action was performed */
  ipAddress?: string
}

/**
 * Props for the AuditLog component
 */
export interface AuditLogProps {
  /** Array of audit events to display */
  events: AuditEvent[]
  /** Callback when filter is applied */
  onFilter?: (filters: { user?: string; action?: string; dateRange?: [Date, Date] }) => void
  /** Callback when export is requested */
  onExport?: () => void
}

/**
 * AuditLog component displays a filterable activity feed of system events.
 * Provides audit trail for security and compliance purposes.
 */
export function AuditLog({ events, onFilter, onExport }: AuditLogProps) {
  const [showFilters, setShowFilters] = useState(false)

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Audit Log
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track all system activity and changes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="btn-secondary flex items-center gap-2"
              aria-label="Export logs"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Filters (Collapsible) */}
      {showFilters && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                User
              </label>
              <input
                type="text"
                placeholder="Filter by user..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Action
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm">
                <option value="">All actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Event Feed */}
      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="relative flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Timeline indicator */}
            {index !== events.length - 1 && (
              <div className="absolute left-[2.25rem] top-16 bottom-[-12px] w-px bg-border" />
            )}

            {/* Avatar */}
            <div className="flex-shrink-0">
              {event.user.avatar ? (
                <img
                  src={event.user.avatar}
                  alt={event.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {event.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{event.user.name}</span>
                    {' '}
                    <span className="text-muted-foreground">{event.action}</span>
                    {' '}
                    <span className="font-medium text-primary">{event.resource}</span>
                  </p>
                  {event.details && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.details}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(event.timestamp)}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                {event.ipAddress && (
                  <div className="flex items-center gap-1">
                    <span className="font-mono">{event.ipAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">No audit events found</p>
        </div>
      )}

      {/* Load More */}
      {events.length > 0 && (
        <div className="mt-6 text-center">
          <button className="btn-secondary">
            Load More Events
          </button>
        </div>
      )}
    </EnhancedCard>
  )
}
