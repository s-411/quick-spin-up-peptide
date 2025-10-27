'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Twitter, Facebook, Linkedin, Mail, Copy, Check } from 'lucide-react'

export interface SharePanelProps {
  url: string
  title: string
  description?: string
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy'>
  onShare?: (platform: string) => void
  shareCount?: number
}

const platformConfig = {
  twitter: { icon: Twitter, label: 'Twitter', color: 'bg-blue-400 hover:bg-blue-500' },
  facebook: { icon: Facebook, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
  email: { icon: Mail, label: 'Email', color: 'bg-gray-600 hover:bg-gray-700' },
  copy: { icon: Copy, label: 'Copy Link', color: 'bg-gray-600 hover:bg-gray-700' },
}

export function SharePanel({ url, title, description, platforms = ['twitter', 'facebook', 'linkedin', 'email', 'copy'], onShare, shareCount }: SharePanelProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    onShare?.(platform)
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Share this content</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {platforms.map((platform) => {
          const config = platformConfig[platform]
          const Icon = config.icon
          const isCopy = platform === 'copy'

          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={`${config.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center gap-2`}
            >
              {isCopy && copied ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              <span className="text-xs font-medium">{isCopy && copied ? 'Copied!' : config.label}</span>
            </button>
          )
        })}
      </div>

      {shareCount !== undefined && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Shared {shareCount.toLocaleString()} times
        </p>
      )}
    </EnhancedCard>
  )
}
