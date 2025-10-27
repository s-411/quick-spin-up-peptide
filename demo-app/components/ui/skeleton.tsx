'use client'

import * as React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Skeleton variant */
  variant?: 'default' | 'pulse' | 'shimmer'
  /** Width (CSS value) */
  width?: string | number
  /** Height (CSS value) */
  height?: string | number
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | 'card'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'shimmer', width, height, rounded = 'md', style, ...props }, ref) => {
    const radiusMap = {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
      card: 'var(--radius-card)',
    }

    return (
      <div
        ref={ref}
        className={`
          ${variant === 'pulse' ? 'animate-pulse-custom bg-muted' : ''}
          ${variant === 'shimmer' ? 'skeleton' : ''}
          ${variant === 'default' ? 'bg-muted' : ''}
          ${className || ''}
        `}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          borderRadius: radiusMap[rounded],
          ...style,
        }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

// Preset skeleton shapes
export function SkeletonCard() {
  return (
    <div className="card-mm space-y-4">
      <Skeleton height={200} rounded="card" />
      <div className="space-y-2">
        <Skeleton height={20} width="60%" />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="85%" />
      </div>
      <div className="flex gap-2">
        <Skeleton height={36} width={100} rounded="full" />
        <Skeleton height={36} width={100} rounded="full" />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} rounded="full" />
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`cell-${rowIdx}-${colIdx}`} height={16} />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
