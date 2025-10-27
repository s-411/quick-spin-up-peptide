'use client'

import { useEffect, useState } from 'react'
import type { HealthCheck } from '@/types'

export function StatusDashboard() {
  const [healthData, setHealthData] = useState<HealthCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch('/api/health')
        if (!response.ok) {
          throw new Error('Health check failed')
        }
        const data = await response.json()
        setHealthData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health status')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    // Refresh health status every 30 seconds
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div
        data-testid="status-dashboard"
        className="rounded-lg border border-border bg-card p-8 text-center"
      >
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading system status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="status-dashboard"
        className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center"
      >
        <p className="text-sm text-destructive">Error: {error}</p>
      </div>
    )
  }

  if (!healthData) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'unhealthy':
        return 'text-destructive'
      case 'disabled':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✓'
      case 'unhealthy':
        return '✗'
      case 'disabled':
        return '○'
      default:
        return '?'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
      case 'unhealthy':
        return 'bg-destructive/10 border-destructive/20'
      case 'disabled':
        return 'bg-muted/50 border-muted'
      default:
        return 'bg-muted'
    }
  }

  return (
    <div data-testid="status-dashboard" className="space-y-4">
      {/* Overall Status */}
      <div
        className={`rounded-lg border p-4 text-center ${
          healthData.status === 'healthy'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
            : 'border-destructive bg-destructive/10'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{healthData.status === 'healthy' ? '✓' : '✗'}</span>
          <span
            className={`text-lg font-semibold ${
              healthData.status === 'healthy'
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-destructive'
            }`}
          >
            System {healthData.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Last checked: {new Date(healthData.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Individual Service Checks */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {healthData.checks.map(check => (
          <div
            key={check.service}
            className={`rounded-lg border border-border p-4 ${getStatusBg(check.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xl ${getStatusColor(check.status)}`}>
                    {getStatusIcon(check.status)}
                  </span>
                  <h3 className="font-semibold capitalize">{check.service.replace(/_/g, ' ')}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{check.message}</p>
                {check.latency !== undefined && (
                  <p className="mt-1 text-xs font-mono text-muted-foreground">{check.latency}ms</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border border-border bg-muted/30 p-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-emerald-600 dark:text-emerald-400">✓</span>
          <span className="text-muted-foreground">Healthy</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-destructive">✗</span>
          <span className="text-muted-foreground">Unhealthy</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">○</span>
          <span className="text-muted-foreground">Disabled</span>
        </div>
      </div>
    </div>
  )
}
