/**
 * Chat Message List Component
 * Displays chat messages with source citations
 */

'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { ChatMessage } from '@/hooks/use-chat'
import { SourceCitations } from './source-citations'

export interface MessageListProps {
  messages: ChatMessage[]
  streaming?: boolean
  className?: string
}

export function MessageList({ messages, streaming, className }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  if (messages.length === 0) {
    return (
      <div className={cn('flex flex-1 items-center justify-center', className)}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-8 w-8 text-muted-foreground"
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
          <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start a conversation by asking a question
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex-1 space-y-6 overflow-y-auto p-4', className)}>
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          {message.role === 'assistant' && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          )}

          <div
            className={cn(
              'max-w-[80%] rounded-lg px-4 py-3',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border'
            )}
          >
            <div className="whitespace-pre-wrap break-words text-sm">
              {message.content}
              {streaming && index === messages.length - 1 && (
                <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current" />
              )}
            </div>

            {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
              <div className="mt-3">
                <SourceCitations sources={message.sources} />
              </div>
            )}

            <p className="mt-2 text-xs opacity-70">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>

          {message.role === 'user' && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
              <svg
                className="h-5 w-5 text-secondary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
