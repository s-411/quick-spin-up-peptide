/**
 * Backups API Routes
 *
 * GET /api/backups - List backups
 * POST /api/backups - Create backup
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

const createBackupSchema = z.object({
  description: z.string().max(255).optional().nullable(),
  backupType: z.enum(['manual', 'auto']).default('manual'),
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
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data: backups, error: fetchError } = await supabase
      .from('backups')
      .select('id, backup_type, description, size_bytes, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching backups:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 })
    }

    return NextResponse.json({
      backups: backups || [],
      count: backups?.length || 0,
    })
  } catch (error) {
    console.error('Backups GET error:', error)
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
    const validatedData = createBackupSchema.parse(body)

    // Call database function to create backup
    const { data, error: rpcError } = await supabase.rpc('create_user_backup', {
      p_user_id: user.id,
      p_description: validatedData.description || null,
      p_backup_type: validatedData.backupType,
    })

    if (rpcError) {
      console.error('Error creating backup:', rpcError)
      return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 })
    }

    // Fetch the created backup
    const { data: backup, error: fetchError } = await supabase
      .from('backups')
      .select('id, backup_type, description, size_bytes, created_at')
      .eq('id', data)
      .single()

    if (fetchError || !backup) {
      return NextResponse.json({ error: 'Backup created but could not retrieve' }, { status: 500 })
    }

    return NextResponse.json({ backup }, { status: 201 })
  } catch (error) {
    console.error('Backups POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
