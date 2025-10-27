'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * Props for the MetricCard component
 */
export interface MetricCardProps {
  /** Metric title */
  title: string
  /** Main value to display */
  value: string | number
  /** Change value (percentage or absolute) */
  change?: number
  /** Label for the change */
  changeLabel?: string
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral'
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Optional sparkline data for mini chart */
  sparkline?: number[]
  /** Format type for the value */
  format?: 'number' | 'currency' | 'percentage'
}

/**
 * MetricCard component displays a single key metric with trends.
 * Shows value, change indicators, and optional sparkline visualization.
 */
export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  trend,
  icon: Icon,
  sparkline,
  format = 'number',
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val

    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`
      case 'percentage':
        return `${val}%`
      default:
        return val.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      case 'neutral':
        return <Minus className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-primary'
      case 'down':
        return 'text-destructive'
      case 'neutral':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {formatValue(value)}
          </p>
        </div>
        {Icon && (
          <div className="bg-primary/10 rounded-lg p-3">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-semibold">
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {changeLabel}
          </span>
        </div>
      )}

      {/* Sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-end justify-between h-12 gap-1">
            {sparkline.map((value, index) => {
              const max = Math.max(...sparkline)
              const height = (value / max) * 100
              return (
                <div
                  key={index}
                  className="flex-1 bg-primary/20 rounded-t relative"
                  style={{ height: `${Math.max(height, 10)}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t"
                    style={{ height: '100%' }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </EnhancedCard>
  )
}
