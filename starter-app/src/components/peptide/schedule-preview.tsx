'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import type { Protocol, ScheduledInjection } from '@/types'
import { generateSchedulePreview } from '@/lib/services/protocol-service'
import { format, isSameDay, startOfDay } from 'date-fns'

interface SchedulePreviewProps {
  protocol: Protocol
  daysAhead?: number
  lastInjectionDate?: Date
  showTime?: boolean
}

export function SchedulePreview({
  protocol,
  daysAhead = 28,
  lastInjectionDate,
  showTime = false,
}: SchedulePreviewProps) {
  const [schedule, setSchedule] = useState<ScheduledInjection[]>([])

  useEffect(() => {
    try {
      const preview = generateSchedulePreview(protocol, daysAhead, lastInjectionDate)
      setSchedule(preview)
    } catch (error) {
      console.error('Schedule preview error:', error)
      setSchedule([])
    }
  }, [protocol, daysAhead, lastInjectionDate])

  if (schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Schedule Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No upcoming injections scheduled</p>
        </CardContent>
      </Card>
    )
  }

  const today = startOfDay(new Date())
  const groupedByWeek: Record<string, ScheduledInjection[]> = {}

  schedule.forEach(injection => {
    const weekStart = startOfDay(
      new Date(injection.scheduledDate.getTime() - injection.scheduledDate.getDay() * 86400000)
    )
    const weekKey = format(weekStart, 'yyyy-MM-dd')
    if (!groupedByWeek[weekKey]) {
      groupedByWeek[weekKey] = []
    }
    groupedByWeek[weekKey].push(injection)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Schedule Preview
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            Next {daysAhead} days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedByWeek).map(([weekKey, injections]) => (
          <div key={weekKey} className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Week of {format(new Date(weekKey), 'MMM d')}
            </h4>
            <div className="space-y-1">
              {injections.map((injection, index) => {
                const isToday = isSameDay(injection.scheduledDate, today)
                const isPast = injection.scheduledDate < today

                return (
                  <div
                    key={`${weekKey}-${index}`}
                    className={`flex items-center justify-between p-2 rounded-md border transition-colors ${
                      isToday
                        ? 'bg-primary/10 border-primary/30'
                        : isPast
                          ? 'bg-muted/50 border-border opacity-60'
                          : 'bg-background border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isToday
                            ? 'bg-primary'
                            : isPast
                              ? 'bg-muted-foreground/30'
                              : 'bg-muted-foreground/50'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {format(injection.scheduledDate, 'EEE, MMM d')}
                          {isToday && (
                            <span className="ml-2 text-xs text-primary font-semibold">TODAY</span>
                          )}
                        </p>
                        {showTime && injection.scheduledTime && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {injection.scheduledTime}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {injection.doseValue} {injection.doseUnits}
                      </p>
                      {injection.suggestedSite && (
                        <p className="text-xs text-muted-foreground">{injection.suggestedSite}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
