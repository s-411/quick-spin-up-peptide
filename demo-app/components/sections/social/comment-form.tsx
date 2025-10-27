'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Bold, Italic, Link as LinkIcon, AtSign, Paperclip } from 'lucide-react'

export interface CommentFormProps {
  onSubmit?: (content: string, mentions: string[], attachments?: File[]) => void
  placeholder?: string
  showFormatting?: boolean
  mentionableUsers?: Array<{ id: string; name: string; avatar?: string }>
}

export function CommentForm({ onSubmit, placeholder = 'Write a comment...', showFormatting = true, mentionableUsers }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [mentions, setMentions] = useState<string[]>([])

  const handleSubmit = () => {
    if (!content.trim()) return
    onSubmit?.(content, mentions)
    setContent('')
    setMentions([])
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground resize-none mb-2"
      />
      {showFormatting && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="p-2 hover:bg-muted rounded"><Bold className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-muted rounded"><Italic className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-muted rounded"><LinkIcon className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-muted rounded"><AtSign className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-muted rounded"><Paperclip className="w-4 h-4" /></button>
          </div>
          <button onClick={handleSubmit} disabled={!content.trim()} className="btn-mm">Post</button>
        </div>
      )}
    </EnhancedCard>
  )
}
