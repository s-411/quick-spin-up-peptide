'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MedicationCard } from '@/components/peptide/medication-card'
import { MedicationForm, MedicationFormData } from '@/components/peptide/medication-form'
import { VialForm, VialFormData } from '@/components/peptide/vial-form'
import { ProtocolForm, ProtocolFormData } from '@/components/peptide/protocol-form'
import type { Medication } from '@/types'
import { Plus, Loader2 } from 'lucide-react'

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [addingVialToMedication, setAddingVialToMedication] = useState<string | null>(null)
  const [creatingProtocolForMedication, setCreatingProtocolForMedication] = useState<string | null>(
    null
  )

  const fetchMedications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/medications')
      if (!response.ok) throw new Error('Failed to fetch medications')

      const data = await response.json()
      setMedications(data.medications || [])
    } catch (error) {
      console.error('Error fetching medications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  const handleCreateMedication = async (data: MedicationFormData) => {
    const response = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create medication')
    }

    await fetchMedications()
    setShowMedicationForm(false)
  }

  const handleUpdateMedication = async (data: MedicationFormData) => {
    if (!editingMedication) return

    const response = await fetch(`/api/medications/${editingMedication.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update medication')
    }

    await fetchMedications()
    setEditingMedication(null)
  }

  const handleArchiveMedication = async (medicationId: string) => {
    if (!confirm('Are you sure you want to archive this medication?')) return

    const response = await fetch(`/api/medications/${medicationId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      alert(error.error || 'Failed to archive medication')
      return
    }

    await fetchMedications()
  }

  const handleAddVial = async (data: VialFormData) => {
    const response = await fetch('/api/vials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create vial')
    }

    await fetchMedications()
    setAddingVialToMedication(null)
  }

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

    await fetchMedications()
    setCreatingProtocolForMedication(null)
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
            <h1 className="font-heading text-4xl font-bold">Medications</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your peptides, TRT, and GLP-1 medications
            </p>
          </div>
          <Button
            onClick={() => setShowMedicationForm(true)}
            disabled={showMedicationForm || !!editingMedication}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {/* Create Medication Form */}
        {showMedicationForm && (
          <div className="mb-6">
            <MedicationForm
              onSubmit={handleCreateMedication}
              onCancel={() => setShowMedicationForm(false)}
              submitLabel="Create Medication"
            />
          </div>
        )}

        {/* Edit Medication Form */}
        {editingMedication && (
          <div className="mb-6">
            <MedicationForm
              initialData={{
                id: editingMedication.id,
                name: editingMedication.name,
                type: editingMedication.type,
                units: editingMedication.units,
                notes: editingMedication.notes,
              }}
              onSubmit={handleUpdateMedication}
              onCancel={() => setEditingMedication(null)}
              submitLabel="Update Medication"
            />
          </div>
        )}

        {/* Add Vial Form */}
        {addingVialToMedication && (
          <div className="mb-6">
            <VialForm
              medicationId={addingVialToMedication}
              onSubmit={handleAddVial}
              onCancel={() => setAddingVialToMedication(null)}
              submitLabel="Add Vial"
            />
          </div>
        )}

        {/* Create Protocol Form */}
        {creatingProtocolForMedication && (
          <div className="mb-6">
            <ProtocolForm
              medicationId={creatingProtocolForMedication}
              onSubmit={handleCreateProtocol}
              onCancel={() => setCreatingProtocolForMedication(null)}
              submitLabel="Create Protocol"
            />
          </div>
        )}

        {/* Medications Grid */}
        {medications.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-lg border border-dashed border-border bg-muted/30">
            <div className="max-w-md mx-auto">
              <h3 className="font-heading text-xl font-semibold mb-2">No medications yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Get started by adding your first medication. You can track peptides, TRT, GLP-1s,
                and other injectable medications.
              </p>
              <Button onClick={() => setShowMedicationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Medication
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {medications.map(medication => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onAddVial={setAddingVialToMedication}
                onCreateProtocol={setCreatingProtocolForMedication}
                onEdit={id => {
                  const med = medications.find(m => m.id === id)
                  if (med) setEditingMedication(med)
                }}
                onArchive={handleArchiveMedication}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
