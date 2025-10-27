'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProtocolForm, ProtocolFormData } from '@/components/peptide/protocol-form'
import { SchedulePreview } from '@/components/peptide/schedule-preview'
import type { Protocol, Medication, ScheduledInjection } from '@/types'
import { Plus, Calendar, Edit, Pause, Play, Trash2, Loader2, Eye } from 'lucide-react'

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null)
  const [previewingProtocol, setPreviewingProtocol] = useState<Protocol | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [protocolsRes, medicationsRes] = await Promise.all([
        fetch('/api/protocols'),
        fetch('/api/medications'),
      ])

      if (!protocolsRes.ok || !medicationsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [protocolsData, medicationsData] = await Promise.all([
        protocolsRes.json(),
        medicationsRes.json(),
      ])

      setProtocols(protocolsData.protocols || [])
      setMedications(medicationsData.medications || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateProtocol = async (data: ProtocolFormData) => {
    const response = await fetch('/api/protocols', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create protocol')
    }

    await fetchData()
    setShowForm(false)
  }

  const handleUpdateProtocol = async (data: ProtocolFormData) => {
    if (!editingProtocol) return

    const response = await fetch(`/api/protocols/${editingProtocol.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update protocol')
    }

    await fetchData()
    setEditingProtocol(null)
  }

  const handleToggleActive = async (protocolId: string, currentStatus: boolean) => {
    const response = await fetch(`/api/protocols/${protocolId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    })

    if (!response.ok) {
      const error = await response.json()
      alert(error.error || 'Failed to update protocol')
      return
    }

    await fetchData()
  }

  const handleDeleteProtocol = async (protocolId: string) => {
    if (!confirm('Are you sure you want to delete this protocol?')) return

    const response = await fetch(`/api/protocols/${protocolId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      alert(error.error || 'Failed to delete protocol')
      return
    }

    await fetchData()
  }

  const getScheduleTypeLabel = (protocol: Protocol): string => {
    switch (protocol.scheduleType) {
      case 'every_x_days':
        return `Every ${protocol.frequencyDays} day${protocol.frequencyDays !== 1 ? 's' : ''}`
      case 'weekly':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return protocol.weeklyDays
          ?.map(d => days[d])
          .join(', ') || 'Weekly'
      case 'custom':
        return 'Custom Schedule'
      default:
        return protocol.scheduleType
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold">Protocols</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your injection schedules and dosing protocols
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            disabled={showForm || !!editingProtocol || medications.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Protocol
          </Button>
        </div>

        {/* No medications warning */}
        {medications.length === 0 && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              You need to add medications before creating protocols.{' '}
              <a href="/medications" className="font-medium underline">
                Add medications
              </a>
            </p>
          </div>
        )}

        {/* Create Protocol Form */}
        {showForm && (
          <div className="mb-6">
            <ProtocolForm
              medications={medications}
              onSubmit={handleCreateProtocol}
              onCancel={() => setShowForm(false)}
              submitLabel="Create Protocol"
            />
          </div>
        )}

        {/* Edit Protocol Form */}
        {editingProtocol && (
          <div className="mb-6">
            <ProtocolForm
              medications={medications}
              initialData={{
                id: editingProtocol.id,
                medicationId: editingProtocol.medicationId,
                name: editingProtocol.name,
                doseValue: editingProtocol.doseValue,
                doseUnits: editingProtocol.doseUnits,
                scheduleType: editingProtocol.scheduleType,
                frequencyDays: editingProtocol.frequencyDays,
                weeklyDays: editingProtocol.weeklyDays,
                customSchedule: editingProtocol.customSchedule,
                timeOfDay: editingProtocol.timeOfDay,
                preferredSites: editingProtocol.preferredSites,
                rotateSites: editingProtocol.rotateSites,
                startDate: editingProtocol.startDate?.split('T')[0],
                endDate: editingProtocol.endDate?.split('T')[0],
                notes: editingProtocol.notes,
              }}
              onSubmit={handleUpdateProtocol}
              onCancel={() => setEditingProtocol(null)}
              submitLabel="Update Protocol"
            />
          </div>
        )}

        {/* Protocol Preview */}
        {previewingProtocol && (
          <div className="mb-6">
            <SchedulePreview protocol={previewingProtocol} daysAhead={28} showTime />
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => setPreviewingProtocol(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        )}

        {/* Protocols List */}
        {protocols.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-lg border border-dashed border-border bg-muted/30">
            <div className="max-w-md mx-auto">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No protocols yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first dosing protocol to start tracking injections and managing
                schedules.
              </p>
              {medications.length > 0 && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Protocol
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {protocols.map(protocol => {
              const medication = medications.find(m => m.id === protocol.medicationId)

              return (
                <Card key={protocol.id} className={!protocol.isActive ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="font-heading text-xl flex items-center gap-2">
                          {protocol.name}
                          {protocol.isActive ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20">
                              Paused
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {medication?.name || 'Unknown Medication'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewingProtocol(protocol)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingProtocol(protocol)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(protocol.id, protocol.isActive)}
                        >
                          {protocol.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProtocol(protocol.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Dose</p>
                        <p className="font-medium">
                          {protocol.doseValue} {protocol.doseUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Schedule</p>
                        <p className="font-medium">{getScheduleTypeLabel(protocol)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Time</p>
                        <p className="font-medium">{protocol.timeOfDay || 'Not set'}</p>
                      </div>
                    </div>

                    {protocol.notes && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">{protocol.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
