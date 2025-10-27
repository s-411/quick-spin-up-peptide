'use client'

import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface HighlightStat {
  /** Stat label */
  label: string
  /** Current value */
  value: number
  /** Target/max value for progress bar */
  max: number
  /** Growth percentage */
  growth?: number
  /** Comparison label (e.g., "vs last month") */
  comparison?: string
}

export interface StatsHighlightProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of stats */
  stats: HighlightStat[]
}

export function StatsHighlight({
  title = 'Performance Metrics',
  description = 'Track our progress and growth',
  stats,
}: StatsHighlightProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stats List */}
        <div className="space-y-8">
          {stats.map((stat, index) => {
            const percentage = (stat.value / stat.max) * 100
            const isPositive = stat.growth && stat.growth > 0
            const isNegative = stat.growth && stat.growth < 0

            return (
              <div
                key={index}
                className="p-6 rounded-card bg-card border border-border"
              >
                {/* Label & Value Row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                    {stat.comparison && (
                      <p className="text-sm text-muted-foreground">
                        {stat.comparison}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-heading text-primary">
                      {stat.value.toLocaleString()}
                      <span className="text-base text-muted-foreground">
                        /{stat.max.toLocaleString()}
                      </span>
                    </div>

                    {/* Growth Indicator */}
                    {stat.growth !== undefined && (
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold mt-1 justify-end ${
                          isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : isNegative
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {isPositive && <TrendingUp className="w-4 h-4" />}
                        {isNegative && <TrendingDown className="w-4 h-4" />}
                        {Math.abs(stat.growth)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={percentage} className="h-3" />

                {/* Percentage */}
                <div className="mt-2 text-right text-sm text-muted-foreground">
                  {percentage.toFixed(1)}% Complete
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
