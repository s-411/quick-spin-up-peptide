'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

export interface Project {
  /** Project title */
  title: string
  /** Project description */
  description: string
  /** Project thumbnail URL */
  thumbnail: string
  /** Project category */
  category: string
  /** Technologies used */
  tags?: string[]
  /** Project URL */
  href: string
}

export interface PortfolioCarouselProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of projects */
  projects: Project[]
  /** Auto-play carousel */
  autoPlay?: boolean
  /** Auto-play interval in ms */
  interval?: number
}

export function PortfolioCarousel({
  title = 'Featured Projects',
  description,
  projects,
  autoPlay = false,
  interval = 5000,
}: PortfolioCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-play
  React.useEffect(() => {
    if (!autoPlay || !emblaApi) return
    const intervalId = setInterval(() => {
      emblaApi.scrollNext()
    }, interval)
    return () => clearInterval(intervalId)
  }, [autoPlay, interval, emblaApi])

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

        {/* Carousel Container */}
        <div className="relative">
          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 px-2"
                >
                  <EnhancedCard className="!p-0 overflow-hidden group">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Project Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <a
                          href={project.href}
                          className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = project.href
                          }}
                        >
                          <ExternalLink className="w-12 h-12 text-primary-foreground" />
                        </a>
                      </div>

                      {/* Content */}
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        {/* Category */}
                        <div className="mb-4">
                          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                            {project.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl font-heading mb-4">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6">
                          {project.description}
                        </p>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 text-sm rounded-full bg-muted text-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        <div>
                          <a
                            href={project.href}
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                          >
                            View Project
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </EnhancedCard>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
