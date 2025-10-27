'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Avatar } from '@/components/ui/avatar'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export interface CarouselTestimonial {
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
}

export interface TestimonialCarouselProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of testimonials */
  testimonials: CarouselTestimonial[]
  /** Auto-advance interval in ms (0 to disable) */
  autoAdvance?: number
}

export function TestimonialCarousel({
  title = 'Customer Stories',
  description = 'Hear from those who trust us',
  testimonials,
  autoAdvance = 5000,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const goToNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToIndex = (index: number) => {
    setActiveIndex(index)
  }

  // Auto-advance effect
  React.useEffect(() => {
    if (autoAdvance > 0) {
      const interval = setInterval(goToNext, autoAdvance)
      return () => clearInterval(interval)
    }
  }, [autoAdvance, goToNext])

  const activeTestimonial = testimonials[activeIndex]

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <EnhancedCard className="!p-8 md:!p-12">
            <div className="space-y-8">
              {/* Rating */}
              {activeTestimonial.rating && (
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < activeTestimonial.rating!
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-center leading-relaxed text-foreground">
                "{activeTestimonial.quote}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col items-center gap-4 pt-4">
                {activeTestimonial.avatar && (
                  <Avatar
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    fallback={activeTestimonial.name.charAt(0)}
                    size={64}
                  />
                )}
                <div className="text-center">
                  <div className="font-semibold text-lg text-foreground">
                    {activeTestimonial.name}
                  </div>
                  <div className="text-muted-foreground">
                    {activeTestimonial.title} at {activeTestimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </EnhancedCard>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-card border border-border hover:bg-accent transition-colors flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-card border border-border hover:bg-accent transition-colors flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-primary w-8'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
