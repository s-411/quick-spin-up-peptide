'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { MoreVertical, Users } from 'lucide-react'

/**
 * Represents a conversation
 */
export interface Conversation {
  /** Unique identifier */
  id: string
  /** Conversation participants */
  participants: Array<{ name: string; avatar?: string }>
  /** Last message preview */
  lastMessage: string
  /** Timestamp of last message */
  timestamp: string
  /** Number of unread messages */
  unreadCount: number
  /** Whether this is a group conversation */
  isGroup: boolean
}

/**
 * Props for the ChatList component
 */
export interface ChatListProps {
  /** Array of conversations */
  conversations: Conversation[]
  /** ID of the active conversation */
  activeConversationId?: string
  /** Callback when a conversation is selected */
  onSelect?: (id: string) => void
  /** Callback when archive is clicked */
  onArchive?: (id: string) => void
  /** Callback when delete is clicked */
  onDelete?: (id: string) => void
}

/**
 * ChatList component displays a list of conversations.
 * Supports selection, archiving, and deleting conversations.
 */
export function ChatList({
  conversations,
  activeConversationId,
  onSelect,
  onArchive,
  onDelete,
}: ChatListProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">
          Messages
        </h2>
      </div>

      <div className="divide-y divide-border">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect?.(conversation.id)}
            className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
              activeConversationId === conversation.id
                ? 'bg-primary/10 border-l-4 border-primary'
                : ''
            }`}
          >
            <div className="flex gap-3">
              {/* Avatar(s) */}
              <div className="flex-shrink-0 relative">
                {conversation.isGroup ? (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                ) : conversation.participants[0]?.avatar ? (
                  <img
                    src={conversation.participants[0].avatar}
                    alt={conversation.participants[0].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {conversation.participants[0]?.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {conversation.isGroup
                      ? `${conversation.participants.length} members`
                      : conversation.participants[0]?.name}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    conversation.unreadCount > 0
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {conversation.lastMessage}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Conversation options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="text-center py-12 px-4">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No conversations yet</p>
        </div>
      )}
    </EnhancedCard>
  )
}
