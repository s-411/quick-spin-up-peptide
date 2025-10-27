'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

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

export interface PortfolioGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of projects */
  projects: Project[]
  /** Grid columns */
  columns?: 2 | 3
  /** Show category filters */
  showFilters?: boolean
}

export function PortfolioGrid({
  title = 'Our Work',
  description = 'Featured projects and case studies',
  projects,
  columns = 3,
  showFilters = true,
}: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All')

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

  // Filter projects
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

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

        {/* Filters */}
        {showFilters && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
          {filteredProjects.map((project, index) => (
            <EnhancedCard
              key={index}
              className="!p-0 overflow-hidden group cursor-pointer"
              onClick={() => window.location.href = project.href}
            >
              {/* Project Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="mb-2">
                  <span className="text-xs font-semibold text-primary">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </EnhancedCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
