'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { MessageCircle, Share2, CheckCircle } from 'lucide-react'

export interface UserCardProps {
  user: {
    id: string
    name: string
    username: string
    avatar?: string
    bio?: string
    followers: number
    following: number
    posts: number
    isOnline?: boolean
  }
  isFollowing?: boolean
  onFollow?: () => void
  onMessage?: () => void
  onShare?: () => void
}

export function UserCard({ user, isFollowing, onFollow, onMessage, onShare }: UserCardProps) {
  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          {user.isOnline && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary border-4 border-card rounded-full" />
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
        <p className="text-muted-foreground">@{user.username}</p>

        {user.bio && <p className="text-sm text-foreground mt-2">{user.bio}</p>}

        <div className="flex justify-center gap-6 my-4">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{user.following}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        <div className="flex gap-2">
          {onFollow && (
            <button onClick={onFollow} className={`flex-1 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isFollowing ? 'bg-muted text-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
              {isFollowing && <CheckCircle className="w-4 h-4" />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {onMessage && (
            <button onClick={onMessage} className="btn-secondary p-2"><MessageCircle className="w-5 h-5" /></button>
          )}
          {onShare && (
            <button onClick={onShare} className="btn-secondary p-2"><Share2 className="w-5 h-5" /></button>
          )}
        </div>
      </div>
    </EnhancedCard>
  )
}
