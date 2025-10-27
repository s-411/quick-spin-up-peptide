/**
 * Chat Sessions API
 * POST /api/chat/sessions - Create new chat session
 * GET /api/chat/sessions - List user's chat sessions
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const createSessionSchema = z.object({
  title: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

/**
 * POST /api/chat/sessions
 * Create a new chat session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Create session
    const { data: session, error: createError } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: validatedData.title || 'New Chat',
        metadata: validatedData.metadata || {},
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating chat session:', createError)
      return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Chat session creation error:', error)

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
 * GET /api/chat/sessions
 * List user's chat sessions
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch sessions
    const {
      data: sessions,
      error: fetchError,
      count,
    } = await supabase
      .from('chat_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (fetchError) {
      console.error('Error fetching chat sessions:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 })
    }

    return NextResponse.json({
      sessions: sessions || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Chat sessions list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
