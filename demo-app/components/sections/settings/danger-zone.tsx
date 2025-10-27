'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { AlertTriangle, UserX, Trash2, Download, ArrowRightLeft } from 'lucide-react'

/**
 * Props for the DangerZone component
 */
export interface DangerZoneProps {
  /** Callback when transfer ownership is clicked */
  onTransferOwnership?: () => void
  /** Callback when deactivate account is clicked */
  onDeactivateAccount?: () => void
  /** Callback when delete account is clicked */
  onDeleteAccount?: () => void
  /** Callback when export data is clicked */
  onExportData?: () => void
}

/**
 * DangerZone component displays critical account actions with safeguards.
 * Includes confirmation modals and verification steps for destructive actions.
 */
export function DangerZone({
  onTransferOwnership,
  onDeactivateAccount,
  onDeleteAccount,
  onExportData,
}: DangerZoneProps) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const actions = [
    {
      id: 'export',
      title: 'Export Your Data',
      description: 'Download a copy of all your data including projects, settings, and files.',
      icon: Download,
      buttonText: 'Export Data',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: onExportData,
      requiresConfirmation: false,
    },
    {
      id: 'transfer',
      title: 'Transfer Ownership',
      description: 'Transfer account ownership to another team member. You will lose admin access.',
      icon: ArrowRightLeft,
      buttonText: 'Transfer',
      buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
      onClick: onTransferOwnership,
      requiresConfirmation: true,
      confirmKeyword: 'TRANSFER',
    },
    {
      id: 'deactivate',
      title: 'Deactivate Account',
      description: 'Temporarily disable your account. You can reactivate it at any time by logging in again.',
      icon: UserX,
      buttonText: 'Deactivate',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      onClick: onDeactivateAccount,
      requiresConfirmation: true,
      confirmKeyword: 'DEACTIVATE',
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data. This action cannot be undone.',
      icon: Trash2,
      buttonText: 'Delete Account',
      buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
      onClick: onDeleteAccount,
      requiresConfirmation: true,
      confirmKeyword: 'DELETE',
      isDestructive: true,
    },
  ]

  const handleAction = (action: typeof actions[0]) => {
    if (action.requiresConfirmation) {
      setShowConfirm(action.id)
      setConfirmText('')
    } else {
      action.onClick?.()
    }
  }

  const handleConfirm = (action: typeof actions[0]) => {
    if (confirmText === action.confirmKeyword) {
      action.onClick?.()
      setShowConfirm(null)
      setConfirmText('')
    }
  }

  const handleCancel = () => {
    setShowConfirm(null)
    setConfirmText('')
  }

  const currentAction = actions.find(a => a.id === showConfirm)

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6 border-destructive">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="bg-destructive/10 rounded-lg p-2">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Irreversible and destructive actions
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
        <p className="text-sm text-destructive">
          <strong>Warning:</strong> Actions in this section are permanent or have significant consequences.
          Please proceed with caution and ensure you have backups of any important data.
        </p>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {actions.map((action) => {
          const ActionIcon = action.icon
          return (
            <div
              key={action.id}
              className={`border rounded-lg p-5 ${
                action.isDestructive
                  ? 'border-destructive bg-destructive/10'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`rounded-lg p-2 ${
                    action.isDestructive
                      ? 'bg-destructive/10'
                      : 'bg-muted'
                  }`}>
                    <ActionIcon className={`w-5 h-5 ${
                      action.isDestructive ? 'text-destructive' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAction(action)}
                  className={`${action.buttonClass} px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap`}
                  disabled={!action.onClick}
                  aria-label={action.buttonText}
                >
                  {action.buttonText}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && currentAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className={`rounded-lg p-2 ${
                currentAction.isDestructive
                  ? 'bg-destructive/10'
                  : 'bg-secondary/10'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  currentAction.isDestructive
                    ? 'text-destructive'
                    : 'text-secondary'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">
                  Confirm {currentAction.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action {currentAction.isDestructive ? 'cannot be undone' : 'requires confirmation'}.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-foreground mb-3">
                Type <strong className="font-mono text-destructive">{currentAction.confirmKeyword}</strong> to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={currentAction.confirmKeyword}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-destructive focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm(currentAction)}
                disabled={confirmText !== currentAction.confirmKeyword}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  confirmText === currentAction.confirmKeyword
                    ? currentAction.buttonClass
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </EnhancedCard>
  )
}
