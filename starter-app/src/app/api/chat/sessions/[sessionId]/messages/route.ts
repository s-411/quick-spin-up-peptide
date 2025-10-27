/**
 * Chat Messages API with Streaming
 * POST /api/chat/sessions/[sessionId]/messages - Send message and get streaming response
 * GET /api/chat/sessions/[sessionId]/messages - Get message history
 */

import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateStreamingRAGResponse, type ChatMessage } from '@/lib/services/rag-service'
import { extractSourceMetadata } from '@/lib/services/search-service'
import { z } from 'zod'

interface RouteParams {
  params: {
    sessionId: string
  }
}

const sendMessageSchema = z.object({
  message: z.string().min(1),
  searchLimit: z.number().optional(),
  temperature: z.number().min(0).max(2).optional(),
})

/**
 * POST /api/chat/sessions/[sessionId]/messages
 * Send a message and get streaming RAG response
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const encoder = new TextEncoder()
  const { sessionId } = params

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const supabase = createServerSupabaseClient()

        // Check authentication
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Unauthorized' })}\n\n`)
          )
          controller.close()
          return
        }

        // Verify session belongs to user
        const { data: session, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single()

        if (sessionError || !session) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Session not found' })}\n\n`)
          )
          controller.close()
          return
        }

        // Parse request body
        const body = await request.json()
        const { message, searchLimit, temperature } = sendMessageSchema.parse(body)

        // Save user message
        const { data: userMessage, error: userMessageError } = await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            user_id: user.id,
            role: 'user',
            content: message,
          })
          .select()
          .single()

        if (userMessageError) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Failed to save user message' })}\n\n`)
          )
          controller.close()
          return
        }

        // Get conversation history
        const { data: historyData } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
          .limit(20) // Last 20 messages

        const history: ChatMessage[] = (historyData || []).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

        // Stream RAG response
        let fullResponse = ''
        let sources: any[] = []

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`))

        for await (const chunk of generateStreamingRAGResponse(
          message,
          {
            userId: user.id,
            searchLimit,
            temperature,
            includeHistory: true,
          },
          history.slice(0, -1) // Exclude the message we just added
        )) {
          fullResponse += chunk

          // Send chunk to client
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`)
          )
        }

        // Get sources (search again to get them)
        const { searchDocuments } = await import('@/lib/services/search-service')
        const searchResults = await searchDocuments(message, {
          userId: user.id,
          limit: searchLimit || 5,
        })

        sources = extractSourceMetadata(searchResults)

        // Save assistant message
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'assistant',
          content: fullResponse,
          sources,
        })

        // Send completion
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'done', sources, messageId: userMessage.id })}\n\n`
          )
        )

        controller.close()
      } catch (error) {
        console.error('Streaming error:', error)
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'Unknown error',
            })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

/**
 * GET /api/chat/sessions/[sessionId]/messages
 * Get message history
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()
    const { sessionId } = params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return Response.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get messages
    const { data: messages, error: fetchError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching messages:', fetchError)
      return Response.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return Response.json({ messages: messages || [] })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
