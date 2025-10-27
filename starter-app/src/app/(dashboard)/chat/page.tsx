/**
 * Chat Interface Page
 * RAG-powered Q&A chatbot
 */

'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/container'
import { MessageList } from '@/components/chat/message-list'
import { ChatInput } from '@/components/chat/chat-input'
import { useChat } from '@/hooks/use-chat'
import Link from 'next/link'

export default function ChatPage() {
  const {
    sessions,
    currentSession,
    messages,
    loading,
    error,
    streaming,
    createSession,
    loadSession,
    sendMessage,
  } = useChat()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleStartNewChat = async () => {
    const sessionId = await createSession()
    console.log('Created new session:', sessionId)
  }

  const handleSelectSession = (sessionId: string) => {
    loadSession(sessionId)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 border-r border-border bg-card">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <button
                onClick={handleStartNewChat}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                + New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {sessions.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  No chat sessions yet
                </p>
              ) : (
                <div className="space-y-1">
                  {sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`w-full rounded-lg p-3 text-left text-sm transition-colors ${
                        currentSession?.id === session.id
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <p className="font-medium truncate">{session.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {session.messageCount} messages
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border">
              <Link
                href="/documents"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Manage Documents
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-accent"
              aria-label="Toggle sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="font-semibold text-foreground">
                {currentSession?.title || 'Select or start a chat'}
              </h1>
              {currentSession && (
                <p className="text-xs text-muted-foreground">
                  {currentSession.messageCount} messages
                </p>
              )}
            </div>
          </div>

          {!currentSession && (
            <button
              onClick={handleStartNewChat}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start New Chat
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Messages */}
        {!currentSession ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Welcome to RAG Chat</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask questions about your uploaded documents
              </p>
              <button
                onClick={handleStartNewChat}
                className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start Your First Chat
              </button>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} streaming={streaming} />
        )}

        {/* Input */}
        {currentSession && (
          <ChatInput
            onSend={sendMessage}
            disabled={streaming || loading}
            placeholder="Ask a question about your documents..."
          />
        )}
      </div>
    </div>
  )
}
