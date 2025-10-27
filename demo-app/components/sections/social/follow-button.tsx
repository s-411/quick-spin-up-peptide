'use client'

import { CheckCircle, UserPlus } from 'lucide-react'

export interface FollowButtonProps {
  isFollowing: boolean
  followerCount?: number
  onToggle?: () => void
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export function FollowButton({ isFollowing, followerCount, onToggle, size = 'md', showCount = false }: FollowButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      onClick={onToggle}
      className={`rounded-lg font-semibold transition-colors flex items-center gap-2 ${sizeClasses[size]} ${
        isFollowing
          ? 'bg-muted text-foreground hover:bg-muted/80'
          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
      }`}
    >
      {isFollowing ? <CheckCircle className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
      {isFollowing ? 'Following' : 'Follow'}
      {showCount && followerCount !== undefined && (
        <span className="ml-1">({followerCount.toLocaleString()})</span>
      )}
    </button>
  )
}
