/**
 * RAG (Retrieval-Augmented Generation) Service
 * Orchestrates the retrieve → augment → generate pipeline
 */

import { getOpenAIClient, OPENAI_MODELS, OPENAI_CONFIG } from '@/lib/openai'
import {
  searchDocuments,
  formatSearchContext,
  extractSourceMetadata,
  type SearchResult,
} from './search-service'
import { retryWithBackoff } from '@/lib/errors'

export interface RAGOptions {
  userId: string
  searchLimit?: number
  similarityThreshold?: number
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  includeHistory?: boolean
}

export interface RAGResponse {
  answer: string
  sources: SearchResult[]
  tokenCount: number
  model: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Default system prompt for RAG
 */
const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant that answers questions based on the provided context.

Guidelines:
- Answer questions using ONLY the information from the provided context
- If the context doesn't contain enough information to answer, say so
- Be concise and accurate
- Cite sources when possible using [Source N] notation
- If asked about something not in the context, politely explain you can only answer based on the provided documents
- Do not make up information or use knowledge outside the provided context`

/**
 * Generate answer using RAG pipeline
 */
export async function generateRAGResponse(
  query: string,
  options: RAGOptions,
  conversationHistory: ChatMessage[] = []
): Promise<RAGResponse> {
  // Step 1: Retrieve relevant context
  const searchResults = await searchDocuments(query, {
    userId: options.userId,
    limit: options.searchLimit,
    similarityThreshold: options.similarityThreshold,
  })

  // Step 2: Augment query with context
  const context = formatSearchContext(searchResults)

  // Step 3: Generate response
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: options.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    },
  ]

  // Add conversation history if requested
  if (options.includeHistory && conversationHistory.length > 0) {
    // Limit history to last 5 exchanges to stay within token limits
    const recentHistory = conversationHistory.slice(-10)
    messages.push(...recentHistory)
  }

  // Add context and current query
  messages.push({
    role: 'user',
    content: `Context:\n${context}\n\n---\n\nQuestion: ${query}`,
  })

  // Call OpenAI
  const response = await retryWithBackoff(
    async () => {
      const openai = getOpenAIClient()

      return await openai.chat.completions.create({
        model: OPENAI_MODELS.chat,
        messages,
        temperature: options.temperature ?? OPENAI_CONFIG.temperature,
        max_tokens: options.maxTokens ?? OPENAI_CONFIG.maxTokens,
      })
    },
    3,
    1000
  )

  const answer = response.choices[0]?.message?.content || 'No response generated'

  return {
    answer,
    sources: searchResults,
    tokenCount: response.usage?.total_tokens || 0,
    model: response.model,
  }
}

/**
 * Generate streaming RAG response
 * Returns async iterator for streaming responses
 */
export async function* generateStreamingRAGResponse(
  query: string,
  options: RAGOptions,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  // Retrieve context
  const searchResults = await searchDocuments(query, {
    userId: options.userId,
    limit: options.searchLimit,
    similarityThreshold: options.similarityThreshold,
  })

  const context = formatSearchContext(searchResults)

  // Prepare messages
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: options.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    },
  ]

  if (options.includeHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-10)
    messages.push(...recentHistory)
  }

  messages.push({
    role: 'user',
    content: `Context:\n${context}\n\n---\n\nQuestion: ${query}`,
  })

  // Stream response
  const openai = getOpenAIClient()

  const stream = await openai.chat.completions.create({
    model: OPENAI_MODELS.chat,
    messages,
    temperature: options.temperature ?? OPENAI_CONFIG.temperature,
    max_tokens: options.maxTokens ?? OPENAI_CONFIG.maxTokens,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}

/**
 * Evaluate if query can be answered with available context
 */
export async function evaluateQuery(
  query: string,
  userId: string
): Promise<{
  canAnswer: boolean
  confidence: number
  suggestedDocuments: string[]
}> {
  const searchResults = await searchDocuments(query, {
    userId,
    limit: 5,
    similarityThreshold: 0.6,
  })

  // Calculate confidence based on top result similarity
  const topSimilarity = searchResults[0]?.similarity || 0
  const canAnswer = topSimilarity > 0.7 && searchResults.length > 0

  // Extract unique document IDs
  const suggestedDocuments = Array.from(new Set(searchResults.map(r => r.documentId)))

  return {
    canAnswer,
    confidence: topSimilarity,
    suggestedDocuments,
  }
}

/**
 * Generate answer with fallback to web search or general knowledge
 */
export async function generateAnswerWithFallback(
  query: string,
  options: RAGOptions,
  conversationHistory: ChatMessage[] = []
): Promise<RAGResponse> {
  // Try RAG first
  const ragResponse = await generateRAGResponse(query, options, conversationHistory)

  // If no relevant sources found, fall back to general LLM
  if (ragResponse.sources.length === 0) {
    const openai = getOpenAIClient()

    const fallbackResponse = await openai.chat.completions.create({
      model: OPENAI_MODELS.chatFallback,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant. The user asked a question, but no relevant documents were found in their knowledge base. Provide a helpful general answer, but mention that this is not based on their uploaded documents.',
        },
        ...conversationHistory.slice(-10),
        { role: 'user', content: query },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      answer: `⚠️ No relevant documents found for this question.\n\n${
        fallbackResponse.choices[0]?.message?.content || 'Could not generate answer'
      }`,
      sources: [],
      tokenCount: fallbackResponse.usage?.total_tokens || 0,
      model: fallbackResponse.model,
    }
  }

  return ragResponse
}

/**
 * Format RAG response for API
 */
export function formatRAGResponseForAPI(response: RAGResponse) {
  return {
    answer: response.answer,
    sources: extractSourceMetadata(response.sources),
    tokenCount: response.tokenCount,
    model: response.model,
  }
}
