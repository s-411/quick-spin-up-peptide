/**
 * Medications API Routes
 *
 * GET /api/medications - List all medications for authenticated user
 * POST /api/medications - Create a new medication
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

// Validation schema for creating a medication
const createMedicationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  type: z.enum(['peptide', 'TRT', 'GLP-1', 'other'], {
    errorMap: () => ({ message: 'Invalid medication type' }),
  }),
  units: z.enum(['mg', 'IU', 'mcg', 'units', 'mL'], {
    errorMap: () => ({ message: 'Invalid units' }),
  }),
  notes: z.string().max(1000, 'Notes too long').optional(),
})

/**
 * GET /api/medications
 *
 * Query params:
 * - includeVials: boolean - include related vials
 * - includeProtocols: boolean - include related protocols
 * - type: string - filter by medication type
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
    const includeVials = searchParams.get('includeVials') === 'true'
    const includeProtocols = searchParams.get('includeProtocols') === 'true'
    const typeFilter = searchParams.get('type')

    // Build base query
    let query = supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // Apply type filter if provided
    if (typeFilter && ['peptide', 'TRT', 'GLP-1', 'other'].includes(typeFilter)) {
      query = query.eq('type', typeFilter)
    }

    const { data: medications, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching medications:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 })
    }

    // Fetch related data if requested
    if (medications && (includeVials || includeProtocols)) {
      const medicationIds = medications.map(m => m.id)

      if (includeVials && medicationIds.length > 0) {
        const { data: vials } = await supabase
          .from('vials')
          .select('*')
          .in('medication_id', medicationIds)
          .is('deleted_at', null)

        // Attach vials to medications
        medications.forEach(med => {
          ;(med as any).vials = vials?.filter(v => v.medication_id === med.id) || []
        })
      }

      if (includeProtocols && medicationIds.length > 0) {
        const { data: protocols } = await supabase
          .from('protocols')
          .select('*')
          .in('medication_id', medicationIds)
          .is('deleted_at', null)

        // Attach protocols to medications
        medications.forEach(med => {
          ;(med as any).protocols = protocols?.filter(p => p.medication_id === med.id) || []
        })
      }
    }

    return NextResponse.json({
      medications: medications || [],
      count: medications?.length || 0,
    })
  } catch (error) {
    console.error('Medications GET error:', error)

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
 * POST /api/medications
 *
 * Create a new medication
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
    const validatedData = createMedicationSchema.parse(body)

    // Create medication
    const { data: medication, error: createError } = await supabase
      .from('medications')
      .insert({
        user_id: user.id,
        name: validatedData.name,
        type: validatedData.type,
        units: validatedData.units,
        notes: validatedData.notes || null,
      })
      .select()
      .single()

    if (createError || !medication) {
      console.error('Error creating medication:', createError)
      return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 })
    }

    return NextResponse.json({ medication }, { status: 201 })
  } catch (error) {
    console.error('Medications POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
