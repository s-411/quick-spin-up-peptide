'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Medication, DoseUnits, ScheduleType, InjectionSite } from '@/types'
import { Calendar, Loader2 } from 'lucide-react'

interface ProtocolFormProps {
  medicationId?: string
  medications?: Medication[]
  initialData?: {
    id?: string
    medicationId?: string
    name?: string
    doseValue?: number
    doseUnits?: DoseUnits
    scheduleType?: ScheduleType
    frequencyDays?: number
    weeklyDays?: number[]
    customSchedule?: string[]
    timeOfDay?: string
    preferredSites?: InjectionSite[]
    rotateSites?: boolean
    startDate?: string
    endDate?: string
    notes?: string
  }
  onSubmit?: (data: ProtocolFormData) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export interface ProtocolFormData {
  medicationId: string
  name: string
  doseValue: number
  doseUnits: DoseUnits
  scheduleType: ScheduleType
  frequencyDays?: number
  weeklyDays?: number[]
  customSchedule?: string[]
  timeOfDay?: string
  preferredSites?: InjectionSite[]
  rotateSites?: boolean
  startDate?: string
  endDate?: string
  notes?: string
}

const WEEKDAYS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

export function ProtocolForm({
  medicationId,
  medications = [],
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Protocol',
}: ProtocolFormProps) {
  const [selectedMedicationId, setSelectedMedicationId] = useState(
    initialData?.medicationId || medicationId || ''
  )
  const [name, setName] = useState(initialData?.name || '')
  const [doseValue, setDoseValue] = useState(initialData?.doseValue || 250)
  const [doseUnits, setDoseUnits] = useState<DoseUnits>(initialData?.doseUnits || 'mcg')
  const [scheduleType, setScheduleType] = useState<ScheduleType>(
    initialData?.scheduleType || 'every_x_days'
  )
  const [frequencyDays, setFrequencyDays] = useState(initialData?.frequencyDays || 7)
  const [weeklyDays, setWeeklyDays] = useState<number[]>(initialData?.weeklyDays || [])
  const [timeOfDay, setTimeOfDay] = useState(initialData?.timeOfDay || '08:00')
  const [rotateSites, setRotateSites] = useState(initialData?.rotateSites ?? true)
  const [startDate, setStartDate] = useState(
    initialData?.startDate || new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(initialData?.endDate || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWeekdayToggle = (day: number) => {
    setWeeklyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedMedicationId) {
      setError('Please select a medication')
      return
    }

    if (!name.trim()) {
      setError('Protocol name is required')
      return
    }

    if (doseValue <= 0) {
      setError('Dose must be greater than 0')
      return
    }

    if (scheduleType === 'every_x_days' && frequencyDays < 1) {
      setError('Frequency must be at least 1 day')
      return
    }

    if (scheduleType === 'weekly' && weeklyDays.length === 0) {
      setError('Please select at least one day of the week')
      return
    }

    try {
      setLoading(true)
      await onSubmit?.({
        medicationId: selectedMedicationId,
        name: name.trim(),
        doseValue,
        doseUnits,
        scheduleType,
        frequencyDays: scheduleType === 'every_x_days' ? frequencyDays : undefined,
        weeklyDays: scheduleType === 'weekly' ? weeklyDays : undefined,
        timeOfDay: timeOfDay || undefined,
        rotateSites,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes: notes.trim() || undefined,
      })
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save protocol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {initialData?.id ? 'Edit Protocol' : 'New Protocol'}
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

          {/* Protocol Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Protocol Name *
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Daily Morning Protocol"
              required
              maxLength={255}
            />
          </div>

          {/* Dose */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dose Per Injection *</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={doseValue}
                onChange={e => setDoseValue(parseFloat(e.target.value) || 0)}
                step="0.1"
                min="0.001"
                required
                className="flex-1"
              />
              <select
                value={doseUnits}
                onChange={e => setDoseUnits(e.target.value as DoseUnits)}
                className="input-mm w-32"
                required
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="IU">IU</option>
                <option value="units">units</option>
                <option value="mL">mL</option>
              </select>
            </div>
          </div>

          {/* Schedule Type */}
          <div className="space-y-2">
            <label htmlFor="scheduleType" className="text-sm font-medium">
              Schedule Type *
            </label>
            <select
              id="scheduleType"
              value={scheduleType}
              onChange={e => setScheduleType(e.target.value as ScheduleType)}
              className="input-mm w-full"
              required
            >
              <option value="every_x_days">Every X Days</option>
              <option value="weekly">Specific Days of Week</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>

          {/* Frequency (Every X Days) */}
          {scheduleType === 'every_x_days' && (
            <div className="space-y-2">
              <label htmlFor="frequencyDays" className="text-sm font-medium">
                Every X Days *
              </label>
              <Input
                id="frequencyDays"
                type="number"
                value={frequencyDays}
                onChange={e => setFrequencyDays(parseInt(e.target.value) || 1)}
                min="1"
                max="365"
                required
              />
              <p className="text-xs text-muted-foreground">
                Inject every {frequencyDays} day{frequencyDays !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Weekly Days */}
          {scheduleType === 'weekly' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Days of Week *</label>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map(day => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={weeklyDays.includes(day.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleWeekdayToggle(day.value)}
                    className="w-full"
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Time of Day */}
          <div className="space-y-2">
            <label htmlFor="timeOfDay" className="text-sm font-medium">
              Preferred Time
            </label>
            <Input
              id="timeOfDay"
              type="time"
              value={timeOfDay}
              onChange={e => setTimeOfDay(e.target.value)}
            />
          </div>

          {/* Rotate Sites */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rotateSites}
                onChange={e => setRotateSites(e.target.checked)}
                className="w-4 h-4 rounded border-input"
              />
              <span className="text-sm font-medium">Auto-rotate injection sites</span>
            </label>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date (Optional)
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
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
              placeholder="Optional protocol notes..."
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
