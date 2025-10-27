'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Represents a message with thread support
 */
export interface ThreadMessage {
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
  /** Reply messages */
  replies?: ThreadMessage[]
  /** Number of replies */
  replyCount?: number
}

/**
 * Props for the MessageThread component
 */
export interface MessageThreadProps {
  /** Root message with replies */
  message: ThreadMessage
  /** Callback when replying */
  onReply?: (parentId: string, content: string) => void
  /** Whether thread is collapsed by default */
  collapsed?: boolean
}

/**
 * MessageThread component displays a message with threaded replies.
 * Supports collapsing/expanding reply threads.
 */
export function MessageThread({ message, onReply, collapsed = false }: MessageThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [replyText, setReplyText] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)

  const handleReply = () => {
    if (!replyText.trim()) return
    onReply?.(message.id, replyText)
    setReplyText('')
    setShowReplyInput(false)
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-4">
      {/* Root Message */}
      <div className="flex gap-3">
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

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">
              {message.senderName}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-foreground mb-2">{message.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>

            {message.replyCount && message.replyCount > 0 && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide replies
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <button onClick={handleReply} className="btn-mm text-sm px-4">
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {!isCollapsed && message.replies && message.replies.length > 0 && (
        <div className="mt-4 ml-12 pl-4 border-l-2 border-border space-y-4">
          {message.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="flex-shrink-0">
                {reply.senderAvatar ? (
                  <img
                    src={reply.senderAvatar}
                    alt={reply.senderName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {reply.senderName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">
                    {reply.senderName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reply.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-foreground">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </EnhancedCard>
  )
}
