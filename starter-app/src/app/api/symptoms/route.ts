/**
 * Symptoms API Routes
 *
 * GET /api/symptoms - List symptoms
 * POST /api/symptoms - Create symptom entry
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

const createSymptomSchema = z.object({
  dateTime: z.string().datetime('Invalid datetime format'),
  symptomType: z.string().min(1, 'Symptom type is required').max(100),
  severity: z.number().int().min(1).max(5, 'Severity must be 1-5'),
  notes: z.string().max(1000).optional().nullable(),
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
      .from('symptoms')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('date_time', { ascending: false })
      .limit(limit)

    if (type) query = query.eq('symptom_type', type)
    if (startDate) query = query.gte('date_time', `${startDate}T00:00:00Z`)
    if (endDate) query = query.lte('date_time', `${endDate}T23:59:59Z`)

    const { data: symptoms, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching symptoms:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch symptoms' }, { status: 500 })
    }

    return NextResponse.json({
      symptoms: symptoms || [],
      count: symptoms?.length || 0,
    })
  } catch (error) {
    console.error('Symptoms GET error:', error)
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
    const validatedData = createSymptomSchema.parse(body)

    const { data: symptom, error: createError } = await supabase
      .from('symptoms')
      .insert({
        user_id: user.id,
        date_time: validatedData.dateTime,
        symptom_type: validatedData.symptomType,
        severity: validatedData.severity,
        notes: validatedData.notes || null,
      })
      .select()
      .single()

    if (createError || !symptom) {
      console.error('Error creating symptom:', createError)
      return NextResponse.json({ error: 'Failed to create symptom' }, { status: 500 })
    }

    return NextResponse.json({ symptom }, { status: 201 })
  } catch (error) {
    console.error('Symptoms POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
