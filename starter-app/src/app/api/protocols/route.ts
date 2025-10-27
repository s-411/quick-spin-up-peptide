/**
 * Protocols API Routes
 *
 * GET /api/protocols - List all protocols for authenticated user
 * POST /api/protocols - Create a new protocol
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { validateProtocol, generateSchedulePreview } from '@/lib/services/protocol-service'

// Validation schema for creating a protocol
const createProtocolSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  scheduleType: z.enum(['every_x_days', 'weekly', 'custom'], {
    errorMap: () => ({ message: 'Invalid schedule type' }),
  }),
  frequencyDays: z.number().positive().optional(),
  weeklyDays: z.array(z.number().min(0).max(6)).optional(),
  customSchedule: z.record(z.unknown()).optional(),
  cycleLengthWeeks: z.number().positive().optional(),
  offWeeks: z.number().nonnegative().optional(),
  doseValue: z.number().positive('Dose must be positive'),
  doseUnits: z.enum(['mg', 'IU', 'mcg', 'units', 'mL'], {
    errorMap: () => ({ message: 'Invalid dose units' }),
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  timeOfDay: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional().nullable(),
  siteRotation: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/protocols
 *
 * Query params:
 * - medicationId: string - filter by medication
 * - active: boolean - filter by active status
 * - includeSchedule: boolean - include preview schedule
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
    const medicationId = searchParams.get('medicationId')
    const activeFilter = searchParams.get('active')
    const includeSchedule = searchParams.get('includeSchedule') === 'true'

    // Build query - join with medications to verify ownership
    let query = supabase
      .from('protocols')
      .select(`
        *,
        medication:medications(*)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // Filter by medication if specified
    if (medicationId) {
      query = query.eq('medication_id', medicationId)
    }

    // Filter by active status if specified
    if (activeFilter !== null) {
      query = query.eq('is_active', activeFilter === 'true')
    }

    const { data: protocols, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching protocols:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch protocols' }, { status: 500 })
    }

    // Filter out protocols that don't belong to the user
    const userProtocols = protocols?.filter((p: any) => p.medication?.user_id === user.id) || []

    // Add schedule preview if requested
    if (includeSchedule) {
      const protocolsWithSchedule = userProtocols.map((p: any) => {
        const schedule = generateSchedulePreview(p as any, 30)
        return {
          ...p,
          schedulePreview: schedule.map(d => d.toISOString().split('T')[0]),
        }
      })
      return NextResponse.json({
        protocols: protocolsWithSchedule,
        count: protocolsWithSchedule.length,
      })
    }

    return NextResponse.json({
      protocols: userProtocols,
      count: userProtocols.length,
    })
  } catch (error) {
    console.error('Protocols GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/protocols
 *
 * Create a new protocol with schedule validation
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createProtocolSchema.parse(body)

    // Verify medication belongs to user
    const { data: medication, error: medError } = await supabase
      .from('medications')
      .select('id, user_id')
      .eq('id', validatedData.medicationId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (medError || !medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    // Additional validation using protocol service
    const protocolValidation = validateProtocol(validatedData as any)
    if (!protocolValidation.valid) {
      return NextResponse.json(
        { error: 'Protocol validation failed', details: protocolValidation.errors },
        { status: 400 }
      )
    }

    // Create protocol
    const { data: protocol, error: createError } = await supabase
      .from('protocols')
      .insert({
        medication_id: validatedData.medicationId,
        name: validatedData.name,
        schedule_type: validatedData.scheduleType,
        frequency_days: validatedData.frequencyDays || null,
        weekly_days: validatedData.weeklyDays || null,
        custom_schedule: validatedData.customSchedule || null,
        cycle_length_weeks: validatedData.cycleLengthWeeks || null,
        off_weeks: validatedData.offWeeks || null,
        dose_value: validatedData.doseValue,
        dose_units: validatedData.doseUnits,
        start_date: validatedData.startDate,
        end_date: validatedData.endDate || null,
        time_of_day: validatedData.timeOfDay || null,
        site_rotation: validatedData.siteRotation || null,
        is_active: true,
        version: 1,
        notes: validatedData.notes || null,
      })
      .select(`
        *,
        medication:medications(*)
      `)
      .single()

    if (createError || !protocol) {
      console.error('Error creating protocol:', createError)
      return NextResponse.json({ error: 'Failed to create protocol' }, { status: 500 })
    }

    // Generate initial reminders (call database function)
    await supabase.rpc('generate_protocol_reminders', {
      p_protocol_id: protocol.id,
      p_days_ahead: 30,
    })

    return NextResponse.json({ protocol }, { status: 201 })
  } catch (error) {
    console.error('Protocols POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
