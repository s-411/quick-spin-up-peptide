'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { LucideIcon } from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export interface FeatureGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of features */
  features: Feature[]
  /** Grid columns */
  columns?: 2 | 3 | 4
}

export function FeatureGrid({
  title = 'Everything You Need',
  description = 'All the tools and components to build amazing products',
  features,
  columns = 3,
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
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

        {/* Features Grid */}
        <div className={`grid gap-6 ${gridCols[columns]}`}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <EnhancedCard
                key={index}
                className="group !p-6"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-heading">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </EnhancedCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
