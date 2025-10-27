'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Avatar } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export interface Testimonial {
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
  /** Company logo URL */
  logo?: string
}

export interface TestimonialGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of testimonials */
  testimonials: Testimonial[]
  /** Grid columns */
  columns?: 2 | 3
}

export function TestimonialGrid({
  title = 'What Our Customers Say',
  description = 'Real feedback from real people',
  testimonials,
  columns = 3,
}: TestimonialGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
  }

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

        {/* Testimonials Grid */}
        <div className={`grid gap-6 ${gridCols[columns]}`}>
          {testimonials.map((testimonial, index) => (
            <EnhancedCard
              key={index}
              className="!p-6"
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
                <blockquote className="text-foreground leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-4">
                  {testimonial.avatar && (
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fallback={testimonial.name.charAt(0)}
                      size={48}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.title} at {testimonial.company}
                    </div>
                  </div>
                  {testimonial.logo && (
                    <img
                      src={testimonial.logo}
                      alt={testimonial.company}
                      className="h-8 w-auto opacity-60 dark:opacity-40"
                    />
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
