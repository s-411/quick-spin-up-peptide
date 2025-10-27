'use client'

import * as React from 'react'
import { LucideIcon, Check } from 'lucide-react'

export interface ListFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface FeatureListProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of features */
  features: ListFeature[]
  /** Use checkmarks instead of icons */
  useCheckmarks?: boolean
  /** Layout: single column or two columns */
  columns?: 1 | 2
}

export function FeatureList({
  title = 'Why Choose Us',
  description = 'Everything you need to succeed',
  features,
  useCheckmarks = false,
  columns = 1,
}: FeatureListProps) {
  const gridClass = columns === 2 ? 'md:grid-cols-2' : ''

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Features List */}
        <div className={`grid gap-8 ${gridClass}`}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-card border border-border hover:border-primary/30 transition-colors bg-card/50"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {useCheckmarks ? (
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
