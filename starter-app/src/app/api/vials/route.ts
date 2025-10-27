/**
 * Vials API Routes
 *
 * GET /api/vials - List all vials for authenticated user
 * POST /api/vials - Create a new vial
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { calculateVialDosing } from '@/lib/services/calculator-service'
import { getVialStatus } from '@/lib/services/vial-service'

// Validation schema for creating a vial
const createVialSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  concentrationValue: z.number().positive('Concentration must be positive'),
  concentrationUnits: z.enum(['mg/mL', 'IU/mL', 'mcg/mL', 'units/mL'], {
    errorMap: () => ({ message: 'Invalid concentration units' }),
  }),
  totalVolume: z.number().positive('Total volume must be positive'),
  remainingVolume: z.number().nonnegative('Remaining volume cannot be negative').optional(),
  expirationDate: z.string().optional().nullable(),
  batchNumber: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

/**
 * GET /api/vials
 *
 * Query params:
 * - medicationId: string - filter by medication
 * - includeStatus: boolean - include calculated status
 * - includeExpired: boolean - include expired vials (default: false)
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
    const includeStatus = searchParams.get('includeStatus') === 'true'
    const includeExpired = searchParams.get('includeExpired') === 'true'

    // Build query - join with medications to verify ownership
    let query = supabase
      .from('vials')
      .select(
        `
        *,
        medication:medications(*)
      `
      )
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // Filter by medication if specified
    if (medicationId) {
      query = query.eq('medication_id', medicationId)
    }

    const { data: vials, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching vials:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch vials' }, { status: 500 })
    }

    // Filter out vials that don't belong to the user (via medication relationship)
    const userVials = vials?.filter((v: any) => v.medication?.user_id === user.id) || []

    // Filter out expired vials if not requested
    let filteredVials = userVials
    if (!includeExpired) {
      filteredVials = userVials.filter((v: any) => {
        if (!v.expiration_date) return true
        return new Date(v.expiration_date) >= new Date()
      })
    }

    // Add status calculation if requested
    if (includeStatus) {
      filteredVials = filteredVials.map((v: any) => ({
        ...v,
        status: getVialStatus(v),
      }))
    }

    return NextResponse.json({
      vials: filteredVials,
      count: filteredVials.length,
    })
  } catch (error) {
    console.error('Vials GET error:', error)

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
 * POST /api/vials
 *
 * Create a new vial with optional calculator integration
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
    const validatedData = createVialSchema.parse(body)

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

    // Default remaining volume to total volume if not provided
    const remainingVolume = validatedData.remainingVolume ?? validatedData.totalVolume

    // Validate remaining volume doesn't exceed total
    if (remainingVolume > validatedData.totalVolume) {
      return NextResponse.json(
        { error: 'Remaining volume cannot exceed total volume' },
        { status: 400 }
      )
    }

    // Create vial
    const { data: vial, error: createError } = await supabase
      .from('vials')
      .insert({
        medication_id: validatedData.medicationId,
        concentration_value: validatedData.concentrationValue,
        concentration_units: validatedData.concentrationUnits,
        total_volume: validatedData.totalVolume,
        remaining_volume: remainingVolume,
        expiration_date: validatedData.expirationDate || null,
        batch_number: validatedData.batchNumber || null,
        notes: validatedData.notes || null,
      })
      .select(
        `
        *,
        medication:medications(*)
      `
      )
      .single()

    if (createError || !vial) {
      console.error('Error creating vial:', createError)
      return NextResponse.json({ error: 'Failed to create vial' }, { status: 500 })
    }

    return NextResponse.json({ vial }, { status: 201 })
  } catch (error) {
    console.error('Vials POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
