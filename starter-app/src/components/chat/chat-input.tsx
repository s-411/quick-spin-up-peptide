/**
 * Chat Input Component
 * Text input for sending messages
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = 'Ask a question about your documents...',
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = message.trim()
    if (!trimmed || disabled) return

    onSend(trimmed)
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('border-t border-border bg-card', className)}>
      <div className="flex items-end gap-2 p-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground',
            'placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'max-h-32 overflow-y-auto'
          )}
        />

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground',
            'transition-all hover:bg-primary/90',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label="Send message"
        >
          {disabled ? (
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="px-4 pb-3 text-xs text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1 py-0.5 font-mono">Enter</kbd> to send,{' '}
        <kbd className="rounded bg-muted px-1 py-0.5 font-mono">Shift+Enter</kbd> for new line
      </div>
    </form>
  )
}
