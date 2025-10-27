'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Protocol, Vial, InjectionSite, DoseUnits } from '@/types'
import { InjectionSiteSelector } from './injection-site-selector'
import { Activity, Loader2 } from 'lucide-react'

interface InjectionFormProps {
  protocolId?: string
  protocols?: Protocol[]
  vials?: Vial[]
  recentSites?: InjectionSite[]
  initialData?: {
    id?: string
    protocolId?: string
    vialId?: string
    dateTime?: string
    doseValue?: number
    doseUnits?: DoseUnits
    volumeMl?: number
    site?: InjectionSite
    notes?: string
  }
  onSubmit?: (data: InjectionFormData) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export interface InjectionFormData {
  protocolId: string
  vialId: string
  dateTime: string
  doseValue: number
  doseUnits: DoseUnits
  volumeMl: number
  site?: InjectionSite
  notes?: string
}

export function InjectionForm({
  protocolId,
  protocols = [],
  vials = [],
  recentSites = [],
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Log Injection',
}: InjectionFormProps) {
  const [selectedProtocolId, setSelectedProtocolId] = useState(
    initialData?.protocolId || protocolId || ''
  )
  const [selectedVialId, setSelectedVialId] = useState(initialData?.vialId || '')
  const [dateTime, setDateTime] = useState(
    initialData?.dateTime || new Date().toISOString().slice(0, 16)
  )
  const [doseValue, setDoseValue] = useState(initialData?.doseValue || 0)
  const [doseUnits, setDoseUnits] = useState<DoseUnits>(initialData?.doseUnits || 'mcg')
  const [volumeMl, setVolumeMl] = useState(initialData?.volumeMl || 0)
  const [site, setSite] = useState<InjectionSite | undefined>(initialData?.site)
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-populate from protocol selection
  useEffect(() => {
    if (selectedProtocolId && protocols.length > 0) {
      const protocol = protocols.find(p => p.id === selectedProtocolId)
      if (protocol && !initialData?.id) {
        setDoseValue(protocol.doseValue)
        setDoseUnits(protocol.doseUnits)
      }
    }
  }, [selectedProtocolId, protocols, initialData])

  // Filter vials by protocol's medication
  const availableVials = vials.filter(vial => {
    const protocol = protocols.find(p => p.id === selectedProtocolId)
    return protocol ? vial.medicationId === protocol.medicationId : true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedProtocolId) {
      setError('Please select a protocol')
      return
    }

    if (!selectedVialId) {
      setError('Please select a vial')
      return
    }

    if (doseValue <= 0) {
      setError('Dose must be greater than 0')
      return
    }

    if (volumeMl <= 0) {
      setError('Volume must be greater than 0')
      return
    }

    const selectedVial = vials.find(v => v.id === selectedVialId)
    if (selectedVial && volumeMl > selectedVial.remainingVolume) {
      setError(
        `Volume exceeds remaining vial volume (${selectedVial.remainingVolume.toFixed(2)} mL)`
      )
      return
    }

    try {
      setLoading(true)
      await onSubmit?.({
        protocolId: selectedProtocolId,
        vialId: selectedVialId,
        dateTime,
        doseValue,
        doseUnits,
        volumeMl,
        site,
        notes: notes.trim() || undefined,
      })
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to log injection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {initialData?.id ? 'Edit Injection' : 'Log Injection'}
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

            {/* Protocol Selection */}
            {!protocolId && protocols.length > 0 && (
              <div className="space-y-2">
                <label htmlFor="protocol" className="text-sm font-medium">
                  Protocol *
                </label>
                <select
                  id="protocol"
                  value={selectedProtocolId}
                  onChange={e => setSelectedProtocolId(e.target.value)}
                  className="input-mm w-full"
                  required
                >
                  <option value="">Select a protocol...</option>
                  {protocols.map(protocol => (
                    <option key={protocol.id} value={protocol.id}>
                      {protocol.name} ({protocol.doseValue} {protocol.doseUnits})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Vial Selection */}
            <div className="space-y-2">
              <label htmlFor="vial" className="text-sm font-medium">
                Vial *
              </label>
              <select
                id="vial"
                value={selectedVialId}
                onChange={e => setSelectedVialId(e.target.value)}
                className="input-mm w-full"
                required
                disabled={!selectedProtocolId && !protocolId}
              >
                <option value="">Select a vial...</option>
                {availableVials.map(vial => (
                  <option key={vial.id} value={vial.id}>
                    {vial.concentrationValue} {vial.concentrationUnits} - Remaining:{' '}
                    {vial.remainingVolume.toFixed(2)} mL
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <label htmlFor="dateTime" className="text-sm font-medium">
                Date & Time *
              </label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                required
              />
            </div>

            {/* Dose */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dose *</label>
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

            {/* Volume */}
            <div className="space-y-2">
              <label htmlFor="volumeMl" className="text-sm font-medium">
                Volume (mL) *
              </label>
              <Input
                id="volumeMl"
                type="number"
                value={volumeMl}
                onChange={e => setVolumeMl(parseFloat(e.target.value) || 0)}
                step="0.001"
                min="0.001"
                required
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
                placeholder="Optional notes about this injection..."
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

      {/* Injection Site Selector */}
      <InjectionSiteSelector value={site} onChange={setSite} recentSites={recentSites} />
    </div>
  )
}
