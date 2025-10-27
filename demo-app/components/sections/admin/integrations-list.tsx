'use client'

import * as React from 'react'
import { Plug, Search, Plus, Settings, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface Integration {
  /** Unique integration ID */
  id: string
  /** Integration name */
  name: string
  /** Integration description */
  description: string
  /** Icon URL or component */
  icon?: string
  /** Connection status */
  status: 'connected' | 'disconnected' | 'error'
  /** Is integration enabled */
  enabled: boolean
  /** Last sync timestamp */
  lastSynced?: string
  /** Sync frequency */
  syncFrequency?: string
  /** Permission scopes */
  scopes?: string[]
}

export interface IntegrationsListProps {
  /** List of integrations */
  integrations: Integration[]
  /** Toggle enabled callback */
  onToggleEnabled?: (id: string, enabled: boolean) => void
  /** Configure integration callback */
  onConfigure?: (id: string) => void
  /** Connect integration callback */
  onConnect?: (id: string) => void
  /** Disconnect integration callback */
  onDisconnect?: (id: string) => void
  /** Add new integration callback */
  onAddIntegration?: () => void
  /** Is loading */
  isLoading?: boolean
}

/**
 * IntegrationsList - Manage third-party integrations
 *
 * @example
 * ```tsx
 * <IntegrationsList
 *   integrations={integrationsList}
 *   onToggleEnabled={(id, enabled) => toggleIntegration(id, enabled)}
 *   onConfigure={(id) => openConfig(id)}
 * />
 * ```
 */
export function IntegrationsList({
  integrations,
  onToggleEnabled,
  onConfigure,
  onConnect,
  onDisconnect,
  onAddIntegration,
  isLoading = false,
}: IntegrationsListProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'connected' | 'disconnected'>('all')

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'connected' && integration.status === 'connected') ||
      (statusFilter === 'disconnected' && integration.status !== 'connected')

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-500 dark:text-green-400'
      case 'disconnected':
        return 'text-gray-500 dark:text-gray-400'
      case 'error':
        return 'text-red-500 dark:text-red-400'
    }
  }

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            Connected
          </span>
        )
      case 'disconnected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
            <XCircle className="w-3 h-3" />
            Disconnected
          </span>
        )
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        )
    }
  }

  const formatLastSynced = (timestamp?: string) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Plug className="w-5 h-5 text-primary dark:text-primary/80" />
            <h3 className="text-lg font-heading font-bold">Integrations</h3>
          </div>
          <button onClick={onAddIntegration} className="btn-mm">
            <Plus className="w-4 h-4" />
            Add Integration
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('connected')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'connected'
                  ? 'bg-primary text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Connected
            </button>
            <button
              onClick={() => setStatusFilter('disconnected')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'disconnected'
                  ? 'bg-primary text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Disconnected
            </button>
          </div>
        </div>
      </EnhancedCard>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading integrations...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredIntegrations.length === 0 && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="text-center py-12">
            <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold mb-2">No integrations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first integration'}
            </p>
            {!searchQuery && (
              <button onClick={onAddIntegration} className="btn-mm">
                <Plus className="w-4 h-4" />
                Add Integration
              </button>
            )}
          </div>
        </EnhancedCard>
      )}

      {/* Integrations Grid */}
      {!isLoading && filteredIntegrations.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <EnhancedCard key={integration.id} tilt={false} glowEffect={false}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {integration.icon ? (
                      <img
                        src={integration.icon}
                        alt={integration.name}
                        className="w-10 h-10 rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Plug className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-heading font-bold">{integration.name}</h4>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>

                  {/* Enable Toggle */}
                  <button
                    onClick={() => onToggleEnabled?.(integration.id, !integration.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      integration.enabled ? 'bg-primary' : 'bg-muted'
                    }`}
                    role="switch"
                    aria-checked={integration.enabled}
                    disabled={integration.status !== 'connected'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        integration.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{integration.description}</p>

                {/* Meta Info */}
                {integration.status === 'connected' && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {integration.lastSynced && (
                      <div className="flex items-center justify-between">
                        <span>Last synced:</span>
                        <span className="font-medium">{formatLastSynced(integration.lastSynced)}</span>
                      </div>
                    )}
                    {integration.syncFrequency && (
                      <div className="flex items-center justify-between">
                        <span>Frequency:</span>
                        <span className="font-medium">{integration.syncFrequency}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  {integration.status === 'connected' ? (
                    <>
                      <button
                        onClick={() => onConfigure?.(integration.id)}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configure
                      </button>
                      <button
                        onClick={() => onDisconnect?.(integration.id)}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onConnect?.(integration.id)}
                      className="flex-1 btn-mm text-sm py-2"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      )}
    </div>
  )
}
