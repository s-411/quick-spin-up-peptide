/**
 * Vial Service
 *
 * Handles vial management, remaining dose calculations,
 * and inventory tracking
 */

import type { Vial, VialWithMedication, DoseUnits, ConcentrationUnits } from '@/types'
import { calculateRemainingDoses, calculateDoseVolume } from './calculator-service'

/**
 * Calculate remaining doses in a vial
 */
export function getRemainingDoses(vial: Vial, doseValue: number, doseUnits: DoseUnits): number {
  const doseVolume = calculateDoseVolume(
    doseValue,
    doseUnits,
    vial.concentrationValue,
    vial.concentrationUnits
  )

  return calculateRemainingDoses(vial.remainingVolume, doseVolume)
}

/**
 * Calculate percentage of vial remaining
 */
export function getVialPercentRemaining(vial: Vial): number {
  if (vial.totalVolume === 0) return 0
  const percent = (vial.remainingVolume / vial.totalVolume) * 100
  return Math.round(percent * 10) / 10 // Round to 1 decimal place
}

/**
 * Check if vial is expired
 */
export function isVialExpired(vial: Vial): boolean {
  if (!vial.expirationDate) return false

  const expirationDate = new Date(vial.expirationDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expirationDate.setHours(0, 0, 0, 0)

  return expirationDate < today
}

/**
 * Check if vial is expiring soon (within N days)
 */
export function isVialExpiringSoon(vial: Vial, daysThreshold = 30): boolean {
  if (!vial.expirationDate) return false

  const expirationDate = new Date(vial.expirationDate)
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

  return expirationDate <= thresholdDate && !isVialExpired(vial)
}

/**
 * Days until expiration
 */
export function daysUntilExpiration(vial: Vial): number | null {
  if (!vial.expirationDate) return null

  const expirationDate = new Date(vial.expirationDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expirationDate.setHours(0, 0, 0, 0)

  const diffTime = expirationDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Format expiration date for display
 */
export function formatExpirationDate(vial: Vial): string {
  if (!vial.expirationDate) return 'No expiration date'

  const days = daysUntilExpiration(vial)
  if (days === null) return 'No expiration date'

  if (days < 0) return 'Expired'
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  if (days <= 7) return `Expires in ${days} days`
  if (days <= 30) return `Expires in ${Math.ceil(days / 7)} weeks`

  const expirationDate = new Date(vial.expirationDate)
  return expirationDate.toLocaleDateString()
}

/**
 * Get vial status
 */
export type VialStatus = 'active' | 'low' | 'empty' | 'expiring_soon' | 'expired'

export interface VialStatusInfo {
  status: VialStatus
  message: string
  priority: number // Higher = more urgent
}

export function getVialStatus(
  vial: Vial,
  doseValue?: number,
  doseUnits?: DoseUnits
): VialStatusInfo {
  // Check expiration first
  if (isVialExpired(vial)) {
    return {
      status: 'expired',
      message: 'Vial is expired',
      priority: 5,
    }
  }

  // Check if expiring soon
  if (isVialExpiringSoon(vial, 14)) {
    const days = daysUntilExpiration(vial)
    return {
      status: 'expiring_soon',
      message: `Expires in ${days} day${days === 1 ? '' : 's'}`,
      priority: 4,
    }
  }

  // Check remaining volume
  if (vial.remainingVolume <= 0) {
    return {
      status: 'empty',
      message: 'Vial is empty',
      priority: 5,
    }
  }

  // Check remaining doses if dose info provided
  if (doseValue && doseUnits) {
    const remainingDoses = getRemainingDoses(vial, doseValue, doseUnits)

    if (remainingDoses === 0) {
      return {
        status: 'empty',
        message: 'Insufficient volume for next dose',
        priority: 5,
      }
    }

    if (remainingDoses < 3) {
      return {
        status: 'low',
        message: `Only ${remainingDoses} dose${remainingDoses === 1 ? '' : 's'} remaining`,
        priority: 3,
      }
    }
  } else {
    // Check percentage if no dose info
    const percentRemaining = getVialPercentRemaining(vial)

    if (percentRemaining < 20) {
      return {
        status: 'low',
        message: `${percentRemaining}% remaining`,
        priority: 3,
      }
    }
  }

  return {
    status: 'active',
    message: 'Vial is ready to use',
    priority: 1,
  }
}

/**
 * Simulate removing volume from a vial (for preview calculations)
 */
export function simulateVialWithdrawal(vial: Vial, volumeToWithdraw: number): Vial {
  return {
    ...vial,
    remainingVolume: Math.max(0, vial.remainingVolume - volumeToWithdraw),
  }
}

/**
 * Validate vial data
 */
export function validateVial(vial: Partial<Vial>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!vial.medicationId) {
    errors.push('Medication is required')
  }

  if (!vial.concentrationValue || vial.concentrationValue <= 0) {
    errors.push('Concentration value must be greater than 0')
  }

  if (!vial.concentrationUnits) {
    errors.push('Concentration units are required')
  }

  if (!vial.totalVolume || vial.totalVolume <= 0) {
    errors.push('Total volume must be greater than 0')
  }

  if (vial.remainingVolume === undefined || vial.remainingVolume === null) {
    errors.push('Remaining volume is required')
  } else if (vial.remainingVolume < 0) {
    errors.push('Remaining volume cannot be negative')
  } else if (vial.totalVolume && vial.remainingVolume > vial.totalVolume) {
    errors.push('Remaining volume cannot exceed total volume')
  }

  if (vial.expirationDate) {
    const expDate = new Date(vial.expirationDate)
    if (isNaN(expDate.getTime())) {
      errors.push('Invalid expiration date')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sort vials by priority (expired/expiring/low volume first)
 */
export function sortVialsByPriority(
  vials: VialWithMedication[],
  doseValue?: number,
  doseUnits?: DoseUnits
): VialWithMedication[] {
  return [...vials].sort((a, b) => {
    const statusA = getVialStatus(a, doseValue, doseUnits)
    const statusB = getVialStatus(b, doseValue, doseUnits)

    // Higher priority first
    if (statusA.priority !== statusB.priority) {
      return statusB.priority - statusA.priority
    }

    // Within same priority, sort by expiration date (sooner first)
    if (a.expirationDate && b.expirationDate) {
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
    }

    // If only one has expiration, prioritize that one
    if (a.expirationDate) return -1
    if (b.expirationDate) return 1

    // Otherwise, sort by remaining percentage (lower first for 'low' status)
    const percentA = getVialPercentRemaining(a)
    const percentB = getVialPercentRemaining(b)
    return percentA - percentB
  })
}

/**
 * Get the best vial to use for the next injection
 * (lowest volume that still has enough, or expiring soonest)
 */
export function selectBestVialForInjection(
  vials: VialWithMedication[],
  doseValue: number,
  doseUnits: DoseUnits
): VialWithMedication | null {
  // Filter to only active vials with enough volume
  const usableVials = vials.filter(vial => {
    const status = getVialStatus(vial, doseValue, doseUnits)
    const remainingDoses = getRemainingDoses(vial, doseValue, doseUnits)
    return !isVialExpired(vial) && remainingDoses > 0
  })

  if (usableVials.length === 0) return null

  // Sort by: 1) expiring soon first, 2) lowest remaining volume
  return usableVials.sort((a, b) => {
    // Prioritize vials expiring soon
    const aExpiringSoon = isVialExpiringSoon(a, 14)
    const bExpiringSoon = isVialExpiringSoon(b, 14)

    if (aExpiringSoon && !bExpiringSoon) return -1
    if (!aExpiringSoon && bExpiringSoon) return 1

    // If both expiring soon or neither, use the one with lower volume
    // (use up partial vials before opening new ones)
    return a.remainingVolume - b.remainingVolume
  })[0]
}

/**
 * Format concentration for display
 */
export function formatConcentration(
  concentrationValue: number,
  concentrationUnits: ConcentrationUnits
): string {
  return `${concentrationValue} ${concentrationUnits}`
}

/**
 * Format volume for display
 */
export function formatVolume(volumeMl: number): string {
  return `${volumeMl.toFixed(2)} mL`
}

/**
 * Calculate inventory value across all vials
 */
export interface InventorySummary {
  totalVials: number
  activeVials: number
  expiredVials: number
  lowVials: number
  totalValue?: number
}

export function calculateInventorySummary(
  vials: Vial[],
  vialCosts?: Map<string, number>
): InventorySummary {
  const summary: InventorySummary = {
    totalVials: vials.length,
    activeVials: 0,
    expiredVials: 0,
    lowVials: 0,
    totalValue: 0,
  }

  for (const vial of vials) {
    const status = getVialStatus(vial)

    if (status.status === 'expired') {
      summary.expiredVials++
    } else if (status.status === 'active') {
      summary.activeVials++
    } else if (status.status === 'low') {
      summary.lowVials++
    }

    // Calculate value if costs provided
    if (vialCosts && vialCosts.has(vial.id)) {
      const cost = vialCosts.get(vial.id)!
      const percentRemaining = getVialPercentRemaining(vial)
      summary.totalValue = (summary.totalValue || 0) + (cost * percentRemaining) / 100
    }
  }

  return summary
}

/**
 * Generate alerts for vials requiring attention
 */
export interface VialAlert {
  vialId: string
  type: 'expired' | 'expiring' | 'low' | 'empty'
  message: string
  severity: 'critical' | 'warning' | 'info'
}

export function generateVialAlerts(
  vials: VialWithMedication[],
  doseValue?: number,
  doseUnits?: DoseUnits
): VialAlert[] {
  const alerts: VialAlert[] = []

  for (const vial of vials) {
    const status = getVialStatus(vial, doseValue, doseUnits)

    if (status.status === 'expired') {
      alerts.push({
        vialId: vial.id,
        type: 'expired',
        message: `${vial.medication.name} vial expired`,
        severity: 'critical',
      })
    } else if (status.status === 'expiring_soon') {
      alerts.push({
        vialId: vial.id,
        type: 'expiring',
        message: `${vial.medication.name} vial ${status.message}`,
        severity: 'warning',
      })
    } else if (status.status === 'empty') {
      alerts.push({
        vialId: vial.id,
        type: 'empty',
        message: `${vial.medication.name} vial is empty`,
        severity: 'critical',
      })
    } else if (status.status === 'low') {
      alerts.push({
        vialId: vial.id,
        type: 'low',
        message: `${vial.medication.name} vial ${status.message}`,
        severity: 'warning',
      })
    }
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}
