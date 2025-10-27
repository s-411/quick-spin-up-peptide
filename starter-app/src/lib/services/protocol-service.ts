/**
 * Protocol Service
 *
 * Handles protocol schedule generation, next injection calculation,
 * and cycle management
 */

import type { Protocol, ScheduleType, InjectionSite } from '@/types'

/**
 * Calculate the next injection date for a protocol
 */
export function calculateNextInjectionDate(
  protocol: Protocol,
  lastInjectionDate?: Date
): Date | null {
  const referenceDate = lastInjectionDate || new Date(protocol.startDate)

  switch (protocol.scheduleType) {
    case 'every_x_days':
      if (!protocol.frequencyDays) return null
      return addDays(referenceDate, protocol.frequencyDays)

    case 'weekly':
      if (!protocol.weeklyDays || protocol.weeklyDays.length === 0) return null
      return calculateNextWeeklyDate(referenceDate, protocol.weeklyDays)

    case 'custom':
      // Custom logic would go here
      // For now, return null as it requires custom handling
      return null

    default:
      return null
  }
}

/**
 * Generate a preview of scheduled injection dates
 */
export function generateSchedulePreview(protocol: Protocol, daysAhead = 30): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(protocol.startDate)
  const endDate = addDays(new Date(), daysAhead)

  let iterationLimit = 1000 // Safety limit
  let iterations = 0

  while (currentDate <= endDate && iterations < iterationLimit) {
    dates.push(new Date(currentDate))

    const nextDate = calculateNextInjectionDate(protocol, currentDate)
    if (!nextDate || nextDate <= currentDate) break

    currentDate = nextDate
    iterations++
  }

  return dates
}

/**
 * Calculate next occurrence for weekly schedule
 */
function calculateNextWeeklyDate(referenceDate: Date, weeklyDays: number[]): Date {
  const currentDay = referenceDate.getDay() // 0 = Sunday, 6 = Saturday
  const sortedDays = [...weeklyDays].sort((a, b) => a - b)

  // Find the next day in the schedule
  let nextDay = sortedDays.find(day => day > currentDay)

  if (nextDay === undefined) {
    // Wrap to next week, use first day
    nextDay = sortedDays[0]
    // Calculate days until next occurrence
    const daysToAdd = 7 - currentDay + nextDay
    return addDays(referenceDate, daysToAdd)
  } else {
    // Days until next occurrence this week
    const daysToAdd = nextDay - currentDay
    return addDays(referenceDate, daysToAdd)
  }
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Check if a protocol is in an active cycle (not in off-weeks)
 */
export function isProtocolInActiveCycle(protocol: Protocol, checkDate = new Date()): boolean {
  if (!protocol.cycleLengthWeeks || !protocol.offWeeks) {
    // No cycling configured, always active
    return protocol.isActive
  }

  const startDate = new Date(protocol.startDate)
  const daysSinceStart = Math.floor(
    (checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalCycleDays = (protocol.cycleLengthWeeks + protocol.offWeeks) * 7
  const dayInCycle = daysSinceStart % totalCycleDays
  const activeCycleDays = protocol.cycleLengthWeeks * 7

  return dayInCycle < activeCycleDays
}

/**
 * Calculate the next site in rotation
 */
export function calculateNextSite(
  siteRotation: InjectionSite[] | undefined,
  lastSite?: InjectionSite
): InjectionSite | undefined {
  if (!siteRotation || siteRotation.length === 0) return undefined

  if (!lastSite) {
    // Return first site if no last site
    return siteRotation[0]
  }

  const lastIndex = siteRotation.indexOf(lastSite)
  if (lastIndex === -1) {
    // Last site not in rotation, start from beginning
    return siteRotation[0]
  }

  // Return next site in rotation (wrap around)
  const nextIndex = (lastIndex + 1) % siteRotation.length
  return siteRotation[nextIndex]
}

/**
 * Validate protocol configuration
 */
export function validateProtocol(protocol: Partial<Protocol>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!protocol.medicationId) {
    errors.push('Medication is required')
  }

  if (!protocol.name || protocol.name.trim() === '') {
    errors.push('Protocol name is required')
  }

  if (!protocol.scheduleType) {
    errors.push('Schedule type is required')
  }

  if (protocol.scheduleType === 'every_x_days') {
    if (!protocol.frequencyDays || protocol.frequencyDays <= 0) {
      errors.push('Frequency must be greater than 0 for "every X days" schedule')
    }
  }

  if (protocol.scheduleType === 'weekly') {
    if (!protocol.weeklyDays || protocol.weeklyDays.length === 0) {
      errors.push('At least one day must be selected for weekly schedule')
    }
  }

  if (protocol.scheduleType === 'custom') {
    if (!protocol.customSchedule) {
      errors.push('Custom schedule configuration is required')
    }
  }

  if (!protocol.doseValue || protocol.doseValue <= 0) {
    errors.push('Dose value must be greater than 0')
  }

  if (!protocol.doseUnits) {
    errors.push('Dose units are required')
  }

  if (!protocol.startDate) {
    errors.push('Start date is required')
  }

  if (protocol.cycleLengthWeeks && protocol.cycleLengthWeeks <= 0) {
    errors.push('Cycle length must be greater than 0')
  }

  if (protocol.offWeeks && protocol.offWeeks < 0) {
    errors.push('Off weeks cannot be negative')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format schedule type for display
 */
export function formatScheduleType(scheduleType: ScheduleType): string {
  switch (scheduleType) {
    case 'every_x_days':
      return 'Every X Days'
    case 'weekly':
      return 'Weekly Schedule'
    case 'custom':
      return 'Custom Schedule'
    default:
      return scheduleType
  }
}

/**
 * Format a protocol schedule for human-readable display
 */
export function formatProtocolSchedule(protocol: Protocol): string {
  switch (protocol.scheduleType) {
    case 'every_x_days':
      if (protocol.frequencyDays === 1) return 'Daily'
      if (protocol.frequencyDays === 7) return 'Weekly'
      return `Every ${protocol.frequencyDays} days`

    case 'weekly':
      if (!protocol.weeklyDays || protocol.weeklyDays.length === 0) return 'Not configured'
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const days = protocol.weeklyDays.map(d => dayNames[d]).join(', ')
      return `Weekly: ${days}`

    case 'custom':
      return 'Custom schedule'

    default:
      return 'Unknown schedule'
  }
}

/**
 * Format injection site for display
 */
export function formatInjectionSite(site: InjectionSite): string {
  const siteMap: Record<InjectionSite, string> = {
    left_glute: 'Left Glute',
    right_glute: 'Right Glute',
    left_delt: 'Left Deltoid',
    right_delt: 'Right Deltoid',
    left_thigh: 'Left Thigh',
    right_thigh: 'Right Thigh',
    abdomen_upper_left: 'Abdomen (Upper Left)',
    abdomen_upper_right: 'Abdomen (Upper Right)',
    abdomen_lower_left: 'Abdomen (Lower Left)',
    abdomen_lower_right: 'Abdomen (Lower Right)',
    left_ventrogluteal: 'Left Ventrogluteal',
    right_ventrogluteal: 'Right Ventrogluteal',
  }

  return siteMap[site] || site
}

/**
 * Get all available injection sites
 */
export function getAvailableInjectionSites(): Array<{ value: InjectionSite; label: string }> {
  const sites: InjectionSite[] = [
    'left_glute',
    'right_glute',
    'left_delt',
    'right_delt',
    'left_thigh',
    'right_thigh',
    'abdomen_upper_left',
    'abdomen_upper_right',
    'abdomen_lower_left',
    'abdomen_lower_right',
    'left_ventrogluteal',
    'right_ventrogluteal',
  ]

  return sites.map(site => ({
    value: site,
    label: formatInjectionSite(site),
  }))
}

/**
 * Recommended default site rotations for different medication types
 */
export function getRecommendedSiteRotation(medicationType?: string): InjectionSite[] {
  // For larger volume injections (e.g., testosterone)
  const largeVolumeRotation: InjectionSite[] = [
    'left_glute',
    'right_glute',
    'left_ventrogluteal',
    'right_ventrogluteal',
  ]

  // For smaller volume injections (e.g., peptides)
  const smallVolumeRotation: InjectionSite[] = [
    'abdomen_upper_left',
    'abdomen_upper_right',
    'abdomen_lower_left',
    'abdomen_lower_right',
    'left_thigh',
    'right_thigh',
  ]

  // For daily injections
  const dailyRotation: InjectionSite[] = [
    'abdomen_upper_left',
    'abdomen_upper_right',
    'abdomen_lower_right',
    'abdomen_lower_left',
    'left_thigh',
    'right_thigh',
    'left_delt',
    'right_delt',
  ]

  if (medicationType?.toLowerCase() === 'trt') {
    return largeVolumeRotation
  } else if (medicationType?.toLowerCase() === 'peptide') {
    return smallVolumeRotation
  } else if (medicationType?.toLowerCase() === 'glp-1') {
    return smallVolumeRotation
  }

  // Default rotation
  return dailyRotation
}

/**
 * Calculate days until next injection
 */
export function daysUntilNextInjection(nextDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const next = new Date(nextDate)
  next.setHours(0, 0, 0, 0)

  const diffTime = next.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Format days until as human-readable string
 */
export function formatDaysUntil(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days < 0) return `${Math.abs(days)} days ago`
  return `In ${days} days`
}

/**
 * Check if a protocol is overdue
 */
export function isProtocolOverdue(nextInjectionDate: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const next = new Date(nextInjectionDate)
  next.setHours(0, 0, 0, 0)

  return next < today
}

/**
 * Calculate protocol statistics
 */
export interface ProtocolStats {
  daysActive: number
  expectedInjections: number
  cycleProgress?: {
    currentCycle: number
    dayInCycle: number
    totalCycleDays: number
    isOnCycle: boolean
  }
}

export function calculateProtocolStats(protocol: Protocol): ProtocolStats {
  const startDate = new Date(protocol.startDate)
  const today = new Date()
  const daysActive = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  let expectedInjections = 0

  if (protocol.scheduleType === 'every_x_days' && protocol.frequencyDays) {
    expectedInjections = Math.floor(daysActive / protocol.frequencyDays)
  } else if (protocol.scheduleType === 'weekly' && protocol.weeklyDays) {
    const weeks = Math.floor(daysActive / 7)
    expectedInjections = weeks * protocol.weeklyDays.length
  }

  const stats: ProtocolStats = {
    daysActive,
    expectedInjections,
  }

  // Add cycle progress if applicable
  if (protocol.cycleLengthWeeks && protocol.offWeeks) {
    const totalCycleDays = (protocol.cycleLengthWeeks + protocol.offWeeks) * 7
    const dayInCycle = daysActive % totalCycleDays
    const currentCycle = Math.floor(daysActive / totalCycleDays) + 1
    const isOnCycle = dayInCycle < protocol.cycleLengthWeeks * 7

    stats.cycleProgress = {
      currentCycle,
      dayInCycle,
      totalCycleDays,
      isOnCycle,
    }
  }

  return stats
}
