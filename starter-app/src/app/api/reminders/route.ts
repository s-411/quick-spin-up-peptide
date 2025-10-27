/**
 * Reminders API Routes
 *
 * GET /api/reminders - List upcoming reminders
 * PATCH /api/reminders/[id] - Update reminder status (snooze, complete, cancel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const daysAhead = parseInt(searchParams.get('daysAhead') || '7')

    const today = new Date().toISOString().split('T')[0]
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const { data: reminders, error: fetchError } = await supabase
      .from('reminders')
      .select(`
        *,
        protocol:protocols!inner(
          *,
          medication:medications!inner(*)
        )
      `)
      .eq('status', status)
      .gte('next_due_date', today)
      .lte('next_due_date', futureDate)
      .order('next_due_date', { ascending: true })

    if (fetchError) {
      console.error('Error fetching reminders:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 })
    }

    // Filter to user's reminders only
    const userReminders = reminders?.filter(
      (rem: any) => rem.protocol?.medication?.user_id === user.id
    ) || []

    return NextResponse.json({
      reminders: userReminders,
      count: userReminders.length,
    })
  } catch (error) {
    console.error('Reminders GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
