'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Medication } from '@/types'
import { MoreHorizontal, Plus, Archive } from 'lucide-react'

interface MedicationCardProps {
  medication: Medication & {
    vials?: any[]
    protocols?: any[]
  }
  onAddVial?: (medicationId: string) => void
  onCreateProtocol?: (medicationId: string) => void
  onEdit?: (medicationId: string) => void
  onArchive?: (medicationId: string) => void
}

const medicationTypeColors = {
  peptide: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  TRT: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  'GLP-1': 'bg-green-500/10 text-green-700 dark:text-green-400',
  other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
}

export function MedicationCard({
  medication,
  onAddVial,
  onCreateProtocol,
  onEdit,
  onArchive,
}: MedicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeVials = medication.vials?.filter(v => !v.deleted_at && v.remaining_volume > 0) || []
  const activeProtocols = medication.protocols?.filter(p => !p.deleted_at && p.is_active) || []

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="font-heading text-xl">{medication.name}</CardTitle>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  medicationTypeColors[medication.type]
                }`}
              >
                {medication.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Units: {medication.units}</p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active Vials</p>
            <p className="text-2xl font-bold">{activeVials.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active Protocols</p>
            <p className="text-2xl font-bold">{activeProtocols.length}</p>
          </div>
        </div>

        {/* Notes */}
        {medication.notes && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{medication.notes}</p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddVial?.(medication.id)}
            className="flex-1 min-w-[120px]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Vial
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCreateProtocol?.(medication.id)}
            className="flex-1 min-w-[120px]"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Protocol
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Vials List */}
            {activeVials.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Active Vials</h4>
                <div className="space-y-2">
                  {activeVials.map((vial: any) => (
                    <div
                      key={vial.id}
                      className="flex justify-between items-center text-sm p-2 rounded bg-muted/50"
                    >
                      <span>
                        {vial.concentration_value} {vial.concentration_units}
                      </span>
                      <span className="text-muted-foreground">
                        {vial.remaining_volume.toFixed(1)}/{vial.total_volume.toFixed(1)} mL
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Protocols List */}
            {activeProtocols.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Active Protocols</h4>
                <div className="space-y-2">
                  {activeProtocols.map((protocol: any) => (
                    <div
                      key={protocol.id}
                      className="flex justify-between items-center text-sm p-2 rounded bg-muted/50"
                    >
                      <span>{protocol.name}</span>
                      <span className="text-muted-foreground">
                        {protocol.dose_value} {protocol.dose_units}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(medication.id)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onArchive?.(medication.id)}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
