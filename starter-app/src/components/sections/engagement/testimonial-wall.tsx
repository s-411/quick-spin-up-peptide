'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Avatar } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export interface WallTestimonial {
  /** Customer quote */
  quote: string
  /** Customer name */
  name: string
  /** Customer title/position */
  title: string
  /** Customer company */
  company: string
  /** Customer avatar URL */
  avatar?: string
  /** Star rating (1-5) */
  rating?: number
  /** Whether this is a featured/highlighted testimonial */
  featured?: boolean
}

export interface TestimonialWallProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of testimonials */
  testimonials: WallTestimonial[]
}

export function TestimonialWall({
  title = 'Loved by Thousands',
  description = 'Join our community of happy customers',
  testimonials,
}: TestimonialWallProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <EnhancedCard
              key={index}
              className={`!p-6 ${
                testimonial.featured ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating!
                            ? 'fill-primary text-primary'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Quote */}
                <blockquote
                  className={`text-foreground leading-relaxed ${
                    testimonial.featured ? 'text-lg' : ''
                  }`}
                >
                  "{testimonial.quote}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-2">
                  {testimonial.avatar && (
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fallback={testimonial.name.charAt(0)}
                      size={40}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {testimonial.title}
                    </div>
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
