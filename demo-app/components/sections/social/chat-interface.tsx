'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Send, Paperclip, Smile, Loader } from 'lucide-react'

/**
 * Represents a chat message
 */
export interface Message {
  /** Unique identifier */
  id: string
  /** Sender ID */
  senderId: string
  /** Sender name */
  senderName: string
  /** Sender avatar URL (optional) */
  senderAvatar?: string
  /** Message content */
  content: string
  /** Timestamp */
  timestamp: string
  /** Whether this message is from the current user */
  isOwn: boolean
  /** Optional attachments */
  attachments?: Array<{ url: string; name: string; type: string }>
}

/**
 * Props for the ChatInterface component
 */
export interface ChatInterfaceProps {
  /** Array of messages */
  messages: Message[]
  /** Callback when sending a message */
  onSendMessage?: (content: string, attachments?: File[]) => void
  /** Whether someone is typing */
  isTyping?: boolean
  /** Name of user who is typing */
  typingUser?: string
}

/**
 * ChatInterface component provides a full-featured chat UI.
 * Supports text messages, attachments, and typing indicators.
 */
export function ChatInterface({
  messages,
  onSendMessage,
  isTyping = false,
  typingUser,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    setIsSending(true)
    await onSendMessage?.(inputValue)
    setInputValue('')
    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-0 flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {!message.isOwn && (
              <div className="flex-shrink-0">
                {message.senderAvatar ? (
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {message.senderName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {/* Message Bubble */}
            <div className={`flex-1 max-w-[70%] ${message.isOwn ? 'text-right' : ''}`}>
              {!message.isOwn && (
                <p className="text-sm font-medium text-foreground mb-1">
                  {message.senderName}
                </p>
              )}
              <div
                className={`inline-block px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className={`text-xs px-2 py-1 rounded ${
                          message.isOwn ? 'bg-primary/80' : 'bg-muted'
                        }`}
                      >
                        {attachment.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="bg-muted px-4 py-2 rounded-2xl">
              <p className="text-sm text-muted-foreground">
                {typingUser || 'Someone'} is typing...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <button
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Add attachment"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-muted rounded-lg px-4 py-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-transparent text-foreground resize-none focus:outline-none"
              disabled={isSending}
            />
          </div>

          <button
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className={`p-3 rounded-lg transition-colors ${
              inputValue.trim() && !isSending
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {isSending ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </EnhancedCard>
  )
}
