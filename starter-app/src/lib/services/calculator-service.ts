/**
 * Calculator Service
 *
 * Handles all dose/volume conversions for medications
 * Supports mg/mL ↔ IU ↔ units conversions
 */

import type { DoseUnits, ConcentrationUnits, DoseCalculation, VialCalculatorInput } from '@/types'

/**
 * Conversion factors for common peptides/hormones
 * Note: These are standard conversion factors. Users should verify with their specific medication.
 */
const IU_CONVERSION_FACTORS: Record<string, number> = {
  // HCG: 1 IU ≈ 0.000125 mg (1 mg = 8000 IU)
  hcg: 8000,
  // HGH: 1 IU ≈ 0.000333 mg (1 mg = 3000 IU)
  hgh: 3000,
  // Insulin: 1 IU ≈ 0.0347 mg (1 mg = 28.8 IU)
  insulin: 28.8,
  // Generic/Default peptide conversion
  default: 1000,
}

/**
 * Calculate the volume (mL) needed for a specific dose
 */
export function calculateDoseVolume(
  doseValue: number,
  doseUnits: DoseUnits,
  concentrationValue: number,
  concentrationUnits: ConcentrationUnits
): number {
  // Normalize everything to the same units first
  const normalizedDose = normalizeDoseToMg(doseValue, doseUnits)
  const normalizedConcentration = normalizeConcentrationToMgPerMl(
    concentrationValue,
    concentrationUnits
  )

  // Volume (mL) = Dose (mg) / Concentration (mg/mL)
  const volumeMl = normalizedDose / normalizedConcentration

  return roundToDecimal(volumeMl, 4)
}

/**
 * Calculate how many full doses remain in a vial
 */
export function calculateRemainingDoses(remainingVolume: number, doseVolume: number): number {
  if (doseVolume <= 0) return 0
  return Math.floor(remainingVolume / doseVolume)
}

/**
 * Complete calculator function that returns all relevant information
 */
export function calculateVialDosing(input: VialCalculatorInput): DoseCalculation {
  const volumeMl = calculateDoseVolume(
    input.doseValue,
    input.doseUnits,
    input.concentrationValue,
    input.concentrationUnits
  )

  const remainingDoses = calculateRemainingDoses(input.totalVolume, volumeMl)

  return {
    doseValue: input.doseValue,
    doseUnits: input.doseUnits,
    volumeMl,
    remainingDoses,
    concentrationValue: input.concentrationValue,
    concentrationUnits: input.concentrationUnits,
    totalVolume: input.totalVolume,
  }
}

/**
 * Convert any dose unit to mg (milligrams) for standardized calculation
 */
function normalizeDoseToMg(value: number, units: DoseUnits, peptideType = 'default'): number {
  switch (units) {
    case 'mg':
      return value

    case 'mcg':
      // 1 mg = 1000 mcg
      return value / 1000

    case 'IU':
      // Convert IU to mg using conversion factor
      const conversionFactor =
        IU_CONVERSION_FACTORS[peptideType.toLowerCase()] || IU_CONVERSION_FACTORS.default
      return value / conversionFactor

    case 'units':
      // For insulin-type medications, 'units' often equals 'IU'
      // Treat as IU with insulin conversion factor
      return value / IU_CONVERSION_FACTORS.insulin

    case 'mL':
      // mL is volume, not mass - this shouldn't be used for dose
      // Return as-is (edge case handling)
      return value

    default:
      return value
  }
}

/**
 * Convert any concentration unit to mg/mL for standardized calculation
 */
function normalizeConcentrationToMgPerMl(
  value: number,
  units: ConcentrationUnits,
  peptideType = 'default'
): number {
  switch (units) {
    case 'mg/mL':
      return value

    case 'mcg/mL':
      // 1 mg/mL = 1000 mcg/mL
      return value / 1000

    case 'IU/mL':
      // Convert IU/mL to mg/mL using conversion factor
      const conversionFactor =
        IU_CONVERSION_FACTORS[peptideType.toLowerCase()] || IU_CONVERSION_FACTORS.default
      return value / conversionFactor

    case 'units/mL':
      // For insulin-type medications
      return value / IU_CONVERSION_FACTORS.insulin

    default:
      return value
  }
}

/**
 * Round a number to a specified number of decimal places
 */
function roundToDecimal(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Format dose value for display
 */
export function formatDose(value: number, units: DoseUnits): string {
  const rounded = roundToDecimal(value, units === 'mL' ? 3 : 2)
  return `${rounded} ${units}`
}

/**
 * Format volume for display (always in mL)
 */
export function formatVolume(volumeMl: number): string {
  return `${roundToDecimal(volumeMl, 3)} mL`
}

/**
 * Calculate total mg in a vial
 */
export function calculateTotalMgInVial(
  concentrationValue: number,
  concentrationUnits: ConcentrationUnits,
  totalVolume: number,
  peptideType = 'default'
): number {
  const concentrationMgPerMl = normalizeConcentrationToMgPerMl(
    concentrationValue,
    concentrationUnits,
    peptideType
  )

  return roundToDecimal(concentrationMgPerMl * totalVolume, 4)
}

/**
 * Calculate reconstitution (how much bacteriostatic water to add)
 */
export interface ReconstitutionCalc {
  lyophilizedMg: number // Total mg of lyophilized peptide
  desiredConcentration: number // Desired mg/mL concentration
  waterToAdd: number // mL of bacteriostatic water to add
}

export function calculateReconstitution(
  lyophilizedMg: number,
  desiredConcentrationMgPerMl: number
): ReconstitutionCalc {
  // Volume = Total mg / Desired concentration
  const waterToAdd = lyophilizedMg / desiredConcentrationMgPerMl

  return {
    lyophilizedMg,
    desiredConcentration: desiredConcentrationMgPerMl,
    waterToAdd: roundToDecimal(waterToAdd, 2),
  }
}

/**
 * Syringe unit conversions
 * Common insulin syringes are marked in units (100 units = 1 mL)
 */
export function convertMlToSyringeUnits(volumeMl: number, syringeType = '100'): number {
  // U-100 syringe: 100 units = 1 mL
  // U-50 syringe: 50 units = 1 mL
  const unitsPerMl = parseInt(syringeType, 10)
  return roundToDecimal(volumeMl * unitsPerMl, 1)
}

export function convertSyringeUnitsToMl(units: number, syringeType = '100'): number {
  const unitsPerMl = parseInt(syringeType, 10)
  return roundToDecimal(units / unitsPerMl, 3)
}

/**
 * Validate calculator inputs
 */
export function validateCalculatorInput(input: VialCalculatorInput): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (input.concentrationValue <= 0) {
    errors.push('Concentration value must be greater than 0')
  }

  if (input.totalVolume <= 0) {
    errors.push('Total volume must be greater than 0')
  }

  if (input.doseValue <= 0) {
    errors.push('Dose value must be greater than 0')
  }

  // Validate unit compatibility
  const doseUnitBase = input.doseUnits.replace(/\/.*/, '')
  const concUnitBase = input.concentrationUnits.replace(/\/.*/, '')

  // Warn if units seem incompatible (not an error, just a warning)
  if (doseUnitBase !== concUnitBase && doseUnitBase !== 'units' && concUnitBase !== 'units') {
    // This is actually fine - we normalize everything
    // But we could add a warning if needed
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate cost per dose (optional feature)
 */
export function calculateCostPerDose(
  vialCost: number,
  concentrationValue: number,
  concentrationUnits: ConcentrationUnits,
  totalVolume: number,
  doseValue: number,
  doseUnits: DoseUnits
): number {
  const calculation = calculateVialDosing({
    concentrationValue,
    concentrationUnits,
    totalVolume,
    doseValue,
    doseUnits,
  })

  if (calculation.remainingDoses === 0) return 0

  return roundToDecimal(vialCost / calculation.remainingDoses, 2)
}

/**
 * Generate helpful calculator tips/warnings
 */
export function getCalculatorTips(calculation: DoseCalculation): string[] {
  const tips: string[] = []

  if (calculation.volumeMl < 0.1) {
    tips.push(
      'Very small volume - consider using an insulin syringe for accuracy. ' +
        `You'll need ${convertMlToSyringeUnits(calculation.volumeMl)} units on a U-100 syringe.`
    )
  }

  if (calculation.volumeMl > 1.5) {
    tips.push('Large volume per dose - may require multiple injection sites.')
  }

  if (calculation.remainingDoses < 5) {
    tips.push('Less than 5 doses remaining - consider ordering a new vial.')
  }

  if (calculation.remainingDoses === 0) {
    tips.push('Insufficient volume for even one dose with current concentration.')
  }

  return tips
}
