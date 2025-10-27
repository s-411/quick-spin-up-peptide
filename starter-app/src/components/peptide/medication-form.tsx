'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { MedicationType, DoseUnits } from '@/types'
import { Pill, Loader2 } from 'lucide-react'

interface MedicationFormProps {
  initialData?: {
    id?: string
    name?: string
    type?: MedicationType
    units?: DoseUnits
    notes?: string
  }
  onSubmit?: (data: MedicationFormData) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export interface MedicationFormData {
  name: string
  type: MedicationType
  units: DoseUnits
  notes?: string
}

export function MedicationForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Medication',
}: MedicationFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState<MedicationType>(initialData?.type || 'peptide')
  const [units, setUnits] = useState<DoseUnits>(initialData?.units || 'mg')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Medication name is required')
      return
    }

    try {
      setLoading(true)
      await onSubmit?.({
        name: name.trim(),
        type,
        units,
        notes: notes.trim() || undefined,
      })
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save medication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          {initialData?.id ? 'Edit Medication' : 'New Medication'}
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

          {/* Medication Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Medication Name *
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Semaglutide, Testosterone Cypionate"
              required
              maxLength={255}
            />
          </div>

          {/* Medication Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Type *
            </label>
            <select
              id="type"
              value={type}
              onChange={e => setType(e.target.value as MedicationType)}
              className="input-mm w-full"
              required
            >
              <option value="peptide">Peptide</option>
              <option value="TRT">TRT (Testosterone)</option>
              <option value="GLP-1">GLP-1 (Semaglutide/Tirzepatide)</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Default Units */}
          <div className="space-y-2">
            <label htmlFor="units" className="text-sm font-medium">
              Default Dosing Units *
            </label>
            <select
              id="units"
              value={units}
              onChange={e => setUnits(e.target.value as DoseUnits)}
              className="input-mm w-full"
              required
            >
              <option value="mg">mg (milligrams)</option>
              <option value="mcg">mcg (micrograms)</option>
              <option value="IU">IU (International Units)</option>
              <option value="units">units</option>
              <option value="mL">mL (milliliters)</option>
            </select>
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
              placeholder="Optional notes about this medication..."
              className="input-mm w-full min-h-[80px] resize-y"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">{notes.length}/1000 characters</p>
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
