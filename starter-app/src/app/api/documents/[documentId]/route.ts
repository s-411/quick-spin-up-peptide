/**
 * Document Detail API
 * GET /api/documents/[documentId] - Get document details
 * DELETE /api/documents/[documentId] - Delete document
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteParams {
  params: {
    documentId: string
  }
}

/**
 * GET /api/documents/[documentId]
 * Get document details with chunks
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()
    const { documentId } = params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get document
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Optionally get chunks
    const { searchParams } = new URL(request.url)
    const includeChunks = searchParams.get('includeChunks') === 'true'

    let chunks = null
    if (includeChunks) {
      const { data: chunksData } = await supabase
        .from('document_chunks')
        .select('id, content, chunk_index, token_count, metadata')
        .eq('document_id', documentId)
        .order('chunk_index')

      chunks = chunksData
    }

    return NextResponse.json({
      document,
      chunks,
    })
  } catch (error) {
    console.error('Document fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/documents/[documentId]
 * Delete document and all associated chunks
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()
    const { documentId } = params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check document exists and belongs to user
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('id, storage_path')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete from storage if path exists
    if (document.storage_path) {
      try {
        await supabase.storage.from('documents').remove([document.storage_path])
      } catch (storageError) {
        console.warn('Storage deletion warning:', storageError)
        // Continue with database deletion even if storage fails
      }
    }

    // Delete document (chunks will be cascade deleted)
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting document:', deleteError)
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Document deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/documents/[documentId]
 * Update document metadata
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()
    const { documentId } = params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { title, metadata } = body

    // Build update object
    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title
    if (metadata !== undefined) updates.metadata = metadata

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Update document
    const { data: document, error: updateError } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError || !document) {
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Document update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
