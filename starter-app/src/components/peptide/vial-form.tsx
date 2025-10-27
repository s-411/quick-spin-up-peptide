'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { ConcentrationUnits, Medication } from '@/types'
import { Syringe, Loader2 } from 'lucide-react'

interface VialFormProps {
  medicationId?: string
  medications?: Medication[]
  initialData?: {
    id?: string
    medicationId?: string
    concentrationValue?: number
    concentrationUnits?: ConcentrationUnits
    totalVolume?: number
    batchNumber?: string
    expirationDate?: string
    mixedDate?: string
    notes?: string
  }
  onSubmit?: (data: VialFormData) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export interface VialFormData {
  medicationId: string
  concentrationValue: number
  concentrationUnits: ConcentrationUnits
  totalVolume: number
  batchNumber?: string
  expirationDate?: string
  mixedDate?: string
  notes?: string
}

export function VialForm({
  medicationId,
  medications = [],
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Vial',
}: VialFormProps) {
  const [selectedMedicationId, setSelectedMedicationId] = useState(
    initialData?.medicationId || medicationId || ''
  )
  const [concentrationValue, setConcentrationValue] = useState(initialData?.concentrationValue || 5)
  const [concentrationUnits, setConcentrationUnits] = useState<ConcentrationUnits>(
    initialData?.concentrationUnits || 'mg/mL'
  )
  const [totalVolume, setTotalVolume] = useState(initialData?.totalVolume || 5)
  const [batchNumber, setBatchNumber] = useState(initialData?.batchNumber || '')
  const [expirationDate, setExpirationDate] = useState(initialData?.expirationDate || '')
  const [mixedDate, setMixedDate] = useState(
    initialData?.mixedDate || new Date().toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (medicationId && !initialData?.medicationId) {
      setSelectedMedicationId(medicationId)
    }
  }, [medicationId, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedMedicationId) {
      setError('Please select a medication')
      return
    }

    if (concentrationValue <= 0) {
      setError('Concentration must be greater than 0')
      return
    }

    if (totalVolume <= 0) {
      setError('Volume must be greater than 0')
      return
    }

    try {
      setLoading(true)
      await onSubmit?.({
        medicationId: selectedMedicationId,
        concentrationValue,
        concentrationUnits,
        totalVolume,
        batchNumber: batchNumber.trim() || undefined,
        expirationDate: expirationDate || undefined,
        mixedDate: mixedDate || undefined,
        notes: notes.trim() || undefined,
      })
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save vial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Syringe className="h-5 w-5" />
          {initialData?.id ? 'Edit Vial' : 'New Vial'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Medication Selection */}
          {!medicationId && medications.length > 0 && (
            <div className="space-y-2">
              <label htmlFor="medication" className="text-sm font-medium">
                Medication *
              </label>
              <select
                id="medication"
                value={selectedMedicationId}
                onChange={e => setSelectedMedicationId(e.target.value)}
                className="input-mm w-full"
                required
              >
                <option value="">Select a medication...</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.name} ({med.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Concentration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Vial Concentration *</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={concentrationValue}
                onChange={e => setConcentrationValue(parseFloat(e.target.value) || 0)}
                step="0.1"
                min="0.001"
                required
                className="flex-1"
              />
              <select
                value={concentrationUnits}
                onChange={e => setConcentrationUnits(e.target.value as ConcentrationUnits)}
                className="input-mm w-32"
                required
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
            <label htmlFor="totalVolume" className="text-sm font-medium">
              Total Volume (mL) *
            </label>
            <Input
              id="totalVolume"
              type="number"
              value={totalVolume}
              onChange={e => setTotalVolume(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0.1"
              required
            />
          </div>

          {/* Mixed Date */}
          <div className="space-y-2">
            <label htmlFor="mixedDate" className="text-sm font-medium">
              Mixed/Reconstituted Date
            </label>
            <Input
              id="mixedDate"
              type="date"
              value={mixedDate}
              onChange={e => setMixedDate(e.target.value)}
            />
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <label htmlFor="expirationDate" className="text-sm font-medium">
              Expiration Date
            </label>
            <Input
              id="expirationDate"
              type="date"
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
            />
          </div>

          {/* Batch Number */}
          <div className="space-y-2">
            <label htmlFor="batchNumber" className="text-sm font-medium">
              Batch/Lot Number
            </label>
            <Input
              id="batchNumber"
              type="text"
              value={batchNumber}
              onChange={e => setBatchNumber(e.target.value)}
              placeholder="Optional batch identifier"
              maxLength={100}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional notes about this vial..."
              className="input-mm w-full min-h-[60px] resize-y"
              maxLength={1000}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
