/**
 * Injections Calendar API Route
 *
 * GET /api/injections/calendar - Get calendar view of injections and reminders
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/injections/calendar
 *
 * Query params:
 * - month: string (YYYY-MM) - month to view (default: current month)
 * - includeReminders: boolean - include scheduled reminders (default: true)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')
    const includeReminders = searchParams.get('includeReminders') !== 'false'

    // Calculate date range for the month
    const targetDate = monthParam ? new Date(`${monthParam}-01`) : new Date()
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0) // Last day of month

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Fetch injections for the month
    const { data: injections, error: injectionsError } = await supabase
      .from('injections')
      .select(`
        id,
        date_time,
        dose_value,
        dose_units,
        site,
        protocol:protocols!inner(
          id,
          name,
          medication:medications!inner(id, name, type, user_id)
        )
      `)
      .gte('date_time', `${startDateStr}T00:00:00Z`)
      .lte('date_time', `${endDateStr}T23:59:59Z`)
      .is('deleted_at', null)

    if (injectionsError) {
      console.error('Error fetching injections:', injectionsError)
      return NextResponse.json({ error: 'Failed to fetch injections' }, { status: 500 })
    }

    // Filter to user's injections only
    const userInjections = injections?.filter(
      (inj: any) => inj.protocol?.medication?.user_id === user.id
    ) || []

    // Fetch reminders for the month if requested
    let reminders: any[] = []
    if (includeReminders) {
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .select(`
          id,
          next_due_date,
          next_due_time,
          status,
          protocol:protocols!inner(
            id,
            name,
            medication:medications!inner(id, name, type, user_id)
          )
        `)
        .gte('next_due_date', startDateStr)
        .lte('next_due_date', endDateStr)
        .in('status', ['pending', 'sent'])

      if (!remindersError && remindersData) {
        reminders = remindersData.filter(
          (rem: any) => rem.protocol?.medication?.user_id === user.id
        )
      }
    }

    // Group injections and reminders by date
    const calendar: Record<string, any> = {}

    // Initialize all days in the month
    for (let day = 1; day <= endDate.getDate(); day++) {
      const dateStr = new Date(year, month, day).toISOString().split('T')[0]
      calendar[dateStr] = {
        date: dateStr,
        dayOfWeek: new Date(year, month, day).getDay(),
        injections: [],
        reminders: [],
        hasInjection: false,
        hasReminder: false,
      }
    }

    // Add injections to calendar
    userInjections.forEach((injection: any) => {
      const dateStr = injection.date_time.split('T')[0]
      if (calendar[dateStr]) {
        calendar[dateStr].injections.push({
          id: injection.id,
          medicationName: injection.protocol?.medication?.name,
          medicationType: injection.protocol?.medication?.type,
          protocolName: injection.protocol?.name,
          dose: `${injection.dose_value} ${injection.dose_units}`,
          site: injection.site,
          time: injection.date_time.split('T')[1]?.substring(0, 5) || null,
        })
        calendar[dateStr].hasInjection = true
      }
    })

    // Add reminders to calendar
    reminders.forEach((reminder: any) => {
      const dateStr = reminder.next_due_date
      if (calendar[dateStr]) {
        calendar[dateStr].reminders.push({
          id: reminder.id,
          medicationName: reminder.protocol?.medication?.name,
          medicationType: reminder.protocol?.medication?.type,
          protocolName: reminder.protocol?.name,
          time: reminder.next_due_time,
          status: reminder.status,
        })
        calendar[dateStr].hasReminder = true
      }
    })

    // Convert to array sorted by date
    const calendarArray = Object.values(calendar).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    )

    return NextResponse.json({
      month: `${year}-${String(month + 1).padStart(2, '0')}`,
      startDate: startDateStr,
      endDate: endDateStr,
      calendar: calendarArray,
      summary: {
        totalInjections: userInjections.length,
        totalReminders: reminders.length,
        daysWithActivity: calendarArray.filter((day: any) => day.hasInjection || day.hasReminder).length,
      },
    })
  } catch (error) {
    console.error('Calendar GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
