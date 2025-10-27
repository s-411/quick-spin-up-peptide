/**
 * Document Processing Background Job
 * Chunks document, generates embeddings, and stores in database
 */

import { createAdminClient } from '@/lib/supabase'
import { chunkDocument } from '@/lib/services/chunking-service'
import { generateEmbeddingsBatch } from '@/lib/services/embedding-service'

export interface ProcessDocumentResult {
  success: boolean
  documentId: string
  chunksCreated: number
  totalTokens: number
  error?: string
}

/**
 * Process a document: chunk, embed, and store
 */
export async function processDocument(
  documentId: string,
  content: string
): Promise<ProcessDocumentResult> {
  const supabase = createAdminClient()

  try {
    // Update status to processing
    await supabase.from('documents').update({ status: 'processing' }).eq('id', documentId)

    // Get document to get user_id
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('user_id')
      .eq('id', documentId)
      .single()

    if (fetchError || !document) {
      throw new Error('Document not found')
    }

    // Step 1: Chunk the document
    console.log(`[${documentId}] Chunking document...`)
    const chunks = chunkDocument(content, {
      maxTokens: 500,
      overlapTokens: 50,
      preserveParagraphs: true,
    })

    if (chunks.length === 0) {
      throw new Error('No chunks generated from document')
    }

    console.log(`[${documentId}] Created ${chunks.length} chunks`)

    // Step 2: Generate embeddings for all chunks
    console.log(`[${documentId}] Generating embeddings...`)
    const chunkTexts = chunks.map(c => c.content)
    const embeddingResult = await generateEmbeddingsBatch(chunkTexts)

    console.log(`[${documentId}] Generated ${embeddingResult.embeddings.length} embeddings`)

    // Step 3: Store chunks with embeddings in database
    console.log(`[${documentId}] Storing chunks in database...`)

    const chunkRecords = chunks.map((chunk, index) => ({
      document_id: documentId,
      user_id: document.user_id,
      content: chunk.content,
      embedding: embeddingResult.embeddings[index],
      chunk_index: chunk.index,
      token_count: chunk.tokenCount,
      metadata: chunk.metadata || {},
    }))

    // Insert in batches of 50
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < chunkRecords.length; i += batchSize) {
      const batch = chunkRecords.slice(i, i + batchSize)

      const { error: insertError } = await supabase.from('document_chunks').insert(batch)

      if (insertError) {
        console.error(`[${documentId}] Batch insert error:`, insertError)
        throw new Error(`Failed to insert chunks: ${insertError.message}`)
      }

      insertedCount += batch.length
      console.log(`[${documentId}] Inserted ${insertedCount}/${chunkRecords.length} chunks`)
    }

    // Step 4: Update document status to completed
    await supabase
      .from('documents')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    console.log(`[${documentId}] Processing completed successfully`)

    return {
      success: true,
      documentId,
      chunksCreated: chunkRecords.length,
      totalTokens: embeddingResult.totalTokens,
    }
  } catch (error) {
    console.error(`[${documentId}] Processing error:`, error)

    // Update document status to failed
    await supabase
      .from('documents')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', documentId)

    return {
      success: false,
      documentId,
      chunksCreated: 0,
      totalTokens: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Reprocess a failed document
 */
export async function reprocessDocument(documentId: string): Promise<ProcessDocumentResult> {
  const supabase = createAdminClient()

  // Get document storage path to retrieve content
  const { data: document, error } = await supabase
    .from('documents')
    .select('storage_path, status')
    .eq('id', documentId)
    .single()

  if (error || !document) {
    throw new Error('Document not found')
  }

  if (document.status === 'processing') {
    throw new Error('Document is already being processed')
  }

  // Delete existing chunks
  await supabase.from('document_chunks').delete().eq('document_id', documentId)

  // Download document from storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('documents')
    .download(document.storage_path)

  if (downloadError || !fileData) {
    throw new Error('Failed to download document from storage')
  }

  // Extract text content
  const content = await fileData.text()

  // Process document
  return processDocument(documentId, content)
}

/**
 * Get processing status
 */
export async function getProcessingStatus(documentId: string): Promise<{
  status: string
  chunkCount: number
  totalTokens: number
  errorMessage: string | null
}> {
  const supabase = createAdminClient()

  const { data: document, error } = await supabase
    .from('documents')
    .select('status, chunk_count, total_tokens, error_message')
    .eq('id', documentId)
    .single()

  if (error || !document) {
    throw new Error('Document not found')
  }

  return {
    status: document.status,
    chunkCount: document.chunk_count || 0,
    totalTokens: document.total_tokens || 0,
    errorMessage: document.error_message,
  }
}
