'use client'

import * as React from 'react'

export interface Milestone {
  /** Year */
  year: string
  /** Main stat/achievement */
  stat: string
  /** Description */
  description: string
  /** Icon or metric label */
  label?: string
}

export interface StatsTimelineProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of milestones */
  milestones: Milestone[]
}

export function StatsTimeline({
  title = 'Our Journey',
  description = 'Key milestones and achievements over the years',
  milestones,
}: StatsTimelineProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />

          {/* Milestones */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Year Marker */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center z-10 border-4 border-background">
                    <span className="text-sm font-bold text-primary-foreground">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pl-24 md:pl-0 md:w-1/2">
                    <div
                      className={`p-6 rounded-card bg-card border border-border ${
                        isEven ? 'md:mr-12' : 'md:ml-12'
                      }`}
                    >
                      {/* Label */}
                      {milestone.label && (
                        <div className="text-sm text-primary font-semibold mb-2">
                          {milestone.label}
                        </div>
                      )}

                      {/* Stat */}
                      <div className="text-3xl font-heading mb-3 text-primary">
                        {milestone.stat}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
