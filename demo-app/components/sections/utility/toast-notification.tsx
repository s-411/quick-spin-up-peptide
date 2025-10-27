'use client'

import * as React from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface ToastNotificationProps {
  /** Notification type */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** Notification title */
  title: string
  /** Notification message */
  message?: string
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number
  /** Close callback */
  onClose?: () => void
  /** Action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Show progress bar */
  showProgress?: boolean
  /** Is notification visible */
  visible?: boolean
}

/**
 * ToastNotification - Toast notification component
 *
 * @example
 * ```tsx
 * <ToastNotification
 *   type="success"
 *   title="Changes saved"
 *   message="Your settings have been updated successfully"
 *   duration={5000}
 *   onClose={() => setVisible(false)}
 *   action={{ label: 'Undo', onClick: () => {} }}
 *   showProgress
 *   visible
 * />
 * ```
 */
export function ToastNotification({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action,
  showProgress = false,
  visible = true,
}: ToastNotificationProps) {
  const [progress, setProgress] = React.useState(100)
  const timerRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    if (!visible || duration === 0) return

    const interval = 50
    const decrement = (interval / duration) * 100

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        if (next <= 0) {
          clearInterval(timerRef.current)
          onClose?.()
          return 0
        }
        return next
      })
    }, interval)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [duration, onClose, visible])

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
  }

  const iconColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }

  const progressColors = {
    success: 'bg-green-600 dark:bg-green-400',
    error: 'bg-red-600 dark:bg-red-400',
    warning: 'bg-yellow-600 dark:bg-yellow-400',
    info: 'bg-blue-600 dark:bg-blue-400',
  }

  const Icon = icons[type]

  if (!visible) return null

  return (
    <div
      className={`
        relative rounded-lg border shadow-lg p-4 min-w-[320px] max-w-md
        ${colors[type]}
        animate-in slide-in-from-top-5 fade-in duration-300
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          {message && (
            <p className="text-sm opacity-90 mt-1">{message}</p>
          )}

          {/* Action Button */}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium underline-offset-4 hover:underline mt-2"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all ease-linear ${progressColors[type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
