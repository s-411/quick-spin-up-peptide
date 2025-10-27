'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'

/**
 * Represents a single stat item
 */
export interface Stat {
  /** Unique identifier */
  id: string
  /** Stat title */
  title: string
  /** Stat value */
  value: string | number
  /** Optional change value */
  change?: number
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Optional color for the icon */
  color?: string
}

/**
 * Props for the StatsGrid component
 */
export interface StatsGridProps {
  /** Array of stats to display */
  stats: Stat[]
  /** Number of columns in grid */
  columns?: 2 | 3 | 4
  /** Callback when a stat is clicked */
  onClick?: (id: string) => void
}

/**
 * StatsGrid component displays multiple metrics in a responsive grid.
 * Provides a quick overview of key performance indicators.
 */
export function StatsGrid({ stats, columns = 4, onClick }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const getColorClasses = (color?: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-primary/10', text: 'text-primary' },
      blue: { bg: 'bg-primary/10', text: 'text-primary' },
      green: { bg: 'bg-primary/10', text: 'text-primary' },
      yellow: { bg: 'bg-secondary/10', text: 'text-secondary' },
      red: { bg: 'bg-destructive/10', text: 'text-destructive' },
      pink: { bg: 'bg-primary/10', text: 'text-primary' },
      indigo: { bg: 'bg-primary/10', text: 'text-primary' },
    }
    return colors[color || 'purple'] || colors.purple
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {stats.map((stat) => {
        const Icon = stat.icon
        const colorClasses = getColorClasses(stat.color)
        const isClickable = !!onClick

        return (
          <EnhancedCard
            key={stat.id}
            tilt={false}
            glowEffect={false}
            className={`p-5 ${isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
            onClick={() => onClick?.(stat.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              {Icon && (
                <div className={`rounded-lg p-2 ${colorClasses.bg}`}>
                  <Icon className={`w-5 h-5 ${colorClasses.text}`} />
                </div>
              )}
            </div>

            {stat.change !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {stat.change > 0 ? (
                  <span className="text-primary font-semibold">
                    +{stat.change}%
                  </span>
                ) : stat.change < 0 ? (
                  <span className="text-destructive font-semibold">
                    {stat.change}%
                  </span>
                ) : (
                  <span className="text-muted-foreground font-semibold">
                    {stat.change}%
                  </span>
                )}
                <span className="text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </EnhancedCard>
        )
      })}
    </div>
  )
}
