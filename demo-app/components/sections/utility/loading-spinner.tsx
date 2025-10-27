'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface LoadingSpinnerProps {
  /** Loading message */
  message?: string
  /** Progress percentage (0-100) */
  progress?: number
  /** Show progress percentage */
  showProgress?: boolean
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg'
  /** Show in card container */
  showCard?: boolean
}

/**
 * LoadingSpinner - Centered spinner with message
 *
 * @example
 * ```tsx
 * <LoadingSpinner
 *   message="Loading your data..."
 *   progress={45}
 *   showProgress
 *   size="md"
 * />
 * ```
 */
export function LoadingSpinner({
  message = 'Loading...',
  progress,
  showProgress = false,
  size = 'md',
  showCard = true,
}: LoadingSpinnerProps) {
  const spinnerSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const content = (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {/* Spinner */}
      <Loader2
        className={`${spinnerSizes[size]} text-primary animate-spin mb-4`}
      />

      {/* Message */}
      <p className={`${textSizes[size]} font-medium text-foreground mb-2`}>
        {message}
      </p>

      {/* Progress */}
      {showProgress && progress !== undefined && (
        <div className="w-full max-w-xs mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )

  if (!showCard) {
    return <div className="w-full">{content}</div>
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="w-full">
      {content}
    </EnhancedCard>
  )
}
