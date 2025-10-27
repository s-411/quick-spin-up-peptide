/**
 * Trends Analytics API Route
 *
 * GET /api/analytics/trends - Get measurement trends over time
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/analytics/trends
 *
 * Query params:
 * - type: string - measurement type (e.g., 'weight', 'testosterone_total')
 * - startDate: string (YYYY-MM-DD) - start of period (default: 90 days ago)
 * - endDate: string (YYYY-MM-DD) - end of period (default: today)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const measurementType = searchParams.get('type')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Calculate default date range (last 90 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Build query
    let query = supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .gte('date_time', `${startDateStr}T00:00:00Z`)
      .lte('date_time', `${endDateStr}T23:59:59Z`)
      .is('deleted_at', null)
      .order('date_time', { ascending: true })

    // Filter by type if specified
    if (measurementType) {
      query = query.eq('measurement_type', measurementType)
    }

    const { data: measurements, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching measurements:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 })
    }

    if (!measurements || measurements.length === 0) {
      return NextResponse.json({
        period: {
          startDate: startDateStr,
          endDate: endDateStr,
        },
        trends: [],
        summary: {},
      })
    }

    // Group measurements by type
    const measurementsByType: Record<string, any[]> = {}
    measurements.forEach((m: any) => {
      if (!measurementsByType[m.measurement_type]) {
        measurementsByType[m.measurement_type] = []
      }
      measurementsByType[m.measurement_type].push(m)
    })

    // Calculate trends for each type
    const trends = Object.entries(measurementsByType).map(([type, data]) => {
      const values = data.map(m => m.value)
      const dates = data.map(m => m.date_time.split('T')[0])

      const firstValue = values[0]
      const lastValue = values[values.length - 1]
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length

      const change = lastValue - firstValue
      const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0

      // Determine trend direction
      let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable'
      if (Math.abs(changePercent) > 2) {
        // 2% threshold for considering it a trend
        trendDirection = change > 0 ? 'increasing' : 'decreasing'
      }

      // Calculate simple moving average (7-day window)
      const movingAverage: number[] = []
      const windowSize = Math.min(7, values.length)
      for (let i = 0; i < values.length; i++) {
        const start = Math.max(0, i - windowSize + 1)
        const window = values.slice(start, i + 1)
        const avg = window.reduce((sum, v) => sum + v, 0) / window.length
        movingAverage.push(Math.round(avg * 100) / 100)
      }

      return {
        measurementType: type,
        unit: data[0].unit,
        dataPoints: data.map((m, index) => ({
          date: m.date_time.split('T')[0],
          value: m.value,
          secondaryValue: m.secondary_value,
          movingAverage: movingAverage[index],
          notes: m.notes,
        })),
        statistics: {
          count: data.length,
          firstValue,
          lastValue,
          minValue,
          maxValue,
          avgValue: Math.round(avgValue * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          trendDirection,
        },
      }
    })

    // Overall summary
    const summary = {
      totalMeasurements: measurements.length,
      measurementTypes: Object.keys(measurementsByType).length,
      dateRange: {
        start: startDateStr,
        end: endDateStr,
        days: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      },
    }

    return NextResponse.json({
      period: {
        startDate: startDateStr,
        endDate: endDateStr,
      },
      trends,
      summary,
    })
  } catch (error) {
    console.error('Trends GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
