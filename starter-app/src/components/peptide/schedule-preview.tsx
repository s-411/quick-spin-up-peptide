'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Protocol } from '@/types'

interface SchedulePreviewProps {
  protocol: Protocol
  daysAhead?: number
  lastInjectionDate?: Date
  showTime?: boolean
}

export function SchedulePreview({ protocol }: SchedulePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Schedule preview for {protocol.name}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {/* TODO: Implement schedule preview functionality */}
          Schedule generation temporarily disabled - needs refactoring
        </p>
      </CardContent>
    </Card>
  )
}
