'use client'

import * as React from 'react'
import { Key, Plus, Copy, RefreshCw, Trash2, Eye, EyeOff, Calendar, Activity } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface ApiKey {
  /** Unique key ID */
  id: string
  /** Key name/label */
  name: string
  /** The actual API key */
  key: string
  /** Creation date */
  createdAt: string
  /** Last used date */
  lastUsed?: string
  /** Expiration date */
  expiresAt?: string
  /** Permission scopes */
  scopes: string[]
  /** Usage count */
  usageCount?: number
  /** Is key active */
  isActive: boolean
}

export interface Scope {
  id: string
  name: string
  description: string
}

export interface ApiKeyManagementProps {
  /** List of API keys */
  keys: ApiKey[]
  /** Create new key callback */
  onCreateKey?: (name: string, scopes: string[]) => void
  /** Revoke key callback */
  onRevokeKey?: (id: string) => void
  /** Regenerate key callback */
  onRegenerateKey?: (id: string) => void
  /** Copy key callback */
  onCopyKey?: (key: string) => void
  /** Available scopes */
  availableScopes?: Scope[]
  /** Is creating key */
  isCreating?: boolean
}

/**
 * ApiKeyManagement - Manage API keys and access tokens
 *
 * @example
 * ```tsx
 * <ApiKeyManagement
 *   keys={apiKeysList}
 *   onCreateKey={(name, scopes) => createKey(name, scopes)}
 *   onRevokeKey={(id) => revokeKey(id)}
 * />
 * ```
 */
export function ApiKeyManagement({
  keys,
  onCreateKey,
  onRevokeKey,
  onRegenerateKey,
  onCopyKey,
  availableScopes = [
    { id: 'read', name: 'Read', description: 'Read access to resources' },
    { id: 'write', name: 'Write', description: 'Create and update resources' },
    { id: 'delete', name: 'Delete', description: 'Delete resources' },
    { id: 'admin', name: 'Admin', description: 'Full administrative access' },
  ],
  isCreating = false,
}: ApiKeyManagementProps) {
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState('')
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([])
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(new Set())
  const [showRevokeConfirm, setShowRevokeConfirm] = React.useState<string | null>(null)

  const handleCreateKey = () => {
    if (newKeyName.trim() && selectedScopes.length > 0) {
      onCreateKey?.(newKeyName, selectedScopes)
      setNewKeyName('')
      setSelectedScopes([])
      setShowCreateForm(false)
    }
  }

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    )
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const maskKey = (key: string) => {
    return `${key.slice(0, 4)}${'•'.repeat(24)}${key.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-primary dark:text-primary/80" />
            <h3 className="text-lg font-heading font-bold">API Keys</h3>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-mm"
          >
            <Plus className="w-4 h-4" />
            Create New Key
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          API keys allow external applications to access your account. Keep them secure and never
          share them publicly.
        </p>
      </EnhancedCard>

      {/* Create Form */}
      {showCreateForm && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <h4 className="text-lg font-heading font-bold mb-4">Create New API Key</h4>

          <div className="space-y-4">
            <div>
              <label htmlFor="keyName" className="block text-sm font-medium mb-2">
                Key Name <span className="text-red-500">*</span>
              </label>
              <input
                id="keyName"
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose a descriptive name to identify this key
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Scopes <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {availableScopes.map((scope) => (
                  <label
                    key={scope.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedScopes.includes(scope.id)
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope.id)}
                      onChange={() => toggleScope(scope.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{scope.name}</p>
                      <p className="text-sm text-muted-foreground">{scope.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setNewKeyName('')
                  setSelectedScopes([])
                }}
                className="btn-secondary"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                className="btn-mm"
                disabled={isCreating || !newKeyName.trim() || selectedScopes.length === 0}
              >
                {isCreating ? 'Creating...' : 'Create API Key'}
              </button>
            </div>
          </div>
        </EnhancedCard>
      )}

      {/* Empty State */}
      {keys.length === 0 && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold mb-2">No API keys yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first API key to start integrating with external applications
            </p>
            <button onClick={() => setShowCreateForm(true)} className="btn-mm">
              <Plus className="w-4 h-4" />
              Create API Key
            </button>
          </div>
        </EnhancedCard>
      )}

      {/* Keys List */}
      {keys.length > 0 && (
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <EnhancedCard key={apiKey.id} tilt={false} glowEffect={false}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-heading font-bold">{apiKey.name}</h4>
                      {!apiKey.isActive && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                          Revoked
                        </span>
                      )}
                      {isExpired(apiKey.expiresAt) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {formatDate(apiKey.createdAt)}
                    </p>
                  </div>
                </div>

                {/* API Key Display */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 font-mono text-sm">
                  <code className="flex-1">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-1 hover:bg-background rounded"
                    title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onCopyKey?.(apiKey.key)}
                    className="p-1 hover:bg-background rounded"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {apiKey.lastUsed && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Last Used</p>
                      <p className="font-medium">{formatDate(apiKey.lastUsed)}</p>
                    </div>
                  )}
                  {apiKey.expiresAt && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Expires</p>
                      <p className="font-medium">{formatDate(apiKey.expiresAt)}</p>
                    </div>
                  )}
                  {apiKey.usageCount !== undefined && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">API Calls</p>
                      <p className="font-medium">{apiKey.usageCount.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Scopes</p>
                    <p className="font-medium">{apiKey.scopes.length} permission(s)</p>
                  </div>
                </div>

                {/* Scopes */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-1 rounded-md text-xs bg-muted capitalize"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {apiKey.isActive && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => onRegenerateKey?.(apiKey.id)}
                      className="btn-secondary text-sm py-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                    <button
                      onClick={() => setShowRevokeConfirm(apiKey.id)}
                      className="btn-secondary text-sm py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Revoke
                    </button>
                  </div>
                )}

                {/* Revoke Confirmation */}
                {showRevokeConfirm === apiKey.id && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium mb-3">
                      Are you sure you want to revoke this API key? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onRevokeKey?.(apiKey.id)
                          setShowRevokeConfirm(null)
                        }}
                        className="btn-mm bg-red-600 hover:bg-red-700 text-sm py-2"
                      >
                        Yes, Revoke Key
                      </button>
                      <button
                        onClick={() => setShowRevokeConfirm(null)}
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
    </div>
  )
}
