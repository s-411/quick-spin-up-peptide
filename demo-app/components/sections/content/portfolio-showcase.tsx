'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

export interface Project {
  /** Project title */
  title: string
  /** Project description (longer for showcase) */
  description: string
  /** Project thumbnail URL */
  thumbnail: string
  /** Project category */
  category: string
  /** Technologies used */
  tags?: string[]
  /** Project URL */
  href: string
  /** Client/Company name */
  client?: string
}

export interface PortfolioShowcaseProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of projects */
  projects: Project[]
}

export function PortfolioShowcase({
  title = 'Case Studies',
  description = 'Detailed look at our best work',
  projects,
}: PortfolioShowcaseProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-16">
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

        {/* Projects Showcase */}
        <div className="space-y-24">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0

            return (
              <div key={index} className="group">
                <EnhancedCard className="!p-0 overflow-hidden">
                  <div className={`grid md:grid-cols-2 gap-0 ${!isEven ? 'md:grid-flow-col-dense' : ''}`}>
                    {/* Image */}
                    <div className={`relative aspect-[4/3] overflow-hidden ${!isEven ? 'md:col-start-2' : ''}`}>
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
                      {/* Category & Client */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                          {project.category}
                        </span>
                        {project.client && (
                          <span className="text-sm text-muted-foreground">
                            for {project.client}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl font-heading mb-4 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground mb-6 leading-relaxed">
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
