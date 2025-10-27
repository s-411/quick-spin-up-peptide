'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'

interface AdherenceData {
  period: {
    startDate: string
    endDate: string
  }
  adherence: {
    percentageComplete: number
    expectedCount: number
    actualCount: number
    missedCount: number
    currentStreak: number
    longestStreak: number
  }
  byProtocol: Array<{
    protocolId: string
    protocolName: string
    adherencePercent: number
    expectedCount: number
    actualCount: number
  }>
}

interface AdherenceChartProps {
  protocolId?: string
  days?: number
}

export function AdherenceChart({ protocolId, days = 30 }: AdherenceChartProps) {
  const [data, setData] = useState<AdherenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdherence = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ days: days.toString() })
        if (protocolId) params.append('protocolId', protocolId)

        const response = await fetch(`/api/analytics/adherence?${params}`)
        if (!response.ok) throw new Error('Failed to fetch adherence data')

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Adherence fetch error:', err)
        setError('Failed to load adherence data')
      } finally {
        setLoading(false)
      }
    }

    fetchAdherence()
  }, [protocolId, days])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Adherence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading adherence data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Adherence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error || 'No data available'}</p>
        </CardContent>
      </Card>
    )
  }

  const { adherence } = data
  const adherencePercent = adherence.percentageComplete

  const getTrendIcon = () => {
    if (adherencePercent >= 90) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (adherencePercent >= 70) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getTrendColor = () => {
    if (adherencePercent >= 90) return 'text-green-600 dark:text-green-400'
    if (adherencePercent >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Adherence
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            Last {days} days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Adherence */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTrendIcon()}
            <p className={`text-4xl font-bold ${getTrendColor()}`}>
              {adherencePercent.toFixed(0)}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {adherence.actualCount} of {adherence.expectedCount} injections completed
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                adherencePercent >= 90
                  ? 'bg-green-500'
                  : adherencePercent >= 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(adherencePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Streak Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold text-primary">{adherence.currentStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Longest Streak</p>
            <p className="text-2xl font-bold text-primary">{adherence.longestStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>

        {/* Missed Injections */}
        {adherence.missedCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {adherence.missedCount} missed injection{adherence.missedCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* By Protocol Breakdown */}
        {data.byProtocol && data.byProtocol.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              By Protocol
            </h4>
            <div className="space-y-2">
              {data.byProtocol.map(protocol => (
                <div
                  key={protocol.protocolId}
                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{protocol.protocolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {protocol.actualCount}/{protocol.expectedCount} completed
                    </p>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      protocol.adherencePercent >= 90
                        ? 'text-green-600 dark:text-green-400'
                        : protocol.adherencePercent >= 70
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {protocol.adherencePercent.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
