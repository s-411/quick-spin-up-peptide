'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Avatar } from '@/components/ui/avatar'
import { Clock, Calendar, ArrowRight } from 'lucide-react'
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

export interface BlogListProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of blog posts */
  posts: BlogPost[]
  /** Show author */
  showAuthor?: boolean
  /** Show excerpt */
  showExcerpt?: boolean
}

export function BlogList({
  title = 'Latest Articles',
  description = 'In-depth insights and stories',
  posts,
  showAuthor = true,
  showExcerpt = true,
}: BlogListProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
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

        {/* Posts List */}
        <div className="space-y-8">
          {posts.map((post, index) => (
            <EnhancedCard
              key={index}
              className="!p-0 overflow-hidden group cursor-pointer"
              onClick={() => window.location.href = post.href}
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="relative md:w-80 aspect-[16/9] md:aspect-auto overflow-hidden shrink-0">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Category */}
                  <div className="mb-3">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-heading mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {showExcerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {showAuthor && (
                        <div className="flex items-center gap-2">
                          {post.authorAvatar && (
                            <Avatar
                              src={post.authorAvatar}
                              alt={post.author}
                              size={32}
                              fallback={post.author}
                            />
                          )}
                          <span className="font-medium">{post.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>

                    {/* Read More Arrow */}
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
