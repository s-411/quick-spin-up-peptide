'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InjectionForm, InjectionFormData } from '@/components/peptide/injection-form'
import type { Protocol, Vial, InjectionSite } from '@/types'
import { Activity, Loader2, Edit, Trash2, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface Injection {
  id: string
  protocolId: string
  vialId: string
  dateTime: string
  doseValue: number
  doseUnits: string
  volumeMl: number
  site?: InjectionSite
  notes?: string
  protocol?: {
    name: string
    medication?: {
      name: string
    }
  }
  vial?: {
    concentrationValue: number
    concentrationUnits: string
  }
}

export default function InjectionsPage() {
  const [injections, setInjections] = useState<Injection[]>([])
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [vials, setVials] = useState<Vial[]>([])
  const [recentSites, setRecentSites] = useState<InjectionSite[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingInjection, setEditingInjection] = useState<Injection | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [injectionsRes, protocolsRes, vialsRes] = await Promise.all([
        fetch(`/api/injections?page=${page}&limit=20`),
        fetch('/api/protocols'),
        fetch('/api/vials'),
      ])

      if (!injectionsRes.ok || !protocolsRes.ok || !vialsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [injectionsData, protocolsData, vialsData] = await Promise.all([
        injectionsRes.json(),
        protocolsRes.json(),
        vialsRes.json(),
      ])

      setInjections(injectionsData.injections || [])
      setProtocols(protocolsData.protocols?.filter((p: Protocol) => p.isActive) || [])
      setVials(vialsData.vials || [])
      setHasMore(injectionsData.hasMore || false)

      // Extract recent sites from injections
      const sites = (injectionsData.injections || [])
        .filter((inj: Injection) => inj.site)
        .map((inj: Injection) => inj.site!)
        .slice(0, 10)
      setRecentSites(sites)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleCreateInjection = async (data: InjectionFormData) => {
    const response = await fetch('/api/injections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to log injection')
    }

    await fetchData()
    setShowForm(false)
  }

  const handleUpdateInjection = async (data: InjectionFormData) => {
    if (!editingInjection) return

    const response = await fetch(`/api/injections/${editingInjection.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update injection')
    }

    await fetchData()
    setEditingInjection(null)
  }

  const handleDeleteInjection = async (injectionId: string) => {
    if (!confirm('Are you sure you want to delete this injection record?')) return

    const response = await fetch(`/api/injections/${injectionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      alert(error.error || 'Failed to delete injection')
      return
    }

    await fetchData()
  }

  const getSiteLabel = (site?: InjectionSite): string => {
    if (!site) return 'Not specified'

    const labels: Record<InjectionSite, string> = {
      left_glute: 'Left Glute',
      right_glute: 'Right Glute',
      left_delt: 'Left Deltoid',
      right_delt: 'Right Deltoid',
      left_thigh: 'Left Thigh',
      right_thigh: 'Right Thigh',
      abdomen_upper_left: 'Upper Left Abdomen',
      abdomen_upper_right: 'Upper Right Abdomen',
      abdomen_lower_left: 'Lower Left Abdomen',
      abdomen_lower_right: 'Lower Right Abdomen',
      left_ventrogluteal: 'Left Ventrogluteal',
      right_ventrogluteal: 'Right Ventrogluteal',
    }

    return labels[site] || site
  }

  if (loading && page === 1) {
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
            <h1 className="font-heading text-4xl font-bold">Injections</h1>
            <p className="mt-2 text-muted-foreground">Log and track your injection history</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            disabled={showForm || !!editingInjection || protocols.length === 0}
          >
            <Activity className="h-4 w-4 mr-2" />
            Log Injection
          </Button>
        </div>

        {/* No protocols warning */}
        {protocols.length === 0 && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              You need to create protocols before logging injections.{' '}
              <a href="/protocols" className="font-medium underline">
                Create protocols
              </a>
            </p>
          </div>
        )}

        {/* Create Injection Form */}
        {showForm && (
          <div className="mb-6">
            <InjectionForm
              protocols={protocols}
              vials={vials}
              recentSites={recentSites}
              onSubmit={handleCreateInjection}
              onCancel={() => setShowForm(false)}
              submitLabel="Log Injection"
            />
          </div>
        )}

        {/* Edit Injection Form */}
        {editingInjection && (
          <div className="mb-6">
            <InjectionForm
              protocols={protocols}
              vials={vials}
              recentSites={recentSites}
              initialData={{
                id: editingInjection.id,
                protocolId: editingInjection.protocolId,
                vialId: editingInjection.vialId,
                dateTime: new Date(editingInjection.dateTime).toISOString().slice(0, 16),
                doseValue: editingInjection.doseValue,
                doseUnits: editingInjection.doseUnits as any,
                volumeMl: editingInjection.volumeMl,
                site: editingInjection.site,
                notes: editingInjection.notes,
              }}
              onSubmit={handleUpdateInjection}
              onCancel={() => setEditingInjection(null)}
              submitLabel="Update Injection"
            />
          </div>
        )}

        {/* Injections History */}
        {injections.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-lg border border-dashed border-border bg-muted/30">
            <div className="max-w-md mx-auto">
              <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No injections logged</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start tracking your injections to monitor adherence and manage your protocols.
              </p>
              {protocols.length > 0 && (
                <Button onClick={() => setShowForm(true)}>
                  <Activity className="h-4 w-4 mr-2" />
                  Log Your First Injection
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {injections.map(injection => {
              const injectionDate = new Date(injection.dateTime)

              return (
                <Card key={injection.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {injection.protocol?.medication?.name || 'Unknown Medication'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {injection.protocol?.name || 'Unknown Protocol'}
                            </p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-4 md:grid-cols-4 pl-13">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                            <p className="text-sm font-medium">
                              {format(injectionDate, 'MMM d, yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(injectionDate, 'h:mm a')}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Dose</p>
                            <p className="text-sm font-medium">
                              {injection.doseValue} {injection.doseUnits}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {injection.volumeMl.toFixed(3)} mL
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Vial</p>
                            <p className="text-sm font-medium">
                              {injection.vial?.concentrationValue}{' '}
                              {injection.vial?.concentrationUnits}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Injection Site</p>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <p className="text-sm font-medium">{getSiteLabel(injection.site)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {injection.notes && (
                          <div className="mt-4 pt-4 border-t border-border pl-13">
                            <p className="text-sm text-muted-foreground">{injection.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingInjection(injection)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteInjection(injection.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
