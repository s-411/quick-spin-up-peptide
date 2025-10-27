'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'

/**
 * Represents usage metrics for a resource
 */
export interface UsageMetric {
  /** Metric name */
  name: string
  /** Current usage value */
  current: number
  /** Maximum allowed value */
  limit: number
  /** Unit of measurement */
  unit: string
  /** Historical usage data */
  history: Array<{ date: string; value: number }>
  /** Optional cost associated with usage */
  cost?: number
}

/**
 * Props for the UsageStats component
 */
export interface UsageStatsProps {
  /** Array of usage metrics */
  metrics: UsageMetric[]
  /** Current billing period */
  billingPeriod: { start: string; end: string }
}

/**
 * UsageStats component displays resource usage with graphs and cost breakdowns.
 * Shows usage trends, progress bars, and overage warnings.
 */
export function UsageStats({ metrics, billingPeriod }: UsageStatsProps) {
  const totalCost = metrics.reduce((sum, metric) => sum + (metric.cost || 0), 0)

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const isOverage = (current: number, limit: number) => {
    return current >= limit * 0.9
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Usage Statistics
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Billing period: {new Date(billingPeriod.start).toLocaleDateString()} -{' '}
          {new Date(billingPeriod.end).toLocaleDateString()}
        </p>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary rounded-lg p-5 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <p className="text-sm opacity-90">Total Cost</p>
          </div>
          <p className="text-3xl font-bold">${totalCost.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-1">This billing period</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Resources Used</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{metrics.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Active resources</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-secondary" />
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {metrics.filter(m => isOverage(m.current, m.limit)).length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Near limits</p>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-6">
        {metrics.map((metric) => {
          const percentage = getUsagePercentage(metric.current, metric.limit)
          const isNearLimit = isOverage(metric.current, metric.limit)

          return (
            <div key={metric.name} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {metric.name}
                    {isNearLimit && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 border border-secondary/20 rounded-full text-xs font-medium text-secondary-foreground">
                        <AlertTriangle className="w-3 h-3" />
                        Near Limit
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metric.current.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                  </p>
                </div>
                {metric.cost !== undefined && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      ${metric.cost.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">This period</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      percentage >= 100
                        ? 'bg-destructive'
                        : percentage >= 90
                        ? 'bg-secondary'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>{(metric.limit - metric.current).toLocaleString()} {metric.unit} remaining</span>
                </div>
              </div>

              {/* Mini Chart */}
              {metric.history && metric.history.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-foreground mb-3">
                    Usage Trend (Last 7 Days)
                  </p>
                  <div className="flex items-end justify-between h-24 gap-1">
                    {metric.history.slice(-7).map((point, index) => {
                      const height = (point.value / metric.limit) * 100
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-muted rounded-t relative flex-1 flex items-end">
                            <div
                              className="w-full bg-primary rounded-t transition-all"
                              style={{ height: `${Math.max(height, 5)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </EnhancedCard>
  )
}
