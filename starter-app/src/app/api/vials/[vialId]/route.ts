/**
 * Single Vial API Routes
 *
 * GET /api/vials/[vialId] - Get vial details
 * PATCH /api/vials/[vialId] - Update vial
 * DELETE /api/vials/[vialId] - Soft delete vial
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getVialStatus } from '@/lib/services/vial-service'

interface RouteParams {
  params: {
    vialId: string
  }
}

// Validation schema for updating a vial
const updateVialSchema = z.object({
  concentrationValue: z.number().positive().optional(),
  concentrationUnits: z.enum(['mg/mL', 'IU/mL', 'mcg/mL', 'units/mL']).optional(),
  totalVolume: z.number().positive().optional(),
  remainingVolume: z.number().nonnegative().optional(),
  expirationDate: z.string().optional().nullable(),
  batchNumber: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/vials/[vialId]
 *
 * Query params:
 * - includeStatus: boolean - include calculated status
 * - includeCalculations: boolean - include dose calculations
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { vialId } = params
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
    const includeStatus = searchParams.get('includeStatus') === 'true'

    // Fetch vial with medication to verify ownership
    const { data: vial, error: fetchError } = await supabase
      .from('vials')
      .select(`
        *,
        medication:medications(*)
      `)
      .eq('id', vialId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !vial) {
      return NextResponse.json({ error: 'Vial not found' }, { status: 404 })
    }

    // Verify ownership
    if ((vial as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Vial not found' }, { status: 404 })
    }

    // Add status if requested
    const vialWithExtras: any = { ...vial }
    if (includeStatus) {
      vialWithExtras.status = getVialStatus(vial as any)
    }

    return NextResponse.json({ vial: vialWithExtras })
  } catch (error) {
    console.error('Vial GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/vials/[vialId]
 *
 * Update vial details
 * Note: Remaining volume should normally only be decreased via injection logging,
 * but manual adjustments are allowed
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { vialId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify vial ownership
    const { data: existingVial, error: fetchError } = await supabase
      .from('vials')
      .select(`
        *,
        medication:medications!inner(user_id)
      `)
      .eq('id', vialId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingVial) {
      return NextResponse.json({ error: 'Vial not found' }, { status: 404 })
    }

    if ((existingVial as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Vial not found' }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateVialSchema.parse(body)

    // Build update object
    const updates: Record<string, any> = {}
    if (validatedData.concentrationValue !== undefined)
      updates.concentration_value = validatedData.concentrationValue
    if (validatedData.concentrationUnits !== undefined)
      updates.concentration_units = validatedData.concentrationUnits
    if (validatedData.totalVolume !== undefined) updates.total_volume = validatedData.totalVolume
    if (validatedData.remainingVolume !== undefined)
      updates.remaining_volume = validatedData.remainingVolume
    if (validatedData.expirationDate !== undefined)
      updates.expiration_date = validatedData.expirationDate
    if (validatedData.batchNumber !== undefined) updates.batch_number = validatedData.batchNumber
    if (validatedData.notes !== undefined) updates.notes = validatedData.notes

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Validate remaining volume doesn't exceed total volume
    const newTotalVolume = updates.total_volume ?? (existingVial as any).total_volume
    const newRemainingVolume = updates.remaining_volume ?? (existingVial as any).remaining_volume

    if (newRemainingVolume > newTotalVolume) {
      return NextResponse.json(
        { error: 'Remaining volume cannot exceed total volume' },
        { status: 400 }
      )
    }

    // Update vial
    const { data: vial, error: updateError } = await supabase
      .from('vials')
      .update(updates)
      .eq('id', vialId)
      .is('deleted_at', null)
      .select(`
        *,
        medication:medications(*)
      `)
      .single()

    if (updateError || !vial) {
      console.error('Error updating vial:', updateError)
      return NextResponse.json({ error: 'Failed to update vial' }, { status: 500 })
    }

    return NextResponse.json({ vial })
  } catch (error) {
    console.error('Vial PATCH error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/vials/[vialId]
 *
 * Soft delete vial
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { vialId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify vial ownership
    const { data: existingVial, error: fetchError } = await supabase
      .from('vials')
      .select(`
        *,
        medication:medications!inner(user_id)
      `)
      .eq('id', vialId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingVial) {
      return NextResponse.json({ error: 'Vial not found' }, { status: 404 })
    }

    if ((existingVial as any).medication?.user_id !== user.id) {
      return NextResponse.json({ error: 'Vial not found' }, { status: 404 })
    }

    // Soft delete vial
    const { error: deleteError } = await supabase
      .from('vials')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', vialId)
      .is('deleted_at', null)

    if (deleteError) {
      console.error('Error deleting vial:', deleteError)
      return NextResponse.json({ error: 'Failed to delete vial' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Vial deleted successfully' })
  } catch (error) {
    console.error('Vial DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
