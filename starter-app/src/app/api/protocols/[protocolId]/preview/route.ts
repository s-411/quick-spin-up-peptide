/**
 * Protocol Schedule Preview API Route
 *
 * GET /api/protocols/[protocolId]/preview - Get schedule preview for next N days
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateSchedulePreview } from '@/lib/services/protocol-service'

interface RouteParams {
  params: {
    protocolId: string
  }
}

/**
 * GET /api/protocols/[protocolId]/preview
 *
 * Query params:
 * - days: number - days ahead to preview (default: 30, max: 90)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { protocolId } = params
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
    const daysParam = searchParams.get('days')
    const daysAhead = Math.min(parseInt(daysParam || '30', 10), 90)

    // Fetch protocol with medication to verify ownership
    const { data: protocol, error: fetchError } = await supabase
      .from('protocols')
      .select(`
        *,
        medication:medications!inner(user_id)
      `)
      .eq('id', protocolId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !protocol) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    // Verify ownership
    if ((protocol as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    // Generate schedule preview
    const scheduleDates = generateSchedulePreview(protocol as any, daysAhead)

    // Format as ISO date strings
    const schedule = scheduleDates.map(date => ({
      date: date.toISOString().split('T')[0],
      timestamp: date.toISOString(),
      dayOfWeek: date.getDay(),
      weekNumber: Math.floor((date.getTime() - new Date(protocol.start_date).getTime()) / (7 * 24 * 60 * 60 * 1000)),
    }))

    return NextResponse.json({
      protocolId,
      protocolName: protocol.name,
      scheduleType: protocol.schedule_type,
      daysAhead,
      schedule,
      totalInjections: schedule.length,
    })
  } catch (error) {
    console.error('Protocol preview GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
