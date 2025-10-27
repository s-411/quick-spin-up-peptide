'use client'

import { ArrowLeft, Users } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import {
  ChatInterface,
  ChatList,
  MessageThread,
  DirectMessage,
  CommentSection,
  CommentForm,
  ReactionBar,
  UserCard,
  FollowButton,
  SharePanel,
} from '@/components/sections'

export default function SocialPage() {
  const messages = [
    { id: '1', senderId: '2', senderName: 'Alice Johnson', content: 'Hey! How are you doing?', timestamp: new Date(Date.now() - 600000).toISOString(), isOwn: false },
    { id: '2', senderId: '1', senderName: 'You', content: 'Great! Just finished the new feature.', timestamp: new Date(Date.now() - 300000).toISOString(), isOwn: true },
    { id: '3', senderId: '2', senderName: 'Alice Johnson', content: 'Awesome! Can\'t wait to see it.', timestamp: new Date(Date.now() - 120000).toISOString(), isOwn: false },
  ]

  const conversations = [
    { id: '1', participants: [{ name: 'Alice Johnson' }], lastMessage: 'See you tomorrow!', timestamp: new Date(Date.now() - 120000).toISOString(), unreadCount: 2, isGroup: false },
    { id: '2', participants: [{ name: 'Bob Smith' }, { name: 'Carol White' }], lastMessage: 'Team meeting at 3pm', timestamp: new Date(Date.now() - 3600000).toISOString(), unreadCount: 0, isGroup: true },
  ]

  const threadMessage = {
    id: '1',
    senderId: '2',
    senderName: 'Alice Johnson',
    content: 'What do you think about the new design?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isOwn: false,
    replyCount: 2,
    replies: [
      { id: '2', senderId: '1', senderName: 'You', content: 'Looks great! Love the colors.', timestamp: new Date(Date.now() - 1800000).toISOString(), isOwn: true },
      { id: '3', senderId: '3', senderName: 'Bob Smith', content: 'Agreed! Very modern.', timestamp: new Date(Date.now() - 900000).toISOString(), isOwn: false },
    ],
  }

  const comments = [
    { id: '1', author: { name: 'Alice Johnson' }, content: 'This is amazing work!', timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 5, isLiked: false },
    { id: '2', author: { name: 'Bob Smith' }, content: 'Totally agree, well done!', timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 3, isLiked: true },
  ]

  const reactions = [
    { emoji: '👍', count: 12, userIds: ['1', '2', '3'], isReacted: true },
    { emoji: '❤️', count: 8, userIds: ['4', '5'], isReacted: false },
    { emoji: '🎉', count: 5, userIds: ['6'], isReacted: false },
  ]

  const user = {
    id: '1',
    name: 'Alice Johnson',
    username: 'alicej',
    bio: 'Product Designer | Coffee enthusiast ☕',
    followers: 1234,
    following: 567,
    posts: 89,
    isOnline: true,
  }

  const dmUsers = [
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Carol White' },
    { id: '4', name: 'David Brown' },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </a>
            <div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <h1 className="text-3xl md:text-4xl font-heading">Social & Communication</h1>
              </div>
              <p className="text-muted-foreground mt-1">Chat, comments, and social interactions</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChatList conversations={conversations} activeConversationId="1" />
            <div className="lg:col-span-2">
              <ChatInterface messages={messages} isTyping typingUser="Alice Johnson" />
            </div>
          </div>

          <MessageThread message={threadMessage} />

          <DirectMessage users={dmUsers} />

          <CommentSection comments={comments} onAddComment={() => {}} />

          <CommentForm showFormatting />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ReactionBar reactions={reactions} />
              <UserCard user={user} isFollowing={false} />
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 items-start">
                <FollowButton isFollowing={false} followerCount={1234} showCount size="lg" />
                <FollowButton isFollowing={true} followerCount={1235} showCount size="md" />
                <FollowButton isFollowing={false} size="sm" />
              </div>
              <SharePanel
                url="https://example.com/post/123"
                title="Check out this amazing post!"
                description="A great article about design"
                shareCount={342}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
