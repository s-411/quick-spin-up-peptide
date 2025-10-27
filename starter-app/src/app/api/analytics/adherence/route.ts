/**
 * Adherence Analytics API Route
 *
 * GET /api/analytics/adherence - Get adherence statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/analytics/adherence
 *
 * Query params:
 * - protocolId: string - specific protocol (optional, returns all if omitted)
 * - startDate: string (YYYY-MM-DD) - start of period (default: 30 days ago)
 * - endDate: string (YYYY-MM-DD) - end of period (default: today)
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
    const protocolId = searchParams.get('protocolId')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Calculate default date range (last 30 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Get user's active protocols
    let protocolsQuery = supabase
      .from('protocols')
      .select(
        `
        id,
        name,
        schedule_type,
        frequency_days,
        weekly_days,
        start_date,
        is_active,
        medication:medications!inner(id, name, type, user_id)
      `
      )
      .eq('medication.user_id', user.id)
      .is('deleted_at', null)

    if (protocolId) {
      protocolsQuery = protocolsQuery.eq('id', protocolId)
    }

    const { data: protocols, error: protocolsError } = await protocolsQuery

    if (protocolsError) {
      console.error('Error fetching protocols:', protocolsError)
      return NextResponse.json({ error: 'Failed to fetch protocols' }, { status: 500 })
    }

    if (!protocols || protocols.length === 0) {
      return NextResponse.json({
        adherence: [],
        summary: {
          overallAdherence: 0,
          totalProtocols: 0,
          activeProtocols: 0,
        },
      })
    }

    // Calculate adherence for each protocol
    const adherenceData = await Promise.all(
      protocols.map(async (protocol: any) => {
        // Get actual injections for this protocol in date range
        const { data: injections, error: injectionsError } = await supabase
          .from('injections')
          .select('id, date_time')
          .eq('protocol_id', protocol.id)
          .gte('date_time', `${startDateStr}T00:00:00Z`)
          .lte('date_time', `${endDateStr}T23:59:59Z`)
          .is('deleted_at', null)

        if (injectionsError) {
          console.error('Error fetching injections:', injectionsError)
          return null
        }

        const actualInjections = injections?.length || 0

        // Calculate expected injections based on schedule type
        let expectedInjections = 0
        const daysDiff = Math.floor(
          (endDate.getTime() -
            Math.max(startDate.getTime(), new Date(protocol.start_date).getTime())) /
            (1000 * 60 * 60 * 24)
        )

        if (daysDiff <= 0) {
          // Protocol started after the period
          return {
            protocolId: protocol.id,
            protocolName: protocol.name,
            medicationName: protocol.medication.name,
            medicationType: protocol.medication.type,
            scheduleType: protocol.schedule_type,
            expectedInjections: 0,
            actualInjections: 0,
            adherencePercent: 100,
            isActive: protocol.is_active,
          }
        }

        if (protocol.schedule_type === 'every_x_days' && protocol.frequency_days) {
          expectedInjections = Math.floor(daysDiff / protocol.frequency_days)
        } else if (protocol.schedule_type === 'weekly' && protocol.weekly_days) {
          const weeks = Math.floor(daysDiff / 7)
          expectedInjections = weeks * protocol.weekly_days.length
        }

        // Calculate adherence percentage
        const adherencePercent =
          expectedInjections > 0
            ? Math.min(100, Math.round((actualInjections / expectedInjections) * 100))
            : 100

        // Get last injection date
        const lastInjection = injections?.[0]
        const lastInjectionDate = lastInjection
          ? new Date(lastInjection.date_time).toISOString().split('T')[0]
          : null

        // Calculate streak (consecutive injections on schedule)
        let streak = 0
        if (injections && injections.length > 0) {
          const sortedInjections = [...injections].sort(
            (a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
          )

          streak = 1 // Start with at least 1 if there's any injection
          if (protocol.schedule_type === 'every_x_days' && protocol.frequency_days) {
            for (let i = 0; i < sortedInjections.length - 1; i++) {
              const date1 = new Date(sortedInjections[i].date_time)
              const date2 = new Date(sortedInjections[i + 1].date_time)
              const daysBetween = Math.floor(
                (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
              )

              // Allow 1 day tolerance
              if (Math.abs(daysBetween - protocol.frequency_days) <= 1) {
                streak++
              } else {
                break
              }
            }
          }
        }

        return {
          protocolId: protocol.id,
          protocolName: protocol.name,
          medicationName: protocol.medication.name,
          medicationType: protocol.medication.type,
          scheduleType: protocol.schedule_type,
          expectedInjections,
          actualInjections,
          adherencePercent,
          lastInjectionDate,
          streak,
          isActive: protocol.is_active,
        }
      })
    )

    // Filter out null results
    const validAdherence = adherenceData.filter(a => a !== null)

    // Calculate overall summary
    const totalExpected = validAdherence.reduce((sum, a) => sum + (a?.expectedInjections || 0), 0)
    const totalActual = validAdherence.reduce((sum, a) => sum + (a?.actualInjections || 0), 0)
    const overallAdherence =
      totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 100

    return NextResponse.json({
      period: {
        startDate: startDateStr,
        endDate: endDateStr,
        days: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      },
      adherence: validAdherence,
      summary: {
        overallAdherence,
        totalProtocols: protocols.length,
        activeProtocols: protocols.filter((p: any) => p.is_active).length,
        totalExpectedInjections: totalExpected,
        totalActualInjections: totalActual,
      },
    })
  } catch (error) {
    console.error('Adherence GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
