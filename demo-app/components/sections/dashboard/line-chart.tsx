'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  /** Optional color for the line */
  color?: string
}

/**
 * Props for the LineChart component
 */
export interface LineChartProps {
  /** Array of data series to display */
  series: DataSeries[]
  /** Optional title for the chart */
  title?: string
  /** Chart height in pixels */
  height?: number
  /** Whether to show legend */
  showLegend?: boolean
  /** Whether to show grid */
  showGrid?: boolean
  /** Y-axis label */
  yAxisLabel?: string
  /** X-axis label */
  xAxisLabel?: string
}

const defaultColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--primary) / 0.6)', 'hsl(var(--secondary) / 0.6)', 'hsl(var(--destructive))']

/**
 * LineChart component for displaying time-series data.
 * Uses Recharts library for rendering interactive charts.
 */
export function LineChart({
  series,
  title,
  height = 400,
  showLegend = true,
  showGrid = true,
  yAxisLabel,
  xAxisLabel,
}: LineChartProps) {
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

      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
          )}
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            className="text-xs"
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            className="text-xs"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
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
          {series.map((s, index) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={s.color || defaultColors[index % defaultColors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </EnhancedCard>
  )
}
