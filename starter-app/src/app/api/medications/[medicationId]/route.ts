/**
 * Single Medication API Routes
 *
 * GET /api/medications/[medicationId] - Get medication details
 * PATCH /api/medications/[medicationId] - Update medication
 * DELETE /api/medications/[medicationId] - Soft delete medication
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteParams {
  params: {
    medicationId: string
  }
}

// Validation schema for updating a medication
const updateMedicationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  type: z.enum(['peptide', 'TRT', 'GLP-1', 'other']).optional(),
  units: z.enum(['mg', 'IU', 'mcg', 'units', 'mL']).optional(),
  notes: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/medications/[medicationId]
 *
 * Query params:
 * - includeVials: boolean
 * - includeProtocols: boolean
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { medicationId } = params
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
    const includeVials = searchParams.get('includeVials') === 'true'
    const includeProtocols = searchParams.get('includeProtocols') === 'true'

    // Fetch medication
    const { data: medication, error: fetchError } = await supabase
      .from('medications')
      .select('*')
      .eq('id', medicationId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (fetchError || !medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    // Fetch related data if requested
    const medicationWithRelations: any = { ...medication }

    if (includeVials) {
      const { data: vials } = await supabase
        .from('vials')
        .select('*')
        .eq('medication_id', medicationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      medicationWithRelations.vials = vials || []
    }

    if (includeProtocols) {
      const { data: protocols } = await supabase
        .from('protocols')
        .select('*')
        .eq('medication_id', medicationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      medicationWithRelations.protocols = protocols || []
    }

    return NextResponse.json({ medication: medicationWithRelations })
  } catch (error) {
    console.error('Medication GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/medications/[medicationId]
 *
 * Update medication details
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { medicationId } = params
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
    const validatedData = updateMedicationSchema.parse(body)

    // Build update object with only provided fields
    const updates: Record<string, any> = {}
    if (validatedData.name !== undefined) updates.name = validatedData.name
    if (validatedData.type !== undefined) updates.type = validatedData.type
    if (validatedData.units !== undefined) updates.units = validatedData.units
    if (validatedData.notes !== undefined) updates.notes = validatedData.notes

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Update medication
    const { data: medication, error: updateError } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', medicationId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select()
      .single()

    if (updateError || !medication) {
      console.error('Error updating medication:', updateError)
      return NextResponse.json({ error: 'Failed to update medication' }, { status: 500 })
    }

    return NextResponse.json({ medication })
  } catch (error) {
    console.error('Medication PATCH error:', error)

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
 * DELETE /api/medications/[medicationId]
 *
 * Soft delete medication (sets deleted_at timestamp)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { medicationId } = params
    const supabase = createServerSupabaseClient()

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete medication (cascade handled by database triggers)
    const { error: deleteError } = await supabase
      .from('medications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', medicationId)
      .eq('user_id', user.id)
      .is('deleted_at', null)

    if (deleteError) {
      console.error('Error deleting medication:', deleteError)
      return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Medication deleted successfully' })
  } catch (error) {
    console.error('Medication DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
