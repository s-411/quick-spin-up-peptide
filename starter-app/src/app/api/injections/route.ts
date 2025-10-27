/**
 * Injections API Routes
 *
 * GET /api/injections - List all injections for authenticated user
 * POST /api/injections - Log a new injection
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { calculateDoseVolume } from '@/lib/services/calculator-service'

// Validation schema for creating an injection
const createInjectionSchema = z.object({
  protocolId: z.string().uuid('Invalid protocol ID'),
  vialId: z.string().uuid('Invalid vial ID').optional().nullable(),
  dateTime: z.string().datetime('Invalid datetime format'),
  doseValue: z.number().positive('Dose must be positive'),
  doseUnits: z.enum(['mg', 'IU', 'mcg', 'units', 'mL'], {
    errorMap: () => ({ message: 'Invalid dose units' }),
  }),
  volumeMl: z.number().positive().optional().nullable(),
  site: z.enum([
    'left_glute',
    'right_glute',
    'left_delt',
    'right_delt',
    'left_thigh',
    'right_thigh',
    'abdomen_upper_left',
    'abdomen_upper_right',
    'abdomen_lower_left',
    'abdomen_lower_right',
    'left_ventrogluteal',
    'right_ventrogluteal',
  ], {
    errorMap: () => ({ message: 'Invalid injection site' }),
  }),
  notes: z.string().max(1000).optional().nullable(),
  sideEffects: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/injections
 *
 * Query params:
 * - protocolId: string - filter by protocol
 * - medicationId: string - filter by medication
 * - startDate: string (YYYY-MM-DD) - filter from date
 * - endDate: string (YYYY-MM-DD) - filter to date
 * - limit: number - page size (default: 50)
 * - offset: number - pagination offset (default: 0)
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
    const medicationId = searchParams.get('medicationId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build base query with joins
    let query = supabase
      .from('injections')
      .select(`
        *,
        protocol:protocols!inner(
          *,
          medication:medications!inner(*)
        ),
        vial:vials(*)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('date_time', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (protocolId) {
      query = query.eq('protocol_id', protocolId)
    }

    if (startDate) {
      query = query.gte('date_time', `${startDate}T00:00:00Z`)
    }

    if (endDate) {
      query = query.lte('date_time', `${endDate}T23:59:59Z`)
    }

    const { data: injections, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Error fetching injections:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch injections' }, { status: 500 })
    }

    // Filter out injections that don't belong to the user
    const userInjections = injections?.filter(
      (inj: any) => inj.protocol?.medication?.user_id === user.id
    ) || []

    // Apply medication filter if specified (after fetching to avoid complex joins)
    let filteredInjections = userInjections
    if (medicationId) {
      filteredInjections = userInjections.filter(
        (inj: any) => inj.protocol?.medication_id === medicationId
      )
    }

    return NextResponse.json({
      injections: filteredInjections,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Injections GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/injections
 *
 * Log a new injection - automatically decrements vial volume
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
    const validatedData = createInjectionSchema.parse(body)

    // Verify protocol belongs to user
    const { data: protocol, error: protocolError } = await supabase
      .from('protocols')
      .select(`
        *,
        medication:medications!inner(user_id)
      `)
      .eq('id', validatedData.protocolId)
      .is('deleted_at', null)
      .single()

    if (protocolError || !protocol) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    if ((protocol as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Protocol not found' }, { status: 404 })
    }

    // If vial specified, verify it belongs to the same medication
    let vial: any = null
    if (validatedData.vialId) {
      const { data: vialData, error: vialError } = await supabase
        .from('vials')
        .select('*')
        .eq('id', validatedData.vialId)
        .eq('medication_id', protocol.medication_id)
        .is('deleted_at', null)
        .single()

      if (vialError || !vialData) {
        return NextResponse.json({ error: 'Vial not found or does not match medication' }, { status: 404 })
      }

      vial = vialData
    }

    // Calculate volume if not provided and vial is specified
    let volumeMl = validatedData.volumeMl
    if (!volumeMl && vial) {
      volumeMl = calculateDoseVolume(
        validatedData.doseValue,
        validatedData.doseUnits,
        vial.concentration_value,
        vial.concentration_units
      )
    }

    // Verify vial has enough volume
    if (vial && volumeMl && vial.remaining_volume < volumeMl) {
      return NextResponse.json(
        { error: `Insufficient volume in vial. Remaining: ${vial.remaining_volume} mL, Required: ${volumeMl} mL` },
        { status: 400 }
      )
    }

    // Create injection (vial volume will be decremented by database trigger)
    const { data: injection, error: createError } = await supabase
      .from('injections')
      .insert({
        protocol_id: validatedData.protocolId,
        vial_id: validatedData.vialId || null,
        date_time: validatedData.dateTime,
        dose_value: validatedData.doseValue,
        dose_units: validatedData.doseUnits,
        volume_ml: volumeMl || null,
        site: validatedData.site,
        notes: validatedData.notes || null,
        side_effects: validatedData.sideEffects || null,
      })
      .select(`
        *,
        protocol:protocols(
          *,
          medication:medications(*)
        ),
        vial:vials(*)
      `)
      .single()

    if (createError || !injection) {
      console.error('Error creating injection:', createError)
      return NextResponse.json({ error: 'Failed to create injection' }, { status: 500 })
    }

    return NextResponse.json({ injection }, { status: 201 })
  } catch (error) {
    console.error('Injections POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
