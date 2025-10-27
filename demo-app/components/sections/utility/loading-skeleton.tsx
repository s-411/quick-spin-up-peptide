'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface LoadingSkeletonProps {
  /** Skeleton variant */
  variant?: 'card' | 'list' | 'table' | 'text'
  /** Number of skeleton items */
  count?: number
  /** Number of text lines (for text variant) */
  lines?: number
  /** Show avatar/image placeholder */
  showAvatar?: boolean
  /** Show image placeholder */
  showImage?: boolean
}

/**
 * LoadingSkeleton - Content placeholder skeletons
 *
 * @example
 * ```tsx
 * <LoadingSkeleton
 *   variant="card"
 *   count={3}
 *   showImage
 * />
 * ```
 */
export function LoadingSkeleton({
  variant = 'card',
  count = 3,
  lines = 3,
  showAvatar = false,
  showImage = false,
}: LoadingSkeletonProps) {
  const shimmerClass =
    'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]'

  const renderCardSkeleton = () => (
    <EnhancedCard tilt={false} glowEffect={false} className="overflow-hidden">
      {showImage && (
        <div className={`w-full h-48 ${shimmerClass}`} />
      )}
      <div className="p-6 space-y-4">
        <div className={`h-6 w-3/4 rounded ${shimmerClass}`} />
        <div className="space-y-2">
          <div className={`h-4 w-full rounded ${shimmerClass}`} />
          <div className={`h-4 w-5/6 rounded ${shimmerClass}`} />
        </div>
        <div className="flex gap-2 pt-2">
          <div className={`h-8 w-20 rounded-full ${shimmerClass}`} />
          <div className={`h-8 w-20 rounded-full ${shimmerClass}`} />
        </div>
      </div>
    </EnhancedCard>
  )

  const renderListSkeleton = () => (
    <EnhancedCard tilt={false} glowEffect={false}>
      <div className="p-4 flex items-center gap-4">
        {showAvatar && (
          <div className={`w-12 h-12 rounded-full flex-shrink-0 ${shimmerClass}`} />
        )}
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-3/4 rounded ${shimmerClass}`} />
          <div className={`h-3 w-1/2 rounded ${shimmerClass}`} />
        </div>
        <div className={`h-8 w-16 rounded ${shimmerClass}`} />
      </div>
    </EnhancedCard>
  )

  const renderTableSkeleton = () => (
    <EnhancedCard tilt={false} glowEffect={false} className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex gap-4 pb-4 border-b border-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-4 flex-1 rounded ${shimmerClass}`} />
          ))}
        </div>
        {/* Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="flex gap-4 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-4 flex-1 rounded ${shimmerClass}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </EnhancedCard>
  )

  const renderTextSkeleton = () => (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={`h-4 rounded ${shimmerClass}`}
          style={{
            width: idx === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  )

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return renderCardSkeleton()
      case 'list':
        return renderListSkeleton()
      case 'table':
        return renderTableSkeleton()
      case 'text':
        return renderTextSkeleton()
      default:
        return renderCardSkeleton()
    }
  }

  if (variant === 'table') {
    return renderSkeleton()
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}
