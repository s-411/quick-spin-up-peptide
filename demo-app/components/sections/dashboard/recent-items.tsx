'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Star, Trash2, FileText, Image, Video, File } from 'lucide-react'

/**
 * Represents a recent item
 */
export interface RecentItem {
  /** Unique identifier */
  id: string
  /** Item title */
  title: string
  /** Item type */
  type: string
  /** Thumbnail URL (optional) */
  thumbnail?: string
  /** Last accessed timestamp */
  lastAccessed: string
  /** Whether item is favorited */
  isFavorite?: boolean
}

/**
 * Props for the RecentItems component
 */
export interface RecentItemsProps {
  /** Array of recent items */
  items: RecentItem[]
  /** Callback when item is clicked */
  onItemClick?: (id: string) => void
  /** Callback when favorite is toggled */
  onToggleFavorite?: (id: string) => void
  /** Callback when clear history is clicked */
  onClearHistory?: () => void
}

const getTypeIcon = (type: string) => {
  const lowerType = type.toLowerCase()
  if (lowerType.includes('doc') || lowerType.includes('text')) return FileText
  if (lowerType.includes('image') || lowerType.includes('photo')) return Image
  if (lowerType.includes('video')) return Video
  return File
}

/**
 * RecentItems component displays recently accessed items.
 * Supports favoriting and clearing history.
 */
export function RecentItems({
  items,
  onItemClick,
  onToggleFavorite,
  onClearHistory,
}: RecentItemsProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Recent Items
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your recently accessed content
          </p>
        </div>
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Clear history"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const TypeIcon = getTypeIcon(item.type)

          return (
            <div
              key={item.id}
              className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => onItemClick?.(item.id)}
            >
              {/* Thumbnail or Icon */}
              <div className="aspect-video bg-muted/50 flex items-center justify-center">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <TypeIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {item.title}
                  </h3>
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(item.id)
                      }}
                      className={`flex-shrink-0 ${
                        item.isFavorite
                          ? 'text-secondary'
                          : 'text-muted-foreground hover:text-secondary'
                      } transition-colors`}
                      aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-5 h-5 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.type}</span>
                  <span className="text-muted-foreground">
                    {formatTimestamp(item.lastAccessed)}
                  </span>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onItemClick?.(item.id)
                  }}
                  className="bg-card text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  Open
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent items</p>
        </div>
      )}
    </EnhancedCard>
  )
}
