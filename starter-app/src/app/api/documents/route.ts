/**
 * Document Upload API
 * POST /api/documents - Upload and process a document
 * GET /api/documents - List user's documents
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const uploadSchema = z.object({
  title: z.string().min(1).max(255),
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  fileType: z.string().min(1),
  storagePath: z.string().min(1),
  content: z.string().min(1),
})

/**
 * POST /api/documents
 * Upload a new document
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
    const validatedData = uploadSchema.parse(body)

    // Create document record
    const { data: document, error: createError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        file_name: validatedData.fileName,
        file_size: validatedData.fileSize,
        file_type: validatedData.fileType,
        storage_path: validatedData.storagePath,
        status: 'pending',
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating document:', createError)
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
    }

    // Queue document processing (in a real app, use a job queue)
    // For now, we'll import and call the processing job directly
    const { processDocument } = await import('@/lib/jobs/process-document')

    // Process in background (don't await)
    processDocument(document.id, validatedData.content).catch(error => {
      console.error('Background processing error:', error)
    })

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        status: document.status,
        createdAt: document.created_at,
      },
    })
  } catch (error) {
    console.error('Document upload error:', error)

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
 * GET /api/documents
 * List user's documents
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
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: documents, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Error fetching documents:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json({
      documents: documents || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Document list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
