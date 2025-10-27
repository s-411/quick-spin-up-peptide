'use client'

import * as React from 'react'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value?: number
  /** Progress variant */
  variant?: 'linear' | 'circular'
  /** Size for circular progress */
  size?: number
  /** Show percentage label */
  showLabel?: boolean
  /** Enable shimmer effect */
  shimmer?: boolean
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'error'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      variant = 'linear',
      size = 120,
      showLabel = false,
      shimmer = false,
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), 100)

    const colorMap: Record<Required<ProgressProps>["color"], string> = {
      primary: 'hsl(var(--primary))',
      success: 'hsl(var(--chart-2))',
      warning: 'hsl(var(--chart-4))',
      error: 'hsl(var(--destructive))',
    }

    if (variant === 'circular') {
      const strokeWidth = 8
      const radius = (size - strokeWidth) / 2
      const circumference = 2 * Math.PI * radius
      const offset = circumference - (clampedValue / 100) * circumference

      return (
        <div
          ref={ref}
          className={`relative inline-flex items-center justify-center ${className || ''}`}
          style={{ width: size, height: size }}
          {...props}
        >
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colorMap[color]}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
              style={{
                filter: shimmer ? 'drop-shadow(0 0 8px currentColor)' : undefined,
              }}
            />
          </svg>
          {showLabel && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold">{Math.round(clampedValue)}%</span>
            </div>
          )}
        </div>
      )
    }

    // Linear progress
    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-muted ${className || ''}`}
        {...props}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${shimmer ? 'skeleton' : ''}`}
          style={{
            width: `${clampedValue}%`,
            backgroundColor: colorMap[color],
          }}
        />
        {showLabel && (
          <div className="absolute right-2 -top-6 text-xs font-medium text-muted-foreground">
            {Math.round(clampedValue)}%
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
