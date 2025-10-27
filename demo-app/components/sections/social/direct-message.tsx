'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Send, X } from 'lucide-react'

/**
 * Props for the DirectMessage component
 */
export interface DirectMessageProps {
  /** Callback when sending a message */
  onSend?: (recipientIds: string[], content: string, attachments?: File[]) => void
  /** Available users to message */
  users: Array<{ id: string; name: string; avatar?: string }>
  /** Whether message is sending */
  isSending?: boolean
}

/**
 * DirectMessage component for composing and sending direct messages.
 * Supports multiple recipients and message composition.
 */
export function DirectMessage({ onSend, users, isSending = false }: DirectMessageProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSend = () => {
    if (selectedUsers.length === 0 || !message.trim()) return
    onSend?.(selectedUsers, message)
    setMessage('')
    setSelectedUsers([])
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        New Message
      </h2>

      {/* Recipients */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          To:
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
        />

        {searchTerm && (
          <div className="mt-2 max-h-40 overflow-y-auto border border-border rounded-lg">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  toggleUser(user.id)
                  setSearchTerm('')
                }}
                className="w-full px-4 py-2 hover:bg-muted/50 flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground">{user.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedUsers.map((userId) => {
              const user = users.find((u) => u.id === userId)
              return (
                <div
                  key={userId}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {user?.name}
                  <button onClick={() => toggleUser(userId)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Message:
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          rows={6}
          className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground resize-none"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={selectedUsers.length === 0 || !message.trim() || isSending}
        className="btn-mm w-full flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {isSending ? 'Sending...' : 'Send Message'}
      </button>
    </EnhancedCard>
  )
}
