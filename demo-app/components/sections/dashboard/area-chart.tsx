'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Represents a single data point in the chart
 */
export interface DataPoint {
  /** Date string */
  date: string
  /** Value at this point */
  value: number
  /** Optional label for the point */
  label?: string
}

/**
 * Represents a data series in the chart
 */
export interface DataSeries {
  /** Series name */
  name: string
  /** Array of data points */
  data: DataPoint[]
  /** Optional color for the area */
  color?: string
}

/**
 * Props for the AreaChart component
 */
export interface AreaChartProps {
  /** Array of data series to display */
  series: DataSeries[]
  /** Optional title for the chart */
  title?: string
  /** Whether areas should be stacked */
  stacked?: boolean
  /** Whether to show gradient fill */
  gradient?: boolean
}

const defaultColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--primary) / 0.6)', 'hsl(var(--secondary) / 0.6)', 'hsl(var(--destructive))']

/**
 * AreaChart component for displaying time-series data with filled areas.
 * Uses Recharts library for rendering interactive area charts.
 */
export function AreaChart({
  series,
  title,
  stacked = false,
  gradient = true,
}: AreaChartProps) {
  // Combine all series data into single array for Recharts
  const combinedData = series[0]?.data.map((point, index) => {
    const dataPoint: any = { date: point.date }
    series.forEach(s => {
      dataPoint[s.name] = s.data[index]?.value || 0
    })
    return dataPoint
  }) || []

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <RechartsAreaChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            {series.map((s, index) => {
              const color = s.color || defaultColors[index % defaultColors.length]
              return gradient ? (
                <linearGradient key={s.name} id={`gradient-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ) : null
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              padding: '0.75rem',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
          />
          <Legend />
          {series.map((s, index) => {
            const color = s.color || defaultColors[index % defaultColors.length]
            return (
              <Area
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stackId={stacked ? '1' : undefined}
                stroke={color}
                fill={gradient ? `url(#gradient-${s.name})` : color}
                fillOpacity={gradient ? 1 : 0.6}
              />
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </EnhancedCard>
  )
}
