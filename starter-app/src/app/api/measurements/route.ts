/**
 * Measurements API Routes
 *
 * GET /api/measurements - List measurements
 * POST /api/measurements - Create measurement
 * DELETE /api/measurements/[id] - Delete measurement (in separate file)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

const createMeasurementSchema = z.object({
  dateTime: z.string().datetime('Invalid datetime format'),
  measurementType: z.string().min(1, 'Measurement type is required'),
  value: z.number().finite('Value must be a valid number'),
  unit: z.string().min(1, 'Unit is required'),
  secondaryValue: z.number().finite().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  labName: z.string().max(255).optional().nullable(),
  testDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
})

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
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('date_time', { ascending: false })
      .limit(limit)

    if (type) query = query.eq('measurement_type', type)
    if (startDate) query = query.gte('date_time', `${startDate}T00:00:00Z`)
    if (endDate) query = query.lte('date_time', `${endDate}T23:59:59Z`)

    const { data: measurements, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching measurements:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch measurements' }, { status: 500 })
    }

    return NextResponse.json({
      measurements: measurements || [],
      count: measurements?.length || 0,
    })
  } catch (error) {
    console.error('Measurements GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createMeasurementSchema.parse(body)

    const { data: measurement, error: createError } = await supabase
      .from('measurements')
      .insert({
        user_id: user.id,
        date_time: validatedData.dateTime,
        measurement_type: validatedData.measurementType,
        value: validatedData.value,
        unit: validatedData.unit,
        secondary_value: validatedData.secondaryValue || null,
        notes: validatedData.notes || null,
        lab_name: validatedData.labName || null,
        test_date: validatedData.testDate || null,
      })
      .select()
      .single()

    if (createError || !measurement) {
      console.error('Error creating measurement:', createError)
      return NextResponse.json({ error: 'Failed to create measurement' }, { status: 500 })
    }

    return NextResponse.json({ measurement }, { status: 201 })
  } catch (error) {
    console.error('Measurements POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
