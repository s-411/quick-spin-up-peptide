'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { ThumbsUp, MessageCircle, Trash2 } from 'lucide-react'

/**
 * Represents a comment
 */
export interface Comment {
  id: string
  author: { name: string; avatar?: string }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

/**
 * Props for the CommentSection component
 */
export interface CommentSectionProps {
  comments: Comment[]
  sortBy?: 'newest' | 'oldest' | 'popular'
  onAddComment?: (content: string, parentId?: string) => void
  onLike?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CommentSection({ comments, sortBy = 'newest', onAddComment, onLike, onDelete }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Comments ({comments.length})
      </h2>

      {/* Add Comment */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground resize-none mb-2"
        />
        <button
          onClick={() => {
            onAddComment?.(newComment)
            setNewComment('')
          }}
          disabled={!newComment.trim()}
          className="btn-mm"
        >
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-border pb-4 last:border-0">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-foreground mb-2">{comment.content}</p>
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => onLike?.(comment.id)}
                    className={`flex items-center gap-1 ${comment.isLiked ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {comment.likes}
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                  {onDelete && (
                    <button onClick={() => onDelete(comment.id)} className="flex items-center gap-1 text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </EnhancedCard>
  )
}
