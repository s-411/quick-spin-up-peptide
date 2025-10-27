'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { DoseUnits, ConcentrationUnits, DoseCalculation } from '@/types'
import { calculateVialDosing, getCalculatorTips } from '@/lib/services/calculator-service'
import { AlertCircle, Calculator } from 'lucide-react'

interface DoseCalculatorProps {
  onCalculated?: (calculation: DoseCalculation) => void
  initialValues?: {
    concentrationValue?: number
    concentrationUnits?: ConcentrationUnits
    totalVolume?: number
    doseValue?: number
    doseUnits?: DoseUnits
  }
}

export function DoseCalculator({ onCalculated, initialValues }: DoseCalculatorProps) {
  const [concentrationValue, setConcentrationValue] = useState(
    initialValues?.concentrationValue || 5
  )
  const [concentrationUnits, setConcentrationUnits] = useState<ConcentrationUnits>(
    initialValues?.concentrationUnits || 'mg/mL'
  )
  const [totalVolume, setTotalVolume] = useState(initialValues?.totalVolume || 5)
  const [doseValue, setDoseValue] = useState(initialValues?.doseValue || 250)
  const [doseUnits, setDoseUnits] = useState<DoseUnits>(initialValues?.doseUnits || 'mcg')

  const [calculation, setCalculation] = useState<DoseCalculation | null>(null)
  const [tips, setTips] = useState<string[]>([])

  useEffect(() => {
    try {
      const result = calculateVialDosing({
        concentrationValue,
        concentrationUnits,
        totalVolume,
        doseValue,
        doseUnits,
      })
      setCalculation(result)
      setTips(getCalculatorTips(result))
      onCalculated?.(result)
    } catch (error) {
      console.error('Calculation error:', error)
      setCalculation(null)
      setTips([])
    }
  }, [concentrationValue, concentrationUnits, totalVolume, doseValue, doseUnits])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Dose Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vial Concentration */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Vial Concentration</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={concentrationValue}
              onChange={e => setConcentrationValue(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              className="flex-1"
            />
            <select
              value={concentrationUnits}
              onChange={e => setConcentrationUnits(e.target.value as ConcentrationUnits)}
              className="input-mm w-32"
            >
              <option value="mg/mL">mg/mL</option>
              <option value="mcg/mL">mcg/mL</option>
              <option value="IU/mL">IU/mL</option>
              <option value="units/mL">units/mL</option>
            </select>
          </div>
        </div>

        {/* Total Volume */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Total Vial Volume (mL)</label>
          <Input
            type="number"
            value={totalVolume}
            onChange={e => setTotalVolume(parseFloat(e.target.value) || 0)}
            step="0.1"
            min="0"
          />
        </div>

        {/* Dose Per Injection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dose Per Injection</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={doseValue}
              onChange={e => setDoseValue(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              className="flex-1"
            />
            <select
              value={doseUnits}
              onChange={e => setDoseUnits(e.target.value as DoseUnits)}
              className="input-mm w-32"
            >
              <option value="mg">mg</option>
              <option value="mcg">mcg</option>
              <option value="IU">IU</option>
              <option value="units">units</option>
              <option value="mL">mL</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {calculation && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Volume per dose</p>
                <p className="text-xl font-bold text-primary">
                  {calculation.volumeMl.toFixed(3)} mL
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total doses</p>
                <p className="text-xl font-bold text-primary">{calculation.remainingDoses}</p>
              </div>
            </div>

            {/* Tips & Warnings */}
            {tips.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
