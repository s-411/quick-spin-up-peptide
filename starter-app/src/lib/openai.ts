/**
 * OpenAI Client Configuration
 * Provides OpenAI API client for embeddings and chat completions
 */

import OpenAI from 'openai'
import { env } from './env'

/**
 * OpenAI client instance
 * Configured with API key from environment
 */
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

/**
 * Default models for different tasks
 */
export const OPENAI_MODELS = {
  embedding: 'text-embedding-ada-002', // 1536 dimensions
  chat: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for faster/cheaper
  chatFallback: 'gpt-3.5-turbo',
} as const

/**
 * OpenAI configuration constants
 */
export const OPENAI_CONFIG = {
  maxTokens: 2000, // Max tokens for chat completion response
  temperature: 0.7, // Creativity level (0-2)
  embeddingDimensions: 1536, // text-embedding-ada-002 dimensions
  maxChunkTokens: 500, // Max tokens per document chunk
  contextChunkCount: 5, // Number of relevant chunks to include in context
} as const

/**
 * Token counting utilities
 * Note: This is a rough estimate. For precise counting, use tiktoken library
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters in English
  return Math.ceil(text.length / 4)
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!env.OPENAI_API_KEY && env.OPENAI_API_KEY.startsWith('sk-')
}

/**
 * Get OpenAI client
 * Throws error if not configured
 */
export function getOpenAIClient(): OpenAI {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.')
  }
  return openai
}
