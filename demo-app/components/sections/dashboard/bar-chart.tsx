'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

/**
 * Props for the BarChart component
 */
export interface BarChartProps {
  /** Array of data points */
  data: Array<{ label: string; value: number; color?: string }>
  /** Optional title for the chart */
  title?: string
  /** Chart orientation */
  orientation?: 'vertical' | 'horizontal'
  /** Whether bars should be stacked */
  stacked?: boolean
  /** Whether to show values on bars */
  showValues?: boolean
}

const defaultColor = 'hsl(var(--primary))'

/**
 * BarChart component for displaying categorical data.
 * Uses Recharts library for rendering interactive bar charts.
 */
export function BarChart({
  data,
  title,
  orientation = 'vertical',
  stacked = false,
  showValues = false,
}: BarChartProps) {
  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={data}
          layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          {orientation === 'vertical' ? (
            <>
              <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
            </>
          ) : (
            <>
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
              <YAxis dataKey="label" type="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              padding: '0.75rem',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
          />
          <Bar dataKey="value" label={showValues ? { position: 'top' } : false}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || defaultColor} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </EnhancedCard>
  )
}
