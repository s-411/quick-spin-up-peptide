'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

/**
 * Props for the PieChart component
 */
export interface PieChartProps {
  /** Array of data points */
  data: Array<{ name: string; value: number; color?: string }>
  /** Optional title for the chart */
  title?: string
  /** Chart variant */
  variant?: 'pie' | 'donut'
  /** Whether to show legend */
  showLegend?: boolean
  /** Whether to show percentages */
  showPercentages?: boolean
  /** Optional center metric for donut charts */
  centerMetric?: { label: string; value: string }
}

const defaultColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--primary) / 0.7)', 'hsl(var(--secondary) / 0.7)', 'hsl(var(--destructive))', 'hsl(var(--primary) / 0.5)', 'hsl(var(--secondary) / 0.5)']

/**
 * PieChart component for displaying proportional data.
 * Uses Recharts library for rendering interactive pie/donut charts.
 */
export function PieChart({
  data,
  title,
  variant = 'pie',
  showLegend = true,
  showPercentages = true,
  centerMetric,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const renderLabel = (entry: any) => {
    if (!showPercentages) return ''
    const percent = ((entry.value / total) * 100).toFixed(1)
    return `${percent}%`
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {title}
        </h3>
      )}

      <div className="relative">
        <ResponsiveContainer width="100%" height={400}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={variant === 'donut' ? 120 : 140}
              innerRadius={variant === 'donut' ? 80 : 0}
              fill={data[0]?.color || defaultColors[0]}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            />
            {showLegend && <Legend />}
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center Metric for Donut Chart */}
        {variant === 'donut' && centerMetric && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-3xl font-bold text-foreground">
              {centerMetric.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {centerMetric.label}
            </p>
          </div>
        )}
      </div>

      {/* Custom Legend with Values */}
      {showLegend && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || defaultColors[index % defaultColors.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.value.toLocaleString()} ({percentage}%)
                </span>
              </div>
            )
          })}
        </div>
      )}
    </EnhancedCard>
  )
}
