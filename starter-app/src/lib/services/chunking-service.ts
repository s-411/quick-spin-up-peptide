/**
 * Document Chunking Service
 * Splits documents into smaller chunks for embedding and retrieval
 */

import { estimateTokenCount, OPENAI_CONFIG } from '@/lib/openai'

export interface Chunk {
  content: string
  index: number
  tokenCount: number
  metadata?: Record<string, unknown>
}

export interface ChunkingOptions {
  maxTokens?: number
  overlapTokens?: number
  preserveParagraphs?: boolean
}

/**
 * Chunk document text into smaller pieces
 */
export function chunkDocument(text: string, options: ChunkingOptions = {}): Chunk[] {
  const {
    maxTokens = OPENAI_CONFIG.maxChunkTokens,
    overlapTokens = 50,
    preserveParagraphs = true,
  } = options

  // Clean and normalize text
  const cleanedText = text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
    .trim()

  if (!cleanedText) {
    return []
  }

  // Split into paragraphs if preserving structure
  const paragraphs = preserveParagraphs
    ? cleanedText.split(/\n\n+/).filter(p => p.trim())
    : [cleanedText]

  const chunks: Chunk[] = []
  let currentChunk = ''
  let currentTokens = 0
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokenCount(paragraph)

    // If single paragraph exceeds max, split it by sentences
    if (paragraphTokens > maxTokens) {
      // Save current chunk if not empty
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex++,
          tokenCount: currentTokens,
        })
        currentChunk = ''
        currentTokens = 0
      }

      // Split large paragraph into sentences
      const sentences = splitIntoSentences(paragraph)
      for (const sentence of sentences) {
        const sentenceTokens = estimateTokenCount(sentence)

        if (currentTokens + sentenceTokens > maxTokens) {
          if (currentChunk) {
            chunks.push({
              content: currentChunk.trim(),
              index: chunkIndex++,
              tokenCount: currentTokens,
            })
          }
          currentChunk = sentence
          currentTokens = sentenceTokens
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence
          currentTokens += sentenceTokens
        }
      }
      continue
    }

    // Check if adding paragraph would exceed limit
    if (currentTokens + paragraphTokens > maxTokens) {
      // Save current chunk
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          index: chunkIndex++,
          tokenCount: currentTokens,
        })
      }

      // Start new chunk with overlap
      if (overlapTokens > 0 && currentChunk) {
        const overlap = getLastTokens(currentChunk, overlapTokens)
        currentChunk = overlap + '\n\n' + paragraph
        currentTokens = estimateTokenCount(currentChunk)
      } else {
        currentChunk = paragraph
        currentTokens = paragraphTokens
      }
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
      currentTokens += paragraphTokens
    }
  }

  // Add final chunk
  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
      tokenCount: currentTokens,
    })
  }

  return chunks
}

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  // Simple sentence splitter (can be improved with NLP libraries)
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim())
}

/**
 * Get last N tokens from text (approximate)
 */
function getLastTokens(text: string, tokenCount: number): string {
  const words = text.split(/\s+/)
  const estimatedWordsNeeded = Math.ceil(tokenCount / 1.3) // Rough estimate
  return words.slice(-estimatedWordsNeeded).join(' ')
}

/**
 * Chunk text by character count (simpler alternative)
 */
export function chunkByCharacters(
  text: string,
  maxChars: number = 2000,
  overlapChars: number = 200
): Chunk[] {
  const chunks: Chunk[] = []
  let start = 0
  let index = 0

  while (start < text.length) {
    let end = start + maxChars

    // Try to break at sentence boundary
    if (end < text.length) {
      const nextPeriod = text.indexOf('. ', end)
      const nextNewline = text.indexOf('\n', end)

      if (nextPeriod !== -1 && nextPeriod < end + 100) {
        end = nextPeriod + 1
      } else if (nextNewline !== -1 && nextNewline < end + 100) {
        end = nextNewline + 1
      }
    }

    const content = text.slice(start, end).trim()

    if (content) {
      chunks.push({
        content,
        index: index++,
        tokenCount: estimateTokenCount(content),
      })
    }

    start = end - overlapChars
  }

  return chunks
}

/**
 * Merge small chunks to optimize token usage
 */
export function mergeSmallChunks(
  chunks: Chunk[],
  minTokens: number = 100,
  maxTokens: number = OPENAI_CONFIG.maxChunkTokens
): Chunk[] {
  if (chunks.length === 0) return []

  const merged: Chunk[] = []
  let current = chunks[0]

  for (let i = 1; i < chunks.length; i++) {
    const next = chunks[i]

    if (current.tokenCount + next.tokenCount <= maxTokens) {
      // Merge chunks
      current = {
        content: current.content + '\n\n' + next.content,
        index: current.index,
        tokenCount: current.tokenCount + next.tokenCount,
        metadata: { ...current.metadata, merged: true },
      }
    } else {
      merged.push(current)
      current = next
    }
  }

  merged.push(current)
  return merged
}
