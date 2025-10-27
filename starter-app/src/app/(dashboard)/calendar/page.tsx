'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Loader2, Activity, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'

interface CalendarInjection {
  id: string
  dateTime: string
  doseValue: number
  doseUnits: string
  protocol?: {
    name: string
    medication?: {
      name: string
    }
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [injections, setInjections] = useState<CalendarInjection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1

      const response = await fetch(`/api/injections/calendar?year=${year}&month=${month}`)
      if (!response.ok) throw new Error('Failed to fetch calendar data')

      const data = await response.json()
      setInjections(data.injections || [])
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate starting day offset
  const startDayOfWeek = monthStart.getDay()
  const previousMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => null)

  const allCalendarDays = [...previousMonthDays, ...daysInMonth]

  const getInjectionsForDate = (date: Date): CalendarInjection[] => {
    return injections.filter(inj => {
      const injDate = new Date(inj.dateTime)
      return isSameDay(injDate, date)
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const selectedDateInjections = selectedDate ? getInjectionsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold">Calendar</h1>
          <p className="mt-2 text-muted-foreground">
            View your injection history in a monthly calendar view
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-muted-foreground py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {allCalendarDays.map((day, index) => {
                        if (!day) {
                          return <div key={`empty-${index}`} className="aspect-square" />
                        }

                        const dayInjections = getInjectionsForDate(day)
                        const hasInjections = dayInjections.length > 0
                        const isDayToday = isToday(day)
                        const isSelected = selectedDate && isSameDay(day, selectedDate)

                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => setSelectedDate(day)}
                            className={`aspect-square rounded-lg border p-2 text-left transition-all hover:border-primary/30 ${
                              isDayToday
                                ? 'border-primary/50 bg-primary/5'
                                : 'border-border'
                            } ${
                              isSelected
                                ? 'ring-2 ring-primary'
                                : ''
                            } ${
                              !isSameMonth(day, currentDate)
                                ? 'opacity-30'
                                : ''
                            }`}
                          >
                            <div className="flex flex-col h-full">
                              <span
                                className={`text-sm font-medium ${
                                  isDayToday ? 'text-primary' : 'text-foreground'
                                }`}
                              >
                                {format(day, 'd')}
                              </span>
                              {hasInjections && (
                                <div className="mt-auto">
                                  <div className="flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span className="text-xs text-muted-foreground">
                                      {dayInjections.length}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                {selectedDate ? (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        <h3 className="font-heading text-lg font-semibold">
                          {format(selectedDate, 'MMMM d, yyyy')}
                        </h3>
                      </div>
                      {isToday(selectedDate) && (
                        <span className="text-xs font-medium text-primary">Today</span>
                      )}
                    </div>

                    {selectedDateInjections.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No injections on this date
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground mb-3">
                          {selectedDateInjections.length} injection
                          {selectedDateInjections.length !== 1 ? 's' : ''}
                        </p>
                        {selectedDateInjections.map(injection => {
                          const injTime = new Date(injection.dateTime)

                          return (
                            <div
                              key={injection.id}
                              className="p-3 rounded-lg border border-border bg-muted/30"
                            >
                              <div className="flex items-start gap-2">
                                <Activity className="h-4 w-4 text-primary mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {injection.protocol?.medication?.name || 'Unknown'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {injection.protocol?.name || 'Unknown Protocol'}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-medium">
                                      {injection.doseValue} {injection.doseUnits}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {format(injTime, 'h:mm a')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Select a date to view injection details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monthly Summary */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              {format(currentDate, 'MMMM')} Summary
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Injections</p>
                <p className="text-2xl font-bold">{injections.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Days with Injections</p>
                <p className="text-2xl font-bold">
                  {new Set(injections.map(inj => new Date(inj.dateTime).toDateString())).size}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Average per Day</p>
                <p className="text-2xl font-bold">
                  {injections.length > 0
                    ? (
                        injections.length /
                        new Set(injections.map(inj => new Date(inj.dateTime).toDateString())).size
                      ).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
