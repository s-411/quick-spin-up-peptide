'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Clock, Calendar, User } from 'lucide-react'
import Image from 'next/image'

export interface BlogPost {
  /** Post title */
  title: string
  /** Post excerpt/description */
  excerpt: string
  /** Author name */
  author: string
  /** Author avatar URL */
  authorAvatar?: string
  /** Post thumbnail URL */
  thumbnail: string
  /** Post category */
  category: string
  /** Reading time in minutes */
  readTime: number
  /** Published date */
  date: string
  /** Post URL/slug */
  href: string
}

export interface BlogGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of blog posts */
  posts: BlogPost[]
  /** Grid columns */
  columns?: 2 | 3
  /** Show categories */
  showCategories?: boolean
  /** Show read time */
  showReadTime?: boolean
  /** Show author */
  showAuthor?: boolean
}

export function BlogGrid({
  title = 'Latest Articles',
  description = 'Thoughts, stories and ideas',
  posts,
  columns = 3,
  showCategories = true,
  showReadTime = true,
  showAuthor = true,
}: BlogGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Posts Grid */}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
          {posts.map((post, index) => (
            <EnhancedCard
              key={index}
              className="!p-0 overflow-hidden group cursor-pointer"
              onClick={() => window.location.href = post.href}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {showCategories && post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary text-primary-foreground">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-heading mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {showAuthor && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  {showReadTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  )}
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
