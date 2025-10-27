'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Clock, Calendar, User, ArrowRight } from 'lucide-react'
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

export interface BlogFeaturedProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Featured post */
  featuredPost: BlogPost
  /** Recent posts (3-4 recommended) */
  recentPosts: BlogPost[]
}

export function BlogFeatured({
  title = 'Featured Articles',
  description,
  featuredPost,
  recentPosts,
}: BlogFeaturedProps) {
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

        {/* Featured Post */}
        <EnhancedCard
          className="!p-0 overflow-hidden mb-8 group cursor-pointer"
          onClick={() => window.location.href = featuredPost.href}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Featured Image */}
            <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
              <Image
                src={featuredPost.thumbnail}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 text-sm font-bold rounded-full bg-primary text-primary-foreground">
                  Featured
                </span>
              </div>
            </div>

            {/* Featured Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {/* Category */}
              <div className="mb-4">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                  {featuredPost.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-heading mb-4 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{featuredPost.readTime} min read</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-primary font-semibold">
                Read Article
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </EnhancedCard>

        {/* Recent Posts Grid */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
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
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h4 className="text-lg font-heading mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                </div>
              </EnhancedCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
