/**
 * Embedding Generation Service
 * Generates vector embeddings using OpenAI API
 */

import { getOpenAIClient, OPENAI_MODELS } from '@/lib/openai'
import { retryWithBackoff } from '@/lib/errors'

export interface EmbeddingResult {
  embedding: number[]
  tokenCount: number
}

export interface BatchEmbeddingResult {
  embeddings: number[][]
  tokenCounts: number[]
  totalTokens: number
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  return retryWithBackoff(
    async () => {
      const openai = getOpenAIClient()

      const response = await openai.embeddings.create({
        model: OPENAI_MODELS.embedding,
        input: text,
        encoding_format: 'float',
      })

      if (!response.data[0]) {
        throw new Error('No embedding returned from OpenAI')
      }

      return {
        embedding: response.data[0].embedding,
        tokenCount: response.usage.total_tokens,
      }
    },
    3, // max retries
    1000 // initial delay ms
  )
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient than multiple single calls
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<BatchEmbeddingResult> {
  if (texts.length === 0) {
    return {
      embeddings: [],
      tokenCounts: [],
      totalTokens: 0,
    }
  }

  // OpenAI embedding API supports up to 2048 inputs per batch
  const batchSize = 100 // Use smaller batch for safety
  const batches: string[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    batches.push(texts.slice(i, i + batchSize))
  }

  const results: BatchEmbeddingResult = {
    embeddings: [],
    tokenCounts: [],
    totalTokens: 0,
  }

  for (const batch of batches) {
    const batchResult = await retryWithBackoff(
      async () => {
        const openai = getOpenAIClient()

        const response = await openai.embeddings.create({
          model: OPENAI_MODELS.embedding,
          input: batch,
          encoding_format: 'float',
        })

        return response
      },
      3,
      1000
    )

    // Collect results
    for (const item of batchResult.data) {
      results.embeddings.push(item.embedding)
      results.tokenCounts.push(0) // OpenAI doesn't provide per-item tokens in batch
    }

    results.totalTokens += batchResult.usage.total_tokens
  }

  return results
}

/**
 * Generate embedding with progress callback
 */
export async function generateEmbeddingWithProgress(
  texts: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchEmbeddingResult> {
  const batchSize = 100
  const results: BatchEmbeddingResult = {
    embeddings: [],
    tokenCounts: [],
    totalTokens: 0,
  }

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const batchResult = await generateEmbeddingsBatch(batch)

    results.embeddings.push(...batchResult.embeddings)
    results.tokenCounts.push(...batchResult.tokenCounts)
    results.totalTokens += batchResult.totalTokens

    if (onProgress) {
      onProgress(Math.min(i + batchSize, texts.length), texts.length)
    }
  }

  return results
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Find most similar embeddings
 */
export function findMostSimilar(
  queryEmbedding: number[],
  embeddings: number[][],
  topK: number = 5
): Array<{ index: number; similarity: number }> {
  const similarities = embeddings.map((embedding, index) => ({
    index,
    similarity: cosineSimilarity(queryEmbedding, embedding),
  }))

  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK)
}

/**
 * Validate embedding dimensions
 */
export function isValidEmbedding(embedding: number[], expectedDimensions: number = 1536): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === expectedDimensions &&
    embedding.every(n => typeof n === 'number' && !isNaN(n))
  )
}
