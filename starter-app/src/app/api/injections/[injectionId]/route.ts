/**
 * Single Injection API Routes
 *
 * GET /api/injections/[injectionId] - Get injection details
 * PATCH /api/injections/[injectionId] - Update injection
 * DELETE /api/injections/[injectionId] - Delete injection (restores vial volume)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteParams {
  params: {
    injectionId: string
  }
}

// Validation schema for updating an injection
const updateInjectionSchema = z.object({
  dateTime: z.string().datetime().optional(),
  doseValue: z.number().positive().optional(),
  doseUnits: z.enum(['mg', 'IU', 'mcg', 'units', 'mL']).optional(),
  volumeMl: z.number().positive().optional().nullable(),
  site: z
    .enum([
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
    ])
    .optional(),
  notes: z.string().max(1000).optional().nullable(),
  sideEffects: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/injections/[injectionId]
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { injectionId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch injection with related data
    const { data: injection, error: fetchError } = await supabase
      .from('injections')
      .select(
        `
        *,
        protocol:protocols!inner(
          *,
          medication:medications!inner(*)
        ),
        vial:vials(*)
      `
      )
      .eq('id', injectionId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !injection) {
      return NextResponse.json({ error: 'Injection not found' }, { status: 404 })
    }

    // Verify ownership
    if ((injection as any).protocol?.medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Injection not found' }, { status: 404 })
    }

    return NextResponse.json({ injection })
  } catch (error) {
    console.error('Injection GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/injections/[injectionId]
 *
 * Update injection details
 * Note: Changing volume does NOT automatically adjust vial - manual vial adjustment needed
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { injectionId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify injection ownership
    const { data: existingInjection, error: fetchError } = await supabase
      .from('injections')
      .select(
        `
        *,
        protocol:protocols!inner(
          *,
          medication:medications!inner(user_id)
        )
      `
      )
      .eq('id', injectionId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingInjection) {
      return NextResponse.json({ error: 'Injection not found' }, { status: 404 })
    }

    if ((existingInjection as any).protocol?.medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Injection not found' }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateInjectionSchema.parse(body)

    // Build update object
    const updates: Record<string, any> = {}
    if (validatedData.dateTime !== undefined) updates.date_time = validatedData.dateTime
    if (validatedData.doseValue !== undefined) updates.dose_value = validatedData.doseValue
    if (validatedData.doseUnits !== undefined) updates.dose_units = validatedData.doseUnits
    if (validatedData.volumeMl !== undefined) updates.volume_ml = validatedData.volumeMl
    if (validatedData.site !== undefined) updates.site = validatedData.site
    if (validatedData.notes !== undefined) updates.notes = validatedData.notes
    if (validatedData.sideEffects !== undefined) updates.side_effects = validatedData.sideEffects

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Update injection
    const { data: injection, error: updateError } = await supabase
      .from('injections')
      .update(updates)
      .eq('id', injectionId)
      .is('deleted_at', null)
      .select(
        `
        *,
        protocol:protocols(
          *,
          medication:medications(*)
        ),
        vial:vials(*)
      `
      )
      .single()

    if (updateError || !injection) {
      console.error('Error updating injection:', updateError)
      return NextResponse.json({ error: 'Failed to update injection' }, { status: 500 })
    }

    return NextResponse.json({ injection })
  } catch (error) {
    console.error('Injection PATCH error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/injections/[injectionId]
 *
 * Delete injection - automatically restores vial volume via database trigger
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { injectionId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify injection ownership
    const { data: existingInjection, error: fetchError } = await supabase
      .from('injections')
      .select(
        `
        *,
        protocol:protocols!inner(
          *,
          medication:medications!inner(user_id)
        )
      `
      )
      .eq('id', injectionId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingInjection) {
      return NextResponse.json({ error: 'Injection not found' }, { status: 404 })
    }

    if ((existingInjection as any).protocol?.medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Injection not found' }, { status: 404 })
    }

    // Delete injection (vial volume will be restored by database trigger)
    const { error: deleteError } = await supabase.from('injections').delete().eq('id', injectionId)

    if (deleteError) {
      console.error('Error deleting injection:', deleteError)
      return NextResponse.json({ error: 'Failed to delete injection' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Injection deleted successfully' })
  } catch (error) {
    console.error('Injection DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
