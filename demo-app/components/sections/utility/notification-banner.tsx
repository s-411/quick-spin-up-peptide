'use client'

import * as React from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface BannerAction {
  /** Action label */
  label: string
  /** Action callback */
  onClick: () => void
}

export interface NotificationBannerProps {
  /** Banner variant */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** Banner title */
  title: string
  /** Banner message */
  message?: string
  /** Action buttons */
  actions?: BannerAction[]
  /** Is dismissible */
  dismissible?: boolean
  /** Dismiss callback */
  onDismiss?: () => void
  /** Sticky positioning */
  sticky?: boolean
  /** Is visible */
  visible?: boolean
}

/**
 * NotificationBanner - Full-width banner notification
 *
 * @example
 * ```tsx
 * <NotificationBanner
 *   variant="warning"
 *   title="System Maintenance"
 *   message="Scheduled maintenance will occur on Sunday at 2 AM EST"
 *   actions={[
 *     { label: 'Learn More', onClick: () => {} },
 *     { label: 'Dismiss', onClick: () => {} }
 *   ]}
 *   dismissible
 *   sticky
 * />
 * ```
 */
export function NotificationBanner({
  variant = 'info',
  title,
  message,
  actions = [],
  dismissible = true,
  onDismiss,
  sticky = false,
  visible = true,
}: NotificationBannerProps) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  }

  const iconColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }

  const textColors = {
    success: 'text-green-900 dark:text-green-100',
    error: 'text-red-900 dark:text-red-100',
    warning: 'text-yellow-900 dark:text-yellow-100',
    info: 'text-blue-900 dark:text-blue-100',
  }

  const Icon = icons[variant]

  if (!visible) return null

  return (
    <div
      className={`
        ${sticky ? 'sticky top-0 z-50' : 'relative'}
        w-full border-b
        ${colors[variant]}
        ${textColors[variant]}
      `}
      role="alert"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${iconColors[variant]}`} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-base">{title}</p>
                {message && (
                  <p className="text-sm opacity-90 mt-1">{message}</p>
                )}
              </div>

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.onClick}
                      className="text-sm font-medium px-4 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dismiss Button */}
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
