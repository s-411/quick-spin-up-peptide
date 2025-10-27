'use client'

import type { Vial } from '@/types'
import { getVialStatus, formatExpirationDate } from '@/lib/services/vial-service'
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface VialStatusBadgeProps {
  vial: Vial
  doseValue?: number
  doseUnits?: any
  showDetails?: boolean
}

export function VialStatusBadge({
  vial,
  doseValue,
  doseUnits,
  showDetails = false,
}: VialStatusBadgeProps) {
  const status = getVialStatus(vial, doseValue, doseUnits)
  const expirationText = formatExpirationDate(vial)

  const statusConfig = {
    active: {
      color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      icon: CheckCircle,
      label: 'Active',
    },
    low: {
      color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
      icon: AlertTriangle,
      label: 'Low',
    },
    empty: {
      color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      icon: XCircle,
      label: 'Empty',
    },
    expiring_soon: {
      color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      icon: AlertCircle,
      label: 'Expiring Soon',
    },
    expired: {
      color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      icon: XCircle,
      label: 'Expired',
    },
  }

  const config = statusConfig[status.status]
  const Icon = config.icon

  if (!showDetails) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div className={`p-3 rounded-lg border ${config.color}`}>
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{config.label}</span>
            <span className="text-xs opacity-75">{expirationText}</span>
          </div>
          <p className="text-xs opacity-90">{status.message}</p>
          <div className="flex items-center justify-between text-xs mt-2">
            <span>Remaining:</span>
            <span className="font-medium">
              {vial.remainingVolume.toFixed(2)}/{vial.totalVolume.toFixed(2)} mL
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
