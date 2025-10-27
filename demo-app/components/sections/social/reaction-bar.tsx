'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Plus } from 'lucide-react'

export interface Reaction {
  emoji: string
  count: number
  userIds: string[]
  isReacted: boolean
}

export interface ReactionBarProps {
  reactions: Reaction[]
  onReact?: (emoji: string) => void
  availableReactions?: string[]
}

export function ReactionBar({ reactions, onReact, availableReactions = ['👍', '❤️', '😂', '🎉', '🤔', '👏'] }: ReactionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => onReact?.(reaction.emoji)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-all ${
            reaction.isReacted
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-muted border-border hover:border-primary'
          }`}
        >
          <span>{reaction.emoji}</span>
          <span className="font-semibold">{reaction.count}</span>
        </button>
      ))}
      <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-border bg-muted hover:border-primary">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
