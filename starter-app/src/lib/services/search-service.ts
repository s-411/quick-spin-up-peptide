/**
 * Vector Similarity Search Service
 * Searches document chunks using vector embeddings
 */

import { createAdminClient } from '@/lib/supabase'
import { generateEmbedding } from './embedding-service'
import { OPENAI_CONFIG } from '@/lib/openai'

export interface SearchResult {
  id: string
  documentId: string
  content: string
  chunkIndex: number
  metadata: Record<string, unknown>
  similarity: number
}

export interface SearchOptions {
  userId: string
  limit?: number
  similarityThreshold?: number
  documentIds?: string[] // Optional: restrict search to specific documents
}

/**
 * Search for relevant document chunks using semantic similarity
 */
export async function searchDocuments(
  query: string,
  options: SearchOptions
): Promise<SearchResult[]> {
  const {
    userId,
    limit = OPENAI_CONFIG.contextChunkCount,
    similarityThreshold = 0.7,
    documentIds,
  } = options

  // Generate embedding for the query
  const { embedding } = await generateEmbedding(query)

  // Call Supabase function for vector similarity search
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('search_document_chunks', {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: limit,
    similarity_threshold: similarityThreshold,
  })

  if (error) {
    console.error('Vector search error:', error)
    throw new Error(`Failed to search documents: ${error.message}`)
  }

  if (!data) {
    return []
  }

  // Filter by document IDs if specified
  let results = data as SearchResult[]
  if (documentIds && documentIds.length > 0) {
    results = results.filter(r => documentIds.includes(r.documentId))
  }

  return results
}

/**
 * Search with automatic query expansion
 * Generates multiple variations of the query for better recall
 */
export async function searchWithExpansion(
  query: string,
  options: SearchOptions
): Promise<SearchResult[]> {
  // Generate query variations
  const queries = [
    query,
    // Add question variation
    query.endsWith('?') ? query : `${query}?`,
    // Add explanation variation
    `Explain ${query}`,
  ]

  // Search with all query variations
  const allResults = await Promise.all(
    queries.map(q => searchDocuments(q, { ...options, limit: options.limit || 10 }))
  )

  // Combine and deduplicate results
  const resultsMap = new Map<string, SearchResult>()

  for (const results of allResults) {
    for (const result of results) {
      const existing = resultsMap.get(result.id)
      if (!existing || result.similarity > existing.similarity) {
        resultsMap.set(result.id, result)
      }
    }
  }

  // Sort by similarity and limit
  return Array.from(resultsMap.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, options.limit || OPENAI_CONFIG.contextChunkCount)
}

/**
 * Hybrid search combining vector similarity and keyword matching
 */
export async function hybridSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {
  const supabase = createAdminClient()

  // 1. Vector similarity search
  const vectorResults = await searchDocuments(query, options)

  // 2. Full-text search using PostgreSQL
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)

  if (keywords.length === 0) {
    return vectorResults
  }

  const { data: keywordData } = await supabase
    .from('document_chunks')
    .select('id, document_id, content, chunk_index, metadata')
    .eq('user_id', options.userId)
    .textSearch('content', keywords.join(' & '))
    .limit(options.limit || OPENAI_CONFIG.contextChunkCount)

  // Combine results with weighted scoring
  const resultsMap = new Map<string, SearchResult>()

  // Add vector results (higher weight)
  for (const result of vectorResults) {
    resultsMap.set(result.id, {
      ...result,
      similarity: result.similarity * 0.7, // 70% weight for vector similarity
    })
  }

  // Add keyword results (lower weight)
  if (keywordData) {
    for (const result of keywordData) {
      const existing = resultsMap.get(result.id)
      if (existing) {
        // Boost if found in both
        existing.similarity += 0.3
      } else {
        resultsMap.set(result.id, {
          id: result.id,
          documentId: result.document_id,
          content: result.content,
          chunkIndex: result.chunk_index,
          metadata: result.metadata as Record<string, unknown>,
          similarity: 0.5, // 30% weight for keyword match
        })
      }
    }
  }

  // Sort by combined similarity
  return Array.from(resultsMap.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, options.limit || OPENAI_CONFIG.contextChunkCount)
}

/**
 * Get context from search results formatted for RAG
 */
export function formatSearchContext(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant context found.'
  }

  return results
    .map((result, index) => {
      return `[Source ${index + 1}]\n${result.content}`
    })
    .join('\n\n---\n\n')
}

/**
 * Get document metadata from search results
 */
export function extractSourceMetadata(results: SearchResult[]): Array<{
  documentId: string
  chunkIndex: number
  similarity: number
}> {
  return results.map(r => ({
    documentId: r.documentId,
    chunkIndex: r.chunkIndex,
    similarity: r.similarity,
  }))
}
