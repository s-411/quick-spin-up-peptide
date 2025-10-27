'use client'

import * as React from 'react'
import {
  Webhook,
  Plus,
  Play,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface WebhookData {
  /** Unique webhook ID */
  id: string
  /** Webhook URL */
  url: string
  /** Subscribed event types */
  events: string[]
  /** Optional secret for verification */
  secret?: string
  /** Is webhook active */
  isActive: boolean
  /** Creation date */
  createdAt: string
  /** Last triggered date */
  lastTriggered?: string
  /** Success rate percentage */
  successRate?: number
}

export interface WebhookDelivery {
  /** Unique delivery ID */
  id: string
  /** Associated webhook ID */
  webhookId: string
  /** Event that triggered webhook */
  event: string
  /** Delivery timestamp */
  timestamp: string
  /** Delivery status */
  status: 'success' | 'failed' | 'pending'
  /** HTTP response code */
  responseCode?: number
  /** Response time in ms */
  responseTime?: number
}

export interface EventType {
  id: string
  name: string
  description: string
  category: string
}

export interface WebhookSettingsProps {
  /** List of webhooks */
  webhooks: WebhookData[]
  /** Recent deliveries */
  deliveries?: WebhookDelivery[]
  /** Available event types */
  availableEvents?: EventType[]
  /** Add webhook callback */
  onAddWebhook?: (url: string, events: string[]) => void
  /** Update webhook callback */
  onUpdateWebhook?: (id: string, data: Partial<WebhookData>) => void
  /** Delete webhook callback */
  onDeleteWebhook?: (id: string) => void
  /** Test webhook callback */
  onTestWebhook?: (id: string) => void
  /** Retry delivery callback */
  onRetryDelivery?: (deliveryId: string) => void
  /** Is adding webhook */
  isAdding?: boolean
}

/**
 * WebhookSettings - Configure and manage webhooks
 *
 * @example
 * ```tsx
 * <WebhookSettings
 *   webhooks={webhooksList}
 *   deliveries={recentDeliveries}
 *   onAddWebhook={(url, events) => addWebhook(url, events)}
 * />
 * ```
 */
export function WebhookSettings({
  webhooks,
  deliveries = [],
  availableEvents = [
    { id: 'user.created', name: 'User Created', description: 'Triggered when a new user signs up', category: 'Users' },
    { id: 'user.updated', name: 'User Updated', description: 'Triggered when a user profile is updated', category: 'Users' },
    { id: 'payment.success', name: 'Payment Success', description: 'Triggered when a payment is completed', category: 'Payments' },
    { id: 'payment.failed', name: 'Payment Failed', description: 'Triggered when a payment fails', category: 'Payments' },
    { id: 'order.created', name: 'Order Created', description: 'Triggered when a new order is placed', category: 'Orders' },
    { id: 'order.shipped', name: 'Order Shipped', description: 'Triggered when an order is shipped', category: 'Orders' },
  ],
  onAddWebhook,
  onUpdateWebhook,
  onDeleteWebhook,
  onTestWebhook,
  onRetryDelivery,
  isAdding = false,
}: WebhookSettingsProps) {
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newWebhookUrl, setNewWebhookUrl] = React.useState('')
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>([])
  const [expandedWebhook, setExpandedWebhook] = React.useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null)

  const handleAddWebhook = () => {
    if (newWebhookUrl.trim() && selectedEvents.length > 0) {
      onAddWebhook?.(newWebhookUrl, selectedEvents)
      setNewWebhookUrl('')
      setSelectedEvents([])
      setShowAddForm(false)
    }
  }

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    )
  }

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const groupEventsByCategory = () => {
    const grouped: Record<string, EventType[]> = {}
    availableEvents.forEach((event) => {
      if (!grouped[event.category]) {
        grouped[event.category] = []
      }
      grouped[event.category].push(event)
    })
    return grouped
  }

  const getStatusColor = (status: WebhookDelivery['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-500 dark:text-green-400'
      case 'failed':
        return 'text-red-500 dark:text-red-400'
      case 'pending':
        return 'text-yellow-500 dark:text-yellow-400'
    }
  }

  const getStatusIcon = (status: WebhookDelivery['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Webhook className="w-5 h-5 text-primary dark:text-primary/80" />
            <h3 className="text-lg font-heading font-bold">Webhooks</h3>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-mm">
            <Plus className="w-4 h-4" />
            Add Webhook
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Webhooks allow your application to receive real-time notifications when events occur.
        </p>
      </EnhancedCard>

      {/* Add Form */}
      {showAddForm && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <h4 className="text-lg font-heading font-bold mb-4">Add New Webhook</h4>

          <div className="space-y-4">
            <div>
              <label htmlFor="webhookUrl" className="block text-sm font-medium mb-2">
                Webhook URL <span className="text-red-500">*</span>
              </label>
              <input
                id="webhookUrl"
                type="url"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
              {newWebhookUrl && !isValidUrl(newWebhookUrl) && (
                <p className="text-xs text-red-500 mt-1">URL must use HTTPS protocol</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Must be a valid HTTPS URL that can receive POST requests
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Events <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {Object.entries(groupEventsByCategory()).map(([category, events]) => (
                  <div key={category}>
                    <p className="text-sm font-medium mb-2">{category}</p>
                    <div className="space-y-2">
                      {events.map((event) => (
                        <label
                          key={event.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedEvents.includes(event.id)
                              ? 'border-primary bg-primary/10 dark:bg-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEvent(event.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{event.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewWebhookUrl('')
                  setSelectedEvents([])
                }}
                className="btn-secondary"
                disabled={isAdding}
              >
                Cancel
              </button>
              <button
                onClick={handleAddWebhook}
                className="btn-mm"
                disabled={
                  isAdding ||
                  !newWebhookUrl.trim() ||
                  !isValidUrl(newWebhookUrl) ||
                  selectedEvents.length === 0
                }
              >
                {isAdding ? 'Adding...' : 'Add Webhook'}
              </button>
            </div>
          </div>
        </EnhancedCard>
      )}

      {/* Empty State */}
      {webhooks.length === 0 && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="text-center py-12">
            <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold mb-2">No webhooks configured</h3>
            <p className="text-muted-foreground mb-6">
              Add your first webhook to start receiving event notifications
            </p>
            <button onClick={() => setShowAddForm(true)} className="btn-mm">
              <Plus className="w-4 h-4" />
              Add Webhook
            </button>
          </div>
        </EnhancedCard>
      )}

      {/* Webhooks List */}
      {webhooks.length > 0 && (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <EnhancedCard key={webhook.id} tilt={false} glowEffect={false}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded">
                        {webhook.url}
                      </code>
                      {webhook.successRate !== undefined && (
                        <span
                          className={`text-xs font-medium ${
                            webhook.successRate >= 95
                              ? 'text-green-500'
                              : webhook.successRate >= 80
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                        >
                          {webhook.successRate}% success
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created {formatDate(webhook.createdAt)}</span>
                      {webhook.lastTriggered && (
                        <span>Last triggered {formatDate(webhook.lastTriggered)}</span>
                      )}
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <button
                    onClick={() =>
                      onUpdateWebhook?.(webhook.id, { isActive: !webhook.isActive })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      webhook.isActive ? 'bg-primary' : 'bg-muted'
                    }`}
                    role="switch"
                    aria-checked={webhook.isActive}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        webhook.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Events */}
                <div>
                  <button
                    onClick={() =>
                      setExpandedWebhook(expandedWebhook === webhook.id ? null : webhook.id)
                    }
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                  >
                    {expandedWebhook === webhook.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {webhook.events.length} event(s)
                  </button>

                  {expandedWebhook === webhook.id && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="px-2 py-1 rounded-md text-xs bg-muted font-mono"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => onTestWebhook?.(webhook.id)}
                    className="btn-secondary text-sm py-2"
                  >
                    <Play className="w-4 h-4" />
                    Test
                  </button>
                  <button className="btn-secondary text-sm py-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(webhook.id)}
                    className="btn-secondary text-sm py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === webhook.id && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium mb-3">
                      Are you sure you want to delete this webhook? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onDeleteWebhook?.(webhook.id)
                          setShowDeleteConfirm(null)
                        }}
                        className="btn-mm bg-red-600 hover:bg-red-700 text-sm py-2"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="btn-secondary text-sm py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </EnhancedCard>
          ))}
        </div>
      )}

      {/* Recent Deliveries */}
      {deliveries.length > 0 && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <h4 className="text-lg font-heading font-bold mb-4">Recent Deliveries</h4>

          <div className="space-y-2">
            {deliveries.slice(0, 10).map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={getStatusColor(delivery.status)}>
                    {getStatusIcon(delivery.status)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium font-mono">{delivery.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(delivery.timestamp)}
                    </p>
                  </div>
                  {delivery.responseCode && (
                    <span className="text-xs font-mono bg-background px-2 py-1 rounded">
                      {delivery.responseCode}
                    </span>
                  )}
                  {delivery.responseTime && (
                    <span className="text-xs text-muted-foreground">{delivery.responseTime}ms</span>
                  )}
                </div>
                {delivery.status === 'failed' && (
                  <button
                    onClick={() => onRetryDelivery?.(delivery.id)}
                    className="ml-4 text-xs btn-secondary py-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                )}
              </div>
            ))}
          </div>
        </EnhancedCard>
      )}
    </div>
  )
}
