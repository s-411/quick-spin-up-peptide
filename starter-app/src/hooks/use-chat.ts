/**
 * useChat Hook
 * Manages chat state and streaming responses
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    documentId: string
    chunkIndex: number
    similarity: number
  }>
  createdAt: string
}

export interface ChatSession {
  id: string
  title: string
  messageCount: number
  lastMessageAt: string | null
  createdAt: string
}

export interface UseChatReturn {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  streaming: boolean
  createSession: () => Promise<string>
  loadSession: (sessionId: string) => Promise<void>
  sendMessage: (message: string) => Promise<void>
  refreshSessions: () => Promise<void>
}

/**
 * Hook for managing chat state
 */
export function useChat(initialSessionId?: string): UseChatReturn {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/chat/sessions')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sessions')
      }

      setSessions(data.sessions || [])
    } catch (err) {
      console.error('Error fetching sessions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
    }
  }, [])

  // Load session messages
  const loadSession = useCallback(
    async (sessionId: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/chat/sessions/${sessionId}/messages`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load messages')
        }

        setMessages(data.messages || [])

        // Find and set current session
        const session = sessions.find(s => s.id === sessionId)
        if (session) {
          setCurrentSession(session)
        }
      } catch (err) {
        console.error('Error loading session:', err)
        setError(err instanceof Error ? err.message : 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    },
    [sessions]
  )

  // Create new session
  const createSession = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session')
      }

      await fetchSessions()
      setCurrentSession(data.session)
      setMessages([])

      return data.session.id
    } catch (err) {
      console.error('Error creating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
      throw err
    }
  }, [fetchSessions])

  // Send message with streaming
  const sendMessage = useCallback(
    async (message: string) => {
      if (!currentSession) {
        throw new Error('No active session')
      }

      try {
        setStreaming(true)
        setError(null)

        // Add user message immediately
        const userMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          sessionId: currentSession.id,
          role: 'user',
          content: message,
          createdAt: new Date().toISOString(),
        }

        setMessages(prev => [...prev, userMessage])

        // Create assistant message placeholder
        const assistantMessage: ChatMessage = {
          id: `temp-assistant-${Date.now()}`,
          sessionId: currentSession.id,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        }

        setMessages(prev => [...prev, assistantMessage])

        // Setup streaming
        abortControllerRef.current = new AbortController()

        const response = await fetch(`/api/chat/sessions/${currentSession.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No response body')
        }

        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE messages
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'chunk') {
                // Append chunk to assistant message
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg.role === 'assistant') {
                    lastMsg.content += data.content
                  }
                  return updated
                })
              } else if (data.type === 'done') {
                // Update with sources
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg.role === 'assistant') {
                    lastMsg.sources = data.sources
                  }
                  return updated
                })
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            }
          }
        }

        // Refresh sessions to update last message time
        await fetchSessions()
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Message cancelled')
        } else {
          console.error('Error sending message:', err)
          setError(err instanceof Error ? err.message : 'Failed to send message')

          // Remove failed assistant message
          setMessages(prev => prev.slice(0, -1))
        }
      } finally {
        setStreaming(false)
        abortControllerRef.current = null
      }
    },
    [currentSession, fetchSessions]
  )

  // Initial load
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  // Load initial session if provided
  useEffect(() => {
    if (initialSessionId && sessions.length > 0) {
      loadSession(initialSessionId)
    }
  }, [initialSessionId, sessions.length, loadSession])

  return {
    sessions,
    currentSession,
    messages,
    loading,
    error,
    streaming,
    createSession,
    loadSession,
    sendMessage,
    refreshSessions: fetchSessions,
  }
}
